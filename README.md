# CruxM360

An on-page SEO audit dashboard built with Next.js and SQLite. Enter a domain and the
server crawls that one public page, runs rule-based checks (title, meta description,
H1, canonical, viewport, JSON-LD, image alt text, HSTS, Open Graph), stores the result
and shows a score with a fix list.

## What is real and what is not

| Area | Status |
| --- | --- |
| Audit score, issues, fix list | Real: computed from the crawled page |
| Keywords | Word frequency on the page; volume, difficulty and position are not measured (shown as `—`) |
| DR, UR, backlinks, traffic | Not measured. Hand-entered sample figures exist only for `google.com`, `ahrefs.com`, `semrush.com` in `src/lib/cruxm-tools.ts` |
| Explorer, Compare, Tools, Settings | Static demo pages: they do not call the API |

## Requirements

- Node.js 20–25 is the supported range for `better-sqlite3` (it also works on 26 here)
- On Windows: Visual Studio Build Tools with the "Desktop development with C++" workload, so `better-sqlite3` can compile

## Run it

```bash
npm install
npm run dev -- -H 127.0.0.1
```

Open http://localhost:3000. Binding to `127.0.0.1` keeps it off your network: the app has
no login, so anyone who can reach the port can run audits and read stored data.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit tests (vitest) |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply `src/lib/db/schema.ts` to the database with drizzle-kit |

## Data

The app reads and writes `cruxm-v2.db` in the project root (SQLite). It needs a
persistent disk, so serverless hosts such as Vercel will lose the data between requests.
`cruxm360.db` is an older database the code does not use.

## Security notes

- `POST /api/run-audit` only fetches public `http`/`https` URLs on ports 80 and 443.
  Private, loopback, link-local and cloud-metadata addresses are refused, including after
  redirects and DNS resolution (`src/lib/security/`). Responses are capped at 2 MB and
  10 seconds.
- Not yet in place: authentication, rate limiting, a Content-Security-Policy, and
  protection against DNS rebinding between the DNS check and the connection.
