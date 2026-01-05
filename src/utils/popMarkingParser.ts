/**
 * POP Marking Parser Utility
 * Parses OCR text from UN specification POP markings into individual fields
 *
 * Supports multiple POP marking types:
 * - Non-bulk packaging for solids: UN / 4G / Y 7.4 / S / 99 / USA / DOD
 * - Non-bulk packaging for liquids: UN / 1A1 / Y 1.3 / 100 / 99 / USA / DOD
 * - Large packaging: UN / 50A/X/05 05/USA/M9399/2500/1000
 */

/**
 * Enum representing different types of POP markings
 */
export enum POPMarkingType {
  NON_BULK_SOLID = 'non_bulk_solid',
  NON_BULK_LIQUID = 'non_bulk_liquid',
  LARGE_PACKAGING = 'large_packaging',
  UNKNOWN = 'unknown'
}

/**
 * Base interface for all POP marking types
 */
interface POPMarkingFieldsBase {
  type: POPMarkingType;
  A: string; // UN symbol (always "UN")
  B: string; // Packaging code
  C: string; // Packing Group (X, Y, Z)
}

/**
 * Non-bulk packaging for solids or combination/composite packaging
 * Format: UN / [Code] / [PG] [Mass] / S / [YY] / [Country] / [Mfr]
 * Example: UN / 4G / Y 7.4 / S / 99 / USA / DOD
 */
export interface NonBulkSolidFields extends POPMarkingFieldsBase {
  type: POPMarkingType.NON_BULK_SOLID;
  D: string; // Maximum gross mass in kilograms (e.g., "7.4", "25")
  E: 'S';    // Always "S" (indicates solids or inner packagings)
  F: string; // Year of manufacture (last 2 digits, e.g., "99")
  G: string; // Country code (e.g., "USA")
  H: string; // Manufacturer/certifier symbol (e.g., "DOD")
  isComposite?: boolean; // True if Field B starts with "6"
  innerMaterial?: string; // For composite: 2nd character of Field B
  outerMaterial?: string; // For composite: 3rd character of Field B
}

/**
 * Non-bulk packaging for liquids (single packagings only)
 * Format: UN / [Code] / [PG] [Density] / [Pressure] / [YY] / [Country] / [Mfr]
 * Example: UN / 1A1 / Y 1.3 / 100 / 99 / USA / DOD
 */
export interface NonBulkLiquidFields extends POPMarkingFieldsBase {
  type: POPMarkingType.NON_BULK_LIQUID;
  D: string; // Relative density (specific gravity), may be empty if ≤1.2 (e.g., "1.3")
  E: string; // Test pressure in kPa, rounded down to nearest 10 (e.g., "100", "250")
  F: string; // Year of manufacture (last 2 digits)
  G: string; // Country code
  H: string; // Manufacturer/certifier symbol
}

/**
 * Large packaging (rigid or flexible)
 * Format: UN / [Code] / [PG] / [MM/YY] / [Country] / [Mfr] / [Stack] / [Mass]
 * Example: UN / 50A/X/05 05/USA/M9399/2500/1000
 */
export interface LargePackagingFields extends POPMarkingFieldsBase {
  type: POPMarkingType.LARGE_PACKAGING;
  D: string; // Month and year of manufacture (MM/YY format, e.g., "05/05" or "05 05")
  E: string; // Country code (e.g., "USA")
  F: string; // Manufacturer symbol (e.g., "M9399")
  G: string; // Stacking test load in kg, or "0" if not designed for stacking (e.g., "2500")
  H: string; // Maximum permissible gross mass or net mass for flexible (e.g., "1000")
}

/**
 * Discriminated union of all POP marking field types
 */
export type POPMarkingFields =
  | NonBulkSolidFields
  | NonBulkLiquidFields
  | LargePackagingFields;

/**
 * Legacy interface for backward compatibility
 * @deprecated Use type-specific interfaces instead
 */
export interface POPMarkingFieldsLegacy {
  A: string; // UN symbol
  B: string; // Packaging code (e.g., 1A1, 4G)
  C: string; // Packing Group (X, Y, Z)
  D: string; // Maximum gross mass (kg) or relative density
  E: string; // Test pressure (kPa) or "S" for solids
  F: string; // Year of manufacture (last 2 digits)
  G: string; // Country code (e.g., USA)
  H: string; // Manufacturer/certifier symbol
}

/**
 * Cleans the packaging code field to fix common OCR errors
 */
function cleanPackagingCode(code: string): string {
  if (!code) return '';

  // Remove spaces and normalize
  let cleaned = code.replace(/\s+/g, '').toUpperCase();

  // Common OCR errors in packaging codes
  // The pattern is: number + letter + number (e.g., 1A1, 4G, 6HA1)

  // Fix common character confusions at the start (should be a digit)
  cleaned = cleaned
    .replace(/^O/, '0')  // O → 0 at start
    .replace(/^I/, '1')  // I → 1 at start
    .replace(/^L/, '1'); // l → 1 at start

  // **NEW FIX**: Handle extra digits before the valid packaging code
  // OCR sometimes reads "1A1" as "71A1" or "11A1"
  // Valid packaging codes start with digits 1-6 (or 50/51 for large packaging)
  // Pattern: [1-6][A-Z][A-Z0-9]{0,3} OR 5[01][A-Z]?

  // Try to extract valid packaging code from potentially malformed input
  const validCodeMatch = cleaned.match(/([1-6][A-Z][A-Z0-9]{0,3})/);
  if (validCodeMatch) {
    const extractedCode = validCodeMatch[1];
    // If the extracted code is shorter than the input, extra digits were present
    if (extractedCode !== cleaned) {
      console.log(`⚠️ Cleaned packaging code: "${cleaned}" → "${extractedCode}"`);
      return extractedCode;
    }
  }

  // Check for large packaging codes (50A, 51H, etc.)
  const largeCodeMatch = cleaned.match(/(5[01][A-Z]?)/);
  if (largeCodeMatch) {
    const extractedCode = largeCodeMatch[1];
    if (extractedCode !== cleaned) {
      console.log(`⚠️ Cleaned large packaging code: "${cleaned}" → "${extractedCode}"`);
      return extractedCode;
    }
  }

  return cleaned;
}

/**
 * Cleans the packing group field (should be X, Y, or Z)
 */
function cleanPackingGroup(pg: string): string {
  if (!pg) return '';

  let cleaned = pg.trim().toUpperCase();

  // Fix common OCR errors
  // X can be confused with K
  // Y can be confused with V
  // Z can be confused with 2

  if (cleaned === 'K') cleaned = 'X';
  if (cleaned === 'V') cleaned = 'Y';
  if (cleaned === '2') cleaned = 'Z';

  // Only return if valid
  if (['X', 'Y', 'Z'].includes(cleaned)) {
    return cleaned;
  }

  return pg.trim().toUpperCase();
}

/**
 * Cleans the year field (should be 2 digits)
 */
function cleanYear(year: string): string {
  if (!year) return '';

  // Extract just digits
  const digits = year.replace(/\D/g, '');

  // Return last 2 digits if we have them
  if (digits.length >= 2) {
    return digits.slice(-2);
  }

  return digits;
}

/**
 * Cleans a numeric field (D or E)
 */
function cleanNumericField(value: string): string {
  if (!value) return '';

  // Handle "S" for solids in Field E
  if (value.toUpperCase().trim() === 'S') {
    return 'S';
  }

  // Extract numeric value with optional decimal
  const match = value.match(/[\d.]+/);
  return match ? match[0] : value.trim();
}

/**
 * Cleans country code field
 */
function cleanCountryCode(code: string): string {
  if (!code) return '';

  // Remove non-letter characters and uppercase
  return code.replace(/[^A-Za-z]/g, '').toUpperCase();
}

/**
 * Cleans manufacturer/certifier symbol
 */
