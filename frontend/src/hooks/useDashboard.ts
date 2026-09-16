import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setKPIs,
  setRunOutcomes,
  setEvidenceSources,
  setAttentionQueue,
  setRecentRuns,
  setLoading,
  setError,
  selectKPIs,
  selectRunOutcomes,
  selectEvidenceSources,
  selectAttentionQueue,
  selectRecentRuns,
  selectIsLoading,
  selectError,
  selectFilters,
  setFilters,
} from '../redux/slices/dashboardSlice';
import { dashboardService } from '../services/dashboardService';
import { logService } from '../services/logService';
import { DashboardFilters } from '../types/dashboard.types';

export const useDashboard = (autoFetch: boolean = true) => {
  const dispatch = useDispatch();

  const kpis = useSelector((state: RootState) => selectKPIs(state));
  const runOutcomes = useSelector((state: RootState) => selectRunOutcomes(state));
  const evidenceSources = useSelector((state: RootState) => selectEvidenceSources(state));
  const attentionQueue = useSelector((state: RootState) => selectAttentionQueue(state));
  const recentRuns = useSelector((state: RootState) => selectRecentRuns(state));
  const isLoading = useSelector((state: RootState) => selectIsLoading(state));
  const error = useSelector((state: RootState) => selectError(state));
  const filters = useSelector((state: RootState) => selectFilters(state));

  const fetchDashboardData = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const [statsRes, outcomesRes, sourcesRes, queueRes, runsRes] = await Promise.all([
        dashboardService.getStats('7d'),
        dashboardService.getRunOutcomes(7),
        dashboardService.getEvidenceSources(),
        dashboardService.getAttentionQueue(10),
        dashboardService.getRecentRuns(8),
      ]);

      if (statsRes.status === 'success') {
        dispatch(setKPIs(statsRes.data.kpis));
      }

      if (outcomesRes.status === 'success') {
        dispatch(setRunOutcomes(outcomesRes.data.bars));
      }

      if (sourcesRes.status === 'success') {
        dispatch(setEvidenceSources(sourcesRes.data.sources));
      }

      if (queueRes.status === 'success') {
        dispatch(setAttentionQueue(queueRes.data.queue));
      }

      if (runsRes.status === 'success') {
        dispatch(setRecentRuns(runsRes.data.runs));
      }

      dispatch(setLoading(false));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      dispatch(setError(errorMessage));
      logService.logError('Dashboard fetch failed', err instanceof Error ? err : new Error(errorMessage));
    }
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: DashboardFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const searchRuns = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const response = await dashboardService.searchRuns(filters);

      if (response.status === 'success') {
        dispatch(setRecentRuns(response.data.runs));
      }

      dispatch(setLoading(false));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      dispatch(setError(errorMessage));
      logService.logError('Search failed', err instanceof Error ? err : new Error(errorMessage));
    }
  }, [filters, dispatch]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchDashboardData();
    }
  }, [autoFetch, fetchDashboardData]);

  // Memoized return value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      kpis,
      runOutcomes,
      evidenceSources,
      attentionQueue,
      recentRuns,
      isLoading,
      error,
      filters,
      refetch: fetchDashboardData,
      updateFilters,
      searchRuns,
    }),
    [
      kpis,
      runOutcomes,
      evidenceSources,
      attentionQueue,
      recentRuns,
      isLoading,
      error,
      filters,
      fetchDashboardData,
      updateFilters,
      searchRuns,
    ]
  );

  return value;
};
