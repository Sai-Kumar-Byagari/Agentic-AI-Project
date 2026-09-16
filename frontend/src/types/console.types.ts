import type { Domain, Tone } from '../constants/designSystem';

/**
 * Domain types for the GIP authenticated console screens. These mirror the
 * data shapes in the reference (`GIP Console v3.dc.html`) and are the contract
 * the mock service layer fulfils today and a real API can fulfil later.
 */

// ---------------------------------------------------------------------------
// Investigate
// ---------------------------------------------------------------------------

export type StepKind = 'plan' | 'thought' | 'action' | 'result' | 'blocked' | 'pass' | 'reject';

export interface Observation {
  id: string;
  tool: string;
  summary: string;
}

export interface ScriptStep {
  k: StepKind;
  label: string;
  text: string;
  meta?: string;
  detail?: string;
  cover?: Domain;
  gate2?: 'good' | 'bad';
  obs?: Observation;
}

export type ClaimStatus = 'SUPPORTED' | 'PARTIAL';

export interface Claim {
  status: ClaimStatus;
  text: string;
  cite: string;
}

export interface Suggestion {
  tag: string;
  text: string;
  meta: string;
}

// ---------------------------------------------------------------------------
// Runs
// ---------------------------------------------------------------------------

export type RunStatus = 'COMPLETED' | 'WITH GAPS' | 'FAILED' | 'RUNNING' | 'CANCELLED';
export type RunFilter = 'All' | 'Completed' | 'With gaps' | 'Grounding rejected' | 'Active';

export interface RunRow {
  id: string;
  goal: string;
  status: RunStatus;
  statusTone: Tone;
  grounding: string;
  groundingTone: Tone;
  coverage: string;
  coveragePct: number;
  duration: string;
}

// ---------------------------------------------------------------------------
// Memory
// ---------------------------------------------------------------------------

export interface MemoryStat {
  value: string;
  label: string;
}

export interface Episode {
  summary: string;
  intent: string;
  relevance: number;
  ratio: string;
  status: string;
  statusTone: Tone;
}

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

export interface ServerMetric {
  k: string;
  v: string;
}

export interface MCPServerRow {
  name: string;
  health: string;
  healthTone: Tone;
  domain: string;
  breaker: string;
  metrics: ServerMetric[];
}

export interface RoutingRow {
  role: string;
  model: string;
  failover: string;
  state: string;
  stateTone: Tone;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface SettingRow {
  key: string;
  note: string;
  current: string;
  def: string;
  source: string;
  sourceTone: Tone;
}

export interface SettingGroup {
  name: string;
  rows: SettingRow[];
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export interface AuditEntry {
  when: string;
  actor: string;
  action: string;
  detail: string;
  outcome: string;
  outcomeTone: Tone;
}
