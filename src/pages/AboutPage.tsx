import { Link } from "react-router-dom";
import {
  Atom,
  Bot,
  Braces,
  Building2,
  CheckCircle2,
  Database,
  GitBranch,
  Globe,
  Headphones,
  LayoutDashboard,
  MessageSquareQuote,
  PlayCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const STACK: { icon: LucideIcon; name: string; role: string }[] = [
  { icon: Atom, name: "React", role: "The screens and buttons" },
  { icon: Braces, name: "TypeScript", role: "Catches mistakes before users see them" },
  { icon: Database, name: "Supabase", role: "Secure database, ready to switch on" },
  { icon: Bot, name: "Claude Code", role: "AI pair-programmer that helped build it" },
  { icon: GitBranch, name: "GitHub", role: "Stores the code and every change" },
  { icon: Globe, name: "Vercel", role: "Puts the app online" },
];

const ROADMAP: { phase: string; title: string; now?: boolean; items: { icon: LucideIcon; text: string }[] }[] = [
  { phase: "Phase 1", title: "Current MVP", now: true, items: [{ icon: CheckCircle2, text: "Check-in, path, resources, certificates" }] },
  {
    phase: "Phase 2",
    title: "Listen and learn",
    items: [
      { icon: Headphones, text: "Audio learning" },
      { icon: MessageSquareQuote, text: "Testimonials" },
    ],
  },
  {
    phase: "Phase 3",
    title: "More support",
    items: [
      { icon: LayoutDashboard, text: "Caseworker dashboard" },
      { icon: Users, text: "Peer mentorship" },
    ],
  },
  { phase: "Phase 4", title: "Scale", items: [{ icon: Building2, text: "Maine DOC deployment" }] },
];

/** Presentation support: the tech stack and the road ahead, kept simple. */
export default function AboutPage() {
  return (
    <div className="container-app max-w-3xl">
      <PageHeader eyebrow="Behind the app" title="How We Built Project T.E.C.H." />

      <blockquote className="rounded-3xl bg-ink p-6 text-paper sm:p-8 dark:border dark:border-line dark:bg-card dark:text-ink">
        <p className="font-serif text-2xl leading-snug sm:text-3xl">
          Most reentry programs provide information.
          <br />
          <span className="text-sun">Project T.E.C.H. provides a personalized path forward.</span>
        </p>
        <p className="mt-3 text-sm text-paper/80 dark:text-ink-2">Second Take is the coach inside Project T.E.C.H.</p>
      </blockquote>

      <section aria-labelledby="stack-h" className="mt-10">
        <h2 id="stack-h" className="text-2xl text-ink">Built with</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STACK.map(({ icon: Icon, name, role }) => (
            <li key={name} className="rounded-3xl border border-line bg-card p-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary-dark">
                <Icon aria-hidden className="size-6" />
              </span>
              <p className="mt-3 text-lg font-bold text-ink">{name}</p>
              <p className="text-sm text-ink-2">{role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="roadmap-h" className="mt-10">
        <h2 id="roadmap-h" className="text-2xl text-ink">What's next</h2>
        <ol className="mt-4 space-y-3">
          {ROADMAP.map((p) => (
            <li
              key={p.phase}
              className={cn(
                "flex gap-4 rounded-3xl border bg-card p-4",
                p.now ? "border-2 border-sage" : "border-line",
              )}
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-full text-sm font-extrabold",
                  p.now ? "bg-sage text-paper" : "bg-muted text-ink-2",
                )}
              >
                {p.phase.slice(-1)}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-2">
                  {p.phase}
                  {p.now && <span className="ml-2 rounded-full bg-sage-soft px-2 py-0.5 text-primary-dark">Now</span>}
                </p>
                <p className="text-lg font-bold text-ink">{p.title}</p>
                <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {p.items.map(({ icon: Icon, text }) => (
                    <li key={text} className="inline-flex items-center gap-1.5 text-sm text-ink">
                      <Icon aria-hidden className="size-4 text-primary-dark" /> {text}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link to="/demo">
            <PlayCircle aria-hidden /> Open demo mode
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
