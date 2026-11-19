import type { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';
import type { Booking } from '../schemas/booking.schema';

export interface BookingFilters {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export class BookingClient extends BaseClient {
  private token?: string;

  /** Attaches an auth token used for write operations (PUT/PATCH/DELETE). */
  withToken(token: string): this {
    this.token = token;
    return this;
  }

  private authHeaders(): Record<string, string> {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  list(filters: BookingFilters = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: { ...filters } });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  update(id: number, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders() });
  }

  partialUpdate(id: number, patch: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: patch, headers: this.authHeaders() });
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders() });
  }
}
