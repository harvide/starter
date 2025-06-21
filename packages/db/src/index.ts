import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as auth from './schema/auth'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const db = drizzle({
    client: pool
});

const schema = {
    auth,
}

export { db, schema };