// Validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /.{8,}/, // Min 8 characters
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  RATE_LIMIT_EXCEEDED: 'Too many login attempts. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Form labels
export const FORM_LABELS = {
  EMAIL: 'Work email',
  PASSWORD: 'Password',
  REMEMBER_ME: 'Remember me',
  SIGN_IN: 'Sign in',
  FORGOT_PASSWORD: 'Forgot password?',
  SSO_BUTTON: 'Continue with Okta',
};

// Status labels
export const STATUS_LABELS = {
  VERIFIED: 'Verified',
  WITHHELD: 'Withheld',
  RUNNING: 'Running',
  PAUSED: 'Paused',
  FAILED: 'Failed',
};
