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

/**
 * Mock data ported verbatim from the GIP Console v3 reference
 * (`primary/GIP Console v3.dc.html`). This is the fixture layer: the shapes
 * match `console.types.ts` so a real API can replace these values without any
 * component changes. Access everything through `services/consoleService.ts`.
 */

// ---------------------------------------------------------------------------
// Investigate — the scripted agent loop
// ---------------------------------------------------------------------------

export const SCRIPT: ScriptStep[] = [
  { k: 'plan', label: 'ITERATION 1', text: 'Planning the first sweep', meta: 'coordinator · 620 ms' },
  {
    k: 'thought',
    label: 'REASONING',
    text: 'Confirm the latency shape before attributing a cause. Metrics first, then logs from the same window.',
  },
  {
    k: 'action',
    label: 'TOOL',
    text: 'prometheus__query_range',
    meta: 'metrics',
    detail:
      'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="checkout"}[1m])) by (le))',
  },
  {
    k: 'result',
    label: 'METRICS',
    text: 'p99 rose 180 ms → 1.42 s at 14:19:40Z, recovered 14:34:10Z',
    meta: 'ok · 412 ms · E1',
    cover: 'metrics',
    obs: { id: 'E1', tool: 'prometheus__query_range', summary: 'p99 180 ms → 1.42 s at 14:19:40Z' },
  },
  {
    k: 'action',
    label: 'TOOL',
    text: 'loki__query',
    meta: 'logs',
    detail: '{service="checkout"} |= "upstream timeout" | json | line_format "{{.upstream}}"',
  },
  {
    k: 'result',
    label: 'LOGS',
    text: '1,284 upstream timeouts to payments-gw, first at 14:19:38Z',
    meta: 'ok · 806 ms · E2',
    cover: 'logs',
    obs: { id: 'E2', tool: 'loki__query', summary: '1,284 timeouts to payments-gw from 14:19:38Z' },
  },
  { k: 'blocked', label: 'BLOCKED', text: 'Answer withheld — required domains uncovered: traces, deploys' },
  { k: 'plan', label: 'ITERATION 2', text: 'Gathering the missing domains in parallel', meta: 'directive GATHER_MORE' },
  {
    k: 'action',
    label: 'TOOL',
    text: 'tempo__search_traces',
    meta: 'traces',
    detail: 'service=checkout status=error duration>1s start=14:18Z end=14:36Z',
  },
  {
    k: 'result',
    label: 'TRACES',
    text: '94% of slow spans blocked in payments-gw connection acquire',
    meta: 'ok · 1.1 s · E3',
    cover: 'traces',
    obs: { id: 'E3', tool: 'tempo__search_traces', summary: '94% of slow spans blocked on connection acquire' },
  },
  {
    k: 'result',
    label: 'DEPLOYS',
    text: 'payments-gw v2.31.0 rolled out 14:15:02Z → 14:18:40Z',
    meta: 'ok · 240 ms · E4',
    cover: 'deploys',
    obs: { id: 'E4', tool: 'argocd__list_deployments', summary: 'payments-gw v2.31.0 rollout finished 14:18:40Z' },
  },
  { k: 'pass', label: 'GATE 1', text: 'Structural check passed — every claim carries a citation, no placeholders' },
  {
    k: 'reject',
    label: 'GATE 2',
    text: 'Rejected — "the deploy caused the spike" is UNSUPPORTED by the evidence set',
    gate2: 'bad',
  },
  { k: 'plan', label: 'ITERATION 3', text: 'Closing the causal gap', meta: 'directive TARGETED_REPLAN · retry 1 of 2' },
  {
    k: 'action',
    label: 'TOOL',
    text: 'github__compare_refs',
    meta: 'code',
    detail: 'repo=payments-gw base=v2.30.4 head=v2.31.0 paths=config/**',
  },
  {
    k: 'result',
    label: 'CODE',
    text: 'v2.31.0 reduced http.pool.max_connections 64 → 8 in payments-gw',
    meta: 'ok · 540 ms · E5',
    cover: 'code',
    obs: { id: 'E5', tool: 'github__compare_refs', summary: 'pool max_connections 64 → 8 in v2.31.0' },
  },
  { k: 'pass', label: 'GATE 2', text: 'Accepted — 4 of 4 claims SUPPORTED against 5 observations', gate2: 'good' },
];

