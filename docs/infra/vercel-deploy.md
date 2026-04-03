# Vercel Deployment Guide

## 1) Connect repository

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Framework preset: `Next.js`.

## 2) Set environment variables in Vercel

Minimum for local-provider production:

- `CHAT_PROVIDER=local`
- `BLOG_PROVIDER=local`

For n8n mode:

- `CHAT_PROVIDER=n8n`
- `N8N_CHAT_WEBHOOK_URL`
- `N8N_CHAT_WEBHOOK_TOKEN` (optional)
- `N8N_KNOWLEDGE_SHEETS_URL` and/or `N8N_KNOWLEDGE_DOCS_URL`
- `N8N_KNOWLEDGE_TOKEN` (optional)

For Mongo migration:

- `BLOG_PROVIDER=mongo` (optional)
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `MONGODB_KNOWLEDGE_COLLECTION` (optional)
- `MONGODB_BLOG_COLLECTION` (optional)

## 3) Deploy

- Trigger deploy from Vercel dashboard, or:
  ```bash
  npx vercel --prod
  ```

## 4) Post-deploy checks

1. Homepage loads and chat responds.
2. `/blog` and post pages render.
3. `/api/knowledge` returns canonical records.
4. If in n8n mode, confirm webhook calls and latency.
