-- Paste this whole file into Supabase → SQL Editor → Run.
-- Safe on a reset: replaces the waitlist table with the schema the site expects.

drop table if exists public.waitlist;

create table public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (char_length(email) <= 254),
  condition text not null check (
    condition in (
      'Hypothyroidism',
      'Hashimoto''s',
      'Thyroid removed (thyroidectomy)',
      'Caring for someone with thyroid disease',
      'Other',
      'Prefer not to say'
    )
  ),
  location text not null check (char_length(location) between 2 and 80),
  would_pay text not null check (would_pay in ('yes', 'maybe', 'no')),
  consent_at timestamptz not null default now(),
  privacy_version text not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;
revoke all on table public.waitlist from anon, authenticated;

drop table if exists public.apk_downloads;

create table if not exists public.apk_stats (
  id int primary key default 1 check (id = 1),
  downloads bigint not null default 0
);

insert into public.apk_stats (id, downloads) values (1, 0)
on conflict (id) do nothing;

create or replace function public.bump_apk_downloads()
returns bigint
language sql
security definer
set search_path = public
as $$
  update public.apk_stats
  set downloads = downloads + 1
  where id = 1
  returning downloads;
$$;

alter table public.apk_stats enable row level security;
revoke all on table public.apk_stats from anon, authenticated;
revoke all on function public.bump_apk_downloads() from anon, authenticated;

notify pgrst, 'reload schema';
