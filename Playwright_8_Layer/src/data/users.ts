import { env } from '../config/env';

export interface TestUser {
  username: string;
  password: string;
  role: 'standard' | 'locked' | 'problem' | 'performance';
}

export const users: Record<TestUser['role'], TestUser> = {
  standard: { ...env.users.standard, role: 'standard' },
  locked: { ...env.users.locked, role: 'locked' },
  problem: { ...env.users.problem, role: 'problem' },
  performance: { ...env.users.performance, role: 'performance' },
};

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const defaultCheckoutInfo: CheckoutInfo = {
  firstName: 'Pramod',
  lastName: 'Dutta',
  postalCode: '560001',
};
