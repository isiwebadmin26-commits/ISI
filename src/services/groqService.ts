// src/services/groqService.ts
/**
 * Groq AI Client for Arya (ISI Security AI Consultant)
 * Powered by Llama 3.3 70B & Llama 3.1 8B on Groq LPUs for ultra-fast, free inference.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponseResult {
  text: string;
  modelUsed?: string;
  actions?: Array<{ label: string; action: string; type?: 'reply' | 'link' | 'modal' }>;
}

export const ARYA_SYSTEM_PROMPT = `You are Arya, the Senior Security & Facilities Operations Consultant at Industrial Security Integrated (ISI).
ISI is India's premier PSARA-certified enterprise security, armed & unarmed manned guarding, C4i command center surveillance, and integrated facility management corporation with 25+ years of operational excellence across 18+ states protecting Fortune 500 tech parks, manufacturing plants, educational campuses, and financial institutions.

Your guidelines:
1. Provide authoritative, concise, and structured enterprise-grade advice as an expert security consultant.
2. Maintain a professional, consultative, and reassuring tone. Never refer to yourself as an AI, bot, or automated model — you are Arya, ISI's dedicated security operations consultant.
3. Offer actionable insights into physical security, surveillance analytics (ANPR, facial recognition, perimeter intrusion), access control, fire safety, and tender compliance.
4. When relevant, guide users to schedule a consultation, request an enterprise quote, or connect with our operations desk on WhatsApp (+91 77088 87878).
5. Keep responses concise, clear, and easy to read with bullet points or brief paragraphs.`;

/**
 * Retrieves the active Groq API Key from environment or local storage.
 */
export function getActiveGroqApiKey(): string {
  // 1. Check Vite Environment Variable
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
  if (envKey && envKey.trim().startsWith('gsk_')) {
    return envKey.trim();
  }

  // 2. Check localStorage (allows user to paste their free Groq key directly in chat)
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('isi_groq_api_key') || '';
    if (localKey && localKey.trim().startsWith('gsk_')) {
      return localKey.trim();
    }
  }

  return envKey.trim();
}

/**
 * Saves a user-provided Groq API Key locally.
 */
export function setActiveGroqApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('isi_groq_api_key', key.trim());
    } else {
      localStorage.removeItem('isi_groq_api_key');
    }
  }
}

/**
 * Calls Groq API to generate a real-time AI response.
 */
export async function callGroqChat(
  userPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  customApiKey?: string
): Promise<GroqResponseResult | null> {
  const apiKey = customApiKey || getActiveGroqApiKey();

  if (!apiKey) {
    return null; // Signals fallback to domain knowledge engine
  }

  // Build message history
  const messages: GroqMessage[] = [
    { role: 'system', content: ARYA_SYSTEM_PROMPT }
  ];

  // Include last 6 turns of conversation for context
  const recentHistory = history.slice(-6);
  for (const h of recentHistory) {
    if (h.content && h.content.trim()) {
      messages.push({
        role: h.role,
        content: h.content.slice(0, 1500)
      });
    }
  }

  // Add the latest user prompt
  messages.push({
    role: 'user',
    content: userPrompt
  });

  // Attempt primary 120B model first, with fallbacks to 20B and Qwen
  const modelsToTry = [DEFAULT_MODEL, FALLBACK_MODEL, 'qwen/qwen3.8-27b'];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 1024,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[GROQ API ERROR - ${model}]:`, response.status, errorText);
        continue; // Try fallback model
      }

      const data = await response.json();
      const aiText = data?.choices?.[0]?.message?.content?.trim();

      if (aiText) {
        return {
          text: aiText,
          modelUsed: model,
          actions: [
            { label: '📅 Book 1-on-1 Consultation', action: '/booking', type: 'link' },
            { label: '💬 Chat on WhatsApp (+91 77088 87878)', action: 'https://wa.me/917708887878', type: 'link' },
            { label: '⚡ Request Instant Quote', action: '/contact', type: 'link' }
          ]
        };
      }
    } catch (err) {
      console.warn(`[GROQ FETCH EXCEPTION - ${model}]:`, err);
    }
  }

  return null;
}
