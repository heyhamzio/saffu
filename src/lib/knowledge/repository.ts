import type { KnowledgeAdapter } from "@/lib/knowledge/adapters/types";
import type { CanonicalKnowledgeRecord } from "@/lib/knowledge/schema";

type RepositoryCache = {
  records: CanonicalKnowledgeRecord[];
  expiresAt: number;
};

export class KnowledgeRepository {
  private cache: RepositoryCache | null = null;

  constructor(
    private readonly adapters: KnowledgeAdapter[],
    private readonly cacheTtlMs: number = 5 * 60 * 1000
  ) {}

  async getAllRecords(): Promise<CanonicalKnowledgeRecord[]> {
    const now = Date.now();
    if (this.cache && this.cache.expiresAt > now) {
      return this.cache.records;
    }

    const merged: CanonicalKnowledgeRecord[] = [];
    for (const adapter of this.adapters) {
      try {
        const records = await adapter.getRecords();
        merged.push(...records);
      } catch {
        // Soft-fail external adapters so local knowledge remains available.
      }
    }

    const deduped = dedupeAndResolveConflicts(merged);
    this.cache = {
      records: deduped,
      expiresAt: now + this.cacheTtlMs
    };
    return deduped;
  }

  async queryByTags(tags: string[]): Promise<CanonicalKnowledgeRecord[]> {
    const normalizedTags = tags.map((tag) => tag.toLowerCase());
    const records = await this.getAllRecords();
    return records.filter((record) =>
      record.tags.some((tag) => normalizedTags.includes(tag.toLowerCase()))
    );
  }

  clearCache() {
    this.cache = null;
  }
}

function dedupeAndResolveConflicts(records: CanonicalKnowledgeRecord[]): CanonicalKnowledgeRecord[] {
  const recordById = new Map<string, CanonicalKnowledgeRecord>();

  for (const record of records) {
    const existing = recordById.get(record.id);
    if (!existing) {
      recordById.set(record.id, record);
      continue;
    }

    const existingProtected = Boolean(existing.attributes.protected);
    const currentProtected = Boolean(record.attributes.protected);

    if (existingProtected && !currentProtected) {
      continue;
    }

    if (currentProtected && !existingProtected) {
      recordById.set(record.id, record);
      continue;
    }

    const existingDate = new Date(existing.updatedAt).getTime();
    const currentDate = new Date(record.updatedAt).getTime();
    if (currentDate >= existingDate) {
      recordById.set(record.id, record);
    }
  }

  return [...recordById.values()];
}