export const ANSWER =
  'Checkout p99 latency rose from 180 ms to 1.42 s at 14:19:40Z and recovered at 14:34:10Z [E1]. ' +
  'Requests were not slow in checkout itself: 94% of slow spans were blocked acquiring a connection to ' +
  'payments-gw [E3], and checkout logged 1,284 upstream timeouts to that service starting at 14:19:38Z [E2].' +
  '\n\n' +
  'The payments-gw rollout of v2.31.0 completed at 14:18:40Z, one minute before the first timeout [E4]. ' +
  'That release reduced http.pool.max_connections from 64 to 8 [E5], so the gateway’s connection pool ' +
  'saturated as soon as normal checkout traffic resumed.' +
  '\n\n' +
  'Recovery at 14:34:10Z coincides with no further deploy activity in the window, so the evidence supports ' +
  'pool exhaustion as the mechanism but does not establish what relieved it. Raising ' +
  'http.pool.max_connections back to 64 in payments-gw is the change the evidence points at.';

export const CLAIMS: Claim[] = [
  { status: 'SUPPORTED', text: 'Checkout p99 rose from 180 ms to 1.42 s at 14:19:40Z', cite: 'E1' },
  { status: 'SUPPORTED', text: 'Slow spans were blocked acquiring payments-gw connections', cite: 'E3 · E2' },
  { status: 'SUPPORTED', text: 'payments-gw v2.31.0 reduced the pool from 64 to 8 connections', cite: 'E4 · E5' },
  { status: 'PARTIAL', text: 'What relieved the saturation at 14:34:10Z is not established', cite: 'E1' },
];

export const SUGGESTIONS: Suggestion[] = [
  { tag: 'ROOT_CAUSE', text: 'Why did checkout p99 spike at 14:20 UTC?', meta: 'asked 9 min ago' },
  {
    tag: 'IMPACT',
    text: 'Which downstream services saw errors during the payments-gw rollout?',
    meta: 'asked 41 min ago',
  },
  { tag: 'CHANGE', text: 'What changed in payments-gw between 13:00 and 15:00 UTC?', meta: 'asked 2 h ago' },
];

export const RUN_ID = '01J8K4RQ7ZC3';

// ---------------------------------------------------------------------------
// Runs
// ---------------------------------------------------------------------------

// [id, goal, status, statusTone, grounding, groundingTone, coverage, coveragePct, duration]
type RunTuple = [string, string, RunRow['status'], RunRow['statusTone'], string, RunRow['groundingTone'], string, number, string];

const RUN_TUPLES: RunTuple[] = [
  ['01J8K4RQ', 'Why did checkout p99 spike at 14:20 UTC?', 'COMPLETED', 'good', 'ACCEPTED', 'good', '5/5', 100, '52 s'],
  ['01J8K3ZP', 'Which pods restarted in ledger-api overnight?', 'COMPLETED', 'good', 'ACCEPTED', 'good', '3/3', 100, '18 s'],
  ['01J8K2WT', 'Did the cache migration change read latency?', 'WITH GAPS', 'warn', 'ACCEPTED', 'good', '3/4', 75, '1 m 44 s'],
  ['01J8K1HF', 'Root cause of the 502s on api-gw at 09:12?', 'COMPLETED', 'good', 'ACCEPTED', 'good', '4/4', 100, '38 s'],
  ['01J8K0QA', 'Is the settlement job backlog growing?', 'FAILED', 'bad', 'REJECTED', 'bad', '2/4', 50, '2 m 10 s'],
  ['01J8JZM4', 'Why is fraud-scoring CPU pinned at 95%?', 'RUNNING', 'accent', 'PENDING', 'neutral', '2/5', 40, '21 s'],
  ['01J8JYD1', 'Compare error budget burn across regions', 'COMPLETED', 'good', 'ACCEPTED', 'good', '3/3', 100, '44 s'],
  ['01J8JX88', 'What deployed before the ledger drift alert?', 'CANCELLED', 'neutral', 'SKIPPED', 'neutral', '1/3', 33, '9 s'],
];

