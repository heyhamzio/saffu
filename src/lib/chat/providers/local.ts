import { buildFallbackAnswer, formatSaffuAnswer } from "@/lib/chat/persona";
import type { ChatRequest, ChatResponse } from "@/lib/chat/contracts";
import type { ChatProvider } from "@/lib/chat/providers/types";
import { getKnowledgeRepository } from "@/lib/knowledge";
import type { CanonicalKnowledgeRecord } from "@/lib/knowledge/schema";

const COMMON_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "about",
  "can",
  "could",
  "you",
  "your",
  "is",
  "are",
  "to",
  "for",
  "in",
  "on",
  "of",
  "and",
  "with",
  "me"
]);

const SUGGESTIONS_BY_TYPE: Record<string, string[]> = {
  profile: [
    "What makes Hamza different from other product designers?",
    "What kind of roles is he open to?",
    "Can you summarize his strengths in 3 bullets?"
  ],
  project: [
    "Which project best shows design-to-code skills?",
    "What business problem did this project solve?",
    "Can you compare his top 2 projects?"
  ],
  experience: [
    "Can you walk me through Hamza's career timeline?",
    "What did he do as CPO?",
    "How did his agency experience shape his process?"
  ],
  skill: [
    "What is Hamza strongest at technically?",
    "How does he use n8n in products?",
    "What tools does he use for research and prototyping?"
  ],
  faq: [
    "Can you give recruiter-friendly talking points?",
    "Which achievements are most measurable?",
    "How quickly can he move from concept to shipped UI?"
  ],
  contact: [
    "How can I contact Hamza?",
    "Where is he based?",
    "Can you share his LinkedIn profile?"
  ]
};

export class LocalChatProvider implements ChatProvider {
  readonly name = "LocalChatProvider";

  async createReply(request: ChatRequest): Promise<ChatResponse> {
    const repository = getKnowledgeRepository();
    const records = await repository.getAllRecords();
    const ranked = rankRecords(request.message, records);
    const topMatches = ranked.slice(0, 3);

    if (topMatches.length === 0 || topMatches[0].score <= 0) {
      return {
        answer: buildFallbackAnswer(request.message),
        confidence: 0.3,
        citations: [],
        suggestions: [
          "What are Hamza's best projects?",
          "What is his design-to-code process?",
          "What roles is he open to?"
        ]
      };
    }

    const lead = topMatches[0].record;
    const support = topMatches[1]?.record;
    const answer = buildAnswer(lead, support);
    const confidence = clamp(topMatches[0].score / 8, 0.35, 0.92);

    return {
      answer: formatSaffuAnswer(answer, confidence),
      confidence,
      citations: topMatches.map((item) => ({
        id: item.record.id,
        title: item.record.title,
        source: item.record.source.label
      })),
      suggestions: suggestFollowUps(lead.type)
    };
  }
}

function buildAnswer(lead: CanonicalKnowledgeRecord, support?: CanonicalKnowledgeRecord): string {
  const toneIntro =
    "Saffu mode on: practical answer with a tiny smile. Here is the best match from Hamza's profile.";

  if (!support) {
    return `${toneIntro}\n\n${lead.content}`;
  }

  return `${toneIntro}\n\n${lead.content}\n\nAlso useful context: ${support.content}`;
}

function rankRecords(message: string, records: CanonicalKnowledgeRecord[]) {
  const tokens = tokenize(message);
  return records
    .map((record) => ({
      record,
      score: scoreRecord(tokens, record)
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreRecord(tokens: string[], record: CanonicalKnowledgeRecord): number {
  if (tokens.length === 0) return 0;
  const title = record.title.toLowerCase();
  const content = record.content.toLowerCase();
  const tags = record.tags.map((tag) => tag.toLowerCase());

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 3;
    if (tags.some((tag) => tag.includes(token))) score += 2;
    if (content.includes(token)) score += 1;
  }
  return score;
}

function tokenize(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !COMMON_STOP_WORDS.has(token));
}

function suggestFollowUps(type: string): string[] {
  return (
    SUGGESTIONS_BY_TYPE[type] ?? [
      "Tell me about Hamza's top projects.",
      "What can he build end-to-end?",
      "How do I contact him?"
    ]
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
