import * as yaml from '@akrc/yaml';
import { FileSystem, Path } from '@effect/platform';
import defu from 'defu';
import { Effect } from 'effect';
import type { PnpmWorkspaceSpecification as Spec } from '../generated/pnpm-workspace-spec';
import { YamlParse } from './utils';

export function ReadPnpmWorkspaceYaml(dir: string) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        const content = yield* fs.readFileString(
            path.join(dir, 'pnpm-workspace.yaml'),
        );
        const yaml = yield* YamlParse<Spec>(content);
        return yaml;
    });
}

export function WritePnpmWorkspaceYaml(dir: string, input: Spec) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        yield* fs.writeFileString(
            path.join(dir, 'pnpm-workspace.yaml'),
            yaml.dump(input),
        );
    });
}

export function UpdatePnpmWorkspaceYaml(dir: string, input: Spec) {
    return Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        const content = yield* fs.readFileString(
            path.join(dir, 'pnpm-workspace.yaml'),
        );
        const parsed = yield* YamlParse<Spec>(content);
        const merged = defu(input, parsed);
        yield* WritePnpmWorkspaceYaml(dir, merged);
    });
}
