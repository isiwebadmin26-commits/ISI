// src/services/storageService.ts
import { supabase } from './supabaseService';

export const BUCKETS = {
  ATTACHMENTS: 'chat-attachments',
  FILES: 'chat-files',
  VOICE: 'chat-voice'
} as const;

export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
];

/**
 * Validates file size and MIME type.
 */
export function validateFile(file: File, options?: FileValidationOptions): { valid: boolean; error?: string } {
  const maxSize = (options?.maxSizeMB || 25) * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds the limit of ${options?.maxSizeMB || 25} MB.` };
  }

  const allowed = options?.allowedTypes || ALLOWED_DOC_TYPES;
  if (allowed.length > 0 && !allowed.includes(file.type)) {
    // Check extension fallback if MIME type is missing
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'webp', 'gif'];
    if (!ext || !allowedExts.includes(ext)) {
      return { valid: false, error: `File type ${file.type || ext} is not supported.` };
    }
  }

  return { valid: true };
}

/**
 * Compresses an image file client-side using an offscreen HTMLCanvasElement.
 */
export async function compressImage(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    // If not an image or SVG, return original
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads an image screenshot or attachment to Supabase Storage.
 */
export async function uploadImageAttachment(
  file: File,
  conversationId: string,
  userId?: string | null
): Promise<{ url: string; error?: string }> {
  try {
    const compressedBlob = await compressImage(file);
    const ext = file.type.includes('png') ? 'png' : 'webp';
    const fileName = `${userId || 'guest'}/${conversationId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.ATTACHMENTS)
      .upload(fileName, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('[STORAGE ATTACHMENT NOTICE]', uploadError.message);
      // Fallback to data URL if storage upload failed
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result as string });
        reader.onerror = () => resolve({ url: '', error: uploadError.message });
        reader.readAsDataURL(compressedBlob);
      });
    }

    const { data } = supabase.storage.from(BUCKETS.ATTACHMENTS).getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err: any) {
    console.warn('[STORAGE ATTACHMENT EXCEPTION]', err?.message || err);
    return { url: '', error: err?.message || 'Upload failed' };
  }
}

/**
 * Uploads a document or general file (PDF, DOCX, CSV, etc.) to Supabase Storage.
 */
export async function uploadGeneralFile(
  file: File,
  conversationId: string,
  userId?: string | null
): Promise<{ url: string; name: string; size: number; type: string; error?: string }> {
  try {
    const val = validateFile(file);
    if (!val.valid) {
      return { url: '', name: file.name, size: file.size, type: file.type, error: val.error };
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${userId || 'guest'}/${conversationId}/${Date.now()}_${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.FILES)
      .upload(path, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('[STORAGE FILE NOTICE]', uploadError.message);
      return { url: '', name: file.name, size: file.size, type: file.type, error: uploadError.message };
    }

    const { data } = supabase.storage.from(BUCKETS.FILES).getPublicUrl(path);
    return {
      url: data.publicUrl,
      name: file.name,
      size: file.size,
      type: file.type
    };
  } catch (err: any) {
    console.warn('[STORAGE FILE EXCEPTION]', err?.message || err);
    return { url: '', name: file.name, size: file.size, type: file.type, error: err?.message || 'File upload failed' };
  }
}

/**
 * Uploads an audio voice recording to Supabase Storage.
 */
export async function uploadVoiceRecording(
  audioBlob: Blob,
  conversationId: string,
  userId?: string | null
): Promise<{ url: string; error?: string }> {
  try {
    const ext = audioBlob.type.includes('mp4') ? 'm4a' : (audioBlob.type.includes('wav') ? 'wav' : 'webm');
    const path = `${userId || 'guest'}/${conversationId}/${Date.now()}_voice.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.VOICE)
      .upload(path, audioBlob, {
        contentType: audioBlob.type || 'audio/webm',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('[STORAGE VOICE NOTICE]', uploadError.message);
      // Fallback: return data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result as string });
        reader.onerror = () => resolve({ url: '', error: uploadError.message });
        reader.readAsDataURL(audioBlob);
      });
    }

    const { data } = supabase.storage.from(BUCKETS.VOICE).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err: any) {
    console.warn('[STORAGE VOICE EXCEPTION]', err?.message || err);
    return { url: '', error: err?.message || 'Voice upload failed' };
  }
}
