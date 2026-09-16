// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SSO_CALLBACK: `${API_BASE_URL}/auth/sso-callback`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
};

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: `${API_BASE_URL}/dashboard/stats`,
  RUN_OUTCOMES: `${API_BASE_URL}/dashboard/run-outcomes`,
  EVIDENCE_SOURCES: `${API_BASE_URL}/dashboard/evidence-sources`,
  ATTENTION_QUEUE: `${API_BASE_URL}/dashboard/attention-queue`,
  RECENT_RUNS: `${API_BASE_URL}/dashboard/recent-runs`,
  SEARCH_RUNS: `${API_BASE_URL}/dashboard/search-runs`,
  EXPORT_RUNS: `${API_BASE_URL}/dashboard/export-runs`,
};

export default {
  AUTH_ENDPOINTS,
  DASHBOARD_ENDPOINTS,
};
