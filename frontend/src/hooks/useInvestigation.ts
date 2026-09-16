import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, RefObject, UIEvent } from 'react';
import { C, DOMAINS, type Tone } from '../constants/designSystem';
import { consoleService } from '../services/consoleService';
import { RUN_ID } from '../data/consoleData';
import type { Claim, Observation, ScriptStep } from '../types/console.types';

const SCRIPT: ScriptStep[] = consoleService.getInvestigationScript();
const ANSWER: string = consoleService.getInvestigationAnswer();
const CLAIMS: Claim[] = consoleService.getClaims();

/** Default streaming cadence (ms per timeline step), matching the reference. */
const DEFAULT_STREAM_SPEED = 620;
const MIN_STREAM_SPEED = 220;
const FIRST_STEP_DELAY = 380;
const ANSWER_CHUNK = 9;
const ANSWER_TICK_MS = 16;

export interface GateView {
  name: string;
  state: 'OPEN' | 'PASS' | 'REJECT';
  tone: Tone;
}

export interface BudgetView {
  value: string;
  label: string;
}

export interface DomainView {
  name: string;
  covered: boolean;
}

export interface TimelineView {
  key: string;
  kind: ScriptStep['k'];
  label: string;
  text: string;
  detail: string;
  meta: string;
}

export interface InvestigationView {
  // raw
  question: string;
  draft: string;
  idle: boolean;
  started: boolean;
  runId: string;
  // timeline
  timeline: TimelineView[];
  busy: boolean;
  busyLabel: string;
  // coverage / gates / budget (sub-header)
  domains: DomainView[];
  coverageLabel: string;
  gates: GateView[];
  budget: BudgetView[];
  // answer
  hasAnswer: boolean;
  answerParas: string[];
  answerDone: boolean;
  claims: (Claim & { tone: Tone })[];
  observations: Observation[];
  // scroll pinning
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: (ev: UIEvent<HTMLDivElement>) => void;
  // handlers
  setDraft: (v: string) => void;
  submit: () => void;
  onKey: (ev: KeyboardEvent<HTMLTextAreaElement>) => void;
  start: (q: string) => void;
  reset: () => void;
}

/**
 * Progressive agent-investigation state machine, ported from the reference
 * (`GIP Console v3.dc.html`). Reveals the scripted timeline one step at a
 * time, fills evidence-domain coverage, transitions the three gates (including
 * a claim REJECT before the final PASS), then streams the verified answer.
 *
 * All timers are cleared on reset, on a new start, and on unmount, so there
 * are no leaked intervals/timeouts.
 */
