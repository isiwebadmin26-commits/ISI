// src/components/chat/ImageAttachmentPreview.tsx
import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface ImageAttachmentPreviewProps {
  images: PendingImage[];
  onRemove: (id: string) => void;
  onImageClick?: (url: string) => void;
}

export const ImageAttachmentPreview: React.FC<ImageAttachmentPreviewProps> = ({
  images,
  onRemove,
  onImageClick
}) => {
  if (images.length === 0) return null;

  return (
    <div className="flex items-center gap-2.5 p-2 px-3 overflow-x-auto bg-muted/40 dark:bg-slate-900/40 rounded-xl border border-border/50">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative group shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border/70 bg-card shadow-sm"
        >
          <img
            src={img.previewUrl}
            alt={img.file.name}
            onClick={() => onImageClick?.(img.previewUrl)}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(img.id);
            }}
            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
