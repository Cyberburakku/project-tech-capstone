/* eslint-disable react-refresh/only-export-components -- avatar data and art live together */
/**
 * Illustrated avatars for the learner. Simple, warm portraits with the
 * brand palette (clay, sage, sun) as accents. No photos, no stock icon packs.
 */

export const AVATAR_STORAGE_KEY = "secondtake_avatar_id";

const INK = "#1E2B2F";
const CLAY = "#B4472A";
const CLAY_SOFT = "#F6E3D9";
const SAGE = "#2C6A5C";
const SAGE_SOFT = "#DDEBE4";
const SUN = "#F2B544";
const SUN_SOFT = "#F8DB9C";
const PAPER = "#FBF6EE";

type Hair =
  | "afro"
  | "long"
  | "shortGray"
  | "locsUp"
  | "hijab"
  | "short"
  | "crop"
  | "braid"
  | "curlyBun"
  | "beanie";

interface AvatarDef {
  id: string;
  label: string;
  skin: string;
  bg: string;
  shirt: string;
  hair: Hair;
  hairColor: string;
  beard?: boolean;
  glasses?: boolean;
}

export const AVATARS: AvatarDef[] = [
  { id: "sunrise", label: "Short natural hair, clay shirt", skin: "#6B4226", bg: SUN_SOFT, shirt: CLAY, hair: "afro", hairColor: "#1B1410" },
  { id: "harbor", label: "Long wavy hair, sage shirt", skin: "#C68642", bg: CLAY_SOFT, shirt: SAGE, hair: "long", hairColor: "#2B1B12" },
  { id: "pine", label: "Gray hair and beard, sun shirt", skin: "#F1C9A5", bg: SAGE_SOFT, shirt: SUN, hair: "shortGray", hairColor: "#B9B3A8", beard: true },
  { id: "lighthouse", label: "Locs tied up, sun shirt", skin: "#4A2E1C", bg: SAGE_SOFT, shirt: SUN, hair: "locsUp", hairColor: "#16110D" },
  { id: "meadow", label: "Sage head scarf, clay top", skin: "#9C6B43", bg: SUN_SOFT, shirt: CLAY, hair: "hijab", hairColor: SAGE },
  { id: "trail", label: "Short black hair and glasses, clay shirt", skin: "#E3B98C", bg: SAGE_SOFT, shirt: CLAY, hair: "short", hairColor: "#141414", glasses: true },
  { id: "ember", label: "Close-cropped hair and beard, sage shirt", skin: "#3B2417", bg: CLAY_SOFT, shirt: SAGE, hair: "crop", hairColor: "#120D0A", beard: true },
  { id: "cove", label: "Braid over the shoulder, sage shirt", skin: "#B07A4F", bg: SUN_SOFT, shirt: SAGE, hair: "braid", hairColor: "#24170F" },
  { id: "tide", label: "Curly auburn bun, clay shirt", skin: "#F4D3B5", bg: SAGE_SOFT, shirt: CLAY, hair: "curlyBun", hairColor: "#8A3B1F" },
  { id: "summit", label: "Knit cap, sage shirt", skin: "#7A4E2F", bg: CLAY_SOFT, shirt: SAGE, hair: "beanie", hairColor: CLAY },
];

export function getAvatar(id: string | null | undefined): AvatarDef | null {
  return AVATARS.find((a) => a.id === id) ?? null;
}

export function readAvatarId(): string | null {
  try {
    const id = localStorage.getItem(AVATAR_STORAGE_KEY);
    return getAvatar(id) ? id : null;
  } catch {
    return null;
  }
}

export function saveAvatarId(id: string) {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, id);
  } catch {
    // Storage blocked — the choice still applies for this visit.
  }
}

/** Hair drawn behind the head (long hair, afros, scarves, buns). */
function HairBack({ a }: { a: AvatarDef }) {
  const c = a.hairColor;
  switch (a.hair) {
    case "afro":
      return <circle cx="32" cy="23" r="15" fill={c} />;
    case "long":
      return <path d="M18.5 28c0-9.5 6-15 13.5-15s13.5 5.5 13.5 15v15.5c-3 2.2-6.4 2.2-8.5 0V31h-10v12.5c-2.1 2.2-5.5 2.2-8.5 0z" fill={c} />;
    case "locsUp":
      return (
        <g fill={c}>
          <ellipse cx="32" cy="11.5" rx="7" ry="5" />
          <rect x="29" y="12" width="6" height="6" rx="2" />
        </g>
      );
    case "hijab":
      return <path d="M17 31c0-10.5 6.7-18 15-18s15 7.5 15 18v14H17z" fill={c} />;
    case "braid":
      return (
        <g fill={c}>
          <path d="M41 25c3 4 3.5 9 2.5 13" stroke={c} strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="43.5" cy="40.5" r="2.4" fill={SUN} />
        </g>
      );
    case "curlyBun":
      return (
        <g fill={c}>
          <circle cx="32" cy="11" r="5.5" />
          <circle cx="28" cy="12.5" r="3.5" />
          <circle cx="36" cy="12.5" r="3.5" />
        </g>
      );
    default:
      return null;
  }
}

