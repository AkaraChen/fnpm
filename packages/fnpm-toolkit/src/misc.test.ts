import { describe, expect, it } from 'vitest';
import { concatNpmUrl, getTypesPackage, parsePackageName } from './misc';

describe('concatNpmUrl', () => {
    it('should create npm.im URL when no version is provided', () => {
        expect(concatNpmUrl('react')).toBe('https://npm.im/react');
        expect(concatNpmUrl('@types/react')).toBe(
            'https://npm.im/@types/react',
        );
    });

    it('should create npmjs.com URL with version when version is provided', () => {
        expect(concatNpmUrl('react', '17.0.2')).toBe(
            'https://www.npmjs.com/package/react/v/17.0.2',
        );
        expect(concatNpmUrl('@types/react', '17.0.0')).toBe(
            'https://www.npmjs.com/package/@types/react/v/17.0.0',
        );
    });

    it('should simplify version in URL when complex version is provided', () => {
        expect(concatNpmUrl('react', 'v17.0.2')).toBe(
            'https://www.npmjs.com/package/react/v/17.0.2',
        );
        expect(concatNpmUrl('react', '17.0.2-beta.1')).toBe(
            'https://www.npmjs.com/package/react/v/17.0.2',
        );
        expect(concatNpmUrl('react', '^17.0.2')).toBe(
            'https://www.npmjs.com/package/react/v/17.0.2',
        );
    });
});

describe('parsePackageName', () => {
    it('should parse regular package names', () => {
        expect(parsePackageName('react')).toEqual({ name: 'react' });
        expect(parsePackageName('lodash')).toEqual({ name: 'lodash' });
    });

    it('should parse scoped package names', () => {
        expect(parsePackageName('@types/react')).toEqual({
            scope: 'types',
            name: 'react',
        });
        expect(parsePackageName('@babel/core')).toEqual({
            scope: 'babel',
            name: 'core',
        });
    });

    it('should throw an error for invalid scoped package names', () => {
        expect(() => parsePackageName('@invalid')).toThrow(
            'Invalid package name',
        );
        expect(() => parsePackageName('@/')).toThrow('Invalid package name');
    });
});

describe('getTypesPackage', () => {
    it('should return @types package name for regular packages', () => {
        expect(getTypesPackage('react')).toBe('@types/react');
        expect(getTypesPackage('lodash')).toBe('@types/lodash');
    });

    it('should return @types package name with double underscore for scoped packages', () => {
        expect(getTypesPackage('@babel/core')).toBe('@types/babel__core');
        expect(getTypesPackage('@angular/core')).toBe('@types/angular__core');
    });
});
