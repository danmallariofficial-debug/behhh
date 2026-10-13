# AGENTS.md

A personal date-planning site for Jordan and Rizza (callsign "Beh") in Davao City. It's one page, and it should stay simple, warm and genuine.

## Architecture

- **TanStack Start** single route: `src/routes/index.tsx` loads everything once via the `getLoveData` server function (the dates/settings query plus the bucket list and special days, in parallel) and then keeps `dates`/`officialSince`/`bucket`/`ourDays` in local state. Writes update that state optimistically or from the returned row. Don't add `router.invalidate()` back. For cross-device sync the page re-calls `getLoveData` when it becomes visible and every 60s while open; those calls are normally served from the CDN cache.
- **Tabs**: Home (Hero, SpinWheel, SpecialDays), Our dates (BookDate + upcoming), Little memories, Bucket list. Client-side, driven by the URL hash (`#dates`, `#memories`, `#bucket`).
- **Passcode gate** (`PasscodeGate.tsx`): code `0831`, remembered in localStorage `beh-pass`. `src/lib/look.ts` adds `locked` (and `dark`) to `<html>` from an inline script before paint, and again in a layout effect in `__root.tsx` because a client-render fallback after a hydration mismatch (Netlify injects og:image tags into `<head>`) wipes `<html>` classes; CSS in `styles.css` hides `#app` while locked. It's a friendly lock, not real security.
- **CDN caching** (`src/lib/cache.ts`): `getLoveData` sets `Netlify-CDN-Cache-Control` (durable, until Manila midnight) and the `love-data` cache tag on the page and its data. Every write server function must call `purgeLoveCache()`.
- **Edge guardrails** (`netlify.toml`): hashed `/assets/*` are cached as immutable, every response carries `X-Robots-Tag: noindex`, and a per-IP rate limit (300 requests/min) sits in front of the whole site. The SSR function catches every path that isn't a static file, so `public/` holds `robots.txt`, `favicon.ico` and `apple-touch-icon.png` to keep those automatic requests off it.
- **Server functions**: `src/server/dates.functions.ts` (zod-validated RPCs) → `src/server/dates.server.ts` (server-only Drizzle queries). Never import `*.server.ts` or `db/` from client components.
- **Database**: Netlify Database + Drizzle (`drizzle-orm@beta`). Schema is in `db/schema.ts`, migrations are in `netlify/database/migrations/` (generate with `npx drizzle-kit generate --name …`, never apply them by hand).
  - `dates`: booked dates. `day` is a `YYYY-MM-DD` string in Asia/Manila time, `time` is `HH:MM` or empty, and `status` is `planned | done`, with `memory` and `rating` (0–5 hearts) filled in when a date is done.
  - `dates.jordan_note` / `dates.rizza_note`: each person's sealed note on a memory, both shown only once both are written.
  - `bucket_items`: shared bucket list (`id` is the original idea slug or `own-<ts>`, `done`, ordered by `position`). The original ideas were seeded by a migration; `BUCKET` in `us.ts` is used to bring removed ones back.
  - `special_days`: days that matter added from the site (`emoji`, `label`, `day` as `YYYY-MM-DD`, `yearly`). Birthdays, the milestone and the anniversary are still computed in `SpecialDays.tsx`.
  - `settings`: key/value. `official_since` holds the anniversary date once they're official. Deleting it undoes the change.
- **Personal data and content**: `src/lib/us.ts` holds the names, emails, birthdays, start date (2026-08-31), album URL, Davao spin-wheel ideas and day-level date helpers.
- **Components** (`src/components/`): Hero (counter + official button), SpinWheel (SVG wheel + WhoPicks coin toss), BookDate (form), OurDates.tsx (`OurDates`: upcoming with Edit, which refills the BookDate form; `Memories`: inline "How was the date?" review, delete, sealed notes), BucketList (saved in the database), SpecialDays (countdowns, "Add a day" form for custom days, album link), ThemeToggle (dark mode, `.dark` on `<html>`, CSS variable overrides in `styles.css`).
- `src/lib/who.ts`: a "who am I" toggle saved in localStorage. It sets `bookedBy` and the greeting copy.

## Conventions and decisions

- The theme is lavender (Rizza's color, `lav-*`) and gray (Jordan's, `ash-*`), defined in `src/styles.css` `@theme`. Fonts are Fraunces (display), Nunito (body) and Caveat (handwritten).
- The owner asked for **no cost estimates**, **no share/connect buttons**, and to keep the anniversary button.
- There's no login on purpose. The site is for two people, and simplicity comes first.
- All date math is done on `YYYY-MM-DD` strings in Manila time, so nothing shifts with time zones.
