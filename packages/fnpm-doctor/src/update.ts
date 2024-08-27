import { getDep } from 'fnpm-toolkit';
import { run } from 'npm-check-updates';
import path from 'pathe';
import { readPackage } from 'read-pkg';
import { type RawContext, resolveContext } from './context';

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

export const update = async (ctx: RawContext) => {
    const info = (await run({
        workspaces: true,
        cwd: ctx.root,
        install: 'never',
        silent: true,
    })) as Record<string, Record<string, string>>;
    if (!info) {
        return;
    }
    const result: Record<string, UpdateManifest[]> = {};
    for (const [workspace, deps] of Object.entries(info)) {
        const pkg = await resolvePackage(ctx, workspace);
        const manifests: Array<UpdateManifest> = [];
        for (const [name, latest] of Object.entries(deps).filter(
            ([name]) => getDep(pkg, name) !== null,
        )) {
            const current = getDep(pkg, name)?.version;
            if (!current)
                throw new Error(`Dependency ${name} not found in ${workspace}`);
            manifests.push({ name, current, latest });
        }
        result[pkg.name] = manifests;
    }
    return result;
};
