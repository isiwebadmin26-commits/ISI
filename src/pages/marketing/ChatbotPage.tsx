// src/pages/marketing/ChatbotPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import {
  fetchMessages,
  insertMessage,
  generateAIResponse
} from '@/services/chatService';
import {
  uploadImageAttachment,
  uploadGeneralFile,
  uploadVoiceRecording
} from '@/services/storageService';
import { ChatMessage } from '@/types/chat';

// Subcomponents
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import { ChatInputBar } from '@/components/chat/ChatInputBar';
import { LightboxModal } from '@/components/chat/LightboxModal';
import { AuthModal } from '@/components/chat/AuthModal';
import { Shield, Sparkles, MessageSquare, Bot, Calendar, PhoneCall, ArrowRight } from 'lucide-react';

const WELCOME_SUGGESTIONS = [
  {
    icon: '🛡️',
    title: 'Enterprise Manned Guarding',
    desc: 'PSARA-certified security personnel deployment across 18+ Indian states',
    prompt: 'Tell me about your PSARA-certified manned guarding services and guard training standards.'
  },
  {
    icon: '📹',
    title: 'C4i Command Center',
    desc: 'Real-time video analytics, automatic intrusion alerts, & remote SOC operations',
    prompt: 'How does your 24/7 remote C4i command center surveillance work?'
  },
  {
    icon: '🏢',
    title: 'Integrated Facility Management',
    desc: 'End-to-end technical maintenance, electromechanical systems, & housekeeping',
    prompt: 'What integrated facility management (IFM) packages do you provide for corporate tech parks?'
  },
  {
    icon: '⚡',
    title: 'Instant 60s Security Quote',
    desc: 'Rapid manpower and surveillance cost estimate tailored for your campus',
    prompt: 'I want an instant security quote for our facility location.'
  }
];