function cleanManufacturerSymbol(symbol: string): string {
  if (!symbol) return '';

  // Remove non-alphanumeric and uppercase
  return symbol.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * Attempts to recover fields when OCR errors cause field merging
 * Specifically handles cases like "SI 23" → ["S", "23"]
 *
 * Common OCR errors this fixes:
 * - "/" read as "I": "S / 23" → "SI 23"
 * - "/" read as "1": "S / 23" → "S1 23"
 * - "/" read as "|": "S / 23" → "S| 23"
 * - Missing space: "S / 23" → "SI23"
 *
 * @param parts - Array of parts after splitting by delimiter
 * @param originalText - Original OCR text for reference
 * @returns Recovered parts array with merged fields split
 */
function attemptFieldRecovery(parts: string[], originalText: string): string[] {
  console.log('=== attemptFieldRecovery START ===');
  console.log('Input parts:', JSON.stringify(parts));
  console.log('Parts length:', parts.length);
  console.log('Original text:', originalText);

  // Check if we have too few parts (expected: 7 for non-bulk, 8-9 for large)
  if (parts.length >= 7) {
    console.log('✓ Sufficient parts found (>= 7), no recovery needed');
    return parts;
  }

  const recoveredParts = [...parts];

  // Strategy 1: Look for merged Field E + Field F patterns
  // Field E is at parts[3] for non-bulk packaging
  // Pattern: "S[I1|] DD" or "S DD" where DD is 2 digits (year)
  for (let i = 3; i < recoveredParts.length; i++) {
    const part = recoveredParts[i];
    console.log(`Examining parts[${i}]: "${part}"`);

    // Check for "SI 23" pattern (Field E merged with Field F)
    // Matches: "SI 23", "S1 23", "S| 23", "SI23", "S 23"
    const mergedSolidPattern = /^([S5$])[I1|]?\s*(\d{2})$/i;
    const match = part.match(mergedSolidPattern);

    if (match) {
      console.log(`✓ Found merged solid pattern at index ${i}: "${part}"`);
      console.log(`  Match groups: ["${match[1]}", "${match[2]}"]`);
      console.log(`  Will split into: ["${match[1].toUpperCase()}", "${match[2]}"]`);

      // Replace this part with two separate parts
      recoveredParts.splice(i, 1, match[1].toUpperCase(), match[2]);
      console.log('  Parts after split:', JSON.stringify(recoveredParts));
      console.log('  New parts length:', recoveredParts.length);
      break;  // Only fix first occurrence
    }

    // Check for liquid pattern: numeric pressure + year
    // Pattern: "100 23" or "10023" (Field E merged with Field F)
    // Only check at Field E position (index 3)
    if (i === 3) {
      const mergedLiquidPattern = /^(\d{2,3})[I1|]?\s*(\d{2})$/;
      const liquidMatch = part.match(mergedLiquidPattern);

      if (liquidMatch) {
        const pressure = parseInt(liquidMatch[1], 10);
        console.log(`  Checking if "${liquidMatch[1]}" looks like test pressure...`);

        // Test pressures are typically 50-1000 kPa
        if (pressure >= 50 && pressure <= 1000) {
          console.log(`✓ Found merged liquid pattern at index ${i}: "${part}"`);
          console.log(`  Pressure: ${pressure} kPa (valid range)`);
          console.log(`  Will split into: ["${liquidMatch[1]}", "${liquidMatch[2]}"]`);

          recoveredParts.splice(i, 1, liquidMatch[1], liquidMatch[2]);
          console.log('  Parts after split:', JSON.stringify(recoveredParts));
          console.log('  New parts length:', recoveredParts.length);
          break;
        } else {
          console.log(`  ${pressure} kPa outside valid range (50-1000), skipping`);
        }
      }
    }
  }

  console.log('Final recovered parts:', JSON.stringify(recoveredParts));
  console.log('Final parts length:', recoveredParts.length);
  console.log('=== attemptFieldRecovery END ===\n');
  return recoveredParts;
}

/**
 * Normalizes delimiter spacing to canonical format: " / "
 * Handles inconsistent spacing: "/", " /", "/ ", " / " → all become " / "
 * Also handles OCR-confused characters: |, I, 1 → /
 *
 * @param text - Text with potentially inconsistent delimiter spacing
 * @returns Text with normalized " / " delimiters
 *
 * @example
 * normalizeDelimiters("UN/1A1/Y 1.8") → "UN / 1A1 / Y 1.8"
 * normalizeDelimiters("UN 1A1 /Y") → "UN 1A1 / Y"
 * normalizeDelimiters("USA/ DOD") → "USA / DOD"
 */
function normalizeDelimiters(text: string): string {
  if (!text) return '';

  console.log('📝 Normalizing delimiters for:', text);

  // Step 1: Replace OCR-confused delimiter characters with slash
  // Handle: |, I, 1 when they appear as delimiters (with spaces around them)
  text = text.replace(/\s+[|I1]\s+/g, ' / ');

  // Step 2: Ensure space before every slash (if not already present)
  // Matches: any non-space character followed by slash
  text = text.replace(/([^\s])\//g, '$1 /');

  // Step 3: Ensure space after every slash (if not already present)
  // Matches: slash followed by any non-space character
  text = text.replace(/\/([^\s])/g, '/ $1');

  // Step 4: Collapse multiple consecutive spaces to single space
  text = text.replace(/\s+/g, ' ');

  // Step 5: Trim leading/trailing whitespace
  const normalized = text.trim();

  console.log('✓ Normalized result:', normalized);
  return normalized;
}

/**
 * Detects the type of POP marking from OCR text
 * Uses multiple heuristics to identify large packaging vs non-bulk, and solid vs liquid
 *
 * @param ocrText - Raw OCR text from the scanned marking
 * @returns POPMarkingType enum value
 */
export function detectPOPMarkingType(ocrText: string): POPMarkingType {
  console.log('=== detectPOPMarkingType START ===');
  console.log('Input text:', ocrText);

  if (!ocrText || ocrText.trim().length === 0) {
    console.log('Empty text, returning UNKNOWN');
    return POPMarkingType.UNKNOWN;
  }

  const normalizedText = ocrText.toUpperCase().trim();

  // Step 1: Check for large packaging via packaging code (Field B)
  // Large packaging codes start with "50" (rigid) or "51" (flexible)
  // Pattern: UN / 50A / ... or UN 4G / ...
  // IMPORTANT: Must have a separator (/, space, or similar) after UN to distinguish from UN ID numbers
  // UN ID numbers like UN0106 have NO separator - digits immediately follow "UN"
  const packagingCodeMatch = normalizedText.match(/UN[\s\/|I1]+([A-Z0-9]{2,4})/i);
  if (packagingCodeMatch) {
    const fieldB = packagingCodeMatch[1].replace(/[^A-Z0-9]/g, '');
    console.log('Extracted Field B:', fieldB);

    // Reject if fieldB looks like a UN ID number (4 consecutive digits, possibly with O→0 OCR error)
    // UN ID numbers are 4 digits like 0106, 1203, 3082
    // POP packaging codes have letters like 4G, 4H1, 50A, 1A1
    if (/^[O0]?\d{3,4}$/.test(fieldB)) {
      console.log('⚠️ Field B looks like UN ID number, not packaging code:', fieldB);
    } else {
      // Check for large packaging indicators
      // Handle OCR confusion: "50" might be read as "S0" or "5O"
      if (/^5[01][A-Z]/.test(fieldB) || /^[S5][O0][A-Z]/.test(fieldB)) {
        console.log('→ Detected LARGE_PACKAGING via Field B pattern');
        return POPMarkingType.LARGE_PACKAGING;
      }
    }
  }

  // Step 2: Check for date format in Field D (MM/YY with slash)
  // Large packaging uses date format, non-bulk uses mass/density
  // Look for pattern like "05/05" or "05 05" or "12/23"
  if (/\d{2}\s*[\/|I1]\s*\d{2}/.test(normalizedText)) {
    console.log('→ Detected LARGE_PACKAGING via date format in Field D');
    return POPMarkingType.LARGE_PACKAGING;
  }

  // Step 3: Parse slash-delimited parts to examine Field E
  // This is the key differentiator between solid and liquid non-bulk packaging
  const parts = normalizedText
    .split(/\s*[\/|I1]\s*/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  console.log('Split parts for Field E analysis:', parts);

  if (parts.length >= 4) {
    // Field E is at parts[3] for non-bulk packaging
    // For non-bulk: parts = [UN, Code, "PG Mass", E, Year, Country, Mfr]

    // **IMPORTANT**: Detect if C/D are split across sections
    // Check if parts[2] only contains packing group (single letter: X/Y/Z)
    // AND parts[3] is numeric (Field D was split)
    const cdSection = parts[2] || '';
    const cdParts = cdSection.trim().split(/\s+/);
    const onlyPackingGroup = cdParts.length === 1 && /^[XYZ]$/i.test(cdParts[0]);
    const parts3IsNumeric = /^\d+(\.\d+)?$/.test(parts[3]);

    let fieldEIndex = 3;  // Default position

    if (onlyPackingGroup && parts3IsNumeric) {
      // C/D are split! Field D is in parts[3], so Field E is in parts[4]
      console.log('⚠️ Detected C/D split during type detection');
      console.log(`  parts[2] = "${parts[2]}" (only packing group)`);
      console.log(`  parts[3] = "${parts[3]}" (Field D, not Field E)`);
      console.log(`  parts[4] = "${parts[4] || ''}" (actual Field E)`);
      fieldEIndex = 4;  // Shift Field E position
    }

    const fieldE = (parts[fieldEIndex] || '').trim();
    console.log(`Field E value (at parts[${fieldEIndex}]):`, fieldE);

    // Check if Field E is "S" (solids/inner packagings)
    // Handle OCR confusion: "S" might be read as "5" or "$"
    if (/^[S5$]$/i.test(fieldE)) {
      console.log('→ Detected NON_BULK_SOLID via Field E = "S"');
      return POPMarkingType.NON_BULK_SOLID;
    }

    // Check if Field E is numeric (test pressure in kPa for liquids)
    // Typical range: 80-250 kPa, sometimes higher
    // Could be confused with dates, but dates have slash
    if (/^\d+$/.test(fieldE)) {
      const numericValue = parseInt(fieldE, 10);
      console.log('Field E numeric value:', numericValue);

      // Test pressures are typically in range 80-500 kPa
      // If it looks like a pressure value, it's likely liquid packaging
      if (numericValue >= 50 && numericValue <= 1000) {
        console.log('→ Detected NON_BULK_LIQUID via Field E = numeric pressure');
        return POPMarkingType.NON_BULK_LIQUID;
      }
    }

    // Check if Field E is alphabetic (2-3 letters)
    // In large packaging, Field E is the country code
    // This is a secondary indicator if we missed earlier checks
    if (/^[A-Z]{2,3}$/.test(fieldE)) {
      console.log('→ Detected LARGE_PACKAGING via Field E = country code');
      // Double-check: in large packaging, Field G should be numeric (stack load)
      if (parts.length >= 7) {
        const fieldG = parts[6].trim();
        if (/^\d+$/.test(fieldG)) {
          console.log('→ Confirmed LARGE_PACKAGING (Field G is numeric)');
          return POPMarkingType.LARGE_PACKAGING;
        }
      }
      // If uncertain, could still be large packaging
      return POPMarkingType.LARGE_PACKAGING;
    }
  }

  // Step 4: Fallback - check Field D for mass vs density patterns
  // Solid: whole number or single decimal (e.g., "25", "7.4")
  // Liquid: decimal density (e.g., "1.3", "0.8")
  if (parts.length >= 3) {
    const cdSection = parts[2] || '';
    const cdParts = cdSection.trim().split(/\s+/);
    if (cdParts.length >= 2) {
      const fieldD = cdParts[1];
      console.log('Field D value:', fieldD);

      // Check if it looks like relative density (< 5.0, usually has decimal)
      if (/^\d*\.\d+$/.test(fieldD)) {
        const densityValue = parseFloat(fieldD);
        if (densityValue > 0 && densityValue < 5.0) {
          console.log('→ Detected NON_BULK_LIQUID via Field D = density pattern');
          return POPMarkingType.NON_BULK_LIQUID;
        }
      }

      // Large mass values (> 50 kg) are more common in solids
      if (/^\d+$/.test(fieldD)) {
        const massValue = parseInt(fieldD, 10);
        if (massValue > 50) {
          console.log('→ Detected NON_BULK_SOLID via Field D = large mass');
          return POPMarkingType.NON_BULK_SOLID;
        }
      }
    }
  }

  // If we can't determine type, return UNKNOWN
  console.log('→ Unable to determine type, returning UNKNOWN');
  console.log('=== detectPOPMarkingType END ===');
  return POPMarkingType.UNKNOWN;
}

/**
 * Parses non-bulk solid packaging marking
 * Format: UN / [Code] / [PG] [Mass] / S / [YY] / [Country] / [Mfr]
 * Example: UN / 4G / Y 7.4 / S / 99 / USA / DOD
 */
export function parseNonBulkSolid(ocrText: string): NonBulkSolidFields | null {
  console.log('=== parseNonBulkSolid START ===');

  const legacyFields = parsePOPMarkingText(ocrText);
  if (!legacyFields) {
    console.log('Legacy parser returned null');
    return null;
  }

  // Check if Field B indicates composite packaging (starts with "6")
  const isComposite = /^6/.test(legacyFields.B);
  let innerMaterial: string | undefined;
  let outerMaterial: string | undefined;

  if (isComposite && legacyFields.B.length >= 3) {
    innerMaterial = legacyFields.B[1]; // 2nd character
    outerMaterial = legacyFields.B[2]; // 3rd character
    console.log(`Composite packaging detected: inner=${innerMaterial}, outer=${outerMaterial}`);
  }

  const fields: NonBulkSolidFields = {
    type: POPMarkingType.NON_BULK_SOLID,
    A: legacyFields.A,
    B: legacyFields.B,
    C: legacyFields.C,
    D: legacyFields.D,
    E: 'S', // Always "S" for solids
    F: legacyFields.F,
    G: legacyFields.G,
    H: legacyFields.H,
    isComposite,
    innerMaterial,
    outerMaterial,
  };

  console.log('Parsed non-bulk solid fields:', fields);
  console.log('=== parseNonBulkSolid END ===');
  return fields;
}

/**
 * Parses non-bulk liquid packaging marking
 * Format: UN / [Code] / [PG] [Density] / [Pressure] / [YY] / [Country] / [Mfr]
 * Example: UN / 1A1 / Y 1.3 / 100 / 99 / USA / DOD
 */
export function parseNonBulkLiquid(ocrText: string): NonBulkLiquidFields | null {
  console.log('=== parseNonBulkLiquid START ===');

  const legacyFields = parsePOPMarkingText(ocrText);
  if (!legacyFields) {
    console.log('Legacy parser returned null');
    return null;
  }

  const fields: NonBulkLiquidFields = {
    type: POPMarkingType.NON_BULK_LIQUID,
    A: legacyFields.A,
    B: legacyFields.B,
    C: legacyFields.C,
    D: legacyFields.D, // Relative density (may be empty if ≤1.2)
    E: legacyFields.E, // Test pressure in kPa
    F: legacyFields.F,
    G: legacyFields.G,
    H: legacyFields.H,
  };

  console.log('Parsed non-bulk liquid fields:', fields);
  console.log('=== parseNonBulkLiquid END ===');
  return fields;
}

/**
 * Parses large packaging marking
 * Format: UN / [Code] / [PG] / [MM/YY] / [Country] / [Mfr] / [Stack] / [Mass]
 * Example: UN / 50A/X/05 05/USA/M9399/2500/1000
 *
 * Note: Large packaging has a different field structure where fields are NOT
 * delimited the same way as non-bulk. The format can be:
 * - UN / 50A/X/05 05/USA/M9399/2500/1000 (some fields combined with slashes)
 * - UN / 50A / X / 05/05 / USA / M9399 / 2500 / 1000 (more traditional delimited)
 */
export function parseLargePackaging(ocrText: string): LargePackagingFields | null {
  console.log('=== parseLargePackaging START ===');
  console.log('Raw OCR input:', ocrText);

  if (!ocrText || ocrText.trim().length === 0) {
    console.log('Empty input text');
    return null;
  }

  let text = ocrText.toUpperCase().trim();

  // Find UN marker
  const unIndex = text.indexOf('UN');
  if (unIndex === -1) {
    console.log('UN marker not found');
    return null;
  }
  text = text.substring(unIndex);

  // Large packaging can have multiple format variations
  // Try to split by slash first
  const parts = text
    .split(/\s*[\/|I1]\s*/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  console.log('Split parts:', parts);

  // Large packaging format variations:
  // Variation 1: UN / 50A/X/05 05/USA/M9399/2500/1000
  //   - Parts: [UN, "50A", "X", "05 05", "USA", "M9399", "2500", "1000"]
  // Variation 2: UN / 50A / X / 05/05 / USA / M9399 / 2500 / 1000
  //   - Parts: [UN, "50A", "X", "05", "05", "USA", "M9399", "2500", "1000"]

  if (parts.length < 6) {
    console.log('Not enough parts for large packaging');
    return null;
  }

  let fieldB = '';
  let fieldC = '';
  let fieldD = '';
  let fieldE = '';
  let fieldF = '';
  let fieldG = '';
  let fieldH = '';

  // Field A is always "UN"
  // Field B is the packaging code (50A, 51, etc.)
  fieldB = cleanPackagingCode(parts[1] || '');

  // Field C is packing group
  fieldC = cleanPackingGroup(parts[2] || '');

  // Now we need to find the date field (MM/YY or MM YY)
  // It could be in parts[3], or split across parts[3] and parts[4]
  if (parts[3] && /\d{2}[\/\s]\d{2}/.test(parts[3])) {
    // Date is in one part: "05/05" or "05 05"
    fieldD = parts[3].replace(/\s+/g, '/');
    fieldE = cleanCountryCode(parts[4] || '');
    fieldF = cleanManufacturerSymbol(parts[5] || '');
    fieldG = parts[6] || '';
    fieldH = parts[7] || '';
  } else if (parts[3] && parts[4] && /^\d{2}$/.test(parts[3]) && /^\d{2}$/.test(parts[4])) {
    // Date is split: "05" "/" "05"
    fieldD = `${parts[3]}/${parts[4]}`;
    fieldE = cleanCountryCode(parts[5] || '');
    fieldF = cleanManufacturerSymbol(parts[6] || '');
    fieldG = parts[7] || '';
    fieldH = parts[8] || '';
  } else {
    console.log('Could not parse date field');
    return null;
  }

  const fields: LargePackagingFields = {
    type: POPMarkingType.LARGE_PACKAGING,
    A: 'UN',
    B: fieldB,
    C: fieldC,
    D: fieldD, // MM/YY format
    E: fieldE, // Country code
    F: fieldF, // Manufacturer
    G: fieldG, // Stack test load (kg)
    H: fieldH, // Max gross/net mass (kg)
  };

  console.log('Parsed large packaging fields:', fields);
  console.log('=== parseLargePackaging END ===');
  return fields;
}

/**
 * Main parser function - extracts POP marking fields from OCR text
 * @deprecated Use type-specific parsers instead (parseNonBulkSolid, parseNonBulkLiquid, parseLargePackaging)
 */
export function parsePOPMarkingText(ocrText: string): POPMarkingFieldsLegacy | null {
  console.log('=== parsePOPMarkingText START ===');
  console.log('Raw OCR input:', ocrText);

  if (!ocrText || ocrText.trim().length === 0) {
    console.log('❌ Empty input text');
    return null;
  }

  // Normalize text
  let text = ocrText.toUpperCase().trim();
  console.log('After uppercase + trim:', text);

  // Find the UN marker to locate the start of the POP marking
  const unIndex = text.indexOf('UN');
  console.log('UN index:', unIndex);

  if (unIndex === -1) {
    // Try to find just "U" followed by "N" with possible space
    const unMatch = text.match(/U\s*N/);
    console.log('UN regex match:', unMatch);
    if (!unMatch) {
      console.log('❌ Could not find UN marker');
      return null;
    }
    text = text.substring(unMatch.index || 0);
    console.log('After extracting from UN match:', text);
  } else {
    text = text.substring(unIndex);
    console.log('After extracting from UN index:', text);
  }

  // Normalize UN format: Handle cases where UN is in parentheses or lacks slash separator
  // This fixes parsing issues with formats like "(UN) 1A1" or "UN) 1A1" or "UN 1A1"
  const textBeforeNormalization = text;

  // Remove opening parenthesis if UN was inside parentheses
  text = text.replace(/^\(UN/i, 'UN');

  // Replace closing parenthesis and space after UN with " / "
  text = text.replace(/^UN\)\s*/i, 'UN / ');

  // Replace space between UN and alphanumeric (no slash) with " / "
  text = text.replace(/^UN\s+([A-Z0-9])/i, 'UN / $1');

  // Replace direct concatenation (no space, no slash) with " / "
  text = text.replace(/^(UN)([A-Z0-9])/i, '$1 / $2');

  if (text !== textBeforeNormalization) {
    console.log('Text normalized from:', textBeforeNormalization);
    console.log('Text normalized to:', text);
  }

  // Split by delimiter (forward slash with optional surrounding spaces)
  // Also handle cases where OCR might read "/" as "I" or "1" or "|"
  // Multi-pass approach for better accuracy
  const textBeforeReplacement = text;
  let parts = text
    // Pass 1: Replace obvious delimiters (spaces on both sides)
    .replace(/\s+[|I1]\s+/g, ' / ')
    // Pass 2: Replace when surrounded by non-alphanumeric characters
    .replace(/([^A-Z0-9])[|I1]([^A-Z0-9])/g, '$1/$2')
    // Pass 3: **NEW** - Handle single letter + [I1|] + space + digit pattern
    // This specifically fixes "SI 23" → "S / 23", "S1 99" → "S / 99", etc.
    .replace(/([A-Z])[I1|](\s+\d)/g, '$1 /$2')
    .split(/\s*\/\s*/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  console.log('Text before delimiter replacement:', textBeforeReplacement);
  console.log('Split parts:', JSON.stringify(parts, null, 2));
  console.log('Number of parts:', parts.length);

  if (parts.length < 2) {
    // Try alternative parsing - maybe spaces instead of slashes
    // In this case, we expect: UN 1A1 X 25 S 23 USA DOD
    const spaceParts = text.split(/\s+/).filter(p => p.length > 0);
    if (spaceParts.length >= 4) {
      return {
        A: 'UN',
        B: cleanPackagingCode(spaceParts[1] || ''),
        C: cleanPackingGroup(spaceParts[2] || ''),
        D: cleanNumericField(spaceParts[3] || ''),
        E: cleanNumericField(spaceParts[4] || ''),
        F: cleanYear(spaceParts[5] || ''),
        G: cleanCountryCode(spaceParts[6] || ''),
        H: cleanManufacturerSymbol(spaceParts[7] || ''),
      };
    }
    return null;
  }

  // **NEW** - Add field recovery for non-bulk packaging (should have 7 parts)
  // Format: [UN, Code, "PG Mass", E, Year, Country, Mfr]
  // If we have fewer than 7 parts, attempt to recover merged fields
  let originalPartsCount = parts.length;
  if (parts.length < 7 && parts.length >= 2) {
    console.log('⚠️ WARNING: Insufficient parts for standard non-bulk packaging');
    console.log(`  Expected: 7 parts, Got: ${parts.length} parts`);
    console.log('  Attempting field recovery...');
    parts = attemptFieldRecovery(parts, text);
    console.log(`  After recovery: ${parts.length} parts`);
    if (parts.length !== originalPartsCount) {
      console.log('✓ Field recovery successful!');
    } else {
      console.log('⚠️ Field recovery did not change part count');
    }
  }

  // Map parts to fields
  // IMPORTANT: Field C and D are in the SAME slash-delimited section!
  // parts[0] = "UN" → Field A
  // parts[1] = "1A1" → Field B (packaging code)
  // parts[2] = "X 25" → Field C (packing group) + Field D (mass/density) - split by space!
  // parts[3] = "S" → Field E (test pressure or S)
  // parts[4] = "23" → Field F (year)
  // parts[5] = "USA" → Field G (country)
  // parts[6] = "DOD" → Field H (manufacturer)

  // Split the combined C/D field by space OR extract C/D if concatenated
  const cdSection = parts[2] || '';
  console.log('CD section (parts[2]):', cdSection);

  let fieldC = '';
  let fieldD = '';

  // Strategy 1: Try to split by space (standard format: "X 250", "Y 7.4")
  const cdParts = cdSection.trim().split(/\s+/);
  console.log('CD parts after space split:', cdParts);

  if (cdParts.length >= 2) {
    // Found space-separated C and D: "X 250" → ["X", "250"]
    fieldC = cdParts[0] || '';
    fieldD = cdParts[1] || '';
    console.log('✓ Found space-separated C/D:', { fieldC, fieldD });
  } else {
    // Strategy 2: No space - try to extract C from concatenated format
    // Pattern: Single letter (X/Y/Z) followed by number (e.g., "X250", "Y7.4")
    const concatenatedMatch = cdSection.match(/^([XYZ])(\d+(?:\.\d+)?)$/i);

    if (concatenatedMatch) {
      fieldC = concatenatedMatch[1];
      fieldD = concatenatedMatch[2];
      console.log('✓ Extracted from concatenated format:', { fieldC, fieldD });
    } else {
      // Strategy 3: Only Field C present, D might be in next section
      fieldC = cdParts[0] || '';
      fieldD = ''; // Will check if D is in parts[3] below
      console.log('⚠️ Only Field C found in parts[2]:', fieldC);
    }
  }

  // **FIX** - Handle case where C and D are split into separate sections
  // Example: "X/" and "250" OR "X" and "250" (with/without trailing slash)
  // If Field D is empty AND parts[3] is a numeric value, Field D was likely split
  if (!fieldD && parts[3] && /^\d+(\.\d+)?$/.test(parts[3])) {
    console.log('⚠️ WARNING: Field C and D appear to be split across sections');
    console.log(`  parts[2] = "${parts[2]}" (only has Field C)`);
    console.log(`  parts[3] = "${parts[3]}" (appears to be Field D, not Field E)`);
    console.log('  Attempting to merge C and D...');

    // Field D is actually in parts[3]
    fieldD = parts[3];

    // Shift all remaining fields down by one position
    console.log('  Shifting fields: E→F→G→H');
    // This will be handled by reassigning fieldE, fieldF, etc. below
  }

  // **NEW** - Validate Field E (parts[3]) for pattern errors (failsafe check)
  // This catches cases where delimiter replacement and field recovery missed the issue
  // If we detected C/D split, we need to shift field indices
  let fieldE, fieldF, fieldG, fieldH;

  // Check if we recovered Field D from parts[3] (indicating C/D split)
  const cdWasSplit = fieldD === parts[3];

  if (cdWasSplit) {
    // C/D were split - shift all fields by one position
    console.log('  Using shifted field indices (C/D split detected)');
    fieldE = parts[4] || '';  // E moved from parts[3] to parts[4]
    fieldF = parts[5] || '';  // F moved from parts[4] to parts[5]
    fieldG = parts[6] || '';  // G moved from parts[5] to parts[6]
    fieldH = parts[7] || '';  // H moved from parts[6] to parts[7]
  } else {
    // Normal field positions
    fieldE = parts[3] || '';
    fieldF = parts[4] || '';
    fieldG = parts[5] || '';
    fieldH = parts[6] || '';
  }

  // Check if Field E looks like it has merged with Field F
  // Pattern: "SI 23" or "S 23" or "S123" or "S1 99" etc.
  if (/^[S5$][I1|]?\s*\d{2}$/i.test(fieldE)) {
    console.log('⚠️ WARNING: Field E appears to contain merged year:', fieldE);
    const splitMatch = fieldE.match(/^([S5$])[I1|]?\s*(\d{2})$/i);
    if (splitMatch) {
      const cleanedE = splitMatch[1].toUpperCase();
      const extractedYear = splitMatch[2];
      console.log(`  Detected merge: E="${fieldE}" → E="${cleanedE}", F="${extractedYear}"`);
      console.log('  Shifting fields to correct positions...');

      // Update field values and shift remaining fields
      fieldE = cleanedE;
      fieldF = extractedYear;
      fieldG = parts[4] || '';  // Country (was at wrong position)
      fieldH = parts[5] || '';  // Manufacturer (was at wrong position)

      console.log('  ✓ Fields corrected:');
      console.log(`    E = "${fieldE}" (was "${splitMatch[0]}")`);
      console.log(`    F = "${fieldF}" (was "${parts[4]}")`);
      console.log(`    G = "${fieldG}" (was "${parts[5]}")`);
      console.log(`    H = "${fieldH}" (was "${parts[6]}")`);
    }
  }

  const fields = {
    A: 'UN', // Always UN
    B: cleanPackagingCode(parts[1] || ''),
    C: cleanPackingGroup(fieldC),
    D: cleanNumericField(fieldD),
    E: cleanNumericField(fieldE),
    F: cleanYear(fieldF),
    G: cleanCountryCode(fieldG),
    H: cleanManufacturerSymbol(fieldH),
  };

  console.log('Extracted fields:');
  console.log('  A (UN):', fields.A);
  console.log('  B (Packaging code):', fields.B, '← from parts[1]:', parts[1]);
  console.log('  C (Packing group):', fields.C, '← from fieldC:', fieldC);
  console.log('  D (Mass/density):', fields.D, '← from fieldD:', fieldD);
  console.log('  E (Test pressure/S):', fields.E, '← from parts[3]:', parts[3]);
  console.log('  F (Year):', fields.F, '← from parts[4]:', parts[4]);
  console.log('  G (Country):', fields.G, '← from parts[5]:', parts[5]);
  console.log('  H (Manufacturer):', fields.H, '← from parts[6]:', parts[6]);
  console.log('=== parsePOPMarkingText END ===');

  return fields;
}

/**
 * Validates parsed POP marking fields (type-aware validation)
 * Returns array of validation issues specific to the marking type
 */
export function validatePOPMarkingFields(fields: POPMarkingFields | POPMarkingFieldsLegacy): string[] {
  const issues: string[] = [];

  // Type-aware validation
  if ('type' in fields) {
    // New type-aware validation
    const typed = fields as POPMarkingFields;

    // Common validations for all types
    if (!typed.B) {
      issues.push('Packaging code (Field B) is required');
    } else if (!/^[A-Z0-9]{2,5}$/.test(typed.B)) {
      issues.push('Packaging code (Field B) format appears invalid');
    }

    if (!typed.C) {
      issues.push('Packing Group (Field C) is required');
    } else if (!['X', 'Y', 'Z'].includes(typed.C)) {
      issues.push('Packing Group (Field C) must be X, Y, or Z');
    }

    // Type-specific validations
    switch (typed.type) {
      case POPMarkingType.NON_BULK_SOLID:
        if (!typed.D) {
          issues.push('Maximum gross mass (Field D) is required');
        }
        if (typed.E !== 'S') {
          issues.push('Field E must be "S" for solid/combination packaging');
        }
        if (!typed.F || !/^\d{2}$/.test(typed.F)) {
          issues.push('Year (Field F) must be 2 digits');
        }
        if (!typed.G) {
          issues.push('Country code (Field G) is required');
        }
        if (!typed.H) {
          issues.push('Manufacturer symbol (Field H) is required');
        }
        break;

      case POPMarkingType.NON_BULK_LIQUID:
        // Field D (density) may be omitted if ≤ 1.2
        if (typed.D && !/^\d*\.?\d+$/.test(typed.D)) {
          issues.push('Relative density (Field D) must be numeric');
        }
        if (!typed.E || !/^\d+$/.test(typed.E)) {
          issues.push('Test pressure (Field E) must be numeric for liquid packaging');
        } else {
          const pressure = parseInt(typed.E, 10);
          if (pressure < 50 || pressure > 1000) {
            issues.push('Test pressure (Field E) should be between 50-1000 kPa');
          }
        }
        if (!typed.F || !/^\d{2}$/.test(typed.F)) {
          issues.push('Year (Field F) must be 2 digits');
        }
        if (!typed.G) {
          issues.push('Country code (Field G) is required');
        }
        if (!typed.H) {
          issues.push('Manufacturer symbol (Field H) is required');
        }
        break;

      case POPMarkingType.LARGE_PACKAGING:
        if (!typed.D || !/\d{2}[\/\s]\d{2}/.test(typed.D)) {
          issues.push('Manufacture date (Field D) must be in MM/YY format');
        }
        if (!typed.E) {
          issues.push('Country code (Field E) is required for large packaging');
        }
        if (!typed.F) {
          issues.push('Manufacturer symbol (Field F) is required');
        }
        if (!typed.G || !/^\d+$/.test(typed.G)) {
          issues.push('Stack test load (Field G) must be numeric');
        }
        if (!typed.H || !/^\d+$/.test(typed.H)) {
          issues.push('Maximum gross/net mass (Field H) must be numeric');
        }
        break;

      case POPMarkingType.UNKNOWN:
        issues.push('Unable to determine POP marking type');
        break;
    }
  } else {
    // Legacy validation (backward compatibility)
    const legacy = fields as POPMarkingFieldsLegacy;

    if (!legacy.B) {
      issues.push('Packaging code (Field B) is required');
    } else if (!/^[A-Z0-9]{2,5}$/.test(legacy.B)) {
      issues.push('Packaging code (Field B) format appears invalid');
    }

    if (!legacy.C) {
      issues.push('Packing Group (Field C) is required');
    } else if (!['X', 'Y', 'Z'].includes(legacy.C)) {
      issues.push('Packing Group (Field C) must be X, Y, or Z');
    }

    if (!legacy.D) {
      issues.push('Maximum gross mass/density (Field D) is required');
    }

    if (!legacy.F) {
      issues.push('Year of manufacture (Field F) is required');
    } else if (!/^\d{2}$/.test(legacy.F)) {
      issues.push('Year (Field F) must be 2 digits');
    }

    if (!legacy.G) {
      issues.push('Country code (Field G) is required');
    }

    if (!legacy.H) {
      issues.push('Manufacturer symbol (Field H) is required');
    }
  }

  return issues;
}

/**
 * Attempts to extract POP marking from various text formats
 * Uses type detection to route to appropriate parser
 * Returns type-aware parsed fields with confidence and issues
 */
export function extractPOPMarkingFromText(ocrText: string): {
  fields: POPMarkingFields | null;
  confidence: number;
  issues: string[];
  detectedType: POPMarkingType;
  matchedText: string | null;
} {
  console.log('\n=== extractPOPMarkingFromText START ===');
  console.log('Input OCR text:', ocrText);

  // **CRITICAL**: Normalize delimiter spacing FIRST
  // This handles all spacing variations: "UN/1A1", "UN / 1A1", "UN 1A1 /Y", etc.
  // Converts everything to canonical format: " / " (space-slash-space)
  const normalizedText = normalizeDelimiters(ocrText);
  console.log('After normalization:', normalizedText);

  // Track the text that was matched for exclusion from other extractors
  let matchedText: string | null = null;

  // Step 1: Detect the type of POP marking (using normalized text)
  const detectedType = detectPOPMarkingType(normalizedText);
  console.log('Detected type:', detectedType);

  // Step 2: Route to appropriate type-specific parser (using normalized text)
  let fields: POPMarkingFields | null = null;

  switch (detectedType) {
    case POPMarkingType.NON_BULK_SOLID:
      fields = parseNonBulkSolid(normalizedText);
      break;

    case POPMarkingType.NON_BULK_LIQUID:
      fields = parseNonBulkLiquid(normalizedText);
      break;

    case POPMarkingType.LARGE_PACKAGING:
      fields = parseLargePackaging(normalizedText);
      break;

    case POPMarkingType.UNKNOWN:
      // Fallback: try non-bulk solid parser as best effort
      console.log('Type unknown, attempting fallback parse as non-bulk solid');
      const legacyFields = parsePOPMarkingText(normalizedText);
      if (legacyFields) {
        // Convert to best-guess type
        fields = {
          type: POPMarkingType.UNKNOWN,
          A: legacyFields.A,
          B: legacyFields.B,
          C: legacyFields.C,
          D: legacyFields.D,
          E: 'S',
          F: legacyFields.F,
          G: legacyFields.G,
          H: legacyFields.H,
        } as NonBulkSolidFields;
      }
      break;
  }

  if (!fields) {
    console.log('❌ Parsing failed - no fields extracted');
    return {
      fields: null,
      confidence: 0,
      issues: ['Could not locate POP marking in text. Look for format: UN / code / X|Y|Z / number / ...'],
      detectedType: POPMarkingType.UNKNOWN,
      matchedText: null
    };
  }

  console.log('✓ Fields extracted successfully');

  // Capture the normalized text that was successfully parsed
  // This allows other extractors to exclude this text to prevent false positives
  matchedText = normalizedText;

  // Step 3: Validate fields (type-aware validation)
  const issues = validatePOPMarkingFields(fields);
  console.log('Validation issues:', issues);

  // Step 4: Calculate confidence score (type-aware)
  let confidence = 1.0;

  // Deduct for type uncertainty
  if (detectedType === POPMarkingType.UNKNOWN) {
    confidence -= 0.3;
    issues.push('Could not definitively determine POP marking type');
  }

  // Common field validations
  if (!fields.B) {
    confidence -= 0.3;
  } else {
    // Type-specific packaging code validation
    switch (detectedType) {
      case POPMarkingType.LARGE_PACKAGING:
        // Large packaging codes: 50A, 50B, 51, etc.
        if (/^5[01][A-Z]?/.test(fields.B)) {
          confidence += 0.1; // Bonus for correct pattern
        } else {
          confidence -= 0.2; // Penalty for mismatch
        }
        break;

      case POPMarkingType.NON_BULK_SOLID:
      case POPMarkingType.NON_BULK_LIQUID:
        // Non-bulk codes: 1A1, 4G, 6HG1, etc.
        if (/^[1-6][A-Z][A-Z0-9]{0,3}$/.test(fields.B)) {
          confidence += 0.1; // Bonus for correct pattern
        }
        break;
    }
  }

  if (!fields.C || !['X', 'Y', 'Z'].includes(fields.C)) {
    confidence -= 0.2;
  }

  // Type-specific field validations
  switch (fields.type) {
    case POPMarkingType.NON_BULK_SOLID:
      if (!fields.D) confidence -= 0.1;
      if (fields.E !== 'S') confidence -= 0.2;
      if (!fields.F || !/^\d{2}$/.test(fields.F)) confidence -= 0.1;
      if (!fields.G) confidence -= 0.1;
      if (!fields.H) confidence -= 0.1;
      break;

    case POPMarkingType.NON_BULK_LIQUID:
      // Field D (density) is optional if ≤1.2
      if (fields.D && !/^\d*\.?\d+$/.test(fields.D)) confidence -= 0.1;
      if (!fields.E || !/^\d+$/.test(fields.E)) confidence -= 0.2;
      if (!fields.F || !/^\d{2}$/.test(fields.F)) confidence -= 0.1;
      if (!fields.G) confidence -= 0.1;
      if (!fields.H) confidence -= 0.1;
      break;

    case POPMarkingType.LARGE_PACKAGING:
      if (!fields.D || !/\d{2}[\/\s]\d{2}/.test(fields.D)) confidence -= 0.2;
      if (!fields.E) confidence -= 0.1;
      if (!fields.F) confidence -= 0.1;
      if (!fields.G || !/^\d+$/.test(fields.G)) confidence -= 0.1;
      if (!fields.H || !/^\d+$/.test(fields.H)) confidence -= 0.1;
      break;

    case POPMarkingType.UNKNOWN:
      confidence -= 0.2; // Additional penalty for unknown type
      break;
  }

  // Clamp confidence to [0, 1]
  confidence = Math.max(0, Math.min(1, confidence));

  console.log('Final confidence score:', confidence);
  console.log('Final result:', { fields, confidence, issues, detectedType });
  console.log('=== extractPOPMarkingFromText END ===\n');

  return {
    fields,
    confidence,
    issues,
    detectedType,
    matchedText
  };
}
