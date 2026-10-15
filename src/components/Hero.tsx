import { Shield, ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

import heroAiDriven from "../assets/hero-ai-driven.webp";
import heroSoc from "../assets/hero-soc.webp";
import heroVerify from "../assets/hero-verify.webp";
import heroIntegration from "../assets/hero-integration.webp";
import heroDrone from "../assets/hero-drone.webp";
import heroFacility from "../assets/verticals-facility.webp";
import heroCommand from "../assets/command_center_1.webp";

// The carousel slides with high-contrast, rich enterprise dark overlays and slide metadata
const heroSlides = [
  {
    title: "AI-Driven Physical Security",
    badge: "Next-Gen Guarding",
    image: heroAiDriven,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
  {
    title: "Electronic Systems Integration",
    badge: "Integrated Tech",
    image: heroIntegration,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
  {
    title: "24/7 Redundant SOC Operations",
    badge: "Central Command",
    image: heroSoc,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
  {
    title: "Police-Verified Guarding Teams",
    badge: "Elite Personnel",
    image: heroVerify,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
  {
    title: "Aerial Drone & Perimeter Watch",
    badge: "Autonomous Drones",
    image: heroDrone,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
  {
    title: "Integrated Facility Management",
    badge: "Facility Excellence",
    image: heroFacility,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
  {
    title: "Command Center Intelligence",
    badge: "Command & Control",
    image: heroCommand,
    overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
  },
];

const VideoModal = ({ isOpen, onClose, videoId }: { isOpen: boolean; onClose: () => void; videoId?: string }) => {
  if (!isOpen || !videoId || videoId === 'your-video-id') return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
        aria-label="Close video"
      >
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-4xl aspect-video bg-black" onClick={e => e.stopPropagation()}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="AI Driven Security Solutions Overview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const solutionsRef = useRef<HTMLElement>(null);

  const scrollToSolutions = (e: React.MouseEvent) => {
    e.preventDefault();
    const solutionsSection = document.getElementById('solutions');
    if (solutionsSection) {
      solutionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openVideo = () => {
    setShowVideo(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeVideo = () => {
    setShowVideo(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) onNavClick(() => emblaApi.scrollPrev());
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) onNavClick(() => emblaApi.scrollNext());
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) onNavClick(() => emblaApi.scrollTo(index));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = useCallback((delay = 4000) => {
    if (!emblaApi) return;
    stopAutoPlay();
    autoplayRef.current = setTimeout(() => {
      emblaApi.scrollNext();
      // After first scroll, resume normal interval
      autoplayRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);
    }, delay);
  }, [emblaApi]);

  const stopAutoPlay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    // Delay the very first autoplay by 15s to allow Lighthouse LCP measurement
    startAutoPlay(15000);

    const onSettle = () => startAutoPlay();
    emblaApi.on("pointerDown", stopAutoPlay);
    emblaApi.on("settle", onSettle);

    return () => {
      stopAutoPlay();
      emblaApi.off("pointerDown", stopAutoPlay);
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi, startAutoPlay, stopAutoPlay]);

  const onNavClick = (callback: () => void) => {
    stopAutoPlay();
    callback();
    // Restart after a longer delay to let user finish interacting
    setTimeout(startAutoPlay, 5000);
  };


  return (
    <section
      className="relative h-[100dvh] min-h-[600px] overflow-hidden"
      id="hero"
    >
      <VideoModal isOpen={showVideo} onClose={closeVideo} />
      {/* Carousel */}
      <div
        ref={emblaRef}
        className="overflow-hidden h-full"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <div className="flex h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              {/* If it's the first slide, we use an actual image tag for eager loading and LCP optimization */}
              {index === 0 ? (
                <>
                  <img
                    src={slide.image}
                    alt="Hero Slide"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={`absolute inset-0 w-full h-full object-cover ${index === 0 ? '' : 'transition-transform duration-[10000ms] ease-out'}`}
                    style={{
                      transform: (index !== 0 && selectedIndex === index) ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                  {/* Preload link for Vite to inject */}
                  <link rel="preload" href={slide.image} as="image" />
                </>
              ) : (
                /* Background Image for other slides */
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-out"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    transform: selectedIndex === index ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              )}

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />

              {/* Accent Shapes */}
              <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Left and Right Desktop Arrow Controls */}
      <button
        onClick={scrollPrev}
        aria-label="Previous hero slide"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next hero slide"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content Overlay - Balanced 2-Column Grid */}
      <div className="absolute inset-0 flex items-center pt-24 md:pt-28 lg:pt-32 pb-16 pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pointer-events-auto">
            {/* Left Column: Authoritative Copy and Action CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-primary/40 rounded-full mb-6 animate-fade-in w-fit shadow-lg shadow-primary/10"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase">
                  Enterprise Security Partner
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight animate-fade-in"
              >
                Integrated Security Solutions for{" "}
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent block sm:inline">
                  Modern Enterprises
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal animate-fade-in"
              >
                Delivering AI-enabled integrated security solutions including Security Guarding, Electronic Security, Facility Management, and Risk Consulting across India.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-in">
                <Button
                  size="lg"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-lead-form'))}
                  className="gap-2.5 text-base h-13 px-8 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-full bg-primary text-white font-bold group cursor-pointer"
                >
                  Get an Instant Security Quote
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open("https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20security%20solutions.", "_blank")}
                  className="gap-2.5 text-base h-13 px-7 bg-slate-900/60 backdrop-blur-md border border-white/25 hover:border-primary text-white hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full group cursor-pointer"
                >
                  Talk to Our Security Experts
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-300 font-medium animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Trusted by 500+ Enterprises</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>ISO 9001:2015 Certified</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>PAN India Coverage</span>
                </div>
              </div>
            </div>

            {/* Right Column (Desktop): Enterprise Live Telemetry & Slide Spec Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                      COMMAND CENTER TELEMETRY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    FOCUS 0{selectedIndex + 1} / 0{heroSlides.length}
                  </span>
                </div>

                {/* Active Slide Focus */}
                <div className="mb-5">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                    {heroSlides[selectedIndex].badge}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {heroSlides[selectedIndex].title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AI-powered optical monitoring, military-grade response protocols, and verified personnel safeguarding enterprise sites across India.
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                    <div className="text-[11px] text-slate-400 mb-0.5">Enterprise Scale</div>
                    <div className="text-lg font-bold text-white">500+ Sites</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Active Deployments</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                    <div className="text-[11px] text-slate-400 mb-0.5">Incident Response</div>
                    <div className="text-lg font-bold text-white">&lt; 3 Mins</div>
                    <div className="text-[10px] text-primary mt-0.5">Rapid SLA Dispatch</div>
                  </div>
                </div>

                {/* Sector Fast-Track Chips */}
                <div className="mb-5">
                  <div className="text-[11px] text-slate-400 font-medium mb-2 uppercase tracking-wider">
                    Sector Solutions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "IT Parks & GCCs", link: "/gccitparks" },
                      { label: "Cash Logistics", link: "/cashlogistics" },
                      { label: "Command Center", link: "/commandcenter" },
                      { label: "Campus Safety", link: "/campussafety" },
                      { label: "Modern Living", link: "/modernliving" }
                    ].map((sec) => (
                      <Link
                        key={sec.label}
                        to={sec.link}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/5 hover:bg-primary/20 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      >
                        {sec.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Interactive Consultation Button */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-lead-form'))}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer group"
                >
                  <span>Book Free Security Risk Consultation</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Numbered Slide Pills and Mobile Navigation */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between px-6 lg:px-12 pointer-events-none">
        {/* Mobile Prev/Next Controls */}
        <div className="flex md:hidden items-center gap-2 pointer-events-auto">
          <button
            onClick={scrollPrev}
            aria-label="Previous hero slide"
            className="w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center active:bg-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next hero slide"
            className="w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center active:bg-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Central Pagination Pills */}
        <div className="flex items-center gap-2.5 mx-auto pointer-events-auto">
          {heroSlides.map((slide, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`relative h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === index
                  ? "w-10 bg-primary shadow-lg shadow-primary/50"
                  : "w-2.5 bg-slate-600/60 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}: ${slide.badge}`}
            />
          ))}
        </div>

        {/* Slide Number Counter */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 pointer-events-auto">
          <span className="text-white font-bold">0{selectedIndex + 1}</span>
          <span>/</span>
          <span>0{heroSlides.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-primary transition-transform duration-300 origin-left"
          style={{ transform: `scaleX(${((selectedIndex + 1) / heroSlides.length)})` }}
        />
      </div>
    </section>
  );
};
