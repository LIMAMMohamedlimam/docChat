import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../services/auth.service";
import { createError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(createError("Missing or invalid Authorization header", 401));
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(createError("Invalid or expired token", 401));
  }
}
