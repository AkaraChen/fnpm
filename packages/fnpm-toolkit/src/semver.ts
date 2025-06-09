import semver from 'semver';

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

export function sortSemver(versions: string[]): string[] {
    return versions.sort((a, b) => semver.compare(a, b)).reverse();
}
