import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    path: text('path').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(strftime('%s', 'now'))`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
        sql`(strftime('%s', 'now'))`
    ),
});
