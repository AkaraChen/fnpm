import { consola } from 'consola';
import { resolveRepoContext, resolveWorkspaceContext } from 'fnpm-context';
import parser from 'fnpm-parse';
import type { PM } from 'fnpm-utils-node';
import Fuse from 'fuse.js';
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

/**
 * Resolve the execution context (package manager, root directory, and CLI args) for a given working directory.
 *
 * The returned context adapts to command-line flags:
 * - If `-w` is present, `root` is the repository root.
 * - If `-s <term>` is present, `root` is the matched workspace project's root (fuzzy-searched by manifest name/description); missing term or no match will terminate the process with an error message.
 * - Otherwise, `root` is the nearest package directory for `cwd` or `cwd` if none is found.
 *
 * @param cwd - The working directory to resolve repository/workspace/package context from
 * @returns The resolved Context containing:
 *   - `pm`: package manager information from the repository context,
 *   - `args`: the remaining CLI arguments after removing handled flags,
 *   - `root`: the selected root directory as described above
 */
export async function getContext(cwd: string): Promise<Context> {
    const repoContext = await resolveRepoContext(cwd);
    const { pm } = repoContext;

    // workspace mode
    if (process.argv[2] === '-w') {
        process.argv.splice(2, 1);
        return {
            pm,
            args: hideBin(process.argv),
            root: repoContext.root,
        };
    }

    // switch to another project
    if (process.argv[2] === '-s') {
        try {
            const context = await resolveWorkspaceContext(repoContext);
            const fuse = new Fuse(context.projects, {
                keys: [
                    {
                        name: 'manifest.name',
                        weight: 2,
                    },
                    {
                        name: 'manifest.description',
                        weight: 1,
                    },
                ],
            });
            const matcher = process.argv[3];
            if (!matcher) {
                error('No search term provided');
            }
            const result = fuse.search(matcher, {
                limit: 1,
            });
            if (!result.length) {
                error('No matching projects found');
            }
            const project = result.at(0)!.item;
            process.argv.splice(2, 2);
            return {
                pm: repoContext.pm,
                args: hideBin(process.argv),
                root: project.rootDir,
            };
        } catch {
            error('Monorepo not found');
        }
    }

    // default mode, resolve package directory
    return {
        pm,
        args: hideBin(process.argv),
        root: (await packageDirectory({ cwd })) || cwd,
    };
}

export function normalizePackageVersion(input: string) {
    const parsed = parser.parse(input);
    return `${parsed.fullName}@${parsed.version || 'latest'}`;
}
