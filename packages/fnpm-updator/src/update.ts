import { Effect } from 'effect';
import type { Context, SafeContext } from 'fnpm-context';
import { getDep } from 'fnpm-toolkit';
import { ReadPackage } from 'fnpm-utils';
import { type RunOptions, run } from 'npm-check-updates';
import path from 'pathe';
import type { UpdateManifest } from './types';

function resolveWorkspace(ctx: Context, filePath: string) {
    const dir = path.dirname(filePath);
    return path.resolve(ctx.root, dir);
}

function ResolvePackage(ctx: Context, filePath: string) {
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

function TransformInfo(updates: Record<string, string>, root: string) {
    return Effect.gen(function* () {
        const result: UpdateManifest[] = [];
        const info = updates as Record<string, string>;
        const pkg = yield* ReadPackage({ cwd: root });
        for (const [name, latest] of Object.entries(info).filter(
            ([name]) => !pmNames.includes(name),
        )) {
            const current = getDep(pkg, name)!.version!;
            if (!current) continue;
            result.push({ name, current, latest });
        }
        return result;
    });
}

export function Update(ctx: SafeContext) {
    return Effect.gen(function* () {
        const updates = yield* Run({
            workspaces: ctx.isMonoRepo,
            cwd: ctx.root,
            install: 'never',
            silent: true,
        });
        if (!updates) {
            throw new Error('Invalid updates args');
        }
        const result: Record<string, UpdateManifest[]> = {};
        if (ctx.isMonoRepo) {
            const info = updates as Record<string, Record<string, string>>;
            for (const [workspace, deps] of Object.entries(info)) {
                const pkg = yield* ResolvePackage(ctx, workspace);
                const manifests = yield* TransformInfo(
                    deps,
                    resolveWorkspace(ctx, workspace),
                );
                result[pkg.name!] = manifests;
            }
            return result;
        }
        const info = updates as Record<string, string>;
        const manifests = yield* TransformInfo(info, ctx.root);
        result[ctx.rootProject!.manifest.name!] = manifests;
        return result;
    });
}
