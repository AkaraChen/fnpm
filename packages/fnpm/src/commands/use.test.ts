import { beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { ctx, factory } from '../../tests/utils';
import Use from './use';

// Mock the util module
vi.mock(import('../util'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        exec: vi.fn(),
    };
});

describe('Use Command', () => {
    // Set up test context
    beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();

        // Set ctx properties for tests
        ctx.pm = 'pnpm';
        ctx.root = '/test/root';
    });

    it('should handle use command with specific pattern', async () => {
        const cmd = factory.create(Use);
        const util = await import('../util');

        await yargs(['use', 'npm@8']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['corepack', 'use', 'npm@8'], {
            cwd: '/test/root',
        });
    });

    it('should handle use command with latest pattern', async () => {
        const cmd = factory.create(Use);
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
        const cmd = factory.create(Use);

        // Create a mock handler to test argument parsing
        cmd.handler = vi.fn();

        // This should fail because no pattern is provided
        await expect(() => yargs(['use']).command(cmd).parse()).toThrow();

        // Handler should not be called
        expect(cmd.handler).not.toHaveBeenCalled();
    });
});
