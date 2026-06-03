# DocChat — SaaS Document Management with AI

## Agent Instructions

> **You are building this project step by step. Before writing any code, read this entire plan.**
>
> ### Mandatory tracking files
>
> Create and maintain these files at the project root throughout development:
>
> | File | Purpose |
> |---|---|
> | `docs/DECISIONS.md` | Every architectural or design decision. Format: `## [YYYY-MM-DD] Title` → Context, Options considered, Decision, Rationale. |
> | `docs/CHANGELOG.md` | Every meaningful change. Format: Keep a Changelog (keepachangelog.com). Sections: Added, Changed, Fixed, Removed. |
> | `docs/ARCHITECTURE.md` | Living doc: folder structure, data flow diagram (mermaid), component map, API surface. Update after each phase. |
> | `docs/TODO.md` | Remaining tasks. Check off as you go. Copy from Phase checklists below. |
> | `docs/BUGS.md` | Bugs found during dev. Format: `- [ ] description | severity | phase found | phase fixed`. |
>
> ### Agent rules
>
> 1. **Never skip a phase.** Complete the checklist before moving on.
> 2. **Log every decision** in `DECISIONS.md` before implementing it.
> 3. **Update `CHANGELOG.md`** after every working commit-worthy chunk.
> 4. **Update `ARCHITECTURE.md`** at the end of each phase.
> 5. **Run tests** before marking a phase complete.
> 6. **No hardcoded secrets.** Everything in `.env`, loaded via config module.
> 7. **No placeholder code.** Every file must be functional for the current phase.
> 8. When facing a choice between two options, pick the simpler one and log why in `DECISIONS.md`.
> 9. Create and keep up to date a `PORTFOLIO.md` file used to explain the project to non technical readers.

---

## Project Overview

A full-stack document management app where users upload files (PDF, CSV, TXT), and chat with their content via LLM. The LLM provider is swappable at runtime via a UI toggle — no code changes needed.

### Core constraints

- **MVP scope only.** No feature creep. Ship a working loop: upload → extract → chat.
- MinIO as S3-compatible object storage (local dev). Swap to real S3 by changing env vars.
- DynamoDB Local for metadata. Swap to real DynamoDB by changing env vars.
- Docker Compose runs the full stack in one command.
- LLM provider (Claude, OpenAI, Mistral, Ollama) switchable via UI dropdown → stored in user preferences → backend reads it per request.

---

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast dev, type safety |
| Styling | Tailwind CSS | Rapid prototyping, consistent design |
| Backend | Node.js + Express + TypeScript | Same language as frontend, fast to build |
| Object Storage | MinIO (S3-compatible) | Local S3 replacement, same API |
| Database | DynamoDB Local | Key-value metadata, no schema migrations |
| Text extraction | `pdf-parse` (PDF), `csv-parse` (CSV), raw read (TXT) | Lightweight, no external services |
| Auth | JWT (access + refresh tokens) | Stateless, simple |
| LLM | Strategy pattern — see Phase 4 | Provider-agnostic by design |
| Containers | Docker + Docker Compose | One-command full stack |

---

## Folder Structure (target)

