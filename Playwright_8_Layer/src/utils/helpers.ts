export function randomString(length = 8): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

export function randomEmail(domain = 'example.com'): string {
  return `qa.${randomString(6)}.${Date.now()}@${domain}`;
}

export function randomZipCode(): string {
  return String(Math.floor(10000 + Math.random() * 89999));
}

export function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}

export function sum(values: number[]): number {
  return values.reduce((acc, n) => acc + n, 0);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
