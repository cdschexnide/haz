import {
  getHazardDiamondImage,
  getHazardClassName,
  parseSubsidiaryRisks,
} from '../hazardDiamondImages';

describe('getHazardDiamondImage', () => {
  it('returns an image source for known hazard classes', () => {
    const result = getHazardDiamondImage('3');
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it('returns an image source for hazard class with division', () => {
    const result = getHazardDiamondImage('5.1');
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it('handles Class 1 compatibility letters by stripping the letter', () => {
    expect(getHazardDiamondImage('1.1D')).not.toBeNull();
    expect(getHazardDiamondImage('1.3G')).not.toBeNull();
    expect(getHazardDiamondImage('1.4S')).not.toBeNull();
    expect(getHazardDiamondImage('1.5D')).not.toBeNull();
    expect(getHazardDiamondImage('1.6N')).not.toBeNull();
  });

  it('returns null for unknown hazard class', () => {
    expect(getHazardDiamondImage('99.9')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getHazardDiamondImage('')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getHazardDiamondImage(undefined)).toBeNull();
  });

  it('returns null for out-of-scope classes (5.2, 7)', () => {
    expect(getHazardDiamondImage('5.2')).toBeNull();
    expect(getHazardDiamondImage('7')).toBeNull();
  });

  it('does not strip trailing letters from non-Class-1 values', () => {
    // "3X" should NOT normalize to "3" — only Class 1 has compatibility letters
    expect(getHazardDiamondImage('3X')).toBeNull();
  });
});

describe('getHazardClassName', () => {
  it('returns class name for known hazard classes', () => {
    expect(getHazardClassName('3')).toBe('Flammable Liquid');
    expect(getHazardClassName('5.1')).toBe('Oxidizer');
    expect(getHazardClassName('6.1')).toBe('Toxic');
    expect(getHazardClassName('8')).toBe('Corrosive');
  });

  it('handles Class 1 compatibility letters', () => {
    expect(getHazardClassName('1.1D')).toBe('Explosives (Mass Explosion)');
    expect(getHazardClassName('1.4S')).toBe('Explosives (Minor)');
    expect(getHazardClassName('1.2G')).toBe('Explosives (Projection)');
  });

  it('returns null for unknown hazard class', () => {
    expect(getHazardClassName('99')).toBeNull();
  });

  it('returns null for out-of-scope classes (5.2, 7)', () => {
    expect(getHazardClassName('5.2')).toBeNull();
    expect(getHazardClassName('7')).toBeNull();
  });
});

describe('parseSubsidiaryRisks', () => {
  it('returns empty array for empty/null input', () => {
    expect(parseSubsidiaryRisks('')).toEqual([]);
    expect(parseSubsidiaryRisks(undefined)).toEqual([]);
    expect(parseSubsidiaryRisks(null)).toEqual([]);
  });

  it('parses single subsidiary risk', () => {
    expect(parseSubsidiaryRisks('8')).toEqual(['8']);
    expect(parseSubsidiaryRisks('5.1')).toEqual(['5.1']);
  });

  it('parses comma-separated subsidiary risks', () => {
    expect(parseSubsidiaryRisks('2.1, 8')).toEqual(['2.1', '8']);
    expect(parseSubsidiaryRisks('5.1, 8')).toEqual(['5.1', '8']);
    expect(parseSubsidiaryRisks('6.1, 8')).toEqual(['6.1', '8']);
  });

  it('handles extra whitespace', () => {
    expect(parseSubsidiaryRisks('2.1,8')).toEqual(['2.1', '8']);
    expect(parseSubsidiaryRisks(' 2.1 , 8 ')).toEqual(['2.1', '8']);
  });

  it('passes through non-numeric values like EXPLOSIVE', () => {
    expect(parseSubsidiaryRisks('EXPLOSIVE')).toEqual(['EXPLOSIVE']);
  });
});
