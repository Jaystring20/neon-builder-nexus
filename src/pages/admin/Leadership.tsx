import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEADERS } from "@/data/leaders";
import type { LeaderEdit } from "@/data/siteContent";
import { FieldRow, ImageInput, SaveBar, TextArea, TextInput, VersionsPanel, useContentEditor } from "./content";
import { ErrorNote, Loading, PageHeader, Panel } from "./ui";

const ORIGINAL = new Map(LEADERS.map((l) => [l.id, l]));

const originalLeaders = (): LeaderEdit[] =>
  LEADERS.map((l) => ({
    id: l.id,
    name: l.name,
    role: l.role,
    title: l.title,
    line: l.line,
    quote: l.quote,
    link: l.link ? { ...l.link } : undefined,
  }));

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export default function Leadership() {
  const editor = useContentEditor<LeaderEdit[]>("leaders", originalLeaders);
  const [newName, setNewName] = useState("");

  if (editor.loading || !editor.draft) return editor.error ? <ErrorNote error={editor.error} /> : <Loading />;
  const people = editor.draft;

  const move = (i: number, by: number) =>
    editor.edit((d) => {
      const [it] = d.splice(i, 1);
      d.splice(i + by, 0, it);
    });

  return (
    <>
      <SaveBar editor={editor} livePath="/about" />
      <PageHeader title="Leadership" lead="The people in “At the helm” on the About page, in the order shown here." />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const base = slugify(newName) || "person";
              let id = base;
              for (let n = 2; people.some((p) => p.id === id); n++) id = `${base}-${n}`;
              editor.edit((d) => d.push({ id, name: newName.trim(), role: "", title: "", line: "", quote: "" }));
              setNewName("");
            }}
          >
            <TextInput value={newName} placeholder="Full name" onChange={setNewName} className="max-w-sm" />
            <Button type="submit" variant="outline" disabled={!newName.trim()}>
              <Plus className="h-4 w-4" /> Add person
            </Button>
          </form>

          {people.map((p, i) => {
            const set = (fn: (l: LeaderEdit) => void) => editor.edit((d) => fn(d[i]));
            return (
              <Panel key={p.id} className={cn(p.hidden && "opacity-60")}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {p.name || "New person"} {p.hidden && "· hidden"}
                  </p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="p-1.5 hover:text-foreground disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button aria-label="Move down" disabled={i === people.length - 1} onClick={() => move(i, 1)} className="p-1.5 hover:text-foreground disabled:opacity-30">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={p.hidden ? "Show on the website" : "Hide from the website"}
                      title={p.hidden ? "Show on the website" : "Hide from the website"}
                      onClick={() => set((l) => (l.hidden = !l.hidden))}
                      className="p-1.5 hover:text-foreground"
                    >
                      {p.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {!ORIGINAL.has(p.id) && (
                      <button
                        aria-label="Delete"
                        onClick={() => {
                          if (window.confirm(`Remove ${p.name || "this person"}?`)) editor.edit((d) => d.splice(i, 1));
                        }}
                        className="p-1.5 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-[11rem_1fr]">
                  <ImageInput folder="leaders" aspect="aspect-[4/5]" url={p.imageUrl} fallback={ORIGINAL.get(p.id)?.image} onChange={(u) => set((l) => (l.imageUrl = u))} />
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldRow label="Name">
                        <TextInput value={p.name} onChange={(v) => set((l) => (l.name = v))} />
                      </FieldRow>
                      <FieldRow label="Role" hint="For example: Chief Operating Officer">
                        <TextInput value={p.role} onChange={(v) => set((l) => (l.role = v))} />
                      </FieldRow>
                    </div>
                    <FieldRow label="Title" hint="The short line under the name">
                      <TextInput value={p.title} onChange={(v) => set((l) => (l.title = v))} />
                    </FieldRow>
                    <FieldRow label="Bio" hint="One or two sentences">
                      <TextArea value={p.line} onChange={(v) => set((l) => (l.line = v))} />
                    </FieldRow>
                    <FieldRow label="Quote">
                      <TextInput value={p.quote} onChange={(v) => set((l) => (l.quote = v))} />
                    </FieldRow>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldRow label="Link text" hint="Optional">
                        <TextInput
                          value={p.link?.label}
                          placeholder="Connect with …"
                          onChange={(v) => set((l) => (l.link = { label: v, href: l.link?.href ?? "" }))}
                        />
                      </FieldRow>
                      <FieldRow label="Link address">
                        <TextInput
                          value={p.link?.href}
                          placeholder="https://"
                          onChange={(v) => set((l) => (l.link = { label: l.link?.label ?? "", href: v }))}
                        />
                      </FieldRow>
                    </div>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>

        <div className="space-y-8">
          <Panel title="Photos">
            <p className="text-sm text-muted-foreground">
              Portrait photos work best (4 by 5), with the face in the upper half. They're resized automatically.
            </p>
          </Panel>
          <VersionsPanel editor={editor} />
        </div>
      </div>
    </>
  );
}
