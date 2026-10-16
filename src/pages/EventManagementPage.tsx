import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CashLogisticsSection } from "@/data/cash-logistics-data";

import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    eventHero,
    eventHeroSlides,
    allEventSections,
    finalCTA
} from "@/data/event-management-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import city1 from "../assets/command_center_4.jpg"; // Event command center
import city2 from "../assets/hero-integration.jpg"; // Logistics
import city3 from "../assets/verticals-surveillance.jpg"; // Crowd surveillance
import city4 from "../assets/about-hero-bg.jpg"; // Outdoor event venue

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const eventSlides: HeroSlide[] = [
    {
        badge: "Event Security & Crowd Safety",
        title: "AI-Driven Crowd Safety &",
        highlight: "Event Intelligence",
        titleEnd: "",
        description: "Protecting large-scale public events, stadium matches, and sports venues through real-time AI computer vision crowd density monitoring.",
        image: city1,
        tags: ["Crowd Density AI", "Perimeter Access", "Rapid Response"],
        telemetry: "Real-time Crowd Telemetry",
        ctaText: "Secure Large-Scale Events",
        secondaryCtaText: "Event Intelligence",
        secondaryCtaAction: () => document.getElementById('event-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Logistics & Access Control",
        title: "Integrated Venue &",
        highlight: "Access Operations",
        titleEnd: "Platform",
        description: "Unified platform for managing VIP escorts, vendor logistics, ticket gate biometric access control, and incident coordination.",
        image: city2,
        tags: ["VIP Security", "Biometric Turnstiles", "Vendor Audits"],
        telemetry: "Venue Access Synced",
        ctaText: "Secure Large-Scale Events",
        secondaryCtaText: "Event Intelligence",
        secondaryCtaAction: () => document.getElementById('event-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Critical Venue Protection",
        title: "High-Consequence Venue",
        highlight: "Infrastructure Protection",
        titleEnd: "",
        description: "Continuous sensor monitoring for stages, electrical distribution grids, broadcast towers, and emergency evacuation corridors.",
        image: city3,
        tags: ["Evacuation Paths", "Stage Security", "Thermal CCTV"],
        telemetry: "Infrastructure Shielded",
        ctaText: "Secure Large-Scale Events",
        secondaryCtaText: "Event Intelligence",
        secondaryCtaAction: () => document.getElementById('event-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Centralized C4I Center",
        title: "Unified Event Security",
        highlight: "Command Centers",
        titleEnd: "(C4I)",
        description: "Centralized C4I platform for seamless multi-agency coordination, live drone aerial feeds, and real-time situational awareness.",
        image: city4,
        tags: ["Multi-Agency C4I", "Aerial Feeds", "Emergency Dispatch"],
        telemetry: "Command Glass Active",
        ctaText: "Secure Large-Scale Events",
        secondaryCtaText: "Event Intelligence",
        secondaryCtaAction: () => document.getElementById('event-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const EventManagementPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <PageHero 
                        slides={eventSlides} 
                        secondaryScrollTarget="event-intelligence"
                        secondaryCtaLabel="Explore Event Intelligence"
                    />
                </div>

                {/* All Sections */}
                {allEventSections.map((section, index) => (
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

export default EventManagementPage;
