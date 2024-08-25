#!/usr/bin/env node

import { NodeRuntime } from '@effect/platform-node';
import { Effect, pipe } from 'effect';
import scan from '.';
import { writeToConsole } from './utils';

const program = pipe(
    Effect.promise(async () => {
        const result = await scan(process.cwd());
        result.diagnoses.forEach(writeToConsole);
    }),
);

NodeRuntime.runMain(program);
