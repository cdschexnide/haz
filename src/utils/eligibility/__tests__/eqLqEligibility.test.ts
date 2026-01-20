// src/utils/eligibility/__tests__/eqLqEligibility.test.ts
import {
  EligibilityResult,
  calculateEligibility,
  QuantityType,
} from '../eqLqEligibility';

describe('eqLqEligibility', () => {
  describe('calculateEligibility', () => {
    it('returns excepted quantity eligible for small amounts', () => {
      const result = calculateEligibility({
        quantity: 0.5,
        unit: 'L',
        eqMaxInner: 1,
        lqMaxInner: 5,
      });
      expect(result.exceptedQuantity).toBe(true);
      expect(result.limitedQuantity).toBe(true);
      expect(result.standardQuantity).toBe(true);
    });

    it('returns only limited and standard for medium amounts', () => {
      const result = calculateEligibility({
        quantity: 2,
        unit: 'L',
        eqMaxInner: 1,
        lqMaxInner: 5,
      });
      expect(result.exceptedQuantity).toBe(false);
      expect(result.limitedQuantity).toBe(true);
      expect(result.standardQuantity).toBe(true);
    });

    it('returns only standard for large amounts', () => {
      const result = calculateEligibility({
        quantity: 10,
        unit: 'L',
        eqMaxInner: 1,
        lqMaxInner: 5,
      });
      expect(result.exceptedQuantity).toBe(false);
      expect(result.limitedQuantity).toBe(false);
      expect(result.standardQuantity).toBe(true);
    });

    it('returns none eligible when eqMaxInner is 0', () => {
      const result = calculateEligibility({
        quantity: 0.5,
        unit: 'L',
        eqMaxInner: 0,
        lqMaxInner: 0,
      });
      expect(result.exceptedQuantity).toBe(false);
      expect(result.limitedQuantity).toBe(false);
    });
  });

  describe('QuantityType enum', () => {
    it('has expected values', () => {
      expect(QuantityType.EXCEPTED).toBe('excepted');
      expect(QuantityType.LIMITED).toBe('limited');
      expect(QuantityType.STANDARD).toBe('standard');
    });
  });
});
