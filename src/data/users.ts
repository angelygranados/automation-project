import { env } from '@config/env';

/** Sauce Demo's publicly documented test users and the behaviour each one triggers. */
export const users = {
  standard: { username: env.ui.username, password: env.ui.password },
  lockedOut: { username: 'locked_out_user', password: env.ui.password },
  problem: { username: 'problem_user', password: env.ui.password },
} as const;

/** Data-driven negative login cases. */
export const invalidLogins = [
  {
    case: 'locked out user',
    username: 'locked_out_user',
    password: env.ui.password,
    error: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    case: 'wrong password',
    username: env.ui.username,
    password: 'not-the-password',
    error: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    case: 'missing username',
    username: '',
    password: env.ui.password,
    error: 'Epic sadface: Username is required',
  },
  {
    case: 'missing password',
    username: env.ui.username,
    password: '',
    error: 'Epic sadface: Password is required',
  },
] as const;
