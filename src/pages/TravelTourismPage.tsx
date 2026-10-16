import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CashLogisticsSection } from "@/data/cash-logistics-data";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    tourismHero,
    tourismHeroSlides,
    allTourismSections,
    finalCTA
} from "@/data/travel-tourism-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

import city1 from "../assets/command_center_5.jpg";
import city2 from "../assets/hero-integration.jpg";
import city3 from "../assets/verticals-surveillance.jpg";
import city4 from "../assets/about-hero-bg.jpg";

const tourismSlides: HeroSlide[] = [
    {
        badge: "Tourism Intelligence",
        title: "AI-Driven Visitor Safety &",
        highlight: "Destination Intelligence",
        titleEnd: "",
        description: "Protecting tourist destinations, heritage monuments, and visitor corridors through AI-powered real-time surveillance and crowd density analytics.",
        image: city1,
        tags: ["Visitor Safety AI", "Heritage Protection", "Crowd Density Heatmaps"],
        telemetry: "Tourism SOC Active",
        ctaText: "Secure Tourism Destinations",
        secondaryCtaText: "Visitor Intelligence",
        secondaryCtaAction: () => document.getElementById('tourism-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Flow & Capacity",
        title: "Smart Destination",
        highlight: "Management & Experience",
        titleEnd: "",
        description: "Optimizing tourist flow, pedestrian choke points, and venue capacity to eliminate dangerous stampedes and elevate guest experience.",
        image: city2,
        tags: ["Capacity AI", "Pedestrian Flow", "Queue Analytics"],
        telemetry: "Flow Sensors Online",
        ctaText: "Secure Tourism Destinations",
        secondaryCtaText: "Visitor Intelligence",
        secondaryCtaAction: () => document.getElementById('tourism-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Asset Protection",
        title: "Tourism Infrastructure &",
        highlight: "Resort Asset Security",
        titleEnd: "",
        description: "Continuous perimeter and asset defense for luxury hotels, eco-resorts, cruise terminals, amusement parks, and critical tourism hubs.",
        image: city3,
        tags: ["Resort Security", "Cruise Terminals", "Perimeter Sensors"],
        telemetry: "Perimeter Shield Active",
        ctaText: "Secure Tourism Destinations",
        secondaryCtaText: "Visitor Intelligence",
        secondaryCtaAction: () => document.getElementById('tourism-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "C4I Emergency Hub",
        title: "Unified Tourism",
        highlight: "Command & Operations",
        titleEnd: "",
        description: "Centralized C4I platform coordinating local tourist police, medical responders, private security, and municipal departments in real time.",
        image: city4,
        tags: ["C4I Hub", "Multi-Agency Dispatch", "Rapid Emergency Alert"],
        telemetry: "C4I Grid Synchronized",
        ctaText: "Secure Tourism Destinations",
        secondaryCtaText: "Visitor Intelligence",
        secondaryCtaAction: () => document.getElementById('tourism-intelligence')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const TravelTourismPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                <PageHero slides={tourismSlides} />

                {/* All Sections */}
                {allTourismSections.map((section, index) => (
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

export default TravelTourismPage;
