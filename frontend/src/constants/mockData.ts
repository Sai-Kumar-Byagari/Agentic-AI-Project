import { User, LoginResponse } from '../types/auth.types';
import {
  KPIResponse,
  RunOutcomesResponse,
  EvidenceSourcesResponse,
  AttentionQueueResponse,
  RecentRunsResponse,
} from '../types/dashboard.types';

// Mock User
export const mockUser: User = {
  id: 'user_12345',
  email: 'demo@bank.example',
  firstName: 'John',
  lastName: 'Doe',
  role: 'responder',
  avatar: 'JD',
};

// Mock Login Response
export const mockLoginResponse: LoginResponse = {
  status: 'success',
  data: {
    user: mockUser,
    sessionToken: 'jwt_token_mock_12345',
    expiresIn: 28800,
    workspace: 'acme-bank',
  },
};

// Mock KPI Response
export const mockKPIResponse: KPIResponse = {
  status: 'success',
  data: {
    kpis: [
      {
        id: 'total_runs',
        label: 'Runs this week',
        value: 127,
        delta: '+12%',
        deltaFg: '#3F7A52',
        bg: 'rgba(90,66,112,0.08)',
        fg: '#5A4270',
      },
      {
        id: 'verified_pct',
        label: 'Verified answers',
        value: '84%',
        delta: '+3%',
        deltaFg: '#3F7A52',
        bg: 'rgba(63,122,82,0.08)',
        fg: '#3F7A52',
      },
      {
        id: 'avg_duration',
        label: 'Avg time to answer',
        value: '38.4s',
        delta: '-2.1s',
        deltaFg: '#3F7A52',
        bg: 'rgba(154,108,20,0.08)',
        fg: '#9A6C14',
      },
      {
        id: 'sources_connected',
        label: 'Evidence sources',
        value: 6,
        delta: 'all operational',
        deltaFg: '#3F7A52',
        bg: 'rgba(90,66,112,0.08)',
        fg: '#5A4270',
      },
    ],
  },
};

// Mock Run Outcomes Response
export const mockRunOutcomesResponse: RunOutcomesResponse = {
  status: 'success',
  data: {
    bars: [
      { day: 'Mon', verified: '95px', withheld: '25px' },
      { day: 'Tue', verified: '102px', withheld: '18px' },
      { day: 'Wed', verified: '88px', withheld: '32px' },
      { day: 'Thu', verified: '110px', withheld: '15px' },
      { day: 'Fri', verified: '98px', withheld: '28px' },
      { day: 'Sat', verified: '72px', withheld: '12px' },
      { day: 'Sun', verified: '65px', withheld: '22px' },
    ],
  },
};

// Mock Evidence Sources Response
export const mockEvidenceSourcesResponse: EvidenceSourcesResponse = {
  status: 'success',
  data: {
    sources: [
      {
        id: 'prometheus',
        name: 'Prometheus',
        status: 'connected',
        dot: '#3F7A52',
        fg: '#3F7A52',
        lastCheck: '2 seconds ago',
      },
      {
        id: 'loki',
        name: 'Loki',
        status: 'connected',
        dot: '#3F7A52',
        fg: '#3F7A52',
        lastCheck: '5 seconds ago',
      },
      {
        id: 'tempo',
        name: 'Tempo',
        status: 'connected',
        dot: '#3F7A52',
        fg: '#3F7A52',
        lastCheck: '1 second ago',
      },
      {
        id: 'argocd',
        name: 'ArgoCD',
        status: 'connected',
        dot: '#3F7A52',
        fg: '#3F7A52',
        lastCheck: '8 seconds ago',
      },
      {
        id: 'github',
        name: 'GitHub',
        status: 'connected',
        dot: '#3F7A52',
        fg: '#3F7A52',
        lastCheck: '12 seconds ago',
      },
      {
        id: 'datadog',
        name: 'Datadog',
        status: 'down',
        dot: '#A9503C',
        fg: '#A9503C',
        lastCheck: '3 minutes ago',
      },
    ],
    totalConnected: 5,
    totalDown: 1,
  },
};

// Mock Attention Queue Response
export const mockAttentionQueueResponse: AttentionQueueResponse = {
  status: 'success',
  data: {
    queue: [
      {
        id: 'run_12345',
        state: 'Paused',
        state_badge: { bg: 'rgba(255,193,7,0.12)', fg: '#F59E0B' },
        question: 'Why did checkout service latency spike around 14:20?',
        who: 'alice@bank.example',
        age: '2m ago',
      },
      {
        id: 'run_12346',
        state: 'Withheld',
        state_badge: { bg: 'rgba(244,63,94,0.12)', fg: '#E11D48' },
        question: 'Is the current payment error rate unusual?',
        who: 'bob@bank.example',
        age: '8m ago',
      },
      {
        id: 'run_12347',
        state: 'Running',
        state_badge: { bg: 'rgba(59,130,246,0.12)', fg: '#1D4ED8' },
        question: 'What caused the database connection pool saturation?',
        who: 'carol@bank.example',
        age: '45s ago',
      },
      {
        id: 'run_12348',
        state: 'Paused',
        state_badge: { bg: 'rgba(255,193,7,0.12)', fg: '#F59E0B' },
        question: 'Did the recent deploy affect API response times?',
        who: 'dave@bank.example',
        age: '12m ago',
      },
    ],
  },
};

// Mock Recent Runs Response
export const mockRecentRunsResponse: RecentRunsResponse = {
  status: 'success',
  data: {
    runs: [
      {
        id: 'run_abc123',
        outcome: 'Verified',
        bg: '#ECFDF5',
        fg: '#15803D',
        question: 'Why did p99 latency spike on checkout service?',
        service: 'checkout',
        coverage: '4 of 5',
        covPct: '80%',
        covFg: '#E11D48',
        duration: '38.4s',
        timestamp: '2026-09-15 14:22:00 UTC',
      },
      {
        id: 'run_def456',
        outcome: 'Verified',
        bg: '#ECFDF5',
        fg: '#15803D',
        question: 'What caused payment processing to slow down?',
        service: 'payments-api',
        coverage: '5 of 5',
        covPct: '100%',
        covFg: '#16A34A',
        duration: '41.2s',
        timestamp: '2026-09-15 13:45:00 UTC',
      },
      {
        id: 'run_ghi789',
        outcome: 'Withheld',
        bg: '#FFF1F2',
        fg: '#9F1239',
        question: 'Is the current error rate unusual for this time of day?',
        service: 'api-gateway',
        coverage: '2 of 5',
        covPct: '40%',
        covFg: '#E11D48',
        duration: '120.5s',
        timestamp: '2026-09-15 12:30:00 UTC',
      },
      {
        id: 'run_jkl012',
        outcome: 'Verified',
        bg: '#ECFDF5',
        fg: '#15803D',
        question: 'Did the database schema change cause query slowness?',
        service: 'postgres-primary',
        coverage: '5 of 5',
        covPct: '100%',
        covFg: '#16A34A',
        duration: '52.1s',
        timestamp: '2026-09-15 11:15:00 UTC',
      },
    ],
  },
};
