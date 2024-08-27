import * as mt from '@akrc/monorepo-tools';
import type {
    Project,
    ProjectRootDir,
    ProjectRootDirRealPath,
} from '@pnpm/types';
import { packageDirectory } from 'pkg-dir';
import { readPackage } from 'read-pkg';

export interface RawContext {
    root: string;
    pm: mt.PM;
    projects: Project[];
    rootProject: Project;
    isMonoRepo: boolean;
}

export async function resolveContext(cwd: string): Promise<RawContext> {
    const root = await mt.findRepoRoot(cwd);
    if (await mt.isRoot(root)) {
        const pm = mt
            .detectPMByLock(root)
            .expect('Could not determine package manager');
        const projects = await mt.scanProjects(root, pm);
        const rootProject = projects.find((p) => p.rootDir === root)!;
        return { root, pm, projects, rootProject, isMonoRepo: true };
    }
    const pkgDir = await packageDirectory({ cwd });
    if (!pkgDir) {
        throw new Error('Could not find package.json');
    }
    const pm = mt
        .detectPMByLock(pkgDir)
        .expect('Could not determine package manager');
    const projects: Project[] = [
        {
            rootDir: pkgDir as ProjectRootDir,
            rootDirRealPath: pkgDir as ProjectRootDirRealPath,
            manifest: (await readPackage({ cwd })) as any,
            writeProjectManifest: {} as any,
        },
    ];
    const rootProject = projects[0] as Project;
    return { root: pkgDir, pm, projects, rootProject, isMonoRepo: false };
}
