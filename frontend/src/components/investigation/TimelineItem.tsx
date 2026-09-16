import React from 'react';
import { css } from '../../utils/css';
import { toneStyle } from '../../constants/designSystem';
import { labelTone, spineStyleFor, type TimelineView } from '../../hooks/useInvestigation';

const ROW_STYLE = css(
  'display:flex; min-width:0; background:#FFFFFF; border:1px solid rgba(35,29,40,.10); ' +
    'border-radius:12px; overflow:hidden; animation:v3rise .26s ease-out both;'
);

const BODY_STYLE = css(
  'flex:1; min-width:0; display:flex; flex-direction:column; gap:7px; padding:13px 16px;'
);

const HEAD_STYLE = css('display:flex; flex-wrap:wrap; align-items:center; gap:7px 11px; min-width:0;');

const TEXT_STYLE = css('flex:1; min-width:170px; font-size:13.5px; line-height:1.55; color:#33383C;');

const META_STYLE = css(
  "font-family:'IBM Plex Mono',monospace; font-size:10px; color:#9A93A0; flex:none;"
);

const DETAIL_STYLE = css(
  "font-family:'IBM Plex Mono',monospace; font-size:11px; line-height:1.6; color:#6B6473; " +
    'background:#FBFAFC; border:1px solid rgba(35,29,40,.08); border-radius:8px; padding:9px 11px; ' +
    'white-space:pre-wrap; word-break:break-word;'
);

/**
 * A single investigation timeline row (reference row markup). Presentational:
 * the colour of the spine and the label badge are derived from the step kind.
 */
export const TimelineRow: React.FC<{ event: TimelineView }> = ({ event }) => (
  <div style={ROW_STYLE}>
    <span style={spineStyleFor(event.kind)}></span>
    <div style={BODY_STYLE}>
      <div style={HEAD_STYLE}>
        {event.label ? <span style={toneStyle(labelTone(event.kind))}>{event.label}</span> : null}
        <span style={TEXT_STYLE}>{event.text}</span>
        {event.meta ? <span style={META_STYLE}>{event.meta}</span> : null}
      </div>
      {event.detail ? <div style={DETAIL_STYLE}>{event.detail}</div> : null}
    </div>
  </div>
);
