-- Jewel Queen — Supabase Postgres Schema & Row-Level Security (RLS)
-- Paste into Supabase Dashboard -> SQL Editor -> Run once to enable
-- Facebook + Google SSO Cloud Vault Sync & the Collectors' Leaderboard.

create table if not exists public.collector_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Private Collector' check (char_length(display_name) <= 40),
  whatnot_handle text check (whatnot_handle is null or char_length(whatnot_handle) <= 32),
  avatar_url text,
  best_score integer not null default 0 check (best_score >= 0),
  estate_value bigint not null default 0 check (estate_value >= 0),
  owned_count integer not null default 0 check (owned_count >= 0 and owned_count <= 45),
  collection_counts jsonb not null default '{}'::jsonb,
  stage_stars jsonb not null default '{}'::jsonb,
  showcase_ids text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

create index if not exists idx_collector_profiles_estate_value
  on public.collector_profiles (estate_value desc, best_score desc);

-- Explicit Data API grants (paired with strict RLS below)
grant usage on schema public to anon, authenticated;
grant select on public.collector_profiles to anon, authenticated;
grant insert, update on public.collector_profiles to authenticated;

alter table public.collector_profiles enable row level security;

-- Anyone can read public collector profiles for the Collectors' Leaderboard
-- (Notice: no email or private PII is ever stored in this table!)
create policy "Public leaderboard profiles are viewable"
  on public.collector_profiles
  for select
  to anon, authenticated
  using (true);

-- Signed-in collectors can insert ONLY their own row
create policy "Collectors can create their own vault profile"
  on public.collector_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Signed-in collectors can update ONLY their own row (USING + WITH CHECK prevents ID reassignment)
create policy "Collectors can update their own vault profile"
  on public.collector_profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
