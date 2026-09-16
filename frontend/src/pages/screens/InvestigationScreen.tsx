import { useDispatch } from 'react-redux';
import { css } from '../../utils/css';
import { C, toneStyle } from '../../constants/designSystem';
import { consoleService } from '../../services/consoleService';
import { useInvestigation } from '../../hooks/useInvestigation';
import { TimelineRow } from '../../components/investigation/TimelineItem';
import { HoverButton } from '../../components/common/HoverButton';
import { setActiveTab } from '../../redux/slices/appSlice';

const SUGGESTIONS = consoleService.getSuggestions();

// --- Static style objects (ported verbatim from the reference) ---
const ROOT = css('flex:1; min-height:0; display:flex; flex-direction:column;');

const SUBHEAD = css(
  'flex:none; display:flex; flex-wrap:wrap; align-items:center; gap:10px 20px; padding:11px 22px; ' +
    'background:#FBFAFC; border-bottom:1px solid rgba(35,29,40,.09);'
);
const SUBHEAD_COVERAGE = css('display:flex; align-items:center; gap:7px; flex:none;');
const LABEL_CAP = css('font-size:10px; text-transform:uppercase; letter-spacing:.14em; color:#8B8391;');
const SEG_ROW = css('display:flex; gap:3px;');
const COVERAGE_LABEL = css("font-family:'IBM Plex Mono',monospace; font-size:11px; color:#4A4351;");
const GATES_WRAP = css('display:flex; align-items:center; gap:7px; flex-wrap:wrap;');
const BUDGET_WRAP = css('display:flex; align-items:center; gap:16px; flex-wrap:wrap;');
const BUDGET_ITEM = css('display:flex; align-items:baseline; gap:6px;');
const BUDGET_VALUE = css("font-family:'IBM Plex Mono',monospace; font-size:12px; color:#33253C;");
const BUDGET_LABEL = css('font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:#8B8391;');
const FLEX1 = css('flex:1;');

const SCROLL = css('flex:1; min-height:0; overflow-y:auto; padding:30px 24px 10px;');
const COLUMN = css('max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:20px;');

const IDLE_WRAP = css('display:flex; flex-direction:column; gap:26px; padding:34px 0 0;');
const IDLE_HEAD = css('display:flex; flex-direction:column; gap:13px;');
const IDLE_TITLE = css(
  "font-family:'Spectral',Georgia,serif; font-size:clamp(28px,3.4vw,40px); font-weight:300; " +
    'line-height:1.18; color:#241E29; text-wrap:pretty;'
);
const IDLE_SUB = css(
  'font-size:14.5px; line-height:1.7; color:#6B6473; max-width:560px; text-wrap:pretty;'
);
const IDLE_SUGG_WRAP = css('display:flex; flex-direction:column; gap:9px;');
const SECTION_CAP = css('font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:#8B8391;');

const SUGG_BTN = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:8px 13px; min-width:0; text-align:left; ' +
    "background:#FFFFFF; border:1px solid rgba(35,29,40,.11); border-radius:12px; padding:15px 17px; " +
    "color:#33383C; font-family:'Public Sans',sans-serif; font-size:13.5px; cursor:pointer;"
);
const SUGG_BTN_HOVER = css(
  'border-color:rgba(90,66,112,.45); box-shadow:0 8px 22px -16px rgba(35,29,40,.35);'
);
const SUGG_TAG = css(
  "font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.07em; color:#5A4270; " +
    'background:rgba(90,66,112,.08); border-radius:5px; padding:3px 7px; flex:none;'
);
const SUGG_TEXT = css('flex:1; min-width:180px; color:#241E29;');
const SUGG_META = css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#8B8391; flex:none;");

const STARTED_WRAP = css('display:flex; flex-direction:column; gap:18px;');
const QUESTION_CARD = css(
  'display:flex; flex-direction:column; gap:9px; background:#FFFFFF; ' +
    'border:1px solid rgba(35,29,40,.11); border-radius:14px; padding:18px 20px;'
);
const QUESTION_TEXT = css(
  "font-family:'Spectral',Georgia,serif; font-size:21px; font-weight:400; line-height:1.4; " +
    'color:#241E29; text-wrap:pretty;'
);
const QUESTION_META = css(
  'display:flex; flex-wrap:wrap; gap:6px 12px; ' +
    "font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#8B8391;"
);
const TIMELINE_WRAP = css('display:flex; flex-direction:column; gap:9px;');
const BUSY_ROW = css('display:flex; align-items:center; gap:10px; padding:10px 4px;');
const BUSY_DOT = css(
  'width:7px; height:7px; border-radius:50%; background:#5A4270; animation:v3pulse 1.1s ease-in-out infinite;'
);
const BUSY_LABEL = css('font-size:12.5px; color:#6B6473;');

