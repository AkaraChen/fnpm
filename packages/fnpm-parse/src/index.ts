import Parser from './parser';

export type { ParseResult } from './types';

const parser = new Parser();
export default parser;

/**
 * Normalize package name for Deno - adds npm: protocol if no protocol is specified
 * Throws error if jsr: protocol is used (not yet supported)
 */
export function normalizeForDeno(packageName: string): string {
    const parsed = parser.parse(packageName);

    if (parsed.protocol === 'jsr') {
        throw new Error(
            'JSR packages are not yet supported. Please use npm: packages for now.'
        );
    }

    // If no protocol, add npm: prefix
    if (!parsed.protocol) {
        return `npm:${packageName}`;
    }

    // Protocol already present, return as-is
    return packageName;
}
