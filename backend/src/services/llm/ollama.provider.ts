import { ILLMProvider, LLMMessage, LLMResponse } from "./llm.interface";
import { config } from "../../config/env";

const MODEL = "llama3.2";

interface OllamaChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OllamaChatResponse {
  message: { content: string };
  model: string;
  prompt_eval_count?: number;
  eval_count?: number;
}

export class OllamaProvider implements ILLMProvider {
  name = "ollama";

  async ask(systemPrompt: string, messages: LLMMessage[]): Promise<LLMResponse> {
    const ollamaMessages: OllamaChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const res = await fetch(`${config.llm.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages: ollamaMessages, stream: false }),
    });

    if (!res.ok) {
      throw new Error(`Ollama request failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as OllamaChatResponse;

    return {
      content: data.message.content,
      provider: "ollama",
      model: data.model ?? MODEL,
      tokensUsed: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
    };
  }
}
