import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const dbPath = path.join(process.env.HOME!, 'xnpm', 'db.sqlite3');

export function ensureDb() {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
