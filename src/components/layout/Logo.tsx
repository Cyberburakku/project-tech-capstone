import { Link } from "react-router-dom";

export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <rect width="64" height="64" rx="18" fill="#2EC4B6" />
      <path d="M16 42c7-15 25-15 32 0" stroke="#FFFBF5" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="24" r="7" fill="#FFBF69" />
      <path d="M32 9v4M20 14l3 3M44 14l-3 3" stroke="#FFBF69" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-xl" aria-label="Project T.E.C.H. home">
      <LogoMark />
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-tight text-ink">Project T.E.C.H.</span>
        <span className="block text-[11px] font-medium text-ink-soft">Tools • Education • Connectivity • Hope</span>
      </span>
    </Link>
  );
}
