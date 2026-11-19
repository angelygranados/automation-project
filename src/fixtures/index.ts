import { mergeTests } from '@playwright/test';
import { uiTest } from './ui.fixture';
import { apiTest } from './api.fixture';

/** Single entry point: every spec imports `test` and `expect` from here. */
export const test = mergeTests(uiTest, apiTest);
export { expect } from '@playwright/test';
