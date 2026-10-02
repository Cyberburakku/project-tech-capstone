# Second Take

Second Take is a free, mobile-first reentry coach that helps people get ready for life after incarceration.
It walks each learner from a 3-minute readiness check-in to a personalized
learning path, trusted Maine resources, and downloadable certificates.

It is designed to feel like Duolingo or Headspace, not a government form: hopeful, structured, and judgment-free.

---

## The learner journey

```
Welcome → Readiness Check-in (10 questions) → Readiness Snapshot → Top Priority
→ Today's Mission → Lesson → Activity → Reflection → Mentor Story
→ Recommended Resource → Progress Tracking → Certificate
```

| Step | What happens |
| --- | --- |
| **Welcome** | Friendly intro. Asks only for a first name and a Maine county. No login. |
| **Check-in** | 10 questions across 5 areas. One question per screen, keyboard friendly, saves as you go. |
| **Snapshot** | 5 scores (0–100) plus an overall score on an animated radial chart. Shows top strength and top opportunity. |
| **Today's Mission** | Exactly one mission (for example, *Learn Smartphone Basics · 5 minutes*). |
| **Learning path** | Duolingo-style trail. Only one lesson is unlocked at a time; future lessons stay locked. |
| **Lesson** | Lesson → activity (quiz, checklist, or story builder) → reflection → "Someone Who Walked This Path" mentor story. |
| **Resources** | Only the top 3 matches from the Maine resource database, each with a concrete first step. |
| **Progress** | Lessons, reflections, modules, streak, and readiness change between check-ins. |
| **Certificate** | Branded PDF per module with name, module, date, and skills demonstrated, plus a celebration. |

Help is one tap away on every page: the **Help now** pill in the header opens a sheet with 988, the
Crisis Text Line (741741), 211 Maine and 911. The home page also has a **Rough day?** card with 988 and 211.
**Settings** (the menu button) holds the dark mode and "Pause animations" switches.

## Design system

- **Look:** gouache/print illustrations of the Maine coast, a paper grain over the whole page, Fraunces headlines
  and Atkinson Hyperlegible body text (both OFL, bundled via Fontsource, no Google Fonts call).
- **Palette** (`src/index.css`): paper `#FBF6EE`, ink `#1E2B2F`, clay `#B4472A`, sage `#2C6A5C`, sun `#F2B544`,
  with a matching dark palette. Radii 12 / 18 / 28. The main button is a clay 3D press button.
- **Layout:** a phone app shell (max 430px, sticky header, bottom tabs: Home, My path, Near me, Progress)
  under 900px, and an editorial website layout at 900px and up. The installed app (`display-mode: standalone`)
  keeps the phone shell even on a tablet. Help and Settings are bottom sheets on phones, centered dialogs on the web.
- **Hero** (`src/components/home/HeroScene.tsx`): the painting is drawn through a WebGL shader: depth parallax
  from pointer, tilt or idle drift, sea ripple, sun glitter, god rays masked off the sun, grain, and a dusk
  grade for dark mode. It pauses offscreen, when the tab is hidden, or when motion is paused, and falls back to
  the static painting without WebGL.
- **Artwork** lives in `public/art/`; the PWA manifest and icons in `public/`.

## Features at a glance

