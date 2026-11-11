import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe2, 
  ShieldCheck, 
  CheckCircle2, 
  Video, 
  PhoneCall, 
  User, 
  Mail, 
  Building2, 
  Phone, 
  Sparkles, 
  CalendarPlus, 
  Download, 
  ExternalLink,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import SEO from '@/components/SEO';
import { tracker } from '@/utils/marketingTracker';
import { getUtmParams } from '@/utils/utm';
import { toast } from 'sonner';

interface SessionType {
  id: string;
  title: string;
  duration: string;
  description: string;
  icon: string;
  badge: string;
}

const AVAILABLE_SESSIONS: SessionType[] = [
  {
    id: 'sec-audit',
    title: 'Enterprise Security Vulnerability Audit',
    duration: '45 mins',
    description: 'Thorough evaluation of physical access, perimeter vulnerabilities, manned guard deployment, and statutory PSARA compliance.',
    icon: '🛡️',
    badge: 'Most Popular'
  },
  {
    id: 'ai-c4i-demo',
    title: 'AI Surveillance & C4i Command Center Demo',
    duration: '30 mins',
    description: 'Live interactive walkthrough of our 24/7 Security Operations Center (SOC) with AI video analytics, tripwire alerting, and drone integration.',
    icon: '📹',
    badge: 'Live Demo'
  },
  {
    id: 'ifm-consult',
    title: 'Integrated Facility Management (IFM) Consultation',
    duration: '45 mins',
    description: 'BMS optimization, MEP preventive maintenance, mechanized hygiene, energy auditing, and SLA management for corporate estates.',
    icon: '🏢',
    badge: 'Executive Brief'
  },
  {
    id: 'cash-logistics',
    title: 'Cash Logistics & Valuables Transit Planning',
    duration: '30 mins',
    description: 'Vaulting, ATM replenishment, GPS secured armored transit, and RBI regulatory compliance for banks, NBFCs, and jewelers.',
    icon: '💼',
    badge: 'BFSI Specialized'
  },
  {
    id: 'campus-safety',
    title: 'School & Campus Child-First Safety Blueprint',
    duration: '45 mins',
    description: 'Child-first protection framework, anti-bullying monitoring, biometric parent pick-up verification, and POSH/POCSO compliance.',
    icon: '🎓',
    badge: 'Institutional'
  }
];

const TIME_SLOTS = [
  '10:00 AM - 10:45 AM',
  '11:30 AM - 12:15 PM',
  '02:00 PM - 02:45 PM',
  '03:30 PM - 04:15 PM',
  '05:00 PM - 05:45 PM',
  '06:30 PM - 07:15 PM'
];

const TIME_ZONES = [
  { id: 'IST', label: 'IST (UTC+5:30) - India', offset: '+05:30' },
  { id: 'GST', label: 'GST (UTC+4:00) - Dubai / UAE', offset: '+04:00' },
  { id: 'SGT', label: 'SGT (UTC+8:00) - Singapore', offset: '+08:00' },
  { id: 'GMT', label: 'GMT/BST (UTC+1:00) - London', offset: '+01:00' },
  { id: 'EST', label: 'EST (UTC-5:00) - New York', offset: '-05:00' }
];

