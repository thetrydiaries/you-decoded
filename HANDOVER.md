# You, Decoded — Handover Notes
_Last updated: 13 June 2026_

---

## What's working

The full end-to-end flow is functional:

1. **Intake** — name, birth date/time/place → quiz (24 questions)
2. **Decode** — 8 birth-data modalities + 7 quiz modalities computed, then synthesised in a single Claude call (claude-sonnet-4-6, ~40s)
3. **Passport results page** — hero, Cosmic Headline, Common Threads summary, all 15 modality cards, Shadow Profile, Core Gift, footer

The app is at `http://localhost:3000`. Run with `npm run dev` from the `you decoded` folder.

---

## What was fixed this session

### Infinite decode loop (API waste)
**Problem:** Every page reload triggered a fresh Claude call because Next.js was caching the Supabase DB read, so the page always got stale `status="decoding"` even after decode completed.

**Fixes applied:**
- `unstable_noStore()` added to `getPassportBySlug()` in `app/actions/passport.ts`
- `export const dynamic = "force-dynamic"` on both `app/p/[slug]/page.tsx` and `app/api/decode/[slug]/route.ts`
- In-memory lock (`activeDecodes` Set) in the decode route — concurrent calls for the same slug return `{ status: "pending" }` immediately instead of spinning up another Claude call
- Decode failures now set `status = "error"` in the DB, which stops the poller permanently instead of leaving the passport stuck as `"decoding"` forever

**DB migration applied (0002_add_error_status.sql):**
```sql
ALTER TABLE public.passports DROP CONSTRAINT IF EXISTS passports_status_check;
ALTER TABLE public.passports ADD CONSTRAINT passports_status_check
  CHECK (status IN ('intake', 'quiz', 'decoding', 'complete', 'error'));
```

---

## What still needs to be done

### 1. Visual / UX audit of the results page
The passport results page was confirmed working but never fully scrolled through. Need to:
- Scroll through the full page and screenshot all sections
- Check: birth modality cards, quiz modality cards, "The deeper picture" section (Shadow Profile, Core Gift), footer
- Note any layout issues, truncated text, card spacing, mobile responsiveness

### 2. Sharing flow
- The share slug is in the URL (`/p/[slug]`) but there's no share button on the results page yet
- Need to add a "Share your passport" CTA that copies the URL or opens a share sheet

### 3. Mobile responsiveness
- Not yet tested on mobile viewport
- The quiz flow and results page both need a mobile pass

### 4. Empty/error states
- What happens if birth place geocoding fails? The modalities that depend on lat/lng should degrade gracefully — confirm this works
- The `"error"` status now shows an error screen with "Start over" — visually check this looks right

### 5. Production deployment
- App is local only — not yet deployed to Vercel
- Environment variables needed: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_APP_URL`
- The in-memory lock (`activeDecodes` Set) won't work across Vercel serverless instances — for production, replace with a DB-level lock (e.g. add a `decode_started_at` timestamp column; skip decode if set within the last 3 minutes)

### 6. Analytics / observability
- No tracking on how many passports are created, complete rate, error rate
- Worth adding basic Supabase dashboard views or a simple ops page

---

## Key files

| File | Purpose |
|------|---------|
| `app/actions/passport.ts` | `createPassport` + `getPassportBySlug` (server actions) |
| `app/api/decode/[slug]/route.ts` | Decode pipeline — compute + Claude synthesis + Supabase write |
| `lib/claude/synthesize.ts` | Claude prompt + JSON parsing for all 15 card summaries + AI modalities |
| `lib/engine/compute-birth.ts` | 8 birth-data calculators (astrology, numerology, BaZi, etc.) |
| `lib/engine/compute-quiz.ts` | 7 quiz scorers (MBTI, Enneagram, Big Five, etc.) |
| `app/p/[slug]/page.tsx` | Passport results page (server component) |
| `app/p/[slug]/DecodingPoller.tsx` | Client-side poller that triggers decode + polls for completion |
| `lib/constants/modalities.ts` | All 15 modality definitions |
| `supabase/migrations/` | DB schema — run 0001 for fresh setup, 0002 if upgrading existing DB |

---

## Supabase project
URL: `https://ruggptccimosduxbdaxn.supabase.co`  
Dashboard: https://supabase.com/dashboard/project/ruggptccimosduxbdaxn
