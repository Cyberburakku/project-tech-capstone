# Deployment Guide

Second Take is a static single-page app. It deploys to **Vercel** in a few minutes.

## 1. The code on GitHub

The code lives in its own repository: https://github.com/Cyberburakku/project-tech-capstone

## 2. Deploy to Vercel

1. Go to https://vercel.com/new and import the repository.
2. Settings:
   - **Framework preset:** Vite (auto-detected)
   - **Root Directory:** leave blank (the app is at the top of the repo)
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. **Environment variables** (optional):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SECOND_TAKE_AI` = `true` (only after deploying the Edge Function)
4. Click **Deploy**.

`vercel.json` already handles:

- **SPA rewrites**, so deep links like `/lesson/tech-1` work on refresh
- **Security headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Long-term caching** for hashed files in `/assets`

Or use the CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## 3. Set up Supabase (optional)

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md), then add the two keys in Vercel and redeploy.

## 4. Continuous integration

GitHub Actions runs lint, type-check, tests, and a production build on every push and pull request:

- `.github/workflows/ci.yml`

Vercel's GitHub integration creates a preview deployment for every pull request automatically.

## 5. Launch checklist

- [ ] `npm run build` passes locally
- [ ] Supabase migrations ran; `select public.admin_stats();` returns JSON
- [ ] Only the **anon** key is in Vercel (never `service_role`)
- [ ] Tested the check-in → lesson → certificate flow on a phone
- [ ] 988 and 211 links dial on mobile
- [ ] Re-verified resource phone numbers and websites
- [ ] `/admin-demo` is not linked anywhere public
