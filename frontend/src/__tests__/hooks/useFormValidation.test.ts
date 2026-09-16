import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../../hooks/useFormValidation';

describe('useFormValidation', () => {
  it('should initialize with empty form', () => {
    const { result } = renderHook(() => useFormValidation());

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.emailError).toBeNull();
    expect(result.current.passwordError).toBeNull();
    expect(result.current.isValid).toBe(false);
  });

  it('should validate email format', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.setEmail('invalid-email');
    });

    expect(result.current.emailError).not.toBeNull();
  });

  it('should accept valid email', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.emailError).toBeNull();
  });

  it('should validate password minimum length', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.setPassword('short');
    });

    expect(result.current.passwordError).not.toBeNull();
  });

  it('should accept valid password', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.setPassword('validpassword123');
    });

    expect(result.current.passwordError).toBeNull();
  });

  it('should be valid when both fields are correct', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('validpassword123');
    });

    expect(result.current.isValid).toBe(true);
  });

  it('should reset form', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
      result.current.resetForm();
    });

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isValid).toBe(false);
  });
});
