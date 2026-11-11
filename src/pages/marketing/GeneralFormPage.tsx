import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Mail, 
  User, 
  Phone, 
  Briefcase, 
  Layers, 
  Lock,
  Sparkles
} from 'lucide-react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { getUtmParams } from '@/utils/utm';
import { toast } from 'sonner';

const INDUSTRIES = [
  'Information Technology (IT / ITeS)',
  'Banking, Financial Services & Insurance (BFSI)',
  'Manufacturing & Heavy Industries',
  'Healthcare & Pharmaceutical',
  'Educational Institutions & Campuses',
  'Commercial Real Estate & SEZs',
  'Retail, Malls & Hospitality',
  'Critical Infrastructure & Government',
  'Logistics & Warehousing'
];

const SERVICES = [
  'PSARA-Certified Manned Guarding',
  'AI-Powered C4i Remote Surveillance & SOC',
  'Integrated Facility Management (IFM)',
  'Armored Cash Logistics & Bullion Transit',
  'Executive Close Protection & Escorts',
  'Security Architecture & Risk Audit',
  'Cybersecurity & Threat Intelligence'
];

export const GeneralFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    serviceInterestedIn: SERVICES[0],
    industry: INDUSTRIES[0],
    message: '',
    website_hp: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.company || !formData.email || !formData.phone) {
      toast.error('Please enter all required fields.');
      return;
    }

    setIsSubmitting(true);
    const utm = getUtmParams();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'general_form',
          fullName: formData.fullName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          serviceInterest: formData.serviceInterestedIn,
          industry: formData.industry,
          message: formData.message,
          website_hp: formData.website_hp,
          pageUrl: window.location.href,
          ...utm
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedLead(data.leadId);
        toast.success(`Inquiry Logged! Ref ID: ${data.leadId}`);
        tracker.track('form_submit', {
          leadType: 'general_form',
          leadId: data.leadId,
          metadata: {
            company: formData.company,
            service: formData.serviceInterestedIn,
            industry: formData.industry
          }
        });
        tracker.track('lead_generated', {
          leadType: 'general_form',
          leadId: data.leadId
        });
      } else {
        toast.error(data.error || 'Failed to register inquiry.');
      }
    } catch (err) {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO 
        title="Enterprise Lead Capture Form | ISI Security Solutions"
        description="Connect with India's premier enterprise security and facility management organization. Request corporate proposals, staffing quotes, and surveillance blueprints."
        canonicalPath="/forms"
      />

      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base">
            ISI
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">
            Enterprise Inquiries
          </span>
        </a>
        <div className="flex items-center gap-3 text-xs">
          <a href="/booking" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
            Book a Meeting
          </a>
          <a href="/chat" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition">
            Live AI Chat
          </a>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        {!submittedLead ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Context Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50">
                  <Sparkles className="w-3.5 h-3.5" />
                  Request Official Proposal
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Partner with India’s Trusted Enterprise Protection Authority
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Fill in your operational requirements. Our corporate client solutions group will prepare a tailored techno-commercial deployment plan within 24 hours.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xl font-bold text-blue-400">18+ States</div>
                  <div className="text-[11px] text-slate-400">Pan-India PSARA Network</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xl font-bold text-emerald-400">500+</div>
                  <div className="text-[11px] text-slate-400">Enterprise Clients Protected</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xl font-bold text-cyan-400">25+ Years</div>
                  <div className="text-[11px] text-slate-400">Operational Excellence</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xl font-bold text-amber-400">24/7/365</div>
                  <div className="text-[11px] text-slate-400">C4i Command Center</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p>
                  All inquiries are processed in accordance with ISO 27001 data security guidelines. Your details remain strictly confidential and will never be shared.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot hidden input */}
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
                    <label className="text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ananya Roy"
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
                      placeholder="e.g. Cognizant Infrastructure"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Corporate Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aroy@cognizant.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Direct Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99000 11223"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Service Interested In *</label>
                    <select
                      value={formData.serviceInterestedIn}
                      onChange={(e) => setFormData({ ...formData, serviceInterestedIn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      {SERVICES.map((srv, idx) => (
                        <option key={`srv-${idx}`} value={srv}>{srv}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Industry Vertical *</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      {INDUSTRIES.map((ind, idx) => (
                        <option key={`ind-${idx}`} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-300 block mb-1">Detailed Message / Project Scope</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your site locations, manpower headcount requirements, technical surveillance expectations..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  {isSubmitting ? 'Transmitting Inquiries...' : (
                    <>
                      <span>Submit Proposal Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Confirmation State */
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                Proposal Request Logged
              </span>
              <h2 className="text-2xl font-bold text-white mt-3">
                Inquiry Successfully Registered
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Your dossier reference: <strong className="text-blue-400 font-mono">{submittedLead}</strong>
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Our business solutions director will review your facility parameters and deliver an initial scope & rate proposal within 24 business hours.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/"
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                Back to ISI Security
              </a>
              <a
                href="/booking"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
              >
                Schedule an Immediate Advisory Call
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GeneralFormPage;

