import { z } from "zod";

const serverEnvSchema = z.object({
  CHAT_PROVIDER: z.enum(["local", "n8n"]).optional().default("local"),
  BLOG_PROVIDER: z.enum(["local", "mongo"]).optional().default("local"),
  N8N_CHAT_WEBHOOK_URL: z.string().url().optional(),
  N8N_CHAT_WEBHOOK_TOKEN: z.string().optional(),
  N8N_KNOWLEDGE_SHEETS_URL: z.string().url().optional(),
  N8N_KNOWLEDGE_DOCS_URL: z.string().url().optional(),
  N8N_KNOWLEDGE_TOKEN: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  MONGODB_DB_NAME: z.string().optional(),
  MONGODB_KNOWLEDGE_COLLECTION: z.string().optional().default("knowledgeRecords"),
  MONGODB_BLOG_COLLECTION: z.string().optional().default("blogPosts")
});

export const serverEnv = serverEnvSchema.parse({
  CHAT_PROVIDER: process.env.CHAT_PROVIDER,
  BLOG_PROVIDER: process.env.BLOG_PROVIDER,
  N8N_CHAT_WEBHOOK_URL: process.env.N8N_CHAT_WEBHOOK_URL,
  N8N_CHAT_WEBHOOK_TOKEN: process.env.N8N_CHAT_WEBHOOK_TOKEN,
  N8N_KNOWLEDGE_SHEETS_URL: process.env.N8N_KNOWLEDGE_SHEETS_URL,
  N8N_KNOWLEDGE_DOCS_URL: process.env.N8N_KNOWLEDGE_DOCS_URL,
  N8N_KNOWLEDGE_TOKEN: process.env.N8N_KNOWLEDGE_TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  MONGODB_KNOWLEDGE_COLLECTION: process.env.MONGODB_KNOWLEDGE_COLLECTION,
  MONGODB_BLOG_COLLECTION: process.env.MONGODB_BLOG_COLLECTION
});
