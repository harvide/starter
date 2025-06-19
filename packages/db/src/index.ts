import { config } from '@repo/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: config.db.url,
});

const db = drizzle({ client: pool });

export { db };