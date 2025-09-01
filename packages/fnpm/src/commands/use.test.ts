import { beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { factory } from '../../tests/utils';
import Use from './use';

// Mock the util module
vi.mock(import('../util'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        exec: vi.fn(),
        getContext: vi.fn(),
        normalizePackageVersion: vi.fn(),
    };
});

vi.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('exit');
});

describe('Use Command', () => {
    // Set up test context
    beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();
    });

    it('should handle use command with specific pattern', async () => {
        const cmd = factory.create(Use, {
            args: ['use', 'npm@8'],
            root: '/test/root',
            pm: 'pnpm',
        });
        const util = await import('../util');

        await yargs(['use', 'npm@8']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['corepack', 'use', 'npm@8'], {
            cwd: '/test/root',
        });
    });

    it('should handle use command with latest pattern', async () => {
        const cmd = factory.create(Use, {
            args: ['use', 'latest'],
            root: '/test/root',
            pm: 'pnpm',
        });
        const util = await import('../util');

        await yargs(['use', 'latest']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(
            ['corepack', 'use', 'pnpm@latest'],
            {
                cwd: '/test/root',
            }
        );
    });
});
