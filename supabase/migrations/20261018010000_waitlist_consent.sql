alter table public.waitlist
  add column if not exists consent_at timestamptz,
  add column if not exists privacy_version text;

alter table public.waitlist drop constraint if exists waitlist_condition_check;
alter table public.waitlist add constraint waitlist_condition_check check (
  condition in (
    'Hypothyroidism',
    'Hashimoto''s',
    'Thyroid removed (thyroidectomy)',
    'Caring for someone with thyroid disease',
    'Other',
    'Prefer not to say'
  )
);

-- Rows collected before explicit consent existed have no consent record and should be deleted.
delete from public.waitlist where consent_at is null;

alter table public.waitlist
  alter column consent_at set not null,
  alter column privacy_version set not null;

notify pgrst, 'reload schema';
