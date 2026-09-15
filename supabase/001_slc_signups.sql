-- Run once in the chosen Supabase project's SQL Editor.
-- No public read/write policies: only the server service-role key can insert.
create table if not exists public.slc_waitlist (
  email text primary key check (email = lower(email) and length(email) <= 254),
  interest text not null check (interest in ('all','love','escapes','wardrobe','society')),
  consent_text text not null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','unsubscribed'))
);
create table if not exists public.slc_partner_applications (
  id uuid primary key,
  email text not null,
  name text not null,
  organisation text not null,
  website text,
  interest text not null check (interest in ('all','love','escapes','wardrobe','society')),
  proposal text not null,
  consent_text text not null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','declined')),
  internal_notes text
);
alter table public.slc_waitlist enable row level security;
alter table public.slc_partner_applications enable row level security;
revoke all on public.slc_waitlist from anon, authenticated;
revoke all on public.slc_partner_applications from anon, authenticated;
grant select, insert, update, delete on public.slc_waitlist to service_role;
grant select, insert, update, delete on public.slc_partner_applications to service_role;
