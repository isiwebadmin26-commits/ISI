import { useState, useEffect } from "react";
import { MessageCircle, PhoneCall, Mail, Zap, ShieldAlert, Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";
import { FloatingLeadForm } from "@/components/FloatingLeadForm";

export const FloatingCTA = () => {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handleOpenForm = () => setIsFormOpen(true);
    window.addEventListener("open-lead-form", handleOpenForm);
    return () => window.removeEventListener("open-lead-form", handleOpenForm);
  }, []);

  const pathname = location.pathname.toLowerCase();

  // ═══════════════════════════════════════════════════════════════════════════
  // FORM EXCEPTIONS:
  // The global floating form must NOT appear on:
  // A. ISI Academy (/academy)
  // B. Career (/career)
  // C. Training (/courses)
  // D. Integrated Services (/lp/facility-management and aliases)
  // ═══════════════════════════════════════════════════════════════════════════
  const isAcademy = pathname.startsWith('/academy');
  const isCareer = pathname.startsWith('/career');
  const isTraining = pathname.startsWith('/courses');
  const isIntegratedServices = 
    pathname.startsWith('/lp/facility-management') ||
    pathname.startsWith('/integratedservices') ||
    pathname.startsWith('/integrated-services') ||
    pathname.startsWith('/salesinquiry') ||
    pathname.startsWith('/sales-inquiry');

  if (isAcademy || isCareer || isTraining || isIntegratedServices) {
    return null;
  }

  return (
    <>
      {/* Desktop Floating Options Group (Bottom Right, Left of ChatBot) */}
      <aside aria-label="Quick Contact and Expert Connect Options" className="hidden md:flex fixed bottom-6 right-24 z-40 items-center gap-2.5">
        {/* Floating Option 1: Connect Immediately to Our Security Expert */}
        <a
          href="https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20connect%20with%20an%20ISI%20Security%20Expert%20immediately."
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 px-4 py-3 bg-card/90 hover:bg-card text-foreground backdrop-blur-md rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-border/80 hover:border-emerald-500/50 cursor-pointer"
          title="Connect Immediately to our Security Expert"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-xs lg:text-sm tracking-wide text-foreground group-hover:text-emerald-500 transition-colors">
            Talk to Security Expert
          </span>
        </a>

        {/* Floating Option 2: Quick Contact Form (Opens Instant Quote / Quick Callback Modal) */}
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="group relative flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 border border-white/20 active:scale-95 cursor-pointer"
          title="Open Quick Contact Form"
        >
          <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="font-bold text-xs lg:text-sm tracking-wide">Quick Contact</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      </aside>

      {/* Mobile Sticky Floating CTA Options (Bottom Bar) */}
      <aside aria-label="Mobile Quick Contact Options" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
        <div className="flex h-16 items-center">
          {/* Call Hotline */}
          <a 
            href="tel:+917708887878" 
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full hover:bg-muted/50 transition-colors border-r border-border/50 text-foreground"
            title="Call 24/7 Security Hotline"
          >
            <PhoneCall className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-semibold">Call Hotline</span>
          </a>
          
          {/* Connect Immediately to Security Expert (WhatsApp) */}
          <a 
            href="https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20connect%20with%20an%20ISI%20Security%20Expert%20immediately."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full hover:bg-muted/50 transition-colors border-r border-border/50 text-foreground"
            title="Connect Immediately to our Security Expert"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Talk to Expert</span>
          </a>

          {/* Quick Contact Form (Opens Modal) */}
          <button 
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors cursor-pointer"
            title="Open Quick Contact Form"
          >
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[10px] font-bold">Quick Contact</span>
            </div>
            <span className="text-[9px] text-primary-foreground/80 font-normal">Instant Quote</span>
          </button>
        </div>
      </aside>

      {/* Global Quick Contact Form Modal */}
      <FloatingLeadForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </>
  );
};
