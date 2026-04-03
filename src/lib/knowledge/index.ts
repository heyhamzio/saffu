import { serverEnv } from "@/lib/config/env";
import { LocalKnowledgeAdapter } from "@/lib/knowledge/adapters/local";
import { MongoKnowledgeAdapter } from "@/lib/knowledge/adapters/mongo";
import { N8nDocKnowledgeAdapter, N8nSheetKnowledgeAdapter } from "@/lib/knowledge/adapters/n8n";
import type { KnowledgeAdapter } from "@/lib/knowledge/adapters/types";
import { KnowledgeRepository } from "@/lib/knowledge/repository";

let repositorySingleton: KnowledgeRepository | null = null;

function buildKnowledgeAdapters(): KnowledgeAdapter[] {
  const adapters: KnowledgeAdapter[] = [new LocalKnowledgeAdapter()];

  if (serverEnv.N8N_KNOWLEDGE_SHEETS_URL) {
    adapters.push(
      new N8nSheetKnowledgeAdapter(serverEnv.N8N_KNOWLEDGE_SHEETS_URL, serverEnv.N8N_KNOWLEDGE_TOKEN)
    );
  }

  if (serverEnv.N8N_KNOWLEDGE_DOCS_URL) {
    adapters.push(new N8nDocKnowledgeAdapter(serverEnv.N8N_KNOWLEDGE_DOCS_URL, serverEnv.N8N_KNOWLEDGE_TOKEN));
  }

  if (serverEnv.MONGODB_URI && serverEnv.MONGODB_DB_NAME && serverEnv.MONGODB_KNOWLEDGE_COLLECTION) {
    adapters.push(
      new MongoKnowledgeAdapter({
        uri: serverEnv.MONGODB_URI,
        dbName: serverEnv.MONGODB_DB_NAME,
        collectionName: serverEnv.MONGODB_KNOWLEDGE_COLLECTION
      })
    );
  }

  return adapters;
}

export function getKnowledgeRepository(): KnowledgeRepository {
  if (!repositorySingleton) {
    repositorySingleton = new KnowledgeRepository(buildKnowledgeAdapters());
  }
  return repositorySingleton;
}
