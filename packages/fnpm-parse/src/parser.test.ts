import { describe, expect, it } from 'vitest';
import { ParseError } from './errors';
import Parser from './parser';
import type { IParseResult } from './types';

describe('Parser', () => {
    const parser = new Parser();

    function assertParseResult(input: string, expected: Partial<IParseResult>) {
        const result = parser.parse(input);
        expect(result).toMatchObject(expected);
    }

    it('should parse a simple package name', () => {
        assertParseResult('lodash', {
            name: 'lodash',
            fullName: 'lodash',
            scope: undefined,
            version: undefined,
            path: undefined,
            extension: undefined,
        });
    });

    it('should parse a scoped package', () => {
        assertParseResult('@types/react', {
            scope: 'types',
            name: 'react',
            fullName: '@types/react',
            version: undefined,
            path: undefined,
            extension: undefined,
        });
    });

    it('should parse a package with version', () => {
        assertParseResult('react@17.0.2', {
            name: 'react',
            fullName: 'react',
            version: '17.0.2',
            scope: undefined,
            path: undefined,
            extension: undefined,
        });
    });

    it('should parse a scoped package with version', () => {
        assertParseResult('@types/react@17.0.0', {
            scope: 'types',
            name: 'react',
            fullName: '@types/react',
            version: '17.0.0',
            path: undefined,
            extension: undefined,
        });
    });

    it('should parse a package with path', () => {
        assertParseResult('lodash/fp', {
            name: 'lodash',
            fullName: 'lodash',
            path: 'fp',
            scope: undefined,
            version: undefined,
            extension: undefined, // No extension in 'fp'
        });
    });

    it('should parse a scoped package with path', () => {
        assertParseResult('@babel/core/lib/transform.js', {
            scope: 'babel',
            name: 'core',
            fullName: '@babel/core',
            path: 'lib/transform.js',
            extension: 'js',
            version: undefined,
        });
    });

    it('should parse a package with version and path', () => {
        assertParseResult('react@17.0.2/jsx-runtime.js', {
            name: 'react',
            fullName: 'react',
            version: '17.0.2',
            path: 'jsx-runtime.js',
            extension: 'js',
            scope: undefined,
        });
    });

    it('should parse a scoped package with version and path', () => {
        assertParseResult('@babel/core@7.15.0/lib/transform.js', {
            scope: 'babel',
            name: 'core',
            fullName: '@babel/core',
            version: '7.15.0',
            path: 'lib/transform.js',
            extension: 'js',
        });
    });

    it('should handle path with multiple segments and extension', () => {
        assertParseResult('my-package/path/to/file.ext.js', {
            name: 'my-package',
            fullName: 'my-package',
            path: 'path/to/file.ext.js',
            extension: 'js',
        });
    });

    it('should handle path without extension', () => {
        assertParseResult('my-package/path/to/file', {
            name: 'my-package',
            fullName: 'my-package',
            path: 'path/to/file',
            extension: undefined,
        });
    });

    it('should handle path that is just a filename with extension', () => {
        assertParseResult('my-package/file.css', {
            name: 'my-package',
            fullName: 'my-package',
            path: 'file.css',
            extension: 'css',
        });
    });

    it('should handle path that is just a filename without extension', () => {
        assertParseResult('my-package/file', {
            name: 'my-package',
            fullName: 'my-package',
            path: 'file',
            extension: undefined,
        });
    });

    it('should handle empty string input', () => {
        assertParseResult('', {
            name: '',
            fullName: '',
            scope: undefined,
            version: undefined,
            path: undefined,
            extension: undefined,
        });
    });

    it('should handle package name with dots and dashes', () => {
        assertParseResult('jquery-ui.widget@1.0.0/core.js', {
            name: 'jquery-ui.widget',
            fullName: 'jquery-ui.widget',
            version: '1.0.0',
            path: 'core.js',
            extension: 'js',
        });
    });

    it('should handle specifier with only name and version, no path', () => {
        assertParseResult('foo@1.2.3', {
            name: 'foo',
            fullName: 'foo',
            version: '1.2.3',
            path: undefined,
            extension: undefined,
        });
    });

    it('should handle specifier with only scope, name and version, no path', () => {
        assertParseResult('@foo/bar@1.2.3', {
            scope: 'foo',
            name: 'bar',
            fullName: '@foo/bar',
            version: '1.2.3',
            path: undefined,
            extension: undefined,
        });
    });

    // Edge cases for malformed or ambiguous inputs
    // The current parser is somewhat lenient and might produce partial results
    // or results that might be considered incorrect for strictly invalid inputs.

    it('should handle malformed scope like @/package (current parser might fail or produce unexpected)', () => {
        // Based on current parser logic, this will likely result in empty name/fullName
        expect(() => parser.parse('@/my-package')).toThrowError(ParseError);
    });

    it('should handle specifier with trailing @', () => {
        assertParseResult('package@', {
            name: 'package',
            fullName: 'package',
            version: undefined, // Trailing @ is not a valid version
            path: undefined,
        });
    });

    it('should handle specifier with trailing /', () => {
        assertParseResult('package/', {
            name: 'package',
            fullName: 'package',
            path: '', // Path is present but empty
            version: undefined,
        });
    });

    it('should handle specifier with version and trailing /', () => {
        assertParseResult('package@1.0.0/', {
            name: 'package',
            fullName: 'package',
            version: '1.0.0',
            path: '',
        });
    });

    it('should parse a path that looks like a version (e.g. /1.2.3)', () => {
        assertParseResult('package/1.2.3', {
            name: 'package',
            fullName: 'package',
            path: '1.2.3',
            extension: undefined, // Or '3' if we consider numbers after dot as extension
        });
    });

    it('should parse a path with multiple dots in filename', () => {
        assertParseResult('package/file.tar.gz', {
            name: 'package',
            fullName: 'package',
            path: 'file.tar.gz',
            extension: 'gz',
        });
    });

    it('should not extract extension from hidden files like .eslintrc.js', () => {
        assertParseResult('package/.eslintrc.js', {
            name: 'package',
            fullName: 'package',
            path: '.eslintrc.js',
            extension: undefined, // '.eslintrc.js' starts with a dot
        });
    });
});
