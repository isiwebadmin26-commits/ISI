import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  Building2, 
  Mail, 
  User, 
  Phone, 
  AlertCircle,
  Award,
  Lock
} from 'lucide-react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { getUtmParams } from '@/utils/utm';
import { toast } from 'sonner';

export const SessionRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    requirement: 'Enterprise Manned Guarding',
    preferredTime: 'Immediate Callback (within 1 hour)',
    message: '',
    website_hp: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{ leadId: string; time: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const utm = getUtmParams();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'session_request',
          fullName: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          serviceInterest: formData.requirement,
          preferredTime: formData.preferredTime,
          message: formData.message || `Quick Session Request for ${formData.requirement}`,
          website_hp: formData.website_hp,
          pageUrl: window.location.href,
          ...utm
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedLead({
          leadId: data.leadId,
          time: formData.preferredTime
        });
        toast.success(`Session Request Dispatched! Reference: ${data.leadId}`);
        tracker.track('form_submit', {
          leadType: 'session_request',
          leadId: data.leadId,
          metadata: {
            company: formData.company,
            requirement: formData.requirement,
            preferredTime: formData.preferredTime
          }
        });
        tracker.track('lead_generated', {
          leadType: 'session_request',
          leadId: data.leadId
        });
      } else {
        toast.error(data.error || 'Failed to submit session request.');
      }
    } catch (err) {
      toast.error('Network error. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO 
        title="Quick Session Request | Priority Security Consultation | ISI Security"
        description="Submit a priority security session request. Direct escalation to regional operations directors for manned guarding, AI surveillance, and facility management."
        canonicalPath="/session-request"
      />

      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base">
            ISI
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">
            Priority Session Portal
          </span>
        </a>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 hidden sm:inline">24/7 Rapid Response:</span>
          <a href="tel:+917708887878" className="text-blue-400 font-semibold hover:underline">
            +91 77088 87878
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        {!submittedLead ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Value Column */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Priority 2-Hour SLA
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Request an Instant Security Review
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect with a senior security director tailored to your industry, geography, and risk parameters.
                </p>
              </div>

              {/* Trust Points */}
              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>PSARA Certified & ISO 9001/27001</strong> compliant operations across 18+ states.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>25+ Years of Industry Leadership</strong> protecting 500+ Fortune 500 & Enterprise clients.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Guaranteed Confidentiality</strong> under mutual non-disclosure agreement (NDA).</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                <p className="font-medium text-slate-300 mb-1">Looking for immediate WhatsApp escalation?</p>
                <a 
                  href="https://wa.me/917708887878?text=Hi%2C%20I%20would%20like%20to%20request%20an%20instant%20security%20review%20for%20my%20company."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 mt-1"
                >
                  <span>Chat directly on WhatsApp</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. S. Narayanan"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Sterling Tech Parks"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Primary Requirement</label>
                    <select
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Enterprise Manned Guarding">Enterprise Manned Guarding</option>
                      <option value="AI C4i Surveillance & SOC">AI C4i Surveillance & SOC</option>
                      <option value="Integrated Facility Management">Integrated Facility Management</option>
                      <option value="Cash Logistics & Armored Transit">Cash Logistics & Transit</option>
                      <option value="Executive Protection & VIP Escort">Executive Protection & Escort</option>
                      <option value="Security Vulnerability Audit">Security Vulnerability Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Preferred Callback Window</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Immediate Callback (within 1 hour)">Immediate (within 1 hour)</option>
                      <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-300 block mb-1">Message / Deployment Scope</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details on site location, manpower headcount, or timeline..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  {isSubmitting ? 'Transmitting Request...' : (
                    <>
                      <span>Submit Quick Session Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                Priority Request Logged
              </span>
              <h2 className="text-2xl font-bold text-white mt-3">
                Session Request Received
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Your ticket has been prioritized under ID: <strong className="text-blue-400 font-mono">{submittedLead.leadId}</strong>
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1">
              <p>Callback Window: <strong className="text-white">{submittedLead.time}</strong></p>
              <p className="text-slate-400">Our regional operations director will reach out directly on your verified contact number.</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/"
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                Return to Homepage
              </a>
              <a
                href="/chat"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
              >
                Continue Exploring with AI Consultant
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionRequestPage;

