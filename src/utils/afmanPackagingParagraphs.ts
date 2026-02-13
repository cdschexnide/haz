export type SpecialAuthorizationType = "COE" | "CAA" | "DOT-SP";

const AFMAN_PACKAGING_PARAGRAPH_RANGES: Array<{
  chapter: number;
  maxParagraph: number;
}> = [
  { chapter: 5, maxParagraph: 27 },
  { chapter: 6, maxParagraph: 28 },
  { chapter: 7, maxParagraph: 12 },
  { chapter: 8, maxParagraph: 22 },
  { chapter: 9, maxParagraph: 10 },
  { chapter: 10, maxParagraph: 13 },
  { chapter: 11, maxParagraph: 12 },
  { chapter: 12, maxParagraph: 15 },
  { chapter: 13, maxParagraph: 20 },
];

export const AFMAN_PACKAGING_PARAGRAPHS = new Set(
  AFMAN_PACKAGING_PARAGRAPH_RANGES.flatMap(({ chapter, maxParagraph }) =>
    Array.from(
      { length: maxParagraph },
      (_, index) => `A${chapter}.${index + 1}.`
    )
  )
);

export const AFMAN_PACKAGING_PARAGRAPHS_NO_PERIOD = new Set(
  Array.from(AFMAN_PACKAGING_PARAGRAPHS).map(value => value.slice(0, -1))
);

const PARAGRAPH_PATTERN = /A\s*(\d{1,2})\s*\.\s*(\d{1,2})\.?/i;

const getPrimaryToken = (value: string): string =>
  value.split(/[,:]/)[0]?.trim() || "";

export const normalizePackingInstructionToken = (value: string): string => {
  const primaryToken = getPrimaryToken(value);
  if (!primaryToken) {
    return "";
  }

  const paragraphMatch = primaryToken.match(PARAGRAPH_PATTERN);
  if (paragraphMatch) {
    const chapter = Number(paragraphMatch[1]);
    const paragraph = Number(paragraphMatch[2]);
    return `A${chapter}.${paragraph}.`;
  }

  const compactToken = primaryToken.toUpperCase().replace(/\s+/g, "");
  return compactToken.endsWith(".") ? compactToken : `${compactToken}.`;
};

export const isValidAfmanPackagingParagraph = (
  value?: string | null
): boolean => {
  const rawPrimaryToken = getPrimaryToken(value || "")
    .toUpperCase()
    .replace(/\s+/g, "");
  const rawWithoutPeriod = rawPrimaryToken.endsWith(".")
    ? rawPrimaryToken.slice(0, -1)
    : rawPrimaryToken;

  const normalizedToken = normalizePackingInstructionToken(value || "");
  const normalizedWithoutPeriod = normalizedToken.endsWith(".")
    ? normalizedToken.slice(0, -1)
    : normalizedToken;

  return (
    AFMAN_PACKAGING_PARAGRAPHS.has(rawPrimaryToken) ||
    AFMAN_PACKAGING_PARAGRAPHS_NO_PERIOD.has(rawWithoutPeriod) ||
    AFMAN_PACKAGING_PARAGRAPHS.has(normalizedToken) ||
    AFMAN_PACKAGING_PARAGRAPHS_NO_PERIOD.has(normalizedWithoutPeriod)
  );
};
