import type { PM as BasePM } from '@akrc/monorepo-tools';

/**
 * Extended PM type that includes deno and bun support.
 * The base PM type from @akrc/monorepo-tools only includes 'npm' | 'yarn' | 'pnpm'.
 */
export type PM = BasePM | 'deno' | 'bun';

/**
 * Check if a PM value is a base PM type (npm, yarn, pnpm)
 */
export function isBasePM(pm: PM): pm is BasePM {
    return pm === 'npm' || pm === 'yarn' || pm === 'pnpm';
}

/**
 * Map extended PM types to base PM types for operations that require base PM compatibility
 * - deno -> npm (deno uses npm-compatible commands)
 * - bun -> npm (bun uses npm-compatible commands)
 */
export function toBasePM(pm: PM): BasePM {
    if (pm === 'deno' || pm === 'bun') {
        return 'npm';
    }
    return pm;
}
