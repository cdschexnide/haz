/**
 * OCR Service for ML Detection Pipeline
 *
 * Provides text recognition using @react-native-ml-kit/text-recognition
 * and extraction of meaningful data from package markings.
 */

import TextRecognition from '@react-native-ml-kit/text-recognition';
import {
  extractPOPMarkingFromText,
  POPMarkingType,
} from '@/utils/popMarkingParser';
import type {
  ImageOCRResult,
  OCRTextBlock,
  OCRTextLine,
  ExtractedMarkings,
  ParsedPOPMarking,
  ExtractedWeight,
} from '../types/ocr';

/**
 * Perform OCR on an image using ML Kit Text Recognition
 *
 * @param imageUri - URI of the image to process
 * @returns OCR result with full text and text blocks, or null if failed
 */
export async function performOCR(imageUri: string): Promise<ImageOCRResult | null> {
  try {
    console.log('[OCR] Starting text recognition for:', imageUri);
    const startTime = Date.now();

    const result = await TextRecognition.recognize(imageUri);
    const processingTime = Date.now() - startTime;

    console.log('[OCR] Recognition complete in', processingTime, 'ms');
    console.log('[OCR] Full text length:', result.text?.length || 0);

    // Map ML Kit blocks to our format
    const textBlocks: OCRTextBlock[] = result.blocks.map(block => ({
      text: block.text,
      boundingBox: block.boundingBox
        ? {
            x: block.boundingBox.left,
            y: block.boundingBox.top,
            width: block.boundingBox.width,
            height: block.boundingBox.height,
          }
        : null,
    }));

    // Extract line-level data for more precise extraction
    const textLines: OCRTextLine[] = result.blocks.flatMap(block =>
      (block.lines || []).map(line => ({
        text: line.text,
        boundingBox: line.boundingBox
          ? {
              x: line.boundingBox.left,
              y: line.boundingBox.top,
              width: line.boundingBox.width,
              height: line.boundingBox.height,
            }
          : null,
      }))
    );

    console.log('[OCR] Extracted', textBlocks.length, 'text blocks,', textLines.length, 'text lines');

    return {
      fullText: result.text || '',
      textBlocks,
      textLines,
      processingTime,
    };
  } catch (error) {
    console.error('[OCR] Recognition failed:', error);
    return null;
  }
}

/**
 * Extract UN identification numbers from text
 * Matches patterns like "UN1203", "UN 1203", "UN-1203"
 *
 * @param text - Text to search
 * @returns Array of unique UN numbers found
 */
export function extractUNNumbers(text: string): string[] {
  if (!text) return [];

  let upperText = text.toUpperCase();

  // OCR fix: Replace O with 0 in UN number context (e.g., "UNO106" → "UN0106")
  // This handles common OCR misreads where zero is read as letter O
  upperText = upperText.replace(/\bUN([O0])(\d{3})\b/g, 'UN0$2');
  upperText = upperText.replace(/\bUN(\d)([O0])(\d{2})\b/g, 'UN$10$3');
  upperText = upperText.replace(/\bUN(\d{2})([O0])(\d)\b/g, 'UN$10$3');
  upperText = upperText.replace(/\bUN(\d{3})([O0])\b/g, 'UN$10');

  // Pattern: UN followed by optional separator and 4 digits
  const unPattern = /UN[\s\-]*(\d{4})/gi;
  const matches = [...upperText.matchAll(unPattern)];

  // Deduplicate and format consistently
  const unNumbers = [...new Set(matches.map(m => `UN${m[1]}`))];

  if (unNumbers.length > 0) {
    console.log('[OCR] Found UN numbers:', unNumbers);
  }

  return unNumbers;
}

/**
 * Extract EX classification numbers from text
 * Matches patterns like "EX-2019037142", "EX 2019037142", "EX2019037142"
 *
 * @param text - Text to search
 * @returns Array of unique EX numbers found (formatted as "EX-XXXXXXXXXX")
 */
export function extractEXNumbers(text: string): string[] {
  if (!text) return [];

  const upperText = text.toUpperCase();

  // Pattern: EX followed by optional separator and 7-12 digits
  const exPattern = /EX[\s\-]*(\d{7,12})/gi;
  const matches = [...upperText.matchAll(exPattern)];

  // Format consistently as "EX-XXXXXXXXXX"
  const exNumbers = [...new Set(matches.map(m => `EX-${m[1]}`))];

  if (exNumbers.length > 0) {
    console.log('[OCR] Found EX numbers:', exNumbers);
  }

  return exNumbers;
}

