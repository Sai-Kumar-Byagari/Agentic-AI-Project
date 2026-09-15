import React from 'react';
import { COLORS } from '../../constants/colors';

export default function IntegrationsScreen() {
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
            Integrations
          </span>
          <span
            style={{
              fontSize: '14.5px',
              lineHeight: '1.7',
              color: COLORS.textSecondary,
              maxWidth: '560px',
            }}
          >
            Manage MCP servers and evidence source integrations for investigation workflows.
          </span>
        </div>

        {/* Servers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { name: 'Prometheus', status: 'healthy', latency: '12ms', requests: '1.2M' },
            { name: 'Grafana', status: 'healthy', latency: '34ms', requests: '856K' },
            { name: 'Datadog', status: 'degraded', latency: '127ms', requests: '342K' },
            { name: 'Jaeger', status: 'healthy', latency: '45ms', requests: '567K' },
            { name: 'Loki', status: 'healthy', latency: '18ms', requests: '2.1M' },
            { name: 'ElasticSearch', status: 'healthy', latency: '56ms', requests: '789K' },
          ].map((server) => (
            <div
              key={server.name}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                  {server.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: server.status === 'healthy' ? COLORS.success : COLORS.warning,
                  }}
                >
                  {server.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: COLORS.textSecondary, display: 'flex', gap: '16px' }}>
                <span>Latency: {server.latency}</span>
                <span>Requests: {server.requests}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
