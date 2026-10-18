create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (char_length(email) <= 254),
  condition text not null check (
    condition in (
      'Hypothyroidism',
      'Hashimoto''s',
      'Thyroid removed (thyroidectomy)',
      'Caring for someone with thyroid disease',
      'Other'
    )
  ),
  location text not null check (char_length(location) between 2 and 80),
  would_pay text not null check (would_pay in ('yes', 'maybe', 'no')),
  created_at timestamptz not null default now()
);

-- No policies: only the server's secret key (which bypasses RLS) can read or write.
alter table public.waitlist enable row level security;
revoke all on table public.waitlist from anon, authenticated;