/** Hair and headwear drawn over the head. */
function HairFront({ a }: { a: AvatarDef }) {
  const c = a.hairColor;
  switch (a.hair) {
    case "afro":
      return <path d="M21 25c1.5-6 5.5-9 11-9s9.5 3 11 9c-3-2.5-6.8-3.6-11-3.6S24 22.5 21 25z" fill={c} />;
    case "long":
    case "braid":
    case "curlyBun":
      return <path d="M20.6 27c0-7.8 5-12.3 11.4-12.3S43.4 19.2 43.4 27c-2.2-4.3-6-6.4-11.4-6.4-3.5 0-6.4.9-8.4 2.8-1.2 1.1-2.1 2.3-3 3.6z" fill={c} />;
    case "shortGray":
    case "short":
      return <path d="M20.8 26c0-7.5 5-11.6 11.2-11.6s11.2 4.1 11.2 11.6c-1.8-3.6-5.4-5.6-11.2-5.6s-9.4 2-11.2 5.6z" fill={c} />;
    case "crop":
      return <path d="M21.4 24.5c1-6 5.2-9 10.6-9s9.6 3 10.6 9c-2.6-2.7-6.2-3.8-10.6-3.8s-8 1.1-10.6 3.8z" fill={c} />;
    case "locsUp":
      return (
        <g fill={c}>
          <path d="M21 26c0-7.4 4.9-11.3 11-11.3S43 18.6 43 26c-2.5-3.4-6.3-5.1-11-5.1s-8.5 1.7-11 5.1z" />
        </g>
      );
    case "hijab":
      // front drape around the face
      return (
        <path
          d="M17 31c0-10.5 6.7-18 15-18s15 7.5 15 18c0 3-.6 5.8-1.6 8.2H44c-1.8-3.4-2.6-6.7-2.6-10.4 0-6.2-4.2-10.3-9.4-10.3s-9.4 4.1-9.4 10.3c0 3.7-.8 7-2.6 10.4h-1.4C17.6 36.8 17 34 17 31z"
          fill={c}
        />
      );
    case "beanie":
      return (
        <g>
          <path d="M20 25.5c0-7.6 5.3-12.5 12-12.5s12 4.9 12 12.5z" fill={c} />
          <rect x="19" y="23" width="26" height="5" rx="2.5" fill={SUN} />
          <circle cx="32" cy="12" r="2.6" fill={SUN} />
        </g>
      );
    default:
      return null;
  }
}

/** Renders one avatar (or the neutral placeholder when `id` is unknown). */
export function AvatarArt({ id, className, title }: { id: string | null | undefined; className?: string; title?: string }) {
  const a = getAvatar(id);
  if (!a) {
    return (
      <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
        <circle cx="32" cy="32" r="32" fill="var(--color-paper-2)" />
        <circle cx="32" cy="26" r="10" fill="var(--color-ink-3)" opacity=".55" />
        <path d="M13 60c1.5-10.5 9.4-16 19-16s17.5 5.5 19 16a32 32 0 0 1-38 0z" fill="var(--color-ink-3)" opacity=".55" />
      </svg>
    );
  }
  const hideEars = a.hair === "hijab" || a.hair === "beanie";
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <clipPath id={`av-clip-${a.id}`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#av-clip-${a.id})`}>
        <rect width="64" height="64" fill={a.bg} />
        {/* small sun on the horizon, a nod to the brand mark */}
        <circle cx="50" cy="16" r="5" fill={SUN} opacity=".55" />
        <HairBack a={a} />
        {/* shoulders */}
        <path d="M10 66c0-12.5 9.6-20.5 22-20.5S54 53.5 54 66z" fill={a.shirt} />
        <path d="M26.5 45.8 32 51l5.5-5.2" stroke={PAPER} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7" />
        {/* neck */}
        <rect x="28.2" y="36" width="7.6" height="10" rx="3" fill={a.skin} />
        {/* ears */}
        {!hideEars && (
          <>
            <circle cx="20.8" cy="28.5" r="2.4" fill={a.skin} />
            <circle cx="43.2" cy="28.5" r="2.4" fill={a.skin} />
          </>
        )}
        {/* head */}
        <ellipse cx="32" cy="27.5" rx="11" ry="12" fill={a.skin} />
        {a.beard && (
          <path d="M21.4 29.5c.6 6.6 4.8 10.5 10.6 10.5s10-3.9 10.6-10.5c-2.2 2.6-5.6 3.8-10.6 3.8s-8.4-1.2-10.6-3.8z" fill={a.hairColor} />
        )}
        <HairFront a={a} />
        {/* face */}
        <circle cx="28" cy="28" r="1.25" fill={INK} />
        <circle cx="36" cy="28" r="1.25" fill={INK} />
        <path d="M28.6 32.6c1.9 1.7 4.9 1.7 6.8 0" stroke={a.beard ? PAPER : INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="25.4" cy="31.2" r="1.6" fill={CLAY} opacity=".22" />
        <circle cx="38.6" cy="31.2" r="1.6" fill={CLAY} opacity=".22" />
        {a.glasses && (
          <g stroke={INK} strokeWidth="1.2" fill="none">
            <circle cx="28" cy="28" r="3.3" />
            <circle cx="36" cy="28" r="3.3" />
            <path d="M31.3 28h1.4" />
          </g>
        )}
      </g>
    </svg>
  );
}
