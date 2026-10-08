import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AIMultiplierSection from "@/components/AIMultiplierSection";
import WhatWeBuildSection from "@/components/WhatWeBuildSection";
import RealWorkSection from "@/components/RealWorkSection";
import PhilosophySection from "@/components/PhilosophySection";
import AudienceSection from "@/components/AudienceSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
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

      {/* One story, top to bottom (docs/landing-copy.md): the promise, the
          engine, the parts, the proof, the belief, the fit, the method, the
          invitation. */}
      <HeroSection />
      <AIMultiplierSection />
      <WhatWeBuildSection />
      <RealWorkSection />
      <PhilosophySection />
      <AudienceSection />
      <HowWeWorkSection />
      <FAQSection />
      <ContactCTASection />

      {/* Footer */}
      <Footer />
      <FloatingCTA />
    </main>
  );
};

export default Index;
