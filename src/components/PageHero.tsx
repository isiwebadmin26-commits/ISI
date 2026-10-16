import { ChevronLeft, ChevronRight, ArrowRight, Shield, CheckCircle, Sparkles, Activity } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HeroSlide {
    badge: string;
    title: string;
    highlight: string;
    titleEnd?: string;
    description: string;
    image: string;
    overlay?: string;
    tags?: string[];
    metrics?: { label: string; value: string }[];
    telemetry?: string;
    ctaText?: string;
    ctaAction?: () => void;
    secondaryCtaText?: string;
    secondaryCtaAction?: () => void;
}

export interface PageHeroProps {
    slides: HeroSlide[];
    autoplayDelay?: number;
    className?: string;
    secondaryScrollTarget?: string;
    secondaryCtaLabel?: string;
}

export const PageHero = ({ 
    slides, 
    autoplayDelay = 5500,
    className,
    secondaryScrollTarget,
    secondaryCtaLabel = "Speak to an Expert"
}: PageHeroProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const scrollPrev = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollPrev();
            resetTimer();
        }
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollNext();
            resetTimer();
        }
    }, [emblaApi]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) {
            emblaApi.scrollTo(index);
            resetTimer();
        }
    }, [emblaApi]);

    const resetTimer = useCallback(() => {
        setProgress(0);
    }, []);

    // Sync selected slide index from Embla
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

    // Autoplay & Smooth Progress Bar Animation
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

    const activeSlide = slides[selectedIndex] || slides[0];

    // Default tags if not provided
    const displayTags = activeSlide.tags || [
        "24/7 Security Operations",
        "AI-Powered Surveillance",
        "PAN-India Coverage"
    ];

    return (
        <section 
            className={cn("relative overflow-hidden bg-background py-8 sm:py-10 lg:py-12", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Ambient Carousel */}
            <div ref={emblaRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                            {/* High-Res Background Image with Ken Burns Zoom & crisp right-aligned focal point */}
                            <div
                                className="absolute inset-0 bg-cover bg-right lg:bg-center bg-no-repeat transition-transform duration-[12000ms] ease-out will-change-transform"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1.0)'
                                }}
                            />

                            {/* Targeted Contrast Gradient Overlay: allows the image to shine on the right while ensuring text readability on the left */}
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/25 dark:from-background dark:via-background/95 dark:to-background/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Futuristic Tech Grid & Ambient Glows */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
            <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

            {/* Main Content Area - Clean, focused content presentation */}
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`slide-content-${selectedIndex}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-3.5 sm:space-y-4"
                        >
                            {/* Category Badge alone (no numbers) */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md text-primary font-semibold text-xs sm:text-sm tracking-wide">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>{activeSlide.badge}</span>
                            </div>

                            {/* Dynamic Slide Heading */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.16]">
                                {activeSlide.title}{" "}
                                <span className="text-gradient">{activeSlide.highlight}</span>
                                {activeSlide.titleEnd && ` ${activeSlide.titleEnd}`}
                            </h1>

                            {/* Dynamic Description */}
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
                                {activeSlide.description}
                            </p>

                            {/* Dynamic Feature / Metric Pills */}
                            {displayTags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {displayTags.map((tag, idx) => (
                                        <span 
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-card/80 border border-border/70 text-foreground shadow-xs"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Hero Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        if (activeSlide.ctaAction) {
                                            activeSlide.ctaAction();
                                        } else {
                                            window.dispatchEvent(new CustomEvent('open-lead-form'));
                                        }
                                    }}
                                    className="h-11 sm:h-12 px-6 sm:px-7 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
                                >
                                    {activeSlide.ctaText || "Get Enterprise Quote"}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => {
                                        if (activeSlide.secondaryCtaAction) {
                                            activeSlide.secondaryCtaAction();
                                        } else if (secondaryScrollTarget) {
                                            document.getElementById(secondaryScrollTarget)?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.open('https://wa.me/917708887878?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20security%20solutions.', '_blank');
                                        }
                                    }}
                                    className="h-11 sm:h-12 px-5 sm:px-6 gap-2 bg-card/70 backdrop-blur-md border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 rounded-xl transition-all text-sm sm:text-base cursor-pointer"
                                >
                                    {activeSlide.secondaryCtaText || secondaryCtaLabel}
                                </Button>
                            </div>

                            {/* Trust Metrics & Proof Bar */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-2 text-[11px] sm:text-xs text-muted-foreground font-medium border-t border-border/50">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>ISO 9001:2015 Certified</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>500+ Enterprise Clients</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span>Pan-India Strategic Presence</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
