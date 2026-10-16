import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    cashLogisticsHero,
    allCashLogisticsSections,
    finalCTA
} from "@/data/cash-logistics-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import cashLogistics1 from "../assets/cash_logistics_1.jpg";
import cashLogistics2 from "../assets/cash_logistics_2.jpg";
import cashLogistics3 from "../assets/cash_logistics_3.jpg";
import cashLogistics4 from "../assets/cash_logistics_4.jpg";
import cashLogistics5 from "../assets/cash_logistics_5.jpg";

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const cashSlides: HeroSlide[] = [
    {
        badge: "Intelligent Cash-in-Transit",
        title: "Smart Armored CIT Fleets &",
        highlight: "Automated Currency Logistics",
        titleEnd: "",
        description: "India's premier tech-enabled CIT operations with satellite-tracked armored vehicles, remote immobilizers, and multi-compartment biometric vaults.",
        image: cashLogistics1,
        tags: ["Armored CIT", "Satellite Tracking", "Remote Immobilizer"],
        telemetry: "100% Fleets Monitored",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('intelligent-cit')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "RBI-Compliant Vaulting",
        title: "High-Security Vaulting &",
        highlight: "Currency Processing Centers",
        titleEnd: "",
        description: "RBI-certified high-speed note authentication, automated sorting, counterfeit detection, and multi-level physical access control.",
        image: cashLogistics2,
        tags: ["RBI Standards", "Automated Sorters", "Biometric Vaults"],
        telemetry: "Vault Perimeter Armed",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('intelligent-cit')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "ATM Cash Management",
        title: "End-to-End ATM Managed",
        highlight: "Services & First-Line Maintenance",
        titleEnd: "",
        description: "Proactive cash replenishment, FLM/SLM maintenance, automated cassette tracking, and 24/7 CCTV surveillance across banking networks.",
        image: cashLogistics3,
        tags: ["FLM / SLM Support", "ATM Replenishment", "Cassette Tracking"],
        telemetry: "99.9% Uptime Verified",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('intelligent-cit')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Retail Cash Solutions",
        title: "Cash Collection & Smart",
        highlight: "Safe Automation",
        titleEnd: "for Retail",
        description: "Doorstep retail cash pickup, on-site smart deposit safes with instant bank credit, and consolidated MIS reporting for retail chains.",
        image: cashLogistics4,
        tags: ["Doorstep Pickup", "Smart Safes", "Instant Bank Credit"],
        telemetry: "Retail Safes Online",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('intelligent-cit')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Dedicated CIT Command",
        title: "Centralized Transit Command &",
        highlight: "Incident Response Desk",
        titleEnd: "",
        description: "24/7 live telemetry monitoring every armored vehicle, geo-fence deviation alarms, pan-India police liaison, and emergency dispatch.",
        image: cashLogistics5,
        tags: ["Geofence Alerts", "Police Liaison", "Incident Command"],
        telemetry: "C2 Transit Glass Active",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('intelligent-cit')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const CashLogisticsPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <PageHero 
                        slides={cashSlides} 
                        secondaryScrollTarget="intelligent-cit"
                        secondaryCtaLabel="Explore Solutions"
                    />
                </div>

                {/* All 5 Sections */}
                {allCashLogisticsSections.map((section, index) => (
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

export default CashLogisticsPage;
