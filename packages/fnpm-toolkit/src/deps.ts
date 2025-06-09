import type { PackageJson } from 'type-fest';

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

export const depsFields = [
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

export function hasReact(pkg: PackageJson): boolean {
    const deps = getDeps(pkg, [
        'dependencies',
        'optionalDependencies',
        'peerDependencies',
    ]);
    if (deps.includes('react')) return true;
    return false;
}
