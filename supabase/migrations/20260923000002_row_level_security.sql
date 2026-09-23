-- Row Level Security
-- The browser uses the public anon key and has NO login, so:
--   * anon may INSERT rows (write-only)
--   * anon may NOT select, update, or delete anything
--   * aggregate, PII-free numbers are exposed only through admin_stats()

alter table public.users                    enable row level security;
alter table public.assessments              enable row level security;
alter table public.lesson_progress          enable row level security;
alter table public.reflections              enable row level security;
alter table public.certificates             enable row level security;
alter table public.resource_recommendations enable row level security;

revoke all on public.users, public.assessments, public.lesson_progress, public.reflections,
  public.certificates, public.resource_recommendations from anon, authenticated;

grant insert on public.users, public.assessments, public.lesson_progress, public.reflections,
  public.certificates, public.resource_recommendations to anon, authenticated;

drop policy if exists "anon can insert users" on public.users;
create policy "anon can insert users" on public.users
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert assessments" on public.assessments;
create policy "anon can insert assessments" on public.assessments
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert lesson progress" on public.lesson_progress;
create policy "anon can insert lesson progress" on public.lesson_progress
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert reflections" on public.reflections;
create policy "anon can insert reflections" on public.reflections
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert certificates" on public.certificates;
create policy "anon can insert certificates" on public.certificates
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert resource recommendations" on public.resource_recommendations;
create policy "anon can insert resource recommendations" on public.resource_recommendations
  for insert to anon, authenticated with check (true);
