import pg from "pg";
const { Pool, types } = pg;

// By default we assume that the `DATABASE_URL` connection string parsing is sufficient.
// It fails, however, when pointed out at URL for a managed Postgres db hosted by DigitalOcean.
//
// Therefore let's provide an opt-in method of providing a CA for the cert info.
// In order to use a DO managed DB URL, you must prune the `?sslmode=require` from the connection string!
// This is documented here: https://node-postgres.com/features/ssl#usage-with-connectionstring
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {},
  // If a CA certificate was specified as an env var, pass that info to the database config.
  // Be advised that if CA_CERT is set, then DATABASE_URL must *lack* an `sslmode` param!
  ...(process.env.CA_CERT != null && {
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERT,
      },
  }),
};

// Construct the db connection.
const pool = new Pool(dbConfig);

types.setTypeParser(types.builtins.DATE, (val: string) => val);
types.setTypeParser(types.builtins.INT8, (val: string) => BigInt(val));

/**
 * `getClient` returns a Promise<pg.PoolClient> open and perform transactions against the DB.
 * Any consumer of this function *must* call .release() on the client after they are finished
 * querying the database.
 * Taken directly from: https://node-postgres.com/guides/project-structure
 */
export const getPgClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error("A client has been checked out for more than 5 seconds!");
    // @ts-expect-error lastQuery isn't defined on client, it's monkey patched here.
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);
  // monkey patch the query method to keep track of the last query executed
  // @ts-expect-error Modifying .query to also include the last used parameters.
  client.query = (...args) => {
    // @ts-expect-error lastQuery isn't defined on client, it's monkey patched here.
    client.lastQuery = args;
    // @ts-expect-error re-applying args to the monkey-patched version of client.query.
    return query.apply(client, args);
  };
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout);
    // set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
};
