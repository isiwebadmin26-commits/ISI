import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { CashLogisticsSection } from "@/data/cash-logistics-data";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    transitHero,
    transitHeroSlides,
    allTransitSections,
    finalCTA
} from "@/data/mass-transportation-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import transport1 from "../assets/command_center_1.jpg";
import transport2 from "../assets/command_center_3.jpg";
import transport3 from "../assets/hero-soc.jpg";
import transport4 from "../assets/verticals-surveillance.jpg";
import transport5 from "../assets/hero-drone.jpg";

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const transitSlides: HeroSlide[] = [
    {
        badge: "Mass Transportation Platform",
        title: "AI-Driven Passenger Safety &",
        highlight: "Transit Intelligence",
        titleEnd: "",
        description: "Protecting metros, railway stations, bus corridors, and airports with real-time AI crowd monitoring, baggage tracking, and security alerts.",
        image: transport1,
        tags: ["Metro Security", "Passenger Safety AI", "Baggage Tracking"],
        telemetry: "Transit Grid Active",
        ctaText: "Secure Transit Networks",
        secondaryCtaText: "Transport Intelligence",
        secondaryCtaAction: () => document.getElementById('transit-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Intelligent Mobility Analytics",
        title: "Mobility Flow &",
        highlight: "Crowd Surges Control",
        titleEnd: "",
        description: "Optimizing terminal passenger movement, preventing platform bottlenecks, and coordinating multi-modal transport scheduling.",
        image: transport2,
        tags: ["Flow Analytics", "Bottleneck Sensing", "Automated Gates"],
        telemetry: "Platform Flow Normal",
        ctaText: "Secure Transit Networks",
        secondaryCtaText: "Transport Intelligence",
        secondaryCtaAction: () => document.getElementById('transit-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Infrastructure & Track Protection",
        title: "Critical Railway &",
        highlight: "Airport Infrastructure",
        titleEnd: "Shield",
        description: "Continuous sensor monitoring for tracks, high-speed rail signaling, tunnels, rail depots, and airport tarmac security.",
        image: transport3,
        tags: ["Track Sensors", "Tarmac Defense", "Perimeter Radar"],
        telemetry: "Corridors Secured",
        ctaText: "Secure Transit Networks",
        secondaryCtaText: "Transport Intelligence",
        secondaryCtaAction: () => document.getElementById('transit-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Unified Transit Command",
        title: "Centralized C4I",
        highlight: "Transit Operations",
        titleEnd: "Center",
        description: "Integrated command platform linking CCTV video walls, railway police dispatch, emergency brakes, and rapid crisis management.",
        image: transport4,
        tags: ["Integrated C4I", "Fleet GPS Tracking", "Police Dispatch"],
        telemetry: "C4I Command Live",
        ctaText: "Secure Transit Networks",
        secondaryCtaText: "Transport Intelligence",
        secondaryCtaAction: () => document.getElementById('transit-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const MassTransportationPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <SEO
                        title="Mass Transportation, Metro, Airport & Transit Hub Security | ISI Security"
                        description="High-density transit security for airports, metro rail networks, bus terminals, and seaports with crowd analytics, baggage screening, and emergency response."
                        keywords="Mass Transportation Security, Metro Rail Security, Airport Terminal Guarding, Transit Hub Surveillance, ISI Security"
                        canonicalPath="/masstransportation"
                    />
                    <PageHero 
                        slides={transitSlides} 
                        secondaryScrollTarget="transit-intelligence"
                        secondaryCtaLabel="Explore Transport Intelligence"
                    />
                </div>

                {/* All Sections */}
                {allTransitSections.map((section, index) => (
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

export default MassTransportationPage;
