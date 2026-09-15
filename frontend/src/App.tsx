import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { selectIsAuthenticated } from './redux/slices/authSlice';
import AuthScreen from './pages/AuthScreen';
import AppLayout from './pages/AppLayout';

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/app/investigate" replace /> : <AuthScreen />}
        />

        {/* App Routes (multi-screen layout) */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

        {/* Legacy redirect for backward compatibility */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/app/investigate" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/app/investigate" replace />} />
      </Routes>
    </Router>
  );
}
