import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when real Supabase credentials are configured. */
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("your-project-ref") && !anonKey.includes("your-anon"),
);

/**
 * The app has no login. Rows are written with the anonymous key and a random
 * device id; Row Level Security (see supabase/migrations) only allows inserts
 * and the aggregate `admin_stats()` function — nobody can read rows back.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

/** "Ask Second Take" AI chat is on only when Supabase + the Edge Function are set up. */
export const isAiCoachEnabled =
  isSupabaseConfigured && import.meta.env.VITE_SECOND_TAKE_AI === "true";
