import { FileSystem, Path } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect } from 'effect';
import { MakePackage, MakeWorkspace } from 'fnpm-test-suite';
import { describe, expect, it, vi } from 'vitest';
import { RuleContextImpl } from '../rule';
import { versionMismatch } from './version-mismatch';

describe('version-mismatch', () => {
    it('should report version mismatch', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const path = yield* Path.Path;

            const dir = yield* fs.makeTempDirectoryScoped();
            yield* MakeWorkspace('pnpm', dir, ['one', 'two']);

            const oneDir = path.join(dir, 'one');
            yield* fs.makeDirectory(oneDir);
            yield* MakePackage(oneDir, {
                dependencies: {
                    'fnpm-doctor': '1.11.2',
                },
            });

            const twoDir = path.join(dir, 'two');
            yield* fs.makeDirectory(twoDir);
            yield* MakePackage(twoDir, {
                dependencies: {
                    'fnpm-doctor': '1.12.2',
                },
            });

            const context = new RuleContextImpl(dir);
            yield* Effect.tryPromise({
                try: () => context.init(),
                catch: Effect.die,
            });
            vi.spyOn(context, 'report');
            yield* versionMismatch(context);
            expect(context.report).toHaveBeenCalledOnce();
        });
        await Effect.runPromise(
            program.pipe(Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});
