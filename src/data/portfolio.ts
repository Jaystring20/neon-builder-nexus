import { Globe, BookOpen, Palette, Leaf, ShoppingBag, Heart, Stethoscope, Church, Dumbbell, Briefcase } from "lucide-react";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
  icon: typeof Globe;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "ddo",
    title: "DDO — The Learning Liberation Specialist",
    category: "Education",
    description: "A bold ed-tech platform empowering learners through liberation-focused pedagogy, digital courses, and community-driven education initiatives.",
    tags: ["Ed-Tech", "Learning Platform", "Community"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: BookOpen,
  },
  {
    id: "innerspace",
    title: "Innerspace — Nigerian Interior Design Studio",
    category: "Interior Design",
    description: "A sleek portfolio and booking platform for a premium Nigerian interior design studio — showcasing projects, client testimonials, and consultation flow.",
    tags: ["Portfolio", "Design Studio", "Booking"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: Palette,
  },
  {
    id: "ecopath",
    title: "Ecopath — Circular Economy Platform",
    category: "Sustainability",
    description: "A sustainability-first digital platform driving circular economy adoption through waste management solutions, education, and community engagement.",
    tags: ["Sustainability", "Circular Economy", "Green Tech"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: Leaf,
  },
  {
    id: "everything-household",
    title: "Everything Household",
    category: "E-commerce",
    description: "A full-featured e-commerce storefront for household essentials — complete with product catalog, cart system, and seamless checkout experience.",
    tags: ["E-commerce", "Product Catalog", "Online Store"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: ShoppingBag,
  },
  {
    id: "bunmi-flex",
    title: "Bunmi Flex — Yoga for Movement, Healing & Alignment",
    category: "Health & Wellness",
    description: "A serene wellness platform for a yoga instructor — featuring class schedules, booking integration, philosophy pages, and mindful brand storytelling.",
    tags: ["Wellness", "Yoga", "Class Booking"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: Heart,
  },
  {
    id: "digitech-strategist",
    title: "The DigiTech Strategist",
    category: "Career Strategy",
    description: "A personal brand and consulting platform for a digital transformation strategist — showcasing services, portfolio, and strategic frameworks.",
    tags: ["Personal Brand", "Consulting", "Strategy"],
    url: "https://thedigitechstrategist.com",
    icon: Briefcase,
  },
  {
    id: "htbh-foundation",
    title: "Healing The Broken Hearted Foundation",
    category: "Non-Profit",
    description: "A mission-driven website for a non-profit foundation focused on emotional healing, community outreach, and donation-powered impact programs.",
    tags: ["Non-Profit", "Foundation", "Community Impact"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: Heart,
  },
  {
    id: "soteria-mh-eyewear",
    title: "Soteria Eye Clinic | M & H Eyewear",
    category: "Healthcare",
    description: "A dual-brand web presence for an eye clinic and eyewear brand — featuring service listings, product showcase, appointment booking, and patient resources.",
    tags: ["Healthcare", "Eye Care", "Appointments"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: Stethoscope,
  },
  {
    id: "discovery-church",
    title: "The Discovery Church",
    category: "Web Development",
    description: "A modern church website with sermon archives, event management, community features, and an inviting digital front door for the congregation.",
    tags: ["Church", "Community", "Events"],
    url: "https://thedigitechstrategist.com/portfolio",
    icon: Church,
  },
  {
    id: "fitness-religion",
    title: "The Fitness Religion Company",
    category: "Community & Events",
    description: "A full-stack community fitness platform powering the 2004 M00VE Challenge — from registration and leaderboards to event management and sponsor integration across 5+ Nigerian cities.",
    tags: ["Web Platform", "Community", "Event Management", "Fitness"],
    url: "https://www.thefitnessreligioncompany.com.ng/",
    icon: Dumbbell,
  },
];

export const portfolioCategories = [
  "All",
  ...Array.from(new Set(portfolioProjects.map((p) => p.category))),
];
