
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CapabilitiesLandingSection } from "@/components/capabilities/CapabilitiesLandingSections";
import { Solutions } from "@/components/Solutions";
import {
    capabilitiesHero,
    allCapabilitiesSections,
    finalCapabilitiesCTA
} from "@/data/capabilities-landing-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Activity, Cpu, CheckCircle2, PhoneCall, Layers, Eye, Lock } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useContentProtection } from "@/hooks/useContentProtection";

const heroSlides = [
    {
        badge: "Next-Gen Security Operations",
        title: "Security Operations Center",
        highlight: "(SOC 24/7)",
        description: "Redundant, military-grade command and control facilities providing real-time situational awareness and rapid threat response across India.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
    },
    {
        badge: "Predictive AI & Analytics",
        title: "Autonomous Surveillance",
        highlight: "& AI Telemetry",
        description: "AI-powered optical sensors and computer vision algorithms filtering 94.2% of false alarms for critical infrastructure and corporate campuses.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80"
    },
    {
        badge: "Cyber-Physical Convergence",
        title: "Unified Command",
        highlight: "& Access Ecosystem",
        description: "Seamless orchestration across biometrics, perimeter radar, mobile patrol units, and enterprise building intelligence.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
    },
    {
        badge: "Critical Asset Protection",
        title: "High-Resilience",
        highlight: "Enterprise Defense",
        description: "ISO 9001:2015 and statutory compliant physical guarding protocols guarding tier-1 data centers, campuses, and banks.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
    }
];

const CapabilitiesPage = () => {
    useContentProtection();
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

        emblaApi.on('pointerDown', stopAutoPlay);
        emblaApi.on('pointerUp', startAutoPlay);

        return () => {
            stopAutoPlay();
            emblaApi.off("select", onSelect);
            emblaApi.off('pointerDown', stopAutoPlay);
            emblaApi.off('pointerUp', startAutoPlay);
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

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Carousel */}
                <section
                    className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-slate-950 text-white"
                    id="hero"
                    onMouseEnter={() => { setIsPaused(true); stopAutoPlay(); }}
                    onMouseLeave={() => { setIsPaused(false); startAutoPlay(); }}
                    onFocus={() => { setIsPaused(true); stopAutoPlay(); }}
                    onBlur={() => { setIsPaused(false); startAutoPlay(); }}
                    aria-roledescription="carousel"
                    aria-label="Capabilities Overview Hero"
                >
                    {/* Background Slider */}
                    <div ref={emblaRef} className="absolute inset-0 z-0 overflow-hidden h-full">
                        <div className="flex h-full">
                            {heroSlides.map((slide, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full transition-opacity duration-300">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
                                        style={{
                                            backgroundImage: `url(${slide.image})`,
                                            transform: selectedIndex === index ? 'scale(1.08)' : 'scale(1)'
                                        }}
                                    />
                                    {/* High-Contrast Enterprise Dark Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
                                    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Arrow Controls */}
                    <button
                        onClick={scrollPrev}
                        aria-label="Previous capability slide"
                        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white/90 hover:text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={scrollNext}
                        aria-label="Next capability slide"
                        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/70 hover:bg-primary text-white/90 hover:text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Balanced 2-Column Content Grid */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-20 py-16 lg:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            {/* Left Column: Authoritative Message & CTAs */}
                            <div className="lg:col-span-7 flex flex-col justify-center">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-primary/40 rounded-full mb-6 w-fit animate-fade-in shadow-lg shadow-primary/10">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-primary-foreground uppercase">
                                        {capabilitiesHero.badge}
                                    </span>
                                </div>

                                {/* Main Heading with Gradient Highlight */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight animate-fade-in">
                                    Intelligence-Led Security for a{" "}
                                    <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                                        Complex World
                                    </span>
                                </h1>

                                {/* Subtitle */}
                                <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal animate-fade-in">
                                    {capabilitiesHero.subtitle}
                                </p>

                                {/* Action CTAs */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-in">
                                    <Button
                                        size="lg"
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-lead-form'))}
                                        className="gap-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-xl shadow-primary/30 px-8 h-13 text-base cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                    >
                                        Explore Solutions <ArrowRight className="w-5 h-5" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => document.getElementById('physical-ops')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="gap-2.5 bg-slate-900/60 hover:bg-white/10 text-white backdrop-blur-md border border-white/25 rounded-full px-7 h-13 text-base cursor-pointer hover:border-primary transition-all duration-200"
                                    >
                                        <Layers className="w-4 h-4 text-primary" />
                                        Our Pillars
                                    </Button>
                                </div>

                                {/* Trust & Operational Badges */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <span>99.8% Threat Accuracy</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                                        <span>24/7 Redundant SOC</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary shrink-0" />
                                        <span>PAN India Deployment</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Security Operations Command HUD */}
                            <div className="lg:col-span-5 hidden lg:block">
                                <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300">
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                                CENTRAL COMMAND TELEMETRY
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
                                            {heroSlides[selectedIndex].title} {heroSlides[selectedIndex].highlight}
                                        </h3>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {heroSlides[selectedIndex].description}
                                        </p>
                                    </div>

                                    {/* Key Performance Telemetry */}
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                            <div className="text-[11px] text-slate-400 mb-0.5">Rapid Escalation</div>
                                            <div className="text-lg font-bold text-white">&lt; 3 Mins</div>
                                            <div className="text-[10px] text-emerald-400 mt-0.5">Real-Time Dispatch</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                                            <div className="text-[11px] text-slate-400 mb-0.5">False Alarm Filter</div>
                                            <div className="text-lg font-bold text-white">94.2% AI</div>
                                            <div className="text-[10px] text-primary mt-0.5">Automated Triage</div>
                                        </div>
                                    </div>

                                    {/* Quick Pillar Jump Navigation */}
                                    <div className="mb-5">
                                        <div className="text-[11px] text-slate-400 font-medium mb-2 uppercase tracking-wider">
                                            Explore Capability Pillars:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { label: "Physical Ops", id: "physical-ops" },
                                                { label: "Electronic CCTV", id: "electronic-surveillance" },
                                                { label: "Specialized", id: "specialized-services" },
                                                { label: "Cyber-Physical", id: "cyber-physical" },
                                                { label: "Compliance", id: "compliance-governance" },
                                            ].map((pillar) => (
                                                <button
                                                    key={pillar.id}
                                                    onClick={() => document.getElementById(pillar.id)?.scrollIntoView({ behavior: 'smooth' })}
                                                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/5 hover:bg-primary/20 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                                >
                                                    {pillar.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interactive CTA within card */}
                                    <button
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-lead-form'))}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white text-xs font-semibold transition-all duration-200 cursor-pointer group"
                                    >
                                        <span>Schedule Enterprise Capability Briefing</span>
                                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Controls */}
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
                            {heroSlides.map((_, index) => (
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

                {/* Main Content Sections (The 5-panel structure) */}
                {allCapabilitiesSections.map((section, index) => (
                    <CapabilitiesLandingSection key={section.id} section={section} index={index} />
                ))}

                {/* Merged Solutions Section */}
                <Solutions />

                {/* Final CTA Section */}
                <section className="py-12 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="container mx-auto px-4 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                {finalCapabilitiesCTA.title}
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                                {finalCapabilitiesCTA.subtitle}
                            </p>
                            <Link to={finalCapabilitiesCTA.link}>
                                <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-7 rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-lg">
                                    {finalCapabilitiesCTA.buttonText}
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CapabilitiesPage;
