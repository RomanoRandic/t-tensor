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
