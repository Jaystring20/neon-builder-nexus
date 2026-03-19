import { Cookie } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

const CookiePolicy = () => (
  <PlaceholderPage
    title="Cookie Policy"
    description="Details about how we use cookies on our website. Full policy coming soon."
    icon={<Cookie className="w-10 h-10 text-primary" />}
    seoTitle="Cookie Policy"
    seoDescription="Understand how Digital Creatives Hub uses cookies and similar technologies on our website."
    path="/cookie-policy"
  />
);

export default CookiePolicy;
