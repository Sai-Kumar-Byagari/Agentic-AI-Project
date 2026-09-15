import React from 'react';
import { COLORS } from '../../constants/colors';

export default function RunsScreen() {
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
            Investigation Runs
          </span>
          <span
            style={{
              fontSize: '14.5px',
              lineHeight: '1.7',
              color: COLORS.textSecondary,
              maxWidth: '560px',
            }}
          >
            View all investigation runs, their status, coverage, and verification outcomes.
          </span>
        </div>

        {/* Filters (skeleton) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '12px 16px',
            background: '#FBFAFC',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            style={{
              padding: '6px 12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              background: '#FFFFFF',
              color: COLORS.textSecondary,
              fontSize: '12px',
              fontFamily: "'Public Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            Status
          </button>
          <button
            type="button"
            style={{
              padding: '6px 12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              background: '#FFFFFF',
              color: COLORS.textSecondary,
              fontSize: '12px',
              fontFamily: "'Public Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            Service
          </button>
          <button
            type="button"
            style={{
              padding: '6px 12px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              background: '#FFFFFF',
              color: COLORS.textSecondary,
              fontSize: '12px',
              fontFamily: "'Public Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            Date Range
          </button>
        </div>

        {/* Grid (skeleton loading state) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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
                  width: '80%',
                }}
              ></div>
              <div
                style={{
                  height: '14px',
                  background: 'linear-gradient(90deg, rgba(35,29,40,.1) 0%, rgba(35,29,40,.05) 50%, rgba(35,29,40,.1) 100%)',
                  borderRadius: '4px',
                  animation: 'pulse 2s ease-in-out infinite',
                  width: '60%',
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
