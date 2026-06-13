import { test, expect } from '../src/fixtures/api-fixtures';
import { buildBookingRequest } from '../src/05_utils/data-factory';
import { BookingRequest } from '../src/02_types/booking.types';

test.describe('Booking CRUD', () => {
  test('verify GET all bookings returns non-empty list', async ({ bookingClient }) => {
    const response = await bookingClient.getAllBookings();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('verify POST create booking returns created data', async ({ bookingService }) => {
    const payload = buildBookingRequest();
    const created = await bookingService.createAndVerify(payload);
    expect(created.bookingid).toBeGreaterThan(0);
  });

  test('verify GET booking by ID returns correct data', async ({ bookingService, bookingClient }) => {
    const payload = buildBookingRequest();
    const created = await bookingService.createAndVerify(payload);

    const response = await bookingClient.getBookingById(created.bookingid);
    expect(response.status()).toBe(200);
    const body = await response.json() as BookingRequest;
    expect(body.firstname).toBe(payload.firstname);
    expect(body.lastname).toBe(payload.lastname);
  });

  test('verify PUT update booking reflects changes in GET', async ({ bookingService, authService }) => {
    const original = buildBookingRequest();
    const created = await bookingService.createAndVerify(original);
    const token = await authService.getToken();

    const updated = buildBookingRequest({ firstname: 'UpdatedName', lastname: 'UpdatedLast' });
    await bookingService.updateAndVerify(created.bookingid, updated, token);
  });

  test('verify PATCH partial update changes only specified field', async ({ bookingService, bookingClient, authService }) => {
    const original = buildBookingRequest();
    const created = await bookingService.createAndVerify(original);
    const token = await authService.getToken();

    const patchResponse = await bookingClient.partialUpdateBooking(
      created.bookingid,
      { firstname: 'PatchedFirst' },
      token
    );
    expect(patchResponse.status()).toBe(200);

    const getResponse = await bookingClient.getBookingById(created.bookingid);
    const body = await getResponse.json() as BookingRequest;
    expect(body.firstname).toBe('PatchedFirst');
    expect(body.lastname).toBe(original.lastname);
  });

  test('verify DELETE without token returns 403', async ({ bookingService, bookingClient }) => {
    const payload = buildBookingRequest();
    const created = await bookingService.createAndVerify(payload);

    const response = await bookingClient.deleteBookingNoToken(created.bookingid);
    expect(response.status()).toBe(403);
  });

  test('verify DELETE with valid token returns 201 and GET returns 404', async ({ bookingService, authService }) => {
    const payload = buildBookingRequest();
    const created = await bookingService.createAndVerify(payload);
    const token = await authService.getToken();

    await bookingService.deleteAndVerify(created.bookingid, token);
  });
});
