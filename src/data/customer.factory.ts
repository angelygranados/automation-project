import { faker } from '@faker-js/faker';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Generates a random, valid customer; override any field for a specific case. */
export const buildCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  postalCode: faker.location.zipCode(),
  ...overrides,
});
