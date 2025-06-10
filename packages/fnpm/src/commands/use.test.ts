import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import Use from './use';

// Mock the util module
vi.mock('../util', () => ({
    exec: vi.fn(),
}));

describe('Use Command', () => {
    // Store the original ctx before each test
    const originalCtx = globalThis.ctx;

    beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();

        // Mock globalThis.ctx
        globalThis.ctx = {
            pm: 'pnpm',
            root: '/test/root',
        } as any;
    });

    afterEach(() => {
        // Restore the original ctx after each test
        globalThis.ctx = originalCtx;
    });

    it('should handle use command with specific pattern', async () => {
        const cmd = new Use();
        const util = await import('../util');

        await yargs(['use', 'npm@8']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['corepack', 'use', 'npm@8'], {
            cwd: '/test/root',
        });
    });

    it('should handle use command with latest pattern', async () => {
        const cmd = new Use();
        const util = await import('../util');

        await yargs(['use', 'latest']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(
            ['corepack', 'use', 'pnpm@latest'],
            {
                cwd: '/test/root',
            },
        );
    });

    it('should require a pattern argument', async () => {
        const cmd = new Use();

        // Create a mock handler to test argument parsing
        cmd.handler = vi.fn();

        // This should fail because no pattern is provided
        await expect(() => yargs(['use']).command(cmd).parse()).toThrow();

        // Handler should not be called
        expect(cmd.handler).not.toHaveBeenCalled();
    });
});
