import { eq } from 'drizzle-orm';
import { db } from './db';
import { projects } from './db/schema';

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export async function createProject(newProject: NewProject) {
    const result = await db.insert(projects).values(newProject).returning();
    return result[0];
}

export async function getProjectById(id: number) {
    return await db.query.projects.findFirst({
        where: eq(projects.id, id),
    });
}

export async function findProjects() {
    return await db.query.projects.findMany();
}

export async function updateProject(
    id: number,
    updatedFields: Partial<NewProject>,
) {
    const result = await db
        .update(projects)
        .set(updatedFields)
        .where(eq(projects.id, id))
        .returning();
    return result[0];
}

export async function deleteProject(id: number) {
    const result = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning();
    return result[0];
}