export function useInvestigation(streamSpeed: number = DEFAULT_STREAM_SPEED): InvestigationView {
  const [question, setQuestion] = useState('');
  const [draft, setDraft] = useState('');
  const [step, setStep] = useState(-1);
  const [answerChars, setAnswerChars] = useState(0);
  const [covered, setCovered] = useState<string[]>([]);
  const [gate1, setGate1] = useState<Tone | null>(null);
  const [gate2, setGate2] = useState<'good' | 'bad' | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Refs mirror the latest values for the recursive timeout chain, which would
  // otherwise close over stale state.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(-1);
  const answerRef = useRef(0);
  const questionRef = useRef('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const streamAnswer = useCallback(() => {
    if (answerRef.current >= ANSWER.length) return;
    timerRef.current = setTimeout(() => {
      answerRef.current = Math.min(ANSWER.length, answerRef.current + ANSWER_CHUNK);
      setAnswerChars(answerRef.current);
      streamAnswer();
    }, ANSWER_TICK_MS);
  }, []);

  const advance = useCallback(() => {
    const speed = Math.max(MIN_STREAM_SPEED, streamSpeed);
    const delay = stepRef.current < 0 ? FIRST_STEP_DELAY : speed;
    timerRef.current = setTimeout(() => {
      const next = stepRef.current + 1;
      if (next >= SCRIPT.length) {
        streamAnswer();
        return;
      }
      stepRef.current = next;
      const e = SCRIPT[next];
      setStep(next);
      if (e.cover) setCovered((prev) => prev.concat(e.cover as string));
      if (e.label === 'GATE 1') setGate1('good');
      if (e.gate2) setGate2(e.gate2);
      advance();
    }, delay);
  }, [streamSpeed, streamAnswer]);

  const start = useCallback(
    (q: string) => {
      clearTimer();
      pinnedRef.current = true;
      stepRef.current = -1;
      answerRef.current = 0;
      questionRef.current = q;
      setQuestion(q);
      setDraft('');
      setStep(-1);
      setAnswerChars(0);
      setCovered([]);
      setGate1(null);
      setGate2(null);
      setElapsed(0);
      advance();
    },
    [advance, clearTimer]
  );

  const reset = useCallback(() => {
    clearTimer();
    stepRef.current = -1;
    answerRef.current = 0;
    questionRef.current = '';
    setQuestion('');
    setStep(-1);
    setAnswerChars(0);
    setCovered([]);
    setGate1(null);
    setGate2(null);
    setElapsed(0);
  }, [clearTimer]);

  const submit = useCallback(() => {
    const q = draft.trim();
    if (q) start(q);
  }, [draft, start]);

  const onKey = useCallback(
    (ev: KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        const q = draft.trim();
        if (q) start(q);
      }
    },
    [draft, start]
  );

  const onScroll = useCallback((ev: UIEvent<HTMLDivElement>) => {
    const el = ev.currentTarget;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  // Elapsed-time ticker: only advances while a run is active.
  useEffect(() => {
    const id = setInterval(() => {
      if (questionRef.current) setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Clear any pending timer on unmount.
  useEffect(() => clearTimer, [clearTimer]);

  // Keep the timeline pinned to the bottom while the user is near it.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [step, answerChars, question]);

  // ---- Derived view model (mirrors the reference `renderVals`) ----
  return useMemo<InvestigationView>(() => {
    const visible = SCRIPT.slice(0, step + 1);
    const finished = step >= SCRIPT.length - 1;
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');

    const timeline: TimelineView[] = visible.map((e, i) => ({
      key: `${e.label}-${i}`,
      kind: e.k,
      label: e.label || '',
      text: e.text,
      detail: e.detail || '',
      meta: e.meta || '',
    }));

    const busy = !!question && (!finished || answerChars < ANSWER.length);
    const busyLabel =
      step < 0
        ? 'Classifying intent…'
        : SCRIPT[step] && SCRIPT[step].k === 'action'
          ? 'Waiting on tool result…'
          : 'Coordinator is thinking…';

    const domains: DomainView[] = DOMAINS.map((d) => ({ name: d, covered: covered.includes(d) }));

    const gates: GateView[] = [
      {
        name: 'Coverage',
        state: covered.length >= 5 ? 'PASS' : 'OPEN',
        tone: covered.length >= 5 ? 'good' : 'neutral',
      },
      { name: 'Structural', state: gate1 ? 'PASS' : 'OPEN', tone: gate1 ? 'good' : 'neutral' },
      {
        name: 'Claim judge',
        state: gate2 === 'good' ? 'PASS' : gate2 === 'bad' ? 'REJECT' : 'OPEN',
        tone: gate2 === 'good' ? 'good' : gate2 === 'bad' ? 'bad' : 'neutral',
      },
    ];

    const iterations = question
      ? `${Math.min(3, Math.max(1, Math.ceil((step + 1) / 6)))}/10`
      : '0/10';
    const budget: BudgetView[] = [
      { value: iterations, label: 'iterations' },
      { value: `${mm}:${ss}`, label: 'elapsed' },
      { value: question ? String(visible.filter((e) => e.k === 'action').length) : '0', label: 'tools' },
      {
        value: question ? `${((18.4 * (step + 1)) / SCRIPT.length).toFixed(1)}k` : '0k',
        label: 'tokens',
      },
    ];

    return {
      question,
      draft,
      idle: !question,
      started: !!question,
      runId: RUN_ID,
      timeline,
      busy,
      busyLabel,
      domains,
      coverageLabel: `${covered.length} / 5 domains`,
      gates,
      budget,
      hasAnswer: finished,
      answerParas: finished ? ANSWER.slice(0, answerChars).split('\n\n') : [],
      answerDone: finished && answerChars >= ANSWER.length,
      claims: CLAIMS.map((c) => ({ ...c, tone: (c.status === 'SUPPORTED' ? 'good' : 'warn') as Tone })),
      observations: visible.filter((e) => e.obs).map((e) => e.obs as Observation),
      scrollRef,
      onScroll,
      setDraft,
      submit,
      onKey,
      start,
      reset,
    };
  }, [question, draft, step, answerChars, covered, gate1, gate2, elapsed, onScroll, submit, onKey, start, reset]);
}

/** Spine colour for a timeline row, keyed by step kind (reference `spineFor`). */
export function spineColor(kind: ScriptStep['k']): string {
  switch (kind) {
    case 'result':
    case 'pass':
      return C.good;
    case 'reject':
      return C.bad;
    case 'blocked':
      return C.warn;
    case 'plan':
      return C.accent;
    default:
      return 'rgba(35,29,40,.14)';
  }
}

/** Tone for a timeline row's label badge, keyed by step kind. */
export function labelTone(kind: ScriptStep['k']): Tone {
  switch (kind) {
    case 'result':
    case 'pass':
      return 'good';
    case 'reject':
      return 'bad';
    case 'blocked':
      return 'warn';
    case 'plan':
      return 'accent';
    default:
      return 'neutral';
  }
}

export const spineStyleFor = (kind: ScriptStep['k']): CSSProperties => ({
  flex: 'none',
  width: '3px',
  background: spineColor(kind),
});
