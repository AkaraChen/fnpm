import { describe, expect, it } from 'vitest';
import { normalizeForDeno } from './index';

describe('normalizeForDeno', () => {
    it('should add npm: prefix to packages without protocol', () => {
        expect(normalizeForDeno('express')).toBe('npm:express');
        expect(normalizeForDeno('lodash@4.17.21')).toBe('npm:lodash@4.17.21');
    });

    it('should not add npm: prefix if protocol already exists', () => {
        expect(normalizeForDeno('npm:express')).toBe('npm:express');
        expect(normalizeForDeno('npm:cowsay@1.5.0')).toBe('npm:cowsay@1.5.0');
    });

    it('should throw error for jsr: protocol', () => {
        expect(() => normalizeForDeno('jsr:@std/testing')).toThrow(
            'JSR packages are not yet supported'
        );
    });

    it('should handle scoped packages', () => {
        expect(normalizeForDeno('@types/node')).toBe('npm:@types/node');
        expect(normalizeForDeno('npm:@types/node')).toBe('npm:@types/node');
    });
});
