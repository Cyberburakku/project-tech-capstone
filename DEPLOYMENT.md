# Deployment Guide

Second Take is a static single-page app. It deploys to **Vercel** in a few minutes.

## 1. Put the code on GitHub

This project currently lives in the `project-tech-capstone/` folder of this repository.

**Option A: deploy from this repository.** Nothing to move. In Vercel, set **Root Directory** to `project-tech-capstone`.

**Option B: make it its own repository** (for example `project-tech-capstone`):

```bash
# From the parent repository
git subtree split --prefix project-tech-capstone -b project-tech-only
mkdir ../project-tech-capstone && cd ../project-tech-capstone
git init && git pull ../jayflow-recovery-hub project-tech-only

# With the GitHub CLI
gh repo create project-tech-capstone --public --source=. --push
```

The standalone repo already includes `.github/workflows/ci.yml`.

## 2. Deploy to Vercel

1. Go to https://vercel.com/new and import the repository.
2. Settings:
   - **Framework preset:** Vite (auto-detected)
   - **Root Directory:** `project-tech-capstone` (Option A only)
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

- In this repository: `.github/workflows/project-tech-ci.yml` (at the repo root, runs only when this folder changes)
- As a standalone repository: `project-tech-capstone/.github/workflows/ci.yml`

Vercel's GitHub integration creates a preview deployment for every pull request automatically.

## 5. Launch checklist

- [ ] `npm run build` passes locally
- [ ] Supabase migrations ran; `select public.admin_stats();` returns JSON
- [ ] Only the **anon** key is in Vercel (never `service_role`)
- [ ] Tested the check-in → lesson → certificate flow on a phone
- [ ] 988 and 211 links dial on mobile
- [ ] Re-verified resource phone numbers and websites
- [ ] `/admin-demo` is not linked anywhere public
