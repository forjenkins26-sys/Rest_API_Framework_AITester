import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

type EnvName = 'local' | 'dev' | 'staging' | 'prod';

interface AppEnv {
  envName: EnvName;
  baseUrl: string;
  apiBaseUrl: string;
  headless: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  users: {
    standard: { username: string; password: string };
    locked: { username: string; password: string };
    problem: { username: string; password: string };
    performance: { username: string; password: string };
  };
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env: AppEnv = {
  envName: (process.env.ENV as EnvName) || 'local',
  baseUrl: required('BASE_URL', 'https://www.saucedemo.com'),
  apiBaseUrl: required('API_BASE_URL', 'https://fakestoreapi.com'),
  headless: process.env.HEADLESS !== 'false',
  logLevel: (process.env.LOG_LEVEL as AppEnv['logLevel']) || 'info',
  users: {
    standard: {
      username: required('STANDARD_USER', 'standard_user'),
      password: required('USER_PASSWORD', 'secret_sauce'),
    },
    locked: {
      username: required('LOCKED_USER', 'locked_out_user'),
      password: required('USER_PASSWORD', 'secret_sauce'),
    },
    problem: {
      username: required('PROBLEM_USER', 'problem_user'),
      password: required('USER_PASSWORD', 'secret_sauce'),
    },
    performance: {
      username: required('PERF_USER', 'performance_glitch_user'),
      password: required('USER_PASSWORD', 'secret_sauce'),
    },
  },
};
