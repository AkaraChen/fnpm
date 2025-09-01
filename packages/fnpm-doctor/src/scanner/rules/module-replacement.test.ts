import { FileSystem } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect } from 'effect';
import { MakePackage } from 'fnpm-test-suite';
import type { PackageJson } from 'type-fest';
import { describe, expect, it, vi } from 'vitest';
import { type Rule, RuleContextImpl } from '../rule';
import {
    microUtilsReplacementRule,
    nativeReplacementRule,
    preferredReplacementRule,
} from './module-replacement';

function setupRule(rule: Rule, packageJson: PackageJson) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const dir = yield* fs.makeTempDirectoryScoped();
        yield* MakePackage(dir, packageJson);
        const context = new RuleContextImpl(dir);
        yield* Effect.tryPromise({
            try: () => context.init(),
            catch: Effect.die,
        });
        vi.spyOn(context, 'report');
        yield* rule(context);
        expect(context.report).toHaveBeenCalledOnce();
    });
}

describe('ModuleReplacement', () => {
    it('should report module replacements', async () => {
        const program = setupRule(nativeReplacementRule, {
            dependencies: {
                'array-every': '1.0.0',
            },
        });
        await Effect.runPromise(
            program.pipe(Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});

describe('ModuleReplacement', () => {
    it('should report module replacements', async () => {
        const program = setupRule(microUtilsReplacementRule, {
            dependencies: {
                'call-bind': '1.0.0',
            },
        });
        await Effect.runPromise(
            program.pipe(Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});

describe('ModuleReplacement', () => {
    it('should report module replacements', async () => {
        const program = setupRule(preferredReplacementRule, {
            dependencies: {
                bluebird: '1.0.0',
            },
        });
        await Effect.runPromise(
            program.pipe(Effect.provide(NodeContext.layer), Effect.scoped)
        );
    });
});
