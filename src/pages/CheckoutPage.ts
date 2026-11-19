import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { Customer } from '@data/customer.factory';

/** Covers the three checkout steps: information, overview and complete. */
export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(customer: Partial<Customer>): Promise<void> {
    if (customer.firstName) await this.firstName.fill(customer.firstName);
    if (customer.lastName) await this.lastName.fill(customer.lastName);
    if (customer.postalCode) await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /** Parses "$12.34" style labels into numbers. */
  static money(label: string): number {
    const match = label.match(/\$(\d+(?:\.\d+)?)/);
    if (!match) throw new Error(`No amount found in "${label}"`);
    return Number(match[1]);
  }
}