/**
 * Extract UN numbers with their associated Proper Shipping Names
 * Matches patterns like "UN0106 FUZES DETONATING" on single lines
 *
 * @param lines - Array of OCR text lines
 * @returns Array of UN+PSN pairs
 */
export function extractUNWithPSN(lines: { text: string }[]): { un: string; psn: string }[] {
  const results: { un: string; psn: string }[] = [];

  // Pattern: UN + 4 digits + remaining uppercase text (PSN)
  // Note: OCR often confuses 0/O, so we normalize before matching
  const unPsnPattern = /UN[\s\-]*(\d{4})\s+([A-Z][A-Z\s,\-]+)/gi;

  for (const line of lines) {
    let text = line.text.toUpperCase();

    // OCR fix: Replace O with 0 in UN number context (e.g., "UNO106" → "UN0106")
    // This handles common OCR misreads where zero is read as letter O
    text = text.replace(/\bUN([O0])(\d{3})\b/gi, 'UN0$2');
    text = text.replace(/\bUN(\d)([O0])(\d{2})\b/gi, 'UN$10$3');
    text = text.replace(/\bUN(\d{2})([O0])(\d)\b/gi, 'UN$10$3');
    text = text.replace(/\bUN(\d{3})([O0])\b/gi, 'UN$10');

    const matches = [...text.matchAll(unPsnPattern)];

    for (const match of matches) {
      const un = `UN${match[1]}`;
      // Clean PSN: trim, collapse spaces, remove trailing punctuation
      const psn = match[2].trim().replace(/\s+/g, ' ').replace(/[,\-\s]+$/, '');

      if (psn.length >= 3) {  // Minimum PSN length
        results.push({ un, psn });
        console.log('[OCR] Found UN+PSN:', un, psn);
      }
    }
  }

  return results;
}

/**
 * Extract weight/mass values from text
 * Matches patterns like "25 KG", "25KG", "25 KILOGRAMS"
 *
 * @param text - Text to search
 * @returns Array of extracted weight values with units
 */
export function extractWeights(text: string): ExtractedWeight[] {
  if (!text) return [];

  const upperText = text.toUpperCase();

  // Pattern: number (with optional decimal) followed by weight unit
  const weightPattern =
    /(\d+(?:\.\d+)?)\s*(KG|G|LB|OZ|KILOGRAMS?|GRAMS?|POUNDS?|OUNCES?)\b/gi;
  const matches = [...upperText.matchAll(weightPattern)];

  const weights: ExtractedWeight[] = matches.map(m => ({
    value: m[1],
    unit: normalizeWeightUnit(m[2]),
  }));

  if (weights.length > 0) {
    console.log('[OCR] Found weights:', weights);
  }

  return weights;
}

/**
 * Normalize weight unit to standard form
 */
function normalizeWeightUnit(unit: string): ExtractedWeight['unit'] {
  const upper = unit.toUpperCase();
  if (upper.startsWith('KG') || upper.startsWith('KILOGRAM')) return 'KG';
  if (upper === 'G' || upper.startsWith('GRAM')) return 'G';
  if (upper.startsWith('LB') || upper.startsWith('POUND')) return 'LB';
  if (upper.startsWith('OZ') || upper.startsWith('OUNCE')) return 'OZ';
  return 'KG'; // Default
}

/**
 * Extract hazard class indicators from text
 * Matches patterns like "CLASS 3", "CLASS 6.1", "2.1", "DIVISION 4.2"
 *
 * @param text - Text to search
 * @returns Array of unique hazard class indicators
 */
