import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { users } from '@data/users';
import { STORAGE_STATE } from '@config/paths';

/** Logs in once and stores the session so UI tests start already authenticated. */
setup('authenticate as standard user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
