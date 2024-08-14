# cuiloa

A block explorer for [Penumbra](https://penumbra.zone/). Built with NextJS.

## Getting Started

Cuiloa uses **a monorepo** structure. For now, there are no packages and the only application is cuiloa itself (located in `apps/web`)

### Docker

A docker compose file is provided at the root of this project to stand up a postgresql container along with Cuiloa itself. **Please note** that this container does not provide CometBFT nor a full Penumbra node; to really use Cuiloa, you will need both of these things set up and running.

```
docker compose up
```

Then navigate to http://localhost:3000 to view the app.
If you want to set up the pieces manually, see below.

### Build & Run Locally

This project requires a modern version of NodeJS and uses [pnpm](https://pnpm.io/) and [turborepo](https://turbo.build/repo/docs) for managing and building the web application.

#### PostgreSQL

With a modern version of PostgreSQL, create a database and initialize it with the schema file provided by `cometbft` [here](https://github.com/cometbft/cometbft/blob/main/state/indexer/sink/psql/schema.sql). Assuming you've created a database `$DB_NAME` and you have user permissions for the database, You can load a schema file using `psql` with the following command:

```sh
psql -d $DB_NAME -f schema.sql
```

This will be our indexer that the block explorer uses for accessing information on blocks, events, and transactions that occur on the chain. 

With the database initialized, create an `.env` file in `apps/web/` with the database's URI, i.e.:
```sh .env
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:DB_PORT/DB_NAME?sslmode=disable"
```

You will also need this information for the `config.toml` file that `cometbft` will be initialized with when creating your own full node. More on that below.

#### Penumbra

You need to have a full node setup with penumbra (including `cometbft`) as detailed [here](https://guide.penumbra.zone/node/pd/join-network). **Post-main net**, when joining as a full node on the network, be mindful of bootstrapping your node with the most recent snapshot of the network, otherwise `pd` will probably crash whenever you try to run it. Alternatively, you can configure a full node on a devnet as explained [here](https://guide.penumbra.zone/dev/devnet-quickstart). **In either case**, you need to modify the `config.toml` file that is created by `pd` after generating your configuration files.

`config.toml` should be found under `$HOME/.penumbra/network_data/node0/cometbft/config/`. In this file, there is a heading `[tx_index]` with the configuration variable of `indexer = "kv"`. Using the URI of the database you created with PostgreSQL from the previous section, you need to update the section under `[tx_index]` to the following:

```toml
[tx_index]
indexer = "psql"
psql-conn = "$YOUR_DB_URI_HERE"
```
After you have updated this file, you should start the full node as instructed by the Penumbra guide. If everything was configured correctly, you should be able to open the database and inspect for Block and Transaction events. If there is no data, check the logs for `cometbft` for any errors with inserting data into the indexer.

#### NextJS

Remove or comment out the `output` property from `nextConfig` in cuiloa's [next.config.js](apps/web/next.config.js) file:

```js
const nextConfig = {
    // DELETE OR COMMENT OUT THIS LINE
   output: "standalone",
}
```

This is important for buildling cuiloa outside of a container environment. The application will not build, and will therefore not run, correctly without changing this line.

#### Running

A justfile has been provided for convenience for basic commands. Just run `just dev` to get started. Otherwise, run:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or whatever port that NextJS binds to) with your browser to see the website.

# Name

Pronounced *kwi-lo-a*, from the [Nahuatl Dictionary](https://nahuatl.wired-humanities.org/content/cuiloa):
> Principal English Translation:
> to write or paint; to record, as in a census.
> IPA: kwiloɑ

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
