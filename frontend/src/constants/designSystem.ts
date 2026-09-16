import type { CSSProperties } from 'react';
import { css } from '../utils/css';

/**
 * Design tokens and style helpers ported verbatim from the GIP Console v3
 * reference (`primary/GIP Console v3.dc.html`). These are the single source
 * of truth for badges, tones, and meters across every authenticated screen.
 */

// Core palette (matches the reference `C` object exactly).
export const C = {
  accent: '#5A4270',
  deep: '#33253C',
  good: '#3F7A52',
  warn: '#9A6C14',
  bad: '#A9503C',
} as const;

export const MONO = "font-family:'IBM Plex Mono',monospace;";

export type Tone = 'good' | 'bad' | 'warn' | 'accent' | 'neutral';

const badge = (fg: string, bg: string, bd: string): string =>
  `${MONO} display:inline-flex; align-items:center; font-size:9.5px; letter-spacing:.07em; ` +
  `padding:4px 8px; border-radius:6px; color:${fg}; background:${bg}; border:1px solid ${bd}; ` +
  `white-space:nowrap; flex:none;`;

/** Raw tone style string (reference `tone(k)`). */
export const toneString = (k: Tone): string => {
  switch (k) {
    case 'good':
      return badge(C.good, 'rgba(63,122,82,.08)', 'rgba(63,122,82,.28)');
    case 'bad':
      return badge(C.bad, 'rgba(169,80,60,.08)', 'rgba(169,80,60,.28)');
    case 'warn':
      return badge(C.warn, 'rgba(154,108,20,.08)', 'rgba(154,108,20,.28)');
    case 'accent':
      return badge(C.accent, 'rgba(90,66,112,.08)', 'rgba(90,66,112,.28)');
    default:
      return badge('#6B6473', 'rgba(35,29,40,.04)', 'rgba(35,29,40,.12)');
  }
};

/** Tone badge as a React style object. */
export const toneStyle = (k: Tone): CSSProperties => css(toneString(k));

/** Solid tone colour, used for spines and status dots (reference inline ternary). */
export const toneColor = (k: Tone): string => {
  switch (k) {
    case 'good':
      return C.good;
    case 'warn':
      return C.warn;
    case 'bad':
      return C.bad;
    case 'accent':
      return C.accent;
    default:
      return 'rgba(35,29,40,.14)';
  }
};

const meterTrack =
  'display:inline-block; width:62px; height:4px; border-radius:3px; ' +
  'background:rgba(35,29,40,.10); overflow:hidden; flex:none;';

export const meterTrackStyle: CSSProperties = css(meterTrack);

export const meterFillStyle = (pct: number, color: string): CSSProperties =>
  css(`display:block; width:${pct}%; height:100%; border-radius:3px; background:${color};`);

/** The five evidence domains a run must cover before an answer is released. */
export const DOMAINS = ['metrics', 'logs', 'traces', 'deploys', 'code'] as const;
export type Domain = (typeof DOMAINS)[number];
