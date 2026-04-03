import { serverEnv } from "@/lib/config/env";
import { LocalChatProvider } from "@/lib/chat/providers/local";
import { N8nChatProvider } from "@/lib/chat/providers/n8n";
import type { ChatProvider } from "@/lib/chat/providers/types";

let providerSingleton: ChatProvider | null = null;

export function getChatProvider(): ChatProvider {
  if (providerSingleton) return providerSingleton;
  providerSingleton = serverEnv.CHAT_PROVIDER === "n8n" ? new N8nChatProvider() : new LocalChatProvider();
  return providerSingleton;
}
