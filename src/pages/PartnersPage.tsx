import { useEffect } from 'react';
import { useContentProtection } from "@/hooks/useContentProtection";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Partners } from "@/components/Partners";
import { TenderRFQ } from "@/components/partners/TenderRFQ";

export const PartnersPage = () => {
    useContentProtection();
    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <SEO
                title="Technology & Strategic Security Partners | Tender & RFQ | ISI Security"
                description="Collaborate with ISI Security on enterprise tenders, RFQs, and technology alliances across AI video analytics, biometric access control, and integrated security."
                keywords="ISI Security Partners, Security Tender RFQ India, Enterprise Security Alliances"
                canonicalPath="/partners"
            />
            <Partners />
            <TenderRFQ />
        </Layout>
    );
};

export default PartnersPage;
