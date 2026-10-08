import {
  Palette,
  Compass,
  Package,
  Presentation,
  Globe,
  Layers,
  Server,
  Video,
  Bot,
  Sparkles,
  Cog,
  Megaphone,
  Zap,
  PenTool,
  CalendarDays,
  Users,
  UserPlus,
  GraduationCap,
  Briefcase,
  LineChart,
  Cpu,
  Code2,
  Workflow,
  Brain,
  ImagePlay,
  Network,
  BookOpenCheck,
  type LucideIcon,
} from "lucide-react";

export interface SubService {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  /** Training only: the track this course belongs to. */
  track?: "AI Training" | "Workforce Development" | "STEAM Training";
  /** Training only: the step within AI Training, first steps to building. */
  stage?: "Foundations" | "Automate" | "Create & build";
  /** Training only: who the course is for. */
  audience?: string;
  /** Training only: practices that build the same thing for clients. */
  pairsWith?: string[];
}

export type Pillar = "Brand" | "Platforms" | "People";

export interface ServiceCategory {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  /* Every category is "primary" now. The field used to alternate
     primary/secondary down the list, which meant half the categories were
     orange for no reason other than variety — the colour carried no
     information, so a reader learned nothing from it and the page paid for
     it in noise. Cyan is the structural accent; orange is reserved for
     genuine emphasis, and "this is the second item" is not emphasis.

     The field is kept rather than deleted because the nav, the services
     index and the category pages all read it, and it is the hook for a
     future category that genuinely does need to stand apart. */
  color: "primary" | "secondary";
  /** Which part of the engine this practice belongs to (PRODUCT.md). */
  pillar: Pillar;
  /** Short entries for the nav menu when the full list is too long. */
  menu?: { title: string; icon: LucideIcon }[];
  subServices: SubService[];
}

