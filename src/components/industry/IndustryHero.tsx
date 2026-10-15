import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

export interface IndustryHeroProps {
    badge: string;
    title: string;
    subtitle: string;
    slides: { image: string; title?: string; subtitle?: string }[];
    primaryCtaText?: string;
    primaryCtaAction?: () => void;
    secondaryCtaText?: string;
    secondaryCtaTargetId?: string;
    metrics?: {
        label: string;
        value: string;
        sub?: string;
    }[];
    features?: string[];
}

export const IndustryHero = ({
    badge,
    title,
    subtitle,
    slides,
    primaryCtaText = "Get Started",
    primaryCtaAction,
    secondaryCtaText = "Explore Solutions",
    secondaryCtaTargetId,
    metrics,
    features
}: IndustryHeroProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const currentSlide = slides[selectedIndex];
    const activeTitle = currentSlide?.title || title;
    const activeSubtitle = currentSlide?.subtitle || subtitle;

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
        }, 5500);
    }, [emblaApi, isPaused]);

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

    const handlePrimaryClick = () => {
        if (primaryCtaAction) {
            primaryCtaAction();
        } else {
            window.dispatchEvent(new CustomEvent("open-lead-form"));
        }
    };

    const handleSecondaryClick = () => {
        if (secondaryCtaTargetId) {
            document.getElementById(secondaryCtaTargetId)?.scrollIntoView({ behavior: "smooth" });
        } else {
            window.open(
                "https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20security%20solutions.",
                "_blank"
            );
        }
    };

    const defaultMetrics = [
        { label: "Deployment Scale", value: "PAN India", sub: "Enterprise Network" },
        { label: "Incident Escalation", value: "< 3 Mins", sub: "Rapid Protocol" },
        { label: "Personnel Screening", value: "100% Police", sub: "Verified Teams" },
        { label: "Statutory Audit", value: "100% Compliant", sub: "ISO 9001:2015" }
    ];

    const displayMetrics = metrics || defaultMetrics;

    return (
        <section
            className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-slate-950 text-white"
            id="hero"
            onMouseEnter={() => { setIsPaused(true); stopAutoPlay(); }}
            onMouseLeave={() => { setIsPaused(false); startAutoPlay(); }}
            onFocus={() => { setIsPaused(true); stopAutoPlay(); }}
            onBlur={() => { setIsPaused(false); startAutoPlay(); }}
            aria-roledescription="carousel"
            aria-label={`${title} Hero`}
        >
            {/* Carousel Background */}
            <div ref={emblaRef} className="absolute inset-0 z-0 overflow-hidden h-full">
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full transition-opacity duration-300">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: selectedIndex === index ? "scale(1.08)" : "scale(1)"
                                }}
                            />
                            {/* Rich Enterprise Overlays */}
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

            {/* Content Container - Balanced 2-Column Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-20 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Authoritative Message & CTAs */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-primary/40 rounded-full mb-6 w-fit animate-fade-in shadow-lg shadow-primary/10">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wide text-primary-foreground uppercase">
                                {badge}
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight animate-fade-in">
                            {activeTitle}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal animate-fade-in">
                            {activeSubtitle}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-in">
                            <Button
                                size="lg"
                                onClick={handlePrimaryClick}
                                className="gap-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-xl shadow-primary/30 px-8 h-13 text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                {primaryCtaText}
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleSecondaryClick}
                                className="gap-2.5 bg-slate-900/60 hover:bg-white/10 text-white backdrop-blur-md border border-white/25 rounded-full px-7 h-13 text-base cursor-pointer hover:border-primary transition-all duration-200"
                            >
                                {secondaryCtaText}
                            </Button>
                        </div>

                        {/* Feature Points or Trust Badges */}
                        {features && features.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 max-w-2xl text-xs sm:text-sm text-slate-300 font-medium animate-fade-in">
                                {features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center text-primary text-xs shrink-0 font-bold">✓</div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
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
                                    <span>PAN India Deployment</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Desktop): Sector Telemetry HUD */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                        SECTOR TELEMETRY HUD
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                    SLIDE 0{selectedIndex + 1} / 0{slides.length}
                                </span>
                            </div>

                            {/* Active Focus */}
                            <div className="mb-5">
                                <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                                    {badge}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Active Operational Defense
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    SLA-backed protection architecture designed for high-asset risk mitigation, real-time auditability, and emergency escalation.
                                </p>
                            </div>

                            {/* Performance Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                {displayMetrics.map((m, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                        <div className="text-[11px] text-slate-400 mb-0.5">{m.label}</div>
                                        <div className="text-lg font-bold text-white">{m.value}</div>
                                        {m.sub && <div className="text-[10px] text-emerald-400 mt-0.5">{m.sub}</div>}
                                    </div>
                                ))}
                            </div>

                            {/* Action inside card */}
                            <button
                                onClick={handlePrimaryClick}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer group"
                            >
                                <span>Schedule Sector Security Assessment</span>
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
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`relative h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                                selectedIndex === index
                                    ? "w-10 bg-primary shadow-lg shadow-primary/50"
                                    : "w-2.5 bg-slate-600/60 hover:bg-slate-400"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Slide Number Counter */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 pointer-events-auto">
                    <span className="text-white font-bold">0{selectedIndex + 1}</span>
                    <span>/</span>
                    <span>0{slides.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((selectedIndex + 1) / slides.length) * 100}%` }}
                />
            </div>
        </section>
    );
};
