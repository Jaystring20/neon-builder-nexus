import { Globe, Palette, Shirt, Sparkles, Stethoscope, Church, Dumbbell } from "lucide-react";

import vieraAmberImg from "@/assets/portfolio/viera-amber.webp";
import innerspaceImg from "@/assets/portfolio/innerspace-interior-design.webp";
import discoveryImg from "@/assets/portfolio/the-discovery-church.png";
import fitnessReligionImg from "@/assets/portfolio/fitness-religion.webp";

export interface PortfolioProject {
  id: string;
  /** Brand name only. Never a URL — see `displayDomain`. */
  title: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
  /**
   * What the reader is shown in place of the raw URL.
   *
   * Some of these builds are hosted on a platform subdomain. The host is an
   * implementation detail of where a build currently sits, not part of the
   * client's brand, and printing it on a portfolio tile advertises the
   * hosting rather than the work. The link still points at the real address;
   * only the label is the brand's own.
   */
  displayDomain: string;
  icon: typeof Globe;
  image?: string;

  /** The narrative, as structured facts rather than paragraphs. */
  story: {
    /** The constraint that made the build hard. One sentence. */
    problem: string;
    /** The systems built to answer it. Three, short — these are read as chips. */
    built: string[];
    /** What exists now. Quoted from the live site or countable from it. */
    outcome: string;
  };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "viera-amber",
    title: "Viera Amber",
    category: "Creative Ecosystem",
    description:
      "A creative ecosystem built for feminine empowerment — five businesses sharing one identity, one codebase and one commerce spine.",
    tags: ["Multi-Brand", "Ecosystem Architecture", "Commerce"],
    url: "https://vieraamber.com",
    displayDomain: "vieraamber.com",
    icon: Sparkles,
    image: vieraAmberImg,
    story: {
      problem:
        "Five businesses that would normally need five teams, five sites and five stacks — and would drift apart the moment they launched.",
      built: ["Shared identity layer", "Cross-brand routing", "One commerce spine"],
      outcome: "One brand. Five expressions.",
    },
  },
  {
    id: "innerspace",
    title: "Innerspace",
    category: "Interior Design",
    description:
      "A portfolio and consultation platform for a Nigerian interior design studio — turning a browsing visitor into a booked assessment.",
    tags: ["Portfolio", "Booking", "Design Studio"],
    url: "https://innerspace-innovations.lovable.app/",
    displayDomain: "Innerspace Innovations",
    icon: Globe,
    image: innerspaceImg,
    story: {
      problem:
        "Interior design is bought on trust, before the client can stand in the room they are paying for.",
      built: ["Portfolio architecture", "Consultation booking", "Design assessment"],
      outcome: "Stop guessing your décor. Start designing with clarity.",
    },
  },
  {
    id: "discovery-lagos",
    title: "The Discovery",
    category: "Community",
    description:
      "A digital front door for a Lagos congregation — an onboarding flow that welcomes first-time visitors before it asks anything of them.",
    tags: ["Community", "Onboarding", "Events"],
    url: "https://www.thediscoverylagos.org/",
    displayDomain: "thediscoverylagos.org",
    icon: Church,
    image: discoveryImg,
    story: {
      problem:
        "Someone arriving online has no idea where they fit. A brochure answers the wrong question.",
      built: ["Guided onboarding", "Sermon archive", "Events & community"],
      outcome: "An expression of Global Harvest Churches Worldwide.",
    },
  },
  {
    id: "mh-eyewear",
    title: "M & H Eyewear",
    category: "Optical Retail",
    description:
      "Premium eye care and designer eyewear — AI try-on, a styling quiz and clinic booking wired into one purchase flow.",
    tags: ["E-commerce", "AI Try-On", "Healthcare"],
    url: "https://mandheyewear.com/",
    displayDomain: "mandheyewear.com",
    icon: Stethoscope,
    story: {
      problem:
        "Frames at ₦1.9M sell on fit, and fit is the one thing that cannot be shipped ahead of the sale.",
      built: ["AI virtual try-on", "Style intelligence quiz", "Clinic booking in-flow"],
      outcome: "145 five-star reviews · 2,800+ frames.",
    },
  },
  {
    id: "fitness-religion",
    title: "The Fitness Religion Company",
    category: "Community & Events",
    description:
      "The platform behind the 2004 M00VE Challenge — registration, leaderboards, event management and sponsor integration across 5+ Nigerian cities.",
    tags: ["Web Platform", "Event Management", "Community"],
    url: "https://www.thefitnessreligioncompany.com.ng/",
    displayDomain: "thefitnessreligioncompany.com.ng",
    icon: Dumbbell,
    image: fitnessReligionImg,
    story: {
      problem:
        "One event, five cities, running at the same time — with no room for a city to fall out of sync.",
      built: ["Multi-city registration", "Live leaderboards", "Sponsor integration"],
      outcome: "The 2004 M00VE Challenge across 5+ Nigerian cities.",
    },
  },
];

export const portfolioCategories = [
  "All",
  ...Array.from(new Set(portfolioProjects.map((p) => p.category))),
];
