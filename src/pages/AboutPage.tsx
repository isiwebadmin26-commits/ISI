import { Layout } from "@/components/Layout";
import { About } from "@/components/About";
import { useContentProtection } from "@/hooks/useContentProtection";

const AboutPage = () => {
    useContentProtection();
    return (
        <Layout noPadding={true}>
            <About />
        </Layout>
    );
};

export default AboutPage;

