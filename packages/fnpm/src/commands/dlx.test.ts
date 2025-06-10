import { describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { factory } from '../../tests/utils';
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
        const cmd = factory.create(Dlx, {
            args: ['dlx', 'create-react-app'],
            root: '/test/root',
            pm: 'pnpm',
        });

        await yargs(['dlx', 'create-react-app']).command(cmd).parse();

        expect((await import('../util')).exec).toHaveBeenCalledWith([
            'pnpx',
            'create-react-app',
        ]);
    });

    it('should handle dlx command with package name and additional args', async () => {
        const cmd = factory.create(Dlx, {
            args: [
                'dlx',
                'create-react-app',
                'my-app',
                '--template',
                'typescript',
            ],
            root: '/test/root',
            pm: 'pnpm',
        });

        await yargs([
            'dlx',
            'create-react-app',
            'my-app',
            '--template',
            'typescript',
        ])
            .command(cmd)
            .parse();

        expect((await import('../util')).exec).toHaveBeenCalledWith([
            'pnpx',
            'create-react-app',
            'my-app',
            '--template',
            'typescript',
        ]);
    });

    it('should throw error when no package is specified', async () => {
        const cmd = factory.create(Dlx, {
            args: ['dlx'],
            root: '/test/root',
            pm: 'pnpm',
        });

        await yargs(['dlx']).command(cmd).parse();

        expect((await import('../util')).error).toHaveBeenCalledWith(
            'No package specified',
        );
    });

    it('should handle direct command without dlx prefix', async () => {
        const cmd = factory.create(Dlx, {
            args: ['create-react-app'],
            root: '/test/root',
            pm: 'pnpm',
        });
        cmd.command = '*';

        // Create a mock handler to test argument parsing
        cmd.handler = vi.fn();

        await yargs(['create-react-app']).command(cmd).parse();
        expect(cmd.handler).toHaveBeenCalled();
    });
});
