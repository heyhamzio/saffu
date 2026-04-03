import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  sessionId: z.string().trim().min(1).max(120).optional(),
  locale: z.string().trim().min(2).max(20).optional().default("en-IN"),
  pageContext: z.string().trim().min(1).max(120).optional().default("home")
});

export const chatCitationSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  source: z.string().optional()
});

export const chatResponseSchema = z.object({
  answer: z.string().min(1),
  suggestions: z.array(z.string().min(1)).max(6).default([]),
  confidence: z.number().min(0).max(1).default(0.7),
  citations: z.array(chatCitationSchema).max(8).default([])
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
export type ChatCitation = z.infer<typeof chatCitationSchema>;
