import path from 'node:path';
import { Command, FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { MakePackage } from 'fnpm-test-suite';
import { nanoid } from 'nanoid';
import { describe, expect, it } from 'vitest';
import { runString } from './utils';

const executable = path.resolve(__dirname, '../dist/fnpm.js');

describe('simple smoke test', () => {
    it('should find root', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const id = nanoid();
            yield* MakePackage(dir, {
                scripts: {
                    test: `echo "${id}"`,
                },
            });
            const command = pipe(
                Command.make('node', executable, '-w', 'test'),
                Command.workingDirectory(dir),
                Command.runInShell(true),
            );
            const [exitCode, stdout, stderr] = yield* pipe(
                Command.start(command),
                Effect.flatMap((process) =>
                    Effect.all(
                        [
                            process.exitCode,
                            runString(process.stdout),
                            runString(process.stderr),
                        ],
                        { concurrency: 3 },
                    ),
                ),
            );
            console.log(exitCode, stdout, stderr);
            expect(exitCode).toBe(0);
            expect(stderr).toBe('');
            expect(stdout.includes(id)).toBe(true);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });
});
