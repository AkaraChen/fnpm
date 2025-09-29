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

const preferredPM = 'pnpm' as const;

export type RepoKind = 'mono' | 'single' | 'unknown';

export interface RepoContext {
    root: string;
    pm: mt.PM;
    kind: RepoKind;
}

export interface WorkspaceContext extends RepoContext {
    projects: Project[];
    rootProject?: Project;
}

export interface CurrentPackageContext {
    rootDir: string;
    manifest: Project['manifest'];
    project?: Project;
}

function ResolveMonorepoRepoContext(cwd: string) {
    return Effect.gen(function* () {
        const findRootResult = yield* FindUpRoot(cwd);
        const root = yield* findRootResult;
        const pm = yield* Effect.orElse(DetectPMByLock(root), () =>
            Effect.succeed(preferredPM)
        );
        return {
            root,
            pm,
            kind: 'mono' as const,
        } satisfies RepoContext;
    });
}

function ResolveSingleRepoContext(cwd: string) {
    return Effect.gen(function* () {
        const root = yield* PackageDirectory({ cwd });
        const pm = yield* Effect.orElse(DetectPMByLock(root), () =>
            Effect.succeed(preferredPM)
        );
        return {
            root,
            pm,
            kind: 'single' as const,
        } satisfies RepoContext;
    });
}

export async function resolveRepoContext(cwd: string): Promise<RepoContext> {
    const program = pipe(
        ResolveMonorepoRepoContext(cwd),
        Effect.orElse(() => ResolveSingleRepoContext(cwd)),
        Effect.catchAll(() =>
            Effect.succeed({
                root: cwd,
                pm: preferredPM,
                kind: 'unknown' as const,
            } satisfies RepoContext)
        )
    );
    return await Effect.runPromise(program);
}

function createProjectFromManifest(
    root: string,
    manifest: Project['manifest']
) {
    return {
        rootDir: root as ProjectRootDir,
        rootDirRealPath: root as ProjectRootDirRealPath,
        manifest,
        writeProjectManifest() {
            throw new Error('Not implemented');
        },
    } satisfies Project;
}

type WorkspaceInput = string | RepoContext;

export async function resolveWorkspaceContext(
    input: WorkspaceInput
): Promise<WorkspaceContext> {
    const repo =
        typeof input === 'string' ? await resolveRepoContext(input) : input;

    if (repo.kind === 'unknown') {
        throw new Error('Unable to resolve workspace from unknown repository');
    }

    if (repo.kind === 'mono') {
        const program = Effect.gen(function* () {
            const projects = yield* ScanProjects(repo.root, repo.pm);
            const rootProject = projects.find((p) => p.rootDir === repo.root);
            return {
                ...repo,
                projects,
                rootProject,
            } satisfies WorkspaceContext;
        });
        return await Effect.runPromise(program);
    }

    const program = Effect.gen(function* () {
        const manifest = yield* ReadPackage({ cwd: repo.root });
        const project = createProjectFromManifest(
            repo.root,
            manifest as Project['manifest']
        );
        return {
            ...repo,
            projects: [project],
            rootProject: project,
        } satisfies WorkspaceContext;
    });
    return await Effect.runPromise(program);
}

export interface ResolveCurrentPackageOptions {
    workspace?: WorkspaceContext;
}

export async function resolveCurrentPackage(
    cwd: string,
    options: ResolveCurrentPackageOptions = {}
): Promise<CurrentPackageContext> {
    const program = Effect.gen(function* () {
        const rootDir = yield* Effect.orElse(PackageDirectory({ cwd }), () =>
            Effect.succeed(cwd)
        );
        const manifest = yield* ReadPackage({ cwd: rootDir });
        const project = options.workspace?.projects.find(
            (p) => p.rootDir === rootDir
        );
        return {
            rootDir,
            manifest: manifest as Project['manifest'],
            project,
        } satisfies CurrentPackageContext;
    });

    return await Effect.runPromise(program);
}
