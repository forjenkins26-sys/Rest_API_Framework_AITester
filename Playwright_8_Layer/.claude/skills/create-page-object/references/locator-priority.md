# Locator Priority Cheat Sheet

Use the highest-priority strategy that uniquely identifies the element. Drop down the list only when forced — and document why if you fall back to CSS.

| Priority | Strategy | When to use | Example |
|---------:|----------|-------------|---------|
| 1 | `getByRole(role, { name })` | Any interactive element with a recognisable ARIA role | `page.getByRole('button', { name: 'Sign in' })` |
| 2 | `getByLabel(text)` | Form inputs with an associated `<label>` | `page.getByLabel('Email address')` |
| 3 | `getByPlaceholder(text)` | Inputs that only have a placeholder | `page.getByPlaceholder('Search products')` |
| 4 | `getByText(text)` | Non-interactive visible text | `page.getByText('Order confirmed')` |
| 5 | `getByTestId(id)` / `[data-test="id"]` | Stable test hooks the app team has added (saucedemo uses this heavily) | `page.locator('[data-test="checkout"]')` |
| 6 | CSS / XPath | Legacy markup with no semantics; document the reason inline | `page.locator('.legacy-widget >> nth=0')` |

## Saucedemo-specific notes

Saucedemo exposes `data-test` attributes on most actionable elements (`add-to-cart-...`, `inventory-item-name`, `checkout`, `error`, etc.). Prefer these over CSS classes because the team intentionally maintains them as test contracts.

## Negative patterns

| Anti-pattern | Why it breaks | Replace with |
|--------------|---------------|--------------|
| `page.locator('div.container > ul > li:nth-child(3) > span')` | Snaps on any DOM tweak | `getByRole('listitem').filter({ hasText: '...' }).getByText('...')` |
| `page.locator('xpath=//button[1]')` | Position-fragile | `getByRole('button', { name: 'Save' })` |
| `page.locator('#email')` | ID may not be unique or stable | `getByLabel('Email')` |
| `page.locator('.btn-primary').nth(2)` | Visual class doubles as semantic | `getByTestId('submit-order')` or `getByRole('button', { name: 'Place order' })` |

## When to filter

Use `.filter()` when a role/text alone is ambiguous:

```ts
page.getByRole('listitem').filter({ hasText: 'Sauce Labs Backpack' })
  .getByRole('button', { name: 'Add to cart' });
```

This stays role-driven instead of dropping to CSS.
