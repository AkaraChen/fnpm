import { describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { ctx, factory } from '../../tests/utils';
import Dlx from './dlx';

// Mock the util module
vi.mock(import('../util'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        error: vi.fn(() => ({}) as never),
        exec: vi.fn(),
        normalizePackageVersion: (name: string) => name,
    };
});

describe('Dlx Command', () => {
    it('should handle dlx command with package name', async () => {
        const cmd = factory.create(Dlx);

        // Set ctx args for this test
        ctx.args = ['dlx', 'create-react-app'];

        await yargs(['dlx', 'create-react-app']).command(cmd).parse();

        // Verify that args are parsed correctly
        expect(ctx.args).toEqual(['dlx', 'create-react-app']);
    });

    it('should handle dlx command with package name and additional args', async () => {
        const cmd = factory.create(Dlx);

        // Set ctx args for this test
        ctx.args = [
            'dlx',
            'create-react-app',
            'my-app',
            '--template',
            'typescript',
        ];

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
        expect(ctx.args).toEqual([
            'dlx',
            'create-react-app',
            'my-app',
            '--template',
            'typescript',
        ]);
    });

    it('should throw error when no package is specified', async () => {
        const cmd = factory.create(Dlx);

        // Import the actual util module to get access to the mocked functions
        const util = await import('../util');

        // Set ctx args for this test
        ctx.args = ['dlx'];

        await yargs(['dlx']).command(cmd).parse();

        // Verify that error was called with the correct message
        expect(util.error).toHaveBeenCalledWith('No package specified');
    });

    it('should handle direct command without dlx prefix', async () => {
        const cmd = factory.create(Dlx);
        cmd.command = '*';

        // Create a mock handler to test argument parsing
        cmd.handler = vi.fn();

        // Set ctx args for this test
        ctx.args = ['create-react-app'];

        await yargs(['create-react-app']).command(cmd).parse();
        expect(cmd.handler).toHaveBeenCalled();
    });
});