- **Scoring engine** (`src/lib/scoring.ts`): Technology, Support Network, Employment, Community & Hope, and Resource Navigation scores, an overall score, top strength/opportunity, and module ordering.
- **3 modules, 13 lessons** (`src/data/modules.ts`): Technology (5), Support Network (4), Talking About Your Record (4). Each lesson has content, an activity, a reflection, and a mentor story.
- **Hope system**: 20 fictional mentor stories (`src/data/mentors.ts`) and 20 affirmations (`src/data/affirmations.ts`).
- **Resource matching engine** (`src/data/resources.ts`): 10 Maine organizations, ranked by the learner's first need, weakest areas, and county. Always returns exactly 3.
- **Second Take coach**: built-in coaching messages that run on the device (`src/lib/coach.ts`), plus an optional **Ask Second Take** AI chat powered by Claude through a Supabase Edge Function.
- **Progress + sync**: saved to `localStorage` and, when configured, to Supabase through an offline-safe retry queue.
- **Demo mode** at `/demo`: loads Jordan, a sample learner part-way through the journey, for presentations. Exit from the banner.
- **How we built it** at `/about`: the tech stack and the future roadmap.
- **Hidden admin dashboard** at `/admin-demo`: total assessments, module completion, and average readiness. Aggregates only, no personal data.
- **Dark mode** (`src/lib/theme.ts`, `.dark` tokens in `src/index.css`): every text/background pair meets WCAG AA in both themes. Certificates stay light so they print well.
- **Accessibility**: WCAG AA color contrast, skip link, sage focus rings, 44px+ tap targets, screen reader labels, keyboard-operable radio groups and dialogs (focus trap, Escape), and reduced motion (OS setting or the in-app "Pause animations" switch, which also freezes the hero shader). No content waits on an animation to appear.

## Privacy by design

We store **only a first name and a county**. The app never asks for date of birth, Social Security number,
criminal history, release dates, or medical information. Reflection text and story-builder answers stay on the device.
Supabase gets only the *fact* that a reflection was written (and its word count). Row Level Security lets the
browser insert rows but never read them back. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui (Radix) · React Router · Zustand · React Hook Form ·
Framer Motion · WebGL · Lucide icons · Supabase · jsPDF · Vitest · deploys to Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: add Supabase keys
npm run dev                  # http://localhost:5173
```

The app works fully **without** Supabase (everything stays in the browser). Add Supabase keys to turn on
program-wide stats.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run unit tests (scoring, path, resources, content) |
| `npm run lint` | ESLint |

## Project structure

```
project-tech-capstone/
├── src/
│   ├── App.tsx                 # routes (lazy-loaded pages)
│   ├── components/
│   │   ├── layout/             # AppShell, Header, MobileNav, CrisisBar, AffirmationTicker, Logo
│   │   ├── lesson/             # LessonContent, Activity (quiz / checklist / builder)
│   │   ├── shared/             # RadialScore, SecondTake coach, MentorStoryCard, ResourceCard, Celebration…
│   │   └── ui/                 # shadcn/ui components
│   ├── data/                   # assessment, modules, mentors, affirmations, resources (+ tests)
│   ├── lib/                    # scoring, progress, coach, certificate PDF, supabase, sync, admin stats
│   ├── pages/                  # Home, Start, Assessment, Results, Path, Lesson, Resources, Progress, Certificate, Privacy, Admin
│   ├── store/useAppStore.ts    # Zustand store (persisted to localStorage)
│   └── types.ts
├── supabase/
│   ├── migrations/             # schema, row level security, admin_stats()
│   ├── functions/second-take/  # optional Claude-powered coach
│   ├── seed.sql                # fictional demo data
│   └── config.toml
├── vercel.json · .env.example · .github/workflows/ci.yml
└── README.md · INSTALL.md · DEPLOYMENT.md · SUPABASE_SETUP.md
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Welcome (new visitors) or dashboard |
| `/start` | First name + county |
| `/assessment` | Readiness check-in |
| `/results` | Readiness Snapshot + Today's Mission |
| `/path` | Learning path |
| `/lesson/:lessonId` | Lesson flow |
| `/resources` | Top 3 resources |
| `/progress` | Progress, reflections journal, data controls |
| `/certificate/:moduleId` | Certificate + PDF download |
| `/privacy` | What we store and why |
| `/demo` | Demo mode with a sample learner |
| `/about` | How we built it + roadmap |
| `/admin-demo` | Hidden demo dashboard (not linked, `noindex`) |

## Content notes

- Mentor stories are **fictional composites**. No real people.
- Resource phone numbers and websites were checked in September 2026. Please re-verify before a live launch.
- "Know Your Rights" is general information, not legal advice. It points learners to Pine Tree Legal Assistance.

## More docs

- [INSTALL.md](./INSTALL.md): local setup
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md): database, security, and the AI coach
- [DEPLOYMENT.md](./DEPLOYMENT.md): GitHub + Vercel
