import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { useContentProtection } from "@/hooks/useContentProtection";
import SEO from "@/components/SEO";
import { 
  coursesData, 
  whyChooseData, 
  courseDeliveryData, 
  targetAudienceData, 
  Course 
} from "@/data/courses-data";
import { 
  Brain, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Server, 
  Bot, 
  Atom, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Building2, 
  Target, 
  CheckCircle2, 
  Briefcase, 
  Users, 
  Compass, 
  Search, 
  ArrowRight, 
  Clock, 
  Users2, 
  Sparkles, 
  X, 
  Check, 
  MessageSquare,
  ChevronRight,
  Filter,
  Calendar,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitAcademyInquiry } from "@/services/formService";

// Icon mapping helper
const getCourseIcon = (iconName: string, className: string = "w-6 h-6") => {
  switch (iconName) {
    case "Brain": return <Brain className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Server": return <Server className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Atom": return <Atom className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "BookOpen": return <BookOpen className={className} />;
    case "Award": return <Award className={className} />;
    case "Building2": return <Building2 className={className} />;
    case "Target": return <Target className={className} />;
    case "CheckCircle2": return <CheckCircle2 className={className} />;
    case "Briefcase": return <Briefcase className={className} />;
    case "Users": return <Users className={className} />;
    case "Compass": return <Compass className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const CoursesPage = () => {
  useContentProtection();
  
  // Modal & Selection States
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryCourseTitle, setEnquiryCourseTitle] = useState<string>("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table Filter & Search States
  const [tableFilter, setTableFilter] = useState<"All" | "Core" | "Specialized">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Dedicated Course Benefits Directory State
  const [activeBenefitsCourseId, setActiveBenefitsCourseId] = useState<string>("C1");
  const activeBenefitsCourse = useMemo(
    () => coursesData.find((c) => c.id === activeBenefitsCourseId) || coursesData[0],
    [activeBenefitsCourseId]
  );

  // Categorized Courses
  const flagshipCourses = useMemo(() => coursesData.filter(c => c.category === "Core"), []);
  const specializedCourses = useMemo(() => coursesData.filter(c => c.category === "Specialized"), []);

  // Filtered Courses for Table
  const filteredCourses = useMemo(() => {
    return coursesData.filter(course => {
      const matchesCategory = tableFilter === "All" || course.category === tableFilter;
      const matchesSearch = searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tableFilter, searchQuery]);

  // Open enquiry modal prefilled with optional course title
  const handleOpenEnquiry = (courseTitle: string = "") => {
    setEnquiryCourseTitle(courseTitle);
    setFormData(prev => ({ ...prev, course: courseTitle || prev.course || "General Course Enquiry" }));
    setIsEnquiryOpen(true);
  };

  // Form Submit Handler
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAcademyInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.course || enquiryCourseTitle || "Technology Course Enquiry",
        message: formData.message || "Enquiry from Courses page",
        enquiryType: "Course Enquiry"
      });

      setIsEnquiryOpen(false);
      setFormData({ name: "", email: "", phone: "", course: "", message: "" });
      toast.success("Enquiry Submitted Successfully!", {
        description: "Our CDAC-MEPZ admissions team will get in touch with you shortly."
      });
    } catch (error) {
      toast.error("Submission Error", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToPortfolio = () => {
    const el = document.getElementById("course-portfolio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <SEO 
        title="Technology Courses | CDAC-MEPZ"
        description="Explore 9 premium technology courses from CDAC-MEPZ including AI, Cyber-Security, IoT, Robotics, HPC, Quantum Computing, EV and more."
        canonical="/courses"
      />

      <div className="bg-background min-h-screen">
        
        {/* SECTION 1 — HERO */}
        <section className="relative min-h-[calc(100vh-5.5rem)] flex items-center py-12 md:py-16 bg-gradient-to-br from-primary/95 via-primary to-primary/90 text-white overflow-hidden">
          {/* Top Banner Image Background Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')` }}
          />

          {/* Background Patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              
              {/* Badges */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">9 Premium Tech Courses</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 rounded-full shadow-lg">
                  <Award className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-bold text-emerald-200">CDAC Certification</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Premium Technology Courses.<br className="hidden md:inline" /> Accessible to Everyone.
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
                Industry-aligned technology programs from CDAC-MEPZ Digital Technology Centre.
              </p>

              {/* Supporting Text */}
              <p className="text-sm md:text-base text-white/80 max-w-3xl mx-auto leading-relaxed mb-10">
                Build future-ready skills in AI, Cyber-Security, IoT, Robotics, HPC, Quantum Computing, EV and more.
              </p>

              {/* Highlights Box */}
              <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">9</div>
                  <div className="text-xs md:text-sm text-white/80 font-medium">Tech Courses</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-emerald-300 mb-1">2-3 Mo</div>
                  <div className="text-xs md:text-sm text-white/80 font-medium">Duration</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">CDAC</div>
                  <div className="text-xs md:text-sm text-white/80 font-medium">Certification</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={scrollToPortfolio}
                  size="lg" 
                  className="w-full sm:w-auto gap-2 bg-white text-primary hover:bg-white/95 text-base font-extrabold px-9 py-6 rounded-full shadow-2xl transition-all duration-200 hover:scale-105"
                >
                  Explore Courses
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => handleOpenEnquiry()}
                  size="lg" 
                  className="w-full sm:w-auto gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-extrabold px-9 py-6 rounded-full shadow-2xl transition-all duration-200 hover:scale-105"
                >
                  Enquire Now
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2 — COURSE PORTFOLIO */}
        <section id="course-portfolio" className="py-20 md:py-28 container mx-auto px-4 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Layers className="w-4 h-4" />
              CDAC-MEPZ Portfolio
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Explore Our Course Portfolio
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Core technology programs and specialized courses designed for emerging industry demands.
            </p>
          </div>

          {/* CATEGORY A: FLAGSHIP COURSES */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 border-b border-border/60 pb-4">
              <div className="w-3 h-8 bg-primary rounded-full" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">Flagship Courses</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider">Core Volume Drivers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {flagshipCourses.map((course) => (
                <div 
                  key={course.id}
                  className="group relative bg-card border-2 border-primary/20 hover:border-primary rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Badge */}
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-extrabold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                    {course.badge}
                  </div>

                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getCourseIcon(course.iconName, "w-7 h-7")}
                      </div>
                      <span className="text-2xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors">
                        {course.id}
                      </span>
                    </div>

                    <span className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold mb-3">
                      {course.categoryLabel}
                    </span>

                    <h4 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Benefits Preview */}
                    {course.benefits && course.benefits.length > 0 && (
                      <div className="mb-5 space-y-1.5 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Key Course Benefits</span>
                        <ul className="space-y-1">
                          {course.benefits.slice(0, 2).map((b, bIdx) => (
                            <li key={bIdx} className="text-xs text-foreground/80 flex items-start gap-1.5 line-clamp-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <span className="truncate">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/50 text-xs font-medium text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span>{course.duration} ({course.hours} hrs)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-primary shrink-0" />
                        <span>Batch Size: {course.batchSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => setSelectedCourse(course)}
                        variant="outline" 
                        className="w-full font-bold text-xs rounded-xl hover:bg-primary/5"
                      >
                        Benefits & Details
                      </Button>
                      <Button 
                        onClick={() => handleOpenEnquiry(course.title)}
                        className="w-full font-bold text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Enquire Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORY B: SPECIALIZED COURSES */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b border-border/60 pb-4">
              <div className="w-3 h-8 bg-accent rounded-full" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">Specialized Courses</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider">Portfolio Diversification</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specializedCourses.map((course) => (
                <div 
                  key={course.id}
                  className="group bg-card border border-border hover:border-primary/50 rounded-3xl p-7 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getCourseIcon(course.iconName, "w-6 h-6")}
                      </div>
                      <span className="text-xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                        {course.id}
                      </span>
                    </div>

                    <span className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold mb-3">
                      {course.categoryLabel}
                    </span>

                    <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Benefits Preview */}
                    {course.benefits && course.benefits.length > 0 && (
                      <div className="mb-5 space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Key Course Benefits</span>
                        <ul className="space-y-1">
                          {course.benefits.slice(0, 2).map((b, bIdx) => (
                            <li key={bIdx} className="text-[11px] text-foreground/80 flex items-start gap-1.5 line-clamp-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <span className="truncate">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-border/50 text-xs font-medium text-muted-foreground mb-6">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{course.duration} ({course.hours}h)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Batch: {course.batchSize}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => setSelectedCourse(course)}
                        variant="outline" 
                        size="sm"
                        className="w-full font-bold text-xs rounded-xl"
                      >
                        Benefits & Details
                      </Button>
                      <Button 
                        onClick={() => handleOpenEnquiry(course.title)}
                        size="sm"
                        className="w-full font-bold text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Enquire
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* SECTION 2.5 — DEDICATED COURSE BENEFITS & OUTCOMES DIRECTORY */}
        <section id="course-benefits" className="py-20 md:py-28 bg-gradient-to-b from-card via-muted/20 to-background border-t border-border/60">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Target className="w-4 h-4" />
                Comprehensive Program Value
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                Dedicated Course Benefits & Outcomes
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Explore the verified learning outcomes, practical applications, technical skills acquired, career relevance, and prerequisites for each course.
              </p>
            </div>

            {/* Course Selector Tabs */}
            <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide no-scrollbar w-full">
              {coursesData.map((course) => {
                const isActive = activeBenefitsCourseId === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setActiveBenefitsCourseId(course.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]"
                        : "bg-card border border-border hover:border-primary/40 text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                      {course.id}
                    </span>
                    <span>{course.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Course Benefits Card Grid */}
            <div className="bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border/60 mb-8">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {getCourseIcon(activeBenefitsCourse.iconName, "w-8 h-8")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-primary/15 text-primary">
                        {activeBenefitsCourse.id}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                        {activeBenefitsCourse.categoryLabel}
                      </span>
                      {activeBenefitsCourse.badge && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          {activeBenefitsCourse.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                      {activeBenefitsCourse.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-muted/60 border border-border/60 text-xs">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-bold text-foreground">{activeBenefitsCourse.duration} ({activeBenefitsCourse.hours} Hours)</span>
                  </div>
                  <Button
                    onClick={() => handleOpenEnquiry(activeBenefitsCourse.title)}
                    className="font-bold rounded-xl gap-2 shadow-sm"
                  >
                    <span>Enquire for {activeBenefitsCourse.id}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 3-Column Detailed Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Key Benefits & Learning Outcomes */}
                <div className="space-y-6 bg-muted/30 border border-border/60 rounded-2xl p-6">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3 uppercase tracking-wide">
                      <Award className="w-4 h-4" />
                      <h4>Key Program Benefits</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {activeBenefitsCourse.benefits?.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-foreground/90 flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3 uppercase tracking-wide">
                      <Target className="w-4 h-4" />
                      <h4>Learning Outcomes</h4>
                    </div>
                    <ul className="space-y-2">
                      {activeBenefitsCourse.learningOutcomes?.map((outcome, idx) => (
                        <li key={idx} className="text-xs text-foreground/80 flex items-start gap-2 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 2: Skills Acquired & Practical Applications */}
                <div className="space-y-6 bg-muted/30 border border-border/60 rounded-2xl p-6">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3 uppercase tracking-wide">
                      <Cpu className="w-4 h-4" />
                      <h4>Technical Skills Acquired</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeBenefitsCourse.skillsAcquired?.map((skill, idx) => (
                        <span key={idx} className="text-xs font-semibold px-3 py-1 rounded-lg bg-card border border-border text-foreground shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3 uppercase tracking-wide">
                      <Zap className="w-4 h-4" />
                      <h4>Practical Applications & Labs</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {activeBenefitsCourse.practicalApplications?.map((app, idx) => (
                        <li key={idx} className="text-xs text-foreground/80 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3: Career Relevance, Audience & Prerequisites */}
                <div className="space-y-6 bg-muted/30 border border-border/60 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2 uppercase tracking-wide">
                        <Briefcase className="w-4 h-4" />
                        <h4>Career Relevance</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeBenefitsCourse.careerRelevance?.map((role, idx) => (
                          <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2 uppercase tracking-wide">
                        <Users className="w-4 h-4" />
                        <h4>Intended Audience</h4>
                      </div>
                      <ul className="space-y-1.5">
                        {activeBenefitsCourse.intendedAudience?.map((aud, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary font-bold">•</span>
                            <span>{aud}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wide">
                        <BookOpen className="w-4 h-4" />
                        <h4>Prerequisites</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        {activeBenefitsCourse.prerequisites}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <Button
                      onClick={() => setSelectedCourse(activeBenefitsCourse)}
                      variant="outline"
                      className="w-full py-5 text-xs font-bold rounded-xl border-primary/30 hover:bg-primary/5 text-primary"
                    >
                      View Full Details Modal
                    </Button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3 — WHY THESE COURSES */}
        <section className="py-20 bg-muted/30 border-y border-border/60">
          <div className="container mx-auto px-4 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Award className="w-4 h-4" />
                Value Proposition
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                Why Choose CDAC-MEPZ?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Trusted brand equity, practical infrastructure, and industry-aligned instruction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseData.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-card border border-border/80 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    {getCourseIcon(item.iconName, "w-7 h-7")}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 4 — COURSE DELIVERY */}
        <section className="py-20 md:py-28 container mx-auto px-4 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Calendar className="w-4 h-4" />
              Delivery Model
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Designed for Flexible Learning
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Structured learning pathways designed for working professionals, students, and corporate teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseDeliveryData.map((item, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-4">
                  {item.badge}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* SECTION 5 — WHO CAN BENEFIT */}
        <section className="py-20 bg-muted/20 border-y border-border/60">
          <div className="container mx-auto px-4 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Users className="w-4 h-4" />
                Target Learners
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                Who Are These Courses For?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Tailored for individuals and organizations aiming to excel in emerging technology domains.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {targetAudienceData.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-card border border-border/80 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                      {getCourseIcon(item.iconName, "w-6 h-6")}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 6 — COURSE COMPARISON TABLE */}
        <section className="py-20 md:py-28 container mx-auto px-4 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Filter className="w-4 h-4" />
              Full Matrix
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Course Comparison
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Compare duration, batch sizes, and program specifications across all 9 technology courses.
            </p>
          </div>

          {/* Filter & Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-card border border-border p-4 rounded-2xl shadow-sm">
            
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {(["All", "Core", "Specialized"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTableFilter(tab)}
                  className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    tableFilter === tab 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tab === "All" ? "All Courses (9)" : tab === "Core" ? "Core (3)" : "Specialized (6)"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Table View */}
          <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-foreground font-bold border-b border-border">
                  <tr>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Course Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Duration</th>
                    <th className="py-4 px-6">Hours</th>
                    <th className="py-4 px-6">Batch Size</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="py-4 px-6 font-extrabold text-primary">{course.id}</td>
                        <td className="py-4 px-6 font-bold text-foreground group-hover:text-primary transition-colors">
                          {course.title}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            course.category === "Core" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {course.categoryLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground font-medium">{course.duration}</td>
                        <td className="py-4 px-6 text-muted-foreground font-medium">{course.hours} hrs</td>
                        <td className="py-4 px-6 text-muted-foreground font-medium">{course.batchSize}</td>
                        <td className="py-4 px-6 text-right">
                          <Button 
                            onClick={() => setSelectedCourse(course)}
                            size="sm"
                            variant="outline"
                            className="font-bold text-xs rounded-lg hover:bg-primary hover:text-primary-foreground"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No courses found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* SECTION 7 — VALUE PROPOSITION */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              CDAC Certified Excellence
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Industry-Recognized Certification. Nine Technology Pathways.
            </h2>

            <div className="my-8">
              <span className="text-2xl md:text-4xl font-extrabold text-emerald-300 block mb-2">
                Empower Your Career with CDAC-MEPZ Technology Training
              </span>
            </div>

            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed mb-10">
              Choose the technology domain that matches your career goals and join our next cohort.
            </p>

            <Button 
              onClick={() => handleOpenEnquiry()}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-base font-extrabold px-10 py-6 rounded-full shadow-2xl shadow-black/20"
            >
              Enquire About Courses
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

          </div>
        </section>

        {/* SECTION 8 — FINAL CTA */}
        <section className="py-20 md:py-28 container mx-auto px-4 lg:px-8">
          <div className="bg-card border-2 border-primary/20 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                Ready to Build Your Future in Technology?
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                Explore the CDAC-MEPZ course portfolio and find the program aligned with your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={scrollToPortfolio}
                  size="lg" 
                  className="gap-2 text-base font-bold px-8 py-6 rounded-full"
                >
                  Explore Courses
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => handleOpenEnquiry()}
                  size="lg" 
                  variant="outline" 
                  className="gap-2 text-base font-bold px-8 py-6 rounded-full border-2 border-primary/30"
                >
                  Enquire Now
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* COURSE DETAIL MODAL */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 my-8 max-h-[90vh] flex flex-col justify-between overflow-hidden">
              
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto pr-2 space-y-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-sm font-black text-primary px-3 py-1 bg-primary/10 rounded-xl">
                      {selectedCourse.id}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted px-3 py-1 rounded-full">
                      {selectedCourse.categoryLabel}
                    </span>
                    {selectedCourse.badge && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {selectedCourse.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
                    {selectedCourse.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 bg-muted/40 border border-border/60 rounded-2xl p-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-bold text-foreground text-sm">{selectedCourse.duration}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Total Hours</span>
                    <span className="font-bold text-foreground text-sm">{selectedCourse.hours} Hours</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Batch Size</span>
                    <span className="font-bold text-foreground text-sm">{selectedCourse.batchSize} Learners</span>
                  </div>
                </div>

                {/* Key Course Benefits */}
                {selectedCourse.benefits && selectedCourse.benefits.length > 0 && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2.5">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                      <Award className="w-4 h-4" />
                      <span>Key Program Benefits</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedCourse.benefits.map((b, i) => (
                        <li key={i} className="text-xs text-foreground/90 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Outcomes */}
                {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wide">
                      <Target className="w-4 h-4 text-primary" />
                      <span>Course Learning Outcomes</span>
                    </div>
                    <div className="space-y-1.5 p-4 rounded-2xl bg-muted/30 border border-border/60">
                      {selectedCourse.learningOutcomes.map((outcome, i) => (
                        <div key={i} className="text-xs text-foreground/85 flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Acquired & Practical Applications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCourse.skillsAcquired && selectedCourse.skillsAcquired.length > 0 && (
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-foreground font-bold text-xs uppercase tracking-wide">
                        <Cpu className="w-3.5 h-3.5 text-primary" />
                        <span>Skills Acquired</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCourse.skillsAcquired.map((s, i) => (
                          <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-card border border-border text-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.practicalApplications && selectedCourse.practicalApplications.length > 0 && (
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-foreground font-bold text-xs uppercase tracking-wide">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span>Practical Applications</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {selectedCourse.practicalApplications.map((app, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-primary font-bold">•</span>
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Career Relevance, Audience & Prerequisites */}
                <div className="space-y-3 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  {selectedCourse.careerRelevance && (
                    <div>
                      <span className="font-bold text-foreground block mb-1">Target Roles:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCourse.careerRelevance.map((role, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-[11px]">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.prerequisites && (
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <span className="font-bold text-foreground block mb-0.5">Prerequisites:</span>
                      <span className="italic">{selectedCourse.prerequisites}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t border-border mt-4">
                <Button 
                  onClick={() => setSelectedCourse(null)} 
                  variant="outline"
                  className="w-1/3 py-5 font-bold rounded-xl"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    const title = selectedCourse.title;
                    setSelectedCourse(null);
                    handleOpenEnquiry(title);
                  }}
                  className="w-2/3 py-5 font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <span>Enquire for {selectedCourse.id}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* ENQUIRY MODAL */}
        {isEnquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card border border-border rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-in zoom-in-95">
              
              <button 
                onClick={() => setIsEnquiryOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-extrabold text-foreground mb-2">
                Course Enquiry
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                CDAC-MEPZ Digital Technology Centre Training Program
              </p>

              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Course Selected</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="General Course Enquiry">General Course Enquiry</option>
                    {coursesData.map(c => (
                      <option key={c.id} value={c.title}>{c.id} - {c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Full Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Email Address *</label>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Message (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Any specific query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-6 font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? "Submitting Enquiry..." : "Submit Enquiry"}
                </Button>
              </form>

            </div>
          </div>
        )}

        {/* STICKY MOBILE CTA BAR */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 flex items-center justify-between shadow-2xl">
          <div>
            <div className="text-xs font-extrabold text-foreground">CDAC Technology Courses</div>
            <div className="text-[10px] text-muted-foreground">9 Certified Tech Programs</div>
          </div>
          <Button 
            onClick={() => handleOpenEnquiry()}
            size="sm"
            className="font-bold text-xs rounded-full px-5 py-2 bg-primary text-primary-foreground"
          >
            Enquire Now
          </Button>
        </div>

      </div>
    </Layout>
  );
};

export default CoursesPage;
