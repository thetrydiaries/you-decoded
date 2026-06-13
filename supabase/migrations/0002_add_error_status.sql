-- Add 'error' to the passport status check constraint.
-- Run this in the Supabase SQL editor (or via `supabase db push`) to apply
-- the change to an existing database.

alter table public.passports
  drop constraint if exists passports_status_check;

alter table public.passports
  add constraint passports_status_check
    check (status in ('intake', 'quiz', 'decoding', 'complete', 'error'));
