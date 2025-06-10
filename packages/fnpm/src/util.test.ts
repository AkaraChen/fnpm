import { consola } from 'consola';
import * as tinyexec from 'tinyexec';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { error, exec, normalizePackageVersion } from './util';

// Mock tinyexec
vi.mock('tinyexec', () => ({
    x: vi.fn(),
}));

// Mock consola
vi.mock('consola', () => ({
    consola: {
        error: vi.fn(),
    },
}));

// Mock process.exit
const mockProcessExit = vi
    .spyOn(process, 'exit')
    .mockImplementation((() => {}) as () => never);

describe('util', () => {
    beforeEach(() => {
        // This clears call history, etc., for all mocks before each test in this file.
        vi.clearAllMocks();
    });

    describe('exec', () => {
        it('should call tinyexec.x with correct parameters', async () => {
            const shellCommand = ['echo', 'Hello, World!'];
            const options = { cwd: '/test/dir' };
            await exec(shellCommand, options);
            expect(tinyexec.x).toHaveBeenCalledWith(
                shellCommand[0],
                shellCommand.slice(1),
                {
                    nodeOptions: {
                        cwd: options.cwd,
                        stdio: 'inherit',
                    },
                },
            );
        });
    });

    describe('error', () => {
        it('should call consola.error and process.exit with correct parameters', () => {
            const errorMessage = 'Test error message';
            error(errorMessage);
            expect(consola.error).toHaveBeenCalledWith(errorMessage);
            expect(mockProcessExit).toHaveBeenCalledWith(1);
        });
    });

    describe('getContext', () => {
        let mockResolveContext: Mock;
        let mockPackageDirectory: Mock;
        let mockHideBin: Mock;
        let getContextFunc: typeof import('./util').getContext;

        beforeEach(async () => {
            vi.resetModules(); // Reset module cache before setting up mocks

            mockResolveContext = vi.fn();
            mockPackageDirectory = vi.fn();
            mockHideBin = vi.fn();

            vi.doMock('fnpm-context', () => ({
                resolveContext: mockResolveContext,
            }));
            vi.doMock('package-directory', () => ({
                packageDirectory: mockPackageDirectory,
            }));
            vi.doMock('yargs/helpers', () => ({ hideBin: mockHideBin }));

            // Import the module under test after mocks are set up
            const utilsModule = await import('./util');
            getContextFunc = utilsModule.getContext;
        });

        // No afterEach for vi.resetModules() here, as beforeEach handles it.

        it('should return context with root from resolveContext when -w flag is present', async () => {
            const originalArgv = [...process.argv];
            process.argv = ['node', 'script.js', '-w', 'some', 'args'];
            mockResolveContext.mockResolvedValue({
                root: '/resolved/root',
                pm: 'pnpm',
            });
            mockHideBin.mockReturnValue(['some', 'args']);

            const context = await getContextFunc('/current/dir');

            expect(mockResolveContext).toHaveBeenCalledWith('/current/dir');
            expect(context.root).toBe('/resolved/root');
            expect(context.pm).toBe('pnpm');
            expect(mockHideBin).toHaveBeenCalledWith([
                'node',
                'script.js',
                'some',
                'args',
            ]); // -w removed
            expect(context.args).toEqual(['some', 'args']);
            process.argv = originalArgv; // Restore original argv
        });

        it('should return context with root from packageDirectory when -w flag is not present', async () => {
            const originalArgv = [...process.argv];
            process.argv = ['node', 'script.js', 'other', 'args'];
            mockResolveContext.mockResolvedValue({
                root: '/resolved/root',
                pm: 'npm',
            });
            mockPackageDirectory.mockResolvedValue('/pkg/dir/root');
            mockHideBin.mockReturnValue(['other', 'args']);

            const { getContext } = await import('./util');
            const context = await getContext('/current/dir');

            expect(mockResolveContext).toHaveBeenCalledWith('/current/dir');
            expect(mockPackageDirectory).toHaveBeenCalledWith({
                cwd: '/current/dir',
            });
            expect(context.root).toBe('/pkg/dir/root');
            expect(context.pm).toBe('npm');
            expect(mockHideBin).toHaveBeenCalledWith([
                'node',
                'script.js',
                'other',
                'args',
            ]);
            expect(context.args).toEqual(['other', 'args']);
            process.argv = originalArgv;
        });

        it('should return context with cwd as root when -w is not present and packageDirectory returns null', async () => {
            const originalArgv = [...process.argv];
            process.argv = ['node', 'script.js', 'another', 'arg'];
            mockResolveContext.mockResolvedValue({
                root: '/resolved/root',
                pm: 'yarn',
            });
            mockPackageDirectory.mockResolvedValue(null);
            mockHideBin.mockReturnValue(['another', 'arg']);

            const context = await getContextFunc('/fallback/cwd');

            expect(mockResolveContext).toHaveBeenCalledWith('/fallback/cwd');
            expect(mockPackageDirectory).toHaveBeenCalledWith({
                cwd: '/fallback/cwd',
            });
            expect(context.root).toBe('/fallback/cwd');
            expect(context.pm).toBe('yarn');
            expect(mockHideBin).toHaveBeenCalledWith([
                'node',
                'script.js',
                'another',
                'arg',
            ]);
            expect(context.args).toEqual(['another', 'arg']);
            process.argv = originalArgv;
        });
    });

    describe('normalizePackageVersion', () => {
        it('should return name@version if version is provided', async () => {
            const result = normalizePackageVersion('test-pkg@1.2.3');
            expect(result).toBe('test-pkg@1.2.3');
        });

        it('should return name@latest if version is not provided', async () => {
            const result = normalizePackageVersion('test-pkg');
            expect(result).toBe('test-pkg@latest');
        });

        it('should return name@latest if version is an empty string', async () => {
            const result = normalizePackageVersion('test-pkg@');
            expect(result).toBe('test-pkg@latest');
        });

        it('should handle scoped packages correctly with version', async () => {
            const result = normalizePackageVersion('@scope/test-pkg@0.0.1');
            expect(result).toBe('@scope/test-pkg@0.0.1');
        });

        it('should handle scoped packages correctly without version', async () => {
            const result = normalizePackageVersion('@scope/test-pkg');
            expect(result).toBe('@scope/test-pkg@latest');
        });
    });
});
