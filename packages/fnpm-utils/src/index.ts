import type { PackageJson } from 'type-fest';

const depsFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
] as const;

export function getDeps(pkg: PackageJson) {
    return depsFields.flatMap((field) => Object.keys(pkg[field] ?? {}));
}
