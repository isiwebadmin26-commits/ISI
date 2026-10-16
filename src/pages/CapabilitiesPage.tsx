
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CapabilitiesLandingSection } from "@/components/capabilities/CapabilitiesLandingSections";
import { Solutions } from "@/components/Solutions";
import {
    capabilitiesHero,
    allCapabilitiesSections,
    finalCapabilitiesCTA
} from "@/data/capabilities-landing-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CapabilitiesHero } from "@/components/capabilities/CapabilitiesHero";
import { useContentProtection } from "@/hooks/useContentProtection";
import SEO from "@/components/SEO";

const CapabilitiesPage = () => {
    useContentProtection();

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <SEO 
                title="Security Capabilities & Advanced Operations | ISI" 
                description="Explore ISI's intelligence-led security framework: physical operations, rapid mobilization, autonomous drones, AI surveillance, and SCIF zero-trust environments." 
                canonical="/capabilities" 
            />
            <Header />
            <main className="flex-grow overflow-x-hidden">
                {/* Hero Section with Enhanced Showcase Slider */}
                <div id="hero">
                    <CapabilitiesHero />
                </div>

                {/* Main Content Sections (The 5-panel structure) */}
                {allCapabilitiesSections.map((section, index) => (
                    <CapabilitiesLandingSection key={section.id} section={section} index={index} />
                ))}

                {/* Merged Solutions Section */}
                <Solutions />

                {/* Final CTA Section */}
                <section className="py-12 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
                    <div className="container mx-auto px-4 lg:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                {finalCapabilitiesCTA.title}
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                                {finalCapabilitiesCTA.subtitle}
                            </p>
                            <Link to={finalCapabilitiesCTA.link}>
                                <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-7 rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-lg">
                                    {finalCapabilitiesCTA.buttonText}
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CapabilitiesPage;
