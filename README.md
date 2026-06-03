# DocChat

A full-stack document management app where you upload files (PDF, CSV, TXT) and chat with their content via LLM. Switch between Claude, OpenAI, Mistral, or a local Ollama model from the UI — no code changes needed.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)
- At least one LLM API key (Anthropic, OpenAI, or Mistral) — or a running [Ollama](https://ollama.ai) instance

## Quick start

```bash
git clone <repo-url> docchat
cd docchat

# Copy and fill in your API key(s)
cp .env.example .env

# Start everything
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| MinIO Console | http://localhost:9001 (user: minioadmin / minioadmin) |
| DynamoDB Local | http://localhost:8000 |

## Environment variables

See [`.env.example`](.env.example) for all variables. The minimum required:

```env
JWT_SECRET=<any-random-string>
ANTHROPIC_API_KEY=<your-key>   # or OPENAI_API_KEY / MISTRAL_API_KEY
```

## Project structure

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full folder layout and data flow diagram.

## Development

```bash
# Backend only (with hot-reload)
cd backend && npm run dev

# Frontend only (with hot-reload)
cd frontend && npm run dev
```

## Documentation

| File | Contents |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Folder structure, data flow, component map, API surface |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Architectural decision records |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Version history |
| [`docs/TODO.md`](docs/TODO.md) | Remaining tasks by phase |
| [`PORTFOLIO.md`](PORTFOLIO.md) | Non-technical project overview |
