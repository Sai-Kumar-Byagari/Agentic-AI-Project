// Encryption/Decryption utilities
// For phase 1, these are stubs - real implementation needed when backend supports encryption

export interface EncryptedPayload {
  encrypted: string;
  iv: string;
  tag: string;
}

export const encryptPayload = (plaintext: string, key?: string): EncryptedPayload | string => {
  // For now, return plaintext if no key
  if (!key) return plaintext;

  // TODO: Implement AES-GCM encryption
  console.warn('Encryption not yet implemented');
  return plaintext;
};

export const decryptPayload = (encrypted: EncryptedPayload | string, key?: string): string => {
  // If plaintext string, return as-is
  if (typeof encrypted === 'string') return encrypted;

  // If no key, return empty
  if (!key) return '';

  // TODO: Implement AES-GCM decryption
  console.warn('Decryption not yet implemented');
  return '';
};

export const hasEncryptionKey = (): boolean => {
  return !!import.meta.env.VITE_ENCRYPTION_KEY;
};

export const getEncryptionKey = (): string | undefined => {
  return import.meta.env.VITE_ENCRYPTION_KEY;
};
