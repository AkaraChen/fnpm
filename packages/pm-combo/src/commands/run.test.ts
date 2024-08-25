import { describe, expect, it } from 'vitest';
import { run } from './run';

describe('run', () => {
    it('should concatenate the command correctly', () => {
        const pm = 'npm';
        const options = {
            script: 'start',
            args: ['--watch'],
        };
        const result = run.concat(pm, options);
        expect(result).toEqual(['npm', 'run', 'start', '--watch']);
    });

    it('should concatenate the command without args', () => {
        const pm = 'npm';
        const options = {
            script: 'build',
        };
        const result = run.concat(pm, options);
        expect(result).toEqual(['npm', 'run', 'build']);
    });
});
