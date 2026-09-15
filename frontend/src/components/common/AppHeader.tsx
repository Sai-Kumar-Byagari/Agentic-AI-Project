import React from 'react';
import { COLORS } from '../../constants/colors';

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

export const AppHeader: React.FC<AppHeaderProps> = ({
  navItems,
  onTabChange,
  clock,
  user,
  onLogout,
}) => {
  const getUserInitials = () => {
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
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
      {/* Logo */}
      <span style={{ display: 'flex', alignItems: 'baseline', gap: '9px', flex: 'none' }}>
        <span
          style={{
            fontFamily: "'Spectral', Georgia, serif",
            fontSize: '22px',
            lineHeight: 1,
            color: COLORS.deep,
          }}
        >
          GIP
        </span>
        <span
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '.17em',
            color: COLORS.textTertiary,
          }}
        >
          Investigation
        </span>
      </span>

      {/* Navigation Tabs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          minWidth: 0,
          overflowX: 'auto',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            type="button"
            style={{
              padding: '8px 12px',
              border: 'none',
              background: item.active ? `rgba(${parseInt(COLORS.primary.slice(1, 3), 16)}, ${parseInt(COLORS.primary.slice(3, 5), 16)}, ${parseInt(COLORS.primary.slice(5, 7), 16)}, 0.08)` : 'transparent',
              color: item.active ? COLORS.primary : COLORS.textSecondary,
              fontFamily: "'Public Sans', sans-serif",
              fontSize: '13px',
              fontWeight: item.active ? 600 : 500,
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!item.active) {
                (e.currentTarget as HTMLButtonElement).style.color = COLORS.deep;
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(35,29,40,.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                (e.currentTarget as HTMLButtonElement).style.color = COLORS.textSecondary;
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <span style={{ flex: 1 }}></span>

      {/* Status Badge */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '11.5px',
          color: COLORS.textSecondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '6px 10px',
          whiteSpace: 'nowrap',
          flex: 'none',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: COLORS.primary,
          }}
        ></span>
        payments · prod-eu
      </span>

      {/* UTC Clock */}
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: COLORS.textTertiary,
          whiteSpace: 'nowrap',
          flex: 'none',
        }}
      >
        {clock} UTC
      </span>

      {/* Administration Link */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '11.5px',
          color: COLORS.textSecondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '6px 10px',
          whiteSpace: 'nowrap',
          flex: 'none',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = COLORS.deep;
          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(35,29,40,.28)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = COLORS.textSecondary;
          (e.currentTarget as HTMLAnchorElement).style.borderColor = COLORS.border;
        }}
        title="Requires a second factor"
      >
        Administration
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            letterSpacing: '.06em',
            color: COLORS.primary,
          }}
        >
          2FA
        </span>
      </a>

      {/* User Avatar & Logout */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          flex: 'none',
          paddingLeft: '6px',
          borderLeft: `1px solid ${COLORS.border}`,
        }}
      >
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
          {getUserInitials()}
        </span>
        <button
          onClick={onLogout}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            background: 'transparent',
            fontSize: '11.5px',
            color: COLORS.textSecondary,
            fontFamily: "'Public Sans', sans-serif",
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = COLORS.deep;
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(35,29,40,.28)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = COLORS.textSecondary;
            (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.border;
          }}
        >
          Logout
        </button>
      </span>
    </header>
  );
};