const ANSWER_CARD = css(
  'border:1px solid rgba(35,29,40,.12); border-radius:16px; background:#FFFFFF; overflow:hidden; ' +
    'box-shadow:0 18px 44px -32px rgba(35,29,40,.4);'
);
const ANSWER_HEAD = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:9px 13px; min-width:0; padding:15px 20px; ' +
    'background:#FBFAFC; border-bottom:1px solid rgba(35,29,40,.09);'
);
const VERIFIED_BADGE = css(
  'font-size:10.5px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#3F7A52; ' +
    'background:rgba(63,122,82,.09); border:1px solid rgba(63,122,82,.28); border-radius:999px; padding:4px 11px;'
);
const CONFIDENCE = css('font-size:12px; color:#6B6473;');
const CONFIDENCE_VAL = css("font-family:'IBM Plex Mono',monospace; color:#241E29;");
const ANSWER_STAT = css("font-family:'IBM Plex Mono',monospace; font-size:10px; color:#9A93A0;");
const ANSWER_BODY = css('padding:22px 22px 6px; display:flex; flex-direction:column; gap:14px;');
const ANSWER_PARA = css(
  "font-family:'Spectral',Georgia,serif; font-size:16px; font-weight:400; line-height:1.72; " +
    'color:#2C2631; text-wrap:pretty;'
);

const CLAIMS_WRAP = css('display:flex; flex-direction:column; gap:2px; padding:16px 22px 6px;');
const CLAIMS_CAP = css(
  'font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:#8B8391; padding-bottom:6px;'
);
const CLAIM_ROW = css(
  'display:flex; flex-wrap:wrap; align-items:flex-start; gap:7px 12px; min-width:0; padding:10px 0; ' +
    'border-top:1px solid rgba(35,29,40,.08);'
);
const CLAIM_TEXT = css('flex:1; min-width:170px; font-size:13px; line-height:1.55; color:#4A4351;');
const CLAIM_CITE = css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#9A93A0; flex:none;");

const EVID_WRAP = css('display:flex; flex-direction:column; gap:9px; padding:14px 22px 18px;');
const EVID_GRID = css('display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:9px;');
const EVID_CARD = css(
  'border:1px solid rgba(35,29,40,.10); border-radius:10px; padding:11px 12px; display:flex; ' +
    'flex-direction:column; gap:5px; background:#FBFAFC; min-width:0;'
);
const EVID_IDROW = css("display:flex; flex-wrap:wrap; gap:4px 8px; font-family:'IBM Plex Mono',monospace; font-size:10px;");
const EVID_ID = css('color:#5A4270;');
const EVID_TOOL = css('color:#9A93A0;');
const EVID_SUMMARY = css('font-size:12px; line-height:1.5; color:#4A4351;');

const ACTIONS = css(
  'display:flex; flex-wrap:wrap; gap:9px; min-width:0; padding:14px 22px; ' +
    'border-top:1px solid rgba(35,29,40,.09); background:#FBFAFC;'
);
const BTN_PRIMARY = css(
  "background:#5A4270; border:none; border-radius:9px; padding:10px 16px; font-family:'Public Sans',sans-serif; " +
    'font-size:12.5px; font-weight:600; color:#FFFFFF; cursor:pointer;'
);
const BTN_PRIMARY_HOVER = css('background:#4A3560;');
const BTN_SECONDARY = css(
  "background:#FFFFFF; border:1px solid rgba(35,29,40,.14); border-radius:9px; padding:10px 16px; " +
    "font-family:'Public Sans',sans-serif; font-size:12.5px; color:#33383C; cursor:pointer;"
);
const BTN_SECONDARY_HOVER = css('border-color:rgba(35,29,40,.30);');
const BTN_GHOST = css(
  "background:transparent; border:none; padding:10px 4px; font-family:'Public Sans',sans-serif; " +
    'font-size:12.5px; color:#8B8391; cursor:pointer;'
);
const BTN_GHOST_HOVER = css('color:#33253C;');

