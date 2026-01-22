export const ERROR_KEYS = {
  AUTH: {
    INVALID_CREDENTIALS: 'auth.invalid_credentials',
    UNAUTHORIZED: 'auth.unauthorized',
    TOKEN_EXPIRED: 'auth.token_expired',
  },

  USER: {
    EMAIL_EXISTS: 'user.email_exists',
    PHONE_EXISTS: 'user.phone_exists',
    NOT_FOUND: 'user.not_found',
  },

  VALIDATION: {
    REQUIRED: 'validation.required',
    INVALID_EMAIL: 'validation.invalid_email',
    PASSWORD_MIN: 'validation.password_min',
  },

  COMMON: {
    GENERIC_ERROR: 'errors.generic_error',
    FORBIDDEN: 'errors.forbidden',
  },
} as const;