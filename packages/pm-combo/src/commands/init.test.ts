import { describe, expect, it } from 'vitest';
import { type InitOptions, init } from './init';

describe('init', () => {
    it('should return correct command for pnpm', () => {
        const options: InitOptions = {
            interactively: true,
        };
        const result = init.concat('pnpm', options);
        expect(result).toEqual(['pnpm', 'init']);
    });

    it('should return correct command for non-pnpm with interactive mode', () => {
        const options: InitOptions = {
            interactively: true,
        };
        const result = init.concat('npm', options);
        expect(result).toEqual(['npm', 'init']);
    });

    it('should return correct command for non-pnpm without interactive mode', () => {
        const options: InitOptions = {
            interactively: false,
        };
        const result = init.concat('npm', options);
        expect(result).toEqual(['npm', 'init', '-y']);
    });

    it('should return correct command for yarn', () => {
        const options: InitOptions = {
            interactively: true,
        };
        const result = init.concat('yarn', options);
        expect(result).toEqual(['yarn', 'init']);
    });
});
