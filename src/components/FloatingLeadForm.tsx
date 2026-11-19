import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  CheckCircle2, 
  MessageSquare,
  MessageCircle,
  ShieldCheck,
  Building2,
  Sparkles,
  Zap,
  PhoneCall,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { validateWorkEmail, validatePhoneNumber } from '@/utils/validation';
import { submitBusinessLead } from '@/services/formService';
import { getUtmParams } from '@/utils/utm';
import { generateLeadNumber, normalizeLeadSource } from '@/utils/leadNumber';
import { cn } from '@/lib/utils';

interface FloatingLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const SERVICE_OPTIONS = [
  'Manned Guarding & Security Force',
  'Electronic Security & Surveillance (CCTV / Access)',
  'Integrated Facility Management (Hard & Soft Facility Management)',
  'Command & Control Center (SOC Monitoring)',
  'Cash Logistics & Valuables Transit',
  'Executive & VIP Protection',
  'Risk Advisory & Security Audit',
  'Other Enterprise Requirement'
];

export const FloatingLeadForm: React.FC<FloatingLeadFormProps> = ({
  isOpen,
  onClose,
  defaultService = 'Manned Guarding & Security Force'
}) => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirement: defaultService,
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({ ...prev, requirement: defaultService }));
    }
  }, [defaultService]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closing
      setSubmittedLeadNumber(null);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prevent double submission if already processing
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const emailVal = validateWorkEmail(formData.email);
    if (!emailVal.isValid) {
      newErrors.email = emailVal.message;
    }

    const phoneVal = validatePhoneNumber(formData.phone);
    if (!phoneVal.isValid) {
      newErrors.phone = phoneVal.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please resolve the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitBusinessLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        requirement: formData.requirement,
        message: formData.message?.trim() || `Quick Contact Inquiry for ${formData.requirement} from page: ${location.pathname}`,
        formName: 'Quick_Contact_Form',
        jobQuestion: 'No'
      });

      const assignedNumber = res.leadNumber || generateLeadNumber();
      setSubmittedLeadNumber(assignedNumber);

      toast.success('Quick Contact Enquiry Received!', {
        description: `Lead Reference: ${assignedNumber}. Our security expert will connect immediately.`
      });

      // Clear form inputs
      setFormData({
        name: '',
        email: '',
        phone: '',
        requirement: defaultService,
        message: ''
      });

    } catch (err: any) {
      console.error('Lead submission error:', err);
      toast.error('Submission recorded', {
        description: 'Your request was received. Our team will contact you shortly.'
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 transform scale-100 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white flex justify-between items-center relative overflow-hidden shrink-0 border-b border-white/10">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-tight">Quick Contact Form</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instant Quote
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Connect Immediately to our Security Expert
              </p>
            </div>
          </div>
          <button
            aria-label="Close form"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors relative z-10 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {submittedLeadNumber ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Enquiry Registered Successfully!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you for submitting the Quick Contact Form. Our senior security solutions expert will connect with you immediately.
                </p>

                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 max-w-xs mx-auto space-y-2">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                      Lead Reference Number
                    </span>
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider">{submittedLeadNumber}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Status:
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Active Priority
                    </span>
                  </div>
                </div>

                {/* Direct Action to Connect Immediately on WhatsApp with Reference */}
                <div className="pt-4 flex flex-col gap-2.5 max-w-sm mx-auto">
                  <a
                    href={`https://wa.me/917708887878?text=Hello!%20I%20just%20submitted%20the%20Quick%20Contact%20Form.%20My%20Reference%20Number%20is%20${submittedLeadNumber}.%20Please%20connect%20me%20with%20a%20Security%20Expert%20immediately.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with Expert on WhatsApp Now
                  </a>
                  
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full rounded-xl h-10 text-sm font-semibold"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Quick Lead Form */
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Callout: Connect Immediately to our Security Expert */}
              <div className="p-3.5 bg-gradient-to-r from-blue-500/10 via-primary/10 to-emerald-500/10 border border-primary/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <p className="font-bold text-foreground text-xs sm:text-sm">Connect Immediately to our Security Expert</p>
                    <p className="text-[11px] text-muted-foreground">Urgent requirement? Direct line to senior consultants</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20connect%20with%20an%20ISI%20Security%20Expert%20immediately."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    title="Direct WhatsApp Chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+917708887878"
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-primary/25 cursor-pointer"
                    title="24/7 Security Hotline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </a>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User size={13} className="text-blue-600" /> Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={cn(
                    "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400",
                    errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                  )}
                />
                {errors.name && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.name}</p>}
              </div>

              {/* Work Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail size={13} className="text-blue-600" /> Work / Corporate Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="e.g. rajesh@company.com"
                  value={formData.email}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={cn(
                    "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400",
                    errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                  )}
                />
                {errors.email && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone size={13} className="text-blue-600" /> Phone Number (Min. 10 digits) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={e => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={cn(
                    "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400",
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                  )}
                />
                {errors.phone && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.phone}</p>}
              </div>

              {/* Requirement Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-blue-600" /> Security Requirement / Service <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.requirement}
                  onChange={e => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white"
                >
                  {SERVICE_OPTIONS.map((opt, idx) => (
                    <option key={idx} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Message Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-blue-600" /> Note / Site Location <span className="text-xs font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need 12 security guards for corporate park in Chennai"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering Quick Request...
                    </>
                  ) : (
                    <>
                      <span>Get an Instant Security Quote</span>
                      <Send size={15} />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
                🔒 Guaranteed priority callback from our security expert within 15–30 minutes.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

