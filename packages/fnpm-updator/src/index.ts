import { Effect } from 'effect';
import type { WorkspaceContext } from 'fnpm-context';
import type { UpdateManifest } from './types';
import { Update } from './update';

export async function update(
    ctx: WorkspaceContext
): Promise<Record<string, UpdateManifest[]>> {
    return await Effect.runPromise(Update(ctx));
}
export type { UpdateManifest };
