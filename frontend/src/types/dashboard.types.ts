export interface KPICard {
  id: string;
  label: string;
  value: string | number;
  delta: string;
  deltaFg: string;
  bg: string;
  fg: string;
}

export interface KPIResponse {
  status: 'success' | 'error';
  data: {
    kpis: KPICard[];
  };
}

export interface BarChartData {
  day: string;
  verified: string;
  withheld: string;
}

export interface RunOutcomesResponse {
  status: 'success' | 'error';
  data: {
    bars: BarChartData[];
  };
}

export interface EvidenceSource {
  id: string;
  name: string;
  status: 'connected' | 'down';
  dot: string;
  fg: string;
  lastCheck: string;
}

export interface EvidenceSourcesResponse {
  status: 'success' | 'error';
  data: {
    sources: EvidenceSource[];
    totalConnected: number;
    totalDown: number;
  };
}

export interface QueueItem {
  id: string;
  state: 'Paused' | 'Withheld' | 'Running' | 'Verified' | 'Failed';
  state_badge: { bg: string; fg: string };
  question: string;
  who: string;
  age: string;
}

export interface AttentionQueueResponse {
  status: 'success' | 'error';
  data: {
    queue: QueueItem[];
  };
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

export interface RecentRunsResponse {
  status: 'success' | 'error';
  data: {
    runs: RunItem[];
  };
}

export interface DashboardFilters {
  service?: string;
  timeWindow?: string;
  status?: string;
}

export interface SearchRunsRequest {
  filters: DashboardFilters;
}

export interface SearchRunsResponse {
  status: 'success' | 'error';
  data: {
    runs: RunItem[];
  };
}

export interface ExportRunsRequest {
  format: 'csv' | 'json' | 'pdf';
}
