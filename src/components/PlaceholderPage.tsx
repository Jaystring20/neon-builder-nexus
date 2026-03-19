import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const PlaceholderPage = ({ title, description, icon }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container-narrow py-24 md:py-32 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
            {icon || <Construction className="w-10 h-10 text-primary" />}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-4">
            <Button variant="hero" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceholderPage;
