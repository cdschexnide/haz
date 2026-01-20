import {
  filterMatchingKeys,
  consolidateWorkflowModifiers,
} from '../specialProvisionsUtils';

describe('specialProvisionsUtils', () => {
  describe('filterMatchingKeys', () => {
    it('returns only keys present in the filter array', () => {
      const sourceMap = { A1: 'value1', A2: 'value2', A3: 'value3' };
      const keys = ['A1', 'A3'];
      const result = filterMatchingKeys(sourceMap, keys);
      expect(result).toEqual({ A1: 'value1', A3: 'value3' });
    });

    it('returns empty object when no keys match', () => {
      const sourceMap = { A1: 'value1', A2: 'value2' };
      const keys = ['B1', 'B2'];
      const result = filterMatchingKeys(sourceMap, keys);
      expect(result).toEqual({});
    });

    it('handles empty source map', () => {
      const result = filterMatchingKeys({}, ['A1', 'A2']);
      expect(result).toEqual({});
    });

    it('handles empty keys array', () => {
      const sourceMap = { A1: 'value1' };
      const result = filterMatchingKeys(sourceMap, []);
      expect(result).toEqual({});
    });
  });

  describe('consolidateWorkflowModifiers', () => {
    it('returns an object with all modifier sources combined', () => {
      const result = consolidateWorkflowModifiers();
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });
  });
});
