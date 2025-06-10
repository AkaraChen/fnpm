import { beforeEach, describe, expect, it, vi } from 'vitest';
import yargs from 'yargs';
import { ctx, factory } from '../../tests/utils';
import View from './view';

// Mock dependencies
vi.mock('read-pkg', () => ({
    readPackage: vi.fn(),
}));

vi.mock('open', () => ({
    default: vi.fn(),
}));

vi.mock(import('../util'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        error: vi.fn(() => ({}) as never),
        exec: vi.fn(),
        normalizePackageVersion: (name: string) => name,
    };
});

describe('View Command', () => {
    beforeEach(() => {
        // Reset mocks
        vi.resetAllMocks();

        // Set ctx properties for tests
        ctx.root = '/test/root';
    });

    it('should open npm page by default', async () => {
        const cmd = factory.create(View);
        const readPkg = await import('read-pkg');
        const open = await import('open');

        // Mock package.json content
        vi.mocked(readPkg.readPackage).mockResolvedValue({
            name: 'test-package',
        } as any);

        await yargs(['view']).command(cmd).parse();

        // Verify that open was called with the correct URL
        expect(open.default).toHaveBeenCalledWith(
            'https://npm.im/test-package',
        );
    });

    it('should open npm page with npm platform', async () => {
        const cmd = factory.create(View);
        const readPkg = await import('read-pkg');
        const open = await import('open');

        // Mock package.json content
        vi.mocked(readPkg.readPackage).mockResolvedValue({
            name: 'test-package',
        } as any);

        await yargs(['view', 'npm']).command(cmd).parse();

        // Verify that open was called with the correct URL
        expect(open.default).toHaveBeenCalledWith(
            'https://npm.im/test-package',
        );
    });

    it('should open repository page with repo platform', async () => {
        const cmd = factory.create(View);
        const readPkg = await import('read-pkg');
        const open = await import('open');

        // Mock package.json content
        vi.mocked(readPkg.readPackage).mockResolvedValue({
            name: 'test-package',
            repository: {
                type: 'git',
                url: 'git+https://github.com/user/test-package.git',
            },
        } as any);

        await yargs(['view', 'repo']).command(cmd).parse();

        // Verify that open was called with the correct URL
        expect(open.default).toHaveBeenCalledWith(
            'https://github.com/user/test-package.git',
        );
    });

    it('should handle non-git repository error', async () => {
        const cmd = factory.create(View);
        const readPkg = await import('read-pkg');
        const util = await import('../util');

        // Mock package.json content with non-git repository
        vi.mocked(readPkg.readPackage).mockResolvedValue({
            name: 'test-package',
            repository: {
                type: 'svn',
                url: 'svn://example.com/repo',
            },
        } as any);

        await yargs(['view', 'repo']).command(cmd).parse();

        // Verify that error was called with the correct message
        expect(util.error).toHaveBeenCalledWith(
            "The package's repository is hosted on svn which is not supported yet.",
        );
    });

    it('should handle unsupported platform error', async () => {
        const cmd = factory.create(View);
        const util = await import('../util');

        // Override the handler to test unsupported platform
        cmd.handler = async (args: any) => {
            // Simulate unsupported platform
            args.platform = 'unsupported';
            await (await import('./view')).default.prototype.handler.call(
                cmd,
                args,
            );
        };

        await yargs(['view']).command(cmd).parse();

        // Verify that error was called with the correct message
        expect(util.error).toHaveBeenCalledWith(
            'The requested platform unsupported is not supported',
        );
    });
});
