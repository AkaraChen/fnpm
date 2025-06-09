import { describe, expect, it, vi } from 'vitest';
import {
    devDepsMatchers,
    getDep,
    getDeps,
    hasReact,
    traverseDepsField,
} from './deps';

describe('getDeps', () => {
    it('should return an empty array if all dependency fields are empty', () => {
        const pkg = {
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
            optionalDependencies: {},
        };

        const result = getDeps(pkg);

        expect(result).toEqual([]);
    });

    it('should return an array of all dependency keys', () => {
        const pkg = {
            dependencies: {
                react: '^17.0.1',
                lodash: '^4.17.21',
            },
            devDependencies: {
                jest: '^27.0.4',
                '@types/jest': '^27.0.1',
            },
            peerDependencies: {
                react: '^17.0.1',
            },
            optionalDependencies: {},
        };

        const result = getDeps(pkg);

        expect(result).toEqual(['react', 'lodash', 'jest', '@types/jest']);
    });

    it('should return only dependencies from specified fields', () => {
        const pkg = {
            dependencies: {
                react: '^17.0.1',
                lodash: '^4.17.21',
            },
            devDependencies: {
                jest: '^27.0.4',
                '@types/jest': '^27.0.1',
            },
            peerDependencies: {
                react: '^17.0.1',
            },
            optionalDependencies: {
                chalk: '^4.1.2',
            },
        };

        const result = getDeps(pkg, ['dependencies', 'optionalDependencies']);

        expect(result).toEqual(['react', 'lodash', 'chalk']);
    });
});

describe('getDep', () => {
    it('should return null if dependency is not found', () => {
        const pkg = {
            dependencies: {
                lodash: '^4.17.21',
            },
        };

        const result = getDep(pkg, 'react');

        expect(result).toBeNull();
    });

    it('should return the dependency field and version if found', () => {
        const pkg = {
            dependencies: {
                lodash: '^4.17.21',
            },
            devDependencies: {
                jest: '^27.0.4',
            },
            peerDependencies: {
                react: '^17.0.1',
            },
        };

        expect(getDep(pkg, 'lodash')).toEqual({
            field: 'dependencies',
            version: '^4.17.21',
        });

        expect(getDep(pkg, 'jest')).toEqual({
            field: 'devDependencies',
            version: '^27.0.4',
        });

        expect(getDep(pkg, 'react')).toEqual({
            field: 'peerDependencies',
            version: '^17.0.1',
        });
    });
});

describe('traverseDepsField', () => {
    it('should call the function for each dependency field that exists', () => {
        const pkg = {
            dependencies: {
                react: '^17.0.1',
            },
            devDependencies: {
                jest: '^27.0.4',
            },
        };

        const mockFn = vi.fn();
        traverseDepsField(pkg, mockFn);

        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith({ react: '^17.0.1' });
        expect(mockFn).toHaveBeenCalledWith({ jest: '^27.0.4' });
    });

    it('should only call the function for specified fields', () => {
        const pkg = {
            dependencies: {
                react: '^17.0.1',
            },
            devDependencies: {
                jest: '^27.0.4',
            },
            peerDependencies: {
                react: '^17.0.1',
            },
        };

        const mockFn = vi.fn();
        traverseDepsField(pkg, mockFn, ['dependencies']);

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith({ react: '^17.0.1' });
    });

    it('should not call the function for empty or non-existent fields', () => {
        const pkg = {
            // dependencies: {},
        };

        const mockFn = vi.fn();
        traverseDepsField(pkg, mockFn);

        expect(mockFn).toHaveBeenCalledTimes(0);
    });
});

describe('hasReact', () => {
    it('should return true if react is in dependencies', () => {
        const pkg = {
            dependencies: {
                react: '^17.0.1',
            },
        };

        expect(hasReact(pkg)).toBe(true);
    });

    it('should return true if react is in peerDependencies', () => {
        const pkg = {
            peerDependencies: {
                react: '^17.0.1',
            },
        };

        expect(hasReact(pkg)).toBe(true);
    });

    it('should return true if react is in optionalDependencies', () => {
        const pkg = {
            optionalDependencies: {
                react: '^17.0.1',
            },
        };

        expect(hasReact(pkg)).toBe(true);
    });

    it('should return false if react is only in devDependencies', () => {
        const pkg = {
            devDependencies: {
                react: '^17.0.1',
            },
        };

        expect(hasReact(pkg)).toBe(false);
    });

    it('should return false if react is not in any dependencies', () => {
        const pkg = {
            dependencies: {
                lodash: '^4.17.21',
            },
        };

        expect(hasReact(pkg)).toBe(false);
    });
});

describe('devDepsMatchers', () => {
    it('should match common development dependencies', () => {
        const devDeps = [
            '@types/react',
            'typescript',
            'eslint',
            'babel-core',
            'swc',
            'jest',
            '@testing-library/react',
            'webpack',
            'rollup',
            'tsup',
            'prettier',
            'biome',
            'commitlint',
            'lint-staged',
            'cypress',
            'playwright',
            'postcss',
            '@nrwl/cli',
            'nx',
            'lerna',
            '@rushstack/eslint-config',
            'turbo',
        ];

        for (const dep of devDeps) {
            const matches = devDepsMatchers.some((regex) => regex.test(dep));
            expect(matches).toBe(true);
        }
    });

    it('should not match regular dependencies', () => {
        const regularDeps = [
            'react',
            'lodash',
            'express',
            'axios',
            'vue',
            'next',
            'graphql',
        ];

        for (const dep of regularDeps) {
            const matches = devDepsMatchers.some((regex) => regex.test(dep));
            expect(matches).toBe(false);
        }
    });
});
