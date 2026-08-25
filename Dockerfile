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
# Optional build-time fallback for metadataBase only. Mock/API/media/demo
# for the data layer are resolved at container runtime — do not bake them here.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Runtime (Dokploy Environment / compose). Prefer non-public names; NEXT_PUBLIC_*
# aliases are promoted by docker-entrypoint.sh. Restart container after changes
# — no image rebuild needed for mock/API/site/demo logos.
ENV SITE_URL=
ENV API_URL=
ENV MOCK_MODE=
ENV MEDIA_HOST=
ENV USE_MOCKS=
ENV MOCK_DELAY=
ENV MOCK_STATE=
ENV DEMO_MODE=
ENV NEXT_PUBLIC_SITE_URL=
ENV NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_MOCK_MODE=
ENV NEXT_PUBLIC_MEDIA_HOST=
ENV NEXT_PUBLIC_USE_MOCKS=
ENV NEXT_PUBLIC_MOCK_DELAY=
ENV NEXT_PUBLIC_MOCK_STATE=
ENV NEXT_PUBLIC_DEMO_MODE=

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chmod=755 docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
