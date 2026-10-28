import { Layout } from "@/components/Layout";
import { About } from "@/components/About";
import { SEO } from "@/components/SEO";
import { useContentProtection } from "@/hooks/useContentProtection";

const AboutPage = () => {
    useContentProtection();
    return (
        <Layout noPadding={true}>
            <SEO
                title="About ISI Security | 25+ Years of Enterprise Security & Facility Excellence"
                description="Learn about ISI Security's 25+ year legacy, PSARA compliance across 18+ states, C4i command center operations, and leadership in enterprise guarding and facility management."
                keywords="About ISI Security, Industrial Security and Intelligence India, PSARA Security Company, Corporate Security India, Facility Management Leadership"
                canonicalPath="/about"
            />
            <About />
        </Layout>
    );
};

export default AboutPage;
