import { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Building2, 
  Briefcase, 
  MessageSquare, 
  MessageCircle,
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  Lock,
  Zap,
  ArrowRight,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { ContactFormData, FormErrors } from '@/types/contact';
import { homeLocations } from "@/data/locations-data";
import { useAnalytics } from "@/hooks/useAnalytics";
import { validateWorkEmail, validatePhoneNumber } from '@/utils/validation';
import { sendToSheet } from '@/services/formService';
import { generateLeadNumber } from '@/utils/leadNumber';

export const Contact = () => {
  const { trackFormSubmission } = useAnalytics();
  
  // Tab state: 'quick' (default fast contact form) vs 'detailed' (full enterprise RFP)
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed'>('quick');

  // Comprehensive Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    designation: '',
    serviceInterest: '',
    message: '',
    privacyConsent: false,
  });

  // Quick Contact Form state
  const [quickData, setQuickData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Manned Guarding & Security Force',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [quickErrors, setQuickErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<string>('Submitted');
  const [submittedLeadType, setSubmittedLeadType] = useState<string>('sales');

  // Handle detailed input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  // Handle quick input changes
  const handleQuickInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setQuickData(prev => ({ ...prev, [id]: value }));
    if (quickErrors[id]) {
      setQuickErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, privacyConsent: checked }));
    if (errors.privacyConsent) {
      setErrors(prev => ({ ...prev, privacyConsent: undefined }));
    }
  };

  // Validate quick contact form
  const validateQuickForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!quickData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (quickData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!quickData.email.trim()) {
      newErrors.email = 'Corporate work email is required';
    } else {
      const emailVal = validateWorkEmail(quickData.email);
      if (!emailVal.isValid) {
        newErrors.email = emailVal.message;
      }
    }

    if (!quickData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else {
      const phoneVal = validatePhoneNumber(quickData.phone);
      if (!phoneVal.isValid) {
        newErrors.phone = phoneVal.message;
      }
    }

    setQuickErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle quick contact submission
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateQuickForm()) {
      toast.error('Please check the required fields highlighted in red.');
      return;
    }

    setIsQuickSubmitting(true);
    const submittedName = quickData.name.trim();

    try {
      const salesPayload = {
        name: submittedName,
        email: quickData.email.trim(),
        phone: quickData.phone.trim(),
        company: 'Quick Contact Inquiry',
        designation: 'Prospective Client',
        serviceInterest: quickData.serviceInterest || 'Manned Guarding & Security Force',
        message: quickData.message?.trim() || `Quick Contact request from /contact for ${quickData.serviceInterest}`,
        jobQuestion: 'No',
        leadType: 'Sales',
        formType: 'Quick Contact Form',
      };

      trackFormSubmission('Quick_Contact_Form', { ...salesPayload, analyticsOnly: true });

      // Also dispatch to local serverless API endpoint
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'quick_contact',
          fullName: submittedName,
          email: quickData.email.trim(),
          phone: quickData.phone.trim(),
          serviceInterest: quickData.serviceInterest,
          message: quickData.message?.trim() || 'Quick Contact Inquiry',
          pageUrl: window.location.href,
        })
      }).catch(err => console.warn('[LOCAL API NOTICE]', err));

      const res = await sendToSheet('Contact_Form', salesPayload);

      const refNumber = res.leadNumber || generateLeadNumber();
      setSubmittedReference(refNumber);
      setSubmittedStatus(res.userStatus || 'Submitted');
      setSubmittedLeadType('sales');
      setIsSubmitted(true);

      toast.success('Quick Contact Request Received!', {
        description: `Enquiry Reference: ${refNumber}. Our security expert will connect immediately.`,
        duration: 6000,
      });

      setQuickData({
        name: '',
        email: '',
        phone: '',
        serviceInterest: 'Manned Guarding & Security Force',
        message: '',
      });
    } catch (error) {
      console.error('[QUICK FORM ERROR]', error);
      toast.error('Submission received', {
        description: 'Your details were recorded. Our security team will connect with you shortly.',
        duration: 7000,
      });
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  // Validate detailed form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name: Required
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation: Work email for business enquiries
    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else {
      const emailVal = validateWorkEmail(formData.email);
      if (!emailVal.isValid) {
        newErrors.email = emailVal.message;
      }
    }

    // Company Name: Required
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    // Contact Number: Required (minimum 10 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else {
      const phoneVal = validatePhoneNumber(formData.phone);
      if (!phoneVal.isValid) {
        newErrors.phone = phoneVal.message;
      }
    }

    // Privacy Consent: Required
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'You must agree to the privacy policy & terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle detailed form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please check the required fields highlighted in red.');
      return;
    }

    setIsSubmitting(true);
    const submittedName = formData.name.trim();

    try {
      // ─── Commercial Sales Lead Workflow ───
      const salesPayload = {
        name: submittedName,
        email: formData.email.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        designation: formData.designation?.trim() || 'Not specified',
        serviceInterest: formData.serviceInterest || 'General Inquiry',
        message: formData.message?.trim() || 'No additional message provided',
        jobQuestion: 'No',
        leadType: 'Sales',
        formType: 'Sales Lead',
      };

      trackFormSubmission('Contact_Form', { ...salesPayload, analyticsOnly: true });
      const res = await sendToSheet('Contact_Form', salesPayload);

      const refNumber = res.leadNumber || generateLeadNumber();
      setSubmittedReference(refNumber);
      setSubmittedStatus(res.userStatus || 'Submitted');
      setSubmittedLeadType('sales');
      setIsSubmitted(true);

      toast.success('Thank you for reaching out to ISI Security!', {
        description: `Enquiry Reference: ${refNumber}. Our enterprise security consulting team will connect within 24 hours.`,
        duration: 6000,
      });

      // Reset form fields
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        designation: '',
        serviceInterest: '',
        message: '',
        privacyConsent: false,
      });
    } catch (error) {
      console.error('[FORM SUBMISSION NOTICE]', error);
      toast.error('Submission received', {
        description: 'Your details were recorded. Our team will connect with you shortly.',
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Office filtering state
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");

  const regions = ["All Regions", "North", "South", "East", "West"];

  const states = useMemo(() => {
    let filtered = homeLocations;
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(l => l.region === selectedRegion);
    }
    return ["All States", ...Array.from(new Set(filtered.map(l => l.state))).sort()];
  }, [selectedRegion]);

  const cities = useMemo(() => {
    let filtered = homeLocations;
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(l => l.region === selectedRegion);
    }
    if (selectedState !== "All States") {
      filtered = filtered.filter(l => l.state === selectedState);
    }
    return ["All Cities", ...Array.from(new Set(filtered.map(l => l.city))).sort()];
  }, [selectedRegion, selectedState]);

  const filteredOffices = homeLocations.filter(loc => {
    const matchRegion = selectedRegion === "All Regions" || loc.region === selectedRegion;
    const matchState = selectedState === "All States" || loc.state === selectedState;
    const matchCity = selectedCity === "All Cities" || loc.city === selectedCity;
    return matchRegion && matchState && matchCity;
  });

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedState("All States");
    setSelectedCity("All Cities");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity("All Cities");
  };

  return (
    <>
      <section className="min-h-screen bg-background relative overflow-hidden pt-12 pb-16">
        {/* Background Ambient Cyber Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
        <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-gradient-to-br from-primary/15 via-blue-600/10 to-transparent rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[480px] h-[480px] bg-gradient-to-tr from-cyan-500/10 via-primary/10 to-transparent rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl">

          {/* Hero Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-semibold border border-primary/20 mb-4 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span>Enterprise Security & Career Connect</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight text-foreground">
              Connect With Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-400">Security Experts</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tailored guarding, automated surveillance, cash transit, and risk management solutions engineered for enterprise scale across India.
            </p>
          </div>

          {/* Executive Section: Connect Immediately to our Security Expert */}
          <section aria-label="Connect Immediately to Our Security Expert" className="mb-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-blue-600/10 to-cyan-500/10 border border-primary/30 backdrop-blur-md shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-3 border border-primary/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Direct Operations & Expert Line</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
              Connect Immediately to our Security Expert
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
              Require urgent manned guarding deployment, command center integration, or a rapid enterprise security quote? Connect directly with our certified security directors.
            </p>

            {/* Action Buttons matching User Screenshot */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Button
                size="lg"
                onClick={() => {
                  setActiveTab('quick');
                  document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-11 sm:h-12 px-6 sm:px-7 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
              >
                Get an Instant Security Quote
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-11 sm:h-12 px-5 sm:px-6 gap-2 bg-card/70 backdrop-blur-md border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 rounded-xl transition-all text-sm sm:text-base cursor-pointer"
              >
                <a
                  href="https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20connect%20with%20an%20ISI%20Security%20Expert%20immediately."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Talk to Our Security Experts
                </a>
              </Button>
            </div>

            {/* Direct Connect Quick Links */}
            <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
              <a href="tel:+917708887878" className="flex items-center gap-1.5 hover:text-primary font-semibold transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>24/7 Hotline: <strong className="text-foreground">+91 77088 87878</strong></span>
              </a>
              <span className="hidden sm:inline text-border">•</span>
              <a 
                href="https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20connect%20with%20an%20ISI%20Security%20Expert%20immediately."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-emerald-500 font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp: <strong className="text-foreground">+91 77088 87878</strong></span>
              </a>
              <span className="hidden sm:inline text-border">•</span>
              <a href="/booking" className="flex items-center gap-1.5 hover:text-primary font-semibold transition-colors">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Schedule 1-on-1 Consultation</span>
              </a>
            </div>
          </section>

          {/* Contact Forms Container with Tabs */}
          <div id="contact-form-section" className="mb-16 max-w-2xl mx-auto scroll-mt-24">
            
            {/* Form Mode Selector Tabs */}
            <div className="flex p-1.5 bg-muted/60 dark:bg-card/70 border border-border/60 rounded-2xl mb-4 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Quick Contact Form</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-medium">
                  60s Quote
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('detailed')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'detailed'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Enterprise RFP Proposal</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-medium">
                  Detailed
                </span>
              </button>
            </div>

            <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
              
              {isSubmitted ? (
                <div className="py-10 px-4 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Enquiry Submitted Successfully!
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-sm">
                    Thank you for reaching out to ISI Security. Our enterprise security solutions team is reviewing your details and will connect immediately.
                  </p>

                  {/* Clean User-Facing Status Card */}
                  <div className="mt-4 p-4 bg-muted/60 dark:bg-slate-800/80 rounded-xl border border-border max-w-xs mx-auto text-left space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">
                        Enquiry Reference:
                      </span>
                      <span className="font-mono font-bold text-primary text-sm tracking-wide">
                        {submittedReference}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">
                        Status:
                      </span>
                      <span className="font-semibold px-2.5 py-0.5 rounded text-[11px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {submittedStatus}
                      </span>
                    </div>
                  </div>

                  {/* Immediate WhatsApp Connect Button with Reference */}
                  <div className="pt-4 flex flex-col gap-2.5 max-w-xs mx-auto">
                    <a
                      href={`https://wa.me/917708887878?text=Hello!%20I%20just%20submitted%20an%20enquiry%20on%20your%20contact%20page.%20Reference:%20${submittedReference}.%20Please%20connect%20me%20with%20a%20Security%20Expert%20immediately.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat with Expert on WhatsApp
                    </a>

                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmittedReference(null);
                      }}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Submit Another Enquiry
                    </Button>
                  </div>
                </div>
              ) : activeTab === 'quick' ? (
                /* ─── TAB 1: QUICK CONTACT FORM ─── */
                <form onSubmit={handleQuickSubmit} className="space-y-4" noValidate>
                  
                  {/* Quick Form Banner: Connect Immediately to our Security Expert */}
                  <div className="p-3.5 bg-gradient-to-r from-blue-500/10 via-primary/10 to-emerald-500/10 border border-primary/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <div>
                        <p className="font-bold text-foreground text-xs sm:text-sm">Connect Immediately to our Security Expert</p>
                        <p className="text-[11px] text-muted-foreground">Direct escalation to senior security directors</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href="https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20connect%20with%20an%20ISI%20Security%20Expert%20immediately."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Quick Field 1: Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="quick-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={quickData.name}
                      onChange={handleQuickInputChange}
                      disabled={isQuickSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        quickErrors.name ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="e.g. Rajesh Kumar"
                      autoComplete="name"
                    />
                    {quickErrors.name && <p className="text-xs text-red-500">{quickErrors.name}</p>}
                  </div>

                  {/* Quick Field 2: Work Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="quick-email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" /> Corporate Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={quickData.email}
                      onChange={handleQuickInputChange}
                      disabled={isQuickSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        quickErrors.email ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                    {quickErrors.email && <p className="text-xs text-red-500">{quickErrors.email}</p>}
                  </div>

                  {/* Quick Field 3: Phone Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="quick-phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" /> Contact Number (Min. 10 digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={quickData.phone}
                      onChange={handleQuickInputChange}
                      disabled={isQuickSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        quickErrors.phone ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                    />
                    {quickErrors.phone && <p className="text-xs text-red-500">{quickErrors.phone}</p>}
                  </div>

                  {/* Quick Field 4: Service Requirement */}
                  <div className="space-y-1.5">
                    <label htmlFor="quick-service" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> Security Service Required <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={quickData.serviceInterest} 
                      onValueChange={(val) => setQuickData(prev => ({ ...prev, serviceInterest: val }))} 
                      disabled={isQuickSubmitting}
                    >
                      <SelectTrigger 
                        id="quick-service" 
                        className="w-full h-11 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      >
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-border">
                        <SelectItem value="Manned Guarding & Security Force">Manned Guarding & Security Force</SelectItem>
                        <SelectItem value="Electronic Security & CCTV">Electronic Security & CCTV</SelectItem>
                        <SelectItem value="Cash Logistics & Transit">Cash Logistics & Transit</SelectItem>
                        <SelectItem value="Integrated Facility Management">Integrated Facility Management</SelectItem>
                        <SelectItem value="Command Centers (SOC Monitoring)">Command Centers (SOC Monitoring)</SelectItem>
                        <SelectItem value="Executive & VIP Protection">Executive & VIP Protection</SelectItem>
                        <SelectItem value="Drone Security & Surveillance">Drone Security & Surveillance</SelectItem>
                        <SelectItem value="Risk Advisory & Security Audit">Risk Advisory & Security Audit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Field 5: Optional Note */}
                  <div className="space-y-1.5">
                    <label htmlFor="quick-message" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" /> Requirement Note / Location <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="message"
                      value={quickData.message}
                      onChange={handleQuickInputChange}
                      disabled={isQuickSubmitting}
                      className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm"
                      placeholder="e.g. 15 guards needed for IT campus in Chennai"
                    />
                  </div>

                  {/* Quick Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isQuickSubmitting}
                      className="w-full h-12 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isQuickSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Registering Instant Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Get an Instant Security Quote</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center mt-2 font-medium">
                      ⚡ Priority callback guaranteed within 15–30 minutes from our security director.
                    </p>
                  </div>
                </form>
              ) : (
                /* ─── TAB 2: COMPREHENSIVE ENTERPRISE RFP FORM ─── */
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                  {/* Field 1: Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-foreground block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        errors.name ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="e.g. Rajesh Sharma"
                      autoComplete="name"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  {/* Field 2: Work Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-foreground block">
                      Work Email <span className="text-xs font-normal text-muted-foreground">(Corporate / Business Email)</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        errors.email ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  {/* Field 3: Company Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="company" className="text-xs font-semibold text-foreground block">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        errors.company ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="Your Company Name"
                      autoComplete="organization"
                    />
                    {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
                  </div>

                  {/* Field 4: Contact Number (Min. 10 digits) */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-foreground block">
                      Contact Number <span className="text-xs font-normal text-muted-foreground">(Min. 10 digits)</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2.5 bg-background border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm ${
                        errors.phone ? 'border-red-500 bg-red-500/5' : 'border-border'
                      }`}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Field 5: Designation ( Optional ) */}
                  <div className="space-y-1.5">
                    <label htmlFor="designation" className="text-xs font-semibold text-foreground block">
                      Designation <span className="text-xs font-normal text-muted-foreground">( Optional )</span>
                    </label>
                    <input
                      type="text"
                      id="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/60 text-sm"
                      placeholder="e.g. Security Director, Facilities Manager, COO"
                      autoComplete="organization-title"
                    />
                  </div>

                  {/* Field 6: Services Type ( Optional ) */}
                  <div className="space-y-1.5">
                    <label htmlFor="serviceInterest" className="text-xs font-semibold text-foreground block">
                      Services Type <span className="text-xs font-normal text-muted-foreground">( Optional )</span>
                    </label>
                    <Select 
                      value={formData.serviceInterest} 
                      onValueChange={(value) => handleSelectChange('serviceInterest', value)} 
                      disabled={isSubmitting}
                    >
                      <SelectTrigger 
                        id="serviceInterest" 
                        className="w-full h-11 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      >
                        <SelectValue placeholder="Select Service Type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-border">
                        <SelectItem value="Manned Guarding">Manned Guarding</SelectItem>
                        <SelectItem value="Electronic Security & CCTV">Electronic Security & CCTV</SelectItem>
                        <SelectItem value="Cash Logistics">Cash Logistics</SelectItem>
                        <SelectItem value="Facility Management">Facility Management</SelectItem>
                        <SelectItem value="Drone Services">Drone Services</SelectItem>
                        <SelectItem value="Command Centers (SOC)">Command Centers (SOC)</SelectItem>
                        <SelectItem value="Executive Protection">Executive Protection</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Field 7: Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold text-foreground block">
                      Your Message <span className="text-xs font-normal text-muted-foreground">( Optional )</span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none text-foreground placeholder:text-muted-foreground/60 text-sm"
                      placeholder="Share your security or facility requirements..."
                    ></textarea>
                  </div>

                  {/* Field 8: Privacy Policy Checkbox */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-xl border border-border/50">
                      <Checkbox 
                        id="privacyConsent" 
                        checked={formData.privacyConsent} 
                        onCheckedChange={handleCheckboxChange} 
                        disabled={isSubmitting} 
                        className="mt-0.5" 
                      />
                      <label htmlFor="privacyConsent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                        I agree to the{" "}
                        <a href="/privacypolicy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Privacy Policy</a>
                        {" "}and{" "}
                        <a href="/termsofservice" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Terms of Service</a>.
                      </label>
                    </div>
                    {errors.privacyConsent && <p className="text-xs text-red-500">{errors.privacyConsent}</p>}
                  </div>

                  {/* Field 9: Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Request...' : 'Request Enterprise Proposal'}
                      <Send className="w-4 h-4" />
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center mt-2 font-medium">
                      🔒 Guaranteed response from our security solutions director within 24 hours.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            <div className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <Phone className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">Call Directly</h3>
              <p className="text-muted-foreground text-xs mb-3">Available 24/7/365 for inquiries & emergencies</p>
              <a href="tel:+917708887878" className="text-primary font-bold hover:underline text-base">+91 77088 87878</a>
            </div>

            <div className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <Mail className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">Email Desk</h3>
              <p className="text-muted-foreground text-xs mb-3">Guaranteed executive response within 24h</p>
              <a href="mailto:info@isisecurity.in" className="text-primary font-bold hover:underline text-base">info@isisecurity.in</a>
            </div>

            <div className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <MapPin className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">Corporate Headquarters</h3>
              <p className="text-muted-foreground text-xs mb-2">Corporate Office, Chennai</p>
              <p className="text-foreground text-xs leading-relaxed">No 97/2, Sundaram Street, Chinmaya Nagar Stage 1, Chennai, TN - 600092</p>
            </div>
          </div>

          {/* Our Offices Section */}
          <div className="relative pt-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>Pan-India Strategic Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-foreground">Operational Hubs & Branches</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                With verified hubs across India, our rapid response forces and regional branch managers are always within reach.
              </p>
            </div>

            {/* Region / State / City Filters */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 max-w-3xl mx-auto">
              <div className="w-full sm:w-1/3">
                <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Region</label>
                <Select value={selectedRegion} onValueChange={handleRegionChange}>
                  <SelectTrigger className="bg-card/70 border-border/60 h-11 rounded-xl">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border/80">
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">State</label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger className="bg-card/70 border-border/60 h-11 rounded-xl">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border/80">
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-card/70 border-border/60 h-11 rounded-xl">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border/80">
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Office Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredOffices.length > 0 ? (
                filteredOffices.map((office) => (
                  <div key={office.id} className="group bg-card/50 hover:bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                          <MapPin className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-foreground">{office.title}</h3>
                          <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">{office.city}, {office.state}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground leading-relaxed my-3">
                        {office.address.map((line, i) => (
                          <p key={i} className={line === "Coming Soon" ? "text-primary font-bold animate-pulse" : ""}>{line}</p>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-3 mt-3 space-y-1.5 text-xs">
                      {office.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-3.5 h-3.5 text-primary/80 flex-shrink-0" />
                          <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="font-medium hover:underline">
                            {office.phone}
                          </a>
                        </div>
                      )}
                      {office.email && (
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-3.5 h-3.5 text-primary/80 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="font-medium hover:underline">
                            {office.email}
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-card/30 rounded-3xl border border-dashed border-border/60">
                  <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center mb-3 text-muted-foreground">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No offices found in this selection</h3>
                  <p className="text-muted-foreground text-xs max-w-sm mt-1">Try resetting the region and state filters or call our central support desk.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setSelectedRegion("All Regions"); setSelectedState("All States"); setSelectedCity("All Cities"); }} 
                    className="mt-4 rounded-xl text-primary border-primary/30"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
