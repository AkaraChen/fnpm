import { describe, expect, it } from 'vitest';
import { exec } from './exec';

describe('exec', () => {
    it('should concatenate the command correctly', () => {
        const pm = 'npm';
        const options = {
            args: ['test'],
        };

        const result = exec.concat(pm, options);

        expect(result).toEqual(['npm', 'exec', 'test']);
    });
});
