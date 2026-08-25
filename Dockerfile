# syntax=docker/dockerfile:1
#
# Dokploy:
# - Leave "Docker Build Stage" empty so the small `runner` image is what runs.
# - Put env keys in Environment AND Build Time Arguments (ARG is per-stage).
# - If Advanced → Patches rewrites this file, delete that patch or keep it in
#   sync — a stale pnpm patch is what broke the last deploy.

FROM node:20-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1 \
    PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-arzaq,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG SITE_URL
ARG API_URL
ARG MOCK_MODE
ARG MEDIA_HOST
ARG USE_MOCKS
ARG MOCK_DELAY
ARG MOCK_STATE
ARG DEMO_MODE
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MOCK_MODE
ARG NEXT_PUBLIC_MEDIA_HOST
ARG NEXT_PUBLIC_USE_MOCKS
ARG NEXT_PUBLIC_MOCK_DELAY
ARG NEXT_PUBLIC_MOCK_STATE
ARG NEXT_PUBLIC_DEMO_MODE

ENV SITE_URL=$SITE_URL \
    API_URL=$API_URL \
    MOCK_MODE=$MOCK_MODE \
    MEDIA_HOST=$MEDIA_HOST \
    USE_MOCKS=$USE_MOCKS \
    MOCK_DELAY=$MOCK_DELAY \
    MOCK_STATE=$MOCK_STATE \
    DEMO_MODE=$DEMO_MODE \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_MOCK_MODE=$NEXT_PUBLIC_MOCK_MODE \
    NEXT_PUBLIC_MEDIA_HOST=$NEXT_PUBLIC_MEDIA_HOST \
    NEXT_PUBLIC_USE_MOCKS=$NEXT_PUBLIC_USE_MOCKS \
    NEXT_PUBLIC_MOCK_DELAY=$NEXT_PUBLIC_MOCK_DELAY \
    NEXT_PUBLIC_MOCK_STATE=$NEXT_PUBLIC_MOCK_STATE \
    NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE

RUN chmod +x docker-entrypoint.sh \
  && ./docker-entrypoint.sh pnpm build

FROM base AS runner
ARG SITE_URL
ARG API_URL
ARG MOCK_MODE
ARG MEDIA_HOST
ARG USE_MOCKS
ARG MOCK_DELAY
ARG MOCK_STATE
ARG DEMO_MODE
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MOCK_MODE
ARG NEXT_PUBLIC_MEDIA_HOST
ARG NEXT_PUBLIC_USE_MOCKS
ARG NEXT_PUBLIC_MOCK_DELAY
ARG NEXT_PUBLIC_MOCK_STATE
ARG NEXT_PUBLIC_DEMO_MODE

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    SITE_URL=$SITE_URL \
    API_URL=$API_URL \
    MOCK_MODE=$MOCK_MODE \
    MEDIA_HOST=$MEDIA_HOST \
    USE_MOCKS=$USE_MOCKS \
    MOCK_DELAY=$MOCK_DELAY \
    MOCK_STATE=$MOCK_STATE \
    DEMO_MODE=$DEMO_MODE \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_MOCK_MODE=$NEXT_PUBLIC_MOCK_MODE \
    NEXT_PUBLIC_MEDIA_HOST=$NEXT_PUBLIC_MEDIA_HOST \
    NEXT_PUBLIC_USE_MOCKS=$NEXT_PUBLIC_USE_MOCKS \
    NEXT_PUBLIC_MOCK_DELAY=$NEXT_PUBLIC_MOCK_DELAY \
    NEXT_PUBLIC_MOCK_STATE=$NEXT_PUBLIC_MOCK_STATE \
    NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates wget \
  && rm -rf /var/lib/apt/lists/* \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chmod=755 docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
