import { faker } from '@faker-js/faker';
import { BookingRequest } from '../02_types/booking.types';
import { AuthRequest } from '../02_types/auth.types';
import { futureDate } from './date-utils';
import { config } from '../01_config/config';

export function buildBookingRequest(overrides?: Partial<BookingRequest>): BookingRequest {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: futureDate(1),
      checkout: futureDate(5)
    },
    additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'None']),
    ...overrides
  };
}

export function buildAuthRequest(overrides?: Partial<AuthRequest>): AuthRequest {
  return {
    username: config.auth.username,
    password: config.auth.password,
    ...overrides
  };
}
