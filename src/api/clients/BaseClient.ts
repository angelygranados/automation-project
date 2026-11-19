import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ZodType } from 'zod';

/** Thin wrapper over Playwright's APIRequestContext with schema-validated JSON parsing. */
export abstract class BaseClient {
  constructor(protected readonly request: APIRequestContext) {}

  /** Parses the body and throws a readable error if it breaks the contract. */
  static async parse<T>(response: APIResponse, schema: ZodType<T>): Promise<T> {
    const body: unknown = await response.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      throw new Error(
        `Response from ${response.url()} does not match schema:\n${result.error.message}\nBody: ${JSON.stringify(body)}`,
      );
    }
    return result.data;
  }
}
