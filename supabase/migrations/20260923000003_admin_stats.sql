-- Aggregate statistics for the demo admin dashboard.
-- Returns counts and averages only — never names, counties, or row-level data.

create or replace function public.admin_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  with latest as (
    select distinct on (user_id) *
    from public.assessments
    order by user_id, taken_at desc
  ),
  firsts as (
    select distinct on (user_id) user_id, overall
    from public.assessments
    order by user_id, taken_at asc
  ),
  improvement as (
    select avg(l.overall - f.overall)::numeric(6,1) as avg_gain
    from latest l
    join firsts f using (user_id)
    where l.id <> (select id from public.assessments a where a.user_id = l.user_id order by taken_at asc limit 1)
  ),
  module_counts as (
    select module_id, count(*) as lessons_done, count(distinct user_id) as learners
    from public.lesson_progress
    group by module_id
  ),
  module_totals(module_id, lesson_count) as (
    values ('technology', 5), ('support-network', 4), ('talking-about-your-record', 4)
  ),
  completions as (
    select lp.module_id, count(*) as completed_learners
    from (
      select user_id, module_id, count(*) as n
      from public.lesson_progress
      group by user_id, module_id
    ) lp
    join module_totals mt using (module_id)
    where lp.n >= mt.lesson_count
    group by lp.module_id
  )
  select json_build_object(
    'total_learners',      (select count(*) from public.users),
    'total_assessments',   (select count(*) from public.assessments),
    'average_overall',     (select coalesce(round(avg(overall)), 0) from latest),
    'average_by_category', json_build_object(
        'technology', (select coalesce(round(avg(technology)), 0) from latest),
        'support',    (select coalesce(round(avg(support)), 0)    from latest),
        'employment', (select coalesce(round(avg(employment)), 0) from latest),
        'hope',       (select coalesce(round(avg(hope)), 0)       from latest),
        'resources',  (select coalesce(round(avg(resources)), 0)  from latest)
    ),
    'average_improvement', (select coalesce(avg_gain, 0) from improvement),
    'lessons_completed',   (select count(*) from public.lesson_progress),
    'reflections_written', (select count(*) from public.reflections),
    'certificates_issued', (select count(*) from public.certificates),
    'modules', (
      select coalesce(json_agg(json_build_object(
        'module_id', mt.module_id,
        'learners_started', coalesce(mc.learners, 0),
        'learners_completed', coalesce(c.completed_learners, 0),
        'lessons_done', coalesce(mc.lessons_done, 0)
      ) order by mt.module_id), '[]'::json)
      from module_totals mt
      left join module_counts mc using (module_id)
      left join completions c using (module_id)
    ),
    'top_opportunities', (
      select coalesce(json_object_agg(top_opportunity, n), '{}'::json)
      from (select top_opportunity, count(*) n from latest group by top_opportunity) t
    ),
    'top_resources', (
      select coalesce(json_agg(json_build_object('resource_id', resource_id, 'count', n) order by n desc), '[]'::json)
      from (
        select resource_id, count(*) n from public.resource_recommendations
        group by resource_id order by n desc limit 5
      ) r
    )
  );
$$;

revoke all on function public.admin_stats() from public;
grant execute on function public.admin_stats() to anon, authenticated;