```
docchat/
├── docker-compose.yml
├── .env.example
├── docs/
│   ├── DECISIONS.md
│   ├── CHANGELOG.md
│   ├── ARCHITECTURE.md
│   ├── TODO.md
│   └── BUGS.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                  # Express app entry
│   │   ├── config/
│   │   │   └── env.ts                # Centralized env loading + validation
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   ├── errorHandler.ts       # Global error handler
│   │   │   └── upload.ts             # Multer config
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── document.routes.ts
│   │   │   └── chat.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── document.controller.ts
│   │   │   └── chat.controller.ts
│   │   ├── services/
│   │   │   ├── storage.service.ts     # MinIO/S3 abstraction
│   │   │   ├── document.service.ts    # Metadata CRUD (DynamoDB)
│   │   │   ├── extractor.service.ts   # PDF/CSV/TXT text extraction
│   │   │   ├── auth.service.ts        # JWT sign/verify
│   │   │   └── llm/
│   │   │       ├── llm.interface.ts   # ILLMProvider interface
│   │   │       ├── llm.factory.ts     # Factory: providerName → instance
│   │   │       ├── claude.provider.ts
│   │   │       ├── openai.provider.ts
│   │   │       ├── mistral.provider.ts
│   │   │       └── ollama.provider.ts
│   │   ├── models/
│   │   │   ├── document.model.ts      # DynamoDB document schema
│   │   │   └── user.model.ts          # DynamoDB user schema
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── chunk.ts               # Text chunking utility
│   └── tests/
│       ├── llm.factory.test.ts
│       ├── document.test.ts
│       └── chat.test.ts
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   └── client.ts              # Axios instance + interceptors
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useDocuments.ts
│   │   │   └── useChat.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DocumentsPage.tsx      # Upload + file list
│   │   │   └── ChatPage.tsx           # Conversational Q&A
│   │   ├── components/
│   │   │   ├── DropZone.tsx           # Drag-and-drop upload
│   │   │   ├── DocumentList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── LLMSelector.tsx        # Provider dropdown
│   │   │   └── Navbar.tsx
│   │   └── types/
│   │       └── index.ts
│   └── public/
└── README.md
```

---

## Phase 0 — Scaffolding & Infra

**Goal:** `docker-compose up` runs MinIO, DynamoDB Local, backend, and frontend. Nothing works yet, but everything starts.

### Checklist

- [ ] Create project root with folder structure
- [ ] Create `docs/` tracking files (DECISIONS, CHANGELOG, ARCHITECTURE, TODO, BUGS) with headers
- [ ] `docker-compose.yml` with 4 services:
  - `minio` — image: `minio/minio`, ports: 9000 (API) + 9001 (console), volume for persistence
  - `dynamodb` — image: `amazon/dynamodb-local`, port: 8000
  - `backend` — build from `./backend/Dockerfile`, port: 3001, depends_on: minio, dynamodb
  - `frontend` — build from `./frontend/Dockerfile`, port: 5173
- [ ] `.env.example` with all env vars documented (copy below)
- [ ] Backend: `npm init`, install express, typescript, ts-node-dev. Basic `index.ts` that logs "server running"
- [ ] Frontend: `npm create vite@latest` with React + TS template. Confirm it runs
- [ ] Both Dockerfiles working (multi-stage for prod, dev with hot-reload)
- [ ] Commit and log in CHANGELOG

### `.env.example`

```env
# MinIO / S3
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=docchat-documents
S3_REGION=us-east-1

# DynamoDB
DYNAMODB_ENDPOINT=http://dynamodb:8000
DYNAMODB_REGION=us-east-1

# Auth
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d

# LLM — API keys (only the one in use needs to be set)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
MISTRAL_API_KEY=
OLLAMA_BASE_URL=http://host.docker.internal:11434

# App
BACKEND_PORT=3001
FRONTEND_PORT=5173
NODE_ENV=development
```

---

## Phase 1 — Auth (JWT)

**Goal:** Users can register and login. Protected routes reject unauthenticated requests.

### Design

- Passwords hashed with `bcrypt`.
- JWT access token returned on login, stored in `localStorage` on frontend.
- Middleware `auth.ts` verifies token on protected routes.
- DynamoDB `Users` table: `PK = USER#<id>`, attributes: email, hashedPassword, name, createdAt, preferredLLM (default: "claude").

### Checklist

- [ ] Install: `bcrypt`, `jsonwebtoken`, `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`
- [ ] `config/env.ts` — load and validate all env vars with defaults, export typed config object
- [ ] `models/user.model.ts` — DynamoDB CRUD: createUser, getUserByEmail, updateUserPreferences
- [ ] `services/auth.service.ts` — hashPassword, comparePassword, signToken, verifyToken
- [ ] `routes/auth.routes.ts` — `POST /api/auth/register`, `POST /api/auth/login`
- [ ] `middleware/auth.ts` — extract Bearer token, verify, attach `req.user`
- [ ] `middleware/errorHandler.ts` — catch-all error handler with structured JSON responses
- [ ] Test: register → login → access protected route → verify 401 without token
- [ ] Frontend: `AuthContext`, `LoginPage`, `useAuth` hook, axios interceptor to attach token
- [ ] Log in DECISIONS why JWT over sessions (stateless, simpler for MVP)
- [ ] Update CHANGELOG, ARCHITECTURE

