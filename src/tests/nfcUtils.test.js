import { describe, it, expect } from 'vitest';
import { normalizeCardNumber, isValidCardNumber, formatCardNumber } from '../utils/nfcUtils';

describe('NFC Utils', () => {
  describe('normalizeCardNumber', () => {
    it('should remove special characters', () => {
      expect(normalizeCardNumber('81722cf=9182738')).toBe('81722cf9182738');
      expect(normalizeCardNumber('817-22cf*918/2738')).toBe('81722cf9182738');
    });

    it('should convert to lowercase', () => {
      expect(normalizeCardNumber('81722CF9182738')).toBe('81722cf9182738');
    });
  });

  describe('isValidCardNumber', () => {
    it('should validate correct card numbers', () => {
      expect(isValidCardNumber('81722cf9182738')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(isValidCardNumber('123')).toBe(false); // Too short
      expect(isValidCardNumber('81722cf91827389')).toBe(false); // Too long
      expect(isValidCardNumber('81722cf918273!')).toBe(false); // Invalid characters
    });
  });

  describe('formatCardNumber', () => {
    it('should format card number correctly', () => {
      expect(formatCardNumber('81722cf9182738')).toBe('81722-cf-918273');
    });

    it('should handle empty input', () => {
      expect(formatCardNumber('')).toBe('');
      expect(formatCardNumber(null)).toBe('');
      expect(formatCardNumber(undefined)).toBe('');
    });
  });
});