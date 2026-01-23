export interface ParsedSpecialProvisions {
  raw: string;
  tokens: string[];
  numericCodes: string[];
  alphaCodes: string[];
}

const splitSpecialProvisionTokens = (specialProvision?: string): string[] => {
  if (!specialProvision) return [];
  return specialProvision
    .split(/[:,]/g)
    .map(token => token.trim())
    .filter(Boolean);
};

export const parseSpecialProvisions = (
  specialProvision?: string
): ParsedSpecialProvisions => {
  const tokens = splitSpecialProvisionTokens(specialProvision);
  const numericCodes: string[] = [];
  const alphaCodes: string[] = [];

  tokens.forEach(token => {
    if (/^\d+$/.test(token)) {
      numericCodes.push(token);
    } else {
      alphaCodes.push(token);
    }
  });

  return {
    raw: specialProvision || "",
    tokens,
    numericCodes,
    alphaCodes,
  };
};

export interface InhalationHazardRequirement {
  requiresInhalationHazard: boolean;
  zone?: "A" | "B" | "C" | "D";
  codes: string[];
}

const inhalationZoneByCode: Record<string, "A" | "B" | "C" | "D"> = {
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
};

export const getInhalationHazardRequirement = (
  specialProvision?: string
): InhalationHazardRequirement => {
  const { numericCodes } = parseSpecialProvisions(specialProvision);
  const zoneCode = ["1", "2", "3", "4"].find(code =>
    numericCodes.includes(code)
  );
  const zone = zoneCode ? inhalationZoneByCode[zoneCode] : undefined;
  const requiresInhalationHazard =
    Boolean(zone) ||
    numericCodes.includes("5") ||
    numericCodes.includes("6") ||
    numericCodes.includes("13");

  const codes = numericCodes.filter(code =>
    ["1", "2", "3", "4", "5", "6", "13"].includes(code)
  );

  return {
    requiresInhalationHazard,
    zone,
    codes,
  };
};

export const hasSpecialProvisionCode = (
  specialProvision: string | undefined,
  code: string
): boolean => {
  return parseSpecialProvisions(specialProvision).numericCodes.includes(code);
};

export const hasSpecialProvisionAlphaCode = (
  specialProvision: string | undefined,
  code: string
): boolean => {
  const normalizedCode = code.trim().toUpperCase();
  return parseSpecialProvisions(specialProvision).alphaCodes.some(
    token => token.trim().toUpperCase() === normalizedCode
  );
};
