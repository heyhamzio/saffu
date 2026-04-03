import { MongoClient } from "mongodb";
import { canonicalKnowledgeRecordListSchema, type CanonicalKnowledgeRecord } from "@/lib/knowledge/schema";
import type { KnowledgeAdapter } from "@/lib/knowledge/adapters/types";

type MongoKnowledgeAdapterOptions = {
  uri: string;
  dbName: string;
  collectionName: string;
};

export class MongoKnowledgeAdapter implements KnowledgeAdapter {
  readonly name = "MongoKnowledgeAdapter";

  constructor(private readonly options: MongoKnowledgeAdapterOptions) {}

  async getRecords(): Promise<CanonicalKnowledgeRecord[]> {
    const client = new MongoClient(this.options.uri);
    try {
      await client.connect();
      const collection = client.db(this.options.dbName).collection(this.options.collectionName);
      const docs = await collection.find({ status: { $ne: "archived" } }).toArray();
      const normalized = docs.map((doc) => {
        const { _id, ...rest } = doc;
        return {
          ...rest,
          id: typeof rest.id === "string" ? rest.id : String(_id)
        };
      });
      return canonicalKnowledgeRecordListSchema.parse(normalized);
    } finally {
      await client.close();
    }
  }
}
