import { test, expect } from '../src/fixtures/api-fixtures';
import { buildAuthRequest } from '../src/05_utils/data-factory';

test.describe('Authentication', () => {
  test('verify token generated with valid credentials', async ({ authClient }) => {
    const response = await authClient.createToken(buildAuthRequest());
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('verify bad credentials returns "Bad credentials" body', async ({ authClient }) => {
    const response = await authClient.createToken({ username: 'wronguser', password: 'wrongpassword' });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // CRITICAL: API returns {"reason":"Bad credentials"} — NOT {"token":"Bad credentials"}
    expect(body.reason).toBe('Bad credentials');
  });
});
