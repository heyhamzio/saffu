import type { CanonicalKnowledgeRecord } from "@/lib/knowledge/schema";

export interface KnowledgeAdapter {
  readonly name: string;
  getRecords(): Promise<CanonicalKnowledgeRecord[]>;
}