export const BookingPage: React.FC = () => {
  // Step 1: Session, Step 2: Date & Slot, Step 3: Confirmation
  const [selectedSession, setSelectedSession] = useState<SessionType>(AVAILABLE_SESSIONS[0]);
  const [selectedTimeZone, setSelectedTimeZone] = useState(TIME_ZONES[0]);
  
  // Date State (Defaults to tomorrow)
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [meetingMode, setMeetingMode] = useState<'video' | 'phone'>('video');

  // Contact State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [websiteHp, setWebsiteHp] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    leadId: string;
    sessionTitle: string;
    date: string;
    slot: string;
    mode: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !company) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    setIsSubmitting(true);
    const utm = getUtmParams();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'booking',
          fullName: name,
          email,
          phone,
          company,
          serviceInterest: selectedSession.title,
          preferredDate: selectedDate,
          preferredSlot: selectedSlot,
          timeZone: selectedTimeZone.label,
          meetingMode: meetingMode === 'video' ? 'Google Meet Video' : 'Phone Call',
          message: notes || `Booked: ${selectedSession.title} on ${selectedDate} at ${selectedSlot} (${selectedTimeZone.id})`,
          website_hp: websiteHp,
          pageUrl: window.location.href,
          ...utm
        })
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult({
          leadId: data.leadId,
          sessionTitle: selectedSession.title,
          date: selectedDate,
          slot: selectedSlot,
          mode: meetingMode === 'video' ? 'Google Meet Video Conference' : 'Executive Phone Call'
        });

        toast.success(`Booking Confirmed! Reference ID: ${data.leadId}`);
        tracker.track('booking_created', {
          leadType: 'booking',
          leadId: data.leadId,
          metadata: {
            session: selectedSession.title,
            date: selectedDate,
            slot: selectedSlot,
            timeZone: selectedTimeZone.id,
            company
          }
        });
        tracker.track('lead_generated', {
          leadType: 'booking',
          leadId: data.leadId
        });
      } else {
        toast.error(data.error || 'Failed to complete booking. Please retry.');
      }
    } catch (err) {
      toast.error('Network connection issue. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar Link Generator
  const googleCalendarUrl = useMemo(() => {
    if (!bookingResult) return '';
    const title = encodeURIComponent(`ISI Security Consultation: ${bookingResult.sessionTitle}`);
    const details = encodeURIComponent(
      `Consultation with ISI Security Senior Operations Team.\nBooking ID: ${bookingResult.leadId}\nMode: ${bookingResult.mode}\nSession: ${bookingResult.sessionTitle}\nHelpline: +91 77088 87878`
    );
    const location = encodeURIComponent(bookingResult.mode.includes('Google Meet') ? 'Google Meet (Link will be sent to email)' : 'Phone Call (+91 77088 87878)');
    // Format YYYYMMDDTHHmmssZ
    const dStr = bookingResult.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dStr}T053000Z/${dStr}T061500Z`;
  }, [bookingResult]);

  // ICS File Download Generator
  const downloadIcsFile = () => {
    if (!bookingResult) return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ISI Security//Enterprise Booking System//EN',
      'BEGIN:VEVENT',
      `UID:${bookingResult.leadId}@isisecurity.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${bookingResult.date.replace(/-/g, '')}T100000`,
      `DTEND:${bookingResult.date.replace(/-/g, '')}T104500`,
      `SUMMARY:ISI Security Consultation: ${bookingResult.sessionTitle}`,
      `DESCRIPTION:Booking ID: ${bookingResult.leadId}\\nMode: ${bookingResult.mode}\\nHelpline: +91 77088 87878`,
      `LOCATION:${bookingResult.mode}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `ISI-Booking-${bookingResult.leadId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO 
        title="Schedule Enterprise Security Consultation | Official Booking | ISI Security"
        description="Book a dedicated 1-on-1 consultation with ISI Security directors. Select your service audit, date, time slot, and timezone. Integrated with Google Calendar and Outlook."
        canonicalPath="/booking"
      />

      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base">
            ISI
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">
            Enterprise Booking Hub
          </span>
        </a>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="hidden sm:inline">Direct Helpline: <a href="tel:+917708887878" className="text-blue-400 font-medium">+91 77088 87878</a></span>
          <a href="/chat" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
            Chat with AI
          </a>
        </div>
      </header>

      {/* Booking Hero / Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {!bookingResult ? (
          <div>
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Security & Operations Planning
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Schedule a 1-on-1 Strategic Session
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Choose an advisory session below. Our senior operations directors and certified security auditors will review your site specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Select Session Catalog */}
              <div className="lg:col-span-5 space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  1. Select Consultation Module
                </h2>

                {AVAILABLE_SESSIONS.map((sess) => {
                  const isSelected = selectedSession.id === sess.id;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => setSelectedSession(sess)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{sess.icon}</span>
                          <h3 className={`text-sm font-semibold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                            {sess.title}
                          </h3>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          {sess.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {sess.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Date, Slot & Contact Info */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <input
                    type="text"
                    value={websiteHp}
                    onChange={(e) => setWebsiteHp(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Time Zone & Mode Selectors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                        <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                        Time Zone
                      </label>
                      <select
                        value={selectedTimeZone.id}
                        onChange={(e) => {
                          const found = TIME_ZONES.find(t => t.id === e.target.value);
                          if (found) setSelectedTimeZone(found);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                      >
                        {TIME_ZONES.map(tz => (
                          <option key={tz.id} value={tz.id}>{tz.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                        <Video className="w-3.5 h-3.5 text-blue-400" />
                        Preferred Format
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setMeetingMode('video')}
                          className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition ${
                            meetingMode === 'video'
                              ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Google Meet</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMeetingMode('phone')}
                          className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition ${
                            meetingMode === 'phone'
                              ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Phone Call</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Date & Slot Picker */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      2. Choose Date & Time
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Select Consultation Date</label>
                        <input
                          type="date"
                          min={tomorrow}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Available Hourly Slots</label>
                        <select
                          value={selectedSlot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                        >
                          {TIME_SLOTS.map((s, idx) => (
                            <option key={`slot-${idx}`} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Attendee Details */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      3. Organization & Attendee Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-300 block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Vikramaditya Sen"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Company / Facility Name *</label>
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Apex Tech Parks Pvt Ltd"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Work Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vsen@apextech.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Direct Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98400 12345"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="text-slate-300 block mb-1">Facility Size / Specific Security Challenges</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Multi-story IT campus, 2500 staff, requiring manned guarding and 24/7 CCTV surveillance..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    {isSubmitting ? (
                      'Locking Slot...'
                    ) : (
                      <>
                        <span>Confirm Appointment & Receive Calendar Invite</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Free Advisory Session • No Obligation • Confirmed by ISI Operations Director</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation & Calendar Integrations Screen */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                Appointment Confirmed
              </span>
              <h2 className="text-2xl font-bold text-white mt-3">
                Your Security Consultation is Locked
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Booking Reference ID: <strong className="text-blue-400 font-mono">{bookingResult.leadId}</strong>
              </p>
            </div>

            {/* Session Summary Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation:</span>
                <span className="font-semibold text-slate-200">{bookingResult.sessionTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-200">{bookingResult.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Slot:</span>
                <span className="font-semibold text-slate-200">{bookingResult.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Meeting Format:</span>
                <span className="font-semibold text-slate-200">{bookingResult.mode}</span>
              </div>
            </div>

            {/* Calendar Export Buttons */}
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-400">Add this session directly to your calendar:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  onClick={downloadIcsFile}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition border border-slate-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Download iCal / Outlook (.ics)</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Need immediate assistance?</span>
              <a href="tel:+917708887878" className="text-blue-400 hover:underline font-medium">
                Call +91 77088 87878
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;

