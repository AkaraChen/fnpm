# Repository Guidelines

This is a pnpm + Turbo monorepo. Packages live under `packages/*` and share configs via the `configs` package.

## Project Structure & Module Organization

- `packages/fnpm`: CLI entry (`fnpm`, `fnpx`) and commands under `src/commands/*`.
- `packages/fnpm-ui`: Web UI (Remix/Vite). Routes in `app/routes/*`.
- `packages/fnpm-parse`, `fnpm-context`, `fnpm-toolkit`, `pm-combo`, `fnpm-doctor`: core libraries and utilities.
- `packages/configs`: shared ESLint and Vitest configs.
- `packages/agent`: Mastra-based agent examples.
- Tests sit next to source (`src/**/*.test.ts`, `src/**/*.spec.ts`) or in `packages/*/tests`.

## Build, Test, and Development Commands

- `pnpm i`: install workspace deps.
- `pnpm dev`: run all package dev tasks via Turbo.
- `pnpm build`: build all packages (tsdown/Vite as configured).
- `pnpm test`: run Vitest across the workspace.
- `pnpm lint` / `pnpm lint:fix`: ESLint via shared configs.
- `pnpm start`: run the CLI (`packages/fnpm/dist/fnpm.js`).
- Per‑package: `pnpm -F @akrc/fnpm dev`, `pnpm -F fnpm-ui dev`.

## Coding Style & Naming Conventions

- Language: TypeScript, ESM.
- Formatting: Prettier (single quotes, 4‑space indent, trailing comma `es5`).
- Linting: ESLint presets from `configs/eslint-*` (run `pnpm lint`).
- Naming: kebab‑case file names; `PascalCase` types/classes; `camelCase` functions/variables.

## Testing Guidelines

- Framework: Vitest with shared config (`configs/vitest`).
- Location: `src/**/*.test.ts` or `src/**/*.spec.ts`; integration tests may live in `packages/*/tests`.
- Run: `pnpm test` or `pnpm -F <pkg> test`.
- Aim to cover CLI paths, parsers, and critical utilities; mock filesystem/process where appropriate.

## Commit & Pull Request Guidelines

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `build:`, `ci:` with optional scope, e.g. `feat(fnpm): add use command`.
- PRs: concise description, linked issues, and screenshots/video for UI changes. Keep diffs focused; update docs when commands or flags change.
- CI enforces lint/format; run `pnpm check` locally before pushing.

## Security & Configuration Tips

- Use `pnpm@10` (pinned in `packageManager`).
- Do not commit secrets; respect overrides in `pnpm.overrides` and patches in `patches/`.
- Pre‑commit hooks (Husky + nano‑staged) auto‑lint/format staged files.
