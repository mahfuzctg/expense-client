export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Other'] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) {
    console.warn(
      'NEXT_PUBLIC_API_URL is not set. Falling back to http://localhost:5000'
    );
    return 'https://backend-iota-lac-51.vercel.app';
  }
  return url.replace(/\/$/, '');
};

export const API_BASE_URL = getApiBaseUrl();

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: buildApiUrl('/api/auth/login'),
    REGISTER: buildApiUrl('/api/auth/register'),
    LOGOUT: buildApiUrl('/api/auth/logout'),
    ME: buildApiUrl('/api/auth/me'),
  },
  EXPENSES: {
    LIST: buildApiUrl('/api/expenses'),
    CREATE: buildApiUrl('/api/expenses'),
    UPDATE: (id: string) => buildApiUrl(`/api/expenses/${id}`),
    DELETE: (id: string) => buildApiUrl(`/api/expenses/${id}`),
    STATS: buildApiUrl('/api/expenses/chart'),
  },
  BUDGET: {
    SUMMARY: buildApiUrl('/api/budget'),
  },
  HEALTH: buildApiUrl('/api/health'),
} as const;

