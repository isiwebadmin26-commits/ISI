import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useContentProtection } from "@/hooks/useContentProtection";
import { Verticals } from "@/components/Verticals";

const VerticalsPage = () => {
    useContentProtection();
    return (
        <Layout noPadding={true}>
            <SEO
                title="Industry Security Verticals | Banking, GCC, Manufacturing, Healthcare & Retail | ISI Security"
                description="Sector-specific security and facility management solutions engineered for Banking & Finance, IT/GCC Parks, Manufacturing, Healthcare, Education, and High-Value Retail."
                keywords="Industry Security Solutions, Banking Security, Manufacturing Plant Security, Hospital Security, IT Park Security, Retail Loss Prevention"
                canonicalPath="/verticals"
            />
            <Verticals />
        </Layout>
    );
};

export default VerticalsPage;
