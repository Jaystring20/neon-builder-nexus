import { Globe, Sparkles, Stethoscope, Church, Dumbbell, Leaf, ShoppingBag, Briefcase, HeartPulse, Eye } from "lucide-react";

import vieraAmberImg from "@/assets/portfolio/viera-amber.webp";
import innerspaceImg from "@/assets/portfolio/innerspace-interior-design.webp";
import discoveryImg from "@/assets/portfolio/the-discovery-church.png";
import fitnessReligionImg from "@/assets/portfolio/fitness-religion.webp";
import ecopathImg from "@/assets/portfolio/ecopath-circular-economy.webp";
import everythingHouseholdImg from "@/assets/portfolio/everything-household.webp";
import digitechImg from "@/assets/portfolio/digitech-strategist.webp";
import fitnessReligionFilmPoster from "@/assets/portfolio/film/fitness-religion-poster.webp";
import fitnessReligionTeaserMp4 from "@/assets/portfolio/film/fitness-religion-teaser.mp4";
import fitnessReligionTeaserWebm from "@/assets/portfolio/film/fitness-religion-teaser.webm";
import fitnessReligionReelPoster from "@/assets/portfolio/film/fitness-religion-reel-poster.webp";
import vieraAmberFilmPoster from "@/assets/portfolio/film/viera-amber-poster.webp";
import vieraAmberTeaserMp4 from "@/assets/portfolio/film/viera-amber-teaser.mp4";
import vieraAmberTeaserWebm from "@/assets/portfolio/film/viera-amber-teaser.webm";

/**
 * Screenshots not imported above are picked up by file name, so adding one
 * is just dropping `src/assets/portfolio/<project id>.webp` (or .png/.jpg)
 * into the folder: e.g. `mh-eyewear.webp` for M & H Eyewear.
 */
