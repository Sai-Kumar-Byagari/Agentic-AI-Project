import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setUser,
  clearAuth,
  setLoading,
  setError,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
} from '../redux/slices/authSlice';
import { authService } from '../services/authService';
import { logService } from '../services/logService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => selectUser(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isLoading = useSelector((state: RootState) => selectIsLoading(state));
  const error = useSelector((state: RootState) => selectError(state));

  const login = async (email: string, password: string): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await authService.login(email, password);

      if (response.status === 'success') {
        dispatch(
          setUser({
            user: response.data.user,
            sessionToken: response.data.sessionToken,
            expiresIn: response.data.expiresIn,
          })
        );
      } else {
        dispatch(setError('Login failed'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(setError(errorMessage));
      logService.logError('Login failed', err instanceof Error ? err : new Error(errorMessage));
    }
  };

  const ssoLogin = async (code: string, state: string, redirectUri: string): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await authService.ssoCallback(code, state, redirectUri);

      if (response.status === 'success') {
        dispatch(
          setUser({
            user: response.data.user,
            sessionToken: response.data.sessionToken,
            expiresIn: response.data.expiresIn,
          })
        );
      } else {
        dispatch(setError('SSO login failed'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SSO login failed';
      dispatch(setError(errorMessage));
      logService.logError('SSO login failed', err instanceof Error ? err : new Error(errorMessage));
    }
  };

  const logout = async (): Promise<void> => {
    dispatch(setLoading(true));

    try {
      await authService.logout();
      dispatch(clearAuth());
    } catch (err) {
      logService.logError('Logout failed', err instanceof Error ? err : new Error('Logout failed'));
      // Clear auth anyway
      dispatch(clearAuth());
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
      // Token refresh handled in Redux slice
    } catch (err) {
      logService.logError('Token refresh failed', err instanceof Error ? err : new Error('Token refresh failed'));
      dispatch(clearAuth());
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    ssoLogin,
    logout,
    refreshToken,
  };
};
