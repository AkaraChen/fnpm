import { beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { factory } from '../../tests/utils';
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
    });

    it('should explain why a package is installed', async () => {
        const cmd = factory.create(Why, {
            args: ['why', 'react'],
            root: '/test/root',
            pm: 'pnpm',
        });
        const util = await import('../util');

        await yargs(['why', 'react']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['pnpm', 'why', 'react'], {
            cwd: '/test/root',
        });
    });

    it('should work with explain alias', async () => {
        const cmd = factory.create(Why, {
            args: ['explain', 'lodash'],
            root: '/test/root',
            pm: 'pnpm',
        });
        const util = await import('../util');

        await yargs(['explain', 'lodash']).command(cmd).parse();

        // Verify that exec was called with the correct arguments
        expect(util.exec).toHaveBeenCalledWith(['pnpm', 'why', 'lodash'], {
            cwd: '/test/root',
        });
    });
});
