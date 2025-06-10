import path from 'node:path';
import { Command, CommandExecutor, FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';

const executable = path.resolve(__dirname, '../dist/fnpx.js');

describe('fnpx smoke test', () => {
    it('should show version', async () => {
        const program = Effect.gen(function* () {
            const executor = yield* CommandExecutor.CommandExecutor;
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const command = pipe(
                Command.make('node', executable, '--version'),
                Command.workingDirectory(dir),
                Command.runInShell(true),
            );
            const process = yield* executor.start(command);
            const code = yield* process.exitCode;
            expect(code).toBe(0);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });

    it('should install and run', { timeout: 5_000 * 100 }, async () => {
        const program = Effect.gen(function* () {
            const executor = yield* CommandExecutor.CommandExecutor;
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const command = pipe(
                Command.make(
                    'node',
                    executable,
                    'create-next-app@15.3.3',
                    'app-name',
                    ' --empty',
                    '--yes',
                ),
                Command.workingDirectory(dir),
                Command.runInShell(true),
            );
            const appDir = path.join(dir, 'app-name');
            const process = yield* executor.start(command);
            const code = yield* process.exitCode;
            expect(code).toBe(0);
            const exists = yield* fs.exists(appDir);
            expect(exists).toBe(true);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });
});
