/**
 * Shared pieces for the website-content editors (Programmes, Portfolio,
 * Leadership): loading and saving one content key, the save bar, version
 * history, and the form fields.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageUp, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContentKey } from "@/data/siteContent";
import { SITE_CONTENT_KEY } from "@/hooks/useSiteContent";
import { adminApi, type ContentState } from "@/lib/adminApi";
import { Panel, ago, fmtDate } from "./ui";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/**
 * One content key as an editable draft. The draft starts from the saved
 * version, or the original content when nothing has been saved.
 */
export function useContentEditor<T>(key: ContentKey, original: () => T) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "content", key], queryFn: () => adminApi.content<T>(key) });
  const saved = useMemo(() => (q.data ? clone(q.data.value ?? original()) : null), [q.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const [draft, setDraft] = useState<T | null>(null);
  useEffect(() => setDraft(saved ? clone(saved) : null), [saved]);
  const dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const done = () => {
    qc.invalidateQueries({ queryKey: ["admin", "content", key] });
    qc.invalidateQueries({ queryKey: ["admin", "overview"] });
    qc.invalidateQueries({ queryKey: SITE_CONTENT_KEY });
  };
  const save = useMutation({ mutationFn: () => adminApi.saveContent(key, draft), onSuccess: done });
  const reset = useMutation({ mutationFn: () => adminApi.resetContent(key), onSuccess: done });
  const restore = useMutation({ mutationFn: (id: string) => adminApi.restoreContent(id), onSuccess: done });

  return {
    state: q.data as ContentState<T> | undefined,
    loading: q.isLoading,
    error: q.error,
    draft,
    /** Change the draft in place; the editor re-renders. */
    edit: (fn: (d: T) => void) =>
      setDraft((d) => {
        if (!d) return d;
        const next = clone(d);
        fn(next);
        return next;
      }),
    discard: () => setDraft(saved ? clone(saved) : null),
    dirty,
    save,
    reset,
    restore,
  };
}

export type ContentEditor<T> = ReturnType<typeof useContentEditor<T>>;

/** The bar that stays on screen while editing: what's changed, and Save. */
export function SaveBar<T>({ editor, livePath }: { editor: ContentEditor<T>; livePath: string }) {
  const err = editor.save.error ?? editor.reset.error ?? editor.restore.error;
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <p className="mr-auto text-sm">
          {editor.dirty ? (
            <span className="text-secondary">Unsaved changes</span>
          ) : editor.save.isSuccess ? (
            <span className="text-primary">Saved. Live on the website within a minute.</span>
          ) : editor.state?.updatedAt ? (
            <span className="text-muted-foreground">Last saved {ago(editor.state.updatedAt)}</span>
          ) : (
            <span className="text-muted-foreground">Showing the original content</span>
          )}
        </p>
        <a href={livePath} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
          View on site
        </a>
        {editor.dirty && (
          <Button variant="ghost" size="sm" onClick={editor.discard}>
            Discard
          </Button>
        )}
        <Button size="sm" disabled={!editor.dirty || editor.save.isPending} onClick={() => editor.save.mutate()}>
          {editor.save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save and publish"}
        </Button>
      </div>
      {err && <p className="mt-2 text-sm text-destructive">{(err as Error).message}</p>}
    </div>
  );
}

const who = (p: { name: string; email: string } | null) => (p ? p.name || p.email : "Someone");

/** Earlier saves, any of which can be brought back, and a way back to the original. */
export function VersionsPanel<T>({ editor, canReset = true }: { editor: ContentEditor<T>; canReset?: boolean }) {
  const versions = editor.state?.versions ?? [];
  const busy = editor.restore.isPending || editor.reset.isPending;
  return (
    <Panel title="History">
      {versions.length ? (
        <ul className="space-y-3 text-sm">
          {versions.map((v, i) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-foreground/90">
                {who(v.savedBy)} {v.reset ? "went back to the original" : "saved"}{" "}
                <span className="text-muted-foreground">· {fmtDate(v.savedAt, true)}</span>
                {i === 0 && <span className="ml-2 text-xs text-primary">live</span>}
              </span>
              {i > 0 && (
                <button
                  disabled={busy || editor.dirty}
                  title={editor.dirty ? "Save or discard your changes first" : undefined}
                  onClick={() => editor.restore.mutate(v.id)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Restore
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No changes yet. The website shows the original content.</p>
      )}
      {canReset && editor.state?.value != null && (
        <button
          disabled={busy || editor.dirty}
          onClick={() => {
            if (window.confirm("Go back to the original content? Your saved versions stay in History.")) editor.reset.mutate();
          }}
          className="mt-5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-40"
        >
          Go back to the original content
        </button>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------- fields

const inputBase =
  "w-full border border-border/60 bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none disabled:opacity-60";

export const FieldRow = ({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) => (
  <label className={cn("block", className)}>
    <span className="block text-sm font-medium text-foreground">{label}</span>
    {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
    <span className="mt-1.5 block">{children}</span>
  </label>
);

export const TextInput = ({
  value,
  onChange,
  ...rest
}: { value: string | undefined; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) => (
  <input {...rest} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(inputBase, "h-10", rest.className)} />
);

export const TextArea = ({ value, onChange, rows = 3 }: { value: string | undefined; onChange: (v: string) => void; rows?: number }) => (
  <textarea value={value ?? ""} rows={rows} onChange={(e) => onChange(e.target.value)} className={cn(inputBase, "py-2 leading-relaxed")} />
);

/** A list of short lines, edited as one line each. */
export const LinesInput = ({ value, onChange, rows = 4 }: { value: string[]; onChange: (v: string[]) => void; rows?: number }) => {
  const [text, setText] = useState(value.join("\n"));
  // Follow outside changes (discard, restore) without fighting the cursor.
  const last = useRef(value);
  useEffect(() => {
    if (value.join("\n") !== last.current.join("\n")) setText(value.join("\n"));
    last.current = value;
  }, [value]);
  return (
    <textarea
      value={text}
      rows={rows}
      onChange={(e) => {
        setText(e.target.value);
        const lines = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean);
        last.current = lines;
        onChange(lines);
      }}
      className={cn(inputBase, "py-2 leading-relaxed")}
    />
  );
};

/** An image: shows the current one, uploads a replacement, or goes back to the original. */
export function ImageInput({
  folder,
  url,
  fallback,
  onChange,
  aspect = "aspect-[16/10]",
}: {
  folder: "portfolio" | "leaders";
  url: string | undefined;
  fallback: string | undefined;
  onChange: (url: string | undefined) => void;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const upload = useMutation({ mutationFn: (f: File) => adminApi.uploadImage(folder, f), onSuccess: (u) => onChange(u) });
  const shown = url || fallback;
  return (
    <div>
      <div className={cn("relative overflow-hidden border border-border/60 bg-card/40", aspect)}>
        {shown ? (
          <img src={shown} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">No image</span>
        )}
        {upload.isPending && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload.mutate(f);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-1.5 text-primary hover:underline">
          <ImageUp className="h-4 w-4" /> {shown ? "Replace image" : "Upload image"}
        </button>
        {url && fallback && (
          <button type="button" onClick={() => onChange(undefined)} className="text-muted-foreground hover:text-foreground">
            Use the original
          </button>
        )}
      </div>
      {upload.error && <p className="mt-1 text-sm text-destructive">{(upload.error as Error).message}</p>}
    </div>
  );
}
