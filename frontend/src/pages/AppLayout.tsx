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
import InvestigationScreen from './screens/InvestigationScreen';
import RunsScreen from './screens/RunsScreen';
import MemoryScreen from './screens/MemoryScreen';
import IntegrationsScreen from './screens/IntegrationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuditScreen from './screens/AuditScreen';

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
        return <InvestigationScreen />;
      case 'runs':
        return <RunsScreen />;
      case 'memory':
        return <MemoryScreen />;
      case 'integrations':
        return <IntegrationsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'audit':
        return <AuditScreen />;
      default:
        return <InvestigationScreen />;
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
