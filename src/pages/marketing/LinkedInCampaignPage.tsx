import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Award, 
  Lock, 
  Users, 
  TrendingUp, 
  Sparkles,
  PhoneCall,
  Calendar,
  MessageCircle,
  FileCheck
} from 'lucide-react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { getUtmParams } from '@/utils/utm';
import { toast } from 'sonner';

export const LinkedInCampaignPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    phone: '',
    company: '',
    designation: '',
    facilitySize: '50,000 - 200,000 sq.ft',
    serviceNeeded: 'PSARA Manned Guarding & Surveillance',
    website_hp: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    tracker.track('page_view', { 
      pageTitle: 'Enterprise Security Strategy | LinkedIn Executive Portal',
      utmParams: { utmSource: 'linkedin' }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.workEmail || !formData.phone || !formData.company) {
      toast.error('Please complete all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    const utm = getUtmParams();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'linkedin',
          fullName: formData.name,
          email: formData.workEmail,
          phone: formData.phone,
          company: formData.company,
          serviceInterest: formData.serviceNeeded,
          industry: formData.designation,
          message: `LinkedIn Campaign Lead | Title: ${formData.designation} | Facility: ${formData.facilitySize}`,
          website_hp: formData.website_hp,
          pageUrl: window.location.href,
          utmSource: utm.utmSource || 'linkedin',
          utmMedium: utm.utmMedium || 'social_cpc',
          utmCampaign: utm.utmCampaign || 'executive_security_2026',
          ...utm
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedId(data.leadId);
        toast.success(`Executive Brief Requested! Ref ID: ${data.leadId}`);
        tracker.track('lead_generated', {
          leadType: 'linkedin',
          leadId: data.leadId,
          metadata: {
            company: formData.company,
            title: formData.designation,
            service: formData.serviceNeeded
          }
        });
      } else {
        toast.error(data.error || 'Submission error. Please retry.');
      }
    } catch (err) {
      toast.error('Network connectivity error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO 
        title="Enterprise Physical Security & C4i Surveillance | LinkedIn Executive Portal | ISI"
        description="Exclusive portal for LinkedIn corporate executives: PSARA-certified manned guarding, AI C4i command centers, and facility management across 18+ Indian states."
        canonicalPath="/linkedin"
      />

      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base">
            ISI
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">
            ISI Security • Executive Advisory
          </span>
        </a>
        <div className="flex items-center gap-3 text-xs">
          <a href="/booking" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition">
            Book VIP Consultation
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Executive Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              B2B Enterprise Security Brief
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Elevate Your Enterprise Security & Risk Posture Across 18+ States
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Industrial Security & Intelligence (ISI) delivers PSARA-certified manned guarding, military-grade biometric surveillance, and 24/7 C4i command center operations to India’s most prominent tech parks, manufacturing hubs, and corporate campuses.
            </p>

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  PSARA Tier-1 Certified
                </div>
                <p className="text-slate-400 text-[11px]">100% statutory statutory compliance, PF/ESI tracking, and automated biometric muster.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1">
                  <Award className="w-4 h-4 text-emerald-400" />
                  C4i AI Command Centers
                </div>
                <p className="text-slate-400 text-[11px]">Live remote SOC monitoring with 90-second incident response and automated tripwire AI.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-cyan-400" />
                  500+ Enterprise Deployments
                </div>
                <p className="text-slate-400 text-[11px]">Trusted by Fortune 500 corporations, GCC IT parks, and major bank data centers.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  ISO 9001 / 27001 Certified
                </div>
                <p className="text-slate-400 text-[11px]">Institutional operational rigor with zero labor liabilities and standardized SOPs.</p>
              </div>
            </div>

            {/* Quick Contacts */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span>Direct Operations Line: <a href="tel:+917708887878" className="text-blue-400 hover:underline font-medium">+91 77088 87878</a></span>
              <span>•</span>
              <a href="/whatsapp" className="text-emerald-400 hover:underline font-medium">WhatsApp Desk</a>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            {!submittedId ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white">Request Executive Security Proposal</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Receive customized site audit blueprints & manpower cost models.</p>
                </div>

                {/* Honeypot */}
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Vardhan"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="name@enterprise.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Direct Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98410 23456"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Larsen & Toubro"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. VP Operations / Security Head"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Facility Area / Scope</label>
                    <select
                      value={formData.facilitySize}
                      onChange={(e) => setFormData({ ...formData, facilitySize: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Under 50,000 sq.ft">Under 50,000 sq.ft</option>
                      <option value="50,000 - 200,000 sq.ft">50,000 - 200,000 sq.ft</option>
                      <option value="200,000 - 1,000,000 sq.ft">200,000 - 1,000,000 sq.ft</option>
                      <option value="Multiple Sites / Pan-India">Multiple Sites / Pan-India</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-300 block mb-1">Core Capability Focus</label>
                  <select
                    value={formData.serviceNeeded}
                    onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="PSARA Manned Guarding & Surveillance">PSARA Manned Guarding & Surveillance</option>
                    <option value="Integrated Facility Management (IFM)">Integrated Facility Management (IFM)</option>
                    <option value="C4i AI Remote Surveillance & Threat Monitoring">C4i AI Remote Surveillance & Threat Monitoring</option>
                    <option value="Cash & Bullion Armed Transit Logistics">Cash & Bullion Armed Transit Logistics</option>
                    <option value="Complete Physical & Cyber Security Audit">Complete Physical & Cyber Security Audit</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  {isSubmitting ? 'Processing Brief...' : (
                    <>
                      <span>Receive Confidential Security Proposal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Confidential B2B Transmission • NDA Protected</span>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Executive Request Dispatched</h3>
                <p className="text-xs text-slate-400">
                  Reference: <span className="font-mono text-blue-400 font-semibold">{submittedId}</span>
                </p>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Our Senior Enterprise Director will contact you directly to share technical specs and schedule an on-site survey.
                </p>
                <div className="pt-2">
                  <a
                    href="/booking"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
                  >
                    <span>Schedule Direct Video Meeting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkedInCampaignPage;

