// src/components/chat/GroqKeyModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Zap, Key, Check, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { getActiveGroqApiKey, setActiveGroqApiKey } from '../../services/groqService';
import { toast } from 'sonner';

interface GroqKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroqKeyModal: React.FC<GroqKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getActiveGroqApiKey();
      setApiKey(current);
      setIsSaved(!!current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();

    if (cleanKey && !cleanKey.startsWith('gsk_')) {
      toast.error('Invalid key format. Groq API keys typically begin with "gsk_".');
      return;
    }

    setActiveGroqApiKey(cleanKey);
    setIsSaved(!!cleanKey);

    if (cleanKey) {
      toast.success('Groq API Key saved successfully! Fast LPU inference is active.');
    } else {
      toast.info('Groq API Key removed. Using default security intelligence engine.');
    }

    onClose();
  };

  const handleRemove = () => {
    setActiveGroqApiKey('');
    setApiKey('');
    setIsSaved(false);
    toast.info('Groq API Key cleared.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>Groq AI Settings</span>
              {isSaved && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              Ultra-fast LPU inference powered by Llama 3.3 70B & 3.1 8B.
            </p>
          </div>
        </div>

        {/* Informational banner */}
        <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/60 text-xs text-foreground space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">
              Groq provides <strong className="text-foreground">100% free API access</strong> with ultra-low latency inference.
            </p>
          </div>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold ml-6"
          >
            <span>Get your free Groq API key here</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Key Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Groq API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="gsk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Key is securely stored in your browser session or environment.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {isSaved && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2.5 rounded-xl border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="Remove Key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Activate Groq AI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
