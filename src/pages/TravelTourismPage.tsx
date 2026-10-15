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
import { ArrowRight } from "lucide-react";
import { IndustryHero } from "@/components/industry/IndustryHero";

import city1 from "../assets/command_center_5.jpg";
import city2 from "../assets/hero-integration.jpg";
import city3 from "../assets/verticals-surveillance.jpg";
import city4 from "../assets/about-hero-bg.jpg";

const heroSlides = [
    { image: city1, ...tourismHeroSlides[0] },
    { image: city2, ...tourismHeroSlides[1] },
    { image: city3, ...tourismHeroSlides[2] },
    { image: city4, ...tourismHeroSlides[3] }
];

import { useContentProtection } from "@/hooks/useContentProtection";

const TravelTourismPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Carousel */}
                <IndustryHero
                    badge={tourismHero.badge}
                    title={tourismHeroSlides[0]?.title || "Travel & Tourism Security"}
                    subtitle={tourismHeroSlides[0]?.subtitle || "AI-Powered Tourist Protection & Destination Surveillance"}
                    slides={heroSlides}
                    primaryCtaText="Secure Tourism Destinations"
                    secondaryCtaText="Explore Visitor Intelligence"
                    secondaryCtaTargetId="tourism-intelligence"
                    features={[
                        "AI-Powered Tourist Area Surveillance",
                        "Visitor Safety & Crowd Monitoring",
                        "Destination Infrastructure Protection",
                        "Integrated Tourism Command Centers"
                    ]}
                />

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
