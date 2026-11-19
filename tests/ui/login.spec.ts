import { expect, test } from '@fixtures';
import * as allure from 'allure-js-commons';
import { invalidLogins, users } from '@data/users';

// Login tests must start without the shared session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', { tag: '@ui' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('Web UI');
    await allure.feature('Authentication');
    await loginPage.goto();
  });

  test(
    'standard user can log in',
    { tag: '@smoke' },
    async ({ loginPage, inventoryPage, page }) => {
      await allure.severity(allure.Severity.BLOCKER);
      await loginPage.login(users.standard.username, users.standard.password);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.items).toHaveCount(6);
    },
  );

  for (const { case: name, username, password, error } of invalidLogins) {
    test(`shows an error for ${name}`, { tag: '@regression' }, async ({ loginPage, page }) => {
      await allure.severity(allure.Severity.CRITICAL);
      await loginPage.login(username, password);

      await expect(loginPage.error).toHaveText(error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test(
    'protected pages redirect to login when signed out',
    { tag: '@regression' },
    async ({ page, loginPage }) => {
      await page.goto('/inventory.html');

      await expect(loginPage.error).toContainText(
        "You can only access '/inventory.html' when you are logged in",
      );
    },
  );
});
