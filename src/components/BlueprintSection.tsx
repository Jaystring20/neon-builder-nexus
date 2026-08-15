import { useState } from "react";
import { CheckCircle, ArrowRight, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import blueprintCover from "@/assets/blueprint-book-cover.jpg";

const BlueprintSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success!",
      description: "Check your inbox for the Blueprint download link.",
    });
    
    setEmail("");
    setIsLoading(false);
  };

  return (
    <section id="blueprint" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[70px] md:blur-[120px]" />

      <div className="container-narrow relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              The Professional{" "}
              <span className="text-secondary">Builder's Blueprint</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              7 Days to Start Building Agency in the AI Age — a free, actionable guide 
              to help you architect your brand's growth engine from day one.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Find the 'Builder' inside your brand",
                "Architect high-conversion growth platforms",
                "Build content systems that run while you sleep",
                "Deploy performance campaigns at velocity"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-card/50 border-border/50 focus:border-secondary w-full"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  size="lg" 
                  className="h-12 px-6 group whitespace-nowrap w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get Free Blueprint
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </div>

          {/* Right Content - Book Cover */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-secondary/20 border border-border/30 transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                <img 
                  src={blueprintCover} 
                  alt="The Professional Builder's Blueprint"
                  className="w-56 sm:w-72 md:w-80 h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlueprintSection;
