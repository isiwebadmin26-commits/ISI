// src/components/chat/ChatHeader.tsx
import React from 'react';
import { 
  Menu, 
  Shield, 
  Calendar, 
  MessageCircle, 
  PhoneCall, 
  Pin, 
  Trash2, 
  LogIn, 
  User 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  title: string;
  isPinned: boolean;
  onClearChat?: () => void;
  onOpenAuth: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleSidebar,
  title,
  isPinned,
  onClearChat,
  onOpenAuth
}) => {
  const { user, profile } = useAuth();

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-5 border-b border-border/80 bg-background/80 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 z-20">
      {/* Left: Sidebar toggle + Conversation Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          title="Toggle chat history sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[170px] sm:max-w-xs md:max-w-md">
              {title}
            </h1>
            {isPinned && <Pin className="w-3 h-3 text-primary rotate-45 shrink-0" />}
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Arya • Senior Security & Facility Operations Consultant</span>
          </p>
        </div>
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <a
          href="/booking"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Call</span>
        </a>

        <a
          href="https://wa.me/917708887878?text=Hello!%20I%20am%20chatting%20with%20Arya%20and%20would%20like%20to%20connect%20with%20a%20security%20director%20directly."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs transition-colors"
          title="Escalate directly to WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">WhatsApp</span>
        </a>

        {/* User Account / Sign In */}
        {user ? (
          <div 
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity ml-1"
            title={user.email || 'Account'}
          >
            {profile?.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="py-1.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors cursor-pointer ml-1"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
