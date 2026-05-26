import { env } from '../config/env';

type Level = 'debug' | 'info' | 'warn' | 'error';

const order: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function shouldLog(level: Level): boolean {
  return order[level] >= order[env.logLevel];
}

function stamp(level: Level, msg: string): string {
  return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`;
}

export const logger = {
  debug: (msg: string, ...args: unknown[]) => shouldLog('debug') && console.debug(stamp('debug', msg), ...args),
  info: (msg: string, ...args: unknown[]) => shouldLog('info') && console.log(stamp('info', msg), ...args),
  warn: (msg: string, ...args: unknown[]) => shouldLog('warn') && console.warn(stamp('warn', msg), ...args),
  error: (msg: string, ...args: unknown[]) => shouldLog('error') && console.error(stamp('error', msg), ...args),
};
