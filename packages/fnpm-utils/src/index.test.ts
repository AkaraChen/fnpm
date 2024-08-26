import { describe, expect, it } from 'vitest';
import { getDeps } from '.';

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
});
