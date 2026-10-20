---
name: unit-test-generator
description: Generates unit tests for a JavaScript or TypeScript function, React/React Native component, hook, or async/API utility — covering normal, edge, error and async cases — using the target project's existing test framework and conventions. Use when asked to write, add or generate unit tests, a test file, or test coverage for a given file, function or component, or to review an existing test file for gaps.
allowed-tools: Read Grep Glob Write Edit Bash(npm test *) Bash(npm run *) Bash(yarn test *) Bash(pnpm test *) Bash(npx jest *) Bash(npx vitest *) Bash(node --test *)
---

# Unit Test Generator

Writes reliable, maintainable unit tests for existing code — matching whatever test framework and conventions the target project already uses.

## Workflow

1. **Identify the target.** If the developer did not name a file, function or component, ask which one rather than guessing.
2. **Inspect the project.** Read `package.json`, test config files, and the project's existing test files to detect the framework and conventions — see `reference/testing-conventions.md`.
3. **Analyze the source.** Read the target file and its direct dependencies: function signatures, component props/state/hooks, API calls, error handling, branches.
4. **Build a scenario checklist** from `reference/testing-conventions.md` — drop scenarios that don't apply to this code; don't pad the list.
5. **Generate the test file**, following the project's existing naming/location convention (colocated `*.test.ts(x)` or a `__tests__/` folder — match what's already there). Mock external calls and dependencies; avoid snapshot tests and over-mocking.
6. **Self-review** the generated tests: do assertions check observable behavior, are they deterministic, is anything redundant?
7. **Run the tests** with the project's existing test command when execution is permitted. Fix failures in the generated tests (not the production code) and re-run.
8. **Report** using the format below.

## Report format

1. Source files analyzed
2. Test files created or updated
3. Scenarios covered
4. Testing framework used (and how it was detected)
5. Commands executed and their actual output — pass/fail counts, not a paraphrase
6. Known gaps — scenarios deliberately left uncovered, and why

## Examples

- "Generate unit tests for `src/utils/calculateTotal.ts`"
- "Write tests for `OrderList`, including the empty and loading states"
- "Add tests for `fetchInvoice`, covering the success and failure responses"
- "Generate a regression test for the null-customer bug we fixed in #482"
- "Review `payment.test.ts` and tell me what scenarios are missing"

## Rules

- Never claim a test passed unless a command you ran actually confirmed it. If execution isn't possible, say so and give the exact command to run manually.
- Don't introduce a new test framework or dependency unless the developer asks for one.
- Don't modify production code unless the developer asks for a fix.
- Don't overwrite an existing test file without a clear reason — prefer adding to it.
- Prefer testing observable behavior over implementation details.
- Fewer, meaningful tests beat a large count of redundant ones.