### API

```
POST /api/auth/register  { email, password, name }  → { token, user }
POST /api/auth/login      { email, password }          → { token, user }
```

---

## Phase 2 — File Upload & Storage

**Goal:** Authenticated users upload files (PDF, CSV, TXT). Files are stored in MinIO. Metadata saved in DynamoDB. Text is extracted and stored alongside metadata.

### Design

- Multer for multipart handling, max 20MB, allowed mimes: `application/pdf`, `text/csv`, `text/plain`.
- On upload: file → MinIO, metadata → DynamoDB, text extracted and stored in DynamoDB `extractedText` field.
- DynamoDB `Documents` table: `PK = DOC#<id>`, `GSI1PK = USER#<userId>`. Attributes: filename, mimeType, s3Key, uploadedAt, extractedText, sizeBytes.
- Text extraction via `extractor.service.ts` — strategy by mime type.

### Checklist

- [ ] Install: `multer`, `@aws-sdk/client-s3`, `pdf-parse`, `csv-parse`
- [ ] `services/storage.service.ts` — uploadFile(buffer, key), getFileUrl(key), deleteFile(key). Uses S3 SDK pointing at MinIO
- [ ] `services/extractor.service.ts` — extractText(buffer, mimeType) → string. PDF: pdf-parse. CSV: csv-parse → stringify rows. TXT: buffer.toString()
- [ ] `models/document.model.ts` — createDocument, getDocumentsByUser, getDocumentById, deleteDocument
- [ ] `controllers/document.controller.ts` — upload flow: validate → store in MinIO → extract text → save metadata in DynamoDB → return document info
- [ ] `routes/document.routes.ts` — `POST /api/documents` (upload), `GET /api/documents` (list), `GET /api/documents/:id`, `DELETE /api/documents/:id`
- [ ] Frontend: `DropZone.tsx` (react-dropzone), `DocumentList.tsx`, `DocumentsPage.tsx`, `useDocuments` hook
- [ ] Test: upload a PDF → verify in MinIO console (localhost:9001) → verify metadata in DynamoDB → verify extracted text
- [ ] Update CHANGELOG, ARCHITECTURE

### API

```
POST   /api/documents        multipart/form-data { file }  → { document }
GET    /api/documents                                        → { documents[] }
GET    /api/documents/:id                                    → { document }
DELETE /api/documents/:id                                    → { success }
```

---

## Phase 3 — Text Chunking

**Goal:** Extracted text is split into chunks suitable for LLM context windows. Chunks are stored in DynamoDB alongside the document.

### Design

- Simple sliding-window chunker: ~1000 tokens per chunk, ~200 token overlap.
- Chunks stored as a JSON array in the document record (field `chunks: string[]`).
- No vector DB for MVP — we do naive retrieval: pass all chunks of the selected document(s) to the LLM. This is fine for docs under ~50 pages.
- Log in DECISIONS.md: "No vector DB for MVP. Chunks are passed directly. Will add embedding-based retrieval in v2 if needed."

### Checklist

- [ ] `utils/chunk.ts` — `chunkText(text: string, maxTokens: number, overlapTokens: number): string[]`. Use simple word-count approximation (1 token ≈ 0.75 words)
- [ ] Update `document.controller.ts` upload flow: after extraction, chunk text, store chunks array in DynamoDB
- [ ] Add `GET /api/documents/:id/chunks` for debugging
- [ ] Test: upload a 10-page PDF, verify chunk count and overlap
- [ ] Update CHANGELOG

---

## Phase 4 — LLM Integration (Strategy Pattern)

**Goal:** Chat with documents. The LLM provider is determined by the user's saved preference (changeable via UI). Adding a new provider = one new file + one line in the factory.

