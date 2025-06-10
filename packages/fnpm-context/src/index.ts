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
} from 'fnpm-utils-node';

export type SafeContext = {
    root: string;
    pm: mt.PM;
    projects: Project[];
    rootProject?: Project;
    isMonoRepo: boolean;
};

export type Context =
    | SafeContext
    | {
          root: string;
          pm: mt.PM;
          isMonoRepo: false;
      };

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
            } as Context;
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
        } as Context;
    });
}

export async function resolveContext(cwd: string): Promise<Context> {
    const program = pipe(
        ResolveMonorepoContext(cwd),
        Effect.orElse(() => ResolveSingleRepoContext(cwd)),
        Effect.catchAll(() =>
            Effect.succeed({
                root: cwd,
                pm: prefferedPM,
                isMonoRepo: false,
            } satisfies Context),
        ),
    );
    return await Effect.runPromise(program);
}

export function safeContext(context: Context): SafeContext {
    if (!('projects' in context)) {
        throw new Error('Invalid context');
    }
    return context;
}
