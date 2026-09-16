import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'responder' | 'admin' | 'security_reviewer';
  avatar: string;
}

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null;
}

const initialState: AuthState = {
  user: null,
  sessionToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; sessionToken: string; expiresIn: number }>) => {
      state.user = action.payload.user;
      state.sessionToken = action.payload.sessionToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
    },
    clearAuth: (state) => {
      state.user = null;
      state.sessionToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.expiresAt = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    refreshToken: (state, action: PayloadAction<{ sessionToken: string; expiresIn: number }>) => {
      state.sessionToken = action.payload.sessionToken;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      state.error = null;
    },
  },
});

export const { setUser, clearAuth, setLoading, setError, refreshToken } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectSessionToken = (state: { auth: AuthState }) => state.auth.sessionToken;
