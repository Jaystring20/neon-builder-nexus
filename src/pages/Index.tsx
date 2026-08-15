import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProofStorySection from "@/components/ProofStorySection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import OriginStorySection from "@/components/OriginStorySection";
import ProcessSection from "@/components/ProcessSection";
import FAQSection from "@/components/FAQSection";
import ContactCTASection from "@/components/ContactCTASection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Digital Creatives Hub — Systems Built, Not Bought"
        description="We design the brand, build the infrastructure, and wire in the AI systems that run it. As one connected build, not a stack of vendors."
        path="/"
      />
      <Navbar />

      {/* Hero section — narrative foundation */}
      <HeroSection />

      {/* Three proof stories — interactive nested Q&A */}
      <ProofStorySection />

      {/* Three capabilities — brand, infrastructure, AI */}
      <CapabilitiesSection />

      {/* Origin story — why Lagos, why this way */}
      <OriginStorySection />

      {/* Process walkthrough — discovery to post-launch */}
      <ProcessSection />

      {/* FAQ — conversational depth */}
      <FAQSection />

      {/* Contact & CTA — conversation starter */}
      <ContactCTASection />

      {/* Footer */}
      <Footer />
      <FloatingCTA />
    </main>
  );
};

export default Index;
