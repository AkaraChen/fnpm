import { simplifySemver } from './semver';

export function concatNpmUrl(pkg: string, version?: string): string {
    if (!version) return new URL(pkg, 'https://npm.im').href;
    return new URL(
        `/package/${pkg}/v/${simplifySemver(version)}`,
        'https://www.npmjs.com'
    ).href;
}

export interface PackageName {
    scope?: string;
    name: string;
}

export function parsePackageName(input: string): PackageName {
    if (input.includes('@')) {
        const [scope, name] = input.slice(1).split('/');
        if (!scope || !name) throw new Error('Invalid package name');
        return { scope, name };
    }
    return { name: input };
}

export function getTypesPackage(input: string): string {
    const { scope, name } = parsePackageName(input);
    if (scope) return `@types/${scope}__${name}`;
    return `@types/${name}`;
}