export const RUNS: RunRow[] = RUN_TUPLES.map((r) => ({
  id: r[0],
  goal: r[1],
  status: r[2],
  statusTone: r[3],
  grounding: r[4],
  groundingTone: r[5],
  coverage: r[6],
  coveragePct: r[7],
  duration: r[8],
}));

export const RUN_FILTERS: string[] = ['All', 'Completed', 'With gaps', 'Grounding rejected', 'Active'];

// ---------------------------------------------------------------------------
// Memory
// ---------------------------------------------------------------------------

export const MEMORY_STATS: MemoryStat[] = [
  { value: '412', label: 'episodes stored' },
  { value: '68%', label: 'cited when recalled' },
  { value: '19', label: 'playbooks active' },
  { value: '31', label: 'awaiting promotion' },
];

// [summary, intent, relevance, ratio, status, statusTone]
type EpisodeTuple = [string, string, number, string, string, Episode['statusTone']];

const EPISODE_TUPLES: EpisodeTuple[] = [
  ['Connection-pool saturation after a config-only release', 'ROOT_CAUSE', 79, '19/24', 'PINNED', 'good'],
  ['Kafka consumer lag from a rebalance storm', 'ROOT_CAUSE', 71, '12/17', 'ACTIVE', 'neutral'],
  ['Cross-region replication lag during index rebuild', 'IMPACT', 82, '9/11', 'ACTIVE', 'neutral'],
  ['TLS handshake errors after certificate rotation', 'ROOT_CAUSE', 78, '7/9', 'ACTIVE', 'neutral'],
  ['Settlement backlog from a stuck batch cursor', 'CHANGE', 0, '0/6', 'REVIEW', 'warn'],
  ['Cache stampede on cold start after scale-in', 'ROOT_CAUSE', 75, '3/4', 'ACTIVE', 'neutral'],
];

export const EPISODES: Episode[] = EPISODE_TUPLES.map((e) => ({
  summary: e[0],
  intent: e[1],
  relevance: e[2],
  ratio: e[3],
  status: e[4],
  statusTone: e[5],
}));

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

// [name, health, healthTone, domain, breaker, [p95, calls24h, errors, tools]]
type ServerTuple = [string, string, MCPServerRow['healthTone'], string, string, [string, string, string, string]];

const SERVER_TUPLES: ServerTuple[] = [
  ['prometheus', 'HEALTHY', 'good', 'metrics', 'closed', ['412 ms', '3.1k', '0.2%', '6']],
  ['loki', 'HEALTHY', 'good', 'logs', 'closed', ['806 ms', '2.4k', '0.6%', '4']],
  ['tempo', 'DEGRADED', 'warn', 'traces', 'half-open', ['2.10 s', '980', '4.1%', '3']],
  ['argocd', 'HEALTHY', 'good', 'deploys', 'closed', ['240 ms', '640', '0.0%', '5']],
  ['github-enterprise', 'HEALTHY', 'good', 'code', 'closed', ['540 ms', '1.2k', '0.3%', '8']],
  ['servicenow', 'UNHEALTHY', 'bad', 'tickets', 'open', ['—', '86', '38.4%', '3']],
];

export const SERVERS: MCPServerRow[] = SERVER_TUPLES.map((x) => ({
  name: x[0],
  health: x[1],
  healthTone: x[2],
  domain: x[3],
  breaker: x[4],
  metrics: [
    { k: 'p95', v: x[5][0] },
    { k: 'calls 24h', v: x[5][1] },
    { k: 'errors', v: x[5][2] },
    { k: 'tools', v: x[5][3] },
  ],
}));

// [role, model, failover, state, stateTone]
type RoutingTuple = [string, string, string, string, RoutingRow['stateTone']];