export const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || null;

  // Chat History Hook
  const {
    conversations,
    grouped,
    searchQuery,
    setSearchQuery,
    createConversation,
    renameConversation,
    togglePin,
    deleteConversation
  } = useChatHistory(userId);

  // Active Conversation State
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // UI Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    tracker.track('page_view', { pageTitle: 'ISI Security Consultant | Operations Chat' });
  }, []);

  // When conversations load or change, select first or stay on active
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    setIsLoadingMessages(true);

    fetchMessages(activeConversationId)
      .then((loaded) => {
        if (isMounted) {
          setMessages(loaded);
          setTimeout(() => scrollToBottom('auto'), 100);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Handler: Start New Chat
  const handleNewChat = async () => {
    try {
      const newConv = await createConversation('New Security Consultation');
      if (newConv) {
        setActiveConversationId(newConv.id);
        setMessages([]);
        toast.success('Started new consultation');
      }
    } catch {
      toast.error('Failed to create new conversation');
    }
  };

  // Handler: Send Message (Text + Images + Files + Voice)
  const handleSendMessage = async (
    text: string,
    images: File[],
    files: File[],
    voiceBlob?: Blob,
    voiceDuration?: number
  ) => {
    let convId = activeConversationId;

    // Auto-create conversation if none exists
    if (!convId) {
      const newTitle = text.slice(0, 36) || (images.length > 0 ? 'Image Consultation' : 'Voice Consultation');
      const created = await createConversation(newTitle);
      if (!created) {
        toast.error('Could not initiate conversation session.');
        return;
      }
      convId = created.id;
      setActiveConversationId(convId);
    }

    setIsGenerating(true);

    try {
      // 1. Upload Images to Supabase Storage
      const uploadedAttachments: Array<{ url: string; type: string; name?: string; size?: number }> = [];
      for (const img of images) {
        const res = await uploadImageAttachment(img, convId, userId);
        if (res.url) {
          uploadedAttachments.push({
            url: res.url,
            type: img.type || 'image/webp',
            name: img.name,
            size: img.size
          });
        }
      }

      // 2. Upload General Files to Supabase Storage
      const uploadedFilesList: Array<{ url: string; name: string; size: number; type: string }> = [];
      for (const file of files) {
        const res = await uploadGeneralFile(file, convId, userId);
        if (res.url) {
          uploadedFilesList.push({
            url: res.url,
            name: res.name,
            size: res.size,
            type: res.type
          });
        }
      }

      // 3. Upload Voice Recording to Supabase Storage
      let uploadedVoice: { url: string; duration: number } | undefined = undefined;
      if (voiceBlob) {
        const res = await uploadVoiceRecording(voiceBlob, convId, userId);
        if (res.url) {
          uploadedVoice = {
            url: res.url,
            duration: voiceDuration || 0
          };
        }
      }

      // 4. Save User Message into Supabase Database
      const userContent = text || (uploadedVoice ? '🎤 [Voice Message]' : (images.length > 0 ? '📷 [Screenshot Attached]' : '📁 [Document Attached]'));
      const savedUserMsg = await insertMessage(
        convId,
        'user',
        userContent,
        userId,
        {
          attachments: uploadedAttachments,
          files: uploadedFilesList,
          voice: uploadedVoice
        }
      );

      if (savedUserMsg) {
        setMessages((prev) => [...prev, savedUserMsg]);
      }

      // Auto-rename conversation if first message and title was default
      const currentConv = conversations.find((c) => c.id === convId);
      if (currentConv && currentConv.title === 'New Security Consultation' && text.trim()) {
        const autoTitle = text.slice(0, 34).trim();
        renameConversation(convId, autoTitle);
      }

      // 5. Generate AI Response (Arya - Groq LPU / Specialized Engine)
      const messageHistory = messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const aiResult = await generateAIResponse(
        text,
        uploadedAttachments.length > 0,
        uploadedFilesList.length > 0,
        !!uploadedVoice,
        messageHistory
      );

      // Simulate human-like thinking delay
      await new Promise((r) => setTimeout(r, 650));

      // 6. Save Assistant Message into Supabase Database
      const savedAiMsg = await insertMessage(
        convId,
        'assistant',
        aiResult.text,
        userId
      );

      if (savedAiMsg) {
        savedAiMsg.actions = aiResult.actions;
        setMessages((prev) => [...prev, savedAiMsg]);
      }

      tracker.track('chat_message_sent', {
        leadType: 'chatbot',
        metadata: {
          hasText: !!text,
          hasImages: uploadedAttachments.length > 0,
          hasFiles: uploadedFilesList.length > 0,
          hasVoice: !!uploadedVoice
        }
      });
    } catch (err: any) {
      console.warn('[CHAT SEND ERROR]', err);
      toast.error('Could not complete message delivery. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Action button click inside message bubble
  const handleActionClick = (action: string, type?: string) => {
    if (action.startsWith('http') || action.startsWith('/') || action.startsWith('tel:')) {
      if (action.startsWith('http')) {
        window.open(action, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = action;
      }
    } else {
      handleSendMessage(action, [], []);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <>
      <SEO
        title="ISI Security Consultant | Arya - Enterprise Security & Facility Operations"
        description="Connect with Arya, ISI Security's Operations Consultant. Ask about PSARA-certified manned guarding, C4i command centers, and integrated facility management."
        canonical="https://www.isisecurity.in/chat"
      />

      {/* Main ChatGPT-style Shell Layout */}
      <div className="flex h-screen w-full bg-background overflow-hidden text-foreground antialiased selection:bg-primary/20">

        {/* 1. Left Responsive Sidebar */}
        <ChatSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          conversations={conversations}
          grouped={grouped}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => setActiveConversationId(id)}
          onNewChat={handleNewChat}
          onRename={renameConversation}
          onTogglePin={togglePin}
          onDelete={deleteConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* 2. Main Chat Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-background relative overflow-hidden">

          {/* Top Header */}
          <ChatHeader
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            title={activeConv?.title || 'New Security Consultation'}
            isPinned={activeConv?.pinned || false}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">

            {/* If empty consultation, show Welcome Hero with suggestion prompt pills */}
            {messages.length === 0 && !isLoadingMessages ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4 shadow-sm">
                  <Shield className="w-8 h-8" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Welcome to ISI Security Consultant
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mb-8 leading-relaxed">
                  I am <strong>Arya</strong>, your 24/7 Enterprise Security & Facility Operations Consultant. You can type inquiries, paste floor plan screenshots (Ctrl+V), upload tender specs, or record voice messages.
                </p>

                {/* Grid of prompt suggestion cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                  {WELCOME_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt, [], [])}
                      className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:bg-muted/40 transition-all text-left shadow-xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message List */
              <div className="flex-1 pb-4">
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    onImageClick={(url) => setLightboxUrl(url)}
                    onActionClick={handleActionClick}
                  />
                ))}

                {/* Typing / Generating Indicator */}
                {isGenerating && (
                  <div className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-muted/20 text-muted-foreground text-xs animate-in fade-in">
                    <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>Arya is analyzing security parameters...</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Multiline Toolbar */}
          <div className="border-t border-border/50 bg-background/90 backdrop-blur-md shrink-0">
            <ChatInputBar
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>

      {/* Lightbox Image Viewer */}
      <LightboxModal
        isOpen={!!lightboxUrl}
        imageUrl={lightboxUrl || ''}
        onClose={() => setLightboxUrl(null)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default ChatbotPage;
