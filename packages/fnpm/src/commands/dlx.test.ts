import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import yargs, { type ArgumentsCamelCase } from 'yargs';
import Dlx from './dlx';

// Define a simple type for arguments
type EmptyObject = Record<string, never>;

// Mock the util module
vi.mock('../util', () => ({
    error: vi.fn(),
    exec: vi.fn(),
    normalizePackageVersion: (name: string) => name,
}));

describe('Dlx Command', () => {
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

    it('should handle dlx command with package name', async () => {
        const cmd = new Dlx();

        // Mock globalThis.ctx
        globalThis.ctx = {
            args: ['dlx', 'create-react-app'],
            pm: 'pnpm',
        } as any;

        await yargs(['dlx', 'create-react-app']).command(cmd).parse();

        // Verify that args are parsed correctly
        expect(globalThis.ctx.args).toEqual(['dlx', 'create-react-app']);
    });

    it('should handle dlx command with package name and additional args', async () => {
        const cmd = new Dlx();

        // Mock globalThis.ctx
        globalThis.ctx = {
            args: [
                'dlx',
                'create-react-app',
                'my-app',
                '--template',
                'typescript',
            ],
            pm: 'pnpm',
        } as any;

        await yargs([
            'dlx',
            'create-react-app',
            'my-app',
            '--template',
            'typescript',
        ])
            .command(cmd)
            .parse();

        // Verify that args are parsed correctly
        expect(globalThis.ctx.args).toEqual([
            'dlx',
            'create-react-app',
            'my-app',
            '--template',
            'typescript',
        ]);
    });

    it('should throw error when no package is specified', async () => {
        const cmd = new Dlx();

        // Import the actual util module to get access to the mocked functions
        const util = await import('../util');

        // Mock globalThis.ctx
        globalThis.ctx = {
            args: ['dlx'],
            pm: 'pnpm',
        } as any;

        await yargs(['dlx']).command(cmd).parse();

        // Verify that error was called with the correct message
        expect(util.error).toHaveBeenCalledWith('No package specified');
    });

    it('should handle when dlx is not the first argument', async () => {
        const cmd = new Dlx();

        // Create a mock handler to test argument parsing
        cmd.handler = async (options: ArgumentsCamelCase<EmptyObject>) => {
            expect(options._[0]).toEqual('create-react-app');
        };

        await yargs(['create-react-app']).command(cmd).parse();
    });
});
