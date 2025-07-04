import { Effect } from 'effect';
import type { UnknownException } from 'effect/Cause';
import {
    type Options as PackageDirectoryOptions,
    packageDirectory,
} from 'package-directory';
import {
    type PackageJson,
    type Options as ReadPackageOptions,
    readPackage,
} from 'read-pkg';

export function ReadPackage(
    options: ReadPackageOptions,
): Effect.Effect<PackageJson, never, never> {
    return Effect.promise(() => readPackage(options));
}

export function PackageDirectory(
    options: PackageDirectoryOptions,
): Effect.Effect<string, UnknownException, never> {
    return Effect.tryPromise(() =>
        packageDirectory(options).then((dir) => {
            if (!dir) {
                throw new Error('No package directory found');
            }
            return dir;
        }),
    );
}
