import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonicalPath?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    noindex?: boolean;
    schema?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = "https://www.isisecurity.in";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

const BREADCRUMB_LABELS: Record<string, string> = {
    about: "About Us",
    contact: "Contact Us",
    career: "Careers",
    blog: "Security Insights & Blog",
    academy: "ISI Academy & Skill Development",
    courses: "Training Courses",
    capabilities: "Capabilities",
    offerings: "Service Offerings",
    solutions: "Comprehensive Solutions",
    verticals: "Industry Verticals",
    customers: "Our Customers",
    partners: "Our Partners",
    services: "Services",
    "security-services": "Security Services",
    "facility-management": "Facility Management",
    "integrated-facility-management": "Integrated Facility Management",
    "tech-driven-security": "Technology-Driven Security",
    "remote-monitoring": "Remote Monitoring & Surveillance",
    "manned-guarding": "Manned Guarding Services",
    "specialized-protection": "Specialized & Executive Protection",
    "mobile-patrol": "Mobile Patrol & Rapid Response",
    "hard-fm": "Hard Facility Management",
    "soft-fm": "Soft Facility Management",
    schoolsafety: "School Safety Solutions",
    campussafety: "Campus Safety Solutions",
    modernliving: "Modern Living & Residential Security",
    cashlogistics: "Cash Logistics & CIT",
    securevaluelogistics: "Secure Value Logistics",
    commandcenter: "C4i Command Centers",
    smartcity: "Smart City Surveillance",
    masstransportation: "Mass Transportation Security",
    traveltourism: "Travel, Tourism & Hospitality Security",
    gccitparks: "GCC & IT Parks Security",
    eventmanagement: "Event Security Management",
    privacypolicy: "Privacy Policy",
    termsofservice: "Terms of Service",
    cookiepolicy: "Cookie Policy",
    copyrightpolicy: "Copyright Policy",
    sitemap: "Sitemap",
};

function normalizeCanonicalUrl(canonicalPath?: string): string {
    const rawPath = canonicalPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
        try {
            const url = new URL(rawPath);
            const cleanPathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
            return `${BASE_URL}${cleanPathname}`;
        } catch {
            return `${BASE_URL}/`;
        }
    }
    const prefixed = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    const cleanPath = prefixed === "/" ? "/" : prefixed.replace(/\/+$/, "");
    return `${BASE_URL}${cleanPath}`;
}

function buildBreadcrumbSchema(canonicalUrl: string, pageTitle: string) {
    const pathname = canonicalUrl.replace(BASE_URL, "") || "/";
    const segments = pathname.split("/").filter(Boolean);

    const itemListElement: Array<Record<string, unknown>> = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
        },
    ];

    let accumulatedPath = "";
    segments.forEach((segment, idx) => {
        accumulatedPath += `/${segment}`;
        const isLast = idx === segments.length - 1;
        const cleanTitle = pageTitle.split("|")[0].trim();
        const humanSegment =
            BREADCRUMB_LABELS[segment.toLowerCase()] ||
            (isLast && cleanTitle
                ? cleanTitle
                : segment
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" "));

        itemListElement.push({
            "@type": "ListItem",
            position: idx + 2,
            name: humanSegment,
            item: `${BASE_URL}${accumulatedPath}`,
        });
    });

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
    };
}

export const SEO = ({
    title,
    description,
    keywords,
    canonicalPath,
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    noindex = false,
    schema,
}: SEOProps) => {
    const resolvedCanonicalPath = canonicalPath ?? canonical;
    useEffect(() => {
        // 1. Update Document Title
        document.title = title;

        // 2. Helper to set or create meta tags
        const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
            let tag = document.querySelector(`meta[${attr}="${key}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute(attr, key);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        // 3. Standard Meta Tags
        setMetaTag("name", "description", description);
        if (keywords) {
            setMetaTag("name", "keywords", keywords);
        }

        // 4. Canonical URL Normalization (Forces https://www.isisecurity.in)
        const fullCanonicalUrl = normalizeCanonicalUrl(resolvedCanonicalPath);
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (!canonicalTag) {
            canonicalTag = document.createElement("link");
            canonicalTag.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalTag);
        }
        canonicalTag.setAttribute("href", fullCanonicalUrl);

        // 5. Open Graph Meta Tags
        setMetaTag("property", "og:title", title);
        setMetaTag("property", "og:description", description);
        setMetaTag("property", "og:url", fullCanonicalUrl);
        setMetaTag("property", "og:type", ogType);
        setMetaTag("property", "og:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
        setMetaTag("property", "og:site_name", "ISI Security");

        // 6. Twitter Card Meta Tags
        setMetaTag("name", "twitter:card", "summary_large_image");
        setMetaTag("name", "twitter:title", title);
        setMetaTag("name", "twitter:description", description);
        setMetaTag("name", "twitter:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);

        // 7. Robots Directives
        setMetaTag(
            "name",
            "robots",
            noindex
                ? "noindex, nofollow"
                : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        );

        // 8. Dynamic Structured Data (JSON-LD: WebPage + BreadcrumbList + Custom Schema)
        if (!noindex) {
            const breadcrumbSchema = buildBreadcrumbSchema(fullCanonicalUrl, title);
            const webPageSchema: Record<string, unknown> = {
                "@context": "https://schema.org",
                "@type": ogType === "article" ? "Article" : "WebPage",
                "@id": `${fullCanonicalUrl}#webpage`,
                url: fullCanonicalUrl,
                name: title,
                description,
                isPartOf: { "@id": `${BASE_URL}/#website` },
                publisher: { "@id": `${BASE_URL}/#organization` },
                inLanguage: "en-IN",
            };

            const schemas: Record<string, unknown>[] = [webPageSchema, breadcrumbSchema];
            if (schema) {
                if (Array.isArray(schema)) {
                    schemas.push(...schema);
                } else {
                    schemas.push(schema);
                }
            }

            let scriptTag = document.getElementById("dynamic-seo-jsonld") as HTMLScriptElement | null;
            if (!scriptTag) {
                scriptTag = document.createElement("script");
                scriptTag.id = "dynamic-seo-jsonld";
                scriptTag.type = "application/ld+json";
                document.head.appendChild(scriptTag);
            }
            scriptTag.textContent = JSON.stringify(schemas);
        } else {
            const existingScript = document.getElementById("dynamic-seo-jsonld");
            if (existingScript) {
                existingScript.remove();
            }
        }
    }, [title, description, keywords, resolvedCanonicalPath, ogImage, ogType, noindex, schema]);

    return null;
};

export default SEO;