export function extractHazardClasses(text: string): string[] {
  if (!text) return [];

  const upperText = text.toUpperCase();
  const hazardClasses: string[] = [];

  // Pattern 1: "CLASS X" or "CLASS X.X"
  const classPattern = /CLASS\s*(\d(?:\.\d)?)/gi;
  const classMatches = [...upperText.matchAll(classPattern)];
  hazardClasses.push(...classMatches.map(m => m[1]));

  // Pattern 2: "DIVISION X.X"
  const divisionPattern = /DIVISION\s*(\d\.\d)/gi;
  const divisionMatches = [...upperText.matchAll(divisionPattern)];
  hazardClasses.push(...divisionMatches.map(m => m[1]));

  // Pattern 3: Standalone hazard class numbers (more restrictive)
  // Only match if preceded by specific keywords or at word boundary
  const standalonePattern = /(?:HAZARD|HAZ|CLASS|DIV)\s*:?\s*(\d(?:\.\d)?)/gi;
  const standaloneMatches = [...upperText.matchAll(standalonePattern)];
  hazardClasses.push(...standaloneMatches.map(m => m[1]));

  // Filter to valid hazard classes (1-9, with optional .1-.9 subdivision)
  const validClasses = hazardClasses.filter(c => {
    const num = parseFloat(c);
    return num >= 1 && num < 10;
  });

  // Deduplicate
  const unique = [...new Set(validClasses)];

  if (unique.length > 0) {
    console.log('[OCR] Found hazard classes:', unique);
  }

  return unique;
}

/**
 * Extract date patterns from text
 * Matches patterns like "05/23", "05-23", "2023", "05/2023"
 *
 * @param text - Text to search
 * @returns Array of unique date strings
 */
export function extractDates(text: string): string[] {
  if (!text) return [];

  // Pattern: MM/YY, MM-YY, MM/YYYY, YYYY
  const datePattern = /\b(\d{1,2}[\/\-]\d{2,4})\b|\b(20\d{2})\b/g;
  const matches = [...text.matchAll(datePattern)];

  const dates = matches.map(m => m[1] || m[2]).filter(Boolean);

  // Deduplicate
  const unique = [...new Set(dates)];

  if (unique.length > 0) {
    console.log('[OCR] Found dates:', unique);
  }

  return unique;
}

/**
 * Extract country of origin from text
 * Looks for common country codes and names
 *
 * @param text - Text to search
 * @returns Country code if found, null otherwise
 */
export function extractCountryOfOrigin(text: string): string | null {
  if (!text) return null;

  const upperText = text.toUpperCase();

  // Common shipping country codes (prioritized list)
  const countryCodes = [
    'USA',
    'US',
    'UK',
    'GB',
    'GREAT BRITAIN',
    'CN',
    'CHINA',
    'DE',
    'GERMANY',
    'JP',
    'JAPAN',
    'KR',
    'KOREA',
    'CA',
    'CANADA',
    'MX',
    'MEXICO',
    'AU',
    'AUSTRALIA',
    'FR',
    'FRANCE',
    'IT',
    'ITALY',
    'ES',
    'SPAIN',
    'NL',
    'NETHERLANDS',
    'BE',
    'BELGIUM',
    'CH',
    'SWITZERLAND',
    'SE',
    'SWEDEN',
    'NO',
    'NORWAY',
    'DK',
    'DENMARK',
    'FI',
    'FINLAND',
    'PL',
    'POLAND',
    'CZ',
    'CZECH',
    'AT',
    'AUSTRIA',
    'IE',
    'IRELAND',
    'PT',
    'PORTUGAL',
    'BR',
    'BRAZIL',
    'IN',
    'INDIA',
    'TW',
    'TAIWAN',
    'SG',
    'SINGAPORE',
    'HK',
    'HONG KONG',
    'TH',
    'THAILAND',
    'VN',
    'VIETNAM',
    'MY',
    'MALAYSIA',
    'ID',
    'INDONESIA',
    'PH',
    'PHILIPPINES',
  ];

  // Look for "MADE IN X" or "ORIGIN: X" patterns first
  const madeInPattern = /MADE\s+IN\s+([A-Z]+)/i;
  const originPattern = /ORIGIN[:\s]+([A-Z]+)/i;

  const madeInMatch = upperText.match(madeInPattern);
  if (madeInMatch) {
    const country = normalizeCountryCode(madeInMatch[1]);
    if (country) {
      console.log('[OCR] Found country (MADE IN):', country);
      return country;
    }
  }

  const originMatch = upperText.match(originPattern);
  if (originMatch) {
    const country = normalizeCountryCode(originMatch[1]);
    if (country) {
      console.log('[OCR] Found country (ORIGIN):', country);
      return country;
    }
  }

  // Fall back to searching for country codes as standalone words
  for (const code of countryCodes) {
    const regex = new RegExp(`\\b${code}\\b`, 'i');
    if (regex.test(upperText)) {
      const normalized = normalizeCountryCode(code);
      if (normalized) {
        console.log('[OCR] Found country code:', normalized);
        return normalized;
      }
    }
  }

  return null;
}

