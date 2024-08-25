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
});
