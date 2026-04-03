# Saffu AI Portfolio

Chat-first portfolio for Hamza Shaikh, built with Next.js and Tailwind CSS.

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Local knowledge engine with adapter architecture
- Static MDX blog
- Optional n8n provider for chat and knowledge feeds
- MongoDB-ready knowledge adapter (future use)

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Local n8n setup (included)

1. Copy n8n env:
   ```bash
   cp .env.n8n.example .env.n8n
   ```
2. Set a strong `N8N_ENCRYPTION_KEY` in `.env.n8n`.
3. Start n8n + postgres:
   ```bash
   npm run n8n:up
   ```
4. Stop services:
   ```bash
   npm run n8n:down
   ```

## Provider modes

- `CHAT_PROVIDER=local`
  - Chat answers from local canonical knowledge JSON files.
  - Works without n8n.
- `CHAT_PROVIDER=n8n`
  - Chat requests go through n8n webhook.
  - If webhook is unavailable, provider falls back to local mode.
- `BLOG_PROVIDER=local`
  - Blog content comes from MDX files in this repo.
- `BLOG_PROVIDER=mongo`
  - Blog content can be read from MongoDB in future migration.

## Knowledge engine

Canonical record model:

- `id`, `type`, `title`, `content`, `tags`, `source`, `updatedAt`, `version`, `status`, `attributes`

Adapters:

- `LocalKnowledgeAdapter`
- `N8nSheetKnowledgeAdapter`
- `N8nDocKnowledgeAdapter`
- `MongoKnowledgeAdapter`

This lets you add Google Sheets/Docs knowledge later without frontend rewrites.

## Content locations

- Local knowledge records: `src/lib/knowledge/*.json`
- Blog posts: `content/blog/*.mdx`
- Chat contracts/persona: `src/lib/chat/*`
- n8n setup guide: `docs/infra/n8n-setup.md`
- Vercel deployment guide: `docs/infra/vercel-deploy.md`

## For AI agents working on this repo

- **Overall goal**
  - Keep `Saffu` as a **chat-first hero** on `/`, answering about Hamza with a fun but factual spouse-style voice.
  - Preserve the architecture described in `saffu_portfolio_build_plan_*.plan.md` and this `README.md`.

- **Chat + providers**
  - **Do** keep the `/api/chat` request and response shapes exactly as defined in `src/lib/chat/contracts.ts`.
  - **Do** use `CHAT_PROVIDER` env (`local` or `n8n`) instead of branching logic in the UI.
  - **Do not** couple UI components directly to n8n or any LLM API — always go through the provider abstraction in `src/lib/chat/providers`.

- **Knowledge engine**
  - **Do** treat `src/lib/knowledge/*.json` as canonical records; CV/old portfolio are **one-time inputs only**.
  - **Do** preserve the canonical schema from `src/lib/knowledge/schema.ts` when adding or editing records.
  - **Do not** read from Google Sheets/Docs directly in the app; use n8n endpoints and the existing n8n adapters.
  - **Do not** break the adapter pattern in `src/lib/knowledge/adapters/*` or the repository in `src/lib/knowledge/repository.ts`.

- **Blog and MongoDB**
  - **Do** use `src/lib/blog.ts` as the only access layer for blog data.
  - **Do** keep both `local` and `mongo` blog provider paths working when making changes.
  - **Do not** hard-wire blog pages to filesystem or MongoDB directly; always go through the repository in `src/lib/blog.ts`.

- **n8n + infra**
  - **Do** assume n8n runs on its own host or via `docker-compose.n8n.yml`, not inside Vercel.
  - **Do** keep all n8n setup details in `docs/infra/n8n-setup.md` and **do not** duplicate them across many files.
  - **Do not** introduce any blocking dependency on `CHAT_PROVIDER=n8n` — the app must always work in `local` mode.

- **Persona and tone**
  - **Do** keep Saffu playful, warm, and logical, with clear fallbacks when facts are missing.
  - **Do** avoid cultural stereotypes; base tone on Hamza’s preferred style, not generic “Indian wife” behavior.
  - **Do not** add hard-coded jokes or phrases that could limit tone flexibility across use cases (recruiters vs. peers).

- **Plan + structure**
  - **Do** treat the attached plan file as the source of truth for architecture decisions; align changes with it.
  - **Do not** modify the plan file itself unless explicitly asked by the user.

If in doubt, prefer:

- **Stability over novelty** for contracts and schemas.
- **Adapters/repositories** over direct calls to external systems.
- **Local `CHAT_PROVIDER=local`** behavior working cleanly before optimizing or extending the n8n path.
