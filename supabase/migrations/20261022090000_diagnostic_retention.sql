-- Retention for the Growth Diagnostic (privacy policy, section 5): diagnostic
-- answers and consent records are deleted or anonymised two years after the
-- person's last activity with us.
--
-- Option A: people still subscribed to the newsletter keep their email and
-- consent record, because the newsletter relies on them. Their answers and
-- notes are removed. Everyone else's records are deleted.
--
-- Run a dry run first. It only counts, and changes nothing:
--   select * from public.purge_stale_diagnostics(true);
-- Then run it for real:
--   select * from public.purge_stale_diagnostics(false);

create or replace function public.purge_stale_diagnostics(dry_run boolean default true)
returns table(group_name text, people bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  cutoff timestamptz := now() - interval '2 years';
begin
  drop table if exists pg_temp.stale_diagnostics;

  -- Last activity is the latest of: the answers being saved, the lead being
  -- updated, and any funnel step taken for that diagnostic.
  create temp table pg_temp.stale_diagnostics on commit drop as
  select
    dr.id as discovery_id,
    l.id as lead_id,
    coalesce(l.newsletter_opt_in, false) as subscribed
  from public.discovery_results dr
  left join public.leads l on l.discovery_id = dr.id
  where greatest(
    dr.updated_at,
    coalesce(l.updated_at, dr.updated_at),
    coalesce((select max(de.created_at) from public.diagnostic_events de where de.discovery_id = dr.id), dr.updated_at)
  ) < cutoff;

  if not dry_run then
    -- Still subscribed: remove the answers and notes, keep the email and consent.
    update public.discovery_results
       set answers = '{}'::jsonb, capability_gap = null
     where id in (select discovery_id from pg_temp.stale_diagnostics where subscribed);

    update public.leads
       set name = '', problem = ''
     where id in (select lead_id from pg_temp.stale_diagnostics where subscribed);

    delete from public.diagnostic_events
     where discovery_id in (select discovery_id from pg_temp.stale_diagnostics where subscribed);

    -- Not subscribed: delete the records outright.
    delete from public.diagnostic_events
     where discovery_id in (select discovery_id from pg_temp.stale_diagnostics where not subscribed);

    delete from public.leads
     where id in (select lead_id from pg_temp.stale_diagnostics where not subscribed);

    delete from public.discovery_results
     where id in (select discovery_id from pg_temp.stale_diagnostics where not subscribed);
  end if;

  return query
    select 'still subscribed: answers removed, email and consent kept'::text,
           count(*) filter (where subscribed)
      from pg_temp.stale_diagnostics;

  return query
    select 'not subscribed: records deleted'::text,
           count(*) filter (where not subscribed)
      from pg_temp.stale_diagnostics;
end;
$$;

-- Only the server (service role) may run this. Not the public or signed-in users.
revoke all on function public.purge_stale_diagnostics(boolean) from public, anon, authenticated;
grant execute on function public.purge_stale_diagnostics(boolean) to service_role;
