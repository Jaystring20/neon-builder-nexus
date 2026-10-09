import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLES, ROLE_LABEL, ROLE_SUMMARY, type Role } from "@/data/adminRoles";
import { adminApi, type TeamMember } from "@/lib/adminApi";
import { useMe } from "./AdminApp";
import { ErrorNote, Loading, PageHeader, Panel, ago, selectClass } from "./ui";

const inputClass =
  "h-10 w-full border border-border/60 bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";

function AddMember() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("manager");
  const add = useMutation({
    mutationFn: () => adminApi.saveMember({ email, name, role }),
    onSuccess: () => {
      setEmail("");
      setName("");
      qc.invalidateQueries({ queryKey: ["admin", "team"] });
    },
  });

  return (
    <Panel title="Add someone">
      <form
        className="grid gap-3 sm:grid-cols-[1fr_1fr_10rem_auto]"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <input aria-label="Email" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        <input aria-label="Name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)} className={selectClass}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={add.isPending}>
          {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      </form>
      <p className="mt-3 text-sm text-muted-foreground">
        {ROLE_LABEL[role]}: {ROLE_SUMMARY[role]} They sign in at /admin with this email.
      </p>
      {add.error && <p className="mt-2 text-sm text-destructive">{(add.error as Error).message}</p>}
    </Panel>
  );
}

function MemberRow({ m, self }: { m: TeamMember; self: boolean }) {
  const qc = useQueryClient();
  const save = useMutation({
    mutationFn: (patch: Partial<Pick<TeamMember, "role" | "active">>) =>
      adminApi.saveMember({ id: m.id, name: m.name, role: patch.role ?? m.role, active: patch.active ?? m.active }),
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "team"] }),
  });

  return (
    <li className={cn("flex flex-wrap items-center justify-between gap-4 px-4 py-4", !m.active && "opacity-60")}>
      <div className="min-w-0">
        <p className="text-foreground">
          {m.name || m.email} {self && <span className="text-xs text-muted-foreground">(you)</span>}
        </p>
        <p className="text-sm text-muted-foreground">
          {m.email} · {m.last_seen_at ? `last signed in ${ago(m.last_seen_at)}` : "hasn't signed in yet"}
        </p>
        {save.error && <p className="mt-1 text-sm text-destructive">{(save.error as Error).message}</p>}
      </div>
      <div className="flex items-center gap-3">
        <select
          aria-label={`Role for ${m.email}`}
          value={m.role}
          disabled={self || !m.active || save.isPending}
          onChange={(e) => save.mutate({ role: e.target.value as Role })}
          className={selectClass}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        {!self && (
          <button
            disabled={save.isPending}
            onClick={() => save.mutate({ active: !m.active })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {m.active ? "Remove access" : "Restore access"}
          </button>
        )}
      </div>
    </li>
  );
}

export default function Team() {
  const me = useMe();
  const q = useQuery({ queryKey: ["admin", "team"], queryFn: adminApi.team });

  return (
    <>
      <PageHeader title="Team" lead="Who can sign in, and what each person can do." />
      <div className="mt-8 space-y-8">
        <AddMember />
        {q.isLoading ? (
          <Loading />
        ) : q.error ? (
          <ErrorNote error={q.error} />
        ) : (
          <ul className="divide-y divide-border/40 border border-border/60">
            {q.data!.team.map((m) => (
              <MemberRow key={m.id} m={m} self={m.id === me.id} />
            ))}
          </ul>
        )}
        <Panel title="Roles">
          <dl className="space-y-2 text-sm">
            {ROLES.map((r) => (
              <div key={r} className="grid gap-1 sm:grid-cols-[8rem_1fr]">
                <dt className="text-foreground">{ROLE_LABEL[r]}</dt>
                <dd className="text-muted-foreground">{ROLE_SUMMARY[r]}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </>
  );
}
