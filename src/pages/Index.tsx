import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import StrategistSection from "@/components/StrategistSection";
import BlueprintSection from "@/components/BlueprintSection";
import DCNSection from "@/components/DCNSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <StrategistSection />
      <BlueprintSection />
      <DCNSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