const screenshots = import.meta.glob("/src/assets/portfolio/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
export const screenshot = (id: string): string | undefined =>
  Object.entries(screenshots).find(([path]) => path.split("/").pop()!.replace(/\.[a-z]+$/, "") === id)?.[1];

export interface PortfolioProject {
  id: string;
  /** Brand name only. Never a URL — see `displayDomain`. */
  title: string;
  category: string;
  description: string;
  tags: string[];
  /** Live address. Left out until DCH confirms it; the tile then shows no link. */
  url?: string;
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
  /** Tailwind object-position for the screenshot crop, when top-left cuts the point off. */
  imagePosition?: string;

  /**
   * The narrative, as structured facts rather than paragraphs. Projects with a
   * story are featured on Our Work; the rest appear in its grid.
   */
  story?: {
    /** The constraint that made the build hard. One sentence. */
    problem: string;
    /** The systems built to answer it. Three, short — these are read as chips. */
    built: string[];
    /** What exists now. Quoted from the live site or countable from it. */
    outcome: string;
  };

  /**
   * A film shown with the project: one DCH produced, or the client's own film
   * that the site DCH built showcases (`credit` says which, and the labels
   * follow it so DCH never claims a film it did not make). The teaser is a short silent loop cut
   * from it. The film and reel are adaptive streams (HLS master playlists in
   * public/media, made by scripts/site-images/encode-hls.sh) that only load
   * when the visitor presses play.
   */
  film?: {
    credit: "dch" | "client";
    /** One line shown under the film. */
    caption: string;
    /** Frame shape; defaults to 16:9. */
    aspect?: "16/9" | "4/3";
    poster: string;
    teaser: { webm: string; mp4: string };
    /** The full film's HLS master playlist. Until set, only the teaser shows. */
    src?: string;
    /** Running time, e.g. "2:17". */
    duration: string;
    /** A vertical social reel shown beside the film (HLS master playlist). */
    reel?: { src: string; poster: string; label: string };
  };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "viera-amber",
    title: "Viera Amber",
    category: "Creative Ecosystem",
    description:
      "A creative ecosystem built for feminine empowerment: five businesses sharing one identity, one codebase and one commerce spine.",
    tags: ["Multi-Brand", "Ecosystem Architecture", "Commerce"],
    url: "https://vieraamber.com",
    displayDomain: "vieraamber.com",
    icon: Sparkles,
    image: vieraAmberImg,
    story: {
      problem:
        "Five businesses that would normally need five teams, five sites and five tech stacks, and would drift apart the moment they launched.",
      built: ["Shared identity layer", "Cross-brand routing", "One commerce spine"],
      outcome: "Five brands on one platform instead of five. One brand. Five expressions.",
    },
    // Viera Amber's own film, not a DCH production: it showcases their
    // illustration work on the Illustration page of the site DCH built.
    film: {
      credit: "client",
      caption:
        "Time Will Tell, Viera Amber's own illustration film, showcased on the Illustration page of the site we built.",
      aspect: "4/3",
      poster: vieraAmberFilmPoster,
      teaser: { webm: vieraAmberTeaserWebm, mp4: vieraAmberTeaserMp4 },
      duration: "1:03",
      src: "/media/viera-amber/film/master.m3u8",
    },
  },
  {
    id: "innerspace",
    title: "Innerspace",
    category: "Interior Design",
    description:
      "A portfolio and consultation platform for a Nigerian interior design studio, turning a browsing visitor into a booked assessment.",
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
      "A digital front door for a congregation: an onboarding flow that welcomes first-time visitors before it asks anything of them.",
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
      "Premium eye care and designer eyewear: AI try-on, a styling quiz and clinic booking wired into one purchase flow.",
    tags: ["E-commerce", "AI Try-On", "Healthcare"],
    url: "https://www.mandheyewear.com/",
    displayDomain: "mandheyewear.com",
    icon: Stethoscope,
    image: screenshot("mh-eyewear"),
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
      "The platform behind the 2004 M00VE Challenge: registration, leaderboards, event management and sponsor integration, built so many communities and cities can run as one.",
    tags: ["Web Platform", "Event Management", "Community"],
    url: "https://www.thefitnessreligioncompany.com.ng/",
    displayDomain: "thefitnessreligioncompany.com.ng",
    icon: Dumbbell,
    image: fitnessReligionImg,
    story: {
      problem:
        "Bringing communities in different cities together around one shared goal, without a separate system for each city.",
      built: ["Registration", "Live leaderboards", "Sponsor integration"],
      // "2004 M00VE Challenge" is the event's name, not a year. It ran in one
      // location; the platform is built to scale to more cities.
      outcome: "Powered the 2004 M00VE Challenge, and built to scale to more cities.",
    },
    film: {
      credit: "dch",
      caption: "We also produced the event film and the 2004 Steps reel for the 2004 M00VE Challenge.",
      poster: fitnessReligionFilmPoster,
      teaser: { webm: fitnessReligionTeaserWebm, mp4: fitnessReligionTeaserMp4 },
      duration: "2:17",
      src: "/media/fitness-religion/film/master.m3u8",
      reel: {
        src: "/media/fitness-religion/reel/master.m3u8",
        poster: fitnessReligionReelPoster,
        label: "2004 Steps reel (0:37)",
      },
    },
  },
  {
    id: "ecopath",
    title: "Ecopath",
    category: "Sustainability",
    description:
      "A circular-economy platform that connects universities with cartridge remanufacturing: waste collection, impact tracking and token rewards in one system.",
    tags: ["Sustainability", "Circular Economy", "Platform"],
    url: "https://ecopath.lovable.app",
    displayDomain: "Ecopath",
    icon: Leaf,
    image: ecopathImg,
  },
  {
    id: "everything-household",
    title: "Everything Household",
    category: "E-commerce",
    description:
      "An online store for premium household essentials sourced from Turkey and across the globe, with a full catalogue, cart and checkout.",
    tags: ["E-commerce", "Catalogue", "Online Store"],
    url: "https://everythinghousehold.lovable.app",
    displayDomain: "Everything Household",
    icon: ShoppingBag,
    image: everythingHouseholdImg,
  },
  {
    id: "digitech-strategist",
    title: "The DigiTech Strategist",
    category: "Personal Brand",
    description:
      "Founder Jeremiah Adeyemi's own consulting platform, with paths for professionals, business owners and educators.",
    tags: ["Personal Brand", "Consulting", "Strategy"],
    url: "https://thedigitechstrategist.lovable.app",
    displayDomain: "The DigiTech Strategist",
    icon: Briefcase,
    image: digitechImg,
  },
  {
    id: "veridia",
    title: "VeriDIA",
    category: "Health Tech",
    description:
      "An AI-powered app that turns confusing lab reports into plain English and dietary plans grounded in Nigerian food.",
    tags: ["Health Tech", "AI", "Web App"],
    url: "https://getveridia.app/",
    displayDomain: "getveridia.app",
    icon: HeartPulse,
    image: screenshot("veridia"),
    imagePosition: "object-top",
  },
  {
    id: "soteria-eye-clinic",
    title: "Soteria Eye Clinic",
    category: "Healthcare",
    description:
      "An eye clinic's home online: services, branches and appointment booking, with a direct line to its eyewear brand, M & H.",
    tags: ["Healthcare", "Eye Care", "Appointments"],
    displayDomain: "Soteria Eye Clinic",
    icon: Eye,
    image: screenshot("soteria"),
  },
];

export const portfolioCategories = [
  "All",
  ...Array.from(new Set(portfolioProjects.map((p) => p.category))),
];
