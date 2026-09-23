import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Random UUID with a fallback for older browsers. */
export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}
