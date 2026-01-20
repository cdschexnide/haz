// src/utils/materialId/__tests__/a6ParagraphHandlers.test.ts
import { getA6Modifiers, isA6Paragraph } from '../a6ParagraphHandlers';

describe('a6ParagraphHandlers', () => {
  describe('isA6Paragraph', () => {
    it('returns true for A6.4', () => {
      expect(isA6Paragraph('A6.4')).toBe(true);
    });

    it('returns true for A6.15', () => {
      expect(isA6Paragraph('A6.15')).toBe(true);
    });

    it('returns false for A7.1', () => {
      expect(isA6Paragraph('A7.1')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isA6Paragraph('')).toBe(false);
    });
  });

  describe('getA6Modifiers', () => {
    it('returns modifiers for A6.4', () => {
      const result = getA6Modifiers('A6.4');
      expect(result).not.toBeNull();
      expect(typeof result).toBe('object');
    });

    it('returns null for unknown paragraph', () => {
      const result = getA6Modifiers('A99.99');
      expect(result).toBeNull();
    });

    it('returns null for non-A6 paragraph', () => {
      const result = getA6Modifiers('A7.1');
      expect(result).toBeNull();
    });
  });
});
