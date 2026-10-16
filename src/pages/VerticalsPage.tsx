import { Layout } from "@/components/Layout";
import { useContentProtection } from "@/hooks/useContentProtection";
import { Verticals } from "@/components/Verticals";

const VerticalsPage = () => {
    useContentProtection();
    return (
        <Layout noPadding={true}>
            <Verticals />
        </Layout>
    );
};

export default VerticalsPage;

