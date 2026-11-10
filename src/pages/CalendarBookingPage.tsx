import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import SEO from '@/components/SEO';
import { useContentProtection } from '@/hooks/useContentProtection';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  PhoneCall, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Award, 
  MapPin, 
  Briefcase 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { submitAcademyInquiry } from '@/services/formService';
import { validatePhoneNumber } from '@/utils/validation';

// Available hourly time slots
const TIME_SLOTS = [
  { id: 'm1', label: '10:00 AM – 11:00 AM', period: 'Morning' },
  { id: 'm2', label: '11:30 AM – 12:30 PM', period: 'Morning' },
  { id: 'a1', label: '02:00 PM – 03:00 PM', period: 'Afternoon' },
  { id: 'a2', label: '03:30 PM – 04:30 PM', period: 'Afternoon' },
  { id: 'e1', label: '05:00 PM – 06:00 PM', period: 'Evening' },
  { id: 'e2', label: '06:30 PM – 07:30 PM', period: 'Evening' },
];

export const CalendarBookingPage: React.FC = () => {
  useContentProtection();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'AI & Advanced Computing',
    enquiryType: 'Academic Counseling',
    mode: 'Google Meet (Video Call)',
    preferredDate: todayStr,
    preferredSlot: '10:00 AM – 11:00 AM',
    background: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  // Generates 1-click Google Calendar Event URL
  const googleCalendarUrl = useMemo(() => {
    const title = encodeURIComponent(`ISI Academy — 1-on-1 Counseling (${formData.program})`);
    const details = encodeURIComponent(
      `Academic & Career Counseling Session with ISI Security Academy.\n` +
      `Mode: ${formData.mode}\n` +
      `Selected Slot: ${formData.preferredSlot}\n` +
      `Candidate: ${formData.name}\n` +
      `Direct Support: +91 77088 87878\n` +
      `Website: https://www.isisecurity.in/academy`
    );
    const location = encodeURIComponent(
      formData.mode.includes('Campus') 
        ? 'ISI Security Corporate Campus, Chennai' 
        : (formData.mode.includes('Video') ? 'Google Meet' : 'Phone Call')
    );

    let startHour = 10;
    let endHour = 11;
    if (formData.preferredSlot.includes('11:30')) { startHour = 11; endHour = 12; }
    else if (formData.preferredSlot.includes('02:00')) { startHour = 14; endHour = 15; }
    else if (formData.preferredSlot.includes('03:30')) { startHour = 15; endHour = 16; }
    else if (formData.preferredSlot.includes('05:00')) { startHour = 17; endHour = 18; }
    else if (formData.preferredSlot.includes('06:30')) { startHour = 18; endHour = 19; }

    const baseDate = formData.preferredDate ? new Date(formData.preferredDate) : new Date();
    const y = baseDate.getFullYear();
    const m = String(baseDate.getMonth() + 1).padStart(2, '0');
    const d = String(baseDate.getDate()).padStart(2, '0');
    const sh = String(startHour).padStart(2, '0');
    const eh = String(endHour).padStart(2, '0');

    const dates = `${y}${m}${d}T${sh}0000/${y}${m}${d}T${eh}0000`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }, [formData]);

  // Download .ics Calendar File
  const handleDownloadIcs = () => {
    const summary = `ISI Academy — 1-on-1 Counseling (${formData.program})`;
    const description = `Academic & Career Counseling Session with ISI Security Academy.\nMode: ${formData.mode}\nSelected Slot: ${formData.preferredSlot}\nCandidate: ${formData.name}\nHelpline: +91 77088 87878`;
    const location = formData.mode.includes('Campus') ? 'ISI Security Campus, Chennai' : formData.mode;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ISI Security Academy//Counseling Session//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      `DTSTART:${formData.preferredDate.replace(/-/g, '')}T100000Z`,
      `DTEND:${formData.preferredDate.replace(/-/g, '')}T110000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `ISI_Academy_Session_${formData.preferredDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendar .ics file downloaded!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    const phoneVal = validatePhoneNumber(formData.phone);
    if (!phoneVal.isValid) newErrors.phone = phoneVal.message || 'Valid 10-digit phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const detailedMessage = [
        `Counseling Mode: ${formData.mode}`,
        `Preferred Date: ${formData.preferredDate}`,
        `Preferred Slot: ${formData.preferredSlot}`,
        formData.background ? `Background: ${formData.background}` : '',
        formData.message ? `Notes: ${formData.message}` : ''
      ].filter(Boolean).join(' | ');

      const res = await submitAcademyInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        enquiryType: 'Calendar Counseling Booking',
        message: detailedMessage
      });

      const ref = (res && typeof res === 'object' && 'leadNumber' in res) 
        ? String(res.leadNumber) 
        : `ISI-CAL-${Math.floor(100000 + Math.random() * 900000)}`;

      setReferenceNumber(ref);
      setIsSubmitted(true);
      toast.success('Slot Booked Successfully!', {
        description: `Ref: ${ref}. Check your inbox for confirmation.`
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting calendar booking:', err);
      toast.error('Submission Issue', {
        description: 'Unable to complete slot booking. Please try again or call +91 77088 87878.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO 
        title="Book 1-on-1 Academic Counseling & Strategy Session | ISI Security Academy"
        description="Schedule a 1-on-1 personalized academic counseling session. Select your preferred date, choose a live time slot, and meet with our senior advisors via Google Meet, phone, or campus walk-in."
        canonical="/calendar"
      />

      <div className="bg-background min-h-screen py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* PAGE HERO HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <CalendarIcon className="w-4 h-4" />
              <span>Live Counselor Booking Calendar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
              Book Your 1-on-1 Academic &amp; Career Counseling Session
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Select your preferred date, pick a live time slot, and lock in dedicated one-on-one time with ISI Security Academy directors and technology advisors.
            </p>
          </div>

          {/* SUBMISSION CONFIRMATION VIEW */}
          {isSubmitted ? (
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                  Booking Confirmed &bull; Ref: {referenceNumber}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-3">
                  Your Counseling Slot is Locked In!
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-foreground">{formData.name}</strong>. A confirmation email has been dispatched to <strong className="text-foreground">{formData.email}</strong>. Our counseling board has been alerted with your session preferences.
                </p>
              </div>

              {/* BOOKING RECAP CARD */}
              <div className="bg-muted/40 border border-border rounded-2xl p-6 text-left space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-border/60 pb-2.5">
                  <span className="text-muted-foreground font-medium">Session Mode</span>
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-primary" />
                    {formData.mode}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border/60 pb-2.5">
                  <span className="text-muted-foreground font-medium">Date &amp; Slot</span>
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    {formData.preferredDate} ({formData.preferredSlot})
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border/60 pb-2.5">
                  <span className="text-muted-foreground font-medium">Domain / Course</span>
                  <span className="font-bold text-foreground">{formData.program}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Contact Phone</span>
                  <span className="font-bold text-foreground">{formData.phone}</span>
                </div>
              </div>

              {/* CALENDAR EXPORT ACTIONS */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-6 rounded-xl shadow-lg shadow-primary/20 gap-2"
                >
                  <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>

                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleDownloadIcs}
                  className="font-semibold px-6 py-6 rounded-xl border-border hover:bg-muted gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ics Invite</span>
                </Button>
              </div>

              <div className="pt-4 border-t border-border/60">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Book Another Session
                </Button>
              </div>
            </div>
          ) : (
            /* MAIN FULL-PAGE BOOKING GRID */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: FULL BOOKING LONG FORM */}
              <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* STEP 1: COUNSELING MODE */}
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">
                      Step 1: Select Counseling Mode *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Google Meet', value: 'Google Meet (Video Call)', desc: 'Online 1-on-1 link emailed', icon: Video },
                        { label: 'Direct Phone Call', value: 'Phone Call', desc: 'Advisor calls your number', icon: PhoneCall },
                        { label: 'Campus Walk-in', value: 'Campus Visit (Chennai/Madurai/CBE)', desc: 'Meet in-person at center', icon: Building2 }
                      ].map((item) => {
                        const IconComp = item.icon;
                        const isSelected = formData.mode === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, mode: item.value })}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                              isSelected 
                                ? 'bg-primary/10 border-primary text-primary shadow-md shadow-primary/10' 
                                : 'bg-muted/20 border-border text-foreground hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <IconComp className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold">{item.label}</div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: DATE & TIME SLOT SELECTION */}
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">
                      Step 2: Choose Your Date &amp; Time Slot *
                    </label>

                    {/* Date Picker Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground block mb-1">Pick a Date</span>
                        <div className="relative">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                          <input 
                            type="date"
                            min={todayStr}
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary font-medium"
                          />
                        </div>
                      </div>

                      {/* Instant Google Calendar Direct Link */}
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-foreground">Google Calendar</div>
                          <div className="text-[11px] text-muted-foreground">Add directly to your personal schedule</div>
                        </div>
                        <a 
                          href={googleCalendarUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Time Slot Grid */}
                    <span className="text-xs font-semibold text-muted-foreground block mb-2">Available Daily Slots</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = formData.preferredSlot === slot.label;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, preferredSlot: slot.label })}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isSelected 
                                ? 'bg-primary border-primary text-primary-foreground font-bold shadow-md shadow-primary/25' 
                                : 'bg-muted/20 border-border text-foreground hover:bg-muted/40 font-medium'
                            }`}
                          >
                            <div className="text-xs">{slot.label}</div>
                            <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                              {slot.period}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 3: CONTACT & INQUIRY DETAILS */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-foreground block">
                      Step 3: Candidate &amp; Inquiry Information *
                    </label>

                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Anand Kumar"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      {errors.name && <p className="text-[11px] text-destructive mt-1">{errors.name}</p>}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">Email Address *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                          <input 
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        {errors.email && <p className="text-[11px] text-destructive mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                          <input 
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        {errors.phone && <p className="text-[11px] text-destructive mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Program Selection */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Domain / Program of Interest *</label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                      >
                        <optgroup label="Technology Tracks (C-DAC Aligned)">
                          <option value="AI & Advanced Computing">AI & Advanced Computing (C-DAC PG-DAC Aligned)</option>
                          <option value="Cyber Security & Forensics">Cyber Security, SOC & Digital Forensics</option>
                          <option value="IoT & Industrial Automation">IoT & Industrial Automation (SCADA/PLC)</option>
                          <option value="Automotive Cyber & EV">Automotive Cybersecurity & EV Systems</option>
                          <option value="Robotics & Drone Analytics">Robotics & Drone Reconnaissance Analytics</option>
                          <option value="Data Center Infrastructure">Data Center Infrastructure & Mission-Critical MEP</option>
                        </optgroup>
                        <optgroup label="Facility Management Tracks">
                          <option value="Hard Facility Management (MEP)">Hard Facility Management (Technical MEP & HVAC)</option>
                          <option value="Soft Facility Management">Soft Facility Management & Mechanized Operations</option>
                          <option value="Smart Building Energy IoT">Smart Building Energy Auditing (PUE Sub-1.2)</option>
                        </optgroup>
                        <optgroup label="Guarding Security Tracks">
                          <option value="PSARA Guarding & Patrols">PSARA Guarding & Physical Security Operations</option>
                          <option value="Command Center (C4i) Ops">Command Center (C4i) & Video Surveillance Ops</option>
                          <option value="Tactical Emergency & Fire">Tactical Emergency, Evacuation & Fire Safety</option>
                        </optgroup>
                        <optgroup label="Enterprise & Institutional">
                          <option value="Corporate Workforce Training">Corporate Workforce Upskilling & Cohort Training</option>
                          <option value="Institutional MoU / Partnership">University MoU & Campus Recruitment Tie-up</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Educational / Professional Background */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Educational Background / Current Role (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g. B.E. Computer Science Graduate, Security Manager, Facility Lead"
                        value={formData.background}
                        onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* Specific Questions / Notes */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Specific Questions / Session Goals (Optional)</label>
                      <textarea 
                        rows={3}
                        placeholder="Share your career goals, questions about batch timing, placement assistance, or certification..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-xl shadow-primary/25 gap-2"
                    >
                      {isSubmitting ? "Confirming Session Slot..." : "Confirm & Lock In Counseling Slot"}
                      <Send className="w-5 h-5" />
                    </Button>
                    <p className="text-center text-[11px] text-muted-foreground mt-3">
                      By confirming, your session notification is sent to our academic board and an automated confirmation email is sent to your inbox.
                    </p>
                  </div>

                </form>
              </div>

              {/* RIGHT COLUMN: VALUE PILLARS & TRUST BADGES */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* COUNSELOR HIGHLIGHT CARD */}
                <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Why Book a 1-on-1 Session?</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Gain direct clarity on which technology, security, or facility management track best aligns with your qualifications and salary expectations.
                  </p>

                  <ul className="mt-5 space-y-3 text-xs text-foreground/90">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Curriculum Deep-Dive:</strong> Overview of hands-on lab modules, C-DAC alignment, and certification exams.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Placement &amp; Salary Guidance:</strong> Insights into domestic deployment across India and overseas roles in 10+ nations.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Flexible Learning Modes:</strong> 90+30 Days normal cohort or 180+180 Days advanced residential programs.</span>
                    </li>
                  </ul>
                </div>

                {/* CAMPUS HUBS CARD */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Physical Training Hubs</span>
                  </h4>
                  <div className="space-y-2.5 text-xs text-muted-foreground">
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <strong className="text-foreground block">Chennai Central Hub</strong>
                      <span>Corporate Command &amp; Cyber Defense Center</span>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <strong className="text-foreground block">Coimbatore Regional Campus</strong>
                      <span>Facility Management, MEP &amp; Guarding Center</span>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <strong className="text-foreground block">Madurai Academy Center</strong>
                      <span>Security Guarding &amp; Tactical Training Academy</span>
                    </div>
                  </div>
                </div>

                {/* HELPLINE CALLOUT */}
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 text-center space-y-2">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Need Immediate Help?</span>
                  <div className="text-lg font-black text-foreground">+91 77088 87878</div>
                  <p className="text-xs text-muted-foreground">
                    Speak directly with our Admissions Desk (Mon–Sat, 9:00 AM – 7:00 PM IST)
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default CalendarBookingPage;

