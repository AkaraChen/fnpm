import type * as mt from '@akrc/monorepo-tools';
import type {
    Project,
    ProjectRootDir,
    ProjectRootDirRealPath,
} from '@pnpm/types';
import { Effect, Option } from 'effect';
import { DetectPMByLock, FindUpRoot, ScanProjects } from './lib/mt';
import { PackageDirectory, ReadPackage } from './lib/pkg';

export interface RawContext {
    root: string;
    pm: mt.PM;
    projects: Project[];
    rootProject?: Project;
    isMonoRepo: boolean;
}

const prefferedPM = 'pnpm' as const;

export async function resolveContext(cwd: string): Promise<RawContext> {
    const program = Effect.gen(function* () {
        const findRootResult = yield* FindUpRoot(cwd);
        if (Option.isSome(findRootResult)) {
            const root = Option.getOrNull(findRootResult)!;
            return yield* Effect.gen(function* () {
                const pm = yield* Effect.orElse(DetectPMByLock(root), () =>
                    Effect.succeed(prefferedPM),
                );
                const projects = yield* ScanProjects(root, pm);
                const rootProject = projects.find((p) => p.rootDir === root)!;
                return {
                    root,
                    pm,
                    projects,
                    rootProject,
                    isMonoRepo: true,
                } as RawContext;
            });
        }

        return yield* Effect.gen(function* () {
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
    }).pipe(
        Effect.catchAll(() => {
            return Effect.succeed({
                root: cwd,
                pm: 'pnpm',
                projects: [],
                isMonoRepo: false,
            } as RawContext);
        }),
    );
    return await Effect.runPromise(program);
}
