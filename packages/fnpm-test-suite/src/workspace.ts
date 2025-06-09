import type * as mt from '@akrc/monorepo-tools';
import { Effect } from 'effect';
import { WritePackageJson } from './pkg';
import { UpdatePnpmWorkspaceYaml } from './pnpm';

export function MakeWorkspace(pm: mt.PM, dir: string, selectors: string[]) {
    return Effect.gen(function* () {
        switch (pm) {
            case 'npm':
            case 'yarn': {
                yield* WritePackageJson(dir, {
                    workspaces: selectors,
                });
                break;
            }
            case 'pnpm': {
                yield* UpdatePnpmWorkspaceYaml(dir, {
                    packages: selectors,
                });
                break;
            }
        }
    });
}
