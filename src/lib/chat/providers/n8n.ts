import { chatResponseSchema, type ChatRequest, type ChatResponse } from "@/lib/chat/contracts";
import type { ChatProvider } from "@/lib/chat/providers/types";
import { LocalChatProvider } from "@/lib/chat/providers/local";
import { serverEnv } from "@/lib/config/env";

export class N8nChatProvider implements ChatProvider {
  readonly name = "N8nChatProvider";

  async createReply(request: ChatRequest): Promise<ChatResponse> {
    if (!serverEnv.N8N_CHAT_WEBHOOK_URL) {
      return new LocalChatProvider().createReply(request);
    }

    try {
      const response = await fetch(serverEnv.N8N_CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(serverEnv.N8N_CHAT_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${serverEnv.N8N_CHAT_WEBHOOK_TOKEN}` }
            : {})
        },
        body: JSON.stringify(request),
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed with status ${response.status}`);
      }

      const payload = (await response.json()) as unknown;
      const responseData = extractResponsePayload(payload);
      return chatResponseSchema.parse(responseData);
    } catch {
      // Graceful fallback keeps chat alive during n8n outages or setup gaps.
      return new LocalChatProvider().createReply(request);
    }
  }
}

function extractResponsePayload(payload: unknown): unknown {
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    if ("answer" in asRecord) return asRecord;
    if ("data" in asRecord) return asRecord.data;
    if ("output" in asRecord) return asRecord.output;
  }
  return payload;
}
