import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  withCredentials: true, // Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue for pending requests during token refresh
let refreshPromise: Promise<void> | null = null;

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add encryption header if key is present
    if (import.meta.env.VITE_ENCRYPTION_KEY) {
      config.headers['X-Encryption-Enabled'] = 'true';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Prevent multiple refresh attempts
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              // Call token refresh endpoint
              await axiosInstance.post('/auth/refresh-token');
              // Token refresh successful, continue
            } catch (refreshError) {
              // Token refresh failed - redirect to login
              console.error('Token refresh failed:', refreshError);
              window.location.href = '/login?session_expired=true';
              throw refreshError;
            } finally {
              refreshPromise = null;
            }
          })();
        }

        // Wait for refresh to complete
        await refreshPromise;

        // Retry original request with new token
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed, redirect to login
        window.location.href = '/login?session_expired=true';
        return Promise.reject(err);
      }
    }

    // Handle other error codes
    if (error.response?.status === 403) {
      console.error('Forbidden: Access denied');
    } else if (error.response?.status === 404) {
      console.error('Not found:', error.config?.url);
    } else if (error.response?.status === 429) {
      console.error('Rate limited: Too many requests');
    } else if (error.response?.status === 500) {
      console.error('Server error: Internal server error');
    } else if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
