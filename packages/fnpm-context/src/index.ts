import type {
    Project,
    ProjectRootDir,
    ProjectRootDirRealPath,
} from '@pnpm/types';
import type { PM } from '@akrc/monorepo-tools';
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
    pm: PM;
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

/**
 * Resolve a monorepo repository context by locating the repository root from the given directory.
 *
 * @param cwd - Path to start searching for the monorepo root
 * @returns A RepoContext whose `root` is the discovered monorepo root, `pm` is the detected package manager (falls back to the preferred PM `'pnpm'` if detection fails), and `kind` is `'mono'`.
 */
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

/**
 * Resolve a single-repository context starting from the given working directory.
 *
 * @param cwd - The directory to start resolving the package root from
 * @returns A `RepoContext` with `root` set to the repository root, `pm` set to the detected package manager (defaults to `pnpm` when detection fails), and `kind` equal to `"single"`.
 */
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

/**
 * Resolve the repository context for a given working directory, detecting monorepo or single-repo layout and falling back to an unknown context if detection fails.
 *
 * @param cwd - The directory to start resolution from; used to locate the repository root.
 * @returns The resolved RepoContext containing `root`, detected package manager `pm`, and `kind` ("mono", "single", or "unknown").
 */
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

/**
 * Create a minimal Project object from a package manifest and root path.
 *
 * @param root - Filesystem path of the project's root directory
 * @param manifest - Package manifest (package.json) content for the project
 * @returns A Project-compatible object with `rootDir`, `rootDirRealPath`, `manifest`, and a `writeProjectManifest` method that throws an `Error` when called
 */
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

/**
 * Resolve a workspace context from a filesystem path or an existing repository context.
 *
 * @param input - The workspace input: either a directory path to resolve or an existing RepoContext.
 * @returns A WorkspaceContext containing repository info, discovered projects, and the optional `rootProject`.
 * @throws Error when the repository kind cannot be resolved (`'unknown'`).
 */
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

/**
 * Resolve the current package context for a given working directory, optionally linking it to a workspace.
 *
 * @param cwd - The directory to resolve the package from; used as a fallback if a package root cannot be determined.
 * @param options - Optional settings.
 * @param options.workspace - A workspace context whose projects will be searched for a matching project by root directory.
 * @returns An object containing:
 *  - `rootDir`: the resolved package root directory (falls back to `cwd` when a package root is not found),
 *  - `manifest`: the package manifest for `rootDir`,
 *  - `project` (optional): the workspace project whose `rootDir` equals the resolved `rootDir`, if any.
 */
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
