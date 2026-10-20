# Framework detection and test scenarios

## Detect the framework — in this order

1. `package.json` `devDependencies`/`dependencies`: `vitest`, `jest`, `@testing-library/react`, `@testing-library/react-native`, `mocha` + `chai`, `supertest`, `enzyme`.
2. Config files: `vitest.config.*`, `jest.config.*` / `jest` key in `package.json`, `.mocharc*`.
3. An existing `*.test.*` / `*.spec.*` file — copy its import style, matcher library and mocking pattern exactly.
4. Nothing found: fall back to Node's built-in `node:test` + `node:assert/strict` (zero dependencies) and say so in the report.

Never assume Jest by default — Vitest and the built-in runner are common in newer projects and have different globals and mocking APIs (`vi.mock` vs `jest.mock`).

## Naming and location

Match the project's existing convention. If none exists yet:
- Colocate as `<name>.test.ts(x)` next to the source file, unless the project already uses a `__tests__/` folder.
- One test file per source file.

## Scenario checklist

Use what applies; skip what doesn't.

**Pure functions / utilities**
- Typical/expected input
- Boundary values (0, empty string/array, max length, negative numbers)
- Null, undefined, and wrong-type input where the function doesn't already guard against it
- Thrown errors / rejected promises

**React / React Native components**
- Default render with required props
- Conditional rendering branches (loading / success / error / empty states)
- User interactions (click, change, submit) and their resulting state/prop changes
- Props edge cases: missing optional props, empty lists
- Hooks: effect cleanup, dependency-array changes, custom hook return values

**Async / API utilities**
- Successful response, mapped/transformed correctly
- Error response (4xx/5xx) and network failure, handled not thrown uncaught
- Timeout / retry behavior if the code implements it
- Loading state transitions (pending → fulfilled/rejected)

**Regression tests**
- Reproduce the exact reported input/state that caused the bug before asserting the fix

## Mocking guidance

- Mock network calls and external services (`msw`, `nock`, or the framework's own mock, matching what the project already uses) — never hit real network in a unit test.
- Mock at the boundary (the HTTP client or API module), not internals of the function under test.
- Avoid snapshot tests for anything with interactive or frequently-changing markup; prefer explicit assertions.
