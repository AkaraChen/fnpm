import path from 'node:path';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/db/schema.ts',
    out: './drizzle',
    dbCredentials: {
        url: path.join(process.env.HOME!, 'xnpm', 'db.sqlite3'),
    },
});
