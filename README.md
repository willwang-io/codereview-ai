# CodeReview AI

Personal AI-powered code review for GitHub pull requests and commits. Paste a GitHub URL, get structured feedback with severity-coded findings and inline code references.

**Live:** [codereview.willwang.io](https://codereview.willwang.io)

This is my personal, fast toolbox. Bring your own OpenAI API key if you want to use it too. The hosted app asks for a key per review so it can be used from anywhere without storing a shared server-side key.

## How it works

1. Paste a GitHub pull request or commit URL
2. Paste an OpenAI API key for the current request
3. The app fetches the diff or patch from GitHub
4. The diff is sent to OpenAI for structured review
5. Results are displayed with severity levels (critical, warning, suggestion) and relevant code snippets
6. Reviews are stored in PostgreSQL for later reference

The OpenAI API key is sent to the app API for that review request and is not stored in PostgreSQL.

## Tech stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Prisma ORM
- **AI:** OpenAI Responses API
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

Open [localhost:3000](http://localhost:3000), paste your OpenAI API key and a GitHub pull request or commit URL, and run a review.

## Project structure

```
app/
├── page.tsx                  # Home — submit a PR for review
├── reviews/
│   ├── page.tsx              # Review history
│   └── [id]/page.tsx         # Single review detail
└── api/
    ├── review/route.ts       # POST — fetch diff, call OpenAI, store result
    └── reviews/
        ├── route.ts          # GET — list all reviews
        └── [id]/route.ts     # GET, DELETE — single review
lib/
├── github.ts                 # Parse GitHub URLs, fetch diffs
├── openai.ts                 # OpenAI API client and review prompt
└── db.ts                     # Prisma client
```

## License

MIT
