import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.BACKEND_PORT ?? "3001", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",

  jwt: {
    secret: requireEnv("JWT_SECRET", "dev-secret-change-in-prod"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },

  s3: {
    endpoint: process.env.S3_ENDPOINT ?? "http://localhost:9000",
    accessKey: process.env.S3_ACCESS_KEY ?? "minioadmin",
    secretKey: process.env.S3_SECRET_KEY ?? "minioadmin",
    bucket: process.env.S3_BUCKET ?? "docchat-documents",
    region: process.env.S3_REGION ?? "us-east-1",
  },

  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT ?? "http://localhost:8000",
    region: process.env.DYNAMODB_REGION ?? "us-east-1",
  },

  llm: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
    openaiApiKey: process.env.OPENAI_API_KEY ?? "",
    mistralApiKey: process.env.MISTRAL_API_KEY ?? "",
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://host.docker.internal:11434",
  },
} as const;
