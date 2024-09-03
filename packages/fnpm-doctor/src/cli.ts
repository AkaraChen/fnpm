#!/usr/bin/env node

import { NodeRuntime } from '@effect/platform-node';
import { Effect } from 'effect';
import { scan } from './scanner';
import { writeToConsole } from './scanner/utils';

const program = Effect.gen(function* () {
    const { diagnoses } = yield* Effect.tryPromise({
        try() {
            return scan(process.cwd());
        },
        catch(e) {
            console.error(e);
        },
    });
    yield* Effect.forEach(diagnoses, (n) =>
        Effect.sync(() => writeToConsole(n)),
    );
});

NodeRuntime.runMain(program);
