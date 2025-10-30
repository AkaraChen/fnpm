import { describe, expect, it } from 'vitest';
import { type InstallOptions, install } from './install';

describe('install', () => {
    it('should return the correct command for npm with fixed option', () => {
        const options: InstallOptions = { fixed: true };
        const result = install.concat('npm', options);
        expect(result).toEqual(['npm', 'ci']);
    });

    it('should return the correct command for npm without fixed option', () => {
        const options: InstallOptions = { fixed: false };
        const result = install.concat('npm', options);
        expect(result).toEqual(['npm', 'install']);
    });

    it('should return the correct command for yarn and yarn-classic', () => {
        const result1 = install.concat('yarn', {});
        const result2 = install.concat('yarn-classic', {});
        expect(result1).toEqual(['yarn']);
        expect(result2).toEqual(['yarn']);
    });

    it('should return the correct command for pnpm with fixed option', () => {
        const options: InstallOptions = { fixed: true };
        const result = install.concat('pnpm', options);
        expect(result).toEqual(['pnpm', 'install', '--frozen-lockfile']);
    });

    it('should return the correct command for pnpm without fixed option', () => {
        const options: InstallOptions = { fixed: false };
        const result = install.concat('pnpm', options);
        expect(result).toEqual(['pnpm', 'install']);
    });

    it('should return the correct command for deno', () => {
        const options: InstallOptions = {};
        const result = install.concat('deno', options);
        expect(result).toEqual(['deno', 'install']);
    });

    it('should return the correct command for bun with fixed option', () => {
        const options: InstallOptions = { fixed: true };
        const result = install.concat('bun', options);
        expect(result).toEqual(['bun', 'install', '--frozen-lockfile']);
    });

    it('should return the correct command for bun without fixed option', () => {
        const options: InstallOptions = { fixed: false };
        const result = install.concat('bun', options);
        expect(result).toEqual(['bun', 'install']);
    });
});
