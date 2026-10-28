import { useEffect } from 'react';
import { useContentProtection } from "@/hooks/useContentProtection";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Customers } from "@/components/Customers";

export const CustomersPage = () => {
    useContentProtection();
    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <SEO
                title="Our Enterprise Clients & Case Studies | ISI Security"
                description="Trusted by 500+ leading enterprises, banks, hospitals, educational institutions, and government infrastructure organizations across India."
                keywords="ISI Security Clients, Enterprise Security Case Studies, Corporate Security Testimonials India"
                canonicalPath="/customers"
            />
            <Customers />
        </Layout>
    );
};

export default CustomersPage;
