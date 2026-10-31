create table if not exists public.apk_downloads (
  id bigint generated always as identity primary key,
  source text not null check (source in ('hero', 'android')),
  created_at timestamptz not null default now()
);

alter table public.apk_downloads enable row level security;
revoke all on table public.apk_downloads from anon, authenticated;

notify pgrst, 'reload schema';