const COMPOSER_WRAP = css(
  'flex:none; padding:12px 24px 22px; ' +
    'background:linear-gradient(180deg, rgba(245,242,244,0) 0%, #F5F2F4 45%);'
);
const COMPOSER_INNER = css('max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:8px;');
const COMPOSER_BOX = css(
  'display:flex; align-items:flex-end; gap:10px; min-width:0; background:#FFFFFF; ' +
    'border:1px solid rgba(35,29,40,.13); border-radius:13px; padding:10px 10px 10px 16px; ' +
    'box-shadow:0 10px 30px -24px rgba(35,29,40,.5);'
);
const TEXTAREA = css(
  "flex:1; min-width:0; resize:none; background:transparent; border:none; outline:none; color:#241E29; " +
    "font-family:'Public Sans',sans-serif; font-size:14px; line-height:1.6; padding:6px 0; max-height:120px;"
);
const COMPOSER_BTN = css(
  "flex:none; background:#5A4270; border:none; border-radius:9px; padding:10px 17px; " +
    "font-family:'Public Sans',sans-serif; font-size:12.5px; font-weight:600; color:#FFFFFF; cursor:pointer;"
);
const COMPOSER_BTN_HOVER = css('background:#4A3560;');
const COMPOSER_HELP = css('font-size:11px; color:#8B8391; line-height:1.55;');

