import React from 'react';
import { css } from '../../utils/css';
import { C } from '../../constants/designSystem';

export interface NavItem {
  id: string;
  label: string;
  active: boolean;
}

interface AppHeaderProps {
  navItems: NavItem[];
  onTabChange: (tabId: string) => void;
  clock: string;
  user: { firstName: string; lastName: string; avatar?: string } | null;
  onLogout: () => void;
}

const HEADER = css(
  'flex:none; display:flex; align-items:center; gap:22px; padding:0 22px; height:58px; ' +
    'background:#FFFFFF; border-bottom:1px solid rgba(35,29,40,.10);'
);
const BRAND = css('display:flex; align-items:baseline; gap:9px; flex:none;');
const BRAND_MARK = css("font-family:'Spectral',Georgia,serif; font-size:22px; line-height:1; color:#33253C;");
const BRAND_SUB = css('font-size:9px; text-transform:uppercase; letter-spacing:.17em; color:#8B8391;');
const NAV = css('display:flex; align-items:center; gap:3px; min-width:0; overflow-x:auto;');
const FLEX1 = css('flex:1;');
const ENV = css(
  'display:flex; align-items:center; gap:7px; font-size:11.5px; color:#6B6473; ' +
    'border:1px solid rgba(35,29,40,.12); border-radius:8px; padding:6px 10px; white-space:nowrap; flex:none;'
);
const ENV_DOT = css('width:5px; height:5px; border-radius:50%; background:#5A4270;');
const CLOCK = css(
  "font-family:'IBM Plex Mono',monospace; font-size:11px; color:#8B8391; white-space:nowrap; flex:none;"
);
const ADMIN = css(
  'display:flex; align-items:center; gap:7px; font-size:11.5px; color:#6B6473; ' +
    'border:1px solid rgba(35,29,40,.12); border-radius:8px; padding:6px 10px; white-space:nowrap; flex:none;'
);
const ADMIN_2FA = css("font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:.06em; color:#5A4270;");
const AVATAR_WRAP = css(
  'display:flex; align-items:center; gap:9px; flex:none; padding-left:6px; ' +
    'border-left:1px solid rgba(35,29,40,.10);'
);
const AVATAR = css(
  'width:29px; height:29px; border-radius:9px; background:#EDE8F0; color:#5A4270; display:flex; ' +
    'align-items:center; justify-content:center; font-size:11.5px; font-weight:600; border:none; padding:0; ' +
    'cursor:pointer;'
);

const navItemStyle = (active: boolean) =>
  css(
    "border:none; border-radius:8px; padding:8px 13px; cursor:pointer; font-family:'Public Sans',sans-serif; " +
      `font-size:13px; font-weight:${active ? 600 : 400}; white-space:nowrap; ` +
      `background:${active ? 'rgba(90,66,112,.10)' : 'transparent'}; color:${active ? C.accent : '#6B6473'};`
  );

export const AppHeader: React.FC<AppHeaderProps> = ({ navItems, onTabChange, clock, user, onLogout }) => {
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'RK'
    : 'RK';

  return (
    <header style={HEADER}>
      <span style={BRAND}>
        <span style={BRAND_MARK}>GIP</span>
        <span style={BRAND_SUB}>Investigation</span>
      </span>

      <nav style={NAV}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            style={navItemStyle(item.active)}
            onMouseEnter={(e) => {
              if (!item.active) {
                e.currentTarget.style.color = '#33253C';
                e.currentTarget.style.background = 'rgba(35,29,40,.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                e.currentTarget.style.color = '#6B6473';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <span style={FLEX1}></span>

      <span style={ENV}>
        <span style={ENV_DOT}></span>
        payments · prod-eu
      </span>

      <span style={CLOCK}>{clock} UTC</span>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={ADMIN}
        title="Requires a second factor"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#33253C';
          e.currentTarget.style.borderColor = 'rgba(35,29,40,.28)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#6B6473';
          e.currentTarget.style.borderColor = 'rgba(35,29,40,.12)';
        }}
      >
        Administration
        <span style={ADMIN_2FA}>2FA</span>
      </a>

      <span style={AVATAR_WRAP}>
        <button type="button" onClick={onLogout} title="Sign out" aria-label="Sign out" style={AVATAR}>
          {initials}
        </button>
      </span>
    </header>
  );
};
