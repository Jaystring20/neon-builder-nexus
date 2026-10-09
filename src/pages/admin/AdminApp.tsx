/**
 * The DCH admin dashboard at /admin. Loaded on its own (React.lazy in App.tsx),
 * so none of this ships with the public site.
 *
 * Sign-in is by emailed link (api/admin.ts → login, verify). The session is an
 * HttpOnly cookie; this page only asks the server who is signed in.
 */

import { createContext, useContext, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, BookOpen, Briefcase, ClipboardList, Inbox, Loader2, LogOut, UserRound, Users } from "lucide-react";
import dchLogo from "@/assets/dch-logo-primary.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_LABEL, can, type Permission } from "@/data/adminRoles";
import { AdminApiError, adminApi, type Me } from "@/lib/adminApi";
import Overview from "./Overview";
import { LeadDetail, LeadsList } from "./Leads";
import { DiagnosticDetail, DiagnosticsList } from "./Diagnostics";
import Team from "./Team";
import Programmes from "./Programmes";
import Portfolio from "./Portfolio";
import Leadership from "./Leadership";

const MeContext = createContext<Me | null>(null);
export const useMe = () => useContext(MeContext)!;

const NAV: { to: string; label: string; icon: typeof Inbox; perm: Permission; end?: boolean; group?: string }[] = [
  { to: "/admin", label: "Overview", icon: BarChart3, perm: "overview", end: true },
  { to: "/admin/leads", label: "Leads", icon: Inbox, perm: "leads.read" },
  { to: "/admin/diagnostics", label: "Diagnostics", icon: ClipboardList, perm: "leads.read" },
  { to: "/admin/programmes", label: "Programmes", icon: BookOpen, perm: "content.edit", group: "Website" },
  { to: "/admin/portfolio", label: "Portfolio", icon: Briefcase, perm: "content.edit", group: "Website" },
  { to: "/admin/leadership", label: "Leadership", icon: UserRound, perm: "content.edit", group: "Website" },
  { to: "/admin/team", label: "Team", icon: Users, perm: "team.manage", group: "Settings" },
];

const Logo = () => (
  <img src={dchLogo} alt="Digital Creatives Hub" className="h-9 w-auto" style={{ filter: "hue-rotate(-2deg) saturate(0.58)" }} />
);

