import OpenAI from "openai";
import { ILLMProvider, LLMMessage, LLMResponse } from "./llm.interface";
import { config } from "../../config/env";

const MODEL = "gpt-4o-mini";

export class OpenAIProvider implements ILLMProvider {
  name = "openai";
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) this.client = new OpenAI({ apiKey: config.llm.openaiApiKey });
    return this.client;
  }

  async ask(systemPrompt: string, messages: LLMMessage[]): Promise<LLMResponse> {
    const client = this.getClient();
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    ];

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: openaiMessages,
      max_tokens: 1024,
    });

    const content = response.choices[0]?.message?.content ?? "";

    return {
      content,
      provider: "openai",
      model: MODEL,
      tokensUsed: response.usage?.total_tokens,
    };
  }
}
