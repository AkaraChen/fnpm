import type { Effect } from 'effect';
import type { Context } from '../context';

export type Scanner = (ctx: Context) => Effect.Effect<void>;
