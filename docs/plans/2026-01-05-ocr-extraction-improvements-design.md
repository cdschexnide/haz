# OCR Extraction Improvements Design

**Date:** 2026-01-05
**Status:** Approved

## Problem Summary

The ML detection screen's OCR pipeline has several issues preventing accurate extraction of package markings required for AFMAN compliance:

1. **No EX Number extractor** - EX-2019037142 patterns not captured
2. **No PSN extractor** - "FUZES DETONATING" ignored after UN number
3. **False positive weight detection** - "4G" packaging code misread as 4 grams
4. **POP parser fragmentation** - OCR text blocks lose delimiter structure
5. **UN numbers not appearing** - Pattern matching or display issues

## Solution Overview

1. **Preserve ML Kit's block/line hierarchy** during OCR processing
2. **Add missing extractors** for EX numbers and UN+PSN pairs
3. **Order extraction intelligently** - extract POP first, exclude from subsequent passes
4. **Extend data types** to capture richer marking data
5. **Store in inspection context** for downstream verification screens

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Implementation approach | Use ML Kit's structured block hierarchy | Leverages existing data without over-engineering |
| Data integration | Store in inspection context | Enables downstream verification screens |
| Data structure | Extend existing `ExtractedMarkings` type | Backward compatible, simple addition |
| Extraction strategy | Block text + specialized line-level extraction | Catches both block-level and line-level patterns |
| False positive fix | Extract POP first, exclude its text | Clean separation, no false positives from POP |
| Context storage | Add dedicated `mlExtractedMarkings` field | Minimal disruption to existing code |

## Data Types

### Extended ExtractedMarkings

```typescript
// In src/ml/types/ocr.ts
interface ExtractedMarkings {
  // Existing fields (unchanged)
  popMarking: ParsedPOPMarking | null;
  unNumbers: string[];
  weights: ExtractedWeight[];
  hazardClasses: string[];
  dates: string[];
  countryOfOrigin: string | null;
  otherMarkings: string[];

  // NEW fields
  exNumbers: string[];                      // ["EX-2019037142"]
  properShippingNames: string[];            // ["FUZES DETONATING"]
  unWithPSN: { un: string; psn: string }[]; // Linked pairs
}
```

### New OCRTextLine Type

```typescript
interface OCRTextLine {
  text: string;
  boundingBox: BoundingBox | null;
}

interface ImageOCRResult {
  fullText: string;
  textBlocks: OCRTextBlock[];
  textLines: OCRTextLine[];  // NEW
  processingTime: number;
}
```

## Processing Pipeline

### Current Flow (Problem)
```
ML Kit → result.text (flattened string) → extractMarkingsFromText() → ExtractedMarkings
```

### New Flow
```
ML Kit → result.blocks[].lines[] (preserved hierarchy)
       ↓
   Pass 1: Extract POP marking from full text
       ↓
   Pass 2: Line-by-line extraction for UN+PSN, EX numbers
       ↓
   Pass 3: Extract remaining (weights, dates, etc.) from non-POP text
       ↓
   Merge results → ExtractedMarkings
```

## New Extractors

### EX Number Extractor

```typescript
export function extractEXNumbers(text: string): string[] {
  if (!text) return [];

  const upperText = text.toUpperCase();
  const exPattern = /EX[\s\-]*(\d{7,12})/gi;
  const matches = [...upperText.matchAll(exPattern)];

  const exNumbers = [...new Set(matches.map(m => `EX-${m[1]}`))];

  if (exNumbers.length > 0) {
    console.log('[OCR] Found EX numbers:', exNumbers);
  }

  return exNumbers;
}
```

### UN + PSN Extractor

```typescript
export function extractUNWithPSN(lines: OCRTextLine[]): { un: string; psn: string }[] {
  const results: { un: string; psn: string }[] = [];
  const unPsnPattern = /UN[\s\-]*(\d{4})\s+([A-Z][A-Z\s,\-]+)/gi;

  for (const line of lines) {
    const text = line.text.toUpperCase();
    const matches = [...text.matchAll(unPsnPattern)];

    for (const match of matches) {
      const un = `UN${match[1]}`;
      const psn = match[2].trim().replace(/\s+/g, ' ').replace(/[,\-\s]+$/, '');

      if (psn.length >= 3) {
        results.push({ un, psn });
      }
    }
  }

  return results;
}
```

## Ordered Extraction with POP Exclusion

```typescript
export function extractMarkingsFromText(
  ocrText: string,
  textLines: OCRTextLine[] = []
): ExtractedMarkings {

  // PASS 1: Extract POP marking first
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

      if (popResult.matchedText) {
        textWithoutPOP = ocrText.replace(popResult.matchedText, ' ');
      }
    }
  } catch (error) {
    console.error('[OCR] POP extraction error:', error);
  }

  // PASS 2: Line-level extraction for UN+PSN, EX
  const unWithPSN = extractUNWithPSN(textLines);
  const exNumbers = extractEXNumbers(ocrText);

  // PASS 3: Remaining extractions from non-POP text
  const unNumbers = extractUNNumbers(textWithoutPOP);
  const weights = extractWeights(textWithoutPOP);
  const hazardClasses = extractHazardClasses(textWithoutPOP);
  const dates = extractDates(textWithoutPOP);
  const countryOfOrigin = extractCountryOfOrigin(textWithoutPOP);
  const otherMarkings = extractOtherMarkings(textWithoutPOP);

  // Merge UN numbers from both sources
  const allUNNumbers = [...new Set([
    ...unNumbers,
    ...unWithPSN.map(pair => pair.un)
  ])];

  return {
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
}
```

## Context Integration

### InspectionFormProvider Changes

```typescript
interface InspectionState {
  // ... existing fields ...
  mlExtractedMarkings: ExtractedMarkings | null;
  mlDetectedLabels: Detection[] | null;
  mlAnalysisTimestamp: number | null;
}

// Action
case 'SET_ML_RESULTS':
  return {
    ...state,
    mlExtractedMarkings: action.payload.markings,
    mlDetectedLabels: action.payload.labels,
    mlAnalysisTimestamp: Date.now(),
  };
```

## UI Updates

The `ExtractedDataCard` component will display new sections:

1. **UN Identification** - UN + PSN combined display
2. **EX Classification** - EX numbers with blue styling
3. Existing sections (Hazard Classes, Weights, Country, Dates)

Display order prioritizes compliance-critical data.

## Files to Modify

| File | Changes |
|------|---------|
| `src/ml/types/ocr.ts` | Add new fields and types |
| `src/ml/services/ocrService.ts` | Add extractors, update pipeline |
| `src/utils/popMarkingParser.ts` | Return `matchedText` |
| `src/ml/components/ExtractedDataCard.tsx` | Add UI sections |
| `src/contexts/InspectionFormProvider.tsx` | Add ML results state |
| `src/components/Inspector/MLDetectionScreen.tsx` | Integrate with context |

