import { useState, useCallback, useMemo } from 'react';
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '../constants/formOptions';

export const useFormValidation = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (!VALIDATION_PATTERNS.email.test(value)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }

    return null;
  }, []);

  const validatePassword = useCallback((value: string): string | null => {
    if (!value) {
      return ERROR_MESSAGES.INVALID_PASSWORD;
    }

    if (!VALIDATION_PATTERNS.password.test(value)) {
      return ERROR_MESSAGES.INVALID_PASSWORD;
    }

    return null;
  }, []);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      const error = validateEmail(value);
      setEmailError(error);
    },
    [validateEmail]
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      const error = validatePassword(value);
      setPasswordError(error);
    },
    [validatePassword]
  );

  const isValid = useMemo(() => {
    return email && password && !emailError && !passwordError;
  }, [email, password, emailError, passwordError]);

  const resetForm = useCallback(() => {
    setEmail('');
    setEmailError(null);
    setPassword('');
    setPasswordError(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    return !emailErr && !passwordErr;
  }, [email, password, validateEmail, validatePassword]);

  return {
    email,
    setEmail: handleEmailChange,
    emailError,
    password,
    setPassword: handlePasswordChange,
    passwordError,
    isValid,
    resetForm,
    validateForm,
  };
};
