import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import { describe, expect, it } from 'vitest';
import type { PnpmWorkspaceSpecification as Spec } from '../generated/pnpm-workspace-spec';
import {
    ReadPnpmWorkspaceYaml,
    UpdatePnpmWorkspaceYaml,
    WritePnpmWorkspaceYaml,
} from './pnpm';

describe('pnpm workspace utils', () => {
    it('should write and read a pnpm-workspace.yaml', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const specToWrite: Spec = { packages: ['apps/*', 'libs/*'] };

            yield* WritePnpmWorkspaceYaml(dir, specToWrite);
            const readSpec = yield* ReadPnpmWorkspaceYaml(dir);
            expect(readSpec).toEqual(specToWrite);
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });

    it('should update an existing pnpm-workspace.yaml', async () => {
        const program = Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const dir = yield* fs.makeTempDirectoryScoped();
            const initialSpec: Spec = {
                packages: ['packages/*'],
                otherField: 'initial',
            } as any; // Test with extra field
            yield* WritePnpmWorkspaceYaml(dir, initialSpec);

            const updates: Spec = {
                packages: ['apps/**', 'services/**'],
                anotherField: 'updated',
            } as any;
            yield* UpdatePnpmWorkspaceYaml(dir, updates);

            const finalSpec = yield* ReadPnpmWorkspaceYaml(dir);
            // defu(input, parsed) for arrays means input's array elements come first, then unique elements from parsed's array
            expect(finalSpec.packages).toEqual([
                'apps/**',
                'services/**',
                'packages/*',
            ]);
            expect((finalSpec as any).otherField).toBe('initial'); // Fields only in parsed are kept
            expect((finalSpec as any).anotherField).toBe('updated'); // Fields only in input are added
        });
        await Effect.runPromise(
            pipe(program, Effect.provide(NodeContext.layer), Effect.scoped),
        );
    });
});
