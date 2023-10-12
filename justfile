default:
  just --list

dev:
  npm run dev

build:
  npm run build

start:
  npm run start

lint:
  npm run lint

# Download the postgres db schema for CometBFT event indexing. See docs at
# https://docs.cometbft.com/v0.37/app-dev/indexing-transactions#postgresql
update-cometbft-schema:
  curl -o deploy/postgres-cometbft-schema.sql -sSf "https://raw.githubusercontent.com/cometbft/cometbft/v0.37.2/state/indexer/sink/psql/schema.sql"

container:
  podman build -t ghcr.io/penumbra-zone/cuiloa .
