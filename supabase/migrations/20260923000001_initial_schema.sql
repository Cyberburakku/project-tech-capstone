-- Project T.E.C.H. — initial schema
-- Privacy by design: we store a first name and county only.
-- Never add columns for date of birth, SSN, criminal history, release dates,
-- medical information, or any other sensitive personal data.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users: anonymous learners identified by a random device id
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key,
  first_name  text not null check (char_length(btrim(first_name)) between 1 and 40),
  county      text not null check (county in (
                'Androscoggin','Aroostook','Cumberland','Franklin','Hancock','Kennebec',
                'Knox','Lincoln','Oxford','Penobscot','Piscataquis','Sagadahoc',
                'Somerset','Waldo','Washington','York','Not sure yet','Outside Maine')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- assessments: readiness scores (0–100) per category
-- ---------------------------------------------------------------------------
create table if not exists public.assessments (
  id               uuid primary key,
  user_id          uuid not null references public.users(id) on delete cascade,
  taken_at         timestamptz not null default now(),
  technology       smallint not null check (technology between 0 and 100),
  support          smallint not null check (support between 0 and 100),
  employment       smallint not null check (employment between 0 and 100),
  hope             smallint not null check (hope between 0 and 100),
  resources        smallint not null check (resources between 0 and 100),
  overall          smallint not null check (overall between 0 and 100),
  top_strength     text not null check (top_strength in ('technology','support','employment','hope','resources')),
  top_opportunity  text not null check (top_opportunity in ('technology','support','employment','hope','resources')),
  need_tags        text[] not null default '{}',
  -- multiple-choice option ids only (e.g. {"q1":"somewhat"}); no free text
  answers          jsonb not null default '{}'::jsonb,
  attempt          smallint not null default 1 check (attempt between 1 and 100)
);
create index if not exists assessments_user_idx on public.assessments(user_id, taken_at);

-- ---------------------------------------------------------------------------
-- lesson_progress: one row per completed lesson
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  lesson_id       text not null check (char_length(lesson_id) <= 40),
  module_id       text not null check (module_id in ('technology','support-network','talking-about-your-record')),
  activity_score  smallint check (activity_score between 0 and 100),
  completed_at    timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists lesson_progress_module_idx on public.lesson_progress(module_id);

-- ---------------------------------------------------------------------------
-- reflections: we track THAT a reflection was written, never the text.
-- Reflection text stays on the learner's device.
-- ---------------------------------------------------------------------------
create table if not exists public.reflections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  lesson_id   text not null check (char_length(lesson_id) <= 40),
  word_count  integer not null default 0 check (word_count between 0 and 5000),
  created_at  timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  module_id         text not null check (module_id in ('technology','support-network','talking-about-your-record')),
  certificate_code  text not null check (char_length(certificate_code) between 6 and 20),
  issued_at         timestamptz not null default now(),
  unique (user_id, module_id)
);

-- ---------------------------------------------------------------------------
-- resource_recommendations: top 3 matches shown after each assessment
-- ---------------------------------------------------------------------------
create table if not exists public.resource_recommendations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  resource_id    text not null check (char_length(resource_id) <= 60),
  rank           smallint not null check (rank between 1 and 10),
  match_score    numeric(6,2) not null default 0,
  created_at     timestamptz not null default now(),
  unique (assessment_id, resource_id)
);
create index if not exists resource_recs_resource_idx on public.resource_recommendations(resource_id);
