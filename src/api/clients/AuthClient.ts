import type { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';
import { AuthResponseSchema } from '../schemas/booking.schema';

export class AuthClient extends BaseClient {
  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  /** Returns a token or fails loudly; used by fixtures that need an authenticated client. */
  async getToken(username: string, password: string): Promise<string> {
    const body = await BaseClient.parse(
      await this.createToken(username, password),
      AuthResponseSchema,
    );
    if (!('token' in body)) throw new Error(`Authentication failed: ${body.reason}`);
    return body.token;
  }
}
