import { PageHero, HeroSlide } from "../PageHero";

const capabilitiesHeroSlides: HeroSlide[] = [
    {
        badge: "Advanced Capabilities 2030",
        title: "Intelligence-Led Security for a",
        highlight: "Complex World",
        titleEnd: "",
        description: "We combine elite human expertise with AI-powered technology to protect people, assets, and reputation across all domains.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
        tags: ["Integrated Operations", "AI Threat Intelligence", "Zero-Trust Physical"],
        telemetry: "Live SOC Link Active",
        ctaText: "Explore Solutions",
        secondaryCtaText: "Our Pillars",
        secondaryCtaAction: () => document.getElementById('physical-ops')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "AI & Threat Intelligence",
        title: "Autonomous Video Analytics &",
        highlight: "24/7 Command SOC",
        titleEnd: "",
        description: "Zero-latency situational awareness with edge-computed computer vision, biometric facial matching, and continuous behavioral anomaly sensing.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80",
        tags: ["Edge AI Vision", "Anomaly Detection", "24/7 Command SOC"],
        telemetry: "99.7% Accuracy",
        ctaText: "Schedule SOC Demo",
        secondaryCtaText: "Systems Integration",
        secondaryCtaAction: () => document.getElementById('systems-integration')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "IoT & Systems Integration",
        title: "Connected Security Ecosystem &",
        highlight: "Zero-Trust Access",
        titleEnd: "",
        description: "Seamless sensor fusion integrating access control, thermal CCTV, seismic sensors, and building management systems into a unified command platform.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
        tags: ["Zero-Trust Access", "Sensor Fusion", "K12 Barriers"],
        telemetry: "10,000+ IoT Nodes",
        ctaText: "Explore Integration",
        secondaryCtaText: "IoT Architecture",
        secondaryCtaAction: () => document.getElementById('systems-integration')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Specialized Logistics",
        title: "Connected Fleet & Field",
        highlight: "Transit Operations",
        titleEnd: "",
        description: "Tech-enabled transit for cash, bullion, and critical enterprise assets featuring smart armored fleets, biometric lockers, and telemetry geofencing.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
        tags: ["Armored Transit", "Geofence Telemetry", "Vault Security"],
        telemetry: "100% Secure Transit",
        ctaText: "Request Logistics Audit",
        secondaryCtaText: "Fleet Operations",
        secondaryCtaAction: () => document.getElementById('fleet-field-ops')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        badge: "Compliance & Governance",
        title: "ISO 9001:2015 Certified Defense &",
        highlight: "Academy Excellence",
        titleEnd: "",
        description: "Military-grade compliance, RBI-regulated cash handling, SCIF zero-trust environments, and continuous workforce development at the ISI Security Academy.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
        tags: ["ISO 9001:2015", "RBI Compliant", "ISI Academy Certified"],
        telemetry: "500+ Enterprises",
        ctaText: "Get Enterprise Quote",
        secondaryCtaText: "Our Pillars",
        secondaryCtaAction: () => document.getElementById('physical-ops')?.scrollIntoView({ behavior: 'smooth' })
    }
];

export const CapabilitiesHero = () => {
    return (
        <PageHero 
            slides={capabilitiesHeroSlides} 
            secondaryScrollTarget="physical-ops" 
            secondaryCtaLabel="Our Pillars" 
        />
    );
};
