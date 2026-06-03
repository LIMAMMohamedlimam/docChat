import multer from "multer";
import { createError } from "./errorHandler";
import { Request } from "express";

const ALLOWED_MIMES = ["application/pdf", "text/csv", "text/plain"];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(createError(`Unsupported file type: ${file.mimetype}. Allowed: PDF, CSV, TXT`, 400));
    }
  },
});
