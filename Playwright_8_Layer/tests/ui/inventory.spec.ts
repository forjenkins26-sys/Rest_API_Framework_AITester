import { test, expect } from '../../src/fixtures/test-fixtures';
import { InventoryPage } from '../../src/pages/inventory.page';
import { products } from '../../src/data/products';

test.describe('Inventory @regression', () => {
  test('lists six products @smoke', async ({ authedPage }) => {
    const inventory = new InventoryPage(authedPage);
    await inventory.expectLoaded();
    expect(await inventory.itemCount()).toBe(6);
  });

  test('sort by price ascending', async ({ authedPage }) => {
    const inventory = new InventoryPage(authedPage);
    await inventory.expectLoaded();
    await inventory.sortBy('priceAsc');
    const prices = await inventory.listedPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sort by name descending', async ({ authedPage }) => {
    const inventory = new InventoryPage(authedPage);
    await inventory.expectLoaded();
    await inventory.sortBy('nameDesc');
    const names = await inventory.listedNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('add and remove product updates badge', async ({ authedPage }) => {
    const inventory = new InventoryPage(authedPage);
    await inventory.expectLoaded();
    await inventory.addProduct(products.backpack.name);
    await inventory.header.expectCartCount(1);
    await inventory.removeProduct(products.backpack.name);
    await inventory.header.expectCartCount(0);
  });
});
