import type { ChatRequest, ChatResponse } from "@/lib/chat/contracts";

export interface ChatProvider {
  readonly name: string;
  createReply(request: ChatRequest): Promise<ChatResponse>;
}
