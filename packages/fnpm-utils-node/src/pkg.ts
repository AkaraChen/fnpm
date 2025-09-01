import { Effect } from 'effect';
import type { UnknownException } from 'effect/Cause';
import {
    type Options as PackageDirectoryOptions,
    packageDirectory,
} from 'package-directory';
import { type PackageJson, readPackage } from 'pkg-types';

export function ReadPackage(
    path?: string
): Effect.Effect<PackageJson, never, never> {
    return Effect.promise(() => readPackage(path));
}

export function PackageDirectory(
    options: PackageDirectoryOptions
): Effect.Effect<string, UnknownException, never> {
    return Effect.tryPromise(() =>
        packageDirectory(options).then((dir) => {
            if (!dir) {
                throw new Error('No package directory found');
            }
            return dir;
        })
    );
}