### Design — Strategy Pattern

```
┌─────────────┐       ┌──────────────────┐
│  Controller  │──────▶│   LLMFactory     │
│  reads user  │       │  get(provider)   │
│  preference  │       └──────┬───────────┘
└─────────────┘              │ returns
                    ┌────────▼────────┐
                    │  ILLMProvider    │  ◄── interface
                    │  ask(ctx, q)    │
                    └────────┬────────┘
           ┌─────────┬──────┴──────┬───────────┐
           ▼         ▼            ▼           ▼
       Claude    OpenAI      Mistral      Ollama
```

#### `llm.interface.ts`

```typescript
export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface ILLMProvider {
  name: string;
  ask(systemPrompt: string, messages: LLMMessage[]): Promise<LLMResponse>;
}
```

#### `llm.factory.ts`

```typescript
import { ILLMProvider } from "./llm.interface";
import { ClaudeProvider } from "./claude.provider";
import { OpenAIProvider } from "./openai.provider";
import { MistralProvider } from "./mistral.provider";
import { OllamaProvider } from "./ollama.provider";

const providers: Record<string, () => ILLMProvider> = {
  claude:  () => new ClaudeProvider(),
  openai:  () => new OpenAIProvider(),
  mistral: () => new MistralProvider(),
  ollama:  () => new OllamaProvider(),
};

export function getLLMProvider(name: string): ILLMProvider {
  const factory = providers[name];
  if (!factory) throw new Error(`Unknown LLM provider: ${name}`);
  return factory();
}
```

#### Adding a new provider

1. Create `newprovider.provider.ts` implementing `ILLMProvider`
2. Add one line in `providers` map in `llm.factory.ts`
3. Done — no other file changes

### Chat flow

1. User sends `POST /api/chat` with `{ documentId, message, conversationHistory[] }`
2. Controller reads user's `preferredLLM` from DynamoDB
3. Controller fetches document chunks from DynamoDB
4. Builds system prompt: "You are a document assistant. Answer based on the following document content only: [chunks]"
5. Calls `getLLMProvider(preferredLLM).ask(systemPrompt, messages)`
6. Returns response to frontend

### Checklist

- [ ] `llm/llm.interface.ts` — interface as above
- [ ] `llm/llm.factory.ts` — factory as above
- [ ] `llm/claude.provider.ts` — uses `@anthropic-ai/sdk`
- [ ] `llm/openai.provider.ts` — uses `openai` npm package
- [ ] `llm/mistral.provider.ts` — uses `@mistralai/mistralai`
- [ ] `llm/ollama.provider.ts` — uses `ollama` npm package (or raw fetch to Ollama API)
- [ ] `controllers/chat.controller.ts` — chat flow as described
- [ ] `routes/chat.routes.ts` — `POST /api/chat`
- [ ] Unit test: mock provider, verify factory returns correct instance, verify chat flow builds correct prompt
- [ ] Log in DECISIONS.md: strategy pattern choice, why factory over DI container (simpler for MVP)
- [ ] Update CHANGELOG, ARCHITECTURE

### API

```
POST /api/chat  { documentId, message, history[] }  → { response, provider, model }
```

---

## Phase 5 — LLM Selector (Frontend)

**Goal:** User picks their LLM provider from a dropdown. Preference is saved to their profile and sent with each chat request.

### Design

- `LLMSelector.tsx` — dropdown in the navbar or chat page header. Options: Claude, OpenAI, Mistral, Ollama (local).
- On change: `PATCH /api/auth/preferences` → updates `preferredLLM` in DynamoDB.
- Chat page reads the current preference and displays it. No restart, no reload — just pick and chat.

### Checklist

- [ ] Backend: `PATCH /api/auth/preferences  { preferredLLM }` → update user record
- [ ] Backend: return `preferredLLM` in login/register response and `GET /api/auth/me`
- [ ] `GET /api/auth/me` — return current user info including preference
- [ ] Frontend: `LLMSelector.tsx` component
- [ ] Frontend: persist selection in AuthContext, call PATCH on change
- [ ] Frontend: show current provider in chat window header
- [ ] Test: switch provider, send message, verify response comes from correct provider
- [ ] Update CHANGELOG

