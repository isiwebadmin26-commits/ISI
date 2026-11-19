// src/services/chatService.ts
import { supabase } from './supabaseService';
import { Conversation, ChatMessage, GroupedConversations, Attachment, UploadedFile, VoiceMessage } from '../types/chat';

/**
 * Groups an array of conversations into ChatGPT-style time buckets.
 */
export function groupConversationsByDate(conversations: Conversation[]): GroupedConversations {
  const grouped: GroupedConversations = {
    pinned: [],
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    older: []
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = startOfToday - 30 * 24 * 60 * 60 * 1000;

  conversations.forEach((conv) => {
    if (conv.pinned) {
      grouped.pinned.push(conv);
      return;
    }

    const convTime = new Date(conv.updated_at || conv.created_at).getTime();

    if (convTime >= startOfToday) {
      grouped.today.push(conv);
    } else if (convTime >= startOfYesterday) {
      grouped.yesterday.push(conv);
    } else if (convTime >= sevenDaysAgo) {
      grouped.last7Days.push(conv);
    } else if (convTime >= thirtyDaysAgo) {
      grouped.last30Days.push(conv);
    } else {
      grouped.older.push(conv);
    }
  });

  return grouped;
}

/**
 * Fetches all conversations for the authenticated user or local guest.
 */
export async function fetchUserConversations(userId?: string | null): Promise<Conversation[]> {
  try {
    let query = supabase
      .from('conversations')
      .select('*')
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      // For guest visitors, retrieve guest conversations or fallback to local storage
      const localGuest = localStorage.getItem('isi_guest_conv_ids');
      if (localGuest) {
        try {
          const ids: string[] = JSON.parse(localGuest);
          if (ids.length > 0) {
            query = query.in('id', ids);
          } else {
            return [];
          }
        } catch {
          return [];
        }
      } else {
        return [];
      }
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[FETCH CONVERSATIONS ERROR]', error.message);
      return [];
    }

    return (data as Conversation[]) || [];
  } catch (err) {
    console.warn('[FETCH CONVERSATIONS EXCEPTION]', err);
    return [];
  }
}

/**
 * Creates a new conversation.
 */
export async function createConversation(
  title = 'New Security Consultation',
  userId?: string | null
): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: userId || null,
          title,
          pinned: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.warn('[CREATE CONVERSATION ERROR]', error.message);
      return null;
    }

    const conv = data as Conversation;

    // If guest, remember conversation ID locally
    if (!userId && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('isi_guest_conv_ids') || '[]';
        const ids = JSON.parse(raw);
        ids.unshift(conv.id);
        localStorage.setItem('isi_guest_conv_ids', JSON.stringify(ids.slice(0, 30)));
      } catch { /* ignore */ }
    }

    return conv;
  } catch (err) {
    console.warn('[CREATE CONVERSATION EXCEPTION]', err);
    return null;
  }
}

/**
 * Renames a conversation title.
 */
export async function updateConversationTitle(
  conversationId: string,
  newTitle: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ title: newTitle.trim(), updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Pins or unpins a conversation.
 */
export async function togglePinConversation(
  conversationId: string,
  currentPinned: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ pinned: !currentPinned, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Deletes a conversation and all its messages.
 */
export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    // Remove from local guest IDs if present
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('isi_guest_conv_ids') || '[]';
        const ids: string[] = JSON.parse(raw);
        const filtered = ids.filter((id) => id !== conversationId);
        localStorage.setItem('isi_guest_conv_ids', JSON.stringify(filtered));
      } catch { /* ignore */ }
    }

    return !error;
  } catch {
    return false;
  }
}

/**
 * Searches conversations by title.
 */
