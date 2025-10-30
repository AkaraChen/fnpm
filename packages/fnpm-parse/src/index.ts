import Parser from './parser';

export type { ParseResult } from './types';

const parser = new Parser();
export default parser;

/**
 * Normalize package name for Deno - adds npm: protocol if no protocol is specified
 */
export function normalizeForDeno(packageName: string): string {
    const parsed = parser.parse(packageName);

    // If no protocol, add npm: prefix
    if (!parsed.protocol) {
        return `npm:${packageName}`;
    }

    // Protocol already present, return as-is
    return packageName;
}
