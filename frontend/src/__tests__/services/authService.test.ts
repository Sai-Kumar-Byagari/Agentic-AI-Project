import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../../services/authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response with valid credentials', async () => {
      const response = await authService.login('demo@bank.example', 'password123');

      expect(response.status).toBe('success');
      expect(response.data.user).toBeDefined();
      expect(response.data.user.email).toBe('demo@bank.example');
      expect(response.data.sessionToken).toBeDefined();
      expect(response.data.expiresIn).toBeGreaterThan(0);
    });

    it('should throw error on invalid email', async () => {
      // TODO: Test with backend validation
    });

    it('should throw error on invalid password', async () => {
      // TODO: Test with backend validation
    });

    it('should throw INVALID_CREDENTIALS error on failed login', async () => {
      // TODO: Test error handling
    });
  });

  describe('logout', () => {
    it('should return success response', async () => {
      const response = await authService.logout();

      expect(response.status).toBe('success');
      expect(response.message).toBeDefined();
    });

    it('should clear session on server', async () => {
      // TODO: Test server-side session clearing
    });
  });

  describe('refreshToken', () => {
    it('should return new session token', async () => {
      const response = await authService.refreshToken();

      expect(response.status).toBe('success');
      expect(response.data.sessionToken).toBeDefined();
      expect(response.data.expiresIn).toBeGreaterThan(0);
    });

    it('should throw error on failed refresh', async () => {
      // TODO: Test error handling
    });
  });

  describe('forgotPassword', () => {
    it('should return success response', async () => {
      const response = await authService.forgotPassword('test@example.com');

      expect(response.status).toBe('success');
      expect(response.message).toBeDefined();
    });

    it('should not leak user existence', async () => {
      // TODO: Test security - should return success even if email doesn't exist
    });
  });
});
