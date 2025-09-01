import * as mt from '@akrc/monorepo-tools';
import { FileSystem, Path } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';
import { MakePackage, ReadPackageJson } from './pkg';
import { ReadPnpmWorkspaceYaml } from './pnpm';
import { MakeWorkspace } from './workspace';

describe('workspace', () => {
    it('should create a pnpm workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['packages/*', 'tools/*'];

            yield* MakeWorkspace('pnpm', dir, selectors);

            const isRoot = yield* Effect.promise(() => mt.isRoot(dir));
            expect(isRoot).toBe(true);

            const pkgJson = yield* ReadPackageJson(dir);
            expect(pkgJson.name).toBe('workspace'); // Default name from MakeWorkspace

            const pnpmWsYaml = yield* ReadPnpmWorkspaceYaml(dir);
            expect(pnpmWsYaml.packages).toEqual(selectors);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });

    it('should create an npm/yarn workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['apps/*', 'shared/*'];

            // due to npm and yarn have same behavior, we only test npm
            yield* MakeWorkspace('npm', dir, selectors);

            const isRoot = yield* Effect.promise(() => mt.isRoot(dir));
            expect(isRoot).toBe(true);

            const pkgJson = yield* ReadPackageJson(dir);
            expect(pkgJson.name).toBe('workspace');
            expect(pkgJson.workspaces).toEqual(selectors);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });

    it('should create a package in pnpm workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const path = yield* Path.Path;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['pkg-1'];

            yield* MakeWorkspace('pnpm', dir, selectors);

            const subPkgPath = path.join(dir, 'pkg-1');
            yield* fs.makeDirectory(subPkgPath);
            yield* MakePackage(subPkgPath, {
                name: 'test',
                version: '1.0.0',
            });

            const isInWorkspace = yield* Effect.promise(() =>
                mt.isInMonorepo(dir, subPkgPath)
            );
            expect(isInWorkspace).toBe(true);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });

    it('should create a package in npm/yarn workspace', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const path = yield* Path.Path;
            const dir = yield* fs.makeTempDirectoryScoped();
            const selectors = ['pkg-1'];

            yield* MakeWorkspace('npm', dir, selectors);

            const subPkgPath = path.join(dir, 'pkg-1');
            yield* fs.makeDirectory(subPkgPath);
            yield* MakePackage(subPkgPath, {
                name: 'test',
                version: '1.0.0',
            });

            const isInWorkspace = yield* Effect.promise(() =>
                mt.isInMonorepo(dir, subPkgPath)
            );
            expect(isInWorkspace).toBe(true);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});
