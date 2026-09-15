import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KPICard {
  id: string;
  label: string;
  value: string | number;
  delta: string;
  deltaFg: string;
  bg: string;
  fg: string;
}

export interface BarChartData {
  day: string;
  verified: string;
  withheld: string;
}

export interface EvidenceSource {
  id: string;
  name: string;
  status: 'connected' | 'down';
  dot: string;
  fg: string;
  lastCheck: string;
}

export interface QueueItem {
  id: string;
  state: 'Paused' | 'Withheld' | 'Running' | 'Verified' | 'Failed';
  state_badge: { bg: string; fg: string };
  question: string;
  who: string;
  age: string;
}

export interface RunItem {
  id: string;
  outcome: 'Verified' | 'Withheld' | 'Running' | 'Paused';
  bg: string;
  fg: string;
  question: string;
  service: string;
  coverage: string;
  covPct: string;
  covFg: string;
  duration: string;
  timestamp: string;
}

interface DashboardFilters {
  service?: string;
  timeWindow?: string;
  status?: string;
}

interface DashboardState {
  kpis: KPICard[];
  runOutcomes: BarChartData[];
  evidenceSources: EvidenceSource[];
  attentionQueue: QueueItem[];
  recentRuns: RunItem[];
  isLoading: boolean;
  error: string | null;
  activeTab: 'investigate' | 'runs' | 'memory' | 'integrations' | 'settings' | 'audit';
  filters: DashboardFilters;
}

const initialState: DashboardState = {
  kpis: [],
  runOutcomes: [],
  evidenceSources: [],
  attentionQueue: [],
  recentRuns: [],
  isLoading: false,
  error: null,
  activeTab: 'investigate',
  filters: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setKPIs: (state, action: PayloadAction<KPICard[]>) => {
      state.kpis = action.payload;
    },
    setRunOutcomes: (state, action: PayloadAction<BarChartData[]>) => {
      state.runOutcomes = action.payload;
    },
    setEvidenceSources: (state, action: PayloadAction<EvidenceSource[]>) => {
      state.evidenceSources = action.payload;
    },
    setAttentionQueue: (state, action: PayloadAction<QueueItem[]>) => {
      state.attentionQueue = action.payload;
    },
    setRecentRuns: (state, action: PayloadAction<RunItem[]>) => {
      state.recentRuns = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setActiveTab: (state, action: PayloadAction<DashboardState['activeTab']>) => {
      state.activeTab = action.payload;
    },
    setFilters: (state, action: PayloadAction<DashboardFilters>) => {
      state.filters = action.payload;
    },
    clearDashboard: (state) => {
      state.kpis = [];
      state.runOutcomes = [];
      state.evidenceSources = [];
      state.attentionQueue = [];
      state.recentRuns = [];
      state.isLoading = false;
      state.error = null;
      state.filters = {};
    },
  },
});

export const {
  setKPIs,
  setRunOutcomes,
  setEvidenceSources,
  setAttentionQueue,
  setRecentRuns,
  setLoading,
  setError,
  setActiveTab,
  setFilters,
  clearDashboard,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;

// Selectors
export const selectKPIs = (state: { dashboard: DashboardState }) => state.dashboard.kpis;
export const selectRunOutcomes = (state: { dashboard: DashboardState }) => state.dashboard.runOutcomes;
export const selectEvidenceSources = (state: { dashboard: DashboardState }) => state.dashboard.evidenceSources;
export const selectAttentionQueue = (state: { dashboard: DashboardState }) => state.dashboard.attentionQueue;
export const selectRecentRuns = (state: { dashboard: DashboardState }) => state.dashboard.recentRuns;
export const selectIsLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectError = (state: { dashboard: DashboardState }) => state.dashboard.error;
export const selectActiveTab = (state: { dashboard: DashboardState }) => state.dashboard.activeTab;
export const selectFilters = (state: { dashboard: DashboardState }) => state.dashboard.filters;
