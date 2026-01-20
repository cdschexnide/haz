// src/utils/navigation/__tests__/unidRouting.test.ts
import { getSpecialtyRoute, getNextRoute, SPECIALTY_UNIDS } from '../unidRouting';

describe('unidRouting', () => {
  describe('getSpecialtyRoute', () => {
    it('returns UN3166FuelEntryScreen for UN3166', () => {
      expect(getSpecialtyRoute('UN3166')).toBe('UN3166FuelEntryScreen');
    });

    it('returns LithiumBatteriesPrepScreen for UN3090', () => {
      expect(getSpecialtyRoute('UN3090')).toBe('LithiumBatteriesPrepScreen');
    });

    it('returns LithiumBatteriesPrepScreen for UN3480', () => {
      expect(getSpecialtyRoute('UN3480')).toBe('LithiumBatteriesPrepScreen');
    });

    it('returns null for unknown UNID', () => {
      expect(getSpecialtyRoute('UN9999')).toBeNull();
    });
  });

  describe('getNextRoute', () => {
    it('returns specialty route when UNID has one', () => {
      expect(getNextRoute('UN3166', 'DefaultRoute')).toBe('UN3166FuelEntryScreen');
    });

    it('returns default route when UNID has no specialty route', () => {
      expect(getNextRoute('UN9999', 'DefaultRoute')).toBe('DefaultRoute');
    });
  });

  describe('SPECIALTY_UNIDS', () => {
    it('contains UN3166', () => {
      expect(SPECIALTY_UNIDS).toContain('UN3166');
    });

    it('contains lithium battery UNIDs', () => {
      expect(SPECIALTY_UNIDS).toContain('UN3090');
      expect(SPECIALTY_UNIDS).toContain('UN3480');
    });
  });
});
