import { test as base } from '@playwright/test';
import { env } from '@config/env';
import { AuthClient } from '@api/clients/AuthClient';
import { BookingClient } from '@api/clients/BookingClient';
import { BaseClient } from '@api/clients/BaseClient';
import { CreatedBookingSchema, type CreatedBooking } from '@api/schemas/booking.schema';
import { buildBooking } from '@data/booking.factory';

export interface ApiFixtures {
  authClient: AuthClient;
  /** Unauthenticated client. */
  bookingClient: BookingClient;
  /** Client carrying a valid token for write operations. */
  authedBookingClient: BookingClient;
  /** A fresh booking created before the test and deleted after it. */
  createdBooking: CreatedBooking;
}

interface ApiWorkerFixtures {
  /** One token per worker: avoids hammering /auth on every test. */
  authToken: string;
}

export const apiTest = base.extend<ApiFixtures, ApiWorkerFixtures>({
  authToken: [
    async ({ playwright }, use) => {
      const ctx = await playwright.request.newContext({ baseURL: env.api.baseUrl });
      const token = await new AuthClient(ctx).getToken(env.api.username, env.api.password);
      await use(token);
      await ctx.dispose();
    },
    { scope: 'worker' },
  ],
  authClient: async ({ request }, use) => use(new AuthClient(request)),
  bookingClient: async ({ request }, use) => use(new BookingClient(request)),
  authedBookingClient: async ({ request, authToken }, use) =>
    use(new BookingClient(request).withToken(authToken)),
  createdBooking: async ({ authedBookingClient }, use) => {
    const response = await authedBookingClient.create(buildBooking());
    const created = await BaseClient.parse(response, CreatedBookingSchema);
    await use(created);
    // Teardown: best-effort cleanup so the shared public API is not polluted.
    await authedBookingClient.delete(created.bookingid);
  },
});
