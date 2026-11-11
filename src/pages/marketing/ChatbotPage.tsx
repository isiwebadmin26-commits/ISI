import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Shield, 
  PhoneCall, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Mail, 
  Building2, 
  MessageCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { getUtmParams } from '@/utils/utm';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: Array<{ label: string; action: string; type?: 'reply' | 'link' | 'modal' }>;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-init-1',
    sender: 'bot',
    text: "Hello! I am Arya, Senior Security & Facility Operations Consultant at ISI Security. How can I assist your organization today?",
    timestamp: 'Just now',
    actions: [
      { label: "🛡️ Enterprise Manned Guarding", action: "Tell me about your PSARA-certified manned guarding services" },
      { label: "📹 AI Surveillance & C4i Command Centers", action: "How does your AI surveillance & remote SOC work?" },
      { label: "🏢 Integrated Facility Management", action: "What facility management services do you offer?" },
      { label: "📅 Book a 1-on-1 Consultation", action: "BOOKING_MODAL", type: 'modal' },
      { label: "💬 Connect on WhatsApp", action: "WHATSAPP_REDIRECT", type: 'link' }
    ]
  }
];

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem('isi_standalone_chat');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Lead capture state
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Enterprise Security',
    notes: '',
    website_hp: ''
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tracker.track('page_view', { pageTitle: 'ISI Security AI Consultant | Dedicated Chat' });
    try {
      sessionStorage.setItem('isi_standalone_chat', JSON.stringify(messages));
    } catch { /* ignore */ }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!hasStarted) {
      setHasStarted(true);
      tracker.track('chat_started', {
        leadType: 'chatbot',
        metadata: { firstMessage: text }
      });
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Consultant simulated responses
    setTimeout(() => {
      let botReply = '';
      let actions: Message['actions'] = [];
      const lower = text.toLowerCase();

      if (lower.includes('guard') || lower.includes('manned') || lower.includes('security')) {
        botReply = "ISI provides PSARA-certified enterprise manned guarding across 18+ Indian states. Every guard undergoes stringent 160-hour SSSDC-compliant tactical training, background screening, and biometric shift compliance via our mobile ERP. Would you like a customized security audit for your facility?";
        actions = [
          { label: "Request Site Survey", action: "LEAD_CAPTURE", type: 'modal' },
          { label: "Book Meeting with Security Director", action: "BOOKING_MODAL", type: 'modal' }
        ];
      } else if (lower.includes('surveillance') || lower.includes('cctv') || lower.includes('c4i') || lower.includes('ai')) {
        botReply = "Our C4i Command Centers in Chennai & Bangalore combine 24/7 certified operators with Edge AI analytics for perimeter intrusion detection, thermal anomalies, weapon detection, and automated escalation. We reduce security staffing overhead by up to 35% while increasing threat response time to under 90 seconds.";
        actions = [
          { label: "Schedule Live C4i Demo", action: "LEAD_CAPTURE", type: 'modal' },
          { label: "Connect via WhatsApp", action: "WHATSAPP_REDIRECT", type: 'link' }
        ];
      } else if (lower.includes('facility') || lower.includes('ifm') || lower.includes('housekeeping')) {
        botReply = "Our Integrated Facility Management (IFM) combines Hard FM (HVAC, Electrical, BMS maintenance) and Soft FM (mechanized housekeeping, pest management, waste compliance) serving 50M+ sq.ft across IT Parks, manufacturing plants, and educational campuses.";
        actions = [
          { label: "Get IFM Proposal", action: "LEAD_CAPTURE", type: 'modal' }
        ];
      } else {
        botReply = "Thank you for reaching out! To give you accurate deployment details, pricing models, and regional PSARA compliance specs for your sites, would you like our senior operations director to connect with you directly?";
        actions = [
          { label: "Share Requirement / Request Callback", action: "LEAD_CAPTURE", type: 'modal' },
          { label: "Chat Instantly on WhatsApp", action: "WHATSAPP_REDIRECT", type: 'link' }
        ];
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleActionClick = (action: string) => {
    if (action === 'LEAD_CAPTURE') {
      setShowLeadModal(true);
      tracker.track('cta_click', { metadata: { cta: 'chat_lead_capture_modal' } });
    } else if (action === 'BOOKING_MODAL') {
      window.location.href = '/booking';
      tracker.track('cta_click', { metadata: { cta: 'chat_redirect_to_booking' } });
    } else if (action === 'WHATSAPP_REDIRECT') {
      const utm = getUtmParams();
      const campaignNote = utm.utmCampaign ? ` (Campaign: ${utm.utmCampaign})` : '';
      const waUrl = `https://wa.me/917708887878?text=${encodeURIComponent(`Hi ISI Team, I was chatting with Arya on your website and would like to know more about your enterprise security services.${campaignNote}`)}`;
      tracker.track('whatsapp_click', { metadata: { source: 'chat_page' } });
      window.open(waUrl, '_blank');
    } else {
      handleSend(action);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone || !leadForm.email) {
      toast.error('Please enter your name, corporate email, and phone number');
      return;
    }

    setIsSubmittingLead(true);
    const utm = getUtmParams();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'chatbot',
          fullName: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          company: leadForm.company,
          serviceInterest: leadForm.service,
          message: leadForm.notes || 'Inquired via Dedicated Standalone Chatbot',
          website_hp: leadForm.website_hp,
          pageUrl: window.location.href,
          ...utm
        })
      });

      const data = await res.json();
      if (data.success) {
        setLeadSubmitted(true);
        toast.success(`Inquiry Registered! Reference: ${data.leadId}`);
        tracker.track('lead_generated', {
          leadType: 'chatbot',
          leadId: data.leadId,
          metadata: { company: leadForm.company, service: leadForm.service }
        });
        tracker.track('chat_completed', {
          leadType: 'chatbot',
          leadId: data.leadId
        });

        // Add confirmation message to chat stream
        setMessages(prev => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'bot',
            text: `Thank you, ${leadForm.name}! Your consultation request has been officially recorded under Reference ID: ${data.leadId}. Our regional security director has been dispatched your inquiry and will call you within 2 business hours.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
              { label: "Book Specific Calendar Slot", action: "BOOKING_MODAL", type: 'modal' },
              { label: "WhatsApp Immediate Follow-up", action: "WHATSAPP_REDIRECT", type: 'link' }
            ]
          }
        ]);
        setTimeout(() => setShowLeadModal(false), 2000);
      } else {
        toast.error(data.error || 'Failed to submit inquiry');
      }
    } catch (err) {
      toast.error('Network error. Please try again or call our helpline.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleResetChat = () => {
    sessionStorage.removeItem('isi_standalone_chat');
    setMessages(INITIAL_MESSAGES);
    toast.info('Conversation history cleared');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO 
        title="AI Security Operations Consultant | Dedicated Chat | ISI Security"
        description="Connect live with ISI's AI Security Consultant. Explore PSARA-certified manned guarding, AI C4i surveillance, integrated facility management, and book immediate site surveys."
        canonicalPath="/chat"
      />

      {/* Top Standalone Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-100 text-sm md:text-base">Arya • ISI AI Security Consultant</h1>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Industrial Security & Intelligence India • Tier-1 Enterprise Partner</p>
          </div>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => handleActionClick('WHATSAPP_REDIRECT')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-sm"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Escalation</span>
          </button>

          <a
            href="/booking"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Audit</span>
          </a>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Chat Conversation Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="text-center py-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
              End-to-End Encrypted B2B Enterprise Session
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[85%] md:max-w-[75%]">
                {m.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1 block">
                    {m.timestamp}
                  </span>
                </div>
              </div>

              {/* Action Chips */}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2 ml-10">
                  {m.actions.map((act, i) => (
                    <button
                      key={`act-${i}`}
                      onClick={() => handleActionClick(act.action)}
                      className="text-xs bg-slate-900 hover:bg-blue-950/80 hover:text-blue-300 text-slate-300 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs ml-10">
              <span className="flex gap-1 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>Arya is analyzing parameters...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-blue-500 transition shadow-lg shadow-black/20"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about security manpower, surveillance, pricing, or locations..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Disclaimer / Direct Contact */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 mt-2">
            <span>24/7 Security Helpline: <a href="tel:+917708887878" className="text-blue-400 hover:underline">+91 77088 87878</a></span>
            <button onClick={() => setShowLeadModal(true)} className="text-slate-400 hover:text-white underline">
              Request Callback
            </button>
          </div>
        </div>
      </main>

      {/* Lead Capture Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-base">Request Official Site Audit / Quote</h3>
                <p className="text-xs text-slate-400">Direct escalation to Regional Operations Director</p>
              </div>
            </div>

            {leadSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-semibold text-slate-100 text-lg">Inquiry Confirmed</h4>
                <p className="text-xs text-slate-400">Our operations team has received your details and will call you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="website_hp"
                  value={leadForm.website_hp}
                  onChange={(e) => setLeadForm({ ...leadForm, website_hp: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    placeholder="Company name, location"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Primary Security Requirement</label>
                  <select
                    value={leadForm.service}
                    onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="PSARA Manned Guarding">PSARA Manned Guarding</option>
                    <option value="AI C4i Surveillance & SOC">AI C4i Surveillance & SOC</option>
                    <option value="Integrated Facility Management">Integrated Facility Management</option>
                    <option value="Cash Logistics & Armored Transit">Cash Logistics & Armored Transit</option>
                    <option value="Executive Protection & VIP Escort">Executive Protection & VIP Escort</option>
                    <option value="Complete Security Audit">Complete Security Vulnerability Audit</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Notes / Scope (Optional)</label>
                  <textarea
                    rows={2}
                    value={leadForm.notes}
                    onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                    placeholder="Number of guards, site area, timeline..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  {isSubmittingLead ? 'Submitting...' : 'Confirm & Request Consultation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;

