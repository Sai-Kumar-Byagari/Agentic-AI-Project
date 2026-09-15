import React from 'react';
import { COLORS } from '../../constants/colors';

export default function AuditScreen() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '30px 24px 10px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            Audit Log
          </span>
          <span
            style={{
              fontSize: '14.5px',
              lineHeight: '1.7',
              color: COLORS.textSecondary,
              maxWidth: '560px',
            }}
          >
            Complete audit trail of all investigation actions and configuration changes.
          </span>
        </div>

        {/* Audit Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {[
            {
              id: 'audit_1',
              action: 'Investigation Started',
              actor: 'alice@bank.example',
              timestamp: '2026-09-16 14:22:00 UTC',
              outcome: 'success',
            },
            {
              id: 'audit_2',
              action: 'Settings Updated',
              actor: 'bob@bank.example',
              timestamp: '2026-09-16 13:45:00 UTC',
              outcome: 'success',
            },
            {
              id: 'audit_3',
              action: 'Integration Failed',
              actor: 'system',
              timestamp: '2026-09-16 12:30:00 UTC',
              outcome: 'error',
            },
            {
              id: 'audit_4',
              action: 'Configuration Exported',
              actor: 'carol@bank.example',
              timestamp: '2026-09-16 11:15:00 UTC',
              outcome: 'success',
            },
          ].map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0',
                background: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {/* Spine */}
              <span
                style={{
                  width: '3px',
                  background:
                    entry.outcome === 'success'
                      ? COLORS.success
                      : entry.outcome === 'error'
                        ? COLORS.danger
                        : COLORS.warning,
                  flex: 'none',
                }}
              ></span>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'space-between',
                  minWidth: 0,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {entry.action}
                  </span>
                  <span style={{ fontSize: '12px', color: COLORS.textSecondary }}>
                    By {entry.actor}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    color: COLORS.textTertiary,
                    flex: 'none',
                  }}
                >
                  {entry.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
