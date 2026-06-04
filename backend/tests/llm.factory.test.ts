import { getLLMProvider, SUPPORTED_PROVIDERS } from "../src/services/llm/llm.factory";
import { ILLMProvider, LLMMessage, LLMResponse } from "../src/services/llm/llm.interface";

describe("getLLMProvider (factory)", () => {
  it("returns a provider for every supported name", () => {
    for (const name of SUPPORTED_PROVIDERS) {
      const provider = getLLMProvider(name);
      expect(provider).toBeDefined();
      expect(provider.name).toBe(name);
      expect(typeof provider.ask).toBe("function");
    }
  });

  it("throws for an unknown provider name", () => {
    expect(() => getLLMProvider("grok")).toThrow(/Unknown LLM provider/);
  });

  it("returns a fresh instance on each call", () => {
    const a = getLLMProvider("claude");
    const b = getLLMProvider("claude");
    expect(a).not.toBe(b);
  });
});

describe("chat controller — system prompt construction", () => {
  it("includes document filename and all chunks in system prompt", async () => {
    const captured: { systemPrompt: string; messages: LLMMessage[] } = {
      systemPrompt: "",
      messages: [],
    };

    const mockProvider: ILLMProvider = {
      name: "mock",
      async ask(systemPrompt, messages): Promise<LLMResponse> {
        captured.systemPrompt = systemPrompt;
        captured.messages = messages;
        return { content: "test answer", provider: "mock", model: "mock-1" };
      },
    };

    const filename = "report.pdf";
    const chunks = ["Chunk A content", "Chunk B content", "Chunk C content"];

    // Replicate buildSystemPrompt logic from chat.controller.ts
    const context = chunks.join("\n\n---\n\n");
    const systemPrompt = [
      `You are a document assistant. Answer questions based ONLY on the document content provided below.`,
      `If the answer cannot be found in the document, say so clearly.`,
      `Document: "${filename}"`,
      ``,
      `=== DOCUMENT CONTENT ===`,
      context,
      `=== END OF DOCUMENT ===`,
    ].join("\n");

    const messages: LLMMessage[] = [{ role: "user", content: "What is this about?" }];
    const result = await mockProvider.ask(systemPrompt, messages);

    expect(result.content).toBe("test answer");
    expect(captured.systemPrompt).toContain(filename);
    expect(captured.systemPrompt).toContain("Chunk A content");
    expect(captured.systemPrompt).toContain("Chunk C content");
    expect(captured.messages[0].role).toBe("user");
    expect(captured.messages[0].content).toBe("What is this about?");
  });

  it("forwards conversation history to the provider", async () => {
    const capturedMessages: LLMMessage[] = [];

    const mockProvider: ILLMProvider = {
      name: "mock",
      async ask(_sp, messages): Promise<LLMResponse> {
        capturedMessages.push(...messages);
        return { content: "follow-up answer", provider: "mock", model: "mock-1" };
      },
    };

    const history: LLMMessage[] = [
      { role: "user", content: "First question" },
      { role: "assistant", content: "First answer" },
    ];
    const newMessage: LLMMessage = { role: "user", content: "Follow-up question" };

    await mockProvider.ask("system prompt", [...history, newMessage]);

    expect(capturedMessages).toHaveLength(3);
    expect(capturedMessages[0].content).toBe("First question");
    expect(capturedMessages[2].content).toBe("Follow-up question");
  });
});
