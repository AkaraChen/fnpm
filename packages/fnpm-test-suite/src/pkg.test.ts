import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';
import { MakePackage, ReadPackageJson } from './pkg';

describe('pkg', () => {
    it('should create a package', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const name = 'test';
            const version = '1.0.0';
            yield* MakePackage(dir, { name, version });
            const json = yield* ReadPackageJson(dir);
            expect(json.name).toBe(name);
            expect(json.version).toBe(version);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });
});
