import { promises as fs } from "node:fs";
import path from "node:path";
import { canonicalKnowledgeRecordListSchema, type CanonicalKnowledgeRecord } from "@/lib/knowledge/schema";
import type { KnowledgeAdapter } from "@/lib/knowledge/adapters/types";

const DEFAULT_LOCAL_FILES = [
  "src/lib/knowledge/profile.facts.v1.json",
  "src/lib/knowledge/projects.v1.json"
];

export class LocalKnowledgeAdapter implements KnowledgeAdapter {
  readonly name = "LocalKnowledgeAdapter";

  constructor(private readonly files: string[] = DEFAULT_LOCAL_FILES) {}

  async getRecords(): Promise<CanonicalKnowledgeRecord[]> {
    const allRecords: CanonicalKnowledgeRecord[] = [];

    for (const relativeFile of this.files) {
      const absolutePath = path.join(process.cwd(), relativeFile);
      const fileContent = await fs.readFile(absolutePath, "utf8");
      const parsedFile = JSON.parse(fileContent) as unknown;
      const records = canonicalKnowledgeRecordListSchema.parse(parsedFile);
      allRecords.push(...records);
    }

    return allRecords.filter((record) => record.status === "active");
  }
}
