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

update-cometbft-schema:
  curl -o deploy/postgres-cometbft-schema.sql -sSf "https://raw.githubusercontent.com/cometbft/cometbft/v0.37.2/state/indexer/sink/psql/schema.sql"

containers:
  podman-compose down
  sleep 1
  podman-compose up --remove-orphans --force-recreate --renew-anon-volumes
