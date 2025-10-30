import {
    detectPMByLock,
    findUpRoot,
    type PM,
    scanProjects,
} from '@akrc/monorepo-tools';
import type { Project } from '@pnpm/types';
import { Effect, Option } from 'effect';
import type { UnknownException } from 'effect/Cause';
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
 * Detect package manager by lock file
 * Now uses native detection from @akrc/monorepo-tools v5.0.0+ which supports deno and bun
 */
export function DetectPMByLock(
    searchDir: string
): Effect.Effect<PM, UnknownException> {
    return Effect.try(() => detectPMByLock(searchDir).unwrap());
}