function Shell() {
  const me = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const logout = useMutation({
    mutationFn: adminApi.logout,
    onSettled: () => {
      qc.clear();
      navigate("/admin/login", { replace: true });
    },
  });
  const nav = NAV.filter((n) => can(me.role, n.perm));

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-border/40 bg-card/30 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4 md:px-5 md:py-6">
          <Link to="/admin" aria-label="Dashboard home">
            <Logo />
          </Link>
          <span className="text-xs uppercase tracking-wide text-muted-foreground md:hidden">{ROLE_LABEL[me.role]}</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:px-3 md:pb-0">
          {nav.map(({ to, label, icon: Icon, end, group }, i) => (
            // A heading above each group, on the desktop sidebar only.
            <div key={to} className="contents">
              {group && group !== nav[i - 1]?.group && (
                <p className="hidden px-3 pb-1 pt-5 text-xs uppercase tracking-wide text-muted-foreground/70 md:block">{group}</p>
              )}
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-3 px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="hidden border-t border-border/40 p-4 md:block">
          <p className="truncate text-sm text-foreground">{me.name || me.email}</p>
          <p className="text-xs text-muted-foreground">{ROLE_LABEL[me.role]}</p>
          <button
            onClick={() => logout.mutate()}
            className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route index element={<Overview />} />
            {can(me.role, "leads.read") && (
              <>
                <Route path="leads" element={<LeadsList />} />
                <Route path="leads/:id" element={<LeadDetail />} />
                <Route path="diagnostics" element={<DiagnosticsList />} />
                <Route path="diagnostics/:id" element={<DiagnosticDetail />} />
              </>
            )}
            {can(me.role, "content.edit") && (
              <>
                <Route path="programmes" element={<Programmes />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="leadership" element={<Leadership />} />
              </>
            )}
            {can(me.role, "team.manage") && <Route path="team" element={<Team />} />}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
          <button
            onClick={() => logout.mutate()}
            className="mt-16 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:hidden"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </main>
    </div>
  );
}

function Guard() {
  const location = useLocation();
  const me = useQuery({ queryKey: ["admin", "me"], queryFn: adminApi.me, retry: false, staleTime: 60_000 });

  if (me.isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  if (me.error instanceof AdminApiError && me.error.status === 401)
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (me.error)
    return (
      <AuthFrame title="The dashboard can't load right now.">
        <p className="text-muted-foreground">{(me.error as Error).message}</p>
      </AuthFrame>
    );
  return (
    <MeContext.Provider value={me.data!.user}>
      <Shell />
    </MeContext.Provider>
  );
}

const AuthFrame = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
    <div className="blueprint-grid" />
    <div className="relative z-10 w-full max-w-md border border-border/60 bg-card/60 p-8">
      <Logo />
      <h1 className="font-display-refined mt-8 text-3xl text-foreground">{title}</h1>
      <div className="mt-4">{children}</div>
    </div>
  </div>
);

function Login() {
  const [email, setEmail] = useState("");
  const send = useMutation({ mutationFn: () => adminApi.login(email.trim()) });

  if (send.isSuccess)
    return (
      <AuthFrame title="Check your email.">
        <p className="text-muted-foreground">
          If <span className="text-foreground">{email.trim()}</span> is on the DCH team, a sign-in link is on its way. It works once, for 15
          minutes.
        </p>
        <button className="mt-6 text-sm text-muted-foreground hover:text-foreground" onClick={() => send.reset()}>
          Use a different email
        </button>
      </AuthFrame>
    );

  return (
    <AuthFrame title="Team sign-in">
      <p className="text-muted-foreground">We'll email you a link. No password needed.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          send.mutate();
        }}
      >
        <label htmlFor="admin-email" className="block text-sm font-medium text-foreground">
          Work email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full border border-border/60 bg-background/60 px-4 text-foreground focus:border-primary focus:outline-none"
        />
        {send.error && (
          <p role="alert" className="text-sm text-destructive">
            {(send.error as Error).message}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={send.isPending}>
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Email me a sign-in link"}
        </Button>
      </form>
    </AuthFrame>
  );
}

/**
 * The link from the email lands here with the token in the URL fragment, which
 * browsers never send to a server. Redeeming it waits for a click, so a mail
 * scanner that opens the link can't use it up first.
 */
function Verify() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const token = useRef(new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "");
  useEffect(() => {
    // Take the token out of the address bar and history.
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);
  const redeem = useMutation({
    mutationFn: () => adminApi.verify(token.current),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["admin"] });
      navigate("/admin", { replace: true });
    },
  });

  if (!token.current)
    return (
      <AuthFrame title="This link is incomplete.">
        <Link to="/admin/login" className="text-primary hover:underline">
          Ask for a new sign-in link
        </Link>
      </AuthFrame>
    );

  return (
    <AuthFrame title="Open the dashboard">
      <p className="text-muted-foreground">One click and you're in. This link works once.</p>
      {redeem.error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {(redeem.error as Error).message}{" "}
          <Link to="/admin/login" className="underline">
            Get a new link
          </Link>
        </p>
      )}
      <Button size="lg" className="mt-6 w-full" disabled={redeem.isPending || redeem.isError} onClick={() => redeem.mutate()}>
        {redeem.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </Button>
    </AuthFrame>
  );
}

const AdminApp = () => (
  <>
    <Helmet>
      <title>Dashboard · Digital Creatives Hub</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="verify" element={<Verify />} />
      <Route path="*" element={<Guard />} />
    </Routes>
  </>
);

export default AdminApp;
