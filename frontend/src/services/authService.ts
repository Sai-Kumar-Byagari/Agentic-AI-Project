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
import { normalizeApiError } from '../utils/apiError';
import { mockLoginResponse } from '../constants/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Login:', { email });
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 500);
        });
      }

      const response = await axiosInstance.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
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
        console.log('[MOCK] Logout');
        return new Promise((resolve) => {
          setTimeout(() => resolve({ status: 'success', message: 'Logged out', timestamp: new Date().toISOString() }), 300);
        });
      }

      const response = await axiosInstance.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      // Use mock data in development
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Refresh Token');
        return new Promise((resolve) => {
          setTimeout(() => resolve({ status: 'success', data: { sessionToken: 'jwt_refreshed_' + Date.now(), expiresIn: 28800 } }), 300);
        });
      }

      const response = await axiosInstance.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
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
