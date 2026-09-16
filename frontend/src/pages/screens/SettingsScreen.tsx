import { css } from '../../utils/css';
import { toneStyle } from '../../constants/designSystem';
import { consoleService } from '../../services/consoleService';

const ROOT = css('flex:1; min-height:0; overflow-y:auto; padding:22px 24px 40px;');
const COLUMN = css('max-width:880px; display:flex; flex-direction:column; gap:16px;');

const REASON_BANNER = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:10px 13px; background:rgba(90,66,112,.06); ' +
    'border:1px solid rgba(90,66,112,.24); border-radius:12px; padding:14px 16px;'
);
const REASON_TAG = css(
  "font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.08em; color:#5A4270; flex:none;"
);
const REASON_TEXT = css('flex:1; min-width:220px; font-size:12.5px; line-height:1.6; color:#4A4351;');

const GROUP = css('display:flex; flex-direction:column; gap:9px;');
const GROUP_CAP = css('font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:#8B8391;');
const GROUP_TABLE = css(
  'background:#FFFFFF; border:1px solid rgba(35,29,40,.10); border-radius:12px; overflow:hidden;'
);
const ROW = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:9px 16px; min-width:0; padding:13px 16px; ' +
    'border-bottom:1px solid rgba(35,29,40,.07);'
);
const ROW_KEY_WRAP = css('flex:1; min-width:210px; display:flex; flex-direction:column; gap:3px;');
const ROW_KEY = css("font-family:'IBM Plex Mono',monospace; font-size:12px; color:#241E29;");
const ROW_NOTE = css('font-size:11.5px; color:#8B8391;');
const ROW_VAL_WRAP = css('display:flex; align-items:baseline; gap:7px; flex:none;');
const ROW_CURRENT = css("font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:#33253C;");
const ROW_DEFAULT = css('font-size:10.5px; color:#9A93A0;');

const GROUPS = consoleService.getSettingGroups();

export default function SettingsScreen() {
  return (
    <div style={ROOT}>
      <div style={COLUMN}>
        <div style={REASON_BANNER}>
          <span style={REASON_TAG}>REASON REQUIRED</span>
          <span style={REASON_TEXT}>
            Every change writes an audit entry with the actor, the before and after values, and the reason you
            give.
          </span>
        </div>

        {GROUPS.map((g) => (
          <div key={g.name} style={GROUP}>
            <span style={GROUP_CAP}>{g.name}</span>
            <div style={GROUP_TABLE}>
              {g.rows.map((s) => (
                <div key={s.key} style={ROW}>
                  <span style={ROW_KEY_WRAP}>
                    <span style={ROW_KEY}>{s.key}</span>
                    <span style={ROW_NOTE}>{s.note}</span>
                  </span>
                  <span style={ROW_VAL_WRAP}>
                    <span style={ROW_CURRENT}>{s.current}</span>
                    <span style={ROW_DEFAULT}>default {s.def}</span>
                  </span>
                  <span style={toneStyle(s.sourceTone)}>{s.source}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
