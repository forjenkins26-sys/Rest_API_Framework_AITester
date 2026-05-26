import { APIRequestContext, request as pwRequest } from '@playwright/test';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class ApiClient {
  private constructor(public readonly ctx: APIRequestContext, public readonly baseUrl: string) {}

  static async create(baseUrl: string = env.apiBaseUrl, extraHeaders: Record<string, string> = {}): Promise<ApiClient> {
    const ctx = await pwRequest.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...extraHeaders,
      },
      timeout: 30_000,
    });
    logger.debug(`ApiClient created for ${baseUrl}`);
    return new ApiClient(ctx, baseUrl);
  }

  async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    const response = await this.ctx.get(path, { params });
    if (!response.ok()) {
      throw new Error(`GET ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as T;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await this.ctx.post(path, { data: body });
    if (!response.ok()) {
      throw new Error(`POST ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as T;
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await this.ctx.put(path, { data: body });
    if (!response.ok()) {
      throw new Error(`PUT ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as T;
  }

  async delete(path: string): Promise<void> {
    const response = await this.ctx.delete(path);
    if (!response.ok()) {
      throw new Error(`DELETE ${path} failed: ${response.status()}`);
    }
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }
}
