import { test, expect } from '../../src/fixtures/test-fixtures';
import { CheckoutService } from '../../src/services/checkout.service';
import { sampleCart, products } from '../../src/data/products';
import { defaultCheckoutInfo } from '../../src/data/users';

test.describe('Checkout @critical', () => {
  test('end-to-end purchase of two products @smoke', async ({ authedPage }) => {
    const service = new CheckoutService(authedPage);
    const summary = await service.purchase(sampleCart);
    expect(summary.total).toBeGreaterThan(0);
  });

  test('requires postal code', async ({ authedPage, inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.expectLoaded();
    await inventoryPage.addProduct(products.onesie.name);
    await inventoryPage.header.openCart();
    await cartPage.expectLoaded();
    await cartPage.startCheckout();
    await checkoutPage.expectStepOne();
    await checkoutPage.firstNameInput.fill(defaultCheckoutInfo.firstName);
    await checkoutPage.lastNameInput.fill(defaultCheckoutInfo.lastName);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText(/Postal Code is required/i);
  });

  test('cancel returns to inventory', async ({ authedPage, inventoryPage, cartPage, checkoutPage, page }) => {
    await inventoryPage.expectLoaded();
    await inventoryPage.addProduct(products.bikeLight.name);
    await inventoryPage.header.openCart();
    await cartPage.startCheckout();
    await checkoutPage.expectStepOne();
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html$/);
  });
});
