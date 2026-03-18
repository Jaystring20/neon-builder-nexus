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
  type LucideIcon,
} from "lucide-react";

export interface SubService {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
}

export interface ServiceCategory {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  color: "primary" | "secondary";
  subServices: SubService[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    title: "Brand Architecture",
    slug: "brand-architecture",
    tagline: "Engineering the Visual Soul",
    description:
      "We don't just 'design' brands; we architect the strategic and visual foundations that hold your growth together.",
    color: "primary",
    subServices: [
      {
        title: "Brand Strategy & Identity",
        description: "Defining the core signal in a world of digital noise.",
        detail:
          "We extract the DNA of your brand and translate it into a strategic identity system — from positioning and messaging frameworks to visual language — that cuts through market noise and creates instant recognition. Every element is engineered for consistency across channels and longevity across market cycles.",
        icon: Compass,
      },
      {
        title: "Concept Extraction",
        description: "Turning raw vision into market-ready narratives.",
        detail:
          "Your ideas deserve more than a mood board. We run deep-dive extraction sessions to distill your raw vision into sharp, market-ready creative concepts — complete with narrative arcs, visual directions, and strategic frameworks that become the blueprint for everything your brand communicates.",
        icon: Sparkles,
      },
      {
        title: "Packaging & Merchandise Design",
        description: "Tangible touchpoints for the brand engine.",
        detail:
          "Physical products are brand experiences in 3D. We design packaging and merchandise that extend your digital identity into the real world — creating tactile, collectible touchpoints that deepen loyalty and turn customers into walking brand ambassadors.",
        icon: Package,
      },
      {
        title: "Presentation Design",
        description: "Captivating slides engineered to tell your story and close the gap.",
        detail:
          "Whether it's a pitch deck, investor presentation, or keynote — we engineer visual narratives that command attention and drive decisions. Every slide is strategically structured to move your audience from curiosity to conviction.",
        icon: Presentation,
      },
    ],
  },
  {
    title: "Digital Infrastructure",
    slug: "digital-infrastructure",
    tagline: "Building the Road",
    description:
      "We build the high-performance environments where your brand lives, breathes, and converts.",
    color: "secondary",
    subServices: [
      {
        title: "Web & App Architecture",
        description: "High-conversion digital ecosystems built for velocity.",
        detail:
          "We don't build websites — we architect digital ecosystems. From SaaS platforms to e-commerce engines, every pixel and interaction is engineered for performance, conversion, and scale. Mobile-first, blazing-fast, and built to grow with your business.",
        icon: Globe,
      },
      {
        title: "Design Systems",
        description: "Scalable visual frameworks that empower your internal teams.",
        detail:
          "A design system is the operating manual for your brand's visual execution. We create comprehensive, component-based frameworks with tokens, guidelines, and reusable patterns that empower your internal teams to ship consistently beautiful work — without bottlenecks.",
        icon: Layers,
      },
      {
        title: "Platform Development",
        description: "The technical 'Road' your brand drives on.",
        detail:
          "Custom platforms, APIs, and integrations that form the technical backbone of your digital operations. We engineer the infrastructure that connects your tools, automates your workflows, and handles scale — so your brand can accelerate without friction.",
        icon: Server,
      },
      {
        title: "Motion & Video Production",
        description: "Dynamic assets engineered for engagement.",
        detail:
          "From scroll-stopping social reels to cinematic brand films, we produce motion content that captures attention and drives action. Every frame is intentional, every transition purposeful — motion design as a growth lever, not decoration.",
        icon: Video,
      },
    ],
  },
  {
    title: "Agentic AI & Automation",
    slug: "ai-automation",
    tagline: "The Execution Powerhouse",
    description:
      "We bridge the gap between human brilliance and AI speed to create systems that work while you sleep.",
    color: "primary",
    subServices: [
      {
        title: "Agentic Workflows",
        description: "AI-powered systems that execute complex tasks autonomously.",
        detail:
          "We design and deploy autonomous AI agents that handle multi-step business processes — from lead qualification to content distribution to customer support. These aren't chatbots; they're intelligent systems that learn, adapt, and execute at a speed no human team can match.",
        icon: Bot,
      },
      {
        title: "AI-Powered Creative",
        description: "Human-led imagination, engineered at AI velocity.",
        detail:
          "We combine world-class creative direction with cutting-edge AI tools to produce brand assets at unprecedented speed without sacrificing quality. From AI-assisted design sprints to generative content pipelines — we multiply your creative output while keeping the human touch that makes it resonate.",
        icon: Sparkles,
      },
      {
        title: "Automation Consulting",
        description: "Transforming fragmented operations into integrated growth engines.",
        detail:
          "We audit your operations, identify friction points, and architect automation solutions that eliminate manual busywork — connecting your CRM, marketing tools, fulfillment, and analytics into a seamless, self-running growth engine.",
        icon: Cog,
      },
    ],
  },
  {
    title: "Growth Operations",
    slug: "growth-operations",
    tagline: "Architecting Momentum",
    description:
      "We deploy the strategic fuel that turns your infrastructure into a market-leading empire.",
    color: "secondary",
    subServices: [
      {
        title: "Campaign Strategy",
        description: "Multi-market momentum builders from concept to launch.",
        detail:
          "We engineer launch campaigns and ongoing marketing strategies that create compounding momentum. From market research and audience mapping to multi-channel deployment — every campaign is a precision instrument designed to move the needle on revenue and brand authority.",
        icon: Megaphone,
      },
      {
        title: "Content Engines",
        description: "High-velocity asset production for social and performance ads.",
        detail:
          "We build content production systems — not one-off posts. Our content engines combine editorial calendars, AI-assisted production, and performance feedback loops to deliver a steady stream of on-brand, high-converting assets across every channel that matters.",
        icon: Zap,
      },
      {
        title: "Performance Copywriting",
        description: "Words engineered for conversion and authority.",
        detail:
          "Every headline, email, landing page, and ad is written with one goal: conversion. We combine direct-response principles with brand voice to create copy that doesn't just sound good — it sells. From web copy to sales sequences, every word earns its place.",
        icon: PenTool,
      },
      {
        title: "Event Strategy & Production",
        description: "End-to-end event architecture from ideation to execution.",
        detail:
          "We architect physical and virtual events as conversion engines — from strategic roadmapping and activity planning to live content production across commercial and musical formats. Every event is designed with one outcome in mind: building community that converts. Because strategy is the map, and the event is the engine.",
        icon: CalendarDays,
      },
      {
        title: "Community & Funnel Architecture",
        description: "Building the engine that sustains momentum beyond the event.",
        detail:
          "We engineer lead pipeline funnels, community-building frameworks, and post-event nurture sequences that transform attendees into loyal advocates and one-time buyers into lifetime customers. Because community is the engine that sustains — and we build the infrastructure to keep it running.",
        icon: Users,
      },
      {
        title: "Influencer & Creator Partnerships",
        description: "Micro to macro — activating voices that amplify your brand.",
        detail:
          "We identify, recruit, and manage strategic creator partnerships across micro, mini, and macro tiers — integrating influencer campaigns into your broader growth strategy for maximum virality, memorability, and measurable ROI. Every partnership is engineered for momentum, not just impressions.",
        icon: UserPlus,
      },
    ],
  },
];
