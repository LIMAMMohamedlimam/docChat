import Anthropic from "@anthropic-ai/sdk";
import { ILLMProvider, LLMMessage, LLMResponse } from "./llm.interface";
import { config } from "../../config/env";

const MODEL = "claude-sonnet-4-6";

export class ClaudeProvider implements ILLMProvider {
  name = "claude";
  private client: Anthropic | null = null;

  private getClient(): Anthropic {
    if (!this.client) this.client = new Anthropic({ apiKey: config.llm.anthropicApiKey });
    return this.client;
  }

  async ask(systemPrompt: string, messages: LLMMessage[]): Promise<LLMResponse> {
    const client = this.getClient();
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: userMessages,
    });

    const content =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return {
      content,
      provider: "claude",
      model: MODEL,
      tokensUsed:
        (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0),
    };
  }
}
