# Arzaq Real Estate — Arabic RTL marketing frontend (Next.js)

Public site for أرزاق العقارية. Next.js App Router, pnpm, TanStack Query + mocks, GSAP motion.

## Branches

| Branch       | Purpose            |
| ------------ | ------------------ |
| `production` | Production deploys |
| `staging`    | Staging / testing  |

## Scripts

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm build
pnpm start
```

## Env

Copy `.env.example` → `.env.local`. Mock mode defaults on (`NEXT_PUBLIC_MOCK_MODE=true`).

In Docker/Dokploy, set **runtime** `MOCK_MODE` / `API_URL` / `SITE_URL` / `DEMO_MODE` (or `NEXT_PUBLIC_*` aliases) and restart — no rebuild for those. See [`docs/frontend/integration.md`](docs/frontend/integration.md).

## Docker

```bash
docker build -t arzaq-frontend .
docker run --rm -p 3000:3000 \
  -e MOCK_MODE=false \
  -e API_URL=https://api.example.com \
  -e SITE_URL=https://example.com \
  arzaq-frontend
```

Uses Next.js `output: "standalone"`. Entrypoint promotes `NEXT_PUBLIC_*` → non-public names when unset.

## Docs

- Full integration: [`docs/README.md`](docs/README.md)
- Backend API handoff: [`docs/backend-docs/`](docs/backend-docs/)
