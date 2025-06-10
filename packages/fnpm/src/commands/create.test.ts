import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import Create from './create';

// Mock the util module
vi.mock('../util', () => ({
    error: vi.fn(),
    exec: vi.fn(),
    normalizePackageVersion: (name: string) => name,
}));

describe('Create Command', () => {
    // Store the original ctx before each test
    const originalCtx = globalThis.ctx;

    beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();
    });

    afterEach(() => {
        // Restore the original ctx after each test
        globalThis.ctx = originalCtx;
    });

    it('should handle create command with package name', async () => {
        const cmd = new Create();

        // Mock globalThis.ctx
        globalThis.ctx = {
            args: ['create', 'my-app'],
            pm: 'pnpm',
        } as any;

        await yargs(['create', 'my-app']).command(cmd).parse();

        // Verify that args are parsed correctly
        expect(globalThis.ctx.args).toEqual(['create', 'my-app']);
    });

    it('should handle create command with package name and additional args', async () => {
        const cmd = new Create();

        // Mock globalThis.ctx
        globalThis.ctx = {
            args: ['create', 'my-app', '--template', 'react'],
            pm: 'pnpm',
        } as any;

        await yargs(['create', 'my-app', '--template', 'react'])
            .command(cmd)
            .parse();

        // Verify that args are parsed correctly
        expect(globalThis.ctx.args).toEqual([
            'create',
            'my-app',
            '--template',
            'react',
        ]);
    });

    it('should throw error when no package name is specified', async () => {
        const cmd = new Create();

        // Import the actual util module to get access to the mocked functions
        const util = await import('../util');

        // Mock globalThis.ctx
        globalThis.ctx = {
            args: ['create'],
            pm: 'pnpm',
        } as any;

        await yargs(['create']).command(cmd).parse();

        // Verify that error was called with the correct message
        expect(util.error).toHaveBeenCalledWith('No package [name] specified');
    });
});
