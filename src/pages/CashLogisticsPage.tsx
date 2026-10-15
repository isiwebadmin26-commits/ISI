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
import { ArrowRight } from "lucide-react";
import { IndustryHero } from "@/components/industry/IndustryHero";

import cashLogistics1 from "../assets/cash_logistics_1.jpg";
import cashLogistics2 from "../assets/cash_logistics_2.jpg";
import cashLogistics3 from "../assets/cash_logistics_3.jpg";
import cashLogistics4 from "../assets/cash_logistics_4.jpg";
import cashLogistics5 from "../assets/cash_logistics_5.jpg";

const heroSlides = [
    { image: cashLogistics1 },
    { image: cashLogistics2 },
    { image: cashLogistics3 },
    { image: cashLogistics4 },
    { image: cashLogistics5 }
];

import { useContentProtection } from "@/hooks/useContentProtection";

const CashLogisticsPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Carousel */}
                <IndustryHero
                    badge={cashLogisticsHero.badge}
                    title={cashLogisticsHero.title}
                    subtitle={cashLogisticsHero.subtitle}
                    slides={heroSlides}
                    primaryCtaText="Get Started"
                    secondaryCtaText="Explore Solutions"
                    secondaryCtaTargetId="intelligent-cit"
                />

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
