/** Friendly hero illustration: a winding path toward a rising sun. */
export function PathIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 280" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3F7F5" />
          <stop offset="1" stopColor="#FFF4E3" />
        </linearGradient>
      </defs>
      <rect width="360" height="280" rx="32" fill="url(#sky)" />
      <circle cx="262" cy="92" r="44" fill="#FFBF69" />
      <g stroke="#FFBF69" strokeWidth="6" strokeLinecap="round">
        <path d="M262 22v14M318 44l-10 10M206 44l10 10M334 92h-14M204 92h-14" />
      </g>
      <path d="M0 200c60-30 120-40 180-20s120 20 180-10v110H0z" fill="#2EC4B6" opacity=".35" />
      <path d="M0 225c70-25 140-25 210-5s110 15 150 0v60H0z" fill="#2EC4B6" opacity=".6" />
      <path d="M150 280c10-40 40-60 70-80s60-40 70-70" stroke="#FFFBF5" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M150 280c10-40 40-60 70-80s60-40 70-70" stroke="#FF6B35" strokeWidth="4" strokeDasharray="2 14" fill="none" strokeLinecap="round" />
      <g transform="translate(88 150)">
        <circle cx="20" cy="0" r="12" fill="#264653" />
        <path d="M6 16h28l6 42H0z" fill="#FF6B35" />
        <path d="M8 58l-4 30M32 58l4 30" stroke="#264653" strokeWidth="7" strokeLinecap="round" />
        <path d="M34 22l18-14" stroke="#264653" strokeWidth="6" strokeLinecap="round" />
        <circle cx="54" cy="6" r="5" fill="#FFBF69" />
      </g>
      <g fill="#FFFBF5">
        <circle cx="60" cy="60" r="10" />
        <circle cx="74" cy="56" r="14" />
        <circle cx="90" cy="62" r="9" />
      </g>
    </svg>
  );
}
