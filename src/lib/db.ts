/*
 Instantiate a global reference to Prisma that doesn't exhaust DB connections in development environments due to NextJS's caching behavior.
 Taken directly from Prisma docs: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 Everyday a new bug is invented for a solved problem.
*/
import { PrismaClient } from "@prisma/client";
import pg from "pg";
const { Pool, types } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["query"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
};

// db === prisma
const db = globalForPrisma.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
