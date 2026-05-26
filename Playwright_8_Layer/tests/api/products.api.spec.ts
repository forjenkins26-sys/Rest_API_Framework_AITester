import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Products API @api', () => {
  test('lists products @smoke', async ({ productsApi }) => {
    const items = await productsApi.list();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('price');
  });

  test('returns single product by id', async ({ productsApi }) => {
    const product = await productsApi.byId(1);
    expect(product.id).toBe(1);
    expect(typeof product.title).toBe('string');
    expect(product.price).toBeGreaterThan(0);
  });

  test('returns category list', async ({ productsApi }) => {
    const categories = await productsApi.categories();
    expect(categories.length).toBeGreaterThan(0);
    for (const c of categories) {
      expect(typeof c).toBe('string');
    }
  });

  test('filters by category', async ({ productsApi }) => {
    const categories = await productsApi.categories();
    const first = categories[0];
    const filtered = await productsApi.byCategory(first);
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of filtered) {
      expect(p.category).toBe(first);
    }
  });
});
