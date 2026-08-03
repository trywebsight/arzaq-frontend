# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time public env (override in CI / compose as needed).
# For staging hosts, prefer runtime SITE_URL on the runner (below) so the
# public origin is not baked into the image — never commit ephemeral test hosts.
ARG NEXT_PUBLIC_SITE_URL=https://arzaq.com.kw
ARG NEXT_PUBLIC_MOCK_MODE=true
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_MOCK_MODE=$NEXT_PUBLIC_MOCK_MODE \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Optional runtime override for metadataBase / og:image absolute URLs.
# Example: -e SITE_URL=https://example.com
ENV SITE_URL=

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
