# fnpm

Yet another package manager wrapper. Use the correct package manager.

## Installation

```bash
npm install -g @akrc/fnpm
```

## Usage

### CLI

```bash
fnpm --help
```

You can use most of the npm/yarn/pnpm commands with `fnpm`, and it will detect the package manager by lock file (even in monorepo). And the difference between these orginal package managers will be handled by `fnpm`.

### UI

The missing Web UI for package manager, with the following features:

1. monorepo graph
2. search and install
3. maybe more

```
fnpm ui
```
