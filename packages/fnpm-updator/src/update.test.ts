import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { resolveContext } from 'fnpm-context';
import { MakePackage } from 'fnpm-test-suite';
import { describe, expect, it } from 'vitest';
import { Update } from './update';
import { ResolveContext } from './utils';

describe('update', () => {
    it('should update', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const oldVersion = '18.2.0';
            yield* MakePackage(dir, {
                dependencies: {
                    react: oldVersion,
                },
            });
            const context = yield* Effect.tryPromise({
                try: () => resolveContext(dir),
                catch: () => Effect.die('Failed to resolve context'),
            });
            expect(context.rootProject?.manifest.dependencies?.react).toBe(
                oldVersion,
            );
            const manifests = yield* Update(context);
            expect(manifests[''][0].name).toBe('react');
            expect(manifests[''][0].current).toBe(oldVersion);
            expect(manifests[''][0].latest).not.toBe(oldVersion);
        });

        await Effect.runPromise(
            pipe(program, Effect.scoped, Effect.provide(NodeContext.layer)),
        );
    });

    it('should filter pm', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            yield* MakePackage(dir, {
                packageManager: 'pnpm',
            });
            const context = yield* ResolveContext(dir);
            expect(context.rootProject?.manifest.packageManager).toBe('pnpm');
            const manifests = yield* Update(context);
            expect(manifests['']).toHaveLength(0);
        });

        await Effect.runPromise(
            pipe(program, Effect.scoped, Effect.provide(NodeContext.layer)),
        );
    });
});
