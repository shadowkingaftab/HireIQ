# Frontend

## Setup

```bash
cd proofhire/frontend
npm install
npm run dev
```

## Stack

- React 18
- React Router 6
- TanStack Query v5
- Zustand for global state
- Recharts + D3 for analytics
- react-force-graph-2d for skill graph
- Tailwind CSS
- Vite

## Structure

- `pages/` - route-level components
- `components/` - shared UI components
- `features/` - feature slices with state/API
- `services/` - API clients
- `store/` - global Zustand stores
- `hooks/` - custom React Query hooks
- `graph/` - skill graph visualization
- `design-system/` - tokens and primitives
- `utils/` - helpers
- `types/` - TypeScript-like shape docs

## Routing

- Public: `/`, `/login`, `/signup`, `/pricing`, `/privacy`, `/terms`
- Candidate: `/dashboard`, `/profile`, `/applications`
- Recruiter: `/recruiter`, `/recruiter/analytics`, `/jobs`
- Admin: `/admin`

## State

- Server state: TanStack Query
- Client state: Zustand
- Auth: JWT in localStorage
