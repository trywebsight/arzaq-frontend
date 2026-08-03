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

## Docker

```bash
docker build -t arzaq-frontend .
docker run --rm -p 3000:3000 arzaq-frontend
```

Uses Next.js `output: "standalone"`.

## Docs

- Full integration: [`docs/README.md`](docs/README.md)
- Backend API handoff: [`docs/backend-docs/`](docs/backend-docs/)
