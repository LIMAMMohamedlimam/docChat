import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPreferences,
} from "../models/user.model";
import {
  hashPassword,
  comparePassword,
  signToken,
} from "../services/auth.service";
import { createError } from "../middleware/errorHandler";

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  preferredLLM: string;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    preferredLLM: user.preferredLLM,
  };
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password || !name) {
      return next(createError("email, password, and name are required", 400));
    }
    if (password.length < 8) {
      return next(createError("Password must be at least 8 characters", 400));
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return next(createError("Email already registered", 409));
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser(email, hashedPassword, name);
    const token = signToken({ userId: user.id, email: user.email });

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return next(createError("email and password are required", 400));
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return next(createError("Invalid credentials", 401));
    }

    const valid = await comparePassword(password, user.hashedPassword);
    if (!valid) {
      return next(createError("Invalid credentials", 401));
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId);
    if (!user) return next(createError("User not found", 404));
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { preferredLLM } = req.body as { preferredLLM?: string };
    const valid = ["claude", "openai", "mistral", "ollama"];
    if (!preferredLLM || !valid.includes(preferredLLM)) {
      return next(createError(`preferredLLM must be one of: ${valid.join(", ")}`, 400));
    }

    await updateUserPreferences(req.user!.userId, preferredLLM);
    res.json({ preferredLLM });
  } catch (err) {
    next(err);
  }
}
