// src/components/chat/ChatMessageItem.tsx
import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Shield 
} from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { FileAttachmentCard } from './FileAttachmentCard';
import { AudioMessagePlayer } from './AudioMessagePlayer';

interface ChatMessageItemProps {
  message: ChatMessage;
  onImageClick?: (url: string) => void;
  onActionClick?: (action: string, type?: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onImageClick,
  onActionClick
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`group flex gap-3 sm:gap-4 px-3 sm:px-6 py-4 transition-colors ${
        isUser
          ? 'bg-transparent justify-end'
          : 'bg-muted/30 dark:bg-slate-900/40 justify-start border-y border-border/40'
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-primary/20">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Content Body */}
      <div className={`flex flex-col gap-2 max-w-full sm:max-w-2xl md:max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Name / Role Header */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground/80">
            {isUser ? 'You' : 'Arya • ISI Operations Consultant'}
          </span>
          <span>•</span>
          <span>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Bubble Text */}
        {message.content && (
          <div
            className={`rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
              isUser
                ? 'p-3.5 sm:p-4 bg-primary text-primary-foreground rounded-tr-sm shadow-sm font-normal'
                : 'text-foreground/95 select-text'
            }`}
          >
            {message.content}
          </div>
        )}

        {/* 1. Attached Images Grid */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-1">
            {message.attachments.map((att) => (
              <div
                key={att.id || att.file_url}
                onClick={() => onImageClick?.(att.file_url)}
                className="group/img relative rounded-xl overflow-hidden border border-border/70 shadow-sm max-w-[220px] max-h-[180px] bg-card cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={att.file_url}
                  alt={att.file_name || 'Screenshot'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
                  Click to Expand
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Uploaded General Files (PDF, DOCX, etc.) */}
        {message.uploaded_files && message.uploaded_files.length > 0 && (
          <div className="flex flex-col gap-2 mt-1 w-full max-w-md">
            {message.uploaded_files.map((file) => (
              <FileAttachmentCard
                key={file.id || file.file_url}
                fileName={file.file_name}
                fileSize={file.file_size}
                fileType={file.file_type}
                fileUrl={file.file_url}
              />
            ))}
          </div>
        )}

        {/* 3. Voice Messages (Audio Player) */}
        {message.voice_messages && message.voice_messages.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {message.voice_messages.map((voice) => (
              <AudioMessagePlayer
                key={voice.id || voice.audio_url}
                audioUrl={voice.audio_url}
                duration={voice.duration}
                isUser={isUser}
              />
            ))}
          </div>
        )}

        {/* 4. Action Buttons / Quick Replies */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 pt-1">
            {message.actions.map((act, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onActionClick?.(act.action, act.type)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground hover:text-primary text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <span>{act.label}</span>
                {act.type === 'link' && <ExternalLink className="w-3 h-3 opacity-60" />}
              </button>
            ))}
          </div>
        )}

        {/* Message Utilities: Copy Button */}
        {!isUser && message.content && (
          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground p-1 rounded transition-colors cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-border/80">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
