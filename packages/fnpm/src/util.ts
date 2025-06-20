import type { PM } from '@akrc/monorepo-tools';
import { consola } from 'consola';
import { resolveContext } from 'fnpm-context';
import parser from 'fnpm-parse';
import { packageDirectory } from 'package-directory';
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

export function error(message: string): never {
    consola.error(message);
    process.exit(1);
}

export interface Context {
    root: string;
    pm: PM;
    args: string[];
}

export async function getContext(cwd: string): Promise<Context> {
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
    const parsed = parser.parse(input);
    return `${parsed.fullName}@${parsed.version || 'latest'}`;
}
