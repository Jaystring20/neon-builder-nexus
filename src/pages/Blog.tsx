import { BookOpen } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";

const Blog = () => (
  <PlaceholderPage
    title="Blog"
    description="Insights, strategies, and stories from the Digital Creatives Hub team. Coming soon — stay tuned."
    icon={<BookOpen className="w-10 h-10 text-primary" />}
    seoTitle="Blog"
    seoDescription="Insights, strategies, and stories on branding, digital products, and growth from the Digital Creatives Hub team."
    path="/blog"
  />
);

export default Blog;
