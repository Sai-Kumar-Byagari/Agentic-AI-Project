import { css } from '../../utils/css';
import { toneColor, toneStyle } from '../../constants/designSystem';
import { consoleService } from '../../services/consoleService';

const ROOT = css(
  'flex:1; min-height:0; overflow-y:auto; padding:22px 24px 40px; display:flex; flex-direction:column; gap:22px;'
);
const SECTION = css('display:flex; flex-direction:column; gap:10px;');
const SECTION_CAP = css('font-size:10px; text-transform:uppercase; letter-spacing:.15em; color:#8B8391;');

const SERVER_ROW = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:10px 18px; min-width:0; background:#FFFFFF; ' +
    'border:1px solid rgba(35,29,40,.10); border-radius:12px; padding:14px 16px;'
);
const SERVER_NAME_WRAP = css('display:flex; align-items:center; gap:10px; min-width:190px; flex:1;');
const SERVER_NAME = css('font-size:14px; font-weight:600; color:#241E29;');
const SERVER_DOMAIN = css("font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8B8391;");
const METRICS_WRAP = css('display:flex; flex-wrap:wrap; gap:8px 18px; flex:none;');
const METRIC_COL = css('display:flex; flex-direction:column; gap:2px; min-width:62px;');
const METRIC_V = css("font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:#33383C;");
const METRIC_K = css('font-size:9.5px; text-transform:uppercase; letter-spacing:.1em; color:#9A93A0;');
const HEALTH_WRAP = css('display:flex; align-items:center; gap:8px; flex:none;');
const BREAKER = css("font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8B8391;");

const ROUTING_TABLE = css(
  'background:#FFFFFF; border:1px solid rgba(35,29,40,.10); border-radius:12px; overflow:hidden;'
);
const ROUTING_ROW = css(
  'display:flex; flex-wrap:wrap; align-items:center; gap:8px 16px; min-width:0; padding:13px 16px; ' +
    'border-bottom:1px solid rgba(35,29,40,.07);'
);
const ROUTING_ROLE = css('min-width:130px; font-size:13px; color:#241E29;');
const ROUTING_MODEL = css(
  "flex:1; min-width:200px; font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#4A4351;"
);
const ROUTING_FAILOVER = css('font-size:11.5px; color:#8B8391; flex:none;');

const SERVERS = consoleService.getServers();
const ROUTING = consoleService.getRouting();

export default function IntegrationsScreen() {
  return (
    <div style={ROOT}>
      <div style={SECTION}>
        <span style={SECTION_CAP}>MCP servers</span>
        {SERVERS.map((s) => (
          <div key={s.name} style={SERVER_ROW}>
            <span style={SERVER_NAME_WRAP}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  flex: 'none',
                  background: toneColor(s.healthTone),
                }}
              ></span>
              <span style={SERVER_NAME}>{s.name}</span>
              <span style={SERVER_DOMAIN}>{s.domain}</span>
            </span>
            <span style={METRICS_WRAP}>
              {s.metrics.map((m) => (
                <span key={m.k} style={METRIC_COL}>
                  <span style={METRIC_V}>{m.v}</span>
                  <span style={METRIC_K}>{m.k}</span>
                </span>
              ))}
            </span>
            <span style={HEALTH_WRAP}>
              <span style={BREAKER}>breaker {s.breaker}</span>
              <span style={toneStyle(s.healthTone)}>{s.health}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={SECTION}>
        <span style={SECTION_CAP}>Model routing</span>
        <div style={ROUTING_TABLE}>
          {ROUTING.map((r) => (
            <div key={r.role} style={ROUTING_ROW}>
              <span style={ROUTING_ROLE}>{r.role}</span>
              <span style={ROUTING_MODEL}>{r.model}</span>
              <span style={ROUTING_FAILOVER}>failover {r.failover}</span>
              <span style={toneStyle(r.stateTone)}>{r.state}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
