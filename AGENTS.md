# AGENTS.md — Undangan Digital (demo v1)

Instructions for any AI coding agent working in this repository.

## Source of truth

- **Requirements:** `docs/PRD.md` (exported from the PRD document). Read it fully before starting a milestone.
- **Visual reference:** `docs/design/modern/cover.html`, `mempelai.html`, `acara.html` are static HTML of the three approved screens. Open them at 390px width and match spacing, type and colors. Photo boxes in them are placeholders.
- **Anything the PRD does not cover:** choose the simplest option that fits the PRD, then log it in `docs/decisions.md` as `date | decision | reason`.

## How to work

- Work milestone by milestone (M0 to M11 in the PRD), in order, one branch per milestone (for example `m3-invitation-page`).
- A milestone is done only when every acceptance criterion in the PRD passes. In the PR description, list each criterion and how you verified it.
- Do not start the next milestone on the same branch. Keep changes inside the current milestone's scope.
- Do not build anything listed under "Tidak masuk demo v1" in the PRD.
- Never invent or download licensed assets (music, photos, fonts outside Google Fonts). Use placeholders until Jovan puts files in `public/music/` and `public/demo/`.

## Stack

- Next.js (App Router, latest stable), TypeScript `strict`, Tailwind CSS.
- Supabase: Postgres + Storage, local development with the Supabase CLI.
- Zod for validation, Vitest for unit tests, Playwright for end-to-end tests.
- Hosting on Vercel. Package manager: pnpm.

## Commands

```
pnpm install
pnpm dev            # local app
pnpm lint
pnpm typecheck
pnpm test           # Vitest
pnpm test:e2e       # Playwright
supabase start      # local Postgres + Storage
supabase db reset   # apply migrations + seed (raka-sekar demo)
```

## Architecture rules

- All database and storage access goes through server-only code (`lib/supabase/server.ts` with `import "server-only"`) using the service role key. Never ship that key to the browser and never create a browser Supabase client that can read or write data.
- RLS is enabled on every table with no policies for `anon`.
- The browser loads photos from public Storage URLs and uploads through signed upload URLs issued by the server. Nothing else talks to Supabase from the client.
- Edit tokens: 32 random bytes, base64url. Store only the SHA-256 hash. Compare in constant time.
- Event `content` is JSONB, validated with the Zod schemas in `lib/schema/` on every write.
- Feature limits are checked only through `can(event, feature)` in `lib/plans.ts`. Limit values live in one config file.
- Themes live in `themes/<themeId>/`. Section order per event type lives in `lib/event-types.ts`. Section components receive validated content as props and never fetch data themselves.
- Bantu Tulis (AI) runs only on the server through `lib/ai/`. Provider, key and model come from env vars. Quotas are enforced server-side.

## UI and copy

- All user-facing text is in Bahasa Indonesia, sentence case, with verbs that say what happens ("Buka undangan", "Simpan ke kalender", "Publikasikan").
- Use the design tokens from the PRD as CSS variables. No hard-coded colors inside components.
- Mobile-first at 390px. Touch targets at least 44px. Icons are outline SVG, never emoji.
- Respect `prefers-reduced-motion`: no animation when it is set.
- Dates as "Sabtu, 15 Mei 2027", times as "08.00 WIB".
- The guest name from `?to=` is plain text, trimmed to 60 characters.

## Security and privacy

- Invitation pages send `noindex, nofollow` in a meta tag and the `X-Robots-Tag` header.
- Treat every guest input as untrusted and render it as text, never HTML.
- Never log edit tokens, raw IP addresses or guest messages. Hash IPs with `IP_HASH_SALT`.
- No third-party analytics or trackers on invitation pages.

## Definition of done for every milestone

- `pnpm lint`, `pnpm typecheck` and `pnpm test` pass; Playwright tests for the flows you touched pass.
- Every acceptance criterion of the milestone is verified and listed in the PR description.
- UI milestones include screenshots at 390px width in the PR description.
- `.env.example` is updated whenever a new environment variable is added.
