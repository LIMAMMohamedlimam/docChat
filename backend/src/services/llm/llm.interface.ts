export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface ILLMProvider {
  name: string;
  ask(systemPrompt: string, messages: LLMMessage[]): Promise<LLMResponse>;
}
