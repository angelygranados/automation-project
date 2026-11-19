import type { Locator, Page } from '@playwright/test';

/** Shared behaviour for every page: navigation and the global header. */
export abstract class BasePage {
  protected abstract readonly path: string;

  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly title: Locator;

  constructor(protected readonly page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.title = page.getByTestId('title');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
