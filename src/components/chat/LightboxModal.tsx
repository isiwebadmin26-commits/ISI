// src/components/chat/LightboxModal.tsx
import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, ExternalLink } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt?: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  imageUrl,
  imageAlt = 'Attachment Preview',
  onClose
}) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      setScale(1);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setScale((s) => Math.min(s + 0.25, 3))}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <a
          href={imageUrl}
          download="attachment"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Open or Download"
        >
          <Download className="w-5 h-5" />
        </a>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-all cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image container */}
      <div 
        className="max-w-[90vw] max-h-[85vh] overflow-auto flex items-center justify-center p-4 cursor-zoom-out"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          style={{ transform: `scale(${scale})`, transition: 'transform 0.15s ease' }}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl cursor-default select-none"
        />
      </div>
    </div>
  );
};
