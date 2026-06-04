# TODO

## Phase 0 — Scaffolding & Infra
- [x] Create project root with folder structure
- [x] Create `docs/` tracking files with headers
- [x] `docker-compose.yml` with 4 services
- [x] `.env.example` with all env vars documented
- [x] Backend: npm init, install deps, basic index.ts
- [x] Frontend: Vite + React + TS template
- [x] Both Dockerfiles working
- [x] Log in CHANGELOG

## Phase 1 — Auth (JWT)
- [x] Install: bcrypt, jsonwebtoken, @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb
- [x] config/env.ts
- [x] models/user.model.ts
- [x] services/auth.service.ts
- [x] routes/auth.routes.ts + controllers/auth.controller.ts
- [x] middleware/auth.ts
- [x] middleware/errorHandler.ts
- [x] Tests: hash/compare + sign/verify (3 passing)
- [x] Frontend: AuthContext, LoginPage, useAuth hook, axios interceptor
- [x] Log in DECISIONS and CHANGELOG

## Phase 2 — File Upload & Storage
- [x] Install: multer, @aws-sdk/client-s3, pdf-parse, csv-parse
- [x] services/storage.service.ts
- [x] services/extractor.service.ts
- [x] models/document.model.ts
- [x] controllers/document.controller.ts
- [x] routes/document.routes.ts
- [x] Frontend: DropZone, DocumentList, DocumentsPage, useDocuments
- [x] Log in CHANGELOG

## Phase 3 — Text Chunking
- [x] utils/chunk.ts
- [x] Upload flow chunks text and stores in DynamoDB
- [x] GET /api/documents/:id/chunks
- [x] Tests: chunkText (4 passing)

## Phase 4 — LLM Integration
- [x] llm/llm.interface.ts
- [x] llm/llm.factory.ts
- [x] llm/claude.provider.ts (prompt caching, lazy client)
- [x] llm/openai.provider.ts (lazy client)
- [x] llm/mistral.provider.ts (lazy client)
- [x] llm/ollama.provider.ts (raw fetch)
- [x] controllers/chat.controller.ts
- [x] routes/chat.routes.ts
- [x] Unit tests: factory (5 tests), 12 total passing
- [x] Log in DECISIONS

## Phase 5 — LLM Selector UI
- [x] Backend: PATCH /api/auth/preferences (done in Phase 1)
- [x] Backend: GET /api/auth/me (done in Phase 1)
- [x] Frontend: LLMSelector.tsx — dropdown with spinner, disables during save
- [x] Frontend: integrated in Navbar; AuthContext.updatePreferredLLM already wired

## Phase 6 — Chat UI
- [ ] ChatPage.tsx (full implementation)
- [ ] ChatWindow.tsx
- [ ] MessageBubble.tsx
- [ ] useChat.ts hook
- [ ] Input bar with loading state

## Phase 7 — Dockerization & Polish
- [ ] Multi-stage Dockerfiles
- [ ] Init script for MinIO bucket + DynamoDB tables
- [ ] README.md final pass
- [ ] .dockerignore for both services
- [ ] Final ARCHITECTURE.md pass
- [ ] Clean up TODO/FIXME in code
