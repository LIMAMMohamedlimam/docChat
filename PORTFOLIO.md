# DocChat — Portfolio Overview

## What is this?

DocChat is a web application that lets you upload documents (PDFs, spreadsheets, text files) and have a conversation with them using AI. Instead of reading through a long PDF yourself, you just ask it questions in plain language and get answers instantly.

## Who is it for?

Anyone who regularly works with documents: researchers, lawyers, analysts, students — anyone who wants to extract insights from files without reading every page.

## What problem does it solve?

Reading and searching through large documents is time-consuming. DocChat connects your files directly to a large language model (AI), so you can ask "What are the key findings?" or "What does the contract say about termination?" and get a clear answer in seconds.

## Key features

- **Upload any document** — PDFs, CSVs, and text files are all supported
- **Chat with your documents** — conversational Q&A powered by AI
- **Switch AI providers** — choose between Claude (Anthropic), GPT (OpenAI), Mistral, or a local Ollama model from a dropdown — no technical knowledge needed
- **Secure** — files are stored in your own private cloud storage; access requires login
- **One-command setup** — the entire application (frontend, backend, database, file storage) starts with a single command: `docker-compose up`

## How does it work (simplified)?

1. You upload a document
2. The app extracts all the text from it and breaks it into manageable pieces
3. When you ask a question, the relevant text is sent to the AI model you've chosen
4. The AI reads the text and answers your question

## Technology choices (in plain English)

| What | How | Why |
|---|---|---|
| Web interface | React | Fast, modern browser app |
| Server | Node.js + Express | Handles file uploads and talks to the AI |
| File storage | MinIO (local) / AWS S3 (cloud) | Stores the actual PDF/CSV/TXT files |
| Database | DynamoDB | Stores user accounts and document metadata |
| AI providers | Claude, OpenAI, Mistral, Ollama | Interchangeable — one switch in the UI |
| Infrastructure | Docker Compose | Everything runs with one command |

## Current status

Phase 0 complete — infrastructure scaffolded. The app starts but has no functionality yet. Building auth, file upload, and chat in subsequent phases.

## Roadmap

| Phase | What gets built |
|---|---|
| 1 | Login and registration |
| 2 | File upload and text extraction |
| 3 | Text chunking for AI context |
| 4 | AI chat integration |
| 5 | AI provider switcher UI |
| 6 | Full chat interface |
| 7 | Production-ready Docker setup |
