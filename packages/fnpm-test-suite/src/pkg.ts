import { FileSystem, Path } from '@effect/platform';
import defu from 'defu';
import { Effect } from 'effect';
import { nanoid } from 'nanoid';
import type { PackageJson } from 'type-fest';
import { JsonParse } from './utils';

export function MakePackage(
    dir: string,
    pkg: PackageJson = {
        name: nanoid(),
        version: '1.0.0',
    },
) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        yield* fs.writeFileString(
            path.join(dir, 'package.json'),
            JSON.stringify(pkg),
        );
        const srcDir = yield* fs.makeTempDirectoryScoped({
            directory: dir,
            prefix: 'src',
        });
        yield* fs.writeFileString(
            path.join(srcDir, 'index.js'),
            'console.log("Hello World");',
        );
    });
}

export function ReadPackageJson(dir: string) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        const json = yield* fs.readFileString(path.join(dir, 'package.json'));
        const parsed = yield* JsonParse<PackageJson>(json);
        return parsed;
    });
}

export function WritePackageJson(dir: string, pkg: PackageJson) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        yield* fs.writeFileString(
            path.join(dir, 'package.json'),
            JSON.stringify(pkg),
        );
    });
}

export function UpdatePackageJson(dir: string, pkg: PackageJson) {
    return Effect.gen(function* () {
        const json = yield* ReadPackageJson(dir);
        const merged = defu(pkg, json);
        yield* WritePackageJson(dir, merged);
    });
}
