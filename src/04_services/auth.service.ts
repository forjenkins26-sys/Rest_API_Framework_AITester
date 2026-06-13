import { expect } from '@playwright/test';
import { AuthClient } from '../03_clients/auth.client';
import { config } from '../01_config/config';

export class AuthService {
  private cachedToken: string | null = null;

  constructor(private readonly authClient: AuthClient) {}

  async getToken(): Promise<string> {
    if (this.cachedToken) return this.cachedToken;

    const response = await this.authClient.createToken({
      username: config.auth.username,
      password: config.auth.password
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    if (!body.token || body.token === 'Bad credentials') {
      throw new Error(`Auth failed — check credentials. Response: ${JSON.stringify(body)}`);
    }

    this.cachedToken = body.token as string;
    return this.cachedToken;
  }

  clearToken(): void {
    this.cachedToken = null;
  }
}