export default function InvestigationScreen() {
  const dispatch = useDispatch();
  const inv = useInvestigation();
  const openRuns = () => dispatch(setActiveTab('runs'));

  return (
    <div style={ROOT}>
      {/* Coverage / gates / budget sub-header */}
      <div style={SUBHEAD}>
        <span style={SUBHEAD_COVERAGE}>
          <span style={LABEL_CAP}>Coverage</span>
          <span style={SEG_ROW}>
            {inv.domains.map((d) => (
              <span
                key={d.name}
                title={d.name}
                style={{
                  width: '26px',
                  height: '5px',
                  borderRadius: '3px',
                  background: d.covered ? C.good : 'rgba(35,29,40,.13)',
                }}
              ></span>
            ))}
          </span>
          <span style={COVERAGE_LABEL}>{inv.coverageLabel}</span>
        </span>

        <span style={GATES_WRAP}>
          {inv.gates.map((g) => (
            <span key={g.name} style={toneStyle(g.tone)}>
              {g.name} · {g.state}
            </span>
          ))}
        </span>

        <span style={FLEX1}></span>
        <span style={BUDGET_WRAP}>
          {inv.budget.map((b) => (
            <span key={b.label} style={BUDGET_ITEM}>
              <span style={BUDGET_VALUE}>{b.value}</span>
              <span style={BUDGET_LABEL}>{b.label}</span>
            </span>
          ))}
        </span>
      </div>

      {/* Scrollable investigation area */}
      <div ref={inv.scrollRef} onScroll={inv.onScroll} style={SCROLL}>
        <div style={COLUMN}>
          {inv.idle && (
            <div style={IDLE_WRAP}>
              <div style={IDLE_HEAD}>
                <span style={IDLE_TITLE}>What would you like investigated?</span>
                <span style={IDLE_SUB}>
                  Name a service and a time window. The run gathers evidence across metrics, logs, traces,
                  deploys and code before any answer is released.
                </span>
              </div>
              <div style={IDLE_SUGG_WRAP}>
                <span style={SECTION_CAP}>Start from a recent question</span>
                {SUGGESTIONS.map((s) => (
                  <HoverButton
                    key={s.text}
                    type="button"
                    onClick={() => inv.start(s.text)}
                    baseStyle={SUGG_BTN}
                    hoverStyle={SUGG_BTN_HOVER}
                  >
                    <span style={SUGG_TAG}>{s.tag}</span>
                    <span style={SUGG_TEXT}>{s.text}</span>
                    <span style={SUGG_META}>{s.meta}</span>
                  </HoverButton>
                ))}
              </div>
            </div>
          )}

          {inv.started && (
            <div style={STARTED_WRAP}>
              <div style={QUESTION_CARD}>
                <span style={QUESTION_TEXT}>{inv.question}</span>
                <span style={QUESTION_META}>
                  <span>run {inv.runId}</span>
                  <span>intent ROOT_CAUSE</span>
                  <span>space payments</span>
                  <span>trigger CHAT</span>
                </span>
              </div>

              <div style={TIMELINE_WRAP}>
                {inv.timeline.map((e) => (
                  <TimelineRow key={e.key} event={e} />
                ))}
                {inv.busy && (
                  <div style={BUSY_ROW}>
                    <span style={BUSY_DOT}></span>
                    <span style={BUSY_LABEL}>{inv.busyLabel}</span>
                  </div>
                )}
              </div>

              {inv.hasAnswer && (
                <div style={ANSWER_CARD}>
                  <div style={ANSWER_HEAD}>
                    <span style={VERIFIED_BADGE}>Verified</span>
                    <span style={CONFIDENCE}>
                      confidence <span style={CONFIDENCE_VAL}>0.82</span>
                    </span>
                    <span style={FLEX1}></span>
                    <span style={ANSWER_STAT}>4 claims · 5 observations · 3 iterations</span>
                  </div>

                  <div style={ANSWER_BODY}>
                    {inv.answerParas.map((p, i) => (
                      <span key={i} style={ANSWER_PARA}>
                        {p}
                      </span>
                    ))}
                  </div>

                  {inv.answerDone && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={CLAIMS_WRAP}>
                        <span style={CLAIMS_CAP}>Claim verdicts</span>
                        {inv.claims.map((c) => (
                          <div key={c.text} style={CLAIM_ROW}>
                            <span style={toneStyle(c.tone)}>{c.status}</span>
                            <span style={CLAIM_TEXT}>{c.text}</span>
                            <span style={CLAIM_CITE}>{c.cite}</span>
                          </div>
                        ))}
                      </div>

                      <div style={EVID_WRAP}>
                        <span style={SECTION_CAP}>Evidence gathered</span>
                        <div style={EVID_GRID}>
                          {inv.observations.map((o) => (
                            <div key={o.id} style={EVID_CARD}>
                              <span style={EVID_IDROW}>
                                <span style={EVID_ID}>{o.id}</span>
                                <span style={EVID_TOOL}>{o.tool}</span>
                              </span>
                              <span style={EVID_SUMMARY}>{o.summary}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={ACTIONS}>
                        <HoverButton
                          type="button"
                          onClick={openRuns}
                          baseStyle={BTN_PRIMARY}
                          hoverStyle={BTN_PRIMARY_HOVER}
                        >
                          Open dossier
                        </HoverButton>
                        <HoverButton type="button" baseStyle={BTN_SECONDARY} hoverStyle={BTN_SECONDARY_HOVER}>
                          Export evidence trail
                        </HoverButton>
                        <HoverButton type="button" baseStyle={BTN_SECONDARY} hoverStyle={BTN_SECONDARY_HOVER}>
                          Flag for post-mortem
                        </HoverButton>
                        <span style={FLEX1}></span>
                        <HoverButton
                          type="button"
                          onClick={inv.reset}
                          baseStyle={BTN_GHOST}
                          hoverStyle={BTN_GHOST_HOVER}
                        >
                          New investigation
                        </HoverButton>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div style={COMPOSER_WRAP}>
        <div style={COMPOSER_INNER}>
          <div style={COMPOSER_BOX}>
            <textarea
              rows={1}
              placeholder="Ask why something broke — name a service and a time window"
              value={inv.draft}
              onChange={(e) => inv.setDraft(e.target.value)}
              onKeyDown={inv.onKey}
              style={TEXTAREA}
              aria-label="Investigation question"
            />
            <HoverButton
              type="button"
              onClick={inv.submit}
              baseStyle={COMPOSER_BTN}
              hoverStyle={COMPOSER_BTN_HOVER}
            >
              Investigate
            </HoverButton>
          </div>
          <span style={COMPOSER_HELP}>
            Answers stay withheld while a required evidence domain is uncovered. Clarifying questions pause the
            run and resume from the checkpoint.
          </span>
        </div>
      </div>
    </div>
  );
}
