import { FileSystem, Path } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect } from 'effect';
import { MakePackage, MakeWorkspace } from 'fnpm-test-suite';
import { describe, expect, it, vi } from 'vitest';
import { RuleContextImpl } from '../rule';
import { multipleEslintConfig } from './multiple-eslint-config';

describe('multiple-eslint-config', () => {
    it('should report multiple eslint configs', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const path = yield* Path.Path;

            const dir = yield* fs.makeTempDirectoryScoped();
            yield* MakeWorkspace('pnpm', dir, ['one', 'two']);

            const oneDir = path.join(dir, 'one');
            yield* fs.makeDirectory(oneDir);
            yield* MakePackage(oneDir);
            yield* fs.writeFileString(path.join(oneDir, '.eslintrc.js'), '');

            const twoDir = path.join(dir, 'two');
            yield* fs.makeDirectory(twoDir);
            yield* MakePackage(twoDir);
            yield* fs.writeFileString(path.join(twoDir, '.eslintrc.js'), '');

            const context = new RuleContextImpl(dir);
            yield* Effect.tryPromise({
                try: () => context.init(),
                catch: Effect.die,
            });
            vi.spyOn(context, 'report');
            yield* multipleEslintConfig(context);
            expect(context.report).toHaveBeenCalledOnce();
        });
        await Effect.runPromise(
            program.pipe(Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});
