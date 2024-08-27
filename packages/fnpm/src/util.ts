import path from 'node:path';
import { findUpRoot } from '@akrc/monorepo-tools';
import { detectPMByLock } from '@akrc/monorepo-tools';
import { consola } from 'consola';
import { execa } from 'execa';
import { loadJsonFile } from 'load-json-file';
import { packageUp } from 'package-up';
import { parse as parsePackageName } from 'parse-package-name';
import type { PackageJson } from 'type-fest';
import { hideBin } from 'yargs/helpers';

export interface ExecOptions {
    cwd?: string;
}

// TODO: catch error in verbose mode
export function exec(shell: string[], opts: ExecOptions = {}) {
    const { cwd } = opts;
    const [command, ...args] = shell;
    return execa(command!, args, {
        cwd,
        stdio: 'inherit',
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
    const lockDir = await findUpRoot(cwd).result();
    if (lockDir.isErr()) {
        return {
            root: cwd,
            pm: preferredPM,
            args,
        };
    }
    const pm = detectPMByLock(lockDir.unwrap()).unwrapOr(preferredPM);
    const root = hasWFlag
        ? lockDir.unwrap()
        : path.dirname(await packageUp().then((v) => v!));
    return {
        root,
        pm,
        args,
    };
}

// TODO: make this configurable
const preferredPM = 'pnpm' as const;

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
