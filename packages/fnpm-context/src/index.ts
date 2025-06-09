import type * as mt from '@akrc/monorepo-tools';
import type {
    Project,
    ProjectRootDir,
    ProjectRootDirRealPath,
} from '@pnpm/types';
import { Effect, pipe } from 'effect';
import {
    DetectPMByLock,
    FindUpRoot,
    PackageDirectory,
    ReadPackage,
    ScanProjects,
} from 'fnpm-utils';

export interface RawContext {
    root: string;
    pm: mt.PM;
    projects: Project[];
    rootProject?: Project;
    isMonoRepo: boolean;
}

const prefferedPM = 'pnpm' as const;

function ResolveMonorepoContext(cwd: string) {
    return Effect.gen(function* () {
        const findRootResult = yield* FindUpRoot(cwd);
        const root = yield* findRootResult;
        return yield* Effect.gen(function* () {
            const pm = yield* Effect.orElse(DetectPMByLock(root), () =>
                Effect.succeed(prefferedPM),
            );
            const projects = yield* ScanProjects(root, pm);
            const rootProject = projects.find((p) => p.rootDir === root)!;
            return {
                root: root,
                pm,
                projects,
                rootProject,
                isMonoRepo: true,
            } as RawContext;
        });
    });
}

function ResolveSingleRepoContext(cwd: string) {
    return Effect.gen(function* () {
        const root = yield* PackageDirectory({ cwd });
        const pm = yield* Effect.orElse(DetectPMByLock(root), () =>
            Effect.succeed(prefferedPM),
        );
        const manifest = yield* ReadPackage({
            cwd: root,
        });
        const rootProject: Project = {
            rootDir: root as ProjectRootDir,
            rootDirRealPath: root as ProjectRootDirRealPath,
            manifest: manifest as Project['manifest'],
            writeProjectManifest() {
                throw new Error('Not implemented');
            },
        };
        const projects: Project[] = [rootProject];
        return {
            root,
            pm,
            projects,
            rootProject,
            isMonoRepo: false,
        } as RawContext;
    });
}

export async function resolveContext(cwd: string): Promise<RawContext> {
    const program = pipe(
        ResolveMonorepoContext(cwd),
        Effect.orElse(() => ResolveSingleRepoContext(cwd)),
        Effect.catchAll((e) => Effect.die(`Failed to resolve context: ${e}`)),
    );
    return await Effect.runPromise(program);
}
