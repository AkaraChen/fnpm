import { getDep } from 'fnpm-toolkit';
import { run } from 'npm-check-updates';
import path from 'pathe';
import { readPackage } from 'read-pkg';
import type { RawContext } from './context';

function resolveWorkspace(ctx: RawContext, filePath: string) {
    const dir = path.dirname(filePath);
    return path.resolve(ctx.root, dir);
}

async function resolvePackage(ctx: RawContext, filePath: string) {
    const dir = resolveWorkspace(ctx, filePath);
    return await readPackage({ cwd: dir });
}

export interface UpdateManifest {
    name: string;
    current: string;
    latest: string;
}

const pmNames = ['npm', 'yarn', 'pnpm'];

async function transformInfo(
    updates: Record<string, string>,
    root: string,
): Promise<UpdateManifest[]> {
    const result: UpdateManifest[] = [];
    const info = updates as Record<string, string>;
    const pkg = await readPackage({ cwd: root });
    for (const [name, latest] of Object.entries(info).filter(
        ([name]) => !pmNames.includes(name),
    )) {
        const current = getDep(pkg, name)?.version;
        if (!current)
            throw new Error(`Dependency ${name} not found in root package`);
        result.push({ name, current, latest });
    }
    return result;
}

export const update = async (
    ctx: RawContext,
): Promise<Record<string, UpdateManifest[]>> => {
    const updates = await run({
        workspaces: ctx.isMonoRepo,
        cwd: ctx.root,
        install: 'never',
        silent: true,
    });
    if (!update) {
        throw new Error('Invalid update info');
    }
    const result: Record<string, UpdateManifest[]> = {};
    if (ctx.isMonoRepo) {
        const info = updates as Record<string, Record<string, string>>;
        for (const [workspace, deps] of Object.entries(info)) {
            const pkg = await resolvePackage(ctx, workspace);
            const manifests = await transformInfo(
                deps,
                resolveWorkspace(ctx, workspace),
            );
            result[pkg.name] = manifests;
        }
        return result;
    }
    const info = updates as Record<string, string>;
    const manifests = await transformInfo(info, ctx.root);
    result[ctx.rootProject!.manifest.name!] = manifests;
    return result;
};
