import { Link } from "react-router-dom";

/** Mark: ink square, sun arc, horizon line. */
export function LogoMark({ className = "size-[34px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" className={className} aria-hidden="true" focusable="false">
      <rect width="34" height="34" rx="10" fill="var(--color-ink)" />
      <path d="M8 22a9 9 0 0 1 18 0z" fill="#F2B544" />
      <path d="M6 22h22" stroke="var(--color-paper)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 26.5h12" stroke="var(--color-paper)" strokeWidth="2.2" strokeLinecap="round" opacity=".45" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="mr-auto flex items-center gap-2.5 rounded-xl max-[374px]:gap-2" aria-label="Second Take home">
      <LogoMark />
      <span
        className="whitespace-nowrap font-serif text-[19px] font-semibold tracking-[-0.01em] text-ink max-[374px]:text-[17px]"
        style={{ fontVariationSettings: '"opsz" 36, "SOFT" 100' }}
      >
        Second Take
      </span>
    </Link>
  );
}
