import { css } from '../../utils/css';
import { C, meterFillStyle, meterTrackStyle, toneStyle } from '../../constants/designSystem';
import { consoleService } from '../../services/consoleService';

const ROOT = css(
  'flex:1; min-height:0; overflow-y:auto; padding:22px 24px 40px; display:flex; flex-direction:column; gap:20px;'
);
const STATS_GRID = css('display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:13px;');
const STAT_CARD = css(
  'background:#FFFFFF; border:1px solid rgba(35,29,40,.11); border-radius:13px; padding:16px 18px; ' +
    'display:flex; flex-direction:column; gap:6px; min-width:0;'
);
const STAT_VALUE = css(
  "font-family:'Spectral',Georgia,serif; font-size:30px; font-weight:400; line-height:1; color:#33253C;"
);
const STAT_LABEL = css('font-size:12px; color:#6B6473;');

const LIST = css('display:flex; flex-direction:column; gap:10px;');
const SECTION_CAP = css('font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:#8B8391;');
const EP_ROW = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:9px 14px; min-width:0; background:#FFFFFF; ' +
    'border:1px solid rgba(35,29,40,.10); border-radius:12px; padding:14px 16px;'
);
const EP_SUMMARY = css('flex:1; min-width:200px; font-size:13.5px; line-height:1.5; color:#241E29;');
const EP_INTENT = css(
  "font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#5A4270; " +
    'background:rgba(90,66,112,.07); border-radius:5px; padding:3px 7px; flex:none;'
);
const EP_METER = css('display:flex; align-items:center; gap:8px; flex:none;');
const EP_RATIO = css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#6B6473;");

const STATS = consoleService.getMemoryStats();
const EPISODES = consoleService.getEpisodes();

export default function MemoryScreen() {
  return (
    <div style={ROOT}>
      <div style={STATS_GRID}>
        {STATS.map((m) => (
          <div key={m.label} style={STAT_CARD}>
            <span style={STAT_VALUE}>{m.value}</span>
            <span style={STAT_LABEL}>{m.label}</span>
          </div>
        ))}
      </div>

      <div style={LIST}>
        <span style={SECTION_CAP}>Episodes</span>
        {EPISODES.map((e) => (
          <div key={e.summary} style={EP_ROW}>
            <span style={EP_SUMMARY}>{e.summary}</span>
            <span style={EP_INTENT}>{e.intent}</span>
            <span style={EP_METER}>
              <span style={meterTrackStyle}>
                <span style={meterFillStyle(e.relevance, e.relevance === 0 ? C.warn : C.accent)}></span>
              </span>
              <span style={EP_RATIO}>{e.ratio}</span>
            </span>
            <span style={toneStyle(e.statusTone)}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
