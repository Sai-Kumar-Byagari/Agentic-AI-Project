import type {
  AuditEntry,
  Claim,
  Episode,
  MCPServerRow,
  MemoryStat,
  RoutingRow,
  RunRow,
  ScriptStep,
  SettingGroup,
  Suggestion,
} from '../types/console.types';
import {
  ANSWER,
  AUDIT,
  CLAIMS,
  EPISODES,
  MEMORY_STATS,
  ROUTING,
  RUNS,
  RUN_FILTERS,
  SCRIPT,
  SERVERS,
  SETTING_GROUPS,
  SUGGESTIONS,
} from '../data/consoleData';

/**
 * Data-access layer for the authenticated GIP console screens.
 *
 * Today every method returns the reference fixture data synchronously. The
 * shapes match `console.types.ts`, so each getter can later be swapped for a
 * real API call (Slack / Grafana / Prometheus / Loki / Tempo / ArgoCD /
 * GitHub / MCP servers / model providers / memory store) without touching any
 * component. Keeping access behind this boundary is the whole point of the
 * layer — screens never import the fixtures directly.
 */
export const consoleService = {
  // Investigate
  getInvestigationScript(): ScriptStep[] {
    return SCRIPT;
  },
  getInvestigationAnswer(): string {
    return ANSWER;
  },
  getClaims(): Claim[] {
    return CLAIMS;
  },
  getSuggestions(): Suggestion[] {
    return SUGGESTIONS;
  },

  // Runs
  getRuns(): RunRow[] {
    return RUNS;
  },
  getRunFilters(): string[] {
    return RUN_FILTERS;
  },

  // Memory
  getMemoryStats(): MemoryStat[] {
    return MEMORY_STATS;
  },
  getEpisodes(): Episode[] {
    return EPISODES;
  },

  // Integrations
  getServers(): MCPServerRow[] {
    return SERVERS;
  },
  getRouting(): RoutingRow[] {
    return ROUTING;
  },

  // Settings
  getSettingGroups(): SettingGroup[] {
    return SETTING_GROUPS;
  },

  // Audit
  getAuditTimeline(): AuditEntry[] {
    return AUDIT;
  },
};

/**
 * Apply a Runs filter chip to the run collection. Kept alongside the data
 * source so the mapping from filter label → predicate lives in one place.
 */
export function filterRuns(runs: RunRow[], filter: string): RunRow[] {
  switch (filter) {
    case 'Completed':
      return runs.filter((r) => r.status === 'COMPLETED');
    case 'With gaps':
      return runs.filter((r) => r.status === 'WITH GAPS');
    case 'Grounding rejected':
      return runs.filter((r) => r.grounding === 'REJECTED');
    case 'Active':
      return runs.filter((r) => r.status === 'RUNNING');
    case 'All':
    default:
      return runs;
  }
}
