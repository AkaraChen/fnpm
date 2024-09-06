import { describe, it, expect } from 'vitest';
import { why } from './why';

describe('why command', () => {
    it('should concatenate pm and query correctly', () => {
        const pm = 'npm';
        const options = { query: 'react' };
        const result = why.concat(pm, options);
        expect(result).toEqual(['npm', 'why', 'react']);
    });

    it('should handle different package managers', () => {
        const pm = 'yarn';
        const options = { query: 'vue' };
        const result = why.concat(pm, options);
        expect(result).toEqual(['yarn', 'why', 'vue']);
    });

    it('should handle empty query', () => {
        const pm = 'pnpm';
        const options = { query: '' };
        const result = why.concat(pm, options);
        expect(result).toEqual(['pnpm', 'why', '']);
    });
});
