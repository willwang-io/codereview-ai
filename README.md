# CodeReview AI

AI-powered code review for GitHub pull requests. Paste a PR URL, get structured feedback with severity-coded findings and inline code references.

**Live:** [codereview.willwang.io](https://codereview.willwang.io)

## How it works

1. Paste a GitHub PR URL
2. The app fetches the diff via GitHub's API
3. The diff is sent to Claude (Anthropic) for structured review
4. Results are displayed with severity levels (critical, warning, suggestion) and relevant code snippets
5. Reviews are stored in PostgreSQL for later reference

Users provide their own Anthropic API key — it's sent per-request and never stored.

## Tech stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Prisma ORM
- **AI:** Anthropic Claude API
- **Hosting:** Vercel + Neon (serverless Postgres)

## Run locally

```bash
git clone https://github.com/willwang-io/codereview-ai.git
cd codereview-ai
npm install
```

Start a local Postgres instance:

```bash
docker compose up -d
```

Create a `.env` file:

```
DATABASE_URL="postgresql://codereview:codereview@localhost:5432/codereview"
```

Push the database schema and start the dev server:

```bash
npx prisma db push
npm run dev
```

Open [localhost:3000](http://localhost:3000) and enter your Anthropic API key to start reviewing.

## Project structure

```
app/
├── page.tsx                  # Home — submit a PR for review
├── reviews/
│   ├── page.tsx              # Review history
│   └── [id]/page.tsx         # Single review detail
└── api/
    ├── review/route.ts       # POST — fetch diff, call Claude, store result
    └── reviews/
        ├── route.ts          # GET — list all reviews
        └── [id]/route.ts     # GET, DELETE — single review
lib/
├── github.ts                 # Parse PR URLs, fetch diffs
├── claude.ts                 # Claude API client and review prompt
└── db.ts                     # Prisma client
```

## License

MIT