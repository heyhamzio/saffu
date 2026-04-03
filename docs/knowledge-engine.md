# Knowledge Engine Notes

The knowledge engine is source-agnostic. Chat consumers only read canonical records from the repository layer.

## Canonical model

```ts
{
  id: string;
  type: "profile" | "project" | "experience" | "skill" | "faq" | "blogSnippet" | "toneRule" | "contact";
  title: string;
  content: string;
  tags: string[];
  source: { kind: "local" | "n8n-sheet" | "n8n-doc" | "mongo" | "manual"; label: string; reference?: string };
  updatedAt: string;
  version: number;
  status: "active" | "archived" | "draft";
  attributes: Record<string, unknown>;
}
```

## Conflict policy

- Dedupe by `id`.
- Protected records (`attributes.protected = true`) win over non-protected records.
- Otherwise newest `updatedAt` wins.

## Current adapters

- Local JSON adapter
- n8n Google Sheets adapter
- n8n Google Docs adapter
- Mongo adapter (future mode)
