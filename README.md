# ProofHire

Evidence-first hiring intelligence platform. It helps candidates demonstrate capability through verifiable work and gives recruiters an explainable way to search, compare, assess, and hire talent.

## Features

- Evidence-first candidate profiles
- Skill graph and capability inference
- Explainable candidate-job matching
- Adaptive assessments
- GitHub and resume ingestion
- Team collaboration
- Analytics and reporting

## Quick Start

Run these in two terminals from the repository root. These commands use the
root `backend` and `frontend` folders; `proofhire/` is a separate nested checkout.

```bash
# Terminal 1: backend
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

```bash
# Terminal 2: frontend
cd frontend
npm install
npm run dev
```

If you want to expose the app through ngrok, start the frontend first, then run:

```bash
ngrok http 3000
```

The Vite dev server listens on 0.0.0.0 and accepts ngrok hostnames, so the tunnel can reach the app without the "ERR_NGROK_8012" refusal error.

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Security](./security/SECURITY.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT
