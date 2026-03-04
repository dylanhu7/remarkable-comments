# Remarkable Comments

A minimal VS Code extension that:

- Renders JSDoc and block comment content as Markdown in hover for JS/TS files.
- Detects fenced Mermaid blocks inside those comments.
- Adds an **Open rendered preview** action in hover for Mermaid blocks.

## Supported languages

- JavaScript (`javascript`)
- JavaScript React (`javascriptreact`)
- TypeScript (`typescript`)
- TypeScript React (`typescriptreact`)

## Example doc comment

```ts
/**
 * ## Entity Sync Flow
 *
 * This description uses markdown, lists, and code.
 *
 * ```mermaid
 * sequenceDiagram
 *   participant C as Client
 *   participant S as Server
 *   C->>S: submit(delta)
 *   S-->>C: accepted(revision)
 * ```
 */
```

Hover anywhere inside the JSDoc or block comment to see markdown formatting.
If Mermaid is present, click the hover action link to open a rendered diagram panel.

## Settings

- `remarkableComments.enableHover`
- `remarkableComments.enableMermaidLink`
- `remarkableComments.maxCommentLines`

## Development

```bash
pnpm install
pnpm build
```

Run in Extension Development Host:

1. Open this folder in VS Code.
2. Press `F5`.

## GitHub Release Flow

This repo is configured so pushing a tag `v*` creates a GitHub Release with a `.vsix` artifact.

1. Bump `version` in `package.json`.
2. Commit and push `main`.
3. Create/push a tag matching the version, e.g. `v0.0.2`.
4. GitHub Actions workflow `.github/workflows/release.yml` will:
   - install deps
   - run lint/typecheck/build (`pnpm run ci`)
   - package VSIX (`pnpm package`)
   - create the release and upload `*.vsix`

## CI

- `.github/workflows/ci.yml` runs on pushes to `main` and pull requests.
- It installs dependencies and runs `pnpm run ci`.

## Local Package

```bash
pnpm package
```

This produces a local `.vsix` file you can install via VS Code's "Install from VSIX..." command.
