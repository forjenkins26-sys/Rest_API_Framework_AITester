export const ROUTES = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutStepOne: '/checkout-step-one.html',
  checkoutStepTwo: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
  dashboard: '/dashboard.html',
} as const;

export const STORAGE_PATHS = {
  standardUser: 'playwright/.auth/standard-user.json',
} as const;

export const SORT_OPTIONS = {
  nameAsc: 'az',
  nameDesc: 'za',
  priceAsc: 'lohi',
  priceDesc: 'hilo',
} as const;

export const TAGS = {
  smoke: '@smoke',
  critical: '@critical',
  regression: '@regression',
  api: '@api',
} as const;
