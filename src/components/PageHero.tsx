import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Clock, Activity, CheckCircle2, PhoneCall } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

export interface HeroSlide {
    badge: string;
    title: string;
    highlight: string;
    titleEnd?: string;
    description: string;
    image: string;
    overlay?: string;
    primaryCta?: {
        label: string;
        action?: () => void;
        link?: string;
    };
    secondaryCta?: {
        label: string;
        action?: () => void;
        link?: string;
    };
    specs?: {
        label: string;
        value: string;
    }[];
}

interface PageHeroProps {
    slides: HeroSlide[];
    autoplayDelay?: number;
}

export const PageHero = ({ slides, autoplayDelay = 5500 }: PageHeroProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const stopAutoPlay = useCallback(() => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    const startAutoPlay = useCallback(() => {
        if (autoplayRef.current || isPaused) return;
        autoplayRef.current = setInterval(() => {
            if (emblaApi) emblaApi.scrollNext();
        }, autoplayDelay);
    }, [emblaApi, autoplayDelay, isPaused]);

    const onNavClick = useCallback((callback: () => void) => {
        stopAutoPlay();
        callback();
        setTimeout(() => {
            if (!isPaused) startAutoPlay();
        }, 6000);
    }, [startAutoPlay, stopAutoPlay, isPaused]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) onNavClick(() => emblaApi.scrollPrev());
    }, [emblaApi, onNavClick]);

    const scrollNext = useCallback(() => {
        if (emblaApi) onNavClick(() => emblaApi.scrollNext());
    }, [emblaApi, onNavClick]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) onNavClick(() => emblaApi.scrollTo(index));
    }, [emblaApi, onNavClick]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);

        startAutoPlay();

        emblaApi.on("pointerDown", stopAutoPlay);
        emblaApi.on("pointerUp", startAutoPlay);

        return () => {
            stopAutoPlay();
            emblaApi.off("select", onSelect);
            emblaApi.off("pointerDown", stopAutoPlay);
            emblaApi.off("pointerUp", startAutoPlay);
        };
    }, [emblaApi, startAutoPlay, stopAutoPlay]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") scrollPrev();
            if (e.key === "ArrowRight") scrollNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [scrollPrev, scrollNext]);

    const currentSlide = slides[selectedIndex] || slides[0];

    const handlePrimaryClick = () => {
        if (currentSlide.primaryCta?.action) {
            currentSlide.primaryCta.action();
        } else if (currentSlide.primaryCta?.link) {
            window.location.href = currentSlide.primaryCta.link;
        } else {
            window.dispatchEvent(new CustomEvent("open-lead-form"));
        }
    };

    const handleSecondaryClick = () => {
        if (currentSlide.secondaryCta?.action) {
            currentSlide.secondaryCta.action();
        } else if (currentSlide.secondaryCta?.link) {
            window.location.href = currentSlide.secondaryCta.link;
        } else {
            window.open(
                "https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20security%20solutions.",
                "_blank"
            );
        }
    };

    return (
        <section
            className="relative min-h-[620px] lg:min-h-[700px] flex items-center overflow-hidden bg-slate-950 text-white"
            onMouseEnter={() => { setIsPaused(true); stopAutoPlay(); }}
            onMouseLeave={() => { setIsPaused(false); startAutoPlay(); }}
            onFocus={() => { setIsPaused(true); stopAutoPlay(); }}
            onBlur={() => { setIsPaused(false); startAutoPlay(); }}
            aria-roledescription="carousel"
            aria-label="Service Highlights Hero"
        >
            {/* Carousel Background Layer */}
            <div ref={emblaRef} className="absolute inset-0 z-0 overflow-hidden h-full">
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] min-w-0 relative h-full transition-opacity duration-300"
                        >
                            {/* High-Resolution Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: selectedIndex === index ? "scale(1.08)" : "scale(1)"
                                }}
                            />

                            {/* Calibrated High-Contrast Dark Dual-Tone Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

                            {/* Tech Ambient Radial Glows */}
                            <div className="absolute top-1/4 -right-16 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Left and Right Desktop Arrow Navigation Buttons */}
            <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white/90 hover:text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white/90 hover:text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Container with Balanced 2-Column Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-20 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Authoritative Typography and Primary Action CTAs */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        {/* Slide Badge */}
                        <div
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-primary/40 rounded-full mb-6 w-fit animate-fade-in shadow-lg shadow-primary/10"
                            key={`badge-${selectedIndex}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wide text-primary-foreground uppercase">
                                {currentSlide.badge}
                            </span>
                        </div>

                        {/* Slide Main Heading with Gradient Highlight */}
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight animate-fade-in"
                            key={`title-${selectedIndex}`}
                        >
                            {currentSlide.title}{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                                {currentSlide.highlight}
                            </span>
                            {currentSlide.titleEnd && ` ${currentSlide.titleEnd}`}
                        </h1>

                        {/* Concise, Informative Description */}
                        <p
                            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal animate-fade-in"
                            key={`desc-${selectedIndex}`}
                        >
                            {currentSlide.description}
                        </p>

                        {/* Dual CTA Button Group */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-in">
                            <Button
                                size="lg"
                                onClick={handlePrimaryClick}
                                className="gap-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-xl shadow-primary/30 px-8 h-13 text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                {currentSlide.primaryCta?.label || "Get Enterprise Quote"}
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleSecondaryClick}
                                className="gap-2.5 bg-slate-900/60 hover:bg-white/10 text-white backdrop-blur-md border border-white/25 rounded-full px-7 h-13 text-base cursor-pointer hover:border-primary transition-all duration-200"
                            >
                                <PhoneCall className="w-4 h-4 text-primary" />
                                {currentSlide.secondaryCta?.label || "Speak to an Expert"}
                            </Button>
                        </div>

                        {/* Trust & Compliance Indicators */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                <span>24/7 Operations Command</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                                <span>ISO 9001:2015 Certified</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary shrink-0" />
                                <span>SLA-Backed Response</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Desktop): Enterprise Live Telemetry & Quick-Spec Card */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                        Operational Intelligence
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                    SLIDE 0{selectedIndex + 1} / 0{slides.length}
                                </span>
                            </div>

                            {/* Current Focus Highlight */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    {currentSlide.highlight} Capabilities
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Engineered with enterprise-grade fault tolerance, predictive telemetry, and verified standard operating procedures.
                                </p>
                            </div>

                            {/* Telemetry Performance Metrics */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-xs text-slate-400 mb-1">Availability / SLA</div>
                                    <div className="text-xl font-bold text-white">99.8%</div>
                                    <div className="text-[10px] text-emerald-400 mt-0.5">Continuous Monitoring</div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-xs text-slate-400 mb-1">Incident Escalation</div>
                                    <div className="text-xl font-bold text-white">&lt; 3 Mins</div>
                                    <div className="text-[10px] text-primary mt-0.5">Rapid Protocol</div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-xs text-slate-400 mb-1">Deployment Scale</div>
                                    <div className="text-xl font-bold text-white">PAN India</div>
                                    <div className="text-[10px] text-blue-400 mt-0.5">Multi-Region Reach</div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
                                    <div className="text-xs text-slate-400 mb-1">Regulatory Standards</div>
                                    <div className="text-xl font-bold text-white">100% Compliant</div>
                                    <div className="text-[10px] text-emerald-400 mt-0.5">Statutory Verified</div>
                                </div>
                            </div>

                            {/* Interactive Quick Action inside card */}
                            <button
                                onClick={handlePrimaryClick}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer group"
                            >
                                <span>Request Customized Site Assessment</span>
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
                        aria-label="Previous slide"
                        className="w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center active:bg-primary"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Next slide"
                        className="w-9 h-9 rounded-full bg-slate-900/80 text-white border border-white/20 flex items-center justify-center active:bg-primary"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Central Pagination Pills */}
                <div className="flex items-center gap-2.5 mx-auto pointer-events-auto">
                    {slides.map((slide, index) => {
                        const isActive = selectedIndex === index;
                        return (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`relative h-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                                    isActive
                                        ? "w-10 bg-primary shadow-lg shadow-primary/50"
                                        : "w-2.5 bg-slate-600/60 hover:bg-slate-400"
                                }`}
                                aria-label={`Go to slide ${index + 1}: ${slide.badge}`}
                            >
                                {isActive && (
                                    <span className="sr-only">Active slide</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Slide Number Counter */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 pointer-events-auto">
                    <span className="text-white font-bold">0{selectedIndex + 1}</span>
                    <span>/</span>
                    <span>0{slides.length}</span>
                </div>
            </div>

            {/* Bottom Slide Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((selectedIndex + 1) / slides.length) * 100}%` }}
                />
            </div>
        </section>
    );
};
