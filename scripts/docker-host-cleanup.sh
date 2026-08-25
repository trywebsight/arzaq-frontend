#!/bin/sh
set -eu

# Run on the Docker host after a deploy (Dokploy SSH / GitHub redeploy).
# Drops stopped containers, unused images (including old arzaq tags), and
# BuildKit cache. Running containers keep their images. Volumes are left
# alone (Postgres, uploads, etc.).

docker container prune -f
docker image prune -af
docker builder prune -af
