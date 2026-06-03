# Architecture Decision Records

## [2026-06-03] JWT over sessions for authentication

**Context:** Need stateless auth for the backend API.

**Options considered:**
- Server-side sessions (requires session store, stateful)
- JWT access tokens (stateless, portable)

**Decision:** JWT access tokens stored in localStorage on the frontend.

**Rationale:** Simpler for MVP — no session store needed, works naturally with a REST API.

---

## [2026-06-03] No vector DB for MVP

**Context:** Documents need to be queryable by the LLM.

**Options considered:**
- Embedding-based retrieval with Qdrant/Chroma
- Pass all chunks directly in the LLM context

**Decision:** Pass all chunks directly. No vector DB.

**Rationale:** Documents under ~50 pages fit in modern LLM context windows. Vector DB adds infra complexity with marginal benefit at MVP scale. Will add in v2 if needed.

---

## [2026-06-03] No SSE streaming for MVP

**Context:** LLM responses could be streamed token-by-token for better UX.

**Options considered:**
- Server-Sent Events streaming
- Simple request/response

**Decision:** Simple request/response for MVP.

**Rationale:** Streaming adds complexity (SSE setup, frontend buffering) for marginal UX gain at this stage. Add in v2.

---

## [2026-06-03] Strategy + Factory pattern for LLM providers

**Context:** Need to support multiple LLM providers switchable at runtime.

**Options considered:**
- DI container (inversify)
- Simple factory function + strategy interface

**Decision:** Factory function (`llm.factory.ts`) + `ILLMProvider` interface.

**Rationale:** Simpler than a DI container for MVP. Adding a new provider = one new file + one line in the factory map.
