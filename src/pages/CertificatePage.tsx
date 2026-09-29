import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotionConfig } from "framer-motion";
import { ArrowLeft, Award, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Celebration } from "@/components/shared/Celebration";
import { CoachMessage } from "@/components/shared/SecondTake";
import { LogoMark } from "@/components/layout/Logo";
import { useAppStore } from "@/store/useAppStore";
import { getModule } from "@/data/modules";
import { moduleProgress } from "@/lib/progress";
import { downloadCertificate, moduleSkills } from "@/lib/certificate";
import { formatDate } from "@/lib/utils";
import type { ModuleId } from "@/types";

export default function CertificatePage() {
  const { moduleId = "" } = useParams();
  const module = getModule(moduleId as ModuleId);
  const profile = useAppStore((s) => s.profile)!;
  const completed = useAppStore((s) => s.completedLessons);
  const certificate = useAppStore((s) => (module ? s.certificates[module.id] : undefined));
  const issueCertificate = useAppStore((s) => s.issueCertificate);
  const reduce = useReducedMotionConfig();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isComplete = module ? moduleProgress(module.id, completed).isComplete : false;

  useEffect(() => {
    if (module && isComplete && !certificate) issueCertificate(module.id);
  }, [module, isComplete, certificate, issueCertificate]);

  if (!module) return <Navigate to="/progress" replace />;

  if (!isComplete) {
    const mp = moduleProgress(module.id, completed);
    return (
      <div className="container-app max-w-xl pt-12 text-center">
        <Award aria-hidden className="mx-auto size-16 text-ink-soft" />
        <h1 className="mt-4 text-2xl font-extrabold text-ink">Almost there!</h1>
        <p className="mt-2 text-ink-soft">
          Finish all {mp.total} lessons in {module.title} to earn this certificate. You've done {mp.done} so far.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/path">Keep going</Link>
        </Button>
      </div>
    );
  }

  const issuedAt = certificate?.issuedAt ?? new Date().toISOString();
  const code = certificate?.code ?? "";

  const onDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      await downloadCertificate({ name: profile.firstName, module, issuedAt, code });
    } catch {
      setError("Sorry — the download didn't work. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container-app max-w-4xl pt-6">
      <Celebration pieces={80} />
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/progress">
          <ArrowLeft aria-hidden /> Back to progress
        </Link>
      </Button>

      <CoachMessage className="mb-6">
        {profile.firstName}, you did this. Not luck — work. Download your certificate and show it with pride.
      </CoachMessage>

      <motion.section
        initial={reduce ? false : { scale: 0.94, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        aria-labelledby="cert-title"
        className="relative overflow-hidden rounded-3xl border-[10px] border-primary bg-cream p-2 shadow-lift"
      >
        <div className="rounded-2xl border-2 border-achievement px-6 py-10 text-center sm:px-12">
          <div className="flex flex-col items-center">
            <LogoMark className="size-12" />
            <p className="mt-2 text-sm font-extrabold tracking-[0.2em] text-ink">SECOND TAKE</p>
            <p className="text-[10px] font-semibold tracking-widest text-primary-dark">
              YOUR REENTRY COACH
            </p>
          </div>
          <h1 id="cert-title" className="mt-6 text-3xl font-extrabold text-ink sm:text-4xl">
            Certificate of Completion
          </h1>
          <p className="mt-3 text-ink-soft">This certifies that</p>
          <p className="mx-auto mt-2 inline-block border-b-4 border-action px-6 pb-1 text-4xl font-extrabold text-primary-dark sm:text-5xl">
            {profile.firstName}
          </p>
          <p className="mt-4 text-ink-soft">has successfully completed the module</p>
          <p className="mt-1 text-2xl font-bold text-ink">{module.title}</p>

          <h2 className="mt-6 text-xs font-bold tracking-widest text-primary-dark">SKILLS DEMONSTRATED</h2>
          <ul className="mx-auto mt-3 grid max-w-2xl gap-x-6 gap-y-1.5 text-left text-sm text-ink sm:grid-cols-2">
            {moduleSkills(module).map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-action" aria-hidden />
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
            <div>
              <p className="font-bold text-ink">{formatDate(issuedAt)}</p>
              <p className="text-ink-soft">Date</p>
            </div>
            <span className="flex size-16 flex-col items-center justify-center rounded-full bg-achievement text-[9px] font-extrabold leading-tight text-on-bright ring-4 ring-action/60 ring-offset-2 ring-offset-cream">
              <span>MODULE</span>
              <span>COMPLETE</span>
            </span>
            <div>
              <p className="font-bold text-ink">Second Take</p>
              <p className="text-ink-soft">Your Reentry Coach</p>
            </div>
          </div>
          {code && <p className="mt-6 text-xs text-ink-soft">Certificate ID: {code}</p>}
        </div>
      </motion.section>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Button size="lg" onClick={onDownload} disabled={downloading}>
          {downloading ? <Loader2 aria-hidden className="animate-spin" /> : <Download aria-hidden />}
          {downloading ? "Preparing PDF…" : "Download PDF certificate"}
        </Button>
        {error && (
          <p role="alert" className="text-sm font-semibold text-crisis-dark">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
