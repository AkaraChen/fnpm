import * as yaml from '@akrc/yaml';
import { FileSystem, Path } from '@effect/platform';
import defu from 'defu';
import { Effect } from 'effect';
import { YamlParse } from './utils';

// TODO: full typing for pnpm-workspace.yaml
interface PnpmWorkspaceYaml {
    packages: string[];
}

export function ReadPnpmWorkspaceYaml(dir: string) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        const content = yield* fs.readFileString(
            path.join(dir, 'pnpm-workspace.yaml'),
        );
        const yaml = yield* YamlParse<PnpmWorkspaceYaml>(content);
        return yaml;
    });
}

export function WritePnpmWorkspaceYaml(dir: string, input: PnpmWorkspaceYaml) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        yield* fs.writeFileString(
            path.join(dir, 'pnpm-workspace.yaml'),
            yaml.dump(input),
        );
    });
}

export function UpdatePnpmWorkspaceYaml(dir: string, input: PnpmWorkspaceYaml) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        const content = yield* fs.readFileString(
            path.join(dir, 'pnpm-workspace.yaml'),
        );
        const parsed = yield* YamlParse<PnpmWorkspaceYaml>(content);
        const merged = defu(parsed, input);
        yield* WritePnpmWorkspaceYaml(dir, merged);
    });
}
