export interface User {
  id: string;
  email: string;
  name: string;
  preferredLLM: string;
  createdAt: string;
}

export interface Document {
  id: string;
  filename: string;
  mimeType: string;
  s3Key: string;
  uploadedAt: string;
  sizeBytes: number;
  extractedText?: string;
  chunks?: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  model?: string;
}

export type LLMProvider = "claude" | "openai" | "mistral" | "ollama";
