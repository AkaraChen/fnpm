import { Effect } from 'effect';
import type { WorkspaceContext } from 'fnpm-context';
import type { UpdateManifest } from './types';
import { Update } from './update';

/**
 * Executes the update workflow for a workspace and collects update manifests per package.
 *
 * @param ctx - The workspace context providing environment, configuration, and I/O for the update
 * @returns A record mapping package identifiers to arrays of `UpdateManifest` objects
 */
export async function update(
    ctx: WorkspaceContext
): Promise<Record<string, UpdateManifest[]>> {
    return await Effect.runPromise(Update(ctx));
}
export type { UpdateManifest };
