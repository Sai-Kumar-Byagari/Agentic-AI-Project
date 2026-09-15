import React from 'react';
import { COLORS } from '../../constants/colors';

export default function MemoryScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '30px 24px 10px' }}>
      <div style={{ maxWidth: '940px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          <span
            style={{
              fontFamily: "'Spectral', Georgia, serif",
              fontSize: 'clamp(28px, 3.4vw, 40px)',
              fontWeight: 300,
              lineHeight: '1.18',
              color: COLORS.textPrimary,
            }}
          >
            Investigation Memory
          </span>
          <span
            style={{
              fontSize: '14.5px',
              lineHeight: '1.7',
              color: COLORS.textSecondary,
              maxWidth: '560px',
            }}
          >
            View historical investigation episodes and memory statistics to improve investigation quality.
          </span>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Total Episodes', value: '237' },
            { label: 'Avg Citation Rate', value: '87%' },
            { label: 'Memory Utilization', value: '156 GB' },
            { label: 'Last Updated', value: '5m ago' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '12px', color: COLORS.textSecondary, textTransform: 'uppercase' }}>
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: COLORS.primary,
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Episodes List (skeleton) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              color: COLORS.textSecondary,
            }}
          >
            Recent Episodes
          </span>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  height: '20px',
                  background: 'linear-gradient(90deg, rgba(35,29,40,.1) 0%, rgba(35,29,40,.05) 50%, rgba(35,29,40,.1) 100%)',
                  borderRadius: '4px',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              ></div>
              <div
                style={{
                  height: '14px',
                  background: 'linear-gradient(90deg, rgba(35,29,40,.1) 0%, rgba(35,29,40,.05) 50%, rgba(35,29,40,.1) 100%)',
                  borderRadius: '4px',
                  animation: 'pulse 2s ease-in-out infinite',
                  width: '70%',
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
