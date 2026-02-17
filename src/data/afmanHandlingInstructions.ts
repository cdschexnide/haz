export interface AfmanHandlingInstructionRule {
  instruction: string;
  unids?: readonly string[];
}

export const afmanHandlingInstructionsByParagraph: Record<
  string,
  readonly AfmanHandlingInstructionRule[]
> = {
  'A5.3.': [
    {
      instruction:
        'Exercise extreme caution in handling this item. Keep well ventilated, away from sparks, fire hazards, and oxidizing materials. Vapors are toxic when inhaled. Liquid is corrosive. Fuel in presence of an oxidizer is self-igniting and highly reactive. Approved protective clothing, gloves, safety goggles, and a positive pressure breathing apparatus must be available during handling of this material, and worn when handling leaking packages.',
    },
  ],
  'A6.11.': [
    {
      instruction:
        'Store in cool, well-ventilated area away from fire hazards, direct rays of the sun, and organic or easily oxidizable materials such as grease and oil. Handle containers with extreme care. Avoid direct contact.',
    },
  ],
  'A6.16.': [
    {
      instruction:
        'These materials and mixtures are extremely dangerous poisons. Approved chemical safety mask and clothing must be available when handling this material, and worn when handling leaking packages.',
    },
  ],
  'A6.18.': [
    {
      instruction:
        'These materials and mixtures are extremely dangerous poisons. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  // Source markdown uses "A.19."; normalized to A6.19. to match shipment paragraph values.
  'A6.19.': [
    {
      instruction:
        'These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A6.20.': [
    {
      instruction:
        'Nitric oxide is extremely dangerous and poisonous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A7.4.': [
    {
      instruction:
        'In the event of a leak during transportation of hydrazine, crew members use their aircraft oxygen masks in a positive pressure mode.',
    },
  ],
  'A7.5.': [
    {
      instruction:
        'These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A9.9.': [
    {
      instruction:
        'These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A10.2.': [
    {
      instruction:
        'These items may produce extremely toxic vapors. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A10.3.': [
    {
      instruction:
        'These materials and mixtures are extremely dangerous poisons. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A10.6.': [
    {
      instruction:
        'These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A10.8.': [
    {
      instruction: 'This material has the potential to cause disease in humans.',
      unids: ['UN2814'],
    },
    {
      instruction:
        'This material has the potential to cause disease in animals.',
      unids: ['UN2900'],
    },
  ],
  'A12.9.': [
    {
      instruction:
        'Mercury is poisonous in liquid and vapor form and can be absorbed through the skin at room temperature. It is corrosive to aluminum and its alloys. It expands on freezing, and may crack glass containers.',
    },
  ],
  'A12.11.': [
    {
      instruction:
        'These items are extremely dangerous. Make available approved chemical safety mask and clothing when handling this material, and wear when handling leaking packages.',
    },
  ],
  'A13.2.': [
    {
      instruction:
        'Do not expose Dibromodifluoromethane to high temperature because, when it decomposes, toxic fumes are emitted. Store in a cool, ventilated area away from flame.',
      unids: ['UN1941'],
    },
    {
      instruction:
        'In the event of a leak, avoid direct skin contact, ingestion, or inhalation of vapors. Vapors are toxic and may cause severe headache and nausea.',
      unids: ['UN3082'],
    },
  ],
  'A13.10.': [
    {
      instruction:
        'Dry ice is extremely cold and will damage human tissue on contact. Store only in well ventilated areas. Never store in hermetically or tightly sealed containers. To minimize carbon dioxide concentration within the aircraft during ground operations, open the cargo/ access doors and emergency escape hatches for maximum ventilation.',
    },
  ],
  'A13.11.': [
    {
      instruction:
        'Do not store magnetic materials suitable for military airlift closer than 4.6 m (15 feet) to compass sensing devices or other devices unduly affected by magnetic fields.',
    },
  ],
  'A13.12.': [
    {
      instruction:
        'Store in cool, well-ventilated areas away from fire hazards and sources of heat or ignition. Do not drop or rough handle.',
    },
  ],
};

const PARAGRAPH_PATTERN = /A\d+\.\d+\.?/gi;

const normalizeParagraphToken = (token: string): string => {
  const cleaned = token.trim().toUpperCase().replace(/,+$/, '');
  if (!cleaned) {
    return '';
  }
  return cleaned.endsWith('.') ? cleaned : `${cleaned}.`;
};

export const extractPackagingParagraphTokens = (
  packagingParagraph?: string | null
): string[] => {
  if (!packagingParagraph) {
    return [];
  }

  const matches = packagingParagraph.match(PARAGRAPH_PATTERN);
  if (!matches || matches.length === 0) {
    const normalized = normalizeParagraphToken(packagingParagraph);
    return normalized ? [normalized] : [];
  }

  return Array.from(
    new Set(
      matches
        .map(normalizeParagraphToken)
        .filter((paragraph): paragraph is string => Boolean(paragraph))
    )
  );
};

export const getAfmanHandlingInstructions = ({
  packagingParagraph,
  unid,
}: {
  packagingParagraph?: string | null;
  unid?: string | null;
}): string[] => {
  const paragraphs = extractPackagingParagraphTokens(packagingParagraph);
  if (paragraphs.length === 0) {
    return [];
  }

  const normalizedUnid = unid?.trim().toUpperCase() ?? '';
  const instructions: string[] = [];

  for (const paragraph of paragraphs) {
    const rules = afmanHandlingInstructionsByParagraph[paragraph];
    if (!rules) {
      continue;
    }

    for (const rule of rules) {
      if (
        rule.unids &&
        (normalizedUnid.length === 0 || !rule.unids.includes(normalizedUnid))
      ) {
        continue;
      }
      instructions.push(rule.instruction);
    }
  }

  return Array.from(new Set(instructions));
};
