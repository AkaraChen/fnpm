import * as mt from '@akrc/monorepo-tools';
import type { Project } from '@pnpm/types';

export interface RawContext {
    root: string;
    pm: mt.PM;
    projects: Project[];
    rootProject: Project;
}

export async function resolveContext(cwd: string): Promise<RawContext> {
    const root = await mt.findRepoRoot(cwd);
    const pm = mt
        .detectPMByLock(root)
        .expect('Could not determine package manager');
    const projects = await mt.scanProjects(root, pm);
    const rootProject = projects.find((p) => p.rootDir === root)!;
    return { root, pm, projects, rootProject };
}
