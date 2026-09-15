import React, { useState } from 'react';
import { COLORS } from '../../constants/colors';

interface TimelineItemProps {
  id: string;
  label: string;
  text: string;
  meta: string;
  detail?: string;
  spineColor?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  id,
  label,
  text,
  meta,
  detail,
  spineColor = COLORS.primary,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0',
        background: '#FFFFFF',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        padding: '0',
        marginBottom: '9px',
        overflow: 'hidden',
      }}
    >
      {/* Spine (left colored bar) */}
      <span
        style={{
          width: '3px',
          height: '100%',
          background: spineColor,
          flex: 'none',
          minHeight: '100px',
        }}
      ></span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '7px', padding: '13px 16px' }}>
        {/* Header row with label, text, and meta */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '7px 11px',
            minWidth: 0,
          }}
        >
          {/* Label Badge */}
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '.07em',
              color: '#FFFFFF',
              background: spineColor,
              borderRadius: '5px',
              padding: '3px 7px',
              flex: 'none',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>

          {/* Main text */}
          <span
            style={{
              flex: '1',
              minWidth: '170px',
              fontSize: '13.5px',
              lineHeight: '1.55',
              color: '#33383C',
            }}
          >
            {text}
          </span>

          {/* Meta (time) */}
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#9A93A0',
              flex: 'none',
            }}
          >
            {meta}
          </span>
        </div>

        {/* Detail section (expandable) */}
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'transparent',
                border: 'none',
                color: spineColor,
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '0',
                textAlign: 'left',
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              {expanded ? '▼ Hide details' : '▶ Show details'}
            </button>

            {expanded && (
              <div
                style={{
                  fontSize: '12.5px',
                  color: COLORS.textSecondary,
                  lineHeight: '1.6',
                  background: 'rgba(35,29,40,.04)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  borderLeft: `2px solid ${spineColor}`,
                }}
              >
                {detail}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