const ROUTING_TUPLES: RoutingTuple[] = [
  ['Coordinator', 'qwen2.5-72b-instruct @ vLLM-A', 'vLLM-B', 'PRIMARY', 'good'],
  ['Judge', 'qwen2.5-72b-instruct @ vLLM-B', 'vLLM-A', 'PRIMARY', 'good'],
  ['Utility / triage', 'qwen2.5-7b-instruct @ vLLM-C', 'none', 'PRIMARY', 'good'],
  ['Embeddings', 'bge-m3 @ tei-01', 'tei-02', 'PRIMARY', 'good'],
];

export const ROUTING: RoutingRow[] = ROUTING_TUPLES.map((r) => ({
  role: r[0],
  model: r[1],
  failover: r[2],
  state: r[3],
  stateTone: r[4],
}));

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

// [key, note, current, default, source, sourceTone]
type SettingTuple = [string, string, string, string, string, SettingGroup['rows'][number]['sourceTone']];

const SETTING_GROUP_DEFS: { name: string; rows: SettingTuple[] }[] = [
  {
    name: 'Agent loop',
    rows: [
      ['agent.max_iterations', 'Hard cap on PPAOR loops per run', '10', '10', 'DEFAULT', 'neutral'],
      ['context.token_budget', 'Context assembled per iteration', '24000', '32000', 'DB', 'accent'],
      ['limits.concurrent_runs', 'Sustained active runs per node', '25', '25', 'DEFAULT', 'neutral'],
    ],
  },
  {
    name: 'Reliability',
    rows: [
      ['reliability.grounding_enabled', 'Release blocked unless claims verify', 'true', 'true', 'DEFAULT', 'good'],
      ['reliability.max_retries', 'Typed retry directives per run', '2', '2', 'DEFAULT', 'neutral'],
      ['tools.default_timeout_ms', 'Per MCP call, before retry', '15000', '20000', 'DB', 'accent'],
    ],
  },
  {
    name: 'Memory & security',
    rows: [
      ['memory.min_confidence', 'Floor for distilling an episode', '0.65', '0.60', 'DB', 'accent'],
      ['security.allow_public_egress', 'Outbound beyond the bank network', 'false', 'false', 'ENV', 'good'],
    ],
  },
];

export const SETTING_GROUPS: SettingGroup[] = SETTING_GROUP_DEFS.map((g) => ({
  name: g.name,
  rows: g.rows.map((x) => ({
    key: x[0],
    note: x[1],
    current: x[2],
    def: x[3],
    source: x[4],
    sourceTone: x[5],
  })),
}));

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

// [when, actor, action, detail, outcome, outcomeTone]
type AuditTuple = [string, string, string, string, string, AuditEntry['outcomeTone']];

const AUDIT_TUPLES: AuditTuple[] = [
  ['14:38:02Z', 'r.khatri', 'settings.update', 'memory.min_confidence 0.60 → 0.65 — "precision tuning"', 'OK', 'good'],
  ['14:21:44Z', 'system', 'grounding.rejected', 'run 01J8K4RQ stage 2 — 1 unsupported claim', 'OK', 'warn'],
  ['13:54:10Z', 'a.mehta', 'mcp.breaker.reset', 'servicenow — "vendor confirmed restart"', 'OK', 'good'],
  ['13:31:57Z', 'r.khatri', 'provider.activate', 'vLLM-B promoted to judge primary', 'OK', 'good'],
  ['12:47:23Z', 'system', 'coverage.blocked', 'run 01J8K2WT — traces unavailable', 'OK', 'warn'],
  ['11:58:40Z', 's.iyer', 'apikey.create', 'ci-postmortem-bot — scope runs:read', 'OK', 'good'],
  ['11:12:06Z', 'unknown', 'auth.login.failed', '3 attempts, account locked 15 min', 'DENIED', 'bad'],
  ['10:40:19Z', 'a.mehta', 'memory.episode.retire', '12 episodes, cited_count = 0 > 90 d', 'OK', 'good'],
];

export const AUDIT: AuditEntry[] = AUDIT_TUPLES.map((a) => ({
  when: a[0],
  actor: a[1],
  action: a[2],
  detail: a[3],
  outcome: a[4],
  outcomeTone: a[5],
}));
