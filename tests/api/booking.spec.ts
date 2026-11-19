import { expect, test } from '@fixtures';
import * as allure from 'allure-js-commons';
import { BaseClient } from '@api/clients/BaseClient';
import {
  BookingIdListSchema,
  BookingSchema,
  CreatedBookingSchema,
} from '@api/schemas/booking.schema';
import { buildBooking } from '@data/booking.factory';

test.describe('Booking API', { tag: '@api' }, () => {
  test.beforeEach(async () => {
    await allure.epic('REST API');
    await allure.feature('Bookings');
  });

  test('lists booking ids', { tag: '@smoke' }, async ({ bookingClient }) => {
    const response = await bookingClient.list();

    expect(response.status()).toBe(200);
    const ids = await BaseClient.parse(response, BookingIdListSchema);
    expect(ids.length).toBeGreaterThan(0);
  });

  test(
    'creates a booking and reads it back',
    { tag: '@smoke' },
    async ({ authedBookingClient }) => {
      await allure.severity(allure.Severity.BLOCKER);
      const payload = buildBooking();

      const createResponse = await authedBookingClient.create(payload);
      expect(createResponse.status()).toBe(200);
      const created = await BaseClient.parse(createResponse, CreatedBookingSchema);
      expect(created.booking).toEqual(payload);

      const getResponse = await authedBookingClient.get(created.bookingid);
      expect(getResponse.status()).toBe(200);
      expect(await BaseClient.parse(getResponse, BookingSchema)).toEqual(payload);

      await authedBookingClient.delete(created.bookingid);
    },
  );

  test(
    'filters bookings by guest name',
    { tag: '@regression' },
    async ({ bookingClient, createdBooking }) => {
      const { firstname, lastname } = createdBooking.booking;

      const response = await bookingClient.list({ firstname, lastname });

      const ids = await BaseClient.parse(response, BookingIdListSchema);
      expect(ids.map((b) => b.bookingid)).toContain(createdBooking.bookingid);
    },
  );

  test(
    'fully updates a booking with PUT',
    { tag: '@regression' },
    async ({ authedBookingClient, createdBooking }) => {
      const replacement = buildBooking();

      const response = await authedBookingClient.update(createdBooking.bookingid, replacement);

      expect(response.status()).toBe(200);
      expect(await BaseClient.parse(response, BookingSchema)).toEqual(replacement);
    },
  );

  test(
    'partially updates a booking with PATCH',
    { tag: '@regression' },
    async ({ authedBookingClient, createdBooking }) => {
      const patch = { firstname: 'Patched', totalprice: 999 };

      const response = await authedBookingClient.partialUpdate(createdBooking.bookingid, patch);

      expect(response.status()).toBe(200);
      expect(await BaseClient.parse(response, BookingSchema)).toEqual({
        ...createdBooking.booking,
        ...patch,
      });
    },
  );

  test('deletes a booking', { tag: '@regression' }, async ({ authedBookingClient }) => {
    const created = await BaseClient.parse(
      await authedBookingClient.create(buildBooking()),
      CreatedBookingSchema,
    );

    const deleteResponse = await authedBookingClient.delete(created.bookingid);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await authedBookingClient.get(created.bookingid);
    expect(getResponse.status()).toBe(404);
  });

  test.describe('authorization', () => {
    test(
      'rejects PUT without a token',
      { tag: '@security' },
      async ({ bookingClient, createdBooking }) => {
        const response = await bookingClient.update(createdBooking.bookingid, buildBooking());
        expect(response.status()).toBe(403);
      },
    );

    test(
      'rejects DELETE without a token',
      { tag: '@security' },
      async ({ bookingClient, createdBooking }) => {
        const response = await bookingClient.delete(createdBooking.bookingid);
        expect(response.status()).toBe(403);
      },
    );

    test(
      'rejects PATCH with an invalid token',
      { tag: '@security' },
      async ({ request, createdBooking }) => {
        const response = await request.patch(`/booking/${createdBooking.bookingid}`, {
          data: { firstname: 'Hacker' },
          headers: { Cookie: 'token=not-a-real-token' },
        });
        expect(response.status()).toBe(403);
      },
    );
  });

  test(
    'returns 404 for a booking that does not exist',
    { tag: '@regression' },
    async ({ bookingClient }) => {
      const response = await bookingClient.get(999_999_999);
      expect(response.status()).toBe(404);
    },
  );
});
