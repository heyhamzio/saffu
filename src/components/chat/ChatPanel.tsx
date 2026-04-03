"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import type { ChatCitation, ChatResponse } from "@/lib/chat/contracts";
import { saffuPersona } from "@/lib/chat/persona";
import { SuggestionChips } from "@/components/chat/SuggestionChips";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
};

const STARTER_SUGGESTIONS = [
  "What makes Hamza different from other designers?",
  "Show me his best design-to-code projects",
  "What roles is he open to right now?"
];

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(STARTER_SUGGESTIONS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: saffuPersona.greeting
    }
  ]);
  const sessionId = useMemo(
    () => `session-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`,
    []
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          pageContext: "home"
        })
      });

      const payload = (await response.json()) as ChatResponse;
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: payload.answer,
        citations: payload.citations
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions(payload.suggestions ?? []);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          content: "I had a tiny network hiccup. Ask me again and I will answer properly."
        }
      ]);
      setSuggestions(STARTER_SUGGESTIONS);
    } finally {
      setIsLoading(false);
      formRef.current?.querySelector("textarea")?.focus();
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Saffu AI</p>
          <h2 className="text-lg font-semibold text-slate-900">Ask my wife about me</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
          {isLoading ? "Typing..." : "Online"}
        </span>
      </div>

      <div className="h-80 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
        {messages.map((message) => (
          <article key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {message.content}
            </div>
            {message.citations?.length ? (
              <div className="mt-1 text-xs text-slate-500">
                Sources: {message.citations.map((citation) => citation.title ?? citation.id).join(" | ")}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <SuggestionChips suggestions={suggestions} disabled={isLoading} onSelect={(value) => void sendMessage(value)} />

      <form ref={formRef} onSubmit={onSubmit} className="mt-3 space-y-2">
        <label htmlFor="chat-input" className="sr-only">
          Ask Saffu
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about projects, skills, timeline, or how Hamza works..."
          className="h-24 w-full resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-pink-500 transition focus:ring"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full rounded-2xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </section>
  );
}
