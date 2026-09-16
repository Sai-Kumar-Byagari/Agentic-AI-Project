import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { COLORS } from '../constants/colors';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { getUTCTimeString } from '../utils/dateUtils';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { kpis, runOutcomes, evidenceSources, attentionQueue, recentRuns, isLoading, error } = useDashboard();
  const [clock, setClock] = useState(getUTCTimeString());

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(getUTCTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <ErrorBoundary>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minHeight: '640px',
          width: '100%',
          minWidth: 0,
          background: COLORS.light,
          color: COLORS.textPrimary,
          fontFamily: "'Public Sans', system-ui, sans-serif",
          fontSize: '14px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
            padding: '0 22px',
            height: '58px',
            background: '#FFFFFF',
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '9px', flex: 'none' }}>
            <span style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '22px', lineHeight: 1, color: COLORS.deep }}>
              GIP
            </span>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.17em', color: COLORS.textTertiary }}>
              Investigation
            </span>
          </span>

          <span style={{ flex: 1 }}></span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11.5px', color: COLORS.textSecondary, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '6px 10px', whiteSpace: 'nowrap', flex: 'none' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: COLORS.primary }}></span>
            payments · prod-eu
          </span>

          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: COLORS.textTertiary, whiteSpace: 'nowrap', flex: 'none' }}>
            {clock}
          </span>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              flex: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`,
              background: 'transparent',
              fontSize: '11.5px',
              color: COLORS.textSecondary,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.avatar && (
              <span
                style={{
                  width: '29px',
                  height: '29px',
                  borderRadius: '9px',
                  background: '#EDE8F0',
                  color: COLORS.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 600,
                }}
              >
                {user.avatar}
              </span>
            )}
            <span>Logout</span>
          </button>
        </header>

        {/* Main Content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '30px 24px 10px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Loading State */}
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textSecondary }}>
                <p>Loading dashboard...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(169, 80, 60, 0.1)',
                  border: `1px solid rgba(169, 80, 60, 0.3)`,
                  borderRadius: '8px',
                  color: '#A9503C',
                }}
              >
                <p>Error loading dashboard: {error}</p>
              </div>
            )}

            {/* KPI Cards */}
            {!isLoading && (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {kpis.map((kpi) => (
                    <div
                      key={kpi.id}
                      style={{
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 1px 2px rgba(24, 28, 64, .04)',
                        padding: '18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
                        <span
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '9px',
                            background: kpi.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '12px',
                            fontWeight: 500,
                            color: kpi.fg,
                            flex: 'none',
                          }}
                        >
                          {kpi.id.charAt(0).toUpperCase()}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: COLORS.textSecondary }}>
                          {kpi.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {kpi.value}
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '6px', color: kpi.deltaFg, fontWeight: 600 }}>
                        {kpi.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Run Outcomes Chart */}
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: '0 1px 2px rgba(24, 28, 64, .04)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '16px 20px',
                      borderBottom: `1px solid #F1F3FB`,
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                      Run outcomes · last 7 days
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: COLORS.textSecondary }}>
                      482 runs
                    </span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '168px' }}>
                      {runOutcomes.map((bar, idx) => (
                        <div key={idx} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              gap: '2px',
                              height: '140px',
                            }}
                          >
                            <div
                              style={{
                                height: bar.withheld,
                                borderRadius: '4px 4px 0 0',
                                background: '#FBBFC8',
                              }}
                            ></div>
                            <div
                              style={{
                                height: bar.verified,
                                borderRadius: '0 0 4px 4px',
                                background: COLORS.primary,
                              }}
                            ></div>
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10.5px', color: COLORS.textSecondary }}>
                            {bar.day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evidence Sources */}
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: `1px solid ${COLORS.border}`,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '16px 20px', borderBottom: `1px solid #F1F3FB` }}>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>Evidence sources</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: COLORS.textSecondary }}>
                      {evidenceSources.length} connected
                    </span>
                  </div>
                  <div style={{ padding: '6px 20px 14px' }}>
                    {evidenceSources.map((source) => (
                      <div key={source.id} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '12px 0', borderBottom: `1px solid #F5F6FC` }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '999px', flex: 'none', background: source.dot }}></span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12.5px' }}>{source.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: source.fg }}>
                          {source.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attention Queue */}
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: `1px solid ${COLORS.border}`,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '16px 20px', borderBottom: `1px solid #F1F3FB` }}>
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>Attention queue</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12.5px', color: COLORS.textSecondary }}>
                      ordered by what blocks a person, not by time
                    </span>
                  </div>
                  {attentionQueue.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '112px minmax(0,1fr) 150px 120px',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '14px 20px',
                        borderBottom: `1px solid #F5F6FC`,
                        cursor: 'pointer',
                      }}
                    >
                      <span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: item.state_badge.bg,
                            color: item.state_badge.fg,
                            fontSize: '11.5px',
                            fontWeight: 700,
                          }}
                        >
                          {item.state}
                        </span>
                      </span>
                      <span style={{ fontSize: '13.5px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.question}
                      </span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: COLORS.textSecondary }}>
                        {item.who}
                      </span>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '12px',
                          color: COLORS.textSecondary,
                          textAlign: 'right',
                        }}
                      >
                        {item.age}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recent Runs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                  {recentRuns.map((run) => (
                    <div
                      key={run.id}
                      style={{
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        border: `1px solid ${COLORS.border}`,
                        padding: '18px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: run.bg,
                            color: run.fg,
                            fontSize: '11.5px',
                            fontWeight: 700,
                          }}
                        >
                          {run.outcome}
                        </span>
                        <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: COLORS.textSecondary }}>
                          {run.id}
                        </span>
                      </div>
                      <div style={{ fontSize: '13.5px', lineHeight: 1.5, marginBottom: '8px' }}>
                        {run.question}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>
                        {run.service} · {run.coverage} · {run.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
