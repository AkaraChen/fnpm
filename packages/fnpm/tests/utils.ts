import path from 'node:path';
import { type Effect, String as Str, Stream } from 'effect';
import { CommandFactory } from '../src/commands/base';
import { getContext } from '../src/util';

const __dirname = new URL('.', import.meta.url).pathname;

export const runString = <E, R>(
    stream: Stream.Stream<Uint8Array, E, R>,
): Effect.Effect<string, E, R> =>
    stream.pipe(Stream.decodeText(), Stream.runFold(Str.empty, Str.concat));

export const ctx = await getContext(path.resolve(__dirname, '../'));
export const factory = new CommandFactory(ctx);
