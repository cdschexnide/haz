import {
  extractPackagingParagraphTokens,
  getAfmanHandlingInstructions,
} from '../afmanHandlingInstructions';

describe('afmanHandlingInstructions', () => {
  it('returns paragraph instructions for normalized packaging paragraphs', () => {
    const instructions = getAfmanHandlingInstructions({
      packagingParagraph: 'A6.11',
      unid: 'UN1978',
    });

    expect(instructions).toEqual([
      'Store in cool, well-ventilated area away from fire hazards, direct rays of the sun, and organic or easily oxidizable materials such as grease and oil. Handle containers with extreme care. Avoid direct contact.',
    ]);
  });

  it('returns UN-specific instruction when paragraph and UN both match', () => {
    const instructions = getAfmanHandlingInstructions({
      packagingParagraph: 'A10.8.',
      unid: 'UN2814',
    });

    expect(instructions).toEqual([
      'This material has the potential to cause disease in humans.',
    ]);
  });

  it('does not return UN-specific instruction when UN does not match', () => {
    const instructions = getAfmanHandlingInstructions({
      packagingParagraph: 'A10.8.',
      unid: 'UN3245',
    });

    expect(instructions).toEqual([]);
  });

  it('parses multiple paragraphs and returns all applicable instructions', () => {
    const instructions = getAfmanHandlingInstructions({
      packagingParagraph: 'A5.3., A6.20.',
      unid: 'UN1234',
    });

    expect(instructions).toEqual([
      'Exercise extreme caution in handling this item. Keep well ventilated, away from sparks, fire hazards, and oxidizing materials. Vapors are toxic when inhaled. Liquid is corrosive. Fuel in presence of an oxidizer is self-igniting and highly reactive. Approved protective clothing, gloves, safety goggles, and a positive pressure breathing apparatus must be available during handling of this material, and worn when handling leaking packages.',
      'Nitric oxide is extremely dangerous and poisonous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    ]);
  });

  it('extracts normalized paragraph tokens from mixed formatting', () => {
    expect(extractPackagingParagraphTokens('A13.2, A13.10., A10.8')).toEqual([
      'A13.2.',
      'A13.10.',
      'A10.8.',
    ]);
  });
});
