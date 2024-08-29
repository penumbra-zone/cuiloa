set dotenv-load

default:
  just --list

dev:
  pnpm dev

build:
  @echo "INFO: Remember to set the proper env variables in apps/web/.env before building for turbo to pickup."
  pnpm build

start: build
  pnpm start:web

lint:
  pnpm lint

pgtyped-cli:
  cd apps/web && @echo "Starting pgtyped with DATABASE_URL: $DATABASE_URL"
  cd apps/web && pnpx pgtyped -w -c pgtyped.config.json

# Download the postgres db schema for CometBFT event indexing. See docs at
# https://docs.cometbft.com/v0.37/app-dev/indexing-transactions#postgresql
update-cometbft-schema:
  curl -o deploy/postgres-cometbft-schema.sql -sSf "https://raw.githubusercontent.com/cometbft/cometbft/v0.37.2/state/indexer/sink/psql/schema.sql"

# Build the webapp container image
container:
  podman build -t ghcr.io/penumbra-zone/cuiloa -f apps/web/Containerfile .

# Build, then run the webapp container image. Uses local env vars.
run-container:
  podman run -e DATABASE_URL -e APP_URL -e PENUMBRA_GRPC_ENDPOINT -p 3000:3000 -it ghcr.io/penumbra-zone/cuiloa

compose:
  docker compose up

podman-compose:
  podman compose down || true
  podman-compose up --build --abort-on-container-exit --force-recreate --renew-anon-volumes --remove-orphans --pull-always