---

## Phase 6 — Chat UI

**Goal:** Conversational interface. User selects a document, asks questions, sees streamed answers.

### Design

- `ChatPage.tsx` — left sidebar: document list. Main area: chat window.
- `ChatWindow.tsx` — message list + input. Conversation history kept in React state (no persistence for MVP).
- `MessageBubble.tsx` — user messages right-aligned, assistant left-aligned. Show provider badge on assistant messages.
- Streaming: for MVP, use simple request/response (no SSE). Log in DECISIONS.md: "No streaming for MVP — adds complexity for marginal UX gain at this stage. Add in v2."

### Checklist

- [ ] `ChatPage.tsx` — layout with document selector sidebar + chat area
- [ ] `ChatWindow.tsx` — message list, auto-scroll, loading indicator
- [ ] `MessageBubble.tsx` — styled bubbles with role + provider tag
- [ ] `useChat.ts` hook — manages history[], sends to `/api/chat`, appends response
- [ ] Input bar: text input + send button, enter to send, disable while loading
- [ ] Show which document is selected and which LLM is active
- [ ] Test: full flow — login → upload doc → select doc → chat → switch provider → chat again
- [ ] Update CHANGELOG, ARCHITECTURE

---

## Phase 7 — Dockerization & Polish

**Goal:** `docker-compose up --build` runs the entire app from zero. README explains setup in under 2 minutes.

### Checklist

- [ ] `backend/Dockerfile` — multi-stage: build TS → run JS. Use `node:20-alpine`
- [ ] `frontend/Dockerfile` — multi-stage: build Vite → serve with `nginx:alpine`
- [ ] `docker-compose.yml` — finalize all services, healthchecks, volume mounts, env_file
- [ ] Init script: auto-create MinIO bucket + DynamoDB tables on first run (use a `setup` service or entrypoint script)
- [ ] `README.md` — prerequisites, setup steps, screenshots placeholder, env var docs
- [ ] `.dockerignore` for both services
- [ ] Test: clone repo from scratch, `cp .env.example .env`, fill one API key, `docker-compose up --build` → working app
- [ ] Final pass on ARCHITECTURE.md — must reflect actual state
- [ ] Final CHANGELOG entry
- [ ] Clean up any TODO items in code (grep for TODO/FIXME)

---

## Phase Summary

| Phase | What | Estimated time |
|---|---|---|
| 0 | Scaffolding + Docker Compose | 2-3h |
| 1 | Auth (JWT + DynamoDB) | 4-5h |
| 2 | Upload + Storage + Extraction | 4-5h |
| 3 | Text Chunking | 1-2h |
| 4 | LLM Strategy Pattern | 3-4h |
| 5 | LLM Selector UI | 1-2h |
| 6 | Chat UI | 3-4h |
| 7 | Dockerization + Polish | 2-3h |
| **Total** | | **~20-28h** |

---

## Design Patterns Used

| Pattern | Where | Why |
|---|---|---|
| **Strategy** | LLM providers | Swap providers at runtime without touching call sites |
| **Factory** | `llm.factory.ts` | Centralized provider instantiation, single place to register new ones |
| **Repository** | `models/*.model.ts` | Isolate DynamoDB access from business logic |
| **Middleware chain** | Express middleware | Auth, error handling, upload parsing — composable and testable |
| **Adapter** | `storage.service.ts` | Abstract S3 API — MinIO in dev, AWS in prod, same interface |

---

## v2 Ideas (out of scope for MVP)

- Vector DB (Qdrant or Chroma) for embedding-based retrieval instead of passing all chunks
- SSE streaming for LLM responses
- Multi-document chat (select several docs, cross-reference)
- Conversation persistence in DynamoDB
- File preview (PDF viewer, CSV table)
- Rate limiting and usage tracking per provider
- OAuth (Google/GitHub) instead of email/password
