import { expect, test } from '@fixtures';
import * as allure from 'allure-js-commons';
import { CheckoutPage } from '@pages/CheckoutPage';
import { buildCustomer } from '@data/customer.factory';
import { products, TAX_RATE, type Product } from '@data/products';

const round = (n: number) => Math.round(n * 100) / 100;

test.describe('Checkout', { tag: '@ui' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await allure.epic('Web UI');
    await allure.feature('Checkout');
    await inventoryPage.goto();
  });

  const baskets: { name: string; items: Product[] }[] = [
    { name: 'single item', items: [products.backpack] },
    { name: 'multiple items', items: [products.bikeLight, products.fleeceJacket, products.onesie] },
  ];

  for (const basket of baskets) {
    test(
      `completes an order with ${basket.name} and correct totals`,
      { tag: '@smoke' },
      async ({ inventoryPage, cartPage, checkoutPage }) => {
        await allure.severity(allure.Severity.BLOCKER);

        await test.step('add products to the cart', async () => {
          for (const item of basket.items) await inventoryPage.addToCart(item.name);
          await inventoryPage.openCart();
          await cartPage.checkout();
        });

        await test.step('enter customer information', async () => {
          await checkoutPage.fillInformation(buildCustomer());
        });

        await test.step('verify subtotal, tax and total', async () => {
          const expectedSubtotal = round(basket.items.reduce((sum, p) => sum + p.price, 0));
          const subtotal = CheckoutPage.money(await checkoutPage.subtotal.innerText());
          const tax = CheckoutPage.money(await checkoutPage.tax.innerText());
          const total = CheckoutPage.money(await checkoutPage.total.innerText());

          expect(subtotal).toBe(expectedSubtotal);
          expect(tax).toBeCloseTo(expectedSubtotal * TAX_RATE, 2);
          expect(total).toBe(round(subtotal + tax));
        });

        await test.step('finish the order', async () => {
          await checkoutPage.finish();
          await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
        });
      },
    );
  }

  const missingFields = [
    {
      field: 'first name',
      customer: buildCustomer({ firstName: '' }),
      error: 'Error: First Name is required',
    },
    {
      field: 'last name',
      customer: buildCustomer({ lastName: '' }),
      error: 'Error: Last Name is required',
    },
    {
      field: 'postal code',
      customer: buildCustomer({ postalCode: '' }),
      error: 'Error: Postal Code is required',
    },
  ];

  for (const { field, customer, error } of missingFields) {
    test(
      `requires ${field}`,
      { tag: '@regression' },
      async ({ inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addToCart(products.backpack.name);
        await inventoryPage.openCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation(customer);

        await expect(checkoutPage.error).toHaveText(error);
      },
    );
  }
});
