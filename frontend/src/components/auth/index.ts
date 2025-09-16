// Authentication components for AI Social Media Platform
// Exports all auth-related components with proper TypeScript types

export { LoginForm } from './LoginForm';
export { RegisterForm } from './RegisterForm';
export { LogoutButton } from './LogoutButton';
export { AuthGuard, withAuthGuard, useAuthGuard } from './AuthGuard';
export { PoliticalAlignmentSelector } from './PoliticalAlignmentSelector';
export { PersonaTypeSelector } from './PersonaTypeSelector';

// Re-export default components for convenience
export { default as LoginFormDefault } from './LoginForm';
export { default as RegisterFormDefault } from './RegisterForm';
export { default as LogoutButtonDefault } from './LogoutButton';
export { default as AuthGuardDefault } from './AuthGuard';
export { default as PoliticalAlignmentSelectorDefault } from './PoliticalAlignmentSelector';
export { default as PersonaTypeSelectorDefault } from './PersonaTypeSelector';

// Auth utility types
export type PersonaType =
  | 'politician'
  | 'influencer'
  | 'journalist'
  | 'business_leader'
  | 'activist'
  | 'celebrity'
  | 'podcaster'
  | 'content_creator'
  | 'regular_user';

export type AuthVariant = 'button' | 'menu-item' | 'icon';
export type AuthSize = 'sm' | 'md' | 'lg';

// Component configuration types
export interface AuthConfig {
  apiBaseUrl?: string;
  redirectAfterLogin?: string;
  redirectAfterLogout?: string;
  enableRememberMe?: boolean;
  requireEmailVerification?: boolean;
  enablePoliticalAlignment?: boolean;
  enablePersonaTypes?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

// Auth state types
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null; // Using any to avoid circular dependency with User type
  error: string | null;
}

// Form validation schemas (re-exported for external use)
export const AUTH_VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  DISPLAY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  POLITICAL_INTENSITY: {
    MIN: 1,
    MAX: 10,
  },
} as const;

// Common auth error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email address already in use',
  USERNAME_TAKEN: 'Username is already taken',
  WEAK_PASSWORD: 'Password must contain uppercase, lowercase, and number',
  TERMS_NOT_ACCEPTED: 'You must agree to the terms of service',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Auth component class names for styling
export const AUTH_CLASSES = {
  form: 'auth-form',
  input: 'auth-input',
  button: 'auth-button',
  error: 'auth-error',
  success: 'auth-success',
  loading: 'auth-loading',
  political: 'political-alignment',
  persona: 'persona-type',
} as const;