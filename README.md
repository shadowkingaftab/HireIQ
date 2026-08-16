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

```bash
# Backend
cd proofhire/backend
pip install -r requirements.txt
uvicorn proofhire.backend.app.main:app --reload

# Frontend
cd proofhire/frontend
npm install
npm run dev
```

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Security](./security/SECURITY.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT
