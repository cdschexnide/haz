# OCR Extraction Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the ML detection OCR pipeline to accurately extract UN+PSN, EX numbers, and POP markings while eliminating false positive weight detection.

**Architecture:** Extend existing extraction pipeline with new extractors, preserve ML Kit line hierarchy, and use ordered extraction (POP first) to prevent false positives. Store results in inspection context for downstream screens.

**Tech Stack:** React Native, TypeScript, ML Kit Text Recognition, existing InspectionFormProvider context

---

## Task 1: Extend OCR Types

**Files:**
- Modify: `src/ml/types/ocr.ts:23-30` (ImageOCRResult)
- Modify: `src/ml/types/ocr.ts:61-76` (ExtractedMarkings)

**Step 1: Add OCRTextLine interface**

Add after line 18 (after OCRTextBlock interface):

```typescript
/**
 * A single line of text detected by OCR with optional position
 */
export interface OCRTextLine {
  text: string;
  boundingBox: BoundingBox | null;
}
```

**Step 2: Update ImageOCRResult to include textLines**

Change lines 23-30 to:

```typescript
/**
 * Raw OCR result from ML Kit text recognition
 */
export interface ImageOCRResult {
  /** Complete concatenated text from all blocks */
  fullText: string;
  /** Individual text blocks with positions */
  textBlocks: OCRTextBlock[];
  /** Individual text lines with positions (for line-level extraction) */
  textLines: OCRTextLine[];
  /** Time taken for OCR processing in milliseconds */
  processingTime: number;
}
```

**Step 3: Extend ExtractedMarkings with new fields**

Change lines 61-76 to:

```typescript
/**
 * All markings and data extracted from OCR text
 */
export interface ExtractedMarkings {
  /** Parsed POP marking if found */
  popMarking: ParsedPOPMarking | null;
  /** UN identification numbers found (e.g., ["UN1203", "UN3082"]) */
  unNumbers: string[];
  /** Weight/mass values found */
  weights: ExtractedWeight[];
  /** Hazard class indicators found (e.g., ["3", "6.1"]) */
  hazardClasses: string[];
  /** Date patterns found (e.g., ["05/23", "2023"]) */
  dates: string[];
  /** Country of origin if identified */
  countryOfOrigin: string | null;
  /** Any other significant text patterns */
  otherMarkings: string[];
  /** EX classification numbers found (e.g., ["EX-2019037142"]) */
  exNumbers: string[];
  /** Proper shipping names found (e.g., ["FUZES DETONATING"]) */
  properShippingNames: string[];
  /** UN numbers paired with their proper shipping names */
  unWithPSN: { un: string; psn: string }[];
}
```

**Step 4: Commit**

```bash
git add src/ml/types/ocr.ts
git commit -m "feat(ocr): extend types with OCRTextLine and new extraction fields

- Add OCRTextLine interface for line-level OCR data
- Add textLines to ImageOCRResult
- Add exNumbers, properShippingNames, unWithPSN to ExtractedMarkings"
```

---

## Task 2: Update POP Parser to Return Matched Text

**Files:**
- Modify: `src/utils/popMarkingParser.ts:1061-1216`

**Step 1: Update return type signature**

Change line 1061-1066 to:

```typescript
export function extractPOPMarkingFromText(ocrText: string): {
  fields: POPMarkingFields | null;
  confidence: number;
  issues: string[];
  detectedType: POPMarkingType;
  matchedText: string | null;
} {
```

**Step 2: Track the normalized text that was successfully parsed**

After line 1073 (after `const normalizedText = normalizeDelimiters(ocrText);`), add:

```typescript
  // Track the text that was matched for exclusion from other extractors
  let matchedText: string | null = null;
```

**Step 3: Capture matchedText when fields are successfully parsed**

After line 1127 (after `console.log('✓ Fields extracted successfully');`), add:

```typescript
  // Capture the normalized text that was successfully parsed
  // This allows other extractors to exclude this text to prevent false positives
  matchedText = normalizedText;
```

**Step 4: Update the failed return to include matchedText**

Change lines 1119-1124 to:

```typescript
    return {
      fields: null,
      confidence: 0,
      issues: ['Could not locate POP marking in text. Look for format: UN / code / X|Y|Z / number / ...'],
      detectedType: POPMarkingType.UNKNOWN,
      matchedText: null
    };
```

**Step 5: Update the success return to include matchedText**

Change lines 1210-1215 to:

```typescript
  return {
    fields,
    confidence,
    issues,
    detectedType,
    matchedText
  };
```

**Step 6: Commit**

```bash
git add src/utils/popMarkingParser.ts
git commit -m "feat(pop-parser): return matchedText for exclusion from other extractors

Allows downstream extractors to exclude POP marking text to prevent
false positives (e.g., '4G' being detected as 4 grams)"
```

---

## Task 3: Add New Extractors to OCR Service

**Files:**
- Modify: `src/ml/services/ocrService.ts`

**Step 1: Add extractEXNumbers function**

Add after line 88 (after extractUNNumbers function):

```typescript
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
```

**Step 2: Add extractUNWithPSN function**

Add after the new extractEXNumbers function:

```typescript
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
  const unPsnPattern = /UN[\s\-]*(\d{4})\s+([A-Z][A-Z\s,\-]+)/gi;

  for (const line of lines) {
    const text = line.text.toUpperCase();
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
```

**Step 3: Commit**

```bash
git add src/ml/services/ocrService.ts
git commit -m "feat(ocr): add extractEXNumbers and extractUNWithPSN functions

- extractEXNumbers: captures EX classification numbers (EX-2019037142)
- extractUNWithPSN: captures UN numbers with proper shipping names from lines"
```

---

## Task 4: Update performOCR to Return Text Lines

**Files:**
- Modify: `src/ml/services/ocrService.ts:27-62` (performOCR function)

**Step 1: Import the new OCRTextLine type**

At top of file, ensure the import includes OCRTextLine:

```typescript
import type {
  ImageOCRResult,
  OCRTextBlock,
  OCRTextLine,
  ExtractedMarkings,
  ParsedPOPMarking,
  ExtractedWeight,
} from '../types/ocr';
```

**Step 2: Update performOCR to extract and return textLines**

Change lines 38-56 to:

```typescript
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
```

**Step 3: Commit**

```bash
git add src/ml/services/ocrService.ts
git commit -m "feat(ocr): extract text lines from ML Kit block hierarchy

Preserves line-level structure for more accurate UN+PSN extraction"
```

---

## Task 5: Update extractMarkingsFromText with Ordered Extraction

**Files:**
- Modify: `src/ml/services/ocrService.ts:482-559` (extractMarkingsFromText function)

**Step 1: Update function signature to accept textLines**

Change line 482 to:

```typescript
export function extractMarkingsFromText(
  ocrText: string,
  textLines: { text: string }[] = []
): ExtractedMarkings {
```

**Step 2: Replace the entire function body with ordered extraction**

Replace lines 482-559 with:

```typescript
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
```

**Step 3: Commit**

```bash
git add src/ml/services/ocrService.ts
git commit -m "feat(ocr): implement ordered extraction with POP exclusion

- Extract POP marking first to capture matched text
- Exclude POP text from weight extraction (fixes 4G false positive)
- Add line-level extraction for UN+PSN pairs
- Add EX number extraction
- Merge UN numbers from multiple sources"
```

---

## Task 6: Update useDetection Hook to Pass Text Lines

**Files:**
- Modify: `src/ml/hooks/useDetection.ts:337-341`

**Step 1: Update the extractMarkingsFromText call**

Change lines 337-341 to:

```typescript
        // Extract markings from OCR text, passing line data for UN+PSN extraction
        let extractedMarkings: ExtractedMarkings | null = null;
        if (ocrResult?.fullText) {
          extractedMarkings = extractMarkingsFromText(
            ocrResult.fullText,
            ocrResult.textLines || []
          );
        }
```

**Step 2: Commit**

```bash
git add src/ml/hooks/useDetection.ts
git commit -m "feat(detection): pass textLines to extractMarkingsFromText

Enables line-level extraction for UN+PSN pairs"
```

---

## Task 7: Update ExtractedDataCard UI

**Files:**
- Modify: `src/ml/components/ExtractedDataCard.tsx`

**Step 1: Update the destructuring to include new fields**

Change lines 76-83 to:

```typescript
  const {
    unNumbers,
    weights,
    hazardClasses,
    dates,
    countryOfOrigin,
    otherMarkings,
    exNumbers = [],
    properShippingNames = [],
    unWithPSN = [],
  } = markings;
```

**Step 2: Update hasData check**

Change lines 86-92 to:

```typescript
  // Check if there's any data to display
  const hasData =
    unNumbers.length > 0 ||
    exNumbers.length > 0 ||
    unWithPSN.length > 0 ||
    weights.length > 0 ||
    hazardClasses.length > 0 ||
    dates.length > 0 ||
    countryOfOrigin ||
    otherMarkings.length > 0;
```

**Step 3: Add UN+PSN section after header (before UN Numbers section)**

Add after line 149 (after the header closing View):

```typescript
      {/* UN + PSN Combined Section (prioritized for compliance) */}
      {unWithPSN.length > 0 && (
        <DataSection icon="assignment" iconColor="#E65100" title="UN Identification">
          <View style={styles.unPsnContainer}>
            {unWithPSN.map((item, index) => (
              <View key={index} style={styles.unPsnItem}>
                <DataChip label={item.un} color="#E65100" backgroundColor="#FFF3E0" />
                <Text style={styles.psnText}>{item.psn}</Text>
              </View>
            ))}
          </View>
        </DataSection>
      )}

      {/* EX Classification Numbers */}
      {exNumbers.length > 0 && (
        <DataSection icon="verified" iconColor="#1565C0" title="EX Classification">
          <View style={styles.chipsContainer}>
            {exNumbers.map((ex, index) => (
              <DataChip
                key={index}
                label={ex}
                color="#1565C0"
                backgroundColor="#E3F2FD"
              />
            ))}
          </View>
        </DataSection>
      )}
```

**Step 4: Add new styles**

Add before the closing of StyleSheet.create:

```typescript
  unPsnContainer: {
    gap: 8,
  },
  unPsnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  psnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
```

**Step 5: Commit**

```bash
git add src/ml/components/ExtractedDataCard.tsx
git commit -m "feat(ui): display UN+PSN pairs and EX numbers in ExtractedDataCard

- Add UN Identification section showing UN number with proper shipping name
- Add EX Classification section with blue styling
- Update hasData check to include new fields"
```

---

## Task 8: Update Aggregation to Include New Fields

**Files:**
- Modify: `src/ml/hooks/useDetection.ts:85-177` (aggregateResults function)

**Step 1: Add new aggregation variables**

After line 94 (after `let countryOfOrigin: string | null = null;`), add:

```typescript
  const allEXNumbers = new Set<string>();
  const allPSNs = new Set<string>();
  const allUnWithPSN: { un: string; psn: string }[] = [];
```

**Step 2: Add aggregation logic in the forEach loop**

After line 135 (inside the `if (result.extractedMarkings)` block, after country aggregation), add:

```typescript
      // EX numbers
      markings.exNumbers?.forEach((ex) => allEXNumbers.add(ex));

      // Proper shipping names
      markings.properShippingNames?.forEach((psn) => allPSNs.add(psn));

      // UN+PSN pairs (keep all, may have duplicates with different images)
      if (markings.unWithPSN) {
        allUnWithPSN.push(...markings.unWithPSN);
      }
```

**Step 3: Update AggregatedAnalysis type to include new fields**

In `src/ml/types/ocr.ts`, add to AggregatedAnalysis interface (after line 142):

```typescript
  /** All EX classification numbers found */
  allEXNumbers: string[];

  /** All proper shipping names found */
  allPSNs: string[];

  /** All UN+PSN pairs found */
  allUnWithPSN: { un: string; psn: string }[];
```

**Step 4: Update the aggregated return object**

In useDetection.ts, update lines 157-167 to include new fields:

```typescript
  const aggregated: AggregatedAnalysis = {
    bestPopMarking,
    allDetectedLabels: sortedLabels,
    allUnNumbers: Array.from(allUnNumbers),
    allWeights,
    allHazardClasses: Array.from(allHazardClasses),
    countryOfOrigin,
    allEXNumbers: Array.from(allEXNumbers),
    allPSNs: Array.from(allPSNs),
    allUnWithPSN,
    imagesProcessed: results.length,
    totalProcessingTime,
    perImageResults: results,
  };
```

**Step 5: Update console log**

Update line 169-174:

```typescript
  console.log('[useDetection] Aggregation complete:', {
    labels: sortedLabels.length,
    unNumbers: allUnNumbers.size,
    exNumbers: allEXNumbers.size,
    unWithPSN: allUnWithPSN.length,
    hasPOP: !!bestPopMarking,
    totalTime: totalProcessingTime,
  });
```

**Step 6: Commit**

```bash
git add src/ml/types/ocr.ts src/ml/hooks/useDetection.ts
git commit -m "feat(detection): aggregate EX numbers and UN+PSN pairs

- Add allEXNumbers, allPSNs, allUnWithPSN to AggregatedAnalysis type
- Aggregate new fields across all processed images"
```

---

## Task 9: Update MLDetectionScreen to Display New Data

**Files:**
- Modify: `src/components/Inspector/MLDetectionScreen.tsx:813-829`

**Step 1: Update ExtractedDataCard props to include new fields**

Change lines 813-829 to:

```typescript
          {/* Extracted OCR Data Card */}
          {aggregatedResults && (
            aggregatedResults.allUnNumbers.length > 0 ||
            aggregatedResults.allEXNumbers?.length > 0 ||
            aggregatedResults.allUnWithPSN?.length > 0 ||
            aggregatedResults.allWeights.length > 0 ||
            aggregatedResults.allHazardClasses.length > 0 ||
            aggregatedResults.countryOfOrigin
          ) && (
            <ExtractedDataCard
              markings={{
                popMarking: null,
                unNumbers: aggregatedResults.allUnNumbers,
                weights: aggregatedResults.allWeights,
                hazardClasses: aggregatedResults.allHazardClasses,
                dates: [],
                countryOfOrigin: aggregatedResults.countryOfOrigin,
                otherMarkings: [],
                exNumbers: aggregatedResults.allEXNumbers || [],
                properShippingNames: aggregatedResults.allPSNs || [],
                unWithPSN: aggregatedResults.allUnWithPSN || [],
              }}
            />
          )}
```

**Step 2: Commit**

```bash
git add src/components/Inspector/MLDetectionScreen.tsx
git commit -m "feat(ml-screen): pass new extraction fields to ExtractedDataCard

Display EX numbers and UN+PSN pairs in analysis results"
```

---

## Task 10: Add ML Results to Inspection Context

**Files:**
- Modify: `src/contexts/InspectionFormProvider/types.ts` (if exists) or inline in provider

**Step 1: Check if setMLAnalysisResults already exists**

Looking at line 124 of InspectionFormProvider.tsx, `setMLAnalysisResults` already exists. We need to verify it stores the full results including new fields.

**Step 2: Verify AggregatedAnalysis import includes new fields**

The import at line 26 should already pull in the updated type. No changes needed if Task 8 was completed.

**Step 3: Commit verification**

```bash
git status
git log --oneline -5
```

If all previous tasks completed, the context already supports the new fields through the existing `setMLAnalysisResults` function.

---

## Task 11: Final Integration Verification

**Step 1: Run TypeScript compilation check**

```bash
npx tsc --noEmit
```

Expected: No type errors

**Step 2: Final commit for any remaining fixes**

```bash
git add -A
git commit -m "chore: fix any remaining type issues from OCR extraction improvements"
```

**Step 3: Create summary commit message**

Review all changes are in place:

```bash
git log --oneline -10
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/ml/types/ocr.ts` | Added `OCRTextLine`, extended `ExtractedMarkings` and `AggregatedAnalysis` |
| `src/utils/popMarkingParser.ts` | Added `matchedText` return field |
| `src/ml/services/ocrService.ts` | Added `extractEXNumbers`, `extractUNWithPSN`, updated `performOCR` and `extractMarkingsFromText` |
| `src/ml/hooks/useDetection.ts` | Updated aggregation and extraction call |
| `src/ml/components/ExtractedDataCard.tsx` | Added UI for UN+PSN and EX numbers |
| `src/components/Inspector/MLDetectionScreen.tsx` | Updated to pass new fields |
