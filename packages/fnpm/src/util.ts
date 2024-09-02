import type { PM } from '@akrc/monorepo-tools';
import { consola } from 'consola';
import { resolveContext } from 'fnpm-doctor';
import { parse as parsePackageName } from 'parse-package-name';
import { packageDirectory } from 'pkg-dir';
import { x } from 'tinyexec';
import { hideBin } from 'yargs/helpers';

interface ExecOptions {
    cwd?: string;
}

// TODO: catch error in verbose mode
export function exec(shell: string[], opts: ExecOptions = {}) {
    const { cwd } = opts;
    const [command, ...args] = shell;
    return x(command!, args, {
        nodeOptions: {
            cwd,
            stdio: 'inherit',
        },
    });
}

export function error(message: string) {
    consola.error(message);
    process.exit(1);
}

export async function getContext(
    cwd: string,
): Promise<{ root: string; pm: PM; args: string[] }> {
    const ctx = await resolveContext(cwd);
    const hasWFlag = process.argv[2] === '-w';
    if (hasWFlag) {
        process.argv.splice(2, 1);
    }
    const args = hideBin(process.argv);
    const root = hasWFlag ? ctx.root : (await packageDirectory({ cwd })) || cwd;
    return {
        pm: ctx.pm,
        args,
        root,
    };
}

export function normalizePackageVersion(input: string) {
    const parsed = parsePackageName(input);
    return parsed.version ? input : `${input}@latest`;
}

export function noop() {}
