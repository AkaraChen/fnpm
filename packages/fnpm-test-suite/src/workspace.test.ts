import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';
import { ReadPackageJson } from './pkg';
import { ReadPnpmWorkspaceYaml } from './pnpm';
import { MakeWorkspace } from './workspace';

describe('workspace utils', () => {
    it('should create a pnpm workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['packages/*', 'tools/*'];

            yield* MakeWorkspace('pnpm', dir, selectors);

            const pkgJson = yield* ReadPackageJson(dir);
            expect(pkgJson.name).toBe('workspace'); // Default name from MakeWorkspace

            const pnpmWsYaml = yield* ReadPnpmWorkspaceYaml(dir);
            expect(pnpmWsYaml.packages).toEqual(selectors);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });

    it('should create an npm workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['apps/*', 'shared/*'];

            yield* MakeWorkspace('npm', dir, selectors);

            const pkgJson = yield* ReadPackageJson(dir);
            expect(pkgJson.name).toBe('workspace');
            expect(pkgJson.workspaces).toEqual(selectors);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });

    it('should create a yarn workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['modules/*', 'examples/*'];

            yield* MakeWorkspace('yarn', dir, selectors);

            const pkgJson = yield* ReadPackageJson(dir);
            expect(pkgJson.name).toBe('workspace');
            expect(pkgJson.workspaces).toEqual(selectors);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });
});
