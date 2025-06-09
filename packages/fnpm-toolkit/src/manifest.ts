import type { PackageJson } from 'type-fest';

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
