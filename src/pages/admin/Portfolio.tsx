import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portfolioProjects, screenshot } from "@/data/portfolio";
import type { ImagePosition, PortfolioItemEdit } from "@/data/siteContent";
import { FieldRow, ImageInput, LinesInput, SaveBar, TextArea, TextInput, VersionsPanel, useContentEditor } from "./content";
import { ErrorNote, Loading, PageHeader, Panel, selectClass } from "./ui";

const ORIGINAL_IDS = new Set(portfolioProjects.map((p) => p.id));

const originalPortfolio = (): PortfolioItemEdit[] =>
  portfolioProjects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    tags: [...p.tags],
    url: p.url ?? "",
    displayDomain: p.displayDomain,
    imagePosition: p.imagePosition as ImagePosition | undefined,
    story: p.story ? { ...p.story, built: [...p.story.built] } : undefined,
  }));

const originalImage = (id: string) => portfolioProjects.find((p) => p.id === id)?.image ?? screenshot(id);

const POSITIONS: { value: ImagePosition; label: string }[] = [
  { value: "object-left-top", label: "Top left" },
  { value: "object-top", label: "Top centre" },
  { value: "object-right-top", label: "Top right" },
  { value: "object-center", label: "Centre" },
  { value: "object-bottom", label: "Bottom" },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function ProjectFields({ item, onChange }: { item: PortfolioItemEdit; onChange: (fn: (p: PortfolioItemEdit) => void) => void }) {
  const story = item.story ?? { problem: "", built: [], outcome: "" };
  const setStory = (fn: (s: NonNullable<PortfolioItemEdit["story"]>) => void) =>
    onChange((p) => {
      p.story = p.story ?? { problem: "", built: [], outcome: "" };
      fn(p.story);
    });

  return (
    <div className="grid gap-5 border-t border-border/40 px-4 py-5 lg:grid-cols-[1fr_18rem]">
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Name">
            <TextInput value={item.title} onChange={(v) => onChange((p) => (p.title = v))} />
          </FieldRow>
          <FieldRow label="Category" hint="For example: Optical Retail">
            <TextInput value={item.category} onChange={(v) => onChange((p) => (p.category = v))} />
          </FieldRow>
        </div>
        <FieldRow label="Description">
          <TextArea value={item.description} onChange={(v) => onChange((p) => (p.description = v))} />
        </FieldRow>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Website link" hint="Leave empty if it isn't live yet">
            <TextInput value={item.url} placeholder="https://" onChange={(v) => onChange((p) => (p.url = v))} />
          </FieldRow>
          <FieldRow label="Link label" hint="What visitors see instead of the raw address">
            <TextInput value={item.displayDomain} onChange={(v) => onChange((p) => (p.displayDomain = v))} />
          </FieldRow>
        </div>
        <FieldRow label="Tags" hint="Separated by commas">
          <TextInput
            value={item.tags.join(", ")}
            onChange={(v) =>
              onChange(
                (p) =>
                  (p.tags = v
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)),
              )
            }
          />
        </FieldRow>

        <div className="border-l-2 border-primary/40 pl-4">
          <p className="text-sm font-medium text-foreground">The story</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Projects with a story and a screenshot are featured on Our Work. Leave it empty to show the project in the grid instead.
          </p>
          <div className="grid gap-4">
            <FieldRow label="The problem" hint="One sentence">
              <TextArea value={story.problem} rows={2} onChange={(v) => setStory((s) => (s.problem = v))} />
            </FieldRow>
            <FieldRow label="What we built" hint="Up to three short items, one per line">
              <LinesInput value={story.built} rows={3} onChange={(v) => setStory((s) => (s.built = v.slice(0, 5)))} />
            </FieldRow>
            <FieldRow label="What exists now" hint="Quoted from the live site, or something countable">
              <TextInput value={story.outcome} onChange={(v) => setStory((s) => (s.outcome = v))} />
            </FieldRow>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FieldRow label="Screenshot">
          <ImageInput folder="portfolio" url={item.imageUrl} fallback={originalImage(item.id)} onChange={(u) => onChange((p) => (p.imageUrl = u))} />
        </FieldRow>
        <FieldRow label="Crop" hint="Which part of the screenshot stays in view">
          <select
            value={item.imagePosition ?? "object-left-top"}
            onChange={(e) => onChange((p) => (p.imagePosition = e.target.value as ImagePosition))}
            className={cn(selectClass, "w-full")}
          >
            {POSITIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldRow>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const editor = useContentEditor<PortfolioItemEdit[]>("portfolio", originalPortfolio);
  const [open, setOpen] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  if (editor.loading || !editor.draft) return editor.error ? <ErrorNote error={editor.error} /> : <Loading />;
  const items = editor.draft;

  const move = (i: number, by: number) =>
    editor.edit((d) => {
      const [it] = d.splice(i, 1);
      d.splice(i + by, 0, it);
    });

  const add = () => {
    const base = slugify(newName) || "project";
    let id = base;
    for (let n = 2; items.some((p) => p.id === id); n++) id = `${base}-${n}`;
    editor.edit((d) => d.unshift({ id, title: newName.trim(), category: "", description: "", tags: [], url: "", displayDomain: "" }));
    setNewName("");
    setOpen(id);
  };

  return (
    <>
      <SaveBar editor={editor} livePath="/our-work" />
      <PageHeader title="Portfolio" lead="The projects on Our Work and in the home page's work section, in the order shown here." />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (newName.trim()) add();
            }}
          >
            <TextInput value={newName} placeholder="New project name" onChange={setNewName} className="max-w-sm" />
            <Button type="submit" variant="outline" disabled={!newName.trim()}>
              <Plus className="h-4 w-4" /> Add project
            </Button>
          </form>

          <ul className="border border-border/60">
            {items.map((item, i) => {
              const isOpen = open === item.id;
              const thumb = item.imageUrl || originalImage(item.id);
              return (
                <li key={item.id} className={cn("border-b border-border/40 last:border-0", item.hidden && "opacity-60")}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="relative h-10 w-16 shrink-0 overflow-hidden border border-border/60 bg-card/40">
                        {thumb && <img src={thumb} alt="" className="h-full w-full object-cover object-left-top" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-foreground">{item.title || "Untitled"}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {item.hidden ? "Hidden" : item.story?.problem ? "Featured story" : "In the grid"}
                          {item.category ? ` · ${item.category}` : ""}
                        </span>
                      </span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </button>
                    <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                      <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="p-1.5 hover:text-foreground disabled:opacity-30">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="p-1.5 hover:text-foreground disabled:opacity-30">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={item.hidden ? "Show on the website" : "Hide from the website"}
                        title={item.hidden ? "Show on the website" : "Hide from the website"}
                        onClick={() => editor.edit((d) => (d[i].hidden = !d[i].hidden))}
                        className="p-1.5 hover:text-foreground"
                      >
                        {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {!ORIGINAL_IDS.has(item.id) && (
                        <button
                          aria-label="Delete"
                          onClick={() => {
                            if (window.confirm(`Delete ${item.title || "this project"}?`)) editor.edit((d) => d.splice(i, 1));
                          }}
                          className="p-1.5 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {isOpen && <ProjectFields item={item} onChange={(fn) => editor.edit((d) => fn(d[i]))} />}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-8">
          <Panel title="How it works">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Projects show in this order, top first.</li>
              <li>The eye hides a project without losing it.</li>
              <li>Upload screenshots as PNG or JPEG; they're resized automatically.</li>
              <li>Nothing changes on the website until you press Save and publish.</li>
            </ul>
          </Panel>
          <VersionsPanel editor={editor} />
        </div>
      </div>
    </>
  );
}
