import {
    detectPMByLock as baseDetectPMByLock,
    findUpRoot,
    scanProjects,
} from '@akrc/monorepo-tools';
import type { Project } from '@pnpm/types';
import { Effect, Option } from 'effect';
import type { UnknownException } from 'effect/Cause';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { PM } from './types';
import { toBasePM } from './types';

export function FindUpRoot(
    searchDir: string
): Effect.Effect<Option.Option<string>, UnknownException, never> {
    return Effect.match(
        Effect.tryPromise(() => findUpRoot(searchDir)),
        {
            onSuccess(value) {
                return Option.some(value);
            },
            onFailure() {
                return Option.none();
            },
        }
    );
}

export function ScanProjects(
    searchDir: string,
    pm: PM
): Effect.Effect<Project[], UnknownException> {
    const basePM = toBasePM(pm);
    return Effect.tryPromise(() => scanProjects(searchDir, basePM));
}

/**
 * Detect package manager by lock file, including extended support for deno and bun
 */
export function DetectPMByLock(
    searchDir: string
): Effect.Effect<PM, UnknownException> {
    return Effect.try(() => {
        // Check for deno.lock or deno.json
        if (
            existsSync(join(searchDir, 'deno.lock')) ||
            existsSync(join(searchDir, 'deno.json'))
        ) {
            return 'deno' as PM;
        }

        // Check for bun.lockb
        if (existsSync(join(searchDir, 'bun.lockb'))) {
            return 'bun' as PM;
        }

        // Fall back to base detection (npm, yarn, pnpm)
        return baseDetectPMByLock(searchDir).unwrap() as PM;
    });
}
