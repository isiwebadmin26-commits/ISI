import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  ArrowRight, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { getUtmParams } from '@/utils/utm';

const WHATSAPP_PHONE = '917708887878'; // ISI Official WhatsApp Hotline

const QUICK_MESSAGES = [
  {
    id: 'general',
    label: 'General Inquiry',
    text: 'Hi, I would like to know more about your services.'
  },
  {
    id: 'manned-guarding',
    label: 'Manned Guarding & Security Staff',
    text: 'Hi ISI Security, I am looking for PSARA-certified manned security guards for our corporate site.'
  },
  {
    id: 'c4i-surveillance',
    label: 'AI Surveillance & C4i SOC',
    text: 'Hi ISI Security, I would like to request a demo of your 24/7 AI-powered C4i Command Center surveillance.'
  },
  {
    id: 'facility-management',
    label: 'Integrated Facility Management',
    text: 'Hi ISI Security, I would like to discuss Integrated Facility Management (IFM) for our commercial property.'
  },
  {
    id: 'audit',
    label: 'Security Vulnerability Audit',
    text: 'Hi ISI Security, I want to book an on-site physical security and risk assessment audit.'
  }
];

export const WhatsAppPage: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState(QUICK_MESSAGES[0].text);
  const [customMessage, setCustomMessage] = useState('');
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    tracker.track('page_view', { pageTitle: 'Connect on WhatsApp | ISI Security 24/7 Hotline' });
  }, []);

  const messageToSend = customMessage.trim() || selectedMessage;

  // Build the WhatsApp URL with UTM campaign attribution appended
  const utm = getUtmParams();
  const attributionSuffix = utm.utmCampaign ? ` [Campaign: ${utm.utmCampaign} | Source: ${utm.utmSource || 'direct'}]` : '';
  const finalMessage = `${messageToSend}${attributionSuffix}`;
  const encodedText = encodeURIComponent(finalMessage);
  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

  // Direct QR Code generator URL using standard Google Chart / QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(waUrl)}&color=0D5C91&bgcolor=FFFFFF`;

  const handleLaunchWhatsApp = () => {
    setHasClicked(true);
    tracker.track('whatsapp_click', {
      leadType: 'whatsapp',
      metadata: {
        message: messageToSend,
        utmSource: utm.utmSource,
        utmCampaign: utm.utmCampaign
      }
    });
    tracker.track('lead_generated', {
      leadType: 'whatsapp',
      metadata: { phone: WHATSAPP_PHONE }
    });

    // Also register lead asynchronously with backend
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'whatsapp',
          fullName: 'WhatsApp Inquirer',
          email: 'whatsapp@visitor.isisecurity.in',
          phone: '+91-WHATSAPP',
          serviceInterest: 'WhatsApp Escalation',
          message: finalMessage,
          pageUrl: window.location.href,
          ...utm
        })
      }).catch(() => {});
    } catch { /* ignore */ }

    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO 
        title="Direct WhatsApp Security Desk | ISI Security 24/7 Hotline"
        description="Connect immediately with ISI Security operations desk on WhatsApp. Click-to-chat for manned guarding, AI surveillance, and emergency site assessments."
        canonicalPath="/whatsapp"
      />

      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-base">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">
            ISI WhatsApp Hotline
          </span>
        </a>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 hidden sm:inline">Direct Desk:</span>
          <a href="tel:+917708887878" className="text-emerald-400 font-semibold hover:underline">
            +91 77088 87878
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Message Customization */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operations Desk Active
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Connect Directly on WhatsApp
                </h1>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Chat with our senior security consultants in real-time. No forms, no wait time — immediate responses from our Chennai & Bangalore command desks.
                </p>
              </div>

              {/* Message Selector Chips */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 block">
                  Select Pre-filled Message / Inquiry Type:
                </label>
                <div className="space-y-1.5">
                  {QUICK_MESSAGES.map((msg) => {
                    const isSelected = selectedMessage === msg.text && !customMessage;
                    return (
                      <button
                        key={msg.id}
                        type="button"
                        onClick={() => {
                          setSelectedMessage(msg.text);
                          setCustomMessage('');
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition border ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-medium text-slate-200">{msg.label}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">"{msg.text}"</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom message text */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">Or Customize Your Note:</label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type custom note to send..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Launch CTA */}
              <button
                onClick={handleLaunchWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open WhatsApp & Start Chatting</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Business Account • +91 77088 87878 • Confidential B2B Session</span>
              </div>
            </div>

            {/* Right: QR Code for Desktop */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-inner">
                <img
                  src={qrCodeUrl}
                  alt="Scan WhatsApp QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Scan with Your Phone Camera</span>
                </div>
                <p className="text-[11px] text-slate-400 max-w-[200px]">
                  Instantly opens WhatsApp on your mobile device with your pre-selected inquiry.
                </p>
              </div>

              <div className="pt-2 w-full border-t border-slate-800/80">
                <a
                  href="/booking"
                  className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium"
                >
                  <span>Prefer a scheduled video meeting?</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppPage;

