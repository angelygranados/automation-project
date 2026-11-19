import { expect, test } from '@fixtures';
import * as allure from 'allure-js-commons';
import { env } from '@config/env';
import { BaseClient } from '@api/clients/BaseClient';
import { AuthResponseSchema } from '@api/schemas/booking.schema';

test.describe('Auth API', { tag: '@api' }, () => {
  test.beforeEach(async () => {
    await allure.epic('REST API');
    await allure.feature('Authentication');
  });

  test('returns a token for valid credentials', { tag: '@smoke' }, async ({ authClient }) => {
    const response = await authClient.createToken(env.api.username, env.api.password);

    expect(response.status()).toBe(200);
    const body = await BaseClient.parse(response, AuthResponseSchema);
    expect(body).toHaveProperty('token');
  });

  const badCredentials = [
    { case: 'wrong password', username: env.api.username, password: 'wrong' },
    { case: 'unknown user', username: 'nobody', password: env.api.password },
    { case: 'empty credentials', username: '', password: '' },
  ];

  for (const { case: name, username, password } of badCredentials) {
    test(`rejects ${name}`, { tag: '@regression' }, async ({ authClient }) => {
      const response = await authClient.createToken(username, password);

      // Restful-Booker answers 200 with a "reason" instead of 401: assert on the contract it exposes.
      const body = await BaseClient.parse(response, AuthResponseSchema);
      expect(body).toEqual({ reason: 'Bad credentials' });
    });
  }
});
