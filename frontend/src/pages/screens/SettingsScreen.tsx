import React from 'react';
import { COLORS } from '../../constants/colors';

export default function SettingsScreen() {
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
            Settings
          </span>
          <span
            style={{
              fontSize: '14.5px',
              lineHeight: '1.7',
              color: COLORS.textSecondary,
              maxWidth: '560px',
            }}
          >
            Configure investigation behavior, timeouts, and defaults.
          </span>
        </div>

        {/* Settings Groups */}
        {[
          { group: 'Investigation', settings: ['Timeout', 'Parallelism', 'Evidence Depth'] },
          { group: 'Evidence Sources', settings: ['Query Limit', 'Cache TTL', 'Sampling Rate'] },
          { group: 'Output', settings: ['Format', 'Verbosity', 'Citation Style'] },
        ].map((group) => (
          <div
            key={group.group}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Group Header */}
            <div
              style={{
                padding: '14px 16px',
                background: '#FBFAFC',
                borderBottom: `1px solid ${COLORS.border}`,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              {group.group}
            </div>

            {/* Settings */}
            {group.settings.map((setting, idx) => (
              <div
                key={setting}
                style={{
                  padding: '14px 16px',
                  borderBottom: idx < group.settings.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <span style={{ color: COLORS.textPrimary }}>{setting}</span>
                <input
                  type="text"
                  placeholder="Value"
                  style={{
                    padding: '6px 10px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: "'Public Sans', sans-serif",
                    width: '200px',
                  }}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Save Button */}
        <button
          type="button"
          style={{
            padding: '12px 20px',
            background: COLORS.primary,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            fontFamily: "'Public Sans', sans-serif",
            fontSize: '13px',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
