-- You, Decoded — initial schema
-- Run in the Supabase SQL editor, or via `supabase db push`.

-- One row per passport. No accounts: a passport is reachable only by
-- its unguessable share_slug, and only through the Next.js server
-- (service role). RLS is enabled with NO policies, so the anon key
-- can read/write nothing even if it leaks.

create table public.passports (
  id            uuid primary key default gen_random_uuid(),

  -- public identifier used in share URLs: /p/{share_slug}
  share_slug    text not null unique,

  -- intake step 1
  first_name    text,
  birth_date    date not null,
  birth_time    time,                 -- nullable: rising sign / HD degrade gracefully
  birth_place   text not null,
  birth_lat     double precision,
  birth_lng     double precision,
  birth_tz      text,                 -- IANA timezone, e.g. 'Australia/Melbourne'

  -- intake step 2: raw quiz answers keyed by question id
  quiz_answers  jsonb,

  -- results, keyed by modality id (see lib/constants/modalities.ts)
  computed_results jsonb,             -- 8 birth-data modalities
  quiz_results     jsonb,             -- 7 quiz modalities
  ai_results       jsonb,             -- shadow_profile, core_gift, cosmic_headline
  overall_summary  text,              -- "Common Threads" synthesis

  -- where this passport is in its journey
  -- 'error' = decode pipeline failed; stops the poller from retrying indefinitely
  status        text not null default 'intake'
                check (status in ('intake', 'quiz', 'decoding', 'complete', 'error')),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Look-ups are always by share_slug (the unique index covers that).
-- Useful for ops dashboards / cleanup jobs:
create index passports_created_at_idx on public.passports (created_at desc);
create index passports_status_idx on public.passports (status);

-- Keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger passports_touch_updated_at
  before update on public.passports
  for each row execute function public.touch_updated_at();

-- Lock it down: RLS on, no policies. Only the service role
-- (used exclusively server-side in Next.js) can touch this table.
alter table public.passports enable row level security;
