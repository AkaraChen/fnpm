import type { PackageJson } from 'type-fest';

const depsFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
] as const;

export type DepsField = (typeof depsFields)[number];

export function getDeps(pkg: PackageJson): string[] {
    return [
        ...new Set(
            depsFields.flatMap((field) => Object.keys(pkg[field] ?? {})),
        ),
    ];
}

export function getDep(
    pkg: PackageJson,
    dep: string,
): {
    field: DepsField;
    version: string;
} | null {
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

export function hasExports(pkg: PackageJson): boolean {
    return !!(pkg.exports || pkg.main || pkg.main);
}

export function hasBin(pkg: PackageJson): boolean {
    return !!pkg.bin;
}

export function getBin(pkg: PackageJson): Array<{
    name: string;
    path: string;
}> {
    if (typeof pkg.bin === 'object') {
        return Object.entries(pkg.bin).map(([name, path]) => ({
            name,
            path: path!,
        }));
    }
    return [{ name: pkg.name!, path: pkg.bin! }];
}

export function hasTypes(pkg: PackageJson): boolean {
    const exportsHasType = JSON.stringify(pkg.exports)?.includes('.d.ts');
    return !!(pkg.types || pkg.typesVersions || pkg.typings) || exportsHasType;
}

export function getRepository(pkg: PackageJson): string | undefined {
    const field =
        typeof pkg.repository === 'object'
            ? pkg.repository.url
            : pkg.repository;
    return field?.slice('git+'.length, -'.git'.length);
}
