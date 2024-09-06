import { describe, it, expect } from 'vitest';
import { update } from './update';
import type { AddOptions } from './add';

describe('update command', () => {
    it('should generate correct arguments for update command', () => {
        const options: AddOptions = {
            exact: true,
            fixed: false,
            global: false,
            saveProd: true,
            saveDev: false,
            packages: ['package1', 'package2'],
        };

        const result = update.concat('npm', options);
        expect(result).toEqual([
            'npm',
            'up',
            'package1',
            'package2',
            '--save-prod',
            '--save-exact',
        ]);
    });

    it('should handle empty packages array', () => {
        const options: AddOptions = {
            exact: false,
            fixed: false,
            global: false,
            saveProd: false,
            saveDev: false,
            packages: [],
        };

        const result = update.concat('npm', options);
        expect(result).toEqual(['npm', 'up']);
    });

    it('should include global flag when specified', () => {
        const options: AddOptions = {
            exact: false,
            fixed: false,
            global: true,
            saveProd: false,
            saveDev: false,
            packages: ['package1'],
        };

        const result = update.concat('npm', options);
        expect(result).toEqual(['npm', 'up', 'package1', '--global']);
    });
});
