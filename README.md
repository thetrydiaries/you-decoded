# You, Decoded ✨

A personality passport. Eighteen lenses, one you — astrology, MBTI, Enneagram, Human Design, BaZi and more, decoded into a single shareable page. For fun, not fate.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Postgres) · Anthropic API (`claude-sonnet-4-6`)

## How it works

1. **Intake** — birth date, time & place, then a ~24-question quiz.
2. **Decode** — 8 modalities computed from birth data, 7 scored from the quiz, 3 synthesized by Claude (Shadow Profile, Core Gift, Cosmic Headline), plus an overall "Common Threads" summary.
3. **Passport** — one results page at `/p/{share-slug}`, with a custom OG card for sharing.

No accounts. A passport is reachable only by its unguessable slug, and all data access goes through the Next.js server (Supabase service role; RLS denies everything else).

## Setup

1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in:
   - Supabase URL + service-role key (dashboard → Project Settings → API)
   - Anthropic API key
3. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (or `supabase db push`).
4. `npm run dev`

## Deploy (Vercel)

Add the same four env vars in Vercel → Project → Settings → Environment Variables, with `NEXT_PUBLIC_APP_URL` set to your production domain. Push to deploy.

## Project map

```
app/                  pages (landing, /intake, /p/[slug] to come)
lib/types.ts          Passport, ModalityResult, BirthData
lib/constants/        the 18-modality registry (single source of truth)
lib/supabase/         server-only service-role client
lib/anthropic.ts      Claude client + model constant
supabase/migrations/  schema
```

> **Disclaimer:** You, Decoded is entertainment — not psychological, medical, or astrological advice.
# you-decoded
