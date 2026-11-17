# JourneyFertility

A non-profit fertility guide and UK clinic comparison: React, Vite and Tailwind, hosted on
Netlify with Netlify Functions and Netlify Database (Postgres).

## How it fits together

| Part | Where |
| --- | --- |
| Pages and routes (React Router) | `src/app/App.tsx`, `src/app/pages/` |
| Clinic data, the source of truth | `src/app/data/clinics.ts` |
| Database schema | `netlify/database/migrations/` |
| Seed script | `db/seed.ts` |
| Search API (`GET /api/search`) | `netlify/functions/search.ts` |
| Shared search vocabulary (services, regions, budgets) | `src/app/lib/search.ts` |
| Country guidance sources (NICE, HFEA) | `src/config/countries.ts` |
| Placeholders and site identity | `src/app/lib/site.ts` |

Migrations live in `netlify/database/migrations/`, not `db/migrations/`: Netlify only applies
migrations automatically from that folder, during each deploy.

The old Vercel backend (`api/`, `src/server/`, `vercel.json`) is not used on Netlify and is kept
only for reference.

## Run it locally

```bash
npm install
npx netlify dev
```

`netlify dev` starts the site, the search function and a local Postgres database on
http://localhost:8888. The first time, and whenever a migration is added, apply migrations and
seed the local database while `netlify dev` is running:

```bash
npx netlify database migrations apply
NETLIFY_DB_URL="$(npx netlify database status --show-credentials --json | node -pe 'JSON.parse(require("fs").readFileSync(0)).database.connectionString')" npx tsx db/seed.ts
```

The seed is safe to re-run. It never invents a price: anything a clinic does not publish is
stored as `NULL` and shown as "Price not published".

## Deploy to Netlify

1. Sign in and link the repo: `npx netlify login`, then `npx netlify init` (or connect the GitHub
   repo in the Netlify UI). Build settings come from `netlify.toml`.
2. Provision the database: it is created automatically on the first deploy that includes
   `@netlify/database`, or from **Data & Storage > Database** in the Netlify UI. Netlify Database
   needs a credit-based plan. The database region defaults to the site's functions region; pick
   a UK or EU region before going live (see the privacy notice).
3. Deploy. Migrations in `netlify/database/migrations/` are applied automatically just before the
   deploy is published.
4. Seed production once, and again whenever `src/app/data/clinics.ts` changes:

   ```bash
   NETLIFY_DB_URL="$(npx netlify database status --branch production --show-credentials --json | node -pe 'JSON.parse(require("fs").readFileSync(0)).database.connectionString')" npx tsx db/seed.ts
   ```

5. Check the API:

   ```bash
   curl "https://<site>/api/search?service=ivf"
   curl -i "https://<site>/api/search?service=nope"   # expect 400
   ```

6. Point `journeyfertility.com` at Netlify (Domain management in the Netlify UI). The DNS is at
   GoDaddy and currently points at GitHub Pages.

## Search API

`GET /api/search` is read-only. Parameters, each checked against an allowlist (anything else
returns 400):

- `service` (required): `egg_freezing`, `embryo_freezing`, `ivf`, `fertility_testing`
- `clinic`: a clinic slug from `src/app/data/clinics.ts`
- `region`: `london`, `south-east`, `east-of-england`, `east-midlands`, `north-west`, `north-east`,
  `yorkshire-and-the-humber`, `scotland`, `wales`
- `max_budget`: whole pounds, 1 to 100000
- `sort`: `price_asc` (default), `price_desc`, `name`

Responses are cached for five minutes (`Cache-Control: public, max-age=300`). The all-in estimate
is the published price plus medication plus one year of storage, using only the parts the clinic
publishes, and never adds storage twice when the price already includes the first year. Clinics
that do not publish a price are kept when a budget is set, because they cannot be ruled out.