export async function searchConversations(
  queryText: string,
  userId?: string | null
): Promise<Conversation[]> {
  try {
    if (!queryText.trim()) {
      return fetchUserConversations(userId);
    }

    let query = supabase
      .from('conversations')
      .select('*')
      .ilike('title', `%${queryText.trim()}%`)
      .order('updated_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) return [];
    return (data as Conversation[]) || [];
  } catch {
    return [];
  }
}

/**
 * Fetches all messages and nested attachments, files, and voice notes for a conversation.
 */
export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const { data: messagesData, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError) {
      console.warn('[FETCH MESSAGES ERROR]', msgError.message);
      return [];
    }

    if (!messagesData || messagesData.length === 0) {
      return [];
    }

    // Parallel fetch attachments, files, and voice notes
    const [attachmentsRes, filesRes, voiceRes] = await Promise.all([
      supabase.from('attachments').select('*').eq('conversation_id', conversationId),
      supabase.from('uploaded_files').select('*').eq('conversation_id', conversationId),
      supabase.from('voice_messages').select('*').eq('conversation_id', conversationId)
    ]);

    const attachments = (attachmentsRes.data as Attachment[]) || [];
    const files = (filesRes.data as UploadedFile[]) || [];
    const voiceNotes = (voiceRes.data as VoiceMessage[]) || [];

    // Map nested media to corresponding messages
    const mapped: ChatMessage[] = messagesData.map((m) => {
      const msgAttachments = attachments.filter((a) => a.message_id === m.id);
      const msgFiles = files.filter((f) => f.message_id === m.id);
      const msgVoice = voiceNotes.filter((v) => v.message_id === m.id);

      return {
        id: m.id,
        conversation_id: m.conversation_id,
        role: m.role,
        content: m.content,
        created_at: m.created_at,
        attachments: msgAttachments,
        uploaded_files: msgFiles,
        voice_messages: msgVoice
      };
    });

    return mapped;
  } catch (err) {
    console.warn('[FETCH MESSAGES EXCEPTION]', err);
    return [];
  }
}

/**
 * Inserts a message and its optional media records.
 */
export async function insertMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  userId?: string | null,
  media?: {
    attachments?: Array<{ url: string; type: string; name?: string; size?: number }>;
    files?: Array<{ url: string; name: string; size: number; type: string }>;
    voice?: { url: string; duration: number };
  }
): Promise<ChatMessage | null> {
  try {
    // 1. Insert message record
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          role,
          content
        }
      ])
      .select()
      .single();

    if (msgError) {
      console.warn('[INSERT MESSAGE ERROR]', msgError.message);
      return null;
    }

    const messageId = msgData.id;

    // 2. Insert image attachments
    let savedAttachments: Attachment[] = [];
    if (media?.attachments && media.attachments.length > 0) {
      const records = media.attachments.map((a) => ({
        conversation_id: conversationId,
        message_id: messageId,
        user_id: userId || null,
        file_url: a.url,
        file_type: a.type,
        file_name: a.name || 'image.webp',
        file_size: a.size || 0
      }));

      const { data: attData } = await supabase.from('attachments').insert(records).select();
      if (attData) savedAttachments = attData as Attachment[];
    }

    // 3. Insert general files
    let savedFiles: UploadedFile[] = [];
    if (media?.files && media.files.length > 0) {
      const fileRecords = media.files.map((f) => ({
        conversation_id: conversationId,
        message_id: messageId,
        user_id: userId || null,
        file_name: f.name,
        file_type: f.type,
        file_size: f.size,
        file_url: f.url
      }));

      const { data: fData } = await supabase.from('uploaded_files').insert(fileRecords).select();
      if (fData) savedFiles = fData as UploadedFile[];
    }

    // 4. Insert voice message
    let savedVoice: VoiceMessage[] = [];
    if (media?.voice) {
      const voiceRecord = {
        conversation_id: conversationId,
        message_id: messageId,
        user_id: userId || null,
        audio_url: media.voice.url,
        duration: media.voice.duration
      };

      const { data: vData } = await supabase.from('voice_messages').insert([voiceRecord]).select();
      if (vData) savedVoice = vData as VoiceMessage[];
    }

    // 5. Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return {
      id: messageId,
      conversation_id: conversationId,
      role: msgData.role,
      content: msgData.content,
      created_at: msgData.created_at,
      attachments: savedAttachments,
      uploaded_files: savedFiles,
      voice_messages: savedVoice
    };
  } catch (err) {
    console.warn('[INSERT MESSAGE EXCEPTION]', err);
    return null;
  }
}

/**
 * Intelligent Enterprise Security AI Response Generator (Arya)
 */
