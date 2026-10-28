import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { CashLogisticsSection } from "@/data/cash-logistics-data";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    smartCityHero,
    smartCityHeroSlides,
    allSmartCitySections,
    finalCTA
} from "@/data/smart-city-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import city1 from "../assets/command_center_1.jpg";
import city2 from "../assets/command_center_2.jpg";
import city3 from "../assets/command_center_3.jpg";
import city4 from "../assets/command_center_4.jpg";
import city5 from "../assets/hero-ai-driven.jpg";

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const smartCitySlides: HeroSlide[] = [
    {
        badge: "Smart Cities Platform",
        title: "AI-Driven Urban Safety &",
        highlight: "City Operations",
        titleEnd: "",
        description: "Enterprise-grade platform for governments and municipalities to manage urban safety, citizen welfare, and smart surveillance.",
        image: city1,
        tags: ["Urban Safety AI", "Citizen Welfare", "Smart Surveillance"],
        telemetry: "City C2 Glass Active",
        ctaText: "Build Safer Cities",
        secondaryCtaText: "Urban Intelligence",
        secondaryCtaAction: () => document.getElementById('urban-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Integrated Command & Control",
        title: "Unified Municipal",
        highlight: "Command Centers (ICCC)",
        titleEnd: "",
        description: "A unified AI-powered ecosystem connecting traffic management, emergency services, civic sensors, and multi-agency response.",
        image: city2,
        tags: ["Municipal ICCC", "Traffic AI", "Emergency Grid"],
        telemetry: "ICCC Hub Connected",
        ctaText: "Build Safer Cities",
        secondaryCtaText: "Urban Intelligence",
        secondaryCtaAction: () => document.getElementById('urban-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Infrastructure Intelligence",
        title: "Critical Utilities &",
        highlight: "Public Asset Protection",
        titleEnd: "",
        description: "Predictive monitoring for city electrical grids, water pipelines, bridges, transit corridors, and public infrastructure.",
        image: city3,
        tags: ["Utility Grids", "Asset Protection", "Predictive Sensors"],
        telemetry: "Utility Telemetry Synced",
        ctaText: "Build Safer Cities",
        secondaryCtaText: "Urban Intelligence",
        secondaryCtaAction: () => document.getElementById('urban-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Citizen-First Safety",
        title: "Next-Gen Urban",
        highlight: "Emergency Response",
        titleEnd: "Systems",
        description: "Zero-latency SOS kiosks, panic buttons, AI automated license plate recognition (ANPR), and rapid tactical dispatch.",
        image: city4,
        tags: ["ANPR Cameras", "SOS Kiosks", "Rapid Dispatch"],
        telemetry: "Safe City Grid Active",
        ctaText: "Build Safer Cities",
        secondaryCtaText: "Urban Intelligence",
        secondaryCtaAction: () => document.getElementById('urban-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const SmartCityPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <SEO
                        title="Smart City Surveillance & Urban Intelligence Solutions | ISI Security"
                        description="AI-powered urban security, ANPR traffic analytics, public safety monitoring, and municipal command center integration for Smart Cities."
                        keywords="Smart City Security, Urban Surveillance India, ANPR Traffic Analytics, Public Safety Command Center, ISI Security"
                        canonicalPath="/smartcity"
                    />
                    <PageHero 
                        slides={smartCitySlides} 
                        secondaryScrollTarget="urban-intelligence"
                        secondaryCtaLabel="Explore Urban Intelligence"
                    />
                </div>

                {/* All Sections */}
                {allSmartCitySections.map((section, index) => (
                    <SectionPanel key={section.id} section={section as unknown as CashLogisticsSection} index={index} />
                ))}

                {/* Final CTA Section */}
                <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
                    <div className="absolute inset-0 bg-[var(--section-gradient)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="container mx-auto px-4 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">{finalCTA.title}</h2>
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">{finalCTA.subtitle}</p>
                            <Link to={finalCTA.link}><Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-7 rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-lg">{finalCTA.buttonText}<ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" /></Button></Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SmartCityPage;
