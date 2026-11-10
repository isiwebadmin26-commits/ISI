import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  PhoneCall, 
  Building2, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { submitAcademyInquiry } from '@/services/formService';
import { validatePhoneNumber } from '@/utils/validation';

export interface BookCounsellorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgram?: string;
  calendarLink?: string; // Optional external Google Calendar / Calendly appointment scheduling link
}

// Generates instant 1-click Google Calendar Event Link
const getDynamicGoogleCalendarUrl = (dateStr: string, slotStr: string, program: string, mode: string) => {
  const title = encodeURIComponent(`ISI Academy — 1-on-1 Counseling (${program || 'Technology & Security Training'})`);
  const details = encodeURIComponent(`Academic & Career Counseling Session with ISI Security Academy.\nMode: ${mode}\nSelected Slot: ${slotStr}\nHelpline: +91 77088 87878\nOfficial Site: https://www.isisecurity.in/academy`);
  const location = encodeURIComponent(mode.includes('Campus') ? 'ISI Security Academy Campus, Chennai' : (mode.includes('Video') ? 'Google Meet (Link will be emailed)' : 'Phone Call'));

  let startHour = 10;
  let endHour = 11;
  if (slotStr.includes('Afternoon')) { startHour = 14; endHour = 15; }
  else if (slotStr.includes('Evening')) { startHour = 17; endHour = 18; }

  const baseDate = dateStr ? new Date(dateStr) : new Date(Date.now() + 86400000);
  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, '0');
  const d = String(baseDate.getDate()).padStart(2, '0');
  const sh = String(startHour).padStart(2, '0');
  const eh = String(endHour).padStart(2, '0');

  const dates = `${y}${m}${d}T${sh}0000/${y}${m}${d}T${eh}0000`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
};

export const BookCounsellorModal: React.FC<BookCounsellorModalProps> = ({
  isOpen,
  onClose,
  initialProgram = '',
  calendarLink = import.meta.env.VITE_CALENDAR_BOOKING_URL || ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: initialProgram || 'General Academy Program',
    enquiryType: 'Academic Counseling',
    mode: 'Google Meet (Video Call)',
    preferredDate: '',
    preferredSlot: 'Morning (10:00 AM - 1:00 PM)',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opened or closed
  const handleClose = () => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
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
        `Preferred Date: ${formData.preferredDate || 'Earliest Available'}`,
        `Preferred Slot: ${formData.preferredSlot}`,
        formData.message ? `Notes: ${formData.message}` : ''
      ].filter(Boolean).join(' | ');

      await submitAcademyInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program || initialProgram,
        enquiryType: formData.enquiryType,
        message: detailedMessage
      });

      setIsSuccess(true);
      toast.success('Counseling Session Booked!', {
        description: 'Our senior academic counselor will reach out via your preferred mode.'
      });
    } catch (error) {
      console.error('Error booking counseling session:', error);
      toast.error('Booking Error', {
        description: 'Unable to schedule right now. Please try again or call +91 77088 87878.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Session Request Confirmed</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-foreground">{formData.name}</strong>. A confirmation email has been sent to <strong className="text-foreground">{formData.email}</strong>. Our academic team is reviewing your preferred slot (<span className="text-primary font-medium">{formData.preferredSlot}</span>) and will connect with you shortly.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <a 
                href={calendarLink || getDynamicGoogleCalendarUrl(formData.preferredDate, formData.preferredSlot, formData.program, formData.mode)}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl transition-colors"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Add Slot to Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-4">
              <Button onClick={handleClose} className="rounded-xl px-8">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Book Academic Counseling</h3>
                <p className="text-xs text-muted-foreground">
                  1-on-1 Guidance for Certification, Career Trajectories & Lab Admissions
                </p>
                {initialProgram && (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {initialProgram}
                  </span>
                )}
              </div>
            </div>

            {/* Direct Calendar Booking Banner */}
            <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-semibold text-foreground">Lock in your slot directly</span>
                <p className="text-[11px] text-muted-foreground">Select date &amp; slot below, or add to your Google Calendar.</p>
              </div>
              <a 
                href={calendarLink || getDynamicGoogleCalendarUrl(formData.preferredDate, formData.preferredSlot, formData.program, formData.mode)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Long Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-destructive mt-1">{errors.name}</p>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input 
                      type="email" 
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Domain / Program */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Domain of Interest *</label>
                  <select 
                    required
                    value={formData.enquiryType}
                    onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="Academic Counseling">Academic Counseling</option>
                    <option value="Technology">Technology (AI, Cyber, Cloud)</option>
                    <option value="Facility Management">Facility Management (MEP, Soft FM)</option>
                    <option value="Guarding Security">Guarding & Physical Security</option>
                    <option value="Corporate Workforce Training">Corporate Workforce Training</option>
                    <option value="Institutional Partnership">Institutional Partnership / MoU</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Specific Program / Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. C-DAC PG-DAC, Cyber Defense"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Counseling Mode */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Preferred Mode of Counseling *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Google Meet', value: 'Google Meet (Video Call)', icon: Video },
                    { label: 'Phone Call', value: 'Phone Call', icon: PhoneCall },
                    { label: 'Campus Visit', value: 'Campus Visit (Chennai/Madurai/CBE)', icon: Building2 }
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = formData.mode === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, mode: item.value })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected 
                            ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                            : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mb-1" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot (Calendar Selection) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Preferred Date</label>
                  <div className="relative">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Preferred Time Slot</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={formData.preferredSlot}
                      onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                      <option value="Evening (5:00 PM - 7:30 PM)">Evening (5:00 PM - 7:30 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Message / Questions */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Questions / Background (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="Tell us about your educational background, current role, or specific questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1 py-5 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-5 rounded-xl gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? "Confirming Slot..." : "Confirm Booking"}
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookCounsellorModal;

