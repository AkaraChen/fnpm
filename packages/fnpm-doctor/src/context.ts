import * as mt from '@akrc/monorepo-tools';

export interface RawContext {
    root: string;
    pm: mt.PM;
    projects: Awaited<ReturnType<typeof mt.scanProjects>>;
}

export async function resolveContext(cwd: string): Promise<RawContext> {
    const root = await mt.findRepoRoot(cwd);
    const pm = mt
        .detectPMByLock(root)
        .expect('Could not determine package manager');
    const projects = await mt.scanProjects(root, pm);
    return { root, pm, projects };
}
