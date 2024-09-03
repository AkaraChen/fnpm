import {
    type PM,
    detectPMByLock,
    findUpRoot,
    scanProjects,
} from '@akrc/monorepo-tools';
import type { Project } from '@pnpm/types';
import { Effect, Option } from 'effect';
import type { UnknownException } from 'effect/Cause';

export function FindUpRoot(
    searchDir: string,
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
        },
    );
}

export function ScanProjects(
    searchDir: string,
    pm: PM,
): Effect.Effect<Project[], UnknownException> {
    return Effect.tryPromise(() => scanProjects(searchDir, pm));
}

export function DetectPMByLock(
    searchDir: string,
): Effect.Effect<PM, UnknownException> {
    return Effect.try(() => detectPMByLock(searchDir).unwrap());
}
