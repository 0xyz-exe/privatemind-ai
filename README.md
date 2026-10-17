# PrivateMind AI

**Local-First Personal AI Assistant**

Privacy-first personal AI workspace combining conversational AI, document RAG, persistent memory, and controlled task execution.

## Features

- 💬 **Conversational Workspace** - Chat interface with persistent conversations
- 📚 **Document Knowledge Base** - Upload .txt, .md, .pdf for RAG
- 🧠 **Personal Memory System** - User-controlled persistent context
- 🔒 **Privacy-First** - All data stored locally, optional local inference
- ⚙️ **Flexible Inference** - Demo mode (free), Ollama (local), or external APIs

## Architecture

- **Backend**: Python + FastAPI + SQLite + SQLAlchemy
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Inference**: Pluggable providers (Demo/Ollama/OpenAI)
- **Vector Search**: ChromaDB (local)
- **Embeddings**: sentence-transformers (local)

## Prerequisites

- Python 3.10+
- Node.js 18+
- (Optional) Ollama for local inference

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
pip install -r requirements.txt
cp ../.env.example ../.env
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # If exists, or create manually
```

### Configuration

Edit `.env` in project root:

```bash
# Demo mode (no setup required)
INFERENCE_MODE=demo

# OR Ollama (local, private)
# INFERENCE_MODE=ollama
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3.2:3b

# OR OpenAI (external API, requires key)
# INFERENCE_MODE=openai
# OPENAI_API_KEY=sk-...
```

## Development

Terminal 1 - Backend:
```bash
cd backend
source venv/Scripts/activate
uvicorn main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Demo Mode

Default configuration. No API keys, no model downloads. Provides deterministic simulated responses. Perfect for testing UI and workflows.

## Local Inference with Ollama

1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3.2:3b`
3. Set `INFERENCE_MODE=ollama` in `.env`
4. Restart backend

All inference runs locally. No external API calls.

## Project Structure

```
privatemind-ai/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── database.py       # SQLAlchemy models
│   ├── config.py         # Settings
│   ├── providers/        # Inference adapters
│   │   ├── base.py
│   │   ├── demo.py
│   │   └── ollama.py
│   └── routers/          # API endpoints
│       ├── health.py
│       ├── chat.py
│       ├── documents.py
│       └── memories.py
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   └── lib/              # API client
└── data/                 # Local storage (created on first run)
```

## API Endpoints

- `GET /api/health` - System status
- `GET/POST /api/conversations` - Conversation management
- `POST /api/conversations/{id}/messages` - Send message
- `GET/POST /api/documents` - Document library
- `GET/POST/PATCH/DELETE /api/memories` - Memory management

## Privacy & Security

- **Local-first**: All data in `./data/` directory
- **Demo mode**: Zero external calls
- **Ollama mode**: All inference local
- **OpenAI mode**: Prompts sent to OpenAI (user must opt-in)
- No telemetry, no analytics, no tracking

## Current Implementation Status

### ✅ Completed (MVP Core)
- Backend API structure
- Database models (Conversation, Message, Document, Memory)
- Demo inference provider
- Ollama inference provider
- Frontend chat interface
- Sidebar navigation
- Document upload UI
- Memory CRUD UI
- Settings/diagnostics page
- Health checks

### 🚧 In Progress (Document RAG)
- PDF text extraction
- Chunking pipeline
- Embedding generation
- Vector search integration
- Source attribution in responses

### 📋 Planned
- Tool execution framework
- Background document processing
- Advanced retrieval strategies
- Export/import user data
- E2E tests with Playwright

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend (when implemented)
cd frontend
npm test
```

## License

MIT

## Contributing

This is an MVP demonstration. Focus: correctness, security, privacy.
