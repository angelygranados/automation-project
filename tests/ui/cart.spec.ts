import { expect, test } from '@fixtures';
import * as allure from 'allure-js-commons';
import { products } from '@data/products';

test.describe('Cart', { tag: '@ui' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await allure.epic('Web UI');
    await allure.feature('Shopping cart');
    await inventoryPage.goto();
  });

  test(
    'adding items updates the badge and the cart',
    { tag: '@smoke' },
    async ({ inventoryPage, cartPage }) => {
      const selected = [products.backpack, products.bikeLight, products.onesie];

      for (const product of selected) await inventoryPage.addToCart(product.name);
      await expect(inventoryPage.cartBadge).toHaveText(String(selected.length));

      await inventoryPage.openCart();
      await expect(cartPage.itemNames).toHaveText(selected.map((p) => p.name));
    },
  );

  test('removing an item updates the badge', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.boltTShirt.name);
    await inventoryPage.removeFromCart(products.backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
