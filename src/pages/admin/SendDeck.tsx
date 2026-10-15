import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, type Activity } from "@/lib/adminApi";
import { Panel, fmtDate } from "./ui";

const MAX_BYTES = 20 * 1024 * 1024;
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;

const draft = (firstName: string | null) =>
  [
    `Hi ${firstName ?? "there"},`,
    "Thanks for taking the Growth Diagnostic. We looked closer at your answers and put together a short deck for you: your diagnosis, your first move and the next 90 days.",
    "It's attached. Have a look, and if it rings true, book a call and we'll go through it together.",
  ].join("\n\n");

/**
 * Send a client their diagnostic deck: upload the PDF, check the email, send.
 * The address is the one on the diagnostic, never typed, so it can only go to
 * this client. The team inbox gets a hidden copy.
 */
export function SendDeck({
  id,
  email,
  firstName,
  activity,
  queryKey,
}: {
  id: string;
  email: string;
  firstName: string | null;
  activity: Activity[];
  queryKey: unknown[];
}) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [subject, setSubject] = useState(`${firstName ? `${firstName}, your` : "Your"} Growth Diagnostic deck`);
  const [message, setMessage] = useState(() => draft(firstName));
  const [reviewing, setReviewing] = useState(false);
  const [again, setAgain] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const previous = activity.filter((a) => a.action === "diagnostic.deck_sent");

  const upload = useMutation({
    mutationFn: (f: File) => adminApi.uploadDeck(id, f),
    onSuccess: setPath,
  });
  const send = useMutation({
    mutationFn: () => adminApi.sendDeck({ id, path: path!, filename: file!.name, subject, message, again }),
    onSuccess: (r) => {
      setDone(
        `Sent to ${r.to}.${r.followupsCancelled ? ` ${r.followupsCancelled} queued follow-up email${r.followupsCancelled > 1 ? "s were" : " was"} cancelled.` : ""}`,
      );
      setFile(null);
      setPath(null);
      setReviewing(false);
      setAgain(false);
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey });
    },
  });

  const choose = (f: File | undefined) => {
    setDone(null);
    setPath(null);
    setReviewing(false);
    upload.reset();
    send.reset();
    if (!f) return setFile(null);
    setFile(f);
    if (f.size > MAX_BYTES) return;
    upload.mutate(f);
  };

  const tooBig = file ? file.size > MAX_BYTES : false;
  const ready = Boolean(path && subject.trim() && message.trim()) && !upload.isPending;

  return (
    <Panel title="Send the deck">
      {previous.length > 0 && (
        <p className="mb-4 border-l-2 border-primary pl-3 text-sm text-foreground/90">
          Already sent {previous.length > 1 ? `${previous.length} times, last` : ""} {fmtDate(previous[0].created_at, true)}: {String(previous[0].detail.file ?? "a deck")}
        </p>
      )}
      {done && <p className="mb-4 text-sm text-primary">{done}</p>}

      {!reviewing ? (
        <div className="space-y-3">
          <label className="block text-sm text-muted-foreground">
            The deck, as a PDF (up to 20 MB)
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="mt-1 block w-full text-sm text-foreground file:mr-3 file:border file:border-border/60 file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:text-foreground"
              onChange={(e) => choose(e.target.files?.[0])}
            />
          </label>
          {file && (
            <p className="text-sm text-muted-foreground">
              {tooBig ? (
                <span className="text-destructive">That PDF is {mb(file.size)}. Export a smaller one, under 20 MB.</span>
              ) : upload.isPending ? (
                "Uploading..."
              ) : path ? (
                `${file.name}, ${mb(file.size)}, ready`
              ) : null}
            </p>
          )}
          {upload.error && <p className="text-sm text-destructive">{(upload.error as Error).message}</p>}
          <label className="block text-sm text-muted-foreground">
            Subject
            <Input className="mt-1" value={subject} maxLength={200} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="block text-sm text-muted-foreground">
            Message
            <Textarea className="mt-1 min-h-48" value={message} maxLength={5000} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <p className="text-xs text-muted-foreground">A "Book a discovery call" button and your name are added below the message. Replies come to you.</p>
          <Button size="sm" disabled={!ready} onClick={() => setReviewing(true)}>
            Review before sending
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-sm">
          <dl className="space-y-2">
            <div>
              <dt className="text-muted-foreground">To</dt>
              <dd className="text-foreground">{email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Attached</dt>
              <dd className="flex items-center gap-2 text-foreground">
                <FileText className="h-4 w-4" /> {file!.name}, {mb(file!.size)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subject</dt>
              <dd className="text-foreground">{subject}</dd>
            </div>
          </dl>
          <div className="whitespace-pre-line border border-border/60 p-3 text-foreground/90">{message}</div>
          <p className="text-xs text-muted-foreground">
            A hidden copy goes to the team inbox. Any follow-up emails still queued for them are cancelled, and they move to Leads as Contacted.
          </p>
          {previous.length > 0 && (
            <label className="flex items-start gap-2 text-foreground">
              <input type="checkbox" className="mt-1" checked={again} onChange={(e) => setAgain(e.target.checked)} />
              They already have a deck. Send this one as well.
            </label>
          )}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={send.isPending || (previous.length > 0 && !again)} onClick={() => send.mutate()}>
              <Send className="h-4 w-4" /> {send.isPending ? "Sending..." : `Send to ${email}`}
            </Button>
            <Button size="sm" variant="outline" disabled={send.isPending} onClick={() => setReviewing(false)}>
              Edit
            </Button>
          </div>
          {send.error && <p className="text-destructive">{(send.error as Error).message}</p>}
        </div>
      )}
    </Panel>
  );
}
