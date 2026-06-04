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

**Context:** Need to support multiple LLM providers switchable at runtime without changing call sites.

**Options considered:**
- DI container (inversify) — powerful but heavy, requires decorators + metadata
- Simple factory function + strategy interface — one function, one interface, no extra deps

**Decision:** Factory function (`llm.factory.ts`) + `ILLMProvider` interface. Adding a new provider = create one file implementing `ILLMProvider` + add one line to the `providers` map.

**Rationale:** Simpler than a DI container for MVP. The factory is 10 lines; inversify would add ~100 lines of boilerplate and a tsconfig flag. The interface keeps every call site provider-agnostic.

---

## [2026-06-03] Lazy client initialization in LLM providers

**Context:** Provider classes (Claude, OpenAI, Mistral) instantiate SDK clients that validate API keys at construction time. Factory tests run without real keys set.

**Options considered:**
- Eagerly instantiate in constructor (simple but breaks tests without keys)
- Lazy-initialize the client on first `ask()` call

**Decision:** Lazy initialization — `private client: SDK | null = null`, instantiated in a `getClient()` helper on first use.

**Rationale:** Constructing a provider should not require a live API key — only calling `ask()` does. This also defers any network/auth validation to the actual request, which is the correct boundary.

---

## [2026-06-03] Prompt caching on Claude provider

**Context:** The system prompt (document chunks) is large and identical across turns in a conversation.

**Options considered:**
- Send system prompt without cache_control (re-billed each turn)
- Use Anthropic `cache_control: { type: "ephemeral" }` on the system prompt block

**Decision:** Apply `cache_control: ephemeral` to the system prompt block in every Claude request.

**Rationale:** Caches the document context for up to 5 minutes. In a multi-turn conversation this reduces input token cost by ~90% after the first turn. Zero code complexity cost.
