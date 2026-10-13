# Beh — Jordan & Rizza

A small, personal website where Jordan and Rizza plan their dates together around Davao City.

- **Day counter** since August 31, 2026, the day Jordan told Rizza how he feels
- **"We're official" button** that turns the counter into an anniversary counter whenever they're ready
- **Davao spin wheel** with local date ideas (Green Coffee Marfori, Roxas Night Market, Philippine Eagle Center, Samal, Shrine Hills, pet-friendly and quiet options…), filterable by mood, each with a small twist
- **Date booking** that both of them see, with a one-click Google Calendar invite for both emails
- **Memories**: mark a date as done, rate it in hearts, and leave a note
- **Days that matter**: birthday countdowns and small milestones
- **Photo album** link to the shared Google Drive folder

## Tech

- TanStack Start (React 19, file-based routing, server functions)
- Tailwind CSS 4
- Netlify Database (managed Postgres) with Drizzle ORM
- Deployed on Netlify

## Run locally

```bash
pnpm install
netlify dev
```

`netlify dev` gives you a local database too. Schema changes go in `db/schema.ts`, then run
`npx drizzle-kit generate --name <what_changed>`. Netlify applies migrations on deploy.

## Personalizing

Names, emails, birthdays, the start date, the album link and every spin-wheel idea live in `src/lib/us.ts`.
