import { FileSystem } from '@effect/platform';
import { Effect } from 'effect';
import { nanoid } from 'nanoid';
import type { PackageJson } from 'type-fest';

export const MakePackage = (
    dir: string,
    pkg: PackageJson = {
        name: nanoid(),
        version: '1.0.0',
    },
) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString(
            yield* fs.makeTempFileScoped({
                directory: dir,
                prefix: 'package.json',
            }),
            JSON.stringify(pkg),
        );
        const srcDir = yield* fs.makeTempDirectoryScoped({
            directory: dir,
            prefix: 'src',
        });
        yield* fs.writeFileString(
            yield* fs.makeTempFileScoped({
                directory: srcDir,
                prefix: 'index.js',
            }),
            'console.log("Hello World");',
        );
    });
