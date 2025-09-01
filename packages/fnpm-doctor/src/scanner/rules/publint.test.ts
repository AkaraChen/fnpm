import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect } from 'effect';
import { MakePackage } from 'fnpm-test-suite';
import { describe, expect, it, vi } from 'vitest';
import { RuleContextImpl } from '../rule';
import { publint } from './publint';

describe('multiple-eslint-config', () => {
    it('should report multiple eslint configs', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;

            const dir = yield* fs.makeTempDirectoryScoped();
            yield* MakePackage(dir, {
                name: 'fnpm-doctor',
                version: '1.12.2',
                type: 'module',
                main: './dist/index.cjs',
                exports: {
                    '.': {
                        types: './dist/index.d.ts',
                        import: './dist/index.js',
                    },
                },
                files: [],
            });

            const context = new RuleContextImpl(dir);
            yield* Effect.tryPromise({
                try: () => context.init(),
                catch: Effect.die,
            });
            vi.spyOn(context, 'report');
            yield* publint(context);
            expect(context.report).toHaveBeenCalled();
        });
        await Effect.runPromise(
            program.pipe(Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});