export function generateAIResponse(
  userPrompt: string,
  hasImage = false,
  hasFile = false,
  hasVoice = false
): {
  text: string;
  actions?: Array<{ label: string; action: string; type?: 'reply' | 'link' | 'modal' }>;
} {
  const p = userPrompt.toLowerCase();

  if (hasVoice) {
    return {
      text: "I have received and listened to your voice message. Our security operations desk has logged your voice inquiry and is analyzing your site requirements. Would you like an instant enterprise proposal, or should we schedule an immediate 1-on-1 call with our Chief Operations Officer?",
      actions: [
        { label: "📅 Schedule 1-on-1 Consultation", action: "/booking", type: 'link' },
        { label: "💬 Connect on WhatsApp (+91 77088 87878)", action: "https://wa.me/917708887878", type: 'link' },
        { label: "⚡ Request 2-Hour Priority Callback", action: "/session-request", type: 'link' }
      ]
    };
  }

  if (hasImage) {
    return {
      text: "I have analyzed your uploaded screenshot/blueprint. Our AI-driven surveillance architecture and C4i Command Centers can directly integrate with your facility perimeter, blind spots, and access control layout. We can prepare a customized site coverage audit for this floor plan.",
      actions: [
        { label: "🛡️ Request Site Vulnerability Assessment", action: "/forms", type: 'link' },
        { label: "📹 Learn About C4i AI Command Center", action: "/command-center", type: 'link' },
        { label: "💬 Discuss Details on WhatsApp", action: "https://wa.me/917708887878", type: 'link' }
      ]
    };
  }

  if (hasFile) {
    return {
      text: "Your tender/RFP specification document has been securely ingested. Our enterprise bidding and compliance team is cross-referencing your specifications with our PSARA Tier-1 certifications, ISO 9001/27001 standards, and SLA benchmarks.",
      actions: [
        { label: "📋 Complete Enterprise RFP Details", action: "/forms", type: 'link' },
        { label: "📅 Book RFP Technical Review Meeting", action: "/booking", type: 'link' },
        { label: "📞 Speak With Tenders Desk: +91 77088 87878", action: "tel:+917708887878", type: 'link' }
      ]
    };
  }

  if (p.includes('price') || p.includes('cost') || p.includes('rate') || p.includes('quote')) {
    return {
      text: "ISI Security provides customized enterprise pricing structured around required manpower tier (unarmed guards, armed escorts, quick response teams), facility shift rotations, and automated C4i command center monitoring. For a fast 60-second quote tailored to your exact location:",
      actions: [
        { label: "⚡ Get Instant Security Quote", action: "/contact", type: 'link' },
        { label: "📅 Schedule 1-on-1 Cost Consultation", action: "/booking", type: 'link' },
        { label: "💬 Chat Directly on WhatsApp", action: "https://wa.me/917708887878", type: 'link' }
      ]
    };
  }

  if (p.includes('guard') || p.includes('manned') || p.includes('psara') || p.includes('manpower')) {
    return {
      text: "Our Manned Guarding division operates across 18+ Indian states under full PSARA Tier-1 compliance. Every security officer undergoes mandatory 160-hour residential drills, verified police verification, fire-safety certification, and bi-monthly fitness testing.",
      actions: [
        { label: "🛡️ Explore Manned Guarding Verticals", action: "/services", type: 'link' },
        { label: "⚡ Request Guard Deployment in 48 Hours", action: "/contact", type: 'link' },
        { label: "📅 Book Security Audit Call", action: "/booking", type: 'link' }
      ]
    };
  }

  if (p.includes('cctv') || p.includes('ai') || p.includes('surveillance') || p.includes('command') || p.includes('camera')) {
    return {
      text: "Our C4i Command Centers leverage AI vision analytics to provide real-time facial recognition, perimeter intrusion alerts, license plate recognition (ANPR), and automated SOS escalation within <30 seconds across enterprise campuses.",
      actions: [
        { label: "📹 Request Live C4i Command Center Demo", action: "/booking", type: 'link' },
        { label: "🏢 Integrated Facility Surveillance", action: "/facility-management", type: 'link' }
      ]
    };
  }

  // Default professional response
  return {
    text: `Thank you for reaching out to ISI Security. As India's leading PSARA-certified enterprise security and integrated facility management partner for 25+ years, we protect Fortune 500 tech parks, manufacturing hubs, educational institutions, and healthcare centers across 18+ states. How can we best support your facility today?`,
    actions: [
      { label: "🛡️ Enterprise Security Solutions", action: "/services", type: 'link' },
      { label: "📅 Schedule 1-on-1 Consultation", action: "/booking", type: 'link' },
      { label: "💬 Chat on WhatsApp (+91 77088 87878)", action: "https://wa.me/917708887878", type: 'link' },
      { label: "⚡ Request Instant Quote", action: "/contact", type: 'link' }
    ]
  };
}
