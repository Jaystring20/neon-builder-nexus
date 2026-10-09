/**
 * The website's editable content, with the team's edits from /admin laid over
 * what ships in the code (see src/data/siteContent.ts).
 *
 * One small request (GET /api/content, cached at the edge for a minute) serves
 * every page. Until it answers, or if it fails, pages show the original
 * content, so the site never waits on it or breaks because of it.
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { portfolioProjects, screenshot, type PortfolioProject } from "@/data/portfolio";
import { LEADERS, type Leader } from "@/data/leaders";
import { getProgramBySegment, type Program } from "@/data/programDefinitions";
import { DEFAULT_SETTINGS, mergeList, mergeProgram, type SiteContent } from "@/data/siteContent";

export const SITE_CONTENT_KEY = ["site-content"];

async function fetchContent(): Promise<SiteContent> {
  const res = await fetch("/api/content");
  if (!res.ok) throw new Error(`content ${res.status}`);
  return ((await res.json()).content ?? {}) as SiteContent;
}

export function useSiteContent(): SiteContent {
  const q = useQuery({ queryKey: SITE_CONTENT_KEY, queryFn: fetchContent, staleTime: 60_000, retry: 1 });
  return q.data ?? {};
}

export function usePortfolio(): PortfolioProject[] {
  const { portfolio } = useSiteContent();
  return useMemo(
    () =>
      mergeList(portfolioProjects, portfolio, (base, e) => ({
        ...base,
        id: e.id,
        title: e.title,
        category: e.category,
        description: e.description,
        tags: e.tags,
        url: e.url || undefined,
        displayDomain: e.displayDomain,
        icon: base?.icon ?? Globe,
        image: e.imageUrl || base?.image || screenshot(e.id),
        imagePosition: e.imagePosition ?? base?.imagePosition,
        story: e.story && e.story.problem ? e.story : undefined,
      })),
    [portfolio],
  );
}

export function useLeaders(): Leader[] {
  const { leaders } = useSiteContent();
  return useMemo(
    () =>
      mergeList(LEADERS, leaders, (base, e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        title: e.title,
        line: e.line,
        quote: e.quote,
        image: e.imageUrl || base?.image || "",
        link: e.link?.href ? e.link : undefined,
      })),
    [leaders],
  );
}

export function useProgramme(segment: string | undefined): Program | null {
  const { programmes } = useSiteContent();
  return useMemo(
    () => (segment ? mergeProgram(getProgramBySegment(segment), programmes?.[segment]) : null),
    [segment, programmes],
  );
}

export function useShowPrices(): boolean {
  return (useSiteContent().settings ?? DEFAULT_SETTINGS).showPrices;
}
