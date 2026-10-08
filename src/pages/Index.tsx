import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkShowcaseSection from "@/components/WorkShowcaseSection";
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
        title="Digital Creatives Hub | Projects end. Momentum doesn't."
        description="We build the brand, platforms and people behind your growth, with AI in every layer. For startups, established brands and people outgrowing where they are."
        path="/"
      />
      <Navbar />

      {/* Hero section — narrative foundation */}
      <HeroSection />

      {/* The work itself, moving — sits directly after the fold so the first
          thing below the headline is evidence rather than more prose. */}
      <WorkShowcaseSection />

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
