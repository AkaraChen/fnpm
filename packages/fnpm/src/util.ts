import path from 'node:path';
import { type PM, findUpRoot } from '@akrc/monorepo-tools';
import { detectPMByLock } from '@akrc/monorepo-tools';
import { consola } from 'consola';
import { execa } from 'execa';
import { loadJsonFile } from 'load-json-file';
import { packageUp } from 'package-up';
import { parse as parsePackageName } from 'parse-package-name';
import type { PackageJson } from 'type-fest';
import { hideBin } from 'yargs/helpers';

export function exec(shell: string, cwd?: string) {
    return execa({
        shell: true,
        stdio: 'inherit',
        cwd,
    })`${shell}`.catch((err) => {
        error(err);
    });
}

export function error(message: string) {
    consola.error(message);
    process.exit(1);
}

export async function getContext(cwd: string) {
    const hasWFlag = process.argv[2] === '-w';
    if (hasWFlag) {
        process.argv.splice(2, 1);
    }
    const args = hideBin(process.argv);
    const lockDir = await findLockDir(cwd);
    if (!lockDir) {
        return {
            root: cwd,
            pm: preferredPM,
            args,
        };
    }
    const pm = await detectPM(lockDir);
    const root = hasWFlag
        ? lockDir
        : path.dirname(await packageUp().then((v) => v!));
    return {
        root,
        pm,
        args,
    };
}

async function findLockDir(cwd: string) {
    for (const pm of ['pnpm', 'yarn', 'npm'] as PM[]) {
        try {
            return await findUpRoot(cwd, pm);
        } catch {}
    }
    const pkg = await packageUp();
    if (pkg) {
        return path.dirname(pkg);
    }
}

// TODO: make this configurable
const preferredPM = 'pnpm' as const;

async function detectPM(dir: string) {
    try {
        return detectPMByLock(dir);
    } catch {}
    return preferredPM;
}

export async function readPackageJson(cwd: string) {
    const pkgPath = await packageUp({
        cwd,
    });
    if (!pkgPath) {
        error('No package.json found');
    }
    const pkg: PackageJson = await loadJsonFile(pkgPath as string);
    return pkg;
}

export function normalizePackageVersion(input: string) {
    const parsed = parsePackageName(input);
    return parsed.version ? input : `${input}@latest`;
}

export function noop() {}
