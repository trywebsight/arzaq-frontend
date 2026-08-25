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

In Docker/Dokploy, put `MOCK_MODE` / `API_URL` / `SITE_URL` / `DEMO_MODE` (or `NEXT_PUBLIC_*` aliases) in **both** Environment and **Build Time Arguments**, then redeploy. See [`docs/frontend/integration.md`](docs/frontend/integration.md).

## Docker

```bash
docker build -t arzaq-frontend \
  --build-arg DEMO_MODE=true \
  --build-arg SITE_URL=https://example.com \
  --build-arg MOCK_MODE=false \
  --build-arg API_URL=https://api.example.com \
  .
docker run --rm -p 3000:3000 arzaq-frontend
```

Uses pnpm in the builder (BuildKit cache, not in the image) and Next.js `output: "standalone"` for the running container. After deploy, prune leftovers with `scripts/docker-host-cleanup.sh` on the host.

## Docs

- Full integration: [`docs/README.md`](docs/README.md)
- Backend API handoff: [`docs/backend-docs/`](docs/backend-docs/)
