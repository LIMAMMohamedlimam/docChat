# Changelog

All notable changes to DocChat will be documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [0.3.0] — 2026-06-03 — Phase 2 & 3: File Upload, Storage, Extraction & Chunking

### Added
- `backend/src/middleware/upload.ts` — Multer config: memory storage, 20 MB limit, PDF/CSV/TXT allowlist
- `backend/src/services/storage.service.ts` — MinIO/S3 adapter: uploadFile, getFileUrl (presigned), deleteFile
- `backend/src/services/extractor.service.ts` — extractText: pdf-parse for PDF, csv-parse for CSV, UTF-8 decode for TXT
- `backend/src/utils/chunk.ts` — chunkText: sliding-window word splitter (~1000 token windows, ~200 token overlap)
- `backend/src/models/document.model.ts` — DynamoDB Documents table with UserDocumentsIndex GSI; createDocument, getDocumentsByUser, getDocumentById, updateDocumentChunks, deleteDocument
- `backend/src/controllers/document.controller.ts` — upload flow: validate → MinIO → extract → chunk → DynamoDB; list, get (with presigned URL), getChunks, delete
- `backend/src/routes/document.routes.ts` — POST/GET/DELETE /api/documents, GET /api/documents/:id/chunks
- `backend/tests/document.test.ts` — 4 chunkText tests; all passing (7 total across both suites)
- `frontend/src/hooks/useDocuments.ts` — fetch, upload (multipart), delete with optimistic UI updates
- `frontend/src/components/DropZone.tsx` — react-dropzone with accept/size validation and drag feedback
- `frontend/src/components/DocumentList.tsx` — file list with type badge, size, date, delete, clickable selection
- `frontend/src/pages/DocumentsPage.tsx` — upload zone + document list; clicking a document navigates to /chat/:id

### Changed
- `backend/src/index.ts` — wired document routes, Documents table init on startup

---

## [0.2.0] — 2026-06-03 — Phase 1: Auth (JWT)

### Added
- `backend/src/config/env.ts` — centralized env loading with typed config object and defaults
- `backend/src/utils/logger.ts` — structured JSON logger (info/warn/error)
- `backend/src/models/user.model.ts` — DynamoDB Users table: createUser, getUserByEmail, getUserById, updateUserPreferences; auto-creates table with EmailIndex GSI on startup
- `backend/src/services/auth.service.ts` — hashPassword (bcrypt, 12 rounds), comparePassword, signToken, verifyToken
- `backend/src/middleware/auth.ts` — Bearer token extraction and JWT verification; attaches `req.user`
- `backend/src/middleware/errorHandler.ts` — global Express error handler with structured JSON responses; `createError` helper
- `backend/src/controllers/auth.controller.ts` — register, login, me, updatePreferences
- `backend/src/routes/auth.routes.ts` — POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, PATCH /api/auth/preferences
- `backend/tests/auth.test.ts` — 3 tests covering hash/compare and sign/verify; all passing
- `frontend/src/api/client.ts` — Axios instance with base URL, Bearer token interceptor, 401 redirect
- `frontend/src/context/AuthContext.tsx` — login, register, logout, updatePreferredLLM; restores session from localStorage on mount
- `frontend/src/hooks/useAuth.ts` — re-exports useAuthContext
- `frontend/src/pages/LoginPage.tsx` — login/register form with toggle, validation, error display
- `frontend/src/components/Navbar.tsx` — top nav with user email and sign-out
- `frontend/src/App.tsx` — React Router v6 with protected routes and auth-aware redirects

### Changed
- `backend/src/index.ts` — wired auth routes, global error handler, DynamoDB table init on startup

---

## [0.1.0] — 2026-06-03 — Phase 0: Scaffolding & Infra

### Added
- Full project folder structure (backend, frontend, docs)
- `docs/DECISIONS.md` — architectural decision records
- `docker-compose.yml` with 4 services: minio, dynamodb-local, backend, frontend; healthchecks, volume persistence
- `.env.example` with all environment variables documented
- Backend — Express + TypeScript skeleton with `/health` endpoint
- Frontend — React 18 + TypeScript + Vite + Tailwind skeleton
- `frontend/src/types/index.ts` — shared TypeScript types
- `.dockerignore` for both services
