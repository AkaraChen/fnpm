import path from 'node:path';
import { type PM, findUpRoot } from '@akrc/monorepo-tools';
import { detectPMByLock } from '@akrc/monorepo-tools';
import { consola } from 'consola';
import { execa } from 'execa';
import { packageUp } from 'package-up';

export function exec(shell: string) {
    return execa({
        shell: true,
        stdio: 'inherit',
    })`${shell}`.catch((err) => {
        error(err);
    });
}

export function error(message: string) {
    consola.error(message);
    process.exit(1);
}

export async function findProjectRoot(cwd: string) {
    for (const pm of ['pnpm', 'yarn', 'npm'] as PM[]) {
        try {
            return await findUpRoot(cwd, pm);
        } catch {}
    }
    const pkg = await packageUp();
    if (pkg) {
        return path.dirname(pkg);
    }
    consola.warn('No project root found');
}

export async function detectPM(dir: string) {
    const root = await findProjectRoot(dir);
    if (root) {
        try {
            return detectPMByLock(root);
        } catch {}
    }
    return 'npm';
}
