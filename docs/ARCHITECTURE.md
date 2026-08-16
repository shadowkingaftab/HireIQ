# Architecture

## Overview

ProofHire is a hiring intelligence platform built with FastAPI backend and React frontend. The system is organized into:

- Backend: `proofhire/backend/app/`
- Frontend: `proofhire/frontend/`
- Docs: `proofhire/docs/`

## Backend Layers

- `routers/` - API endpoints
- `services/` - business logic
- `repositories/` - data access
- `models/` - SQLAlchemy ORM models
- `contracts/` - Pydantic schemas
- `ai/` - LLM and embedding services
- `evidence/` - evidence aggregation and provenance
- `skill_graph/` - skill relationship graph
- `matching/` - candidate-job matching
- `assessment/` - adaptive assessments
- `workers/` - async background jobs
- `execution/` - workflow execution engine

## Frontend Layers

- `pages/` - route-level pages
- `components/` - reusable UI components
- `features/` - feature slices with state and API
- `services/` - API clients
- `store/` - global state (Zustand)
- `hooks/` - React Query hooks
- `graph/` - skill graph visualization helpers
