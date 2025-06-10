import { describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { factory } from '../../tests/utils';
import Create from './create';

vi.mock(import('../util'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        error: vi.fn(() => ({}) as never),
        exec: vi.fn(),
        normalizePackageVersion: (name: string) => name,
    };
});

describe('Create Command', () => {
    it('should handle create command with package name', async () => {
        const cmd = factory.create(Create, {
            args: ['create', 'my-app'],
            root: '/test/root',
            pm: 'pnpm',
        });

        cmd.handler = vi.fn((args) => {
            expect(args._).toEqual(['create', 'my-app']);
        });

        await yargs(['create', 'my-app']).command(cmd).parse();

        expect(cmd.handler).toHaveBeenCalled();
    });

    it('should handle create command with package name and additional args', async () => {
        const cmd = factory.create(Create, {
            args: ['create', 'my-app', '--template', 'react'],
            root: '/test/root',
            pm: 'pnpm',
        });

        await yargs(['create', 'my-app', '--template', 'react'])
            .command(cmd)
            .parse();

        expect((await import('../util')).exec).toHaveBeenCalledWith([
            'pnpm',
            'create',
            'my-app',
            '--template',
            'react',
        ]);
    });

    it('should throw error when no package name is specified', async () => {
        const cmd = factory.create(Create, {
            args: ['create'],
            root: '/test/root',
            pm: 'pnpm',
        });

        cmd.handler = vi.fn((args) => {
            expect(args._).toEqual(['create']);
        });

        await yargs(['create']).command(cmd).parse();

        expect(cmd.handler).toHaveBeenCalled();
    });
});
