import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/chat/contracts";
import { getChatProvider } from "@/lib/chat/providers";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    const chatRequest = chatRequestSchema.parse(payload);
    const provider = getChatProvider();
    const response = await provider.createReply(chatRequest);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process chat request";
    return NextResponse.json(
      {
        answer: "I hit a small hiccup, but I am still here. Please try that question one more time.",
        suggestions: ["Tell me about Hamza's recent projects.", "What tools does Hamza use?"],
        confidence: 0.2,
        citations: [],
        error: message
      },
      { status: 400 }
    );
  }
}
