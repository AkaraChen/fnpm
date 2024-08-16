import { describe, expect, it } from 'vitest';
import { type RemoveOptions, remove } from './remove';

describe('remove', () => {
    it('should concatenate the correct arguments', () => {
        const options: RemoveOptions = {
            saveDev: true,
            savePeer: false,
            saveOptional: true,
            packages: ['package1', 'package2'],
            global: false,
        };

        const result = remove.concat('npm', options);

        expect(result).toEqual([
            'npm',
            'uninstall',
            '--save-dev',
            '--save-optional',
            'package1',
            'package2',
        ]);
    });

    it('should concatenate the correct arguments for global removal', () => {
        const options: RemoveOptions = {
            saveDev: false,
            savePeer: true,
            saveOptional: false,
            packages: ['package3'],
            global: true,
        };

        const result = remove.concat('npm', options);

        expect(result).toEqual([
            'npm',
            'uninstall',
            '--save-peer',
            '--global',
            'package3',
        ]);
    });

    it('should concatenate the correct arguments for npm removal', () => {
        const options: RemoveOptions = {
            saveDev: true,
            savePeer: false,
            saveOptional: true,
            packages: ['package1', 'package2'],
            global: false,
        };

        const result = remove.concat('npm', options);

        expect(result).toEqual([
            'npm',
            'uninstall',
            '--save-dev',
            '--save-optional',
            'package1',
            'package2',
        ]);
    });

    it('should concatenate the correct arguments for global npm removal', () => {
        const options: RemoveOptions = {
            saveDev: false,
            savePeer: true,
            saveOptional: false,
            packages: ['package3'],
            global: true,
        };

        const result = remove.concat('npm', options);

        expect(result).toEqual([
            'npm',
            'uninstall',
            '--save-peer',
            '--global',
            'package3',
        ]);
    });

    it('should concatenate the correct arguments for yarn removal', () => {
        const options: RemoveOptions = {
            saveDev: true,
            savePeer: true,
            saveOptional: false,
            packages: ['package4', 'package5'],
            global: false,
        };

        const result = remove.concat('yarn', options);

        expect(result).toEqual([
            'yarn',
            'remove',
            '--save-dev',
            '--save-peer',
            'package4',
            'package5',
        ]);
    });

    it('should concatenate the correct arguments for global yarn removal', () => {
        const options: RemoveOptions = {
            saveDev: false,
            savePeer: false,
            saveOptional: true,
            packages: ['package6'],
            global: true,
        };

        const result = remove.concat('yarn', options);

        expect(result).toEqual([
            'yarn',
            'remove',
            '--save-optional',
            '--global',
            'package6',
        ]);
    });

    // Existing tests...

    it('should concatenate the correct arguments for pnpm removal', () => {
        const options: RemoveOptions = {
            saveDev: true,
            savePeer: false,
            saveOptional: true,
            packages: ['package7', 'package8'],
            global: false,
        };

        const result = remove.concat('pnpm', options);

        expect(result).toEqual([
            'pnpm',
            'remove',
            '--save-dev',
            '--save-optional',
            'package7',
            'package8',
        ]);
    });

    it('should concatenate the correct arguments for global pnpm removal', () => {
        const options: RemoveOptions = {
            saveDev: false,
            savePeer: true,
            saveOptional: false,
            packages: ['package9'],
            global: true,
        };

        const result = remove.concat('pnpm', options);

        expect(result).toEqual([
            'pnpm',
            'remove',
            '--save-peer',
            '--global',
            'package9',
        ]);
    });
});
