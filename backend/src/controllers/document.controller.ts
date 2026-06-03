import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileUrl, deleteFile } from "../services/storage.service";
import { extractText } from "../services/extractor.service";
import { chunkText } from "../utils/chunk";
import {
  createDocument,
  getDocumentsByUser,
  getDocumentById,
  deleteDocument,
} from "../models/document.model";
import { createError } from "../middleware/errorHandler";
import { randomUUID } from "crypto";

export async function uploadDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    if (!file) return next(createError("No file provided", 400));

    const s3Key = `${req.user!.userId}/${randomUUID()}-${file.originalname}`;

    await uploadFile(file.buffer, s3Key, file.mimetype);

    const extractedText = await extractText(file.buffer, file.mimetype);
    const chunks = chunkText(extractedText);

    const doc = await createDocument(
      req.user!.userId,
      file.originalname,
      file.mimetype,
      s3Key,
      file.size,
      extractedText,
      chunks
    );

    res.status(201).json({ document: doc });
  } catch (err) {
    next(err);
  }
}

export async function listDocuments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const documents = await getDocumentsByUser(req.user!.userId);
    // Strip extractedText and chunks from list view to keep payload small
    const summaries = documents.map(({ extractedText: _et, chunks: _c, ...rest }) => rest);
    res.json({ documents: summaries });
  } catch (err) {
    next(err);
  }
}

export async function getDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) return next(createError("Document not found", 404));
    if (doc.userId !== req.user!.userId) return next(createError("Forbidden", 403));

    const url = await getFileUrl(doc.s3Key);
    res.json({ document: { ...doc, url } });
  } catch (err) {
    next(err);
  }
}

export async function getDocumentChunks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) return next(createError("Document not found", 404));
    if (doc.userId !== req.user!.userId) return next(createError("Forbidden", 403));

    res.json({ chunks: doc.chunks, count: doc.chunks.length });
  } catch (err) {
    next(err);
  }
}

export async function removeDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doc = await getDocumentById(req.params.id);
    if (!doc) return next(createError("Document not found", 404));
    if (doc.userId !== req.user!.userId) return next(createError("Forbidden", 403));

    await deleteFile(doc.s3Key);
    await deleteDocument(doc.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
