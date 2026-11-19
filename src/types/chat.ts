// src/types/chat.ts

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Conversation {
  id: string;
  user_id?: string | null;
  title: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  conversation_id: string;
  message_id?: string | null;
  user_id?: string | null;
  file_url: string;
  file_type: string;
  file_name?: string | null;
  file_size?: number | null;
  uploaded_at: string;
}

export interface UploadedFile {
  id: string;
  user_id?: string | null;
  conversation_id: string;
  message_id?: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
}

export interface VoiceMessage {
  id: string;
  user_id?: string | null;
  conversation_id: string;
  message_id?: string | null;
  audio_url: string;
  duration: number; // in seconds
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  attachments?: Attachment[];
  uploaded_files?: UploadedFile[];
  voice_messages?: VoiceMessage[];
  actions?: Array<{
    label: string;
    action: string;
    type?: 'reply' | 'link' | 'modal';
  }>;
}

export type TimeGroupKey = 'Pinned' | 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Older';

export interface GroupedConversations {
  pinned: Conversation[];
  today: Conversation[];
  yesterday: Conversation[];
  last7Days: Conversation[];
  last30Days: Conversation[];
  older: Conversation[];
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  avatarUrl?: string;
}
