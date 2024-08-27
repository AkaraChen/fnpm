import type { PackageJson } from 'type-fest';

const depsFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
] as const;

export type DepsField = (typeof depsFields)[number];

export function getDeps(pkg: PackageJson) {
    return [
        ...new Set(
            depsFields.flatMap((field) => Object.keys(pkg[field] ?? {})),
        ),
    ];
}

export function getDep(pkg: PackageJson, dep: string) {
    for (const field of depsFields) {
        if (pkg[field]?.[dep]) {
            return {
                field,
                version: pkg[field][dep],
            };
        }
    }
    return null;
}
