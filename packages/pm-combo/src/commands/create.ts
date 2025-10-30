import parser, { normalizeForDeno } from 'fnpm-parse';
import type { Command } from './type';

export interface CreateOptions {
    name: string;
    args: string[];
}

export const create: Command<CreateOptions> = {
    concat(pm, options) {
        // For Deno, we need to use dlx-style invocation with npm: protocol
        if (pm === 'deno') {
            const parsed = parser.parse(options.name);
            // Throw error if jsr: protocol is used (not yet supported)
            if (parsed.protocol === 'jsr') {
                throw new Error(
                    'JSR packages are not yet supported. Please use npm: packages for now.'
                );
            }
            // Transform package name for create packages
            // e.g., 'vite' -> 'create-vite', '@eslint/config' -> '@eslint/create-config'
            let createPackageName: string;
            if (parsed.scope) {
                createPackageName = `@${parsed.scope}/create-${parsed.name}`;
            } else {
                createPackageName = `create-${parsed.name}`;
            }
            const normalizedPkg = normalizeForDeno(createPackageName);
            return ['deno', 'run', normalizedPkg, ...(options.args || [])];
        }
        return [pm, 'create', options.name, ...(options.args || [])];
    },
};
