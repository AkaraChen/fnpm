import { describe, it, expect } from 'vitest';
import { test } from './test';

describe('test command', () => {
    it('should return the correct command with no args', () => {
        const result = test.concat('npm', {});
        expect(result).toEqual(['npm', 'test']);
    });

    it('should return the correct command with args', () => {
        const result = test.concat('npm', { args: ['--watch'] });
        expect(result).toEqual(['npm', 'test', '--watch']);
    });

    it('should handle multiple args', () => {
        const result = test.concat('npm', { args: ['--watch', '--verbose'] });
        expect(result).toEqual(['npm', 'test', '--watch', '--verbose']);
    });

    it('should handle different package managers', () => {
        const result = test.concat('yarn', { args: ['--watch'] });
        expect(result).toEqual(['yarn', 'test', '--watch']);
    });
});
