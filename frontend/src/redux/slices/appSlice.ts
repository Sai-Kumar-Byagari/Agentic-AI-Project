import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Investigation Types
export interface TimelineEvent {
  id: string;
  label: string;
  text: string;
  meta: string;
  detail?: string;
  rowStyle: string;
  spineStyle: string;
  labelStyle: string;
  detailStyle?: string;
}

export interface Answer {
  id: string;
  question: string;
  runId: string;
  text: string;
  claims: Claim[];
  observations: Evidence[];
}

export interface Claim {
  id: string;
  text: string;
  verdict: 'verified' | 'withheld' | 'running';
}

export interface Evidence {
  id: string;
  name: string;
  source: string;
  type: string;
}

export interface QuickStartQuestion {
  id: string;
  tag: string;
  text: string;
  meta: string;
  go: () => void;
}

export interface InvestigationState {
  idle: boolean;
  started: boolean;
  busy: boolean;
  busyLabel: string;
  question: string;
  runId: string;
  timeline: TimelineEvent[];
  answer: Answer | null;
  suggestions: QuickStartQuestion[];
}

// Runs Types
export interface RunCard {
  id: string;
  question: string;
  service: string;
  status: 'running' | 'verified' | 'withheld' | 'paused' | 'failed';
  timestamp: string;
  coverage: number;
  duration: string;
}

export interface RunFilters {
  status?: string;
  service?: string;
  dateRange?: [string, string];
}

export interface RunsState {
  runs: RunCard[];
  filters: RunFilters;
  isLoading: boolean;
}

// Memory Types
export interface MemoryStat {
  label: string;
  value: string | number;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  playbook?: string;
}

export interface MemoryState {
  episodes: Episode[];
  stats: MemoryStat[];
  isLoading: boolean;
}

// Integrations Types
export interface MCPServer {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  metrics: {
    requests: number;
    latency: string;
  };
}

export interface IntegrationsState {
  servers: MCPServer[];
  isLoading: boolean;
}

// Settings Types
export interface SettingGroup {
  id: string;
  name: string;
  settings: {
    id: string;
    label: string;
    current: string | number;
    default: string | number;
    type: 'string' | 'number' | 'boolean' | 'select';
  }[];
}

export interface SettingsState {
  groups: SettingGroup[];
  isLoading: boolean;
}

// Audit Types
export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  outcome: 'success' | 'error' | 'warning';
  details?: string;
}

export interface AuditState {
  timeline: AuditEvent[];
  isLoading: boolean;
}

// Main App State
interface AppState {
  activeTab: 'investigate' | 'runs' | 'memory' | 'integrations' | 'settings' | 'audit';
  investigation: InvestigationState;
  runs: RunsState;
  memory: MemoryState;
  integrations: IntegrationsState;
  settings: SettingsState;
  audit: AuditState;
}

const initialInvestigationState: InvestigationState = {
  idle: true,
  started: false,
  busy: false,
  busyLabel: '',
  question: '',
  runId: '',
  timeline: [],
  answer: null,
  suggestions: [],
};

const initialRunsState: RunsState = {
  runs: [],
  filters: {},
  isLoading: false,
};

const initialMemoryState: MemoryState = {
  episodes: [],
  stats: [],
  isLoading: false,
};

const initialIntegrationsState: IntegrationsState = {
  servers: [],
  isLoading: false,
};

const initialSettingsState: SettingsState = {
  groups: [],
  isLoading: false,
};

const initialAuditState: AuditState = {
  timeline: [],
  isLoading: false,
};

const initialState: AppState = {
  activeTab: 'investigate',
  investigation: initialInvestigationState,
  runs: initialRunsState,
  memory: initialMemoryState,
  integrations: initialIntegrationsState,
  settings: initialSettingsState,
  audit: initialAuditState,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Tab actions
    setActiveTab: (state, action: PayloadAction<AppState['activeTab']>) => {
      state.activeTab = action.payload;
    },

    // Investigation actions
    setInvestigationState: (state, action: PayloadAction<Partial<InvestigationState>>) => {
      state.investigation = { ...state.investigation, ...action.payload };
    },
    resetInvestigation: (state) => {
      state.investigation = initialInvestigationState;
    },
    setSuggestions: (state, action: PayloadAction<QuickStartQuestion[]>) => {
      state.investigation.suggestions = action.payload;
    },
    startInvestigation: (state, action: PayloadAction<{ question: string; runId: string }>) => {
      state.investigation.idle = false;
      state.investigation.started = true;
      state.investigation.question = action.payload.question;
      state.investigation.runId = action.payload.runId;
    },
    setTimeline: (state, action: PayloadAction<TimelineEvent[]>) => {
      state.investigation.timeline = action.payload;
    },
    setAnswer: (state, action: PayloadAction<Answer>) => {
      state.investigation.answer = action.payload;
    },
    setBusy: (state, action: PayloadAction<{ busy: boolean; label?: string }>) => {
      state.investigation.busy = action.payload.busy;
      if (action.payload.label) {
        state.investigation.busyLabel = action.payload.label;
      }
    },

    // Runs actions
    setRuns: (state, action: PayloadAction<RunCard[]>) => {
      state.runs.runs = action.payload;
    },
    setRunsLoading: (state, action: PayloadAction<boolean>) => {
      state.runs.isLoading = action.payload;
    },
    setRunsFilters: (state, action: PayloadAction<RunFilters>) => {
      state.runs.filters = action.payload;
    },

    // Memory actions
    setEpisodes: (state, action: PayloadAction<Episode[]>) => {
      state.memory.episodes = action.payload;
    },
    setMemoryStats: (state, action: PayloadAction<MemoryStat[]>) => {
      state.memory.stats = action.payload;
    },
    setMemoryLoading: (state, action: PayloadAction<boolean>) => {
      state.memory.isLoading = action.payload;
    },

    // Integrations actions
    setServers: (state, action: PayloadAction<MCPServer[]>) => {
      state.integrations.servers = action.payload;
    },
    setIntegrationsLoading: (state, action: PayloadAction<boolean>) => {
      state.integrations.isLoading = action.payload;
    },

    // Settings actions
    setSettingGroups: (state, action: PayloadAction<SettingGroup[]>) => {
      state.settings.groups = action.payload;
    },
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.settings.isLoading = action.payload;
    },

    // Audit actions
    setAuditTimeline: (state, action: PayloadAction<AuditEvent[]>) => {
      state.audit.timeline = action.payload;
    },
    setAuditLoading: (state, action: PayloadAction<boolean>) => {
      state.audit.isLoading = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setInvestigationState,
  resetInvestigation,
  setSuggestions,
  startInvestigation,
  setTimeline,
  setAnswer,
  setBusy,
  setRuns,
  setRunsLoading,
  setRunsFilters,
  setEpisodes,
  setMemoryStats,
  setMemoryLoading,
  setServers,
  setIntegrationsLoading,
  setSettingGroups,
  setSettingsLoading,
  setAuditTimeline,
  setAuditLoading,
} = appSlice.actions;

// Selectors
export const selectActiveTab = (state: { app: AppState }) => state.app.activeTab;
export const selectInvestigation = (state: { app: AppState }) => state.app.investigation;
export const selectRuns = (state: { app: AppState }) => state.app.runs;
export const selectMemory = (state: { app: AppState }) => state.app.memory;
export const selectIntegrations = (state: { app: AppState }) => state.app.integrations;
export const selectSettings = (state: { app: AppState }) => state.app.settings;
export const selectAudit = (state: { app: AppState }) => state.app.audit;

export default appSlice.reducer;
