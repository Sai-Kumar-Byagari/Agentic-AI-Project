import { css } from '../../utils/css';
import { toneColor, toneStyle } from '../../constants/designSystem';
import { consoleService } from '../../services/consoleService';

const ROOT = css('flex:1; min-height:0; overflow-y:auto; padding:22px 24px 40px;');
const COLUMN = css('max-width:940px; display:flex; flex-direction:column;');
const ENTRY = css('display:flex; gap:16px; min-width:0;');
const WHEN = css(
  "flex:none; width:74px; padding-top:14px; font-family:'IBM Plex Mono',monospace; font-size:10.5px; " +
    'color:#9A93A0; text-align:right;'
);
const RAIL = css('flex:none; width:11px; display:flex; flex-direction:column; align-items:center;');
const RAIL_LINE = css('flex:1; width:1px; background:rgba(35,29,40,.11);');
const BODY = css(
  'flex:1; min-width:0; display:flex; flex-wrap:wrap; align-items:center; gap:7px 13px; padding:11px 0 18px;'
);
const ACTION = css("font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#241E29; flex:none;");
const DETAIL = css('font-size:12.5px; color:#6B6473; flex:1; min-width:200px; line-height:1.5;');
const ACTOR = css('font-size:11.5px; color:#8B8391; flex:none;');

const AUDIT = consoleService.getAuditTimeline();

export default function AuditScreen() {
  return (
    <div style={ROOT}>
      <div style={COLUMN}>
        {AUDIT.map((a, i) => (
          <div key={`${a.when}-${i}`} style={ENTRY}>
            <span style={WHEN}>{a.when}</span>
            <span style={RAIL}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  marginTop: '15px',
                  borderRadius: '50%',
                  flex: 'none',
                  background: toneColor(a.outcomeTone),
                }}
              ></span>
              <span style={RAIL_LINE}></span>
            </span>
            <div style={BODY}>
              <span style={ACTION}>{a.action}</span>
              <span style={DETAIL}>{a.detail}</span>
              <span style={ACTOR}>{a.actor}</span>
              <span style={toneStyle(a.outcomeTone)}>{a.outcome}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
