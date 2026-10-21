-- Newsletter consent from the Growth Diagnostic form. Off unless the person
-- ticks the box. Recorded with a timestamp so consent can be shown later.
alter table public.leads
  add column if not exists newsletter_opt_in boolean not null default false,
  add column if not exists newsletter_opt_in_at timestamptz;
