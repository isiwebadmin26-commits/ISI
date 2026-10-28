import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { CashLogisticsSection } from "@/data/cash-logistics-data";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    gccHero,
    gccHeroSlides,
    allGCCSections,
    finalCTA
} from "@/data/gcc-it-parks-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import city1 from "../assets/command_center_3.jpg"; // Workplace command center
import city2 from "../assets/hero-ai-driven.jpg"; // General tech
import city3 from "../assets/verticals-surveillance.jpg"; // Surveillance
import city4 from "../assets/about-hero-bg.jpg"; // Campus

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const gccSlides: HeroSlide[] = [
    {
        badge: "GCC & Tech Parks Platform",
        title: "AI-Driven Workplace Security &",
        highlight: "Campus Safety",
        titleEnd: "",
        description: "Protecting Fortune 500 GCCs, IT corridors, tech innovation hubs, and campus workforces through real-time AI security monitoring.",
        image: city1,
        tags: ["Global Capability Centers", "Zero-Trust Physical", "Workplace Safety"],
        telemetry: "GCC Campus Online",
        ctaText: "Secure Digital Workplaces",
        secondaryCtaText: "Campus Intelligence",
        secondaryCtaAction: () => document.getElementById('workplace-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Campus Operational Intelligence",
        title: "Integrated Workplace Flow &",
        highlight: "Automated Access Control",
        titleEnd: "",
        description: "Unified ecosystem managing turnstile facial recognition, visitor badging, multi-tenant parking, and environmental sustainability.",
        image: city2,
        tags: ["Facial Access", "Visitor Management", "Multi-Tenant Parks"],
        telemetry: "Access Flow Optimal",
        ctaText: "Secure Digital Workplaces",
        secondaryCtaText: "Campus Intelligence",
        secondaryCtaAction: () => document.getElementById('workplace-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Mission-Critical IT Defense",
        title: "Data Centers, Server Rooms &",
        highlight: "Digital Network Protection",
        titleEnd: "",
        description: "Continuous physical & electronic auditing for mission-critical hyperscaler server rooms, SCIFs, and digital connectivity hubs.",
        image: city3,
        tags: ["Data Center SCIF", "Server Room Security", "Thermal Alarms"],
        telemetry: "Data Hub Secure",
        ctaText: "Secure Digital Workplaces",
        secondaryCtaText: "Campus Intelligence",
        secondaryCtaAction: () => document.getElementById('workplace-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Corporate Command Centers",
        title: "Centralized Multi-Site",
        highlight: "Corporate Command (C4I)",
        titleEnd: "",
        description: "Single-pane-of-glass operational visibility across pan-India tech facilities, emergency response escalations, and audit compliance.",
        image: city4,
        tags: ["Multi-Site C4I", "Emergency Response", "Audit Compliance"],
        telemetry: "Corporate C4I Live",
        ctaText: "Secure Digital Workplaces",
        secondaryCtaText: "Campus Intelligence",
        secondaryCtaAction: () => document.getElementById('workplace-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const GccItParksPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <SEO
                        title="GCC, IT Parks & Tech Campus Security Solutions | ISI Security"
                        description="Enterprise security and facility management for Global Capability Centers (GCCs), IT/ITES parks, and tech campuses with biometric turnstiles and SOC integration."
                        keywords="GCC Security Solutions, IT Park Security India, Corporate Tech Campus Guarding, Biometric Turnstile Access, ISI Security"
                        canonicalPath="/gccitparks"
                    />
                    <PageHero 
                        slides={gccSlides} 
                        secondaryScrollTarget="workplace-intelligence"
                        secondaryCtaLabel="Explore Campus Intelligence"
                    />
                </div>

                {/* All Sections */}
                {allGCCSections.map((section, index) => (
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

export default GccItParksPage;
