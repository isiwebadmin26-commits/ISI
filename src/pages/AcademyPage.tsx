import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useContentProtection } from "@/hooks/useContentProtection";
import SEO from "@/components/SEO";
import { ISIAcademy } from "@/components/academy/ISIAcademy";
import { BookCounsellorModal } from "@/components/academy/BookCounsellorModal";

export const AcademyPage = () => {
  useContentProtection();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryCourseTitle, setEnquiryCourseTitle] = useState<string>("");

  useEffect(() => {
    const shouldOpen = 
      searchParams.get("book") === "true" || 
      searchParams.get("slot") === "true" ||
      searchParams.get("calendar") === "true" ||
      location.hash === "#book" ||
      location.hash === "#admissions";

    if (shouldOpen) {
      const program = searchParams.get("program") || "ISI Academy General Consultation";
      setEnquiryCourseTitle(program);
      setIsEnquiryOpen(true);
    }
  }, [searchParams, location.hash]);

  const handleOpenEnquiry = (programTitle?: string) => {
    const title = programTitle || "ISI Academy General Program";
    setEnquiryCourseTitle(title);
    setIsEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
  };

  return (
    <Layout>
      <SEO 
        title="ISI Academy | Industry-Led Security Learning & Workforce Development Platform"
        description="Build security expertise and safer organizations. Industry-led learning, practical lab execution, certification, and enterprise workforce development."
        canonical="/academy"
      />

      <div className="bg-background min-h-screen">
        {/* ISI ACADEMY CONTENT */}
        <ISIAcademy onEnquireClick={(title) => handleOpenEnquiry(title)} />

        {/* ACADEMIC COUNSELING & LONG BOOKING MODAL */}
        <BookCounsellorModal 
          isOpen={isEnquiryOpen}
          onClose={handleCloseEnquiry}
          initialProgram={enquiryCourseTitle}
        />
      </div>
    </Layout>
  );
};

export default AcademyPage;
