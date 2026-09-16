import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation } from '../hooks/useFormValidation';
import { COLORS } from '../constants/colors';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export default function AuthScreen() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const { email, setEmail, password, setPassword, emailError, passwordError, isValid, resetForm } = useFormValidation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    await login(email, password);
  };

  const handleSSOLogin = async () => {
    // Mock SSO login for now
    await login('demo@bank.example', 'password123');
  };

  return (
    <ErrorBoundary>
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: COLORS.deep,
          color: '#EDE8F0',
          fontFamily: "'Public Sans', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            padding: '22px 30px',
          }}
        >
          <span style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '24px', fontWeight: 400, color: '#FFFFFF' }}>
            GIP
          </span>
          <span
            style={{
              fontSize: '9.5px',
              textTransform: 'uppercase',
              letterSpacing: '.2em',
              color: 'rgba(237,232,240,.55)',
            }}
          >
            Grounded Investigation Platform
          </span>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 24px 44px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '432px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', padding: '0 4px 4px' }}>
              <span
                style={{
                  fontFamily: "'Spectral', Georgia, serif",
                  fontSize: 'clamp(26px, 3vw, 34px)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: '#FFFFFF',
                }}
              >
                Evidence first, then the answer.
              </span>
              <span
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.7,
                  color: 'rgba(237,232,240,.62)',
                }}
              >
                Sign in with your corporate identity to reach the spaces your team owns.
              </span>
            </div>

            {/* Login Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '26px 26px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 30px 70px -36px rgba(20,12,26,.75)',
              }}
            >
              {/* SSO Button */}
              <button
                onClick={handleSSOLogin}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '11px',
                  background: COLORS.primary,
                  color: '#FFFFFF',
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10.5px', letterSpacing: '.1em', opacity: 0.7 }}>SSO</span>
                <span>Continue with Okta</span>
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ flex: 1, height: '1px', background: 'rgba(35,29,40,.10)' }}></span>
                <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.15em', color: '#8B8391' }}>or use email</span>
                <span style={{ flex: 1, height: '1px', background: 'rgba(35,29,40,.10)' }}></span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {/* Email Field */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6B6473' }}>
                    Work email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@bank.example"
                    style={{
                      width: '100%',
                      padding: '12px 13px',
                      border: emailError ? '1px solid #A9503C' : '1px solid rgba(35,29,40,.15)',
                      borderRadius: '10px',
                      background: '#FBFAFC',
                      color: '#241E29',
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                  {emailError && <span style={{ fontSize: '11px', color: '#A9503C' }}>{emailError}</span>}
                </label>

                {/* Password Field */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6B6473' }}>
                      Password
                    </span>
                    <a href="#reset" style={{ fontSize: '11.5px', color: COLORS.primary }}>
                      Forgot?
                    </a>
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 13px',
                      border: passwordError ? '1px solid #A9503C' : '1px solid rgba(35,29,40,.15)',
                      borderRadius: '10px',
                      background: '#FBFAFC',
                      color: '#241E29',
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                  {passwordError && <span style={{ fontSize: '11px', color: '#A9503C' }}>{passwordError}</span>}
                </label>

                {/* Error Message */}
                {error && <div style={{ fontSize: '12px', color: '#A9503C', padding: '8px', background: 'rgba(169,80,60,0.1)', borderRadius: '6px' }}>{error}</div>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(35,29,40,.16)',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    color: '#241E29',
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
                    opacity: !isValid || isLoading ? 0.5 : 1,
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              {/* Status Footer */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px 14px',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(35,29,40,.09)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: COLORS.success,
                      flex: 'none',
                    }}
                  ></span>
                  <span style={{ fontSize: '11.5px', color: '#6B6473' }}>All services operational</span>
                </span>
                <span style={{ flex: 1 }}></span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#8B8391' }}>
                  prod-eu · egress blocked
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <span style={{ fontSize: '11.5px', lineHeight: 1.65, color: 'rgba(237,232,240,.45)', padding: '0 4px' }}>
              Sessions expire after 8 hours. Every action you take is written to the audit record.
            </span>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
