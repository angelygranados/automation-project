import 'dotenv/config';

/** Reads an env var, falling back to a default. Centralises all configuration. */
const read = (key: string, fallback: string): string => process.env[key] ?? fallback;

export const env = {
  ci: !!process.env.CI,
  ui: {
    baseUrl: read('UI_BASE_URL', 'https://www.saucedemo.com'),
    username: read('SAUCE_USERNAME', 'standard_user'),
    password: read('SAUCE_PASSWORD', 'secret_sauce'),
  },
  api: {
    baseUrl: read('API_BASE_URL', 'https://restful-booker.herokuapp.com'),
    username: read('BOOKER_USERNAME', 'admin'),
    password: read('BOOKER_PASSWORD', 'password123'),
  },
} as const;
