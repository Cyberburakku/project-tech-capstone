import { supabase } from "@/lib/supabase";

export type SyncTable =
  | "users"
  | "assessments"
  | "lesson_progress"
  | "reflections"
  | "certificates"
  | "resource_recommendations";

export interface SyncOp {
  id: string;
  table: SyncTable;
  row: Record<string, unknown>;
  attempts: number;
}

/** Tables must be inserted in dependency order (users first). */
const TABLE_ORDER: SyncTable[] = [
  "users",
  "assessments",
  "resource_recommendations",
  "lesson_progress",
  "reflections",
  "certificates",
];

const MAX_ATTEMPTS = 8;

/**
 * Send queued rows to Supabase. Returns the ops that still need to be retried.
 * A duplicate-key error (23505) means the row is already saved — treated as success.
 * Constraint/validation errors are dropped so a bad row can never block the queue.
 */
export async function flushQueue(queue: SyncOp[]): Promise<SyncOp[]> {
  if (!supabase || queue.length === 0) return queue;

  const sorted = [...queue].sort(
    (a, b) => TABLE_ORDER.indexOf(a.table) - TABLE_ORDER.indexOf(b.table),
  );
  const remaining: SyncOp[] = [];

  for (const op of sorted) {
    try {
      const { error } = await supabase.from(op.table).insert(op.row);
      if (!error || error.code === "23505") continue;
      const isDataError = error.code?.startsWith("22") || error.code?.startsWith("23");
      if (isDataError || op.attempts + 1 >= MAX_ATTEMPTS) {
        console.warn(`[sync] dropped ${op.table} row:`, error.message);
        continue;
      }
      remaining.push({ ...op, attempts: op.attempts + 1 });
    } catch {
      // Network failure (offline, etc.) — keep for next time.
      remaining.push({ ...op, attempts: op.attempts + 1 });
    }
  }
  return remaining;
}
