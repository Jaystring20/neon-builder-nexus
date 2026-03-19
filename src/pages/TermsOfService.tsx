import { Scale } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

const TermsOfService = () => (
  <PlaceholderPage
    title="Terms of Service"
    description="Our terms of service are being drafted. The complete terms will be available here soon."
    icon={<Scale className="w-10 h-10 text-primary" />}
    seoTitle="Terms of Service"
    seoDescription="Read the terms and conditions for using Digital Creatives Hub services and website."
    path="/terms-of-service"
  />
);

export default TermsOfService;
