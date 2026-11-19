import { faker } from '@faker-js/faker';
import type { Booking } from '@api/schemas/booking.schema';

const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

/** Generates a random, valid booking payload for Restful-Booker. */
export const buildBooking = (overrides: Partial<Booking> = {}): Booking => {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 10, refDate: checkin });
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 2000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: { checkin: isoDate(checkin), checkout: isoDate(checkout) },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Late checkout', 'Parking']),
    ...overrides,
  };
};
