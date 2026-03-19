import { FileText } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

const CaseStudies = () => (
  <PlaceholderPage
    title="Case Studies"
    description="Deep dives into the projects we've built and the results we've delivered. Coming soon."
    icon={<FileText className="w-10 h-10 text-primary" />}
    seoTitle="Case Studies"
    seoDescription="Deep dives into the projects Digital Creatives Hub has built and the measurable results delivered for clients."
    path="/case-studies"
  />
);

export default CaseStudies;
