import { Shield, ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight, X, Sparkles, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import heroAiDriven from "../assets/hero-ai-driven.webp";
import heroSoc from "../assets/hero-soc.webp";
import heroVerify from "../assets/hero-verify.webp";
import heroIntegration from "../assets/hero-integration.webp";
import heroDrone from "../assets/hero-drone.webp";
import heroFacility from "../assets/verticals-facility.webp";
import heroCommand from "../assets/command_center_1.webp";

interface HomeSlide {
  badge: string;
  title: string;
  highlight: string;
  titleEnd?: string;
  description: string;
  image: string;
  tags: string[];
  telemetry: string;
}

const homeHeroSlides: HomeSlide[] = [
  {
    badge: "AI-Driven Smart Guarding",
    title: "Integrated Security for",
    highlight: "Modern Enterprises",
    titleEnd: "",
    description: "Combining elite trained guarding personnel with edge AI computer vision, situational awareness, and predictive incident deterrence across India.",
    image: heroAiDriven,
    tags: ["Autonomous Guarding", "Facial AI Recognition", "Zero-Latency Alerts"],
    telemetry: "500+ Sites Live"
  },
  {
    badge: "Cyber-Physical Convergence",
    title: "Unified Electronic",
    highlight: "Perimeter Defense",
    titleEnd: "& IoT Sensors",
    description: "Converging multi-layered physical access control, thermal CCTV arrays, anti-intrusion radar, and BMS sensors into an impenetrable defensive envelope.",
    image: heroIntegration,
    tags: ["Sensor Fusion", "Zero-Trust Access", "Thermal Radar"],
    telemetry: "10,000+ IoT Feeds"
  },
  {
    badge: "24/7 Command Center",
    title: "Mission-Critical",
    highlight: "Security Operations",
    titleEnd: "Center (SOC)",
    description: "Centralized pan-India command hubs orchestrating real-time crisis escalation, tactical response dispatch, and AI workforce telemetry round the clock.",
    image: heroSoc,
    tags: ["Pan-India Command", "Tactical Dispatch", "Crisis Escalation"],
    telemetry: "24/7 SOC Operational"
  },
  {
    badge: "Workforce Trust & Integrity",
    title: "Comprehensive",
    highlight: "Background Verification",
    titleEnd: "& Screening",
    description: "Automated, AI-assisted candidate screening, court record checks, identity validation, and regulatory audits reducing hiring risks by 40%.",
    image: heroVerify,
    tags: ["Digital Verification", "Court Records", "Instant Turnaround"],
    telemetry: "100% RBI/ISO Compliant"
  },
  {
    badge: "Autonomous Drone Intelligence",
    title: "Aerial Surveillance &",
    highlight: "Tactical Drone Patrols",
    titleEnd: "",
    description: "Autonomous aerial perimeter inspections, thermal night vision, high-altitude hazard monitoring, and rapid emergency reconnaissance.",
    image: heroDrone,
    tags: ["Autonomous Drones", "Thermal Night Vision", "Perimeter Patrol"],
    telemetry: "Airspace Surveillance Active"
  },
  {
    badge: "Integrated Facility Management",
    title: "Smart Facility Ops &",
    highlight: "Critical Infrastructure",
    titleEnd: "",
    description: "Transforming enterprise facilities and campus infrastructure with predictive engineering maintenance, ESG compliance, and zero downtime.",
    image: heroFacility,
    tags: ["Smart Facilities", "Predictive Maintenance", "ESG Compliant"],
    telemetry: "Campus Safety Active"
  },
  {
    badge: "Integrated Command Architecture",
    title: "Enterprise Command &",
    highlight: "Incident Intelligence",
    titleEnd: "Platform",
    description: "Unified situational dashboard empowering C-suite and security chiefs with live threat heatmaps, asset tracking, and automated SOP workflows.",
    image: heroCommand,
    tags: ["Unified C2 Dashboard", "Automated SOPs", "Live Threat Heatmaps"],
    telemetry: "Threat Intelligence Live"
  }
];

const VideoModal = ({ isOpen, onClose, videoId }: { isOpen: boolean; onClose: () => void; videoId?: string }) => {
  if (!isOpen || !videoId || videoId === 'your-video-id') return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-primary transition-colors cursor-pointer"
        aria-label="Close video"
      >
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
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
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const autoplayDelay = 5500;
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setProgress(0);
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setProgress(0);
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      setProgress(0);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setProgress(0);
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Smooth Autoplay progress bar
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const intervalMs = 50;
    const step = (intervalMs / autoplayDelay) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          emblaApi.scrollNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [emblaApi, autoplayDelay, isPaused]);

  const activeSlide = homeHeroSlides[selectedIndex] || homeHeroSlides[0];

  return (
    <section
      className="relative overflow-hidden bg-background min-h-[calc(100vh-5.5rem)] flex items-center py-10 lg:py-16"
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />

      {/* Background Ambient Carousel with Ken Burns Zoom */}
      <div ref={emblaRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="flex h-full">
          {homeHeroSlides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              <div
                className="absolute inset-0 bg-cover bg-center lg:bg-center bg-no-repeat transition-transform duration-[12000ms] ease-out will-change-transform"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1.0)'
                }}
              />

              {/* Dynamic Gradient Overlay: high contrast on left for typography, open & vibrant on right to show full image */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-background dark:via-background/85 dark:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Cyber Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Content Area - Clean, focused content presentation */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`home-slide-${selectedIndex}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-3.5 sm:space-y-4"
            >
              {/* Badge Row alone (no numbers) */}
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md text-primary font-semibold text-xs sm:text-sm tracking-wide">
                <Shield className="w-4 h-4 text-primary" />
                <span>{activeSlide.badge}</span>
              </div>

              {/* Main Dynamic Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.16]">
                {activeSlide.title}{" "}
                <span className="text-gradient">{activeSlide.highlight}</span>
                {activeSlide.titleEnd && ` ${activeSlide.titleEnd}`}
              </h1>

              {/* Slide Subheading */}
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
                {activeSlide.description}
              </p>

              {/* Dynamic Feature Tag Pills */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeSlide.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-card/80 border border-border/70 text-foreground shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="lg"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-lead-form'))}
                  className="h-11 sm:h-12 px-6 sm:px-7 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
                >
                  Get an Instant Security Quote
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open("https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20security%20solutions.", "_blank")}
                  className="h-11 sm:h-12 px-5 sm:px-6 gap-2 bg-card/70 backdrop-blur-md border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 rounded-xl transition-all text-sm sm:text-base cursor-pointer"
                >
                  Talk to Our Security Experts
                </Button>
              </div>

              {/* Trust Proof Badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-2 text-[11px] sm:text-xs text-muted-foreground font-medium border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Trusted by 500+ Enterprises</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>ISO 9001:2015 Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Nationwide Service (PAN India)</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
