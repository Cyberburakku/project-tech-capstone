# Supabase Setup

Supabase is **optional**. Without it, the app keeps everything in the learner's browser. With it, you get
program-wide numbers on the admin dashboard, plus the optional AI coach.

## 1. Create a project

1. Go to https://supabase.com and create a new project.
2. Open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

Never put the `service_role` key in the app.

## 2. Run the migrations

**Option A: SQL editor (easiest).** Open **SQL Editor** and run these files in order:

1. `supabase/migrations/20260923000001_initial_schema.sql`
2. `supabase/migrations/20260923000002_row_level_security.sql`
3. `supabase/migrations/20260923000003_admin_stats.sql`
4. Optional: `supabase/seed.sql` (24 fictional demo learners for the dashboard)

**Option B: Supabase CLI.**

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                 # runs the migrations
psql "<connection string>" -f supabase/seed.sql   # optional demo data
```

For local development, `supabase start` then `supabase db reset` loads the migrations and seed.

## 3. Schema

| Table | What it holds |
| --- | --- |
| `users` | Random device id, first name (1–40 chars), county (one of Maine's 16 counties, "Not sure yet", or "Outside Maine") |
| `assessments` | 5 category scores, overall score, top strength/opportunity, need tags, multiple-choice option ids, attempt number |
| `lesson_progress` | One row per completed lesson + activity score |
| `reflections` | **Only** that a reflection was written and its word count. The text never leaves the device. |
| `certificates` | Module id, certificate code, issue date |
| `resource_recommendations` | The top 3 resources shown after each check-in |

Every column has a check constraint, so bad data is rejected at the database.

### Data we never store

Date of birth, Social Security numbers, criminal history, release dates, medical information, or any other
sensitive personal data. **Please don't add columns for them.**

## 4. Security model

There is no login, so the browser uses the public anon key:

- `anon` can **insert** into all six tables.
- `anon` **cannot select, update, or delete** anything. Row Level Security is on, and table privileges are revoked.
- The admin dashboard calls `admin_stats()`, a `security definer` function that returns **aggregate numbers only**
  (counts and averages). No names, counties, or rows.

Test it in the SQL editor:

```sql
set role anon;
select * from public.users;          -- ERROR: permission denied
select public.admin_stats();         -- works, aggregates only
reset role;
```

> **Demo note:** because anyone can insert, a determined person could add junk rows. That's fine for a capstone demo.
> For production, add Supabase Auth (anonymous sign-ins), tie rows to `auth.uid()`, and add rate limiting.

## 5. How the app syncs

`src/store/useAppStore.ts` adds each event (profile, assessment, lesson, reflection, certificate, recommendations)
to a queue saved in `localStorage`. `src/lib/sync.ts` sends the queue in dependency order, treats duplicate-key
errors as success, drops rows that fail validation, and retries network errors when the connection comes back.

## 6. Optional: "Ask Second Take" AI coach

The AI chat runs in a Supabase Edge Function that calls Claude (Anthropic). Your API key stays on the server.

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set ALLOWED_ORIGIN=https://your-app.vercel.app   # optional, locks CORS to your site
supabase functions deploy second-take --no-verify-jwt
```

Then set `VITE_SECOND_TAKE_AI=true` in Vercel and redeploy. The chat card shows up on the dashboard.

What the function does:

- Uses `claude-opus-5` by default (change it with the `SECOND_TAKE_MODEL` secret) and turns on server-side refusal fallbacks.
- Uses a system prompt that keeps answers short, plain, hopeful, and judgment-free. It tells learners not to share
  sensitive details, sends crisis situations to 988/911, and says it gives general information, not legal advice.
- Keeps the last 12 turns (1,000 characters each), with a simple per-IP rate limit.
- Stores nothing. The conversation lives only in the browser tab.

Without the function, Second Take still works: its built-in messages are generated on the device.
