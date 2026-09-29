# Install Guide

This guide gets Second Take running on your computer in about 5 minutes.

## 1. What you need

- **Node.js 20 or newer** (22 recommended). Check with `node -v`.
- **npm** (comes with Node).
- Optional: a free [Supabase](https://supabase.com) account if you want program-wide stats.

## 2. Get the code

```bash
git clone <your-repo-url>
cd project-tech-capstone
```

## 3. Install packages

```bash
npm install
```

## 4. Environment variables (optional)

```bash
cp .env.example .env.local
```

| Variable | Needed? | What it is |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Optional | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Optional | Your Supabase **anon / public** key |
| `VITE_SECOND_TAKE_AI` | Optional | `true` shows the "Ask Second Take" AI chat (needs the Edge Function) |

Leave these blank and the app runs in **local-only mode**: all progress stays in the browser.

## 5. Run it

```bash
npm run dev
```

Open http://localhost:5173.

## 6. Check everything works

```bash
npm run lint
npm run typecheck
npm test
npm run build && npm run preview
```

## Try the full journey

1. Click **Get started**, and enter a first name and county.
2. Answer the 10 check-in questions.
3. Look at your Readiness Snapshot, then **Start my mission**.
4. Finish the lesson, activity, reflection, and mentor story.
5. Visit **Resources** and **Progress**.
6. Finish every lesson in a module to unlock the **certificate PDF**.
7. Visit `/admin-demo` to see the demo dashboard.

To start over, go to **Progress → Clear device data**.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Blank page after a deploy | Make sure the SPA rewrite in `vercel.json` is in place. |
| Admin page says "This device only" | Supabase keys are missing, or the migrations weren't run. |
| Nothing shows up in Supabase | Check the browser console for `[sync]` warnings, and confirm all three migrations ran. |
| Fonts look different | Poppins loads from Google Fonts. Offline, it falls back to the system font. |
