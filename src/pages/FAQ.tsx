import { HelpCircle } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

const FAQ = () => (
  <PlaceholderPage
    title="Frequently Asked Questions"
    description="Got questions? We're putting together answers to the most common ones. Check back soon."
    icon={<HelpCircle className="w-10 h-10 text-primary" />}
  />
);

export default FAQ;
