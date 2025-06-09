import type * as mt from '@akrc/monorepo-tools';
import { Command, CommandExecutor } from '@effect/platform';
import { ExitCode } from '@effect/platform/CommandExecutor';
import { Effect, pipe } from 'effect';
import { commands } from 'pm-combo';
import type { PackageJson } from 'type-fest';
import { UpdatePackageJson, WritePackageJson } from './pkg';
import { WritePnpmWorkspaceYaml } from './pnpm';

export function MakeWorkspace(
    pm: mt.PM,
    dir: string,
    selectors: string[],
    pkgJson: PackageJson = { name: 'workspace' },
) {
    return Effect.gen(function* () {
        const exec = yield* CommandExecutor.CommandExecutor;
        yield* WritePackageJson(dir, pkgJson);
        switch (pm) {
            case 'npm':
            case 'yarn': {
                yield* UpdatePackageJson(dir, {
                    workspaces: selectors,
                });
                break;
            }
            case 'pnpm': {
                yield* WritePnpmWorkspaceYaml(dir, {
                    packages: selectors,
                });
                break;
            }
        }
        const [cmd, ...args] = commands.install.concat(pm, {});
        const process = yield* exec.start(
            pipe(
                Command.make(cmd!, ...args),
                Command.workingDirectory(dir),
                Command.runInShell(true),
            ),
        );
        const code = yield* process.exitCode;
        if (code !== ExitCode(0)) {
            yield* Effect.fail(`Failed to install dependencies: ${code}`);
        }
    });
}
