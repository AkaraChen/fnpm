import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import type { PackageJson } from 'type-fest';
import { describe, expect, it } from 'vitest';
import {
    MakePackage,
    ReadPackageJson,
    UpdatePackageJson,
    WritePackageJson,
} from './pkg';

describe('pkg', () => {
    it('should create a package using MakePackage', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const name = 'test-make';
            const version = '1.0.0';
            yield* MakePackage(dir, { name, version });
            const json = yield* ReadPackageJson(dir);
            expect(json.name).toBe(name);
            expect(json.version).toBe(version);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });

    it('should write and read a package.json using WritePackageJson and ReadPackageJson', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const pkgToWrite: PackageJson = {
                name: 'test-write',
                version: '0.5.0',
                description: 'written by test',
            };
            yield* WritePackageJson(dir, pkgToWrite);
            const json = yield* ReadPackageJson(dir);
            expect(json).toEqual(pkgToWrite);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });

    it('should update an existing package.json using UpdatePackageJson', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const initialPkg: PackageJson = {
                name: 'test-update',
                version: '1.0.0',
                author: 'initial author',
            };
            yield* MakePackage(dir, initialPkg); // Create initial package

            const updates: PackageJson = {
                version: '2.0.0',
                description: 'updated description',
            };
            yield* UpdatePackageJson(dir, updates);

            const json = yield* ReadPackageJson(dir);
            expect(json.name).toBe('test-update'); // Name should remain from initial
            expect(json.version).toBe('2.0.0'); // Version should be updated
            expect(json.author).toBe('initial author'); // Author should remain from initial
            expect(json.description).toBe('updated description'); // Description should be added
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});
