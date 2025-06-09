import { Effect } from 'effect';
import { resolveContext } from 'fnpm-context';

export function ResolveContext(dir: string) {
    return Effect.tryPromise({
        try: () => resolveContext(dir),
        catch: () => Effect.die('Failed to resolve context'),
    });
}
