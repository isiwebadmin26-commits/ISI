// src/components/chat/ChatInputBar.tsx
import React, { useRef, useState, useEffect } from 'react';
import { 
  Paperclip, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  FileUp, 
  X, 
  Plus,
  Loader2
} from 'lucide-react';
import { ImageAttachmentPreview, PendingImage } from './ImageAttachmentPreview';
import { FileAttachmentCard } from './FileAttachmentCard';
import { VoiceRecorder } from './VoiceRecorder';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { toast } from 'sonner';

export interface PendingDocument {
  id: string;
  file: File;
}

interface ChatInputBarProps {
  onSendMessage: (
    text: string,
    images: File[],
    files: File[],
    voiceBlob?: Blob,
    voiceDuration?: number
  ) => Promise<void>;
  isGenerating?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isGenerating = false
}) => {
  const [text, setText] = useState('');
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Voice recorder hook
  const voice = useVoiceRecorder();

  // Auto-resize textarea up to 200px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [text]);

  // Ctrl + V Paste Image Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            addPendingImage(file);
            toast.info('Screenshot pasted from clipboard!');
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const addPendingImage = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image exceeds 15 MB limit');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPendingImages((prev) => [
      ...prev,
      { id: `${Date.now()}_${Math.random()}`, file, previewUrl }
    ]);
  };

  const addPendingFile = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      toast.error('Document exceeds 25 MB limit');
      return;
    }
    // If it's an image, route to image preview
    if (file.type.startsWith('image/')) {
      addPendingImage(file);
      return;
    }
    setPendingFiles((prev) => [
      ...prev,
      { id: `${Date.now()}_${Math.random()}`, file }
    ]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(addPendingImage);
    }
    e.target.value = '';
    setShowAttachMenu(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(addPendingFile);
    }
    e.target.value = '';
    setShowAttachMenu(false);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          addPendingImage(file);
        } else {
          addPendingFile(file);
        }
      });
      toast.info('File dropped and attached!');
    }
  };

  const removeImage = (id: string) => {
    setPendingImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const removeFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = async () => {
    if (isGenerating) return;

    const trimmedText = text.trim();
    const imagesToSend = pendingImages.map((i) => i.file);
    const filesToSend = pendingFiles.map((f) => f.file);

    if (!trimmedText && imagesToSend.length === 0 && filesToSend.length === 0) {
      return;
    }

    // Clear state
    setText('');
    setPendingImages([]);
    setPendingFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    await onSendMessage(trimmedText, imagesToSend, filesToSend);
  };

  const handleVoiceSend = async () => {
    if (voice.audioBlob) {
      await onSendMessage(
        text.trim(),
        [],
        [],
        voice.audioBlob,
        voice.recordingTime
      );
      voice.resetRecording();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-3 sm:p-4 max-w-4xl mx-auto w-full transition-all ${
        isDragging ? 'bg-primary/5 rounded-3xl border-2 border-dashed border-primary' : ''
      }`}
    >
      {/* Active Voice Recorder Mode */}
      {voice.isRecording || voice.audioUrl ? (
        <VoiceRecorder
          isRecording={voice.isRecording}
          recordingTime={voice.recordingTime}
          frequencyData={voice.frequencyData}
          audioUrl={voice.audioUrl}
          onStop={voice.stopRecording}
          onCancel={voice.cancelRecording}
          onSend={handleVoiceSend}
        />
      ) : (
        /* Regular Multiline Input Toolbar */
        <div className="bg-card border border-border/80 rounded-3xl shadow-lg hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 transition-all overflow-hidden">
          
          {/* Pending Previews (Images + Documents) */}
          {(pendingImages.length > 0 || pendingFiles.length > 0) && (
            <div className="p-3 border-b border-border/50 flex flex-col gap-2.5 bg-muted/20">
              {pendingImages.length > 0 && (
                <ImageAttachmentPreview
                  images={pendingImages}
                  onRemove={removeImage}
                />
              )}

              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pendingFiles.map((pf) => (
                    <FileAttachmentCard
                      key={pf.id}
                      fileName={pf.file.name}
                      fileSize={pf.file.size}
                      fileType={pf.file.type}
                      isRemovable
                      onRemove={() => removeFile(pf.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input Textarea Area */}
          <div className="flex items-end gap-2 p-2.5 sm:p-3">
            
            {/* Attachment Button & Popup Menu */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowAttachMenu((prev) => !prev)}
                className="p-2 sm:p-2.5 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Attach image or file"
              >
                <Plus className={`w-5 h-5 transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} />
              </button>

              {/* Attach Dropdown Menu */}
              {showAttachMenu && (
                <div className="absolute left-0 bottom-full mb-2 z-30 w-48 p-1.5 bg-card border border-border rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-muted text-foreground transition-colors cursor-pointer text-left"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                    <span>Upload Image / Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-muted text-foreground transition-colors cursor-pointer text-left"
                  >
                    <FileUp className="w-4 h-4 text-blue-500" />
                    <span>Upload Document (PDF/DOC)</span>
                  </button>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Auto-growing Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Arya about manned guarding, C4i AI command center, paste screenshots (Ctrl+V)..."
              className="flex-1 max-h-44 py-2 sm:py-2.5 bg-transparent resize-none border-0 text-xs sm:text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none scrollbar-thin"
            />

            {/* Right Buttons: Voice Recording or Send */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Mic Button: Click to start WhatsApp-style voice recording */}
              {!text.trim() && pendingImages.length === 0 && pendingFiles.length === 0 ? (
                <button
                  type="button"
                  onClick={voice.startRecording}
                  className="p-2 sm:p-2.5 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  title="Record voice message (WhatsApp style)"
                >
                  <Mic className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isGenerating}
                  className="p-2 sm:p-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer disabled:opacity-50"
                  title="Send message"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtext info */}
      <p className="text-[11px] text-center text-muted-foreground/70 mt-2">
        Arya AI • PSARA Tier-1 certified consulting desk • Direct WhatsApp escalation: <a href="https://wa.me/917708887878" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">+91 77088 87878</a>
      </p>
    </div>
  );
};
