# Deno and Bun Support

This document describes the implementation of Deno and Bun support in fnpm.

## Overview

fnpm now supports Deno and Bun as package managers in addition to npm, yarn, and pnpm.

## Detection

- **Deno**: Detected by the presence of `deno.lock` or `deno.json` files
- **Bun**: Detected by the presence of `bun.lockb` file

## Command Mapping

### Install
- **Deno**: `deno install`
- **Bun**: `bun install` (supports `--frozen-lockfile` for fixed installs)

### Add
- **Deno**: `deno install <packages>` (Deno uses install for adding packages)
- **Bun**: `bun add <packages>` (uses dedicated add command, supports dev/peer/optional flags)

### Remove
- **Deno**: `deno remove <packages>`
- **Bun**: `bun remove <packages>`

### DLX (Execute packages)
- **Deno**: `deno run -A <package>` (with all permissions)
- **Bun**: `bunx <package>` (bun's equivalent to npx)

### Init
- **Deno**: `deno init`
- **Bun**: `bun init` (supports `-y` flag)

### Other Commands
Run, exec, test, why, create, and update commands work with their standard syntax for both Deno and Bun.

## Monorepo Support

As per the requirement, both Deno and Bun are treated similarly to npm/yarn for monorepo operations:
- They use the base monorepo-tools detection logic
- They are mapped to npm-like behavior for workspace operations
- The `toBasePM()` helper function converts `deno` and `bun` to `npm` when needed for compatibility

## Implementation Details

### Type Extensions

The `PM` type is extended in `packages/fnpm-utils-node/src/types.ts`:

```typescript
export type PM = BasePM | 'deno' | 'bun';
```

### Detection Logic

Extended detection is implemented in `packages/fnpm-utils-node/src/mt.ts`:

```typescript
export function DetectPMByLock(searchDir: string) {
    // Check for deno.lock or deno.json
    if (existsSync(join(searchDir, 'deno.lock')) || 
        existsSync(join(searchDir, 'deno.json'))) {
        return 'deno';
    }
    
    // Check for bun.lockb
    if (existsSync(join(searchDir, 'bun.lockb'))) {
        return 'bun';
    }
    
    // Fall back to base detection (npm, yarn, pnpm)
    return baseDetectPMByLock(searchDir).unwrap();
}
```

### Command Generation

All command builders in `packages/pm-combo/src/commands/` have been updated to support deno and bun cases.

## Testing

Added comprehensive tests for deno and bun commands:
- Install command tests (3 tests)
- DLX command tests (2 tests)
- Init command tests (3 tests)
- **Total: 8 new tests**

All 246 tests pass, including the new deno/bun tests.

## Usage

### CLI

The fnpm CLI automatically detects and uses the appropriate package manager:

```bash
# In a directory with bun.lockb
fnpm install  # Uses bun install

# In a directory with deno.lock
fnpm add express  # Uses deno install express
```

### Web UI

The fnpm.dev web UI also supports deno and bun:
- Detects the project's package manager
- Uses appropriate commands for operations
- All UI features work with deno and bun projects

## Limitations

- Deno's module system is different from npm, so some npm-specific operations may not work perfectly
- Config commands for deno and bun use npm-like syntax (may need adjustment based on actual deno/bun config syntax)
