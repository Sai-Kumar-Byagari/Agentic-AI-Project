import axiosInstance from '../api/axiosInstance';
import { DASHBOARD_ENDPOINTS } from '../api/endpoints';
import {
  KPIResponse,
  RunOutcomesResponse,
  EvidenceSourcesResponse,
  AttentionQueueResponse,
  RecentRunsResponse,
  DashboardFilters,
} from '../types/dashboard.types';
import { normalizeApiError } from '../utils/apiError';
import {
  mockKPIResponse,
  mockRunOutcomesResponse,
  mockEvidenceSourcesResponse,
  mockAttentionQueueResponse,
  mockRecentRunsResponse,
} from '../constants/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const dashboardService = {
  async getStats(timeframe: string = '7d'): Promise<KPIResponse> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Get Stats:', { timeframe });
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockKPIResponse), 300);
        });
      }

      const response = await axiosInstance.get<KPIResponse>(DASHBOARD_ENDPOINTS.STATS, {
        params: { timeframe },
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getRunOutcomes(days: number = 7): Promise<RunOutcomesResponse> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Get Run Outcomes:', { days });
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockRunOutcomesResponse), 300);
        });
      }

      const response = await axiosInstance.get<RunOutcomesResponse>(DASHBOARD_ENDPOINTS.RUN_OUTCOMES, {
        params: { days },
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getEvidenceSources(): Promise<EvidenceSourcesResponse> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Get Evidence Sources');
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockEvidenceSourcesResponse), 300);
        });
      }

      const response = await axiosInstance.get<EvidenceSourcesResponse>(
        DASHBOARD_ENDPOINTS.EVIDENCE_SOURCES
      );

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getAttentionQueue(limit: number = 10): Promise<AttentionQueueResponse> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Get Attention Queue:', { limit });
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockAttentionQueueResponse), 300);
        });
      }

      const response = await axiosInstance.get<AttentionQueueResponse>(
        DASHBOARD_ENDPOINTS.ATTENTION_QUEUE,
        {
          params: { limit },
        }
      );

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getRecentRuns(limit: number = 8): Promise<RecentRunsResponse> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Get Recent Runs:', { limit });
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockRecentRunsResponse), 300);
        });
      }

      const response = await axiosInstance.get<RecentRunsResponse>(DASHBOARD_ENDPOINTS.RECENT_RUNS, {
        params: { limit },
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async searchRuns(filters: DashboardFilters): Promise<RecentRunsResponse> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Search Runs:', { filters });
        // Filter mock data based on criteria
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockRecentRunsResponse), 300);
        });
      }

      const response = await axiosInstance.post<RecentRunsResponse>(DASHBOARD_ENDPOINTS.SEARCH_RUNS, {
        filters,
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async exportRuns(format: 'csv' | 'json' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      if (USE_MOCK_DATA) {
        console.log('[MOCK] Export Runs:', { format });
        return new Blob(['Mock export data'], { type: 'text/plain' });
      }

      const response = await axiosInstance.get(DASHBOARD_ENDPOINTS.EXPORT_RUNS, {
        params: { format },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
