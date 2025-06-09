import type * as mt from '@akrc/monorepo-tools';
import { Effect } from 'effect';
import { UpdatePackageJson, WritePackageJson } from './pkg';
import { WritePnpmWorkspaceYaml } from './pnpm';

export function MakeWorkspace(pm: mt.PM, dir: string, selectors: string[]) {
    return Effect.gen(function* () {
        yield* WritePackageJson(dir, {
            name: 'workspace',
        });
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
    });
}
