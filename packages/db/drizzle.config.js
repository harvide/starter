// todo require is not define while using ts
const path = require('node:path');
const { config } = require('dotenv');
const { defineConfig } = require('drizzle-kit');

config({ path: path.resolve(__dirname, '../../.env') });

module.exports = defineConfig({
  schema: './src/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
