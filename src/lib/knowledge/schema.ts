import { z } from "zod";

export const knowledgeRecordTypeSchema = z.enum([
  "profile",
  "project",
  "experience",
  "skill",
  "faq",
  "blogSnippet",
  "toneRule",
  "contact"
]);

export const knowledgeSourceSchema = z.object({
  kind: z.enum(["local", "n8n-sheet", "n8n-doc", "mongo", "manual"]),
  label: z.string().min(1),
  reference: z.string().optional()
});

export const canonicalKnowledgeRecordSchema = z.object({
  id: z.string().min(1),
  type: knowledgeRecordTypeSchema,
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  source: knowledgeSourceSchema,
  updatedAt: z.string().datetime(),
  version: z.number().int().positive().default(1),
  status: z.enum(["active", "archived", "draft"]).default("active"),
  attributes: z.record(z.string(), z.unknown()).default({})
});

export const canonicalKnowledgeRecordListSchema = z.array(canonicalKnowledgeRecordSchema);

export type KnowledgeRecordType = z.infer<typeof knowledgeRecordTypeSchema>;
export type KnowledgeSource = z.infer<typeof knowledgeSourceSchema>;
export type CanonicalKnowledgeRecord = z.infer<typeof canonicalKnowledgeRecordSchema>;
