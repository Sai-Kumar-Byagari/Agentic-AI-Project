import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { AppHeader } from '../components/common/AppHeader';
import { COLORS } from '../constants/colors';
import { getUTCTimeString } from '../utils/dateUtils';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { selectActiveTab, setActiveTab } from '../redux/slices/appSlice';
import { RootState } from '../redux/store';

// Placeholder screen components (will be replaced with actual screens in Phase 2-3)
const PlaceholderScreen: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ padding: '30px', textAlign: 'center', color: COLORS.textSecondary }}>
    <h2 style={{ fontSize: '24px', color: COLORS.textPrimary, marginBottom: '10px' }}>
      {name} Screen
    </h2>
    <p>Coming in Phase 2-3</p>
  </div>
);

export default function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const activeTab = useSelector((state: RootState) => selectActiveTab(state));
  const [clock, setClock] = useState(getUTCTimeString());

  // Update clock every second
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

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId as any));
  };

  const navItems = [
    { id: 'investigate', label: 'Investigate', active: activeTab === 'investigate' },
    { id: 'runs', label: 'Runs', active: activeTab === 'runs' },
    { id: 'memory', label: 'Memory', active: activeTab === 'memory' },
    { id: 'integrations', label: 'Integrations', active: activeTab === 'integrations' },
    { id: 'settings', label: 'Settings', active: activeTab === 'settings' },
    { id: 'audit', label: 'Audit', active: activeTab === 'audit' },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'investigate':
        return <PlaceholderScreen name="Investigation" />;
      case 'runs':
        return <PlaceholderScreen name="Runs" />;
      case 'memory':
        return <PlaceholderScreen name="Memory" />;
      case 'integrations':
        return <PlaceholderScreen name="Integrations" />;
      case 'settings':
        return <PlaceholderScreen name="Settings" />;
      case 'audit':
        return <PlaceholderScreen name="Audit" />;
      default:
        return <PlaceholderScreen name="Investigation" />;
    }
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
        <AppHeader
          navItems={navItems}
          onTabChange={handleTabChange}
          clock={clock}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            background: COLORS.light,
            overflow: 'hidden',
          }}
        >
          {/* Active Screen */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {renderActiveScreen()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
