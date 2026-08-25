#!/bin/sh
set -eu

# Promote Dokploy / compose NEXT_PUBLIC_* runtime env into server-readable
# names when the non-prefixed form is unset. Code prefers MOCK_MODE, API_URL,
# SITE_URL, MEDIA_HOST, DEMO_MODE, etc. — those are never baked into the JS bundle.

export MOCK_MODE="${MOCK_MODE:-${NEXT_PUBLIC_MOCK_MODE-}}"
export USE_MOCKS="${USE_MOCKS:-${NEXT_PUBLIC_USE_MOCKS-}}"
export API_URL="${API_URL:-${NEXT_PUBLIC_API_URL-}}"
export MEDIA_HOST="${MEDIA_HOST:-${NEXT_PUBLIC_MEDIA_HOST-}}"
export SITE_URL="${SITE_URL:-${NEXT_PUBLIC_SITE_URL-}}"
export MOCK_DELAY="${MOCK_DELAY:-${NEXT_PUBLIC_MOCK_DELAY-}}"
export MOCK_STATE="${MOCK_STATE:-${NEXT_PUBLIC_MOCK_STATE-}}"
export DEMO_MODE="${DEMO_MODE:-${NEXT_PUBLIC_DEMO_MODE-}}"

exec "$@"