/**
 * Normalize country name to ISO code
 */
function normalizeCountryCode(input: string): string | null {
  const upper = input.toUpperCase().trim();

  const mapping: Record<string, string> = {
    USA: 'USA',
    US: 'USA',
    'UNITED STATES': 'USA',
    UK: 'GB',
    GB: 'GB',
    'GREAT BRITAIN': 'GB',
    'UNITED KINGDOM': 'GB',
    CN: 'CN',
    CHINA: 'CN',
    DE: 'DE',
    GERMANY: 'DE',
    JP: 'JP',
    JAPAN: 'JP',
    KR: 'KR',
    KOREA: 'KR',
    'SOUTH KOREA': 'KR',
    CA: 'CA',
    CANADA: 'CA',
    MX: 'MX',
    MEXICO: 'MX',
    AU: 'AU',
    AUSTRALIA: 'AU',
    FR: 'FR',
    FRANCE: 'FR',
    IT: 'IT',
    ITALY: 'IT',
    ES: 'ES',
    SPAIN: 'ES',
    NL: 'NL',
    NETHERLANDS: 'NL',
    BE: 'BE',
    BELGIUM: 'BE',
    CH: 'CH',
    SWITZERLAND: 'CH',
    SE: 'SE',
    SWEDEN: 'SE',
    NO: 'NO',
    NORWAY: 'NO',
    DK: 'DK',
    DENMARK: 'DK',
    FI: 'FI',
    FINLAND: 'FI',
    PL: 'PL',
    POLAND: 'PL',
    CZ: 'CZ',
    CZECH: 'CZ',
    AT: 'AT',
    AUSTRIA: 'AT',
    IE: 'IE',
    IRELAND: 'IE',
    PT: 'PT',
    PORTUGAL: 'PT',
    BR: 'BR',
    BRAZIL: 'BR',
    IN: 'IN',
    INDIA: 'IN',
    TW: 'TW',
    TAIWAN: 'TW',
    SG: 'SG',
    SINGAPORE: 'SG',
    HK: 'HK',
    'HONG KONG': 'HK',
    TH: 'TH',
    THAILAND: 'TH',
    VN: 'VN',
    VIETNAM: 'VN',
    MY: 'MY',
    MALAYSIA: 'MY',
    ID: 'ID',
    INDONESIA: 'ID',
    PH: 'PH',
    PHILIPPINES: 'PH',
  };

  return mapping[upper] || null;
}

/**
 * Extract other significant markings from text
 * Catches important shipping/hazmat terms that don't fit other categories
 *
 * @param text - Text to search
 * @returns Array of significant marking strings
 */
export function extractOtherMarkings(text: string): string[] {
  if (!text) return [];

  const upperText = text.toUpperCase();
  const markings: string[] = [];

  // Important shipping/hazmat keywords to look for
  const keywords = [
    'FLAMMABLE',
    'CORROSIVE',
    'OXIDIZER',
    'POISON',
    'TOXIC',
    'EXPLOSIVE',
    'RADIOACTIVE',
    'INFECTIOUS',
    'DANGEROUS',
    'HAZARDOUS',
    'LIMITED QUANTITY',
    'LTD QTY',
    'EXCEPTED QUANTITY',
    'OVERPACK',
    'INNER PACKAGES',
    'ORIENTATION',
    'THIS WAY UP',
    'DO NOT DROP',
    'FRAGILE',
    'HANDLE WITH CARE',
    'KEEP DRY',
    'KEEP FROZEN',
    'REFRIGERATE',
    'LITHIUM BATTERIES',
    'LITHIUM ION',
    'LITHIUM METAL',
    'MAGNETIZED MATERIAL',
    'CRYOGENIC',
    'COMPRESSED GAS',
    'NON-FLAMMABLE GAS',
    'INHALATION HAZARD',
    'MARINE POLLUTANT',
    'ENVIRONMENTALLY HAZARDOUS',
    'CARGO AIRCRAFT ONLY',
    'CAO',
    'PASSENGER AND CARGO AIRCRAFT',
    'PAX',
  ];

  for (const keyword of keywords) {
    if (upperText.includes(keyword)) {
      markings.push(keyword);
    }
  }

  if (markings.length > 0) {
    console.log('[OCR] Found other markings:', markings);
  }

  return [...new Set(markings)]; // Deduplicate
}

