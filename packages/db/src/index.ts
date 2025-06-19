import { env } from '@repo/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

const db = drizzle({ client: pool });

export { db };