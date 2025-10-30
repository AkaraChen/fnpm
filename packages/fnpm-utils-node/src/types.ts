import type { PM } from '@akrc/monorepo-tools';

/**
 * Re-export PM type from @akrc/monorepo-tools
 * As of version 5.0.0, it includes: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'deno'
 */
export type { PM };

/**
 * Check if a PM value is a base PM type (npm, yarn, pnpm)
 */
export function isBasePM(pm: PM): boolean {
    return pm === 'npm' || pm === 'yarn' || pm === 'pnpm';
}

/**
 * Map extended PM types to base PM types for operations that require base PM compatibility
 * - deno -> npm (deno uses npm-compatible commands)
 * - bun -> npm (bun uses npm-compatible commands)
 */
export function toBasePM(pm: PM): 'npm' | 'yarn' | 'pnpm' {
    if (pm === 'deno' || pm === 'bun') {
        return 'npm';
    }
    return pm as 'npm' | 'yarn' | 'pnpm';
}
