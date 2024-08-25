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
});
