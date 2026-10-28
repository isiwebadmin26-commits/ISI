import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { SectionPanel } from "@/components/cash-logistics/SectionPanel";
import {
    secureLogisticsHero,
    allSecureLogisticsSections,
    finalCTA
} from "@/data/secure-value-logistics-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import secureLogistics1 from "../assets/secure_logistics_1.jpg";
import secureLogistics2 from "../assets/secure_logistics_2.jpg";
import cashLogistics1 from "../assets/cash_logistics_1.jpg";
import cashLogistics3 from "../assets/cash_logistics_3.jpg";
import cashLogistics5 from "../assets/cash_logistics_5.jpg";

import { PageHero, HeroSlide } from "@/components/PageHero";
import { useContentProtection } from "@/hooks/useContentProtection";

const secureLogisticsSlides: HeroSlide[] = [
    {
        badge: "Secure Value Logistics",
        title: "Securing Critical Assets,",
        highlight: "Cash & High-Value Cargo",
        titleEnd: "",
        description: "Tech-led platform for cash, bullion, semiconductors, and critical enterprise assets with smart CIT vehicles and real-time tracking.",
        image: secureLogistics1,
        tags: ["Armored Transit", "RFID Vaulting", "GPS Geofencing"],
        telemetry: "Fleet Telemetry Live",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('cash-monetary-logistics')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Smart CIT Armored Fleets",
        title: "Armored Fleets With",
        highlight: "Remote Geofence Locks",
        titleEnd: "",
        description: "Heavy armored carriers equipped with satellite telemetry, remote ignition cutoff, biometrically locked vaults, and instant SOS beacons.",
        image: secureLogistics2,
        tags: ["Remote Immobilizer", "Biometric Vaults", "Satellite GPS"],
        telemetry: "100% Route Compliance",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('cash-monetary-logistics')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Cash Processing & Vaulting",
        title: "Automated Currency Sorters &",
        highlight: "RBI-Grade Vaults",
        titleEnd: "",
        description: "High-speed currency verification, sorting, safe custody, and end-to-end digital audit trails strictly adhering to RBI guidelines.",
        image: cashLogistics1,
        tags: ["RBI Compliant", "High-Speed Sorters", "Biometric Custody"],
        telemetry: "Vault Security Active",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('cash-monetary-logistics')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "ATM Network Management",
        title: "24/7 Cash Replenishment &",
        highlight: "First-Line Maintenance",
        titleEnd: "",
        description: "Ensuring 99.9% ATM uptime, cassette reconciliation, proactive cash logistics, and comprehensive field emergency response.",
        image: cashLogistics3,
        tags: ["ATM Replenishment", "Cassette Tracking", "FLM Maintenance"],
        telemetry: "99.9% Uptime Monitored",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('cash-monetary-logistics')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "High-Value Cargo Protection",
        title: "Armed Tactical Protection &",
        highlight: "Precious Asset Custody",
        titleEnd: "",
        description: "Ex-military tactical personnel protecting precious metals, pharmaceuticals, high-value electronics, and classified shipments.",
        image: cashLogistics5,
        tags: ["Secure Transit Services", "Pharmaceutical Transit", "Bullion Protection"],
        telemetry: "High-Value Corridor Active",
        ctaText: "Get Started",
        secondaryCtaText: "Explore Solutions",
        secondaryCtaAction: () => document.getElementById('cash-monetary-logistics')?.scrollIntoView({ behavior: 'smooth' })
    }
];

const SecureValueLogisticsPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced 2-Column Showcase Slider */}
                <div id="hero">
                    <SEO
                        title="Secure Value Logistics | Bullion, Jewellery & High-Value Asset Transit | ISI Security"
                        description="Specialized high-value cargo protection, bullion and diamond transit, pharmaceutical custody, and RFID-enabled vaulting across India."
                        keywords="Secure Value Logistics, High Value Cargo Security, Bullion and Diamond Transit, Jewellery Logistics Security, ISI Security"
                        canonicalPath="/securevaluelogistics"
                    />
                    <PageHero 
                        slides={secureLogisticsSlides} 
                        secondaryScrollTarget="cash-monetary-logistics"
                        secondaryCtaLabel="Explore Solutions"
                    />
                </div>

                {/* All 9 Sections */}
                {allSecureLogisticsSections.map((section, index) => (
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

export default SecureValueLogisticsPage;
