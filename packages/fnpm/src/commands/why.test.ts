import { beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { ctx, factory } from '../../tests/utils';
import Why from './why';

// Mock the util module
vi.mock(import('../util'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        exec: vi.fn(),
    };
});

describe('Why Command', () => {
    beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();

        // Set ctx properties for tests
        ctx.pm = 'pnpm';
        ctx.root = '/test/root';
    });

    it('should explain why a package is installed', async () => {
        const cmd = factory.create(Why);
        const util = await import('../util');

        await yargs(['why', 'react']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['pnpm', 'why', 'react'], {
            cwd: '/test/root',
        });
    });

    it('should work with explain alias', async () => {
        const cmd = factory.create(Why);
        const util = await import('../util');

        await yargs(['explain', 'lodash']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['pnpm', 'why', 'lodash'], {
            cwd: '/test/root',
        });
    });

    it('should require a query argument', async () => {
        const cmd = factory.create(Why);

        // Create a mock handler to test argument parsing
        cmd.handler = vi.fn();

        // This should fail because no query is provided
        await expect(() => yargs(['why']).command(cmd).parse()).toThrow();

        // Handler should not be called
        expect(cmd.handler).not.toHaveBeenCalled();
    });
});
