import { Effect } from 'effect';
import type { WorkspaceContext } from 'fnpm-context';
import { getDep } from 'fnpm-toolkit';
import { ReadPackage } from 'fnpm-utils-node';
import { type RunOptions, run } from 'npm-check-updates';
import path from 'pathe';
import type { UpdateManifest } from './types';

/**
 * Compute the absolute workspace directory that contains the given file path.
 *
 * @param ctx - Workspace context whose `root` is used as the workspace root
 * @param filePath - Path to a file (can be relative); the containing directory within the workspace is resolved
 * @returns The absolute path to the workspace directory containing `filePath`
 */
function resolveWorkspace(ctx: WorkspaceContext, filePath: string) {
    const dir = path.dirname(filePath);
    return path.resolve(ctx.root, dir);
}

/**
 * Read the package manifest for the workspace that contains the given file path.
 *
 * @param ctx - The workspace context used to resolve the workspace root
 * @param filePath - A file path inside the target workspace
 * @returns The package manifest for the resolved workspace
 */
function ResolvePackage(ctx: WorkspaceContext, filePath: string) {
    const dir = resolveWorkspace(ctx, filePath);
    return ReadPackage({ cwd: dir });
}

function Run(options: RunOptions) {
    return Effect.tryPromise({
        try: () => run(options),
        catch: (err) => Effect.die(`Failed to run ncu: ${err}`),
    });
}

const pmNames = ['npm', 'yarn', 'pnpm'];

/**
 * Builds a list of dependency update descriptors for a package at a given root.
 *
 * Reads the package manifest at `root`, filters `updates` to exclude known package-manager keys, and produces an array of UpdateManifest entries for dependencies that exist in the package, including their current and latest versions. Dependencies that are not present in the manifest or lack a current version are skipped.
 *
 * @param updates - Mapping from dependency name to the discovered latest version
 * @param root - Filesystem path of the package directory whose manifest should be read
 * @returns An array of UpdateManifest objects each containing `name`, `current`, and `latest` fields
 */
function TransformInfo(updates: Record<string, string>, root: string) {
    return Effect.gen(function* () {
        const result: UpdateManifest[] = [];
        const info = updates as Record<string, string>;
        const pkg = yield* ReadPackage({ cwd: root });
        for (const [name, latest] of Object.entries(info).filter(
            ([name]) => !pmNames.includes(name)
        )) {
            const current = getDep(pkg, name)!.version!;
            if (!current) continue;
            result.push({ name, current, latest });
        }
        return result;
    });
}

/**
 * Run package update detection for the given workspace and produce per-package update manifests.
 *
 * @param ctx - Workspace context containing `root`, `kind`, and optional `rootProject` used to determine workspace mode and resolve packages
 * @returns A record mapping package names to arrays of `UpdateManifest` describing current and latest versions for each dependency
 * @throws If the underlying update runner returns no updates
 */
export function Update(ctx: WorkspaceContext) {
    return Effect.gen(function* () {
        const updates = yield* Run({
            workspaces: ctx.kind === 'mono',
            cwd: ctx.root,
            install: 'never',
            silent: true,
        });
        if (!updates) {
            throw new Error('Invalid updates args');
        }
        const result: Record<string, UpdateManifest[]> = {};
        if (ctx.kind === 'mono') {
            const info = updates as Record<string, Record<string, string>>;
            for (const [workspace, deps] of Object.entries(info)) {
                const pkg = yield* ResolvePackage(ctx, workspace);
                const manifests = yield* TransformInfo(
                    deps,
                    resolveWorkspace(ctx, workspace)
                );
                result[pkg.name!] = manifests;
            }
            return result;
        }
        const info = updates as Record<string, string>;
        const manifests = yield* TransformInfo(info, ctx.root);
        result[ctx.rootProject?.manifest.name ?? ''] = manifests;
        return result;
    });
}
