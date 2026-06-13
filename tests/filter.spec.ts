import { test, expect } from '../src/fixtures/api-fixtures';
import { buildBookingRequest } from '../src/05_utils/data-factory';
import { BookingId } from '../src/02_types/booking.types';

test.describe('Booking Filters', () => {
  test('verify filter by firstname returns matching bookings', async ({ bookingService, bookingClient }) => {
    const payload = buildBookingRequest({ firstname: 'FilterTestFirst' });
    await bookingService.createAndVerify(payload);

    const response = await bookingClient.getBookingsByFilter({ firstname: 'FilterTestFirst' });
    expect(response.status()).toBe(200);
    const body = await response.json() as BookingId[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('verify filter by lastname returns matching bookings', async ({ bookingService, bookingClient }) => {
    const payload = buildBookingRequest({ lastname: 'FilterTestLast' });
    await bookingService.createAndVerify(payload);

    const response = await bookingClient.getBookingsByFilter({ lastname: 'FilterTestLast' });
    expect(response.status()).toBe(200);
    const body = await response.json() as BookingId[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('verify filter by checkin date returns 200', async ({ bookingClient }) => {
    const response = await bookingClient.getBookingsByFilter({ checkin: '2024-01-01' });
    expect(response.status()).toBe(200);
  });

  test('verify filter by non-existent name returns empty list or 404', async ({ bookingClient }) => {
    const response = await bookingClient.getBookingsByFilter({ firstname: 'ZZZNONEXISTENT999XYZ' });
    const status = response.status();
    expect([200, 404]).toContain(status);
    if (status === 200) {
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    }
  });
});
