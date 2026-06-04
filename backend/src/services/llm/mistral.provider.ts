import { Mistral } from "@mistralai/mistralai";
import { ILLMProvider, LLMMessage, LLMResponse } from "./llm.interface";
import { config } from "../../config/env";

const MODEL = "mistral-small-latest";

export class MistralProvider implements ILLMProvider {
  name = "mistral";
  private client: Mistral | null = null;

  private getClient(): Mistral {
    if (!this.client) this.client = new Mistral({ apiKey: config.llm.mistralApiKey });
    return this.client;
  }

  async ask(systemPrompt: string, messages: LLMMessage[]): Promise<LLMResponse> {
    const client = this.getClient();
    const mistralMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    ];

    const response = await client.chat.complete({
      model: MODEL,
      messages: mistralMessages,
      maxTokens: 1024,
    });

    const content =
      typeof response.choices?.[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : "";

    return {
      content,
      provider: "mistral",
      model: MODEL,
      tokensUsed: response.usage?.totalTokens,
    };
  }
}
