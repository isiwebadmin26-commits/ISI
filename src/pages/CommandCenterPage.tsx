import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    commandCenterHero,
    allCommandCenterSections,
    finalCTA
} from "@/data/command-center-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import commandCenter1 from "../assets/command_center_1.jpg";
import commandCenter2 from "../assets/command_center_2.jpg";
import commandCenter3 from "../assets/command_center_3.jpg";
import commandCenter4 from "../assets/command_center_4.jpg";
import commandCenter5 from "../assets/command_center_5.jpg";

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const commandCenterSlides: HeroSlide[] = [
    {
        badge: "Centralized Command Center",
        title: "Mission-Critical Intelligence.",
        highlight: "Quantum-Safe & Autonomous",
        titleEnd: "",
        description: "AI-native Command Center connecting IoT sensors, autonomous drones, and situational analytics for real-time pan-India control.",
        image: commandCenter1,
        tags: ["C4ISR Control", "IoT Telemetry", "Real-Time Monitoring"],
        telemetry: "24/7 SOC Online",
        ctaText: "Schedule a Demo",
        secondaryCtaText: "Explore Platform",
        secondaryCtaAction: () => document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Unified Situational Control",
        title: "Converged Operations Across",
        highlight: "All Enterprise Nodes",
        titleEnd: "",
        description: "Integrating CCTV video analytics, zero-trust access control, panic alarms, and armored CIT tracking into a single unified command glass.",
        image: commandCenter2,
        tags: ["Multi-Screen SOC", "Sensor Fusion", "Zero-Latency C2"],
        telemetry: "10,000+ Active Streams",
        ctaText: "Schedule a Demo",
        secondaryCtaText: "Explore Platform",
        secondaryCtaAction: () => document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Predictive Analytics",
        title: "AI Threat Detection With",
        highlight: "Sub-30s Response",
        titleEnd: "Protocols",
        description: "Edge computer vision identifying unauthorized intrusions, crowd surges, weapon detection, and facility anomalies automatically.",
        image: commandCenter3,
        tags: ["Edge AI Vision", "Predictive Analytics", "Instant Escalation"],
        telemetry: "99.8% Threat Accuracy",
        ctaText: "Schedule a Demo",
        secondaryCtaText: "Explore Platform",
        secondaryCtaAction: () => document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Tactical Workforce Telemetry",
        title: "Real-Time Field Force",
        highlight: "Auditing & GPS Dispatch",
        titleEnd: "",
        description: "Live GPS geofencing, guard patrol verification, instant panic response, and automated proof-of-presence compliance reporting.",
        image: commandCenter4,
        tags: ["Guard Tour Verification", "GPS Geofencing", "Live Dispatch"],
        telemetry: "Pan-India Field Sync",
        ctaText: "Schedule a Demo",
        secondaryCtaText: "Explore Platform",
        secondaryCtaAction: () => document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Autonomous Drone Docks",
        title: "Airspace Surveillance &",
        highlight: "Aerial Reconnaissance",
        titleEnd: "",
        description: "Fully automated drone docks launching scheduled autonomous aerial perimeter sweeps, thermal night vision, and rapid hazard verification.",
        image: commandCenter5,
        tags: ["Drone In A Box", "Thermal Night Vision", "Airspace Patrol"],
        telemetry: "Drone Hangar Ready",
        ctaText: "Schedule a Demo",
        secondaryCtaText: "Explore Platform",
        secondaryCtaAction: () => document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const CommandCenterPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <SEO
                        title="Centralized C4i Command Center & AI Video Analytics | ISI Security"
                        description="24/7 mission-critical C4i Command Center connecting AI video analytics, IoT intrusion sensors, autonomous drones, and rapid incident response across India."
                        keywords="C4i Command Center, Security Operations Center SOC, AI Video Surveillance, Remote Monitoring India, ISI Security"
                        canonicalPath="/commandcenter"
                    />
                    <PageHero 
                        slides={commandCenterSlides} 
                        secondaryScrollTarget="value-proposition"
                        secondaryCtaLabel="Explore Platform"
                    />
                </div>

                {/* All 5 Sections */}
                {allCommandCenterSections.map((section, index) => (
                    <SectionPanel key={section.id} section={section} index={index} />
                ))}

                {/* Final CTA Section */}
                <section className="py-10 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
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

export default CommandCenterPage;
