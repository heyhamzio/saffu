# n8n Setup Guide for Saffu

This app can run in two modes:

- `CHAT_PROVIDER=local` (default)
- `CHAT_PROVIDER=n8n`

## 1) Deploy n8n separately

Recommended platforms:

- Railway
- Render
- VPS with Docker

Do not host full n8n on Vercel.

### Local n8n in this project

This repo includes `docker-compose.n8n.yml` for local-first setup.

1. Copy env file:
   ```bash
   cp .env.n8n.example .env.n8n
   ```
2. Set a strong `N8N_ENCRYPTION_KEY` in `.env.n8n`.
3. Start services:
   ```bash
   docker compose --env-file .env.n8n -f docker-compose.n8n.yml up -d
   ```
4. Open n8n at `http://localhost:5678`.

## 2) Chat webhook contract

Set `N8N_CHAT_WEBHOOK_URL` in your app env.

Incoming payload from app:

```json
{
  "message": "What are Hamza's top projects?",
  "sessionId": "session-abc123",
  "locale": "en-IN",
  "pageContext": "home"
}
```

Expected n8n response:

```json
{
  "answer": "Short factual answer in Saffu tone.",
  "suggestions": ["Follow-up 1", "Follow-up 2"],
  "confidence": 0.82,
  "citations": [
    {
      "id": "project-homeglazer",
      "title": "HomeGlazer Color Visualizer",
      "source": "Google Sheet Knowledge"
    }
  ]
}
```

## 3) Knowledge feed through Google Sheets/Docs

Set one or both:

- `N8N_KNOWLEDGE_SHEETS_URL`
- `N8N_KNOWLEDGE_DOCS_URL`

Each endpoint should return canonical knowledge records array.

Canonical fields required:

- `id`
- `type`
- `title`
- `content`
- `tags`
- `source`
- `updatedAt`
- `version`
- `status`
- `attributes`

## 4) Suggested workflow blocks in n8n

1. Webhook trigger
2. Input sanitize + moderation
3. Fetch records from Google Sheets/Docs
4. Map to canonical schema
5. Query relevant records
6. LLM generation with Saffu tone guardrails
7. Return structured JSON contract

## 5) Suggested Google Sheets columns

Use one row per canonical record:

- `id`
- `type`
- `title`
- `content`
- `tags` (comma-separated)
- `sourceKind`
- `sourceLabel`
- `sourceReference`
- `updatedAt` (ISO timestamp)
- `version`
- `status`
- `attributes` (JSON string)
