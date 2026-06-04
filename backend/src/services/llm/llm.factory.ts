import { ILLMProvider } from "./llm.interface";
import { ClaudeProvider } from "./claude.provider";
import { OpenAIProvider } from "./openai.provider";
import { MistralProvider } from "./mistral.provider";
import { OllamaProvider } from "./ollama.provider";

const providers: Record<string, () => ILLMProvider> = {
  claude: () => new ClaudeProvider(),
  openai: () => new OpenAIProvider(),
  mistral: () => new MistralProvider(),
  ollama: () => new OllamaProvider(),
};

export const SUPPORTED_PROVIDERS = Object.keys(providers);

export function getLLMProvider(name: string): ILLMProvider {
  const factory = providers[name];
  if (!factory) throw new Error(`Unknown LLM provider: "${name}". Supported: ${SUPPORTED_PROVIDERS.join(", ")}`);
  return factory();
}
