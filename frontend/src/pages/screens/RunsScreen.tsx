import { useMemo, useState } from 'react';
import { css } from '../../utils/css';
import { C, meterFillStyle, meterTrackStyle, toneColor, toneStyle } from '../../constants/designSystem';
import { consoleService, filterRuns } from '../../services/consoleService';

const ROOT = css('flex:1; min-height:0; overflow-y:auto; padding:22px 24px 40px;');
const FILTER_BAR = css('display:flex; flex-wrap:wrap; align-items:center; gap:9px; padding-bottom:16px;');
const FLEX1 = css('flex:1;');
const KEYSET = css("font-family:'IBM Plex Mono',monospace; font-size:11px; color:#8B8391;");
const GRID = css('display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px;');

const CARD = css(
  'display:flex; min-width:0; background:#FFFFFF; border:1px solid rgba(35,29,40,.10); ' +
    'border-radius:13px; overflow:hidden;'
);
const CARD_BODY = css('flex:1; min-width:0; display:flex; flex-direction:column; gap:11px; padding:15px 16px;');
const CARD_TOP = css('display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px;');
const RUN_ID = css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#8B8391;");
const GOAL = css('font-size:13.5px; line-height:1.5; color:#241E29; text-wrap:pretty;');
const METER_BLOCK = css('display:flex; flex-direction:column; gap:6px;');
const METER_ROW = css('display:flex; align-items:center; gap:8px;');
const COVERAGE_TXT = css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#6B6473; flex:none;");
const GROUND_ROW = css('display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px;');
const DURATION = css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#8B8391;");

const RUNS = consoleService.getRuns();
const FILTERS = consoleService.getRunFilters();

const filterChipStyle = (active: boolean) =>
  css(
    'font-size:12.5px; padding:7px 13px; border-radius:9px; cursor:pointer; white-space:nowrap; ' +
      `border:1px solid ${active ? 'rgba(90,66,112,.30)' : 'rgba(35,29,40,.11)'}; ` +
      `color:${active ? C.accent : '#6B6473'}; background:${active ? 'rgba(90,66,112,.07)' : '#FFFFFF'};`
  );

export default function RunsScreen() {
  const [active, setActive] = useState('All');
  const runs = useMemo(() => filterRuns(RUNS, active), [active]);

  return (
    <div style={ROOT}>
      <div style={FILTER_BAR}>
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setActive(f)} style={filterChipStyle(f === active)}>
            {f}
          </button>
        ))}
        <span style={FLEX1}></span>
        <span style={KEYSET}>keyset · 50 / page</span>
      </div>

      <div style={GRID}>
        {runs.map((r) => (
          <div key={r.id} style={CARD}>
            <span style={{ flex: 'none', width: '3px', background: toneColor(r.statusTone) }}></span>
            <div style={CARD_BODY}>
              <div style={CARD_TOP}>
                <span style={RUN_ID}>{r.id}</span>
                <span style={FLEX1}></span>
                <span style={toneStyle(r.statusTone)}>{r.status}</span>
              </div>
              <span style={GOAL}>{r.goal}</span>
              <div style={METER_BLOCK}>
                <span style={METER_ROW}>
                  <span style={meterTrackStyle}>
                    <span style={meterFillStyle(r.coveragePct, r.coveragePct === 100 ? C.good : C.warn)}></span>
                  </span>
                  <span style={COVERAGE_TXT}>{r.coverage}</span>
                </span>
                <div style={GROUND_ROW}>
                  <span style={toneStyle(r.groundingTone)}>{r.grounding}</span>
                  <span style={FLEX1}></span>
                  <span style={DURATION}>{r.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
