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

create table if not exists public.apk_downloads (
  id bigint generated always as identity primary key,
  source text not null check (source in ('hero', 'android')),
  created_at timestamptz not null default now()
);

alter table public.apk_downloads enable row level security;
revoke all on table public.apk_downloads from anon, authenticated;

notify pgrst, 'reload schema';
