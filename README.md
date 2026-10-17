# PrivateMind AI

**Local-first personal AI assistant for conversations, documents, and memories.**

PrivateMind AI is a privacy-focused workspace with a FastAPI backend and a
Next.js frontend. It runs locally by default and includes a deterministic demo
provider, so the application can be started without an API key or a downloaded
model.

## Features

- Conversational workspace with persistent conversations
- Document upload interface for `.txt`, `.md`, and `.pdf` files
- User-controlled memory CRUD
- Demo inference mode with no external API calls
- Optional Ollama inference for local models
- Optional OpenAI inference for users who explicitly provide an API key
- SQLite persistence in the local `data/` directory
- Health and diagnostics endpoints

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Inference:** Demo, Ollama, or OpenAI providers
- **Development:** Next.js Webpack mode and Uvicorn

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- npm
- Optional: [Ollama](https://ollama.com) for local model inference

## Quick Start on Windows

Open two PowerShell terminals from the repository root.

### 1. Configure the backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item ..\.env.example ..\.env
```

If PowerShell blocks activation scripts, run PowerShell as your user and enable
local scripts once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 2. Start the backend

In the first terminal:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

The backend is available at:

- API: <http://127.0.0.1:8000>
- Health check: <http://127.0.0.1:8000/api/health>
- Interactive API docs: <http://127.0.0.1:8000/docs>

### 3. Install and start the frontend

In the second terminal:

```powershell
cd frontend
npm install
npm run dev -- -p 3001
```

Open <http://localhost:3001>.

The frontend uses a same-origin `/backend-api` proxy during development, which
forwards requests to the backend on port `8000`. This avoids browser CORS
issues when the frontend runs on port `3001`.

## macOS and Linux

The backend commands are the same except for virtual environment activation:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
cp ../.env.example ../.env
python -m uvicorn main:app --reload --port 8000
```

In a second terminal:

```bash
cd frontend
npm install
npm run dev -- -p 3001
```

## Configuration

Configuration is read from the `.env` file in the repository root. Demo mode is
the default:

```env
INFERENCE_MODE=demo
```

### Ollama

1. Install Ollama.
2. Download a model:

   ```bash
   ollama pull llama3.2:3b
   ```

3. Update `.env`:

   ```env
   INFERENCE_MODE=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2:3b
   ```

4. Restart the backend.

All inference remains local when Ollama mode is enabled.

### OpenAI

To use an external OpenAI model, set the following values in `.env`:

```env
INFERENCE_MODE=openai
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4o-mini
```

Do not commit `.env` or API keys to source control.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check service, provider, and database status |
| `GET` | `/api/conversations` | List conversations |
| `POST` | `/api/conversations` | Create a conversation |
| `GET` | `/api/conversations/{id}` | Get a conversation |
| `POST` | `/api/conversations/{id}/messages` | Send a message |
| `GET` | `/api/documents` | List uploaded documents |
| `POST` | `/api/documents` | Upload a document |
| `GET` | `/api/memories` | List memories |
| `POST` | `/api/memories` | Create a memory |
| `PATCH` | `/api/memories/{id}` | Update a memory |
| `DELETE` | `/api/memories/{id}` | Delete a memory |

The complete interactive API reference is available at
<http://127.0.0.1:8000/docs> when the backend is running.

## Project Structure

```text
privatemind-ai/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Environment-backed settings
│   ├── database.py          # SQLAlchemy models and database setup
│   ├── providers/           # Demo, Ollama, and provider interfaces
│   ├── routers/             # Health, chat, document, and memory routes
│   └── test_main.py         # Backend API tests
├── frontend/
│   ├── app/                 # Next.js routes and global styles
│   ├── components/          # Chat and navigation components
│   ├── lib/api.ts           # Frontend API client
│   ├── postcss.config.mjs   # Tailwind/PostCSS configuration
│   └── tailwind.config.ts   # Tailwind content configuration
├── data/                    # Local runtime data, created automatically
├── .env.example             # Backend configuration template
└── README.md
```

## Testing and Validation

Run the backend tests:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m pytest -q
```

Build the frontend:

```powershell
cd frontend
npm run build
```

The frontend uses explicit Webpack commands because the current Windows
environment does not provide the native Turbopack bindings.

## Troubleshooting

### `Failed to fetch` in the browser

Make sure the backend is running on port `8000` and the frontend is running on
port `3001`. Verify the backend directly:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/api/health
```

Then restart the frontend and refresh the browser with `Ctrl+F5`.

### Port 8000 or 3001 is already in use

Stop the existing development server with `Ctrl+C`, or choose another port.
If the frontend uses a different port, its same-origin proxy still forwards to
the backend on port `8000`.

### Backend root returns `404`

The API routes are under `/api`. Use `/api/health` or `/docs` to verify the
backend. The root endpoint `/` returns a short service status when the current
backend process has loaded the latest source.

## Privacy and Security

- Data is stored locally in `./data/` by default.
- Demo mode makes no external inference calls.
- Ollama mode keeps inference on the local machine.
- OpenAI mode sends prompts to OpenAI only when explicitly enabled.
- Keep `.env`, API keys, and local database files out of Git.

## Current Status

### Implemented

- FastAPI backend and SQLite persistence
- Conversation and message APIs
- Demo and Ollama inference providers
- Chat interface
- Document upload interface
- Memory CRUD interface
- Settings and health checks
- Windows-compatible Webpack and Tailwind setup

### Planned

- PDF extraction and document chunking
- Embeddings and vector search
- Source attribution in responses
- Background document processing
- Tool execution framework
- Data export and import
- End-to-end Playwright tests

## Contributing

Contributions are welcome. Please keep changes focused, preserve the local-first
behavior, add or update tests for backend changes, and do not commit secrets or
local runtime data.

## License

MIT
