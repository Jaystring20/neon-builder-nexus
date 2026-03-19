import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FrictionSection from "@/components/FrictionSection";
import ResolutionSection from "@/components/ResolutionSection";
import PillarsSection from "@/components/PillarsSection";
import WhyUsSection from "@/components/WhyUsSection";
import AboutSnippetSection from "@/components/AboutSnippetSection";
import BlueprintSection from "@/components/BlueprintSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FrictionSection />
      <ResolutionSection />
      <PillarsSection />
      <WhyUsSection />
      <AboutSnippetSection />
      <BlueprintSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
