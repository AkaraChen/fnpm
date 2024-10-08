import semver from 'semver';
import type { PackageJson } from 'type-fest';

const depsFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
] as const;

export type DepsField = (typeof depsFields)[number];

export function traverseDepsField(
    pkg: PackageJson,
    fn: (field: Record<string, string>) => void,
    fields: Readonly<DepsField[]> = depsFields,
): void {
    for (const field of fields) {
        const deps = pkg[field];
        if (deps) {
            fn(deps as Record<string, string>);
        }
    }
}

export function getDeps(
    pkg: PackageJson,
    fields: Readonly<DepsField[]> = depsFields,
): string[] {
    return [
        ...new Set(fields.flatMap((field) => Object.keys(pkg[field] ?? {}))),
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

export function hasExportFields(pkg: PackageJson, field: string): boolean {
    if (field in pkg) return true;
    const exports = pkg.exports;
    const exps = Array.isArray(exports) ? exports : [exports];
    for (const exp of exps) {
        if (typeof exp === 'string') continue;
        if (exp && field in exp) return true;
    }
    return false;
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

export const devDepsMatchers: Array<RegExp> = [
    // typescript
    /^@types\//,
    /typescript/,
    // eslint
    /^eslint/,
    // transpilers
    /^babel/,
    /^swc/,
    // testing
    /^jest/,
    /^@testing-library\//,
    // bundlers
    /^webpack/,
    /^rollup/,
    /^tsup/,
    // formatters
    /^prettier/,
    /^biome/,
    // git hooks
    /^commitlint/,
    /^lint-staged/,
    // e2e frameworks
    /^cypress/,
    /^playwright/,
    // css
    /^postcss/,
    // monorepo
    /^@nrwl/,
    /^nx/,
    /^lerna/,
    /^@rushstack\//,
    /^turbo/,
];

export function sortSemver(versions: string[]): string[] {
    return versions.sort((a, b) => semver.compare(a, b)).reverse();
}

export function hasReact(pkg: PackageJson): boolean {
    const deps = getDeps(pkg, [
        'dependencies',
        'optionalDependencies',
        'peerDependencies',
    ]);
    if (deps.includes('react')) return true;
    return false;
}

export type SemverType = 'major' | 'minor' | 'patch';

export function compartUpdate(older: string, newer: string): SemverType | null {
    const cleanedOlder = semver.coerce(older)!;
    const cleanedNewer = semver.coerce(newer)!;
    if (semver.major(cleanedOlder) !== semver.major(cleanedNewer))
        return 'major';
    if (semver.minor(cleanedOlder) !== semver.minor(cleanedNewer))
        return 'minor';
    if (semver.patch(cleanedOlder) !== semver.patch(cleanedNewer))
        return 'patch';
    return null;
}

export function simplifySemver(input: string): string {
    return semver.coerce(input)?.version ?? input;
}

export function concatNpmUrl(pkg: string, version?: string): string {
    if (!version) return new URL(pkg, 'https://npm.im').href;
    return new URL(
        `/package/${pkg}/v/${simplifySemver(version)}`,
        'https://www.npmjs.com',
    ).href;
}
