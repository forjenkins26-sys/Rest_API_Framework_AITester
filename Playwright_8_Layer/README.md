# Playwright 8-Layer Architecture

Production-grade Playwright test automation framework organized in 8 layers. Demonstrates Page Object Model, custom fixtures, web-first assertions, role-based selectors, API testing, and CI integration.

**UI target:** [saucedemo.com](https://www.saucedemo.com) — public demo storefront.
**API target:** [fakestoreapi.com](https://fakestoreapi.com) — public REST API.

---

## The 8 Layers

```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 8  Tests             tests/ui, tests/api, *.spec.ts        │
│  Layer 7  Services          src/services/  business workflows     │
│  Layer 6  Pages (POM)       src/pages/     page objects + base    │
│  Layer 5  Components        src/components/ reusable UI parts     │
│  Layer 4  API               src/api/       APIRequestContext      │
│  Layer 3  Data              src/data/      test data, users       │
│  Layer 2  Utils             src/utils/     logger, helpers, const │
│  Layer 1  Config            src/config/    env, playwright.config │
└──────────────────────────────────────────────────────────────────┘
        Fixtures glue (src/fixtures/test-fixtures.ts) wires layers
```

| # | Layer | Responsibility |
|---|-------|---------------|
| 1 | **Config** | env loader, secrets, baseURL, projects, reporters |
| 2 | **Utils** | logger, constants, pure helpers (no Playwright deps) |
| 3 | **Data** | typed test data: users, products, checkout info |
| 4 | **API** | `APIRequestContext` wrapper + typed endpoint clients |
| 5 | **Components** | reusable UI fragments (Header, Footer) shared across pages |
| 6 | **Pages** | POM — selectors + page-scoped actions. `BasePage` + concrete pages |
| 7 | **Services** | business workflows orchestrating multiple pages (login, checkout) |
| 8 | **Tests** | specs — thin, intent-revealing, one feature per file |

Fixtures (`src/fixtures/test-fixtures.ts`) provide dependency-injection of all layers into tests.

---

## Project Layout

```
Playwright_8_Layer/
├── playwright.config.ts          # Layer 1 — Playwright config
├── tsconfig.json
├── package.json
├── .env.example
├── src/
│   ├── config/env.ts             # Layer 1 — env loader
│   ├── utils/                    # Layer 2
│   │   ├── logger.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── data/                     # Layer 3
│   │   ├── users.ts
│   │   └── products.ts
│   ├── api/                      # Layer 4
│   │   ├── api-client.ts
│   │   └── products.api.ts
│   ├── components/               # Layer 5
│   │   ├── header.component.ts
│   │   └── footer.component.ts
│   ├── pages/                    # Layer 6
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   ├── inventory.page.ts
│   │   ├── cart.page.ts
│   │   └── checkout.page.ts
│   ├── services/                 # Layer 7
│   │   ├── auth.service.ts
│   │   └── checkout.service.ts
│   └── fixtures/
│       └── test-fixtures.ts      # glue layer
├── tests/                        # Layer 8
│   ├── auth.setup.ts             # storage state setup
│   ├── ui/
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   └── checkout.spec.ts
│   └── api/
│       └── products.api.spec.ts
└── .github/workflows/playwright.yml
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npm run install:browsers

# 3. Create local env file (optional — defaults work)
cp .env.example .env

# 4. Run all tests
npm test

# 5. View HTML report
npm run report
```

### Common commands

| Command | What it does |
|---------|--------------|
| `npm test` | Run every project (chromium, firefox, webkit, mobile, api) |
| `npm run test:ui` | UI specs only |
| `npm run test:api` | API specs only |
| `npm run test:smoke` | Specs tagged `@smoke` |
| `npm run test:critical` | Specs tagged `@critical` |
| `npm run test:headed` | Headed browser mode |
| `npm run test:debug` | Playwright inspector |
| `npm run test:uimode` | Playwright UI mode (recommended for dev) |
| `npm run test:chromium` | Chromium project only |
| `npm run codegen` | Record selectors against saucedemo |
| `npm run typecheck` | TypeScript validation, no emit |
| `npm run report` | Open latest HTML report |

---

## Design Principles

1. **User-centric tests** — flows mirror real user journeys.
2. **Role-based selectors** — prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `data-test` over CSS/XPath.
3. **Web-first assertions** — `await expect(locator).toBeVisible()`, auto-retry until timeout.
4. **No `waitForTimeout`** — auto-waiting only. Hard sleeps are flaky.
5. **Test isolation** — every spec independent. State setup via fixtures, not previous tests.
6. **Storage state reuse** — `auth.setup.ts` logs in once, all UI specs reuse the session via `authedPage` fixture.
7. **Tagging** — `@smoke`, `@critical`, `@regression`, `@api` for selective runs.
8. **Path aliases** — `@pages/*`, `@services/*`, etc. via `tsconfig.json` paths.

---

## How a Test Flows Through the Layers

```ts
// tests/ui/checkout.spec.ts (Layer 8)
test('end-to-end purchase', async ({ authedPage }) => {  // fixture: storage state from Layer 8 setup
  const service = new CheckoutService(authedPage);        // Layer 7
  await service.purchase(sampleCart);                     // uses Layers 6 → 5 → 3 → 2
});
```

Inside `CheckoutService.purchase`:
- Drives `InventoryPage`, `CartPage`, `CheckoutPage` (Layer 6)
- Pages use `HeaderComponent` (Layer 5)
- Reads `products`, `defaultCheckoutInfo` (Layer 3)
- Computes totals via `helpers.sum`, `round2` (Layer 2)
- Logs through `logger` (Layer 2 → Layer 1 env)

---

## CI

`.github/workflows/playwright.yml` runs a matrix of `chromium | firefox | webkit | api` on every push and PR. Uploads HTML reports and traces as artifacts. Retries enabled in CI only.

---

## Extending

- **New page** → add `src/pages/<name>.page.ts` extending `BasePage`. Wire into `test-fixtures.ts` if a test needs DI.
- **New workflow** → add `src/services/<name>.service.ts` orchestrating pages.
- **New env** → set `ENV=staging` and override `BASE_URL`, `API_BASE_URL` in `.env`.
- **New API** → add `src/api/<resource>.api.ts` consuming `ApiClient`.

---

## References

- Playwright docs — https://playwright.dev
- Locator priority — https://playwright.dev/docs/locators
- Web-first assertions — https://playwright.dev/docs/test-assertions
- Auth state reuse — https://playwright.dev/docs/auth
