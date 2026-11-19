// src/components/chat/ChatSidebar.tsx
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Pin, 
  PinOff, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  X, 
  LogIn, 
  LogOut, 
  Shield, 
  User, 
  ChevronRight,
  Check,
  Sparkles
} from 'lucide-react';
import { Conversation, GroupedConversations } from '../../types/chat';
import { useAuth } from '../../contexts/AuthContext';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  grouped: GroupedConversations;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, newTitle: string) => void;
  onTogglePin: (id: string, currentPinned: boolean) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAuth: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  grouped,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRename,
  onTogglePin,
  onDelete,
  searchQuery,
  onSearchChange,
  onOpenAuth
}) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
    setActiveMenuId(null);
  };

  const saveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingTitle.trim()) {
      onRename(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const renderConversationGroup = (title: string, list: Conversation[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="px-3 mb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
        <div className="space-y-0.5">
          {list.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isEditing = editingId === conv.id;
            const isMenuOpen = activeMenuId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  // On mobile, close sidebar on selection
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/20'
                    : 'text-foreground/80 hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                {/* Pin / Message Icon */}
                {conv.pinned ? (
                  <Pin className="w-3.5 h-3.5 text-primary shrink-0 rotate-45" />
                ) : (
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
                )}

                {/* Conversation Title or Edit Form */}
                {isEditing ? (
                  <form
                    onSubmit={(e) => saveRename(conv.id, e)}
                    className="flex-1 flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => saveRename(conv.id)}
                      className="w-full px-2 py-0.5 text-xs bg-background border border-primary/50 rounded-md focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded hover:bg-primary/10 text-primary"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <span className="flex-1 truncate select-none text-left" title={conv.title}>
                    {conv.title}
                  </span>
                )}

                {/* 3-dots action menu */}
                {!isEditing && (
                  <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : conv.id)}
                      className={`p-1 rounded-md text-muted-foreground hover:text-foreground transition-opacity ${
                        isMenuOpen ? 'opacity-100 bg-muted' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      title="Options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 z-30 w-36 py-1 bg-card border border-border/90 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(conv.id, conv.pinned);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          {conv.pinned ? (
                            <>
                              <PinOff className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>Unpin</span>
                            </>
                          ) : (
                            <>
                              <Pin className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>Pin Chat</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => startRename(conv, e)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Rename</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(conv.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 sm:w-80 h-full bg-card/95 dark:bg-slate-950/95 lg:bg-muted/30 dark:lg:bg-slate-950/50 border-r border-border/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header: Brand + New Chat */}
        <div className="p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-tight flex items-center gap-1.5">
                <span>ISI AI Chat</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-mono font-semibold">
                  PRO
                </span>
              </h2>
              <p className="text-[10px] text-muted-foreground">Security & Facility Operations</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground lg:hidden cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Search Input with Debounce */}
        <div className="px-3 mb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-muted/50 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Conversation List Grouped by Time */}
        <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin">
          {renderConversationGroup('📌 Pinned', grouped.pinned)}
          {renderConversationGroup('Today', grouped.today)}
          {renderConversationGroup('Yesterday', grouped.yesterday)}
          {renderConversationGroup('Previous 7 Days', grouped.last7Days)}
          {renderConversationGroup('Previous 30 Days', grouped.last30Days)}
          {renderConversationGroup('Older', grouped.older)}

          {grouped.pinned.length === 0 &&
            grouped.today.length === 0 &&
            grouped.yesterday.length === 0 &&
            grouped.last7Days.length === 0 &&
            grouped.last30Days.length === 0 &&
            grouped.older.length === 0 && (
              <div className="py-8 px-4 text-center text-xs text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No conversations found</p>
                <button
                  type="button"
                  onClick={onNewChat}
                  className="mt-2 text-primary font-medium hover:underline text-[11px] cursor-pointer"
                >
                  Start a new chat
                </button>
              </div>
            )}
        </div>

        {/* Bottom User / Auth Profile Footer */}
        <div className="p-3 border-t border-border/60 bg-muted/20">
          {user ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-background border border-border/70 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                  {profile?.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                      {profile?.fullName || user.email?.split('@')[0]}
                    </p>
                    {isAdmin && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={signOut}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1 text-muted-foreground">
                <span>Guest Mode</span>
                <span className="text-[10px] text-emerald-500 font-medium">● Local storage</span>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border/80 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-primary" />
                <span>Sign In to Sync History</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
