import { type Effect, String as Str, Stream } from 'effect';

export const runString = <E, R>(
    stream: Stream.Stream<Uint8Array, E, R>,
): Effect.Effect<string, E, R> =>
    stream.pipe(Stream.decodeText(), Stream.runFold(Str.empty, Str.concat));
