import { describe, expect, it } from 'vitest';
import {
    getBin,
    getRepository,
    hasBin,
    hasExportFields,
    hasExports,
    hasTypes,
} from './manifest';

describe('hasExports', () => {
    it('should return true if package has exports field', () => {
        const pkg = {
            exports: {
                '.': './dist/index.js',
            },
        };
        expect(hasExports(pkg)).toBe(true);
    });

    it('should return true if package has main field', () => {
        const pkg = {
            main: './dist/index.js',
        };
        expect(hasExports(pkg)).toBe(true);
    });

    it('should return false if package has neither exports nor main', () => {
        const pkg = {};
        expect(hasExports(pkg)).toBe(false);
    });
});

describe('hasBin', () => {
    it('should return true if package has bin field as object', () => {
        const pkg = {
            bin: {
                cli: './bin/cli.js',
            },
        };
        expect(hasBin(pkg)).toBe(true);
    });

    it('should return true if package has bin field as string', () => {
        const pkg = {
            bin: './bin/cli.js',
        };
        expect(hasBin(pkg)).toBe(true);
    });

    it('should return false if package has no bin field', () => {
        const pkg = {};
        expect(hasBin(pkg)).toBe(false);
    });
});

describe('hasExportFields', () => {
    it('should return true if field exists directly in package', () => {
        const pkg = {
            types: './dist/index.d.ts',
        };
        expect(hasExportFields(pkg, 'types')).toBe(true);
    });

    it('should return true if field exists in exports object', () => {
        const pkg = {
            exports: {
                types: './dist/index.d.ts',
            },
        };
        expect(hasExportFields(pkg, 'types')).toBe(true);
    });

    it('should return true if field exists in exports array', () => {
        const pkg = {
            exports: [
                {
                    types: './dist/index.d.ts',
                },
            ],
        };
        expect(hasExportFields(pkg, 'types')).toBe(true);
    });

    it('should return false if field does not exist', () => {
        const pkg = {
            exports: {
                import: './dist/index.mjs',
            },
        };
        expect(hasExportFields(pkg, 'types')).toBe(false);
    });

    it('should handle string exports correctly', () => {
        const pkg = {
            exports: './dist/index.js',
        };
        expect(hasExportFields(pkg, 'types')).toBe(false);
    });
});

describe('getBin', () => {
    it('should return array with name and path for object bin', () => {
        const pkg = {
            bin: {
                cli: './bin/cli.js',
                other: './bin/other.js',
            },
        };
        expect(getBin(pkg)).toEqual([
            { name: 'cli', path: './bin/cli.js' },
            { name: 'other', path: './bin/other.js' },
        ]);
    });

    it('should return array with package name and path for string bin', () => {
        const pkg = {
            name: 'my-package',
            bin: './bin/cli.js',
        };
        expect(getBin(pkg)).toEqual([
            { name: 'my-package', path: './bin/cli.js' },
        ]);
    });
});

describe('hasTypes', () => {
    it('should return true if package has types field', () => {
        const pkg = {
            types: './dist/index.d.ts',
        };
        expect(hasTypes(pkg)).toBe(true);
    });

    it('should return true if package has typings field', () => {
        const pkg = {
            typings: './dist/index.d.ts',
        };
        expect(hasTypes(pkg)).toBe(true);
    });

    it('should return true if package has typesVersions field', () => {
        const pkg = {
            typesVersions: {
                '>=4.0': {
                    '*': ['./dist/*.d.ts'],
                },
            },
        };
        expect(hasTypes(pkg)).toBe(true);
    });

    it('should return true if package exports includes .d.ts files', () => {
        const pkg = {
            exports: {
                '.': {
                    types: './dist/index.d.ts',
                    import: './dist/index.mjs',
                },
            },
        };
        expect(hasTypes(pkg)).toBe(true);
    });

    it('should return false if package has no type definitions', () => {
        const pkg = {
            main: './dist/index.js',
            exports: './dist/index.js', // Add exports that don't include .d.ts
        };
        expect(hasTypes(pkg)).toBe(false);
    });
});

describe('getRepository', () => {
    it('should extract repository URL from object format', () => {
        const pkg = {
            repository: {
                type: 'git',
                url: 'git+https://github.com/user/repo.git',
            },
        };
        expect(getRepository(pkg)).toBe('https://github.com/user/repo');
    });

    it('should extract repository URL from string format', () => {
        const pkg = {
            repository: 'git+https://github.com/user/repo.git',
        };
        expect(getRepository(pkg)).toBe('https://github.com/user/repo');
    });

    it('should return undefined if repository is not defined', () => {
        const pkg = {};
        expect(getRepository(pkg)).toBeUndefined();
    });
});
