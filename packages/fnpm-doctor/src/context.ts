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
    const findResult = await mt.findUpRoot(cwd).result();
    if (findResult.isOk()) {
        const root = findResult.unwrap();
        const pm = mt.detectPMByLock(root).mapOr('pnpm', x => x);
        const projects = (await mt.scanProjects(root, pm).result()).expect('No projects found');
        const rootProject = projects.find(p => p.rootDir === root)!;
        return {
            root,
            pm,
            projects,
            rootProject,
            isMonoRepo: true
        }
    }
    const root = await packageDirectory({ cwd });
    if (!root) {
        throw new Error('No package.json found');
    }
    const pm = mt.detectPMByLock(root).unwrap();
    const rootProject: Project = {
        rootDir: root as ProjectRootDir,
        rootDirRealPath: root as ProjectRootDirRealPath,
        manifest: (await readPackage({
            cwd: root,
        })) as Project["manifest"],
        writeProjectManifest() {
            throw new Error("Not implemented");
        },
    };
    const projects: Project[] = [
        rootProject,
    ]
    return {
        root,
        pm,
        projects,
        rootProject,
        isMonoRepo: false
    }
}
