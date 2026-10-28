import { Layout } from "@/components/Layout";
import { OfferingStack } from "@/components/OfferingStack";
import { SEO } from "@/components/SEO";
import { useContentProtection } from "@/hooks/useContentProtection";

const OfferingsPage = () => {
    useContentProtection();
    return (
        <Layout noPadding={true}>
            <SEO
                title="Integrated Security, Facility Management & AI Surveillance Offerings | ISI Security"
                description="Explore ISI Security's comprehensive service stack: PSARA manned guarding, C4i remote surveillance, hard & soft facility management, and specialized executive protection."
                keywords="Security Service Offerings, Manned Guarding, Remote Surveillance, Integrated Facility Management, Executive Protection Services, ISI Security"
                canonicalPath="/offerings"
            />
            <OfferingStack />
        </Layout>
    );
};

export default OfferingsPage;
