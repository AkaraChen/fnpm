import { describe, expect, it } from 'vitest';
import { create } from './create';

describe('create', () => {
    it('should concatenate the command correctly', () => {
        const pm = 'npm';
        const options = {
            name: 'my-package',
            args: ['--force'],
        };

        const result = create.concat(pm, options);

        expect(result).toEqual(['npm', 'create', 'my-package', '--force']);
    });

    it('should handle deno with create- prefix for non-scoped packages', () => {
        const options = {
            name: 'vite',
            args: ['--template', 'react'],
        };

        const result = create.concat('deno', options);

        expect(result).toEqual([
            'deno',
            'run',
            'npm:create-vite',
            '--template',
            'react',
        ]);
    });

    it('should handle deno with scoped packages', () => {
        const options = {
            name: '@eslint/config',
            args: [],
        };

        const result = create.concat('deno', options);

        expect(result).toEqual(['deno', 'run', 'npm:@eslint/create-config']);
    });

    it('should throw error for jsr: protocol in deno create', () => {
        const options = {
            name: 'jsr:@std/testing',
            args: [],
        };

        expect(() => create.concat('deno', options)).toThrow(
            'JSR packages are not yet supported'
        );
    });
});
