import { canonicalKnowledgeRecordListSchema, type CanonicalKnowledgeRecord } from "@/lib/knowledge/schema";
import type { KnowledgeAdapter } from "@/lib/knowledge/adapters/types";

type N8nKnowledgeAdapterOptions = {
  name: string;
  endpoint: string;
  token?: string;
};

class BaseN8nKnowledgeAdapter implements KnowledgeAdapter {
  readonly name: string;

  constructor(private readonly options: N8nKnowledgeAdapterOptions) {
    this.name = options.name;
  }

  async getRecords(): Promise<CanonicalKnowledgeRecord[]> {
    const response = await fetch(this.options.endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(this.options.token ? { Authorization: `Bearer ${this.options.token}` } : {})
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`${this.name} failed with status ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const records = canonicalKnowledgeRecordListSchema.parse(payload);
    return records.filter((record) => record.status === "active");
  }
}

export class N8nSheetKnowledgeAdapter extends BaseN8nKnowledgeAdapter {
  constructor(endpoint: string, token?: string) {
    super({
      name: "N8nSheetKnowledgeAdapter",
      endpoint,
      token
    });
  }
}

export class N8nDocKnowledgeAdapter extends BaseN8nKnowledgeAdapter {
  constructor(endpoint: string, token?: string) {
    super({
      name: "N8nDocKnowledgeAdapter",
      endpoint,
      token
    });
  }
}
