import { Shield } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

const PrivacyPolicy = () => (
  <PlaceholderPage
    title="Privacy Policy"
    description="Our privacy policy is being finalized. We take your data seriously and will publish the full policy shortly."
    icon={<Shield className="w-10 h-10 text-primary" />}
    seoTitle="Privacy Policy"
    seoDescription="Learn how Digital Creatives Hub collects, uses, and protects your personal data."
    path="/privacy-policy"
  />
);

export default PrivacyPolicy;
