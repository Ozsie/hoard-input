# AGENTS.md — @hoard-engine/input

`@hoard-engine/input` — a HOARD engine package for generic key bindings,
action dispatch, held-action state and touch gesture mechanics.

## What this package is

- A dependency-free leaf extracted from the games' input managers and
  two-finger touch-pan logic. It provides mechanics, not game actions,
  defaults or browser event wiring.
- Pluggable and interoperable, and as standalone as possible: adoptable
  and swappable without other HOARD packages, games or frameworks.
  Packages compose through data — minimal shapes, callbacks and plain
  values — never through shared state; a new dependency or sibling
  import is a design regression, not an optimization.

## Hard boundaries

- Only relative imports inside `src/`. No game or sibling code, content,
  framework, i18n, browser globals or runtime dependencies; enforced by
  the boundary test, sentinels and lint rule. Tests may import `vitest`
  and Node APIs.
- The public surface is exactly `src/index.ts`; every source export is
  re-exported there and checked by `src/publicSurface.test.ts`.
- Game knowledge arrives as data: action names, bindings, dispatch
  callbacks and DOM listeners belong to consumers. Drakriddarna's game
  rules live in `drakriddarna/RULES.md`; ask before changing package
  mechanics or consumer policies to resolve an apparent mismatch.

## Commands

From this package folder:

```bash
npm test          # vitest
npm run check     # tsc --noEmit
npm run lint      # eslint over src and vitest.config.ts
npm run prettier  # prettier --check (fix via prettier:format)
npm run build     # tsc declarations + esbuild ESM bundle to dist/
```

Run check, test and lint before considering work done.

## Conventions

- Prettier and strict TypeScript settings apply; avoid `any`, console
  calls and non-relative imports in package sources.
- Tests are colocated as `*.test.ts` next to the code they cover.
- `dist/` is generated build output: never edit it.
- `prepublishOnly` runs check + build + test. Bump the version first;
  do not add a license field unilaterally — that is the repo owner's
  decision.
