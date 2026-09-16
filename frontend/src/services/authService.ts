import axiosInstance from '../api/axiosInstance';
import { AUTH_ENDPOINTS } from '../api/endpoints';
import {
  LoginRequest,
  LoginResponse,
  SSOCallbackRequest,
  SSOCallbackResponse,
  LogoutResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '../types/auth.types';
import { normalizeApiError, NormalizedApiError } from '../utils/apiError';
import { mockLoginResponse } from '../constants/mockData';
import { logService } from './logService';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        logService.logInfo('Mock login', { email });
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 500);
        });
      }

      // Validate inputs
      if (!email || !password) {
        throw new NormalizedApiError('VALIDATION_ERROR', 'Email and password are required', 400);
      }

      const response = await axiosInstance.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.data.status === 'success') {
        logService.logInfo('Login successful', { email, userId: response.data.data.user.id });
      }

      return response.data;
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      logService.logError('Login failed', error instanceof Error ? error : new Error(normalizedError.message), {
        email,
        code: normalizedError.code,
      });
      throw normalizedError;
    }
  },

  async ssoCallback(code: string, state: string, redirectUri: string): Promise<SSOCallbackResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        console.log('[MOCK] SSO Callback:', { code, state });
        return new Promise((resolve) => {
          setTimeout(() => resolve({ ...mockLoginResponse, data: { ...mockLoginResponse.data, mfaRequired: false } }), 500);
        });
      }

      const response = await axiosInstance.post<SSOCallbackResponse>(AUTH_ENDPOINTS.SSO_CALLBACK, {
        code,
        state,
        redirectUri,
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async logout(): Promise<LogoutResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        logService.logInfo('Mock logout');
        return new Promise((resolve) => {
          setTimeout(() => resolve({ status: 'success', message: 'Logged out', timestamp: new Date().toISOString() }), 300);
        });
      }

      const response = await axiosInstance.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT);

      if (response.data.status === 'success') {
        logService.logInfo('Logout successful');
      }

      return response.data;
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      logService.logError('Logout failed', error instanceof Error ? error : new Error(normalizedError.message), {
        code: normalizedError.code,
      });
      throw normalizedError;
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        logService.logInfo('Mock token refresh');
        return new Promise((resolve) => {
          setTimeout(() => resolve({ status: 'success', data: { sessionToken: 'jwt_refreshed_' + Date.now(), expiresIn: 28800 } }), 300);
        });
      }

      const response = await axiosInstance.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN);

      if (response.data.status === 'success') {
        logService.logInfo('Token refreshed successfully');
      }

      return response.data;
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      logService.logError('Token refresh failed', error instanceof Error ? error : new Error(normalizedError.message), {
        code: normalizedError.code,
      });
      throw normalizedError;
    }
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Forgot Password:', { email });
        return new Promise((resolve) => {
          setTimeout(() => resolve({ status: 'success', message: 'Password reset link sent', timestamp: new Date().toISOString() }), 300);
        });
      }

      const response = await axiosInstance.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email,
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
