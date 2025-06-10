import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import Why from './why';

// Mock the util module
vi.mock('../util', () => ({
    exec: vi.fn(),
}));

describe('Why Command', () => {
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

    it('should explain why a package is installed', async () => {
        const cmd = new Why();
        const util = await import('../util');

        await yargs(['why', 'react']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['pnpm', 'why', 'react'], {
            cwd: '/test/root',
        });
    });

    it('should work with explain alias', async () => {
        const cmd = new Why();
        const util = await import('../util');

        await yargs(['explain', 'lodash']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['pnpm', 'why', 'lodash'], {
            cwd: '/test/root',
        });
    });

    it('should require a query argument', async () => {
        const cmd = new Why();

        // Create a mock handler to test argument parsing
        cmd.handler = vi.fn();

        // This should fail because no query is provided
        await expect(() => yargs(['why']).command(cmd).parse()).toThrow();

        // Handler should not be called
        expect(cmd.handler).not.toHaveBeenCalled();
    });
});
