import express from "express";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { ensureUsersTable } from "./models/user.model";
import { ensureDocumentsTable } from "./models/document.model";
import authRoutes from "./routes/auth.routes";
import documentRoutes from "./routes/document.routes";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.use(errorHandler);

async function start() {
  await ensureUsersTable();
  await ensureDocumentsTable();
  app.listen(config.port, () => {
    logger.info(`server running`, { port: config.port, env: config.nodeEnv });
  });
}

start().catch((err) => {
  logger.error("failed to start server", { error: String(err) });
  process.exit(1);
});

export default app;
