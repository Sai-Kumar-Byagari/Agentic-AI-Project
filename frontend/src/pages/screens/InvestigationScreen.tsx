import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';
import { TimelineItem } from '../../components/investigation/TimelineItem';
import {
  mockInvestigationSuggestions,
  mockInvestigationTimeline,
  mockInvestigationAnswer,
} from '../../constants/mockData';
import { selectInvestigation, setInvestigationState, startInvestigation, setTimeline } from '../../redux/slices/appSlice';
import { RootState } from '../../redux/store';

export default function InvestigationScreen() {
  const dispatch = useDispatch();
  const investigation = useSelector((state: RootState) => selectInvestigation(state));
  const [busy, setBusy] = useState(false);

  // Simulate investigation flow with delays
  const handleStartInvestigation = (question: string) => {
    const runId = `run_${Math.random().toString(36).substr(2, 9)}`;

    // Start investigation
    dispatch(
      startInvestigation({
        question,
        runId,
      })
    );

    // Set as busy for a delay
    setBusy(true);

    // Simulate gathering evidence with timeline events
    setTimeout(() => {
      dispatch(
        setInvestigationState({
          timeline: mockInvestigationTimeline.map((e) => ({
            ...e,
            rowStyle: '',
            spineStyle: '',
            labelStyle: '',
            detailStyle: '',
          })),
          busy: false,
          busyLabel: '',
        })
      );
      setBusy(false);
    }, 2500);
  };

  // Idle State: Show prompt and suggestions
  if (investigation.idle) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '30px 24px 10px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Coverage bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px 20px',
              padding: '11px 22px',
              background: '#FBFAFC',
              borderBottom: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px', flex: 'none' }}>
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '.14em',
                  color: COLORS.textTertiary,
                }}
              >
                Coverage
              </span>
              <span style={{ display: 'flex', gap: '3px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: COLORS.success,
                    title: 'Prometheus',
                  }}
                ></span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: COLORS.success,
                    title: 'Logs',
                  }}
                ></span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: COLORS.success,
                    title: 'Traces',
                  }}
                ></span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: COLORS.success,
                    title: 'Deploys',
                  }}
                ></span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: COLORS.danger,
                    title: 'Code',
                  }}
                ></span>
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#4A4351',
                }}
              >
                4 of 5 sources operational
              </span>
            </span>

            <span style={{ flex: 1 }}></span>

            <span style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    color: COLORS.deep,
                  }}
                >
                  127
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                    color: COLORS.textTertiary,
                  }}
                >
                  Runs this week
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    color: COLORS.success,
                  }}
                >
                  84%
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                    color: COLORS.textTertiary,
                  }}
                >
                  Verified
                </span>
              </span>
            </span>
          </div>

          {/* Idle state content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', padding: '34px 0 0' }}>
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
                What would you like investigated?
              </span>
              <span
                style={{
                  fontSize: '14.5px',
                  lineHeight: '1.7',
                  color: COLORS.textSecondary,
                  maxWidth: '560px',
                }}
              >
                Name a service and a time window. The run gathers evidence across metrics, logs, traces, deploys and
                code before any answer is released.
              </span>
            </div>

            {/* Quick start suggestions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '.15em',
                  color: COLORS.textTertiary,
                }}
              >
                Start from a recent question
              </span>
              {mockInvestigationSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStartInvestigation(s.text)}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '8px 13px',
                    minWidth: 0,
                    textAlign: 'left',
                    background: '#FFFFFF',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    padding: '15px 17px',
                    color: '#33383C',
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(90,66,112,.45)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 22px -16px rgba(35,29,40,.35)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.border;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '.07em',
                      color: COLORS.primary,
                      background: 'rgba(90,66,112,.08)',
                      borderRadius: '5px',
                      padding: '3px 7px',
                      flex: 'none',
                    }}
                  >
                    {s.tag}
                  </span>
                  <span style={{ flex: 1, minWidth: '180px', color: COLORS.textPrimary }}>
                    {s.text}
                  </span>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10.5px',
                      color: COLORS.textTertiary,
                      flex: 'none',
                    }}
                  >
                    {s.meta}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Started State: Show timeline of events
  if (investigation.started) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '30px 24px 10px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '9px',
              background: '#FFFFFF',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <span
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontSize: '21px',
                fontWeight: 400,
                lineHeight: '1.4',
                color: COLORS.textPrimary,
              }}
            >
              {investigation.question}
            </span>
            <span
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 12px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10.5px',
                color: COLORS.textTertiary,
              }}
            >
              <span>run {investigation.runId}</span>
              <span>intent ROOT_CAUSE</span>
              <span>space payments</span>
              <span>trigger CHAT</span>
            </span>
          </div>

          {/* Timeline events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {investigation.timeline.map((e) => (
              <TimelineItem
                key={e.id}
                id={e.id}
                label={e.label}
                text={e.text}
                meta={e.meta}
                detail={e.detail}
              />
            ))}

            {/* Busy indicator */}
            {busy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 4px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: COLORS.primary,
                    animation: 'pulse 1.1s ease-in-out infinite',
                  }}
                ></span>
                <span
                  style={{
                    fontSize: '12.5px',
                    color: COLORS.textSecondary,
                  }}
                >
                  Gathering evidence...
                </span>
              </div>
            )}
          </div>

          {/* Answer section - shown after timeline loads */}
          {!busy && investigation.answer && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: '#FFFFFF',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: "'Spectral', Georgia, serif",
                    fontSize: '18px',
                    fontWeight: 400,
                    color: COLORS.textPrimary,
                  }}
                >
                  Answer
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                    color: investigation.answer.verdict === 'verified' ? COLORS.success : COLORS.danger,
                  }}
                >
                  {investigation.answer.verdict}
                </span>
              </div>

              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: '1.7',
                  color: COLORS.textPrimary,
                  margin: 0,
                }}
              >
                {investigation.answer.text}
              </p>

              {/* Claims */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                    color: COLORS.textSecondary,
                  }}
                >
                  Supporting Claims
                </span>
                {investigation.answer.claims.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px',
                      background: 'rgba(35,29,40,.04)',
                      borderRadius: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        color: c.verdict === 'verified' ? COLORS.success : COLORS.danger,
                        flex: 'none',
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: '12px', color: COLORS.textPrimary, flex: 1 }}>
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
