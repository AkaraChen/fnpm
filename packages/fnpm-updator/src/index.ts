import { Effect } from 'effect';
import { type Context, safeContext } from 'fnpm-context';
import type { UpdateManifest } from './types';
import { Update } from './update';

export async function update(
    ctx: Context,
): Promise<Record<string, UpdateManifest[]>> {
    return await Effect.runPromise(Update(safeContext(ctx)));
}
export type { UpdateManifest };
