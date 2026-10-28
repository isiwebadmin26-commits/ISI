import { Layout } from "@/components/Layout";
import { Career } from "@/components/Career";
import { SEO } from "@/components/SEO";
import { useContentProtection } from "@/hooks/useContentProtection";
import { JobMap } from "@/components/JobMap";
import { homeLocations } from "@/data/locations-data";

const CareersPage = () => {
    useContentProtection();
    return (
        <Layout>
            <SEO
                title="Careers at ISI Security | Security Officer, SOC & Facility Management Jobs"
                description="Join ISI Security's nationwide team across 18+ states. Explore career opportunities in corporate security, C4i command centers, cash logistics, and integrated facility management."
                keywords="ISI Security Careers, Security Jobs India, SOC Analyst Jobs, Facility Management Careers, Ex-Servicemen Security Jobs"
                canonicalPath="/career"
            />
            <Career />
        </Layout>
    );
};

export default CareersPage;
