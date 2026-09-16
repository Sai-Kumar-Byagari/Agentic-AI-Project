import { AxiosError } from 'axios';
import { ApiError } from '../types/auth.types';

export class NormalizedApiError extends Error {
  code: string;
  message: string;
  status: number;
  details?: any;

  constructor(code: string, message: string, status: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = status;
    this.details = details;
    this.name = 'NormalizedApiError';
  }
}

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  // Handle axios errors
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;

    if (apiError?.code && apiError?.message) {
      return new NormalizedApiError(
        apiError.code,
        apiError.message,
        error.response?.status || 500,
        apiError.details
      );
    }

    // Handle known status codes
    switch (error.response?.status) {
      case 400:
        return new NormalizedApiError('BAD_REQUEST', 'Invalid request', 400);
      case 401:
        return new NormalizedApiError('UNAUTHORIZED', 'Session expired. Please log in again.', 401);
      case 403:
        return new NormalizedApiError('FORBIDDEN', 'Access denied', 403);
      case 404:
        return new NormalizedApiError('NOT_FOUND', 'Resource not found', 404);
      case 429:
        return new NormalizedApiError(
          'RATE_LIMIT_EXCEEDED',
          'Too many requests. Please try again later.',
          429
        );
      case 500:
        return new NormalizedApiError('INTERNAL_SERVER_ERROR', 'Server error. Please try again.', 500);
      case 503:
        return new NormalizedApiError('SERVICE_UNAVAILABLE', 'Service temporarily unavailable', 503);
      default:
        return new NormalizedApiError(
          'NETWORK_ERROR',
          error.message || 'Network error occurred',
          error.response?.status || 0
        );
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new NormalizedApiError('UNKNOWN_ERROR', error.message);
  }

  // Handle unknown errors
  return new NormalizedApiError('UNKNOWN_ERROR', 'An unknown error occurred');
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response; // No response means network error
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof NormalizedApiError) {
    return error.status === 401;
  }
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};
