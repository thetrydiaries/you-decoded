-- Add 'processing' to the passport status check constraint.
-- This intermediate status is set atomically before the Claude decode begins
-- so that only one Vercel serverless instance can run the decode pipeline at
-- a time (the others see 'processing' and return "pending" immediately).
--
-- Run in the Supabase SQL editor, or via `supabase db push`.

alter table public.passports
  drop constraint if exists passports_status_check;

alter table public.passports
  add constraint passports_status_check
    check (status in ('intake', 'quiz', 'decoding', 'processing', 'complete', 'error'));
