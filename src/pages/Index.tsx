import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HeroProofSection from "@/components/HeroProofSection";
import HeroVisualSection from "@/components/HeroVisualSection";
import FrictionSection from "@/components/FrictionSection";
import ResolutionSection from "@/components/ResolutionSection";
import ComparisonSection from "@/components/ComparisonSection";
import PillarsSection from "@/components/PillarsSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSnippetSection from "@/components/AboutSnippetSection";
import BlueprintSection from "@/components/BlueprintSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Build Agency in the AI Age"
        description="Digital Creatives Hub empowers professionals and organizations to transform uncertainty into opportunity. Build your future with agency and confidence in the AI-driven age."
        path="/"
      />
      <Navbar />
      <HeroSection />
      <HeroProofSection />
      <HeroVisualSection />
      <FrictionSection />
      <ResolutionSection />
      <ComparisonSection />
      <PillarsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <AboutSnippetSection />
      <BlueprintSection />
      <CTASection />
      <Footer />
      <FloatingCTA />
    </main>
  );
};

export default Index;
