import { Request, Response, NextFunction } from "express";
import { getLLMProvider } from "../services/llm/llm.factory";
import { LLMMessage } from "../services/llm/llm.interface";
import { getDocumentById } from "../models/document.model";
import { getUserById } from "../models/user.model";
import { createError } from "../middleware/errorHandler";

const MAX_CONTEXT_CHUNKS = 20;

function buildSystemPrompt(filename: string, chunks: string[]): string {
  const context = chunks.slice(0, MAX_CONTEXT_CHUNKS).join("\n\n---\n\n");
  return [
    `You are a document assistant. Answer questions based ONLY on the document content provided below.`,
    `If the answer cannot be found in the document, say so clearly.`,
    `Document: "${filename}"`,
    ``,
    `=== DOCUMENT CONTENT ===`,
    context,
    `=== END OF DOCUMENT ===`,
  ].join("\n");
}

export async function chat(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentId, message, history } = req.body as {
      documentId?: string;
      message?: string;
      history?: LLMMessage[];
    };

    if (!documentId) return next(createError("documentId is required", 400));
    if (!message?.trim()) return next(createError("message is required", 400));

    const doc = await getDocumentById(documentId);
    if (!doc) return next(createError("Document not found", 404));
    if (doc.userId !== req.user!.userId) return next(createError("Forbidden", 403));

    const user = await getUserById(req.user!.userId);
    if (!user) return next(createError("User not found", 404));

    const provider = getLLMProvider(user.preferredLLM);

    const systemPrompt = buildSystemPrompt(doc.filename, doc.chunks);

    const messages: LLMMessage[] = [
      ...(history ?? []).filter((m) => m.role !== "system"),
      { role: "user", content: message.trim() },
    ];

    const llmResponse = await provider.ask(systemPrompt, messages);

    res.json({
      response: llmResponse.content,
      provider: llmResponse.provider,
      model: llmResponse.model,
      tokensUsed: llmResponse.tokensUsed,
    });
  } catch (err) {
    next(err);
  }
}
