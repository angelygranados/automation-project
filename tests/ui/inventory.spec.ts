import { expect, test } from '@fixtures';
import * as allure from 'allure-js-commons';
import type { InventoryPage, SortOption } from '@pages/InventoryPage';

type Reader = (page: InventoryPage) => Promise<(string | number)[]>;

const names: Reader = (p) => p.getNames();
const prices: Reader = (p) => p.getPrices();
const asc = (a: string | number, b: string | number) =>
  typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
const desc = (a: string | number, b: string | number) => asc(b, a);

const sortCases: { option: SortOption; label: string; read: Reader; compare: typeof asc }[] = [
  { option: 'az', label: 'name A to Z', read: names, compare: asc },
  { option: 'za', label: 'name Z to A', read: names, compare: desc },
  { option: 'lohi', label: 'price low to high', read: prices, compare: asc },
  { option: 'hilo', label: 'price high to low', read: prices, compare: desc },
];

test.describe('Inventory', { tag: '@ui' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await allure.epic('Web UI');
    await allure.feature('Product catalogue');
    await inventoryPage.goto();
  });

  for (const { option, label, read, compare } of sortCases) {
    test(`sorts products by ${label}`, { tag: '@regression' }, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      const actual = await read(inventoryPage);
      expect(actual).toEqual([...actual].sort(compare));
    });
  }
});
