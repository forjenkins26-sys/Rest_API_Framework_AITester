# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Scope

This is a **Claude Code masterclass workspace**, not a single project. It holds several independent test-automation projects side by side, plus the original Java sandbox. The workspace root is **not** a git repository — treat each subproject as self-contained.

| Path | What it is | Build | Has own docs |
|------|-----------|-------|--------------|
| `myTest.java` / `myTest.class` | Original `Hello World` Java sandbox | `javac` / `java`, no build tool | — |
| `Playwright_8_Layer/` | Playwright TypeScript E2E framework (8-layer POM architecture) | npm + `@playwright/test` | `README.md`, `playwright-e2e.SKILL.md` |
| `SeleniumRepo/ATB14xSeleniumAdvanceFrameworks/` | Selenium 4 + TestNG + Maven UI framework (Java 17) | Maven | **own `CLAUDE.md`** + `README.md`, **own nested git repo** |
| `*.html` (random hex name) | Generated session-recap artifacts (show-me-html / recapme skills) | — | disposable, safe to delete |

When working inside a subproject, `cd` into it first — its commands, configs, and (for Selenium) its own `CLAUDE.md` apply. Don't run a subproject's tooling from the workspace root.

## Per-project entry points

### `myTest.java` (root)

```bash
javac myTest.java   # produces myTest.class
java myTest         # prints: Hello
rm -f *.class       # clean
```

Public class name must match the filename. Current class is `myTest` (lowercase-first deviates from Java PascalCase but is kept to match the filename — rename both together if changing). No test runner; verify by running and checking stdout.

### `Playwright_8_Layer/`

```bash
cd Playwright_8_Layer
npm install && npm run install:browsers   # first-time setup
npm test                  # all projects
npm run test:ui           # UI specs only
npm run test:api          # API specs only
npm run test:smoke        # --grep @smoke
npm test -- tests/ui/login.spec.ts        # single spec
npm run test:debug        # PWDEBUG inspector
npm run typecheck         # tsc --noEmit, no test run
npm run report            # open last HTML report
```

Architecture (detailed in `Playwright_8_Layer/README.md`): 8 numbered layers — Config → Utils → Data → API → Components → Pages(POM) → Services → Tests. `src/fixtures/test-fixtures.ts` is the glue: it dependency-injects every layer into specs, so tests pull page objects and services from the fixture, not by constructing them. UI targets saucedemo.com, API targets fakestoreapi.com (both public). `tests/auth.setup.ts` runs as a `setup` project that all browser projects depend on (storage-state login); the `api` project skips browsers and uses a separate baseURL.

### `SeleniumRepo/ATB14xSeleniumAdvanceFrameworks/`

This subproject has its **own `CLAUDE.md`** with full command and architecture detail — **read that file** before working there. Quickstart:

```bash
cd SeleniumRepo/ATB14xSeleniumAdvanceFrameworks
mvn clean test            # runs suite pinned in pom.xml (testng.suite.file)
mvn test -Dtest=ClassName # single class (bypasses suite XML)
```

Key gotcha (full detail in its CLAUDE.md): tests must launch from that project root — `PropertiesReader` resolves `data.properties` via `user.dir`, and surefire `-D` system properties do **not** override the file.

## Conventions

- Keep projects isolated. A change for one project's tooling/config should not touch another's, and nothing project-specific belongs at the workspace root.
- The nested git repo lives only under `SeleniumRepo/ATB14xSeleniumAdvanceFrameworks/`. Git operations there act on that repo, not the workspace.
- Generated `*.html` recap files are throwaway output — don't treat them as source.
