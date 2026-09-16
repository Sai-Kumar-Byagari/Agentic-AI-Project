export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'responder' | 'admin' | 'security_reviewer';
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  status: 'success' | 'error';
  data: {
    user: User;
    sessionToken: string;
    expiresIn: number;
    workspace: string;
  };
}

export interface SSOCallbackRequest {
  code: string;
  state: string;
  redirectUri: string;
}

export interface SSOCallbackResponse {
  status: 'success' | 'error';
  data: {
    user: User;
    sessionToken: string;
    expiresIn: number;
    workspace: string;
    mfaRequired: boolean;
  };
}

export interface LogoutResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface RefreshTokenResponse {
  status: 'success' | 'error';
  data: {
    sessionToken: string;
    expiresIn: number;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface ApiError {
  status: 'error';
  code: string;
  message: string;
  timestamp: string;
  details?: {
    field?: string;
    validation?: string[];
  };
}
