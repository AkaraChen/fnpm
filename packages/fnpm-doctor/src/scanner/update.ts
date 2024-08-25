import { Effect } from 'effect';
import { run } from 'npm-check-updates';
import path from 'pathe';
import { readPackage } from 'read-pkg';
import type { Context } from '../context';
import type { Scanner } from './scanner';

interface UpdateMeta {
    workspaces: string[];
    version: string;
}

function resolveWorkspace(ctx: Context, filePath: string) {
    const dir = path.dirname(filePath);
    return ctx.resolve(dir);
}

export const update: Scanner = (ctx) => {
    return Effect.promise(async () => {
        const info = await run({
            workspaces: true,
            cwd: ctx.root,
            install: 'never',
            silent: true,
        });
        if (!info) {
            return;
        }
        const map = new Map<string, UpdateMeta>();
        for (const [workspace, deps] of Object.entries(
            info as Record<string, Record<string, string>>,
        )) {
            for (const [dep, version] of Object.entries(deps)) {
                map.set(dep, {
                    workspaces: [
                        ...(map.get(dep)?.workspaces || []),
                        workspace,
                    ],
                    version,
                });
            }
        }
        for (const [dep, meta] of map) {
            const workspaces = await Promise.all(
                meta.workspaces.map(async (w) => {
                    const path = resolveWorkspace(ctx, w);
                    const pkg = await readPackage({ cwd: path });
                    return pkg.name;
                }),
            );
            ctx.report({
                level: 'info',
                title: `Dependency ${dep} can be updated`,
                description: `Dependency ${dep} can be updated to ${meta.version} in workspaces ${workspaces.join(
                    ', ',
                )}`,
                scope: 'dependencies',
            });
        }
    });
};
