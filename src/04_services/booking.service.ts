import { expect } from '@playwright/test';
import { BookingClient } from '../03_clients/booking.client';
import { BookingRequest, BookingResponse } from '../02_types/booking.types';

export class BookingService {
  constructor(private readonly bookingClient: BookingClient) {}

  async createAndVerify(body: BookingRequest): Promise<BookingResponse> {
    const createResponse = await this.bookingClient.createBooking(body);
    expect(createResponse.status()).toBe(200);

    const created = await createResponse.json() as BookingResponse;
    expect(created.bookingid).toBeDefined();

    const getResponse = await this.bookingClient.getBookingById(created.bookingid);
    expect(getResponse.status()).toBe(200);

    const fetched = await getResponse.json() as BookingRequest;
    expect(fetched.firstname).toBe(body.firstname);
    expect(fetched.lastname).toBe(body.lastname);
    expect(fetched.totalprice).toBe(body.totalprice);

    return created;
  }

  async updateAndVerify(id: number, body: BookingRequest, token: string): Promise<void> {
    const updateResponse = await this.bookingClient.updateBooking(id, body, token);
    expect(updateResponse.status()).toBe(200);

    const getResponse = await this.bookingClient.getBookingById(id);
    expect(getResponse.status()).toBe(200);

    const fetched = await getResponse.json() as BookingRequest;
    expect(fetched.firstname).toBe(body.firstname);
    expect(fetched.lastname).toBe(body.lastname);
    expect(fetched.totalprice).toBe(body.totalprice);
  }

  async deleteAndVerify(id: number, token: string): Promise<void> {
    // Restful Booker DELETE returns 201 (not 200) — verified against live API
    const deleteResponse = await this.bookingClient.deleteBooking(id, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await this.bookingClient.getBookingById(id);
    expect(getResponse.status()).toBe(404);
  }
}