// Copy: docs/services-copy.md. Order follows the pillars: Brand, Platforms,
// People.
export const serviceCategories: ServiceCategory[] = [
  {
    title: "Brand Architecture",
    slug: "brand-architecture",
    pillar: "Brand",
    tagline: "The foundation everything else stands on.",
    description:
      "Strategy, identity and story, designed as one system so every touchpoint says the same thing.",
    color: "primary",
    subServices: [
      {
        title: "Brand Strategy & Identity",
        description: "Clear positioning, a voice and a look people remember.",
        detail:
          "We define what you stand for and who it's for, then turn it into an identity system: positioning, messaging and visual language that stays consistent across every channel.",
        icon: Compass,
      },
      {
        title: "Concept Extraction",
        description: "From raw idea to a story the market understands.",
        detail:
          "Working sessions that pull the real idea out of your vision and shape it into concepts, narratives and visual directions your whole brand can build on.",
        icon: Sparkles,
      },
      {
        title: "Packaging & Merchandise Design",
        description: "The brand, in people's hands.",
        detail:
          "Packaging and merchandise that carry your identity into the physical world and give customers something worth keeping.",
        icon: Package,
      },
      {
        title: "Presentation Design",
        description: "Decks that move a room to a decision.",
        detail:
          "Pitch decks, investor presentations and keynotes structured to take an audience from interest to yes.",
        icon: Presentation,
      },
    ],
  },
  {
    title: "Growth Operations",
    slug: "growth-operations",
    pillar: "Brand",
    tagline: "Where the brand starts earning.",
    description: "Campaigns, content and community, run as one system that compounds.",
    color: "primary",
    subServices: [
      {
        title: "Campaign Strategy",
        description: "Launches and campaigns built to keep moving.",
        detail:
          "From research and audience mapping to multi-channel rollout, each campaign is planned against revenue and brand goals, not impressions.",
        icon: Megaphone,
      },
      {
        title: "Content Engines",
        description: "A steady flow of on-brand content, not one-off posts.",
        detail:
          "Editorial calendars, AI-assisted production and performance feedback loops, set up so content keeps shipping and keeps improving.",
        icon: Zap,
      },
      {
        title: "Performance Copywriting",
        description: "Words that sell and still sound like you.",
        detail:
          "Headlines, emails, landing pages and ads written with direct-response discipline in your brand's voice.",
        icon: PenTool,
      },
      {
        title: "Event Strategy & Production",
        description: "Events designed to build community, not just attendance.",
        detail:
          "Physical and virtual events from first plan to live production, including commercial and music formats.",
        icon: CalendarDays,
      },
      {
        title: "Community & Funnel Architecture",
        description: "What keeps people after the first yes.",
        detail:
          "Lead funnels, community frameworks and nurture sequences that turn first-time buyers and attendees into regulars.",
        icon: Users,
      },
      {
        title: "Influencer & Creator Partnerships",
        description: "The right voices, matched to your growth plan.",
        detail:
          "Finding, recruiting and managing creators from micro to macro, with every partnership tied to measurable goals.",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Digital Infrastructure",
    slug: "digital-infrastructure",
    pillar: "Platforms",
    tagline: "The platform your business runs on.",
    description: "Websites, apps and systems built for speed now and scale later.",
    color: "primary",
    subServices: [
      {
        title: "Web & App Architecture",
        description: "Sites and apps built to convert and to grow.",
        detail:
          "SaaS platforms, e-commerce and web apps, designed mobile-first and engineered for performance and scale.",
        icon: Globe,
      },
      {
        title: "Design Systems",
        description: "One kit, so every team ships on-brand.",
        detail:
          "Component libraries, tokens and guidelines that let your team build consistent work without waiting on design.",
        icon: Layers,
      },
      {
        title: "Platform Development",
        description: "The connections underneath it all.",
        detail:
          "Custom platforms, APIs and integrations that link your tools and data so the business runs without manual hand-offs.",
        icon: Server,
      },
      {
        title: "Motion & Video Production",
        description: "Motion that earns attention.",
        detail: "Social reels to brand films, produced with a clear job for every frame.",
        icon: Video,
      },
    ],
  },
  {
    title: "Agentic AI & Automation",
    slug: "ai-automation",
    pillar: "Platforms",
    tagline: "Systems that work while you sleep.",
    description: "AI agents and automation that take the repeat work off your team.",
    color: "primary",
    subServices: [
      {
        title: "Agentic Workflows",
        description: "AI agents that carry multi-step work end to end.",
        detail:
          "Agents for lead qualification, content distribution, support and other multi-step processes, built to hand off to people where judgment matters.",
        icon: Bot,
      },
      {
        title: "AI-Powered Creative",
        description: "Human direction, produced at AI speed.",
        detail:
          "Creative direction paired with generative tools, so assets ship faster without losing the human touch.",
        icon: Sparkles,
      },
      {
        title: "Automation Consulting",
        description: "Find the busywork, then remove it.",
        detail:
          "An audit of how work actually moves through your business, followed by automation that connects CRM, marketing, fulfilment and reporting.",
        icon: Cog,
      },
    ],
  },
  {
    title: "Training & Workforce Development",
    slug: "training",
    pillar: "People",
    tagline: "Capability that stays after we leave.",
    description:
      "Training for teams and individuals, so the people behind the business grow with it. Cohorts, workshops or one-to-one, online or in person.",
    color: "primary",
    menu: [
      { title: "AI Training", icon: Brain },
      { title: "Workforce Development", icon: Briefcase },
      { title: "STEAM Training", icon: Cpu },
    ],
    subServices: [
      {
        title: "Prompt Engineering & AI Literacy",
        description: "Use AI well, safely and every day.",
        detail:
          "How today's AI tools work, where they help and where they don't, and how to write prompts that get reliable results. The starting point for every other course.",
        icon: BookOpenCheck,
        track: "AI Training",
        stage: "Foundations",
      },
      {
        title: "AI Agents & Agentic Workflows",
        description: "Design and run agents that do real work.",
        detail:
          "Plan, build and supervise AI agents that carry multi-step tasks, and decide where people stay in the loop.",
        icon: Bot,
        track: "AI Training",
        stage: "Automate",
        pairsWith: ["ai-automation"],
      },
      {
        title: "Intelligent Workflow Automation",
        description: "Connect tools so work moves on its own.",
        detail:
          "Link the apps a team already uses so information and tasks flow between them without copy and paste.",
        icon: Workflow,
        track: "AI Training",
        stage: "Automate",
        pairsWith: ["ai-automation"],
      },
      {
        title: "Business Process Automation (BPA)",
        description: "Map a process, then automate it end to end.",
        detail:
          "Document how a process really runs, find the steps worth automating, and rebuild it so it runs reliably with less manual work.",
        icon: Network,
        track: "AI Training",
        stage: "Automate",
        pairsWith: ["ai-automation"],
      },
      {
        title: "Generative & Multimodal Content Creation",
        description: "Text, image, video and audio, made with AI and on brand.",
        detail:
          "Produce content across formats with generative tools while keeping it consistent with your brand and your standards.",
        icon: ImagePlay,
        track: "AI Training",
        stage: "Create & build",
        pairsWith: ["growth-operations", "brand-architecture"],
      },
      {
        title: "AI for Coding & Development",
        description: "Ship software faster with AI in the workflow.",
        detail:
          "Use AI assistants across planning, writing, reviewing and testing code, with the habits that keep quality high.",
        icon: Code2,
        track: "AI Training",
        stage: "Create & build",
        pairsWith: ["digital-infrastructure"],
      },
      {
        title: "AI for Educators",
        description: "Bring AI into teaching, planning and assessment with confidence.",
        detail:
          "Practical AI for lesson planning, classroom use and assessment, with clear guidance on using it responsibly.",
        icon: GraduationCap,
        track: "Workforce Development",
        audience: "Teachers, lecturers and school leaders",
      },
      {
        title: "AI for Professionals",
        description: "Integrate AI into everyday workflows and grow what each person can do.",
        detail:
          "Role-based training that puts AI into the work people already do, so teams take on more with the same hours.",
        icon: Briefcase,
        track: "Workforce Development",
        audience: "Teams in the workplace",
      },
      {
        title: "Learning & Development",
        description: "AI-led programmes built around productivity and outcomes.",
        detail:
          "Programmes designed with L&D and HR teams, aimed at measurable gains in productivity and results.",
        icon: LineChart,
        track: "Workforce Development",
        audience: "L&D and HR teams, organisations",
      },
      {
        title: "AI & Robotics for Young Innovators",
        description: "AI and robotics for innovators aged 6 to 20, and for youths.",
        detail:
          "Hands-on AI and robotics for schools, delivered through STEAM Foundry, DCH's own platform built for this.",
        icon: Cpu,
        track: "STEAM Training",
        audience: "Schools, young innovators aged 6 to 20, and youths",
      },
    ],
  },
];

/** External links for the STEAM track. */
export const steamLinks = {
  foundry: "https://apen.digitalcreativeshubltd.com/",
};

/**
 * Key partners. Most of DCH's training is co-organised with AIRS, so it is
 * credited as a partner on the training page rather than linked out to.
 */
export const trainingPartner = {
  name: "Artificial Intelligence & Robotics School",
  short: "AIRS",
};

export const pillarOrder: Pillar[] = ["Brand", "Platforms", "People"];
