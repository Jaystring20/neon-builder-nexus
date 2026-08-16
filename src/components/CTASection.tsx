import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Mail, Phone, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingParticles from "@/components/FloatingParticles";
import { serviceCategories } from "@/data/services";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const stages = [
  { label: "Starting from Scratch", description: "Brand new idea or venture" },
  { label: "Rebranding", description: "Evolving an existing identity" },
  { label: "Scaling What Works", description: "Amplifying proven systems" },
  { label: "Not Sure Yet", description: "Let's figure it out together" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
});

const pillarIcons: Record<string, string> = {
  "Brand Architecture": "🏛️",
  "Digital Infrastructure": "🌐",
  "Agentic AI & Automation": "🤖",
  "Growth Operations": "🚀",
};

const CTASection = () => {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const canProceed = () => {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return selectedStage !== "";
    if (step === 2) {
      const result = contactSchema.safeParse({ name, email, phone: phone || undefined });
      return result.success;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
      const result = contactSchema.safeParse({ name, email, phone: phone || undefined });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      setIsSubmitting(true);

      // Simulate brief processing delay
      setTimeout(() => {
        setSubmitted(true);
        setStep(3);
        setIsSubmitting(false);
        toast({
          title: "Project brief submitted! 🎉",
          description: "We'll reach out within 24 hours to start building.",
        });
      }, 800);
      return;
    }
    if (canProceed()) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setSelectedServices([]);
    setSelectedStage("");
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
    setSubmitted(false);
  };

  const stepLabels = ["Services", "Stage", "Contact", "Done"];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full blur-[70px] md:blur-[120px] animate-breathe" />
      </div>

      <FloatingParticles count={8} />

      <div className="container-narrow relative z-10">
        <ScrollReveal animation="blur-in">
          <div className="glass-card-elevated p-8 md:p-12 lg:p-16 overflow-hidden relative hover-glow glass-border">
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
                  {step < 3 ? (
                    <>Architect Your <span className="text-primary">Project Brief</span></>
                  ) : (
                    <>Blueprint <span className="text-primary">Submitted</span></>
                  )}
                </h2>
                {step < 3 && (
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    {step === 0 && "Select the pillars your project needs."}
                    {step === 1 && "Where is your brand right now?"}
                    {step === 2 && "How should we reach you?"}
                  </p>
                )}
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-3 mb-10">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          i < step
                            ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                            : i === step
                            ? "bg-primary/20 border-2 border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                            : "bg-muted/50 text-muted-foreground border border-border/50"
                        }`}
                      >
                        {i < step ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-xs hidden sm:block transition-colors duration-300 ${
                        i <= step ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {label}
                      </span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`w-8 md:w-12 h-0.5 rounded-full transition-all duration-500 mb-5 sm:mb-6 ${
                        i < step ? "bg-primary" : "bg-border/50"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[280px] flex items-center justify-center">
                {/* Step 0: Service Selection */}
                {step === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl animate-fade-in">
                    {serviceCategories.map((cat) => {
                      const selected = selectedServices.includes(cat.title);
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => toggleService(cat.title)}
                          className={`group p-5 rounded-xl text-left transition-all duration-300 border-2 ${
                            selected
                              ? "border-primary bg-primary/10 shadow-[0_0_25px_hsl(var(--primary)/0.3)]"
                              : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{pillarIcons[cat.title] || "📦"}</span>
                            <div>
                              <h3 className={`font-heading font-bold text-base transition-colors ${
                                selected ? "text-primary" : "text-foreground"
                              }`}>
                                {cat.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{cat.tagline}</p>
                            </div>
                          </div>
                          {selected && (
                            <div className="mt-3 flex justify-end">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step 1: Stage Selection */}
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl animate-fade-in">
                    {stages.map((stage) => {
                      const selected = selectedStage === stage.label;
                      return (
                        <button
                          key={stage.label}
                          onClick={() => setSelectedStage(stage.label)}
                          className={`group p-5 rounded-xl text-left transition-all duration-300 border-2 ${
                            selected
                              ? "border-secondary bg-secondary/10 shadow-[0_0_25px_hsl(var(--secondary)/0.3)]"
                              : "border-border/50 bg-card/30 hover:border-secondary/50 hover:bg-card/50"
                          }`}
                        >
                          <h3 className={`font-heading font-bold text-base transition-colors ${
                            selected ? "text-secondary" : "text-foreground"
                          }`}>
                            {stage.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                          {selected && (
                            <div className="mt-2 flex justify-end">
                              <Check className="w-5 h-5 text-secondary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Contact Info */}
                {step === 2 && (
                  <div className="w-full max-w-md space-y-5 animate-fade-in">
                    <div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-card/50 border-border/50 focus:border-primary h-12"
                        />
                      </div>
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="your@email.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-card/50 border-border/50 focus:border-primary h-12"
                        />
                      </div>
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Phone (optional)"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 bg-card/50 border-border/50 focus:border-primary h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <div className="text-center space-y-6 animate-fade-in w-full max-w-lg">
                    <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto shadow-[0_0_40px_hsl(var(--primary)/0.4)] animate-pulse">
                      <Check className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg text-foreground font-semibold mb-1">Thank you, {name}!</p>
                      <p className="text-muted-foreground">Your project blueprint has been received.</p>
                    </div>
                    <div className="glass-card-subtle p-5 rounded-xl text-left space-y-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Services</p>
                          <p className="text-sm text-foreground font-medium">{selectedServices.join(" · ")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Stage</p>
                          <p className="text-sm text-foreground font-medium">{selectedStage}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="text-sm text-foreground font-medium">{email}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="subtle" size="lg" onClick={handleReset}>
                      Submit Another Brief
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {step < 3 && (
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-10 max-w-2xl mx-auto">
                  <Button
                    variant="subtle"
                    onClick={handleBack}
                    disabled={step === 0}
                    size="lg"
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  {step === 0 && selectedServices.length > 0 && (
                    <span className="text-xs text-primary text-center sm:hidden">
                      {selectedServices.length} pillar{selectedServices.length > 1 ? "s" : ""} selected
                    </span>
                  )}
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                    isLoading={isSubmitting && step === 2}
                    className="gap-2 group hover-glow"
                  >
                    {!isSubmitting && (
                      <>
                        {step === 2 ? "Submit Blueprint" : "Continue"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
