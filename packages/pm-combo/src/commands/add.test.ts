import { describe, expect, it } from 'vitest';
import { type AddOptions, add } from './add';

describe('add', () => {
    it('should concatenate the correct arguments', () => {
        const options: AddOptions = {
            packages: ['package1', 'package2'],
            save: true,
            saveDev: false,
            savePeer: true,
            saveOptional: false,
            exact: true,
            global: false,
            fixed: false,
            allowRoot: true,
        };

        const result = add.concat('npm', options);

        expect(result).toEqual([
            'npm',
            'install',
            'package1',
            'package2',
            '--save-peer',
            '--save-exact',
        ]);
    });

    it('should add npm: prefix to packages for deno', () => {
        const options: AddOptions = {
            packages: ['express', 'lodash@4.17.21'],
        };

        const result = add.concat('deno', options);

        expect(result).toEqual([
            'deno',
            'add',
            'npm:express',
            'npm:lodash@4.17.21',
        ]);
    });

    it('should not add npm: prefix if package already has protocol for deno', () => {
        const options: AddOptions = {
            packages: ['npm:express', 'npm:lodash@4.17.21'],
        };

        const result = add.concat('deno', options);

        expect(result).toEqual([
            'deno',
            'add',
            'npm:express',
            'npm:lodash@4.17.21',
        ]);
    });

    it('should throw error for jsr: packages in deno', () => {
        const options: AddOptions = {
            packages: ['jsr:@std/testing'],
        };

        expect(() => add.concat('deno', options)).toThrow(
            'JSR packages are not yet supported'
        );
    });
});