/**
 * Extract all meaningful markings from OCR text
 * This is the main extraction function that combines all extractors
 *
 * @param ocrText - Raw OCR text from image
 * @param textLines - Array of text lines from OCR (for line-level extraction)
 * @returns Structured extraction results
 */
export function extractMarkingsFromText(
  ocrText: string,
  textLines: { text: string }[] = []
): ExtractedMarkings {
  console.log('[OCR] Extracting markings from text, length:', ocrText?.length || 0);

  if (!ocrText || ocrText.trim().length === 0) {
    console.log('[OCR] Empty text, returning empty extraction');
    return {
      popMarking: null,
      unNumbers: [],
      weights: [],
      hazardClasses: [],
      dates: [],
      countryOfOrigin: null,
      otherMarkings: [],
      exNumbers: [],
      properShippingNames: [],
      unWithPSN: [],
    };
  }

  // ===== PASS 1: Extract POP marking FIRST =====
  // This prevents false positives (e.g., "4G" from "UN 4G / X 25 / S / 22 / USA / DOD" being matched as 4 grams)
  let popMarking: ParsedPOPMarking | null = null;
  let textWithoutPOP = ocrText;

  try {
    const popResult = extractPOPMarkingFromText(ocrText);

    if (popResult.fields) {
      popMarking = {
        found: true,
        fields: popResult.fields,
        confidence: popResult.confidence,
        issues: popResult.issues,
        detectedType: popResult.detectedType,
        sourceText: popResult.matchedText || '',
      };
      console.log('[OCR] POP marking found with confidence:', popResult.confidence);

      // Remove POP text from further processing to prevent false positives
      if (popResult.matchedText) {
        textWithoutPOP = ocrText.replace(popResult.matchedText, ' ');
        console.log('[OCR] Excluded POP text from further extraction');
      }
    } else {
      console.log('[OCR] No POP marking found in text');
    }
  } catch (error) {
    console.error('[OCR] POP marking extraction error:', error);
  }

  // ===== PASS 2: Line-level extraction for UN+PSN, EX numbers =====
  const unWithPSN = extractUNWithPSN(textLines);
  const exNumbers = extractEXNumbers(ocrText);

  // ===== PASS 3: Remaining extractions from text WITHOUT POP marking =====
  const unNumbers = extractUNNumbers(textWithoutPOP);
  const weights = extractWeights(textWithoutPOP);
  const hazardClasses = extractHazardClasses(textWithoutPOP);
  const dates = extractDates(textWithoutPOP);
  const countryOfOrigin = extractCountryOfOrigin(textWithoutPOP);
  const otherMarkings = extractOtherMarkings(textWithoutPOP);

  // Merge UN numbers from both sources (deduplicated)
  const allUNNumbers = [...new Set([
    ...unNumbers,
    ...unWithPSN.map(pair => pair.un)
  ])];

  const result: ExtractedMarkings = {
    popMarking,
    unNumbers: allUNNumbers,
    weights,
    hazardClasses,
    dates,
    countryOfOrigin,
    otherMarkings,
    exNumbers,
    properShippingNames: unWithPSN.map(pair => pair.psn),
    unWithPSN,
  };

  console.log('[OCR] Extraction complete:', {
    hasPOP: !!popMarking,
    unCount: allUNNumbers.length,
    exCount: exNumbers.length,
    psnCount: unWithPSN.length,
    weightCount: weights.length,
    hazClassCount: hazardClasses.length,
    dateCount: dates.length,
    hasCountry: !!countryOfOrigin,
    otherCount: otherMarkings.length,
  });

  return result;
}

/**
 * Process an image with OCR and extract all markings
 * Convenience function that combines performOCR and extractMarkingsFromText
 *
 * @param imageUri - URI of the image to process
 * @returns Object containing OCR result and extracted markings
 */
export async function processImageOCR(imageUri: string): Promise<{
  ocrResult: ImageOCRResult | null;
  extractedMarkings: ExtractedMarkings | null;
}> {
  const ocrResult = await performOCR(imageUri);

  if (!ocrResult || !ocrResult.fullText) {
    return {
      ocrResult,
      extractedMarkings: null,
    };
  }

  const extractedMarkings = extractMarkingsFromText(ocrResult.fullText);

  return {
    ocrResult,
    extractedMarkings,
  };
}
