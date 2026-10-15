import { Shield, ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

import schoolSafety1 from "../assets/school_safety_1.jpg";
import schoolSafety2 from "../assets/school_safety_2.jpg";
import schoolSafety3 from "../assets/school_safety_3.jpg";
import schoolSafety4 from "../assets/school_safety_4.jpg";
import schoolSafety5 from "../assets/school_safety_5.jpg";

const heroSlides = [
    {
        badge: "Institutional Safety",
        title: "Campus Safety",
        highlight: "Reimagined",
        titleEnd: "for Future",
        description: "Blending child-first psychology with military-grade intelligence to create the world's most secure learning ecosystems.",
        image: schoolSafety1,
        overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
    },
    {
        badge: "24/7 Monitoring",
        title: "Advanced",
        highlight: "Campus Watch",
        titleEnd: "Systems",
        description: "Round-the-clock surveillance and rapid response protocols tailored for educational environments, ensuring complete peace of mind.",
        image: schoolSafety2,
        overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
    },
    {
        badge: "Verified Personnel",
        title: "Cognitive",
        highlight: "Physical Guarding",
        titleEnd: "",
        description: "Moving beyond traditional watchmen to Intelligent Safety Marshals (ISM) equipped with situational AI overlays.",
        image: schoolSafety3,
        overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
    },
    {
        badge: "Digital Security",
        title: "Enterprise",
        highlight: "ICT & Cybersecurity",
        titleEnd: "",
        description: "A unified NOC-SOC approach to campus infrastructure, ensuring 99.99% uptime for digital learning.",
        image: schoolSafety4,
        overlay: "from-slate-950/95 via-slate-950/80 to-slate-900/40",
    },
    {
        badge: "Health & Transport",
        title: "Safety",
        highlight: "In Motion",
        titleEnd: "Protocols",
        description: "Comprehensive oversight of everything that moves, from school buses to student medical records with AI tracking.",
        image: schoolSafety5,
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
                    title="Campus Safety Solutions Overview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export const CampusSafetyHero = ({ onOpenEbook }: { onOpenEbook: () => void }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showVideo, setShowVideo] = useState(false);

    const scrollToConsultation = (e: React.MouseEvent) => {
        e.preventDefault();
        const section = document.getElementById('consultation');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openVideo = () => {
        setShowVideo(true);
        document.body.style.overflow = 'hidden';
    };

    const closeVideo = () => {
        setShowVideo(false);
        document.body.style.overflow = 'auto';
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

    const startAutoPlay = useCallback(() => {
        if (autoplayRef.current) return;
        autoplayRef.current = setInterval(() => {
            if (emblaApi) emblaApi.scrollNext();
        }, 4000);
    }, [emblaApi]);

    const stopAutoPlay = useCallback(() => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        startAutoPlay();
        emblaApi.on('pointerDown', stopAutoPlay);
        emblaApi.on('pointerUp', startAutoPlay);
        return () => {
            stopAutoPlay();
            emblaApi.off('pointerDown', stopAutoPlay);
            emblaApi.off('pointerUp', startAutoPlay);
        };
    }, [emblaApi, startAutoPlay, stopAutoPlay]);

    const onNavClick = (callback: () => void) => {
        stopAutoPlay();
        callback();
        setTimeout(startAutoPlay, 5000);
    };

    return (
        <section className="relative min-h-screen overflow-hidden" id="hero">
            <VideoModal isOpen={showVideo} onClose={closeVideo} />

            {/* Carousel */}
            <div
                ref={emblaRef}
                className="overflow-hidden h-screen"
                onMouseEnter={stopAutoPlay}
                onMouseLeave={startAutoPlay}
            >
                <div className="flex h-full">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] min-w-0 relative h-full"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1)'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
                            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Left/Right Navigation Arrows */}
            <button
                onClick={scrollPrev}
                aria-label="Previous campus safety slide"
                className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white/90 hover:text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={scrollNext}
                aria-label="Next campus safety slide"
                className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white/90 hover:text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Overlay - Balanced 2-Column Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-20 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Authoritative Message & CTAs */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-primary/40 rounded-full mb-6 w-fit animate-fade-in shadow-lg shadow-primary/10"
                            key={`badge-${selectedIndex}`}
                        >
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wide text-primary-foreground uppercase">
                                {heroSlides[selectedIndex].badge}
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight animate-fade-in"
                            key={`title-${selectedIndex}`}
                        >
                            {heroSlides[selectedIndex].title}{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                                {heroSlides[selectedIndex].highlight}
                            </span>{" "}
                            {heroSlides[selectedIndex].titleEnd}
                        </h1>

                        {/* Subheading */}
                        <p
                            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal animate-fade-in"
                            key={`desc-${selectedIndex}`}
                        >
                            {heroSlides[selectedIndex].description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-in">
                            <Button
                                size="lg"
                                className="gap-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-xl shadow-primary/30 px-8 h-13 text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                onClick={scrollToConsultation}
                            >
                                Secure My Campus
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="gap-2.5 bg-slate-900/60 hover:bg-white/10 text-white backdrop-blur-md border border-white/25 rounded-full px-7 h-13 text-base cursor-pointer hover:border-primary transition-all duration-200"
                                onClick={onOpenEbook}
                            >
                                <FileText className="w-4 h-4 text-primary" />
                                View Blueprint
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-300 font-medium animate-fade-in">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                <span>Police Verified Teams</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                <span>500+ Schools Safe</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                <span>DPDP & POCSO Compliant</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Desktop): Campus Safety Telemetry HUD */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                        CAMPUS DEFENSE TELEMETRY
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                    MODULE 0{selectedIndex + 1} / 0{heroSlides.length}
                                </span>
                            </div>

                            {/* Active Slide Focus */}
                            <div className="mb-5">
                                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                                    {heroSlides[selectedIndex].badge}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {heroSlides[selectedIndex].title} {heroSlides[selectedIndex].highlight}
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Child-first institutional security integrating Intelligent Safety Marshals (ISM), AI bus fleet tracking, and 24/7 centralized monitoring.
                                </p>
                            </div>

                            {/* Performance Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-[11px] text-slate-400 mb-0.5">Staff Verification</div>
                                    <div className="text-lg font-bold text-white">100% Police</div>
                                    <div className="text-[10px] text-emerald-400 mt-0.5">Criminal Record Screened</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-[11px] text-slate-400 mb-0.5">Fleet Oversight</div>
                                    <div className="text-lg font-bold text-white">GPS + CCTV</div>
                                    <div className="text-[10px] text-primary mt-0.5">Live Bus Telemetry</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-[11px] text-slate-400 mb-0.5">Campuses Protected</div>
                                    <div className="text-lg font-bold text-white">500+</div>
                                    <div className="text-[10px] text-blue-400 mt-0.5">Nationwide Footprint</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-[11px] text-slate-400 mb-0.5">Regulatory Audit</div>
                                    <div className="text-lg font-bold text-white">POCSO Ready</div>
                                    <div className="text-[10px] text-emerald-400 mt-0.5">Statutory Standard</div>
                                </div>
                            </div>

                            {/* Action inside card */}
                            <button
                                onClick={scrollToConsultation}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer group"
                            >
                                <span>Request Comprehensive Institutional Audit</span>
                                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                            </button>
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
                        aria-label="Previous campus slide"
                        className="w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center active:bg-primary"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Next campus slide"
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
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((selectedIndex + 1) / heroSlides.length) * 100}%` }}
                />
            </div>
        </section>
    );
};
