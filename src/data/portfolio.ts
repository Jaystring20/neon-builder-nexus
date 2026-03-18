import { Globe, BookOpen, Palette, Leaf, ShoppingBag, Heart, Stethoscope, Church, Dumbbell, Briefcase } from "lucide-react";

import ddoImg from "@/assets/portfolio/ddo-learning-liberation.png";
import innerspaceImg from "@/assets/portfolio/innerspace-interior-design.png";
import ecopathImg from "@/assets/portfolio/ecopath-circular-economy.png";
import everythingHouseholdImg from "@/assets/portfolio/everything-household.png";
import bunmiFlexImg from "@/assets/portfolio/bunmiflex-yoga.png";
import digitechImg from "@/assets/portfolio/digitech-strategist.png";
import healingImg from "@/assets/portfolio/healing-broken-hearted.png";
import soteriaImg from "@/assets/portfolio/soteria-eye-clinic.png";
import discoveryChurchImg from "@/assets/portfolio/the-discovery-church.png";
import fitnessReligionImg from "@/assets/portfolio/fitness-religion.png";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
  icon: typeof Globe;
  image?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "ddo",
    title: "DDO — The Learning Liberation Specialist",
    category: "Education",
    description: "A bold ed-tech platform empowering learners through liberation-focused pedagogy, digital courses, and community-driven education initiatives.",
    tags: ["Ed-Tech", "Learning Platform", "Community"],
    url: "https://thelearningliberationspecialist.lovable.app",
    icon: BookOpen,
    image: ddoImg,
  },
  {
    id: "innerspace",
    title: "Innerspace — Nigerian Interior Design Studio",
    category: "Interior Design",
    description: "A sleek portfolio and booking platform for a premium Nigerian interior design studio — showcasing projects, client testimonials, and consultation flow.",
    tags: ["Portfolio", "Design Studio", "Booking"],
    url: "https://innerspace-innovations.lovable.app",
    icon: Palette,
    image: innerspaceImg,
  },
  {
    id: "ecopath",
    title: "Ecopath — Circular Economy Platform",
    category: "Sustainability",
    description: "A sustainability-first digital platform driving circular economy adoption through waste management solutions, education, and community engagement.",
    tags: ["Sustainability", "Circular Economy", "Green Tech"],
    url: "https://ecopath.lovable.app",
    icon: Leaf,
    image: ecopathImg,
  },
  {
    id: "everything-household",
    title: "Everything Household",
    category: "E-commerce",
    description: "A full-featured e-commerce storefront for household essentials — complete with product catalog, cart system, and seamless checkout experience.",
    tags: ["E-commerce", "Product Catalog", "Online Store"],
    url: "https://everythinghousehold.lovable.app",
    icon: ShoppingBag,
    image: everythingHouseholdImg,
  },
  {
    id: "bunmi-flex",
    title: "Bunmi Flex — Yoga for Movement, Healing & Alignment",
    category: "Health & Wellness",
    description: "A serene wellness platform for a yoga instructor — featuring class schedules, booking integration, philosophy pages, and mindful brand storytelling.",
    tags: ["Wellness", "Yoga", "Class Booking"],
    url: "https://bunmiflex.lovable.app",
    icon: Heart,
    image: bunmiFlexImg,
  },
  {
    id: "digitech-strategist",
    title: "The DigiTech Strategist",
    category: "Career Strategy",
    description: "A personal brand and consulting platform for a digital transformation strategist — showcasing services, portfolio, and strategic frameworks.",
    tags: ["Personal Brand", "Consulting", "Strategy"],
    url: "https://thedigitechstrategist.lovable.app",
    icon: Briefcase,
    image: digitechImg,
  },
  {
    id: "htbh-foundation",
    title: "Healing The Broken Hearted Foundation",
    category: "Non-Profit",
    description: "A mission-driven website for a non-profit foundation focused on emotional healing, community outreach, and donation-powered impact programs.",
    tags: ["Non-Profit", "Foundation", "Community Impact"],
    url: "https://healingthebrokenhearted.lovable.app",
    icon: Heart,
    image: healingImg,
  },
  {
    id: "soteria-mh-eyewear",
    title: "Soteria Eye Clinic | M & H Eyewear",
    category: "Healthcare",
    description: "A dual-brand web presence for an eye clinic and eyewear brand — featuring service listings, product showcase, appointment booking, and patient resources.",
    tags: ["Healthcare", "Eye Care", "Appointments"],
    url: "https://soteriaeyeclinic.lovable.app",
    icon: Stethoscope,
    image: soteriaImg,
  },
  {
    id: "discovery-church",
    title: "The Discovery Church",
    category: "Web Development",
    description: "A modern church website with sermon archives, event management, community features, and an inviting digital front door for the congregation.",
    tags: ["Church", "Community", "Events"],
    url: "https://www.thediscoverylagos.org",
    icon: Church,
    image: discoveryChurchImg,
  },
  {
    id: "fitness-religion",
    title: "The Fitness Religion Company",
    category: "Community & Events",
    description: "A full-stack community fitness platform powering the 2004 M00VE Challenge — from registration and leaderboards to event management and sponsor integration across 5+ Nigerian cities.",
    tags: ["Web Platform", "Community", "Event Management", "Fitness"],
    url: "https://www.thefitnessreligioncompany.com.ng/",
    icon: Dumbbell,
    image: fitnessReligionImg,
  },
];

export const portfolioCategories = [
  "All",
  ...Array.from(new Set(portfolioProjects.map((p) => p.category))),
];
