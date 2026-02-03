# Hazard Label Primary vs. Subsidiary Classification Design

**Date:** 2026-02-03
**Status:** Approved

## Problem

When a hazmat package has both a primary hazard label and a subsidiary hazard label, they must be on the same side of the package with the primary label positioned higher (smaller Y coordinate) relative to the subsidiary label. Currently, the ML detection system identifies hazard labels but does not distinguish between primary and subsidiary roles.

## Solution

Use the SDDG verification copy data (hazardClass, subsidiaryRisk) as ground truth to classify detected hazard labels as primary or subsidiary. Use the detection bounding box upper bound (box.y) to validate that the primary label is positioned above the subsidiary label on the package. Show classification badges on the MLDetectionScreen results view and save the classification to the AggregatedAnalysis context for downstream use.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Classification source | SDDG as ground truth | Always reliable; works even when labels are in different images |
| Y-axis comparison | Upper bound (box.y) | Direct comparison of where each label's top edge starts on the package |
| Position warning UX | Warning badge only (no auto-frustration) | Informational; lets inspector decide if it's a real issue or a camera angle artifact |
| Data persistence | Save to AggregatedAnalysis context | Downstream Markings & Labels Validation screen can use it for better matching |
| Integration point | MLDetectionScreen results view | Inspector sees and can verify classification before proceeding |

## Architecture

### New File: `src/utils/hazardLabelClassification.ts`

Pure utility with no React dependencies. Contains:

#### Types

```typescript
type HazardLabelRole = 'primary' | 'subsidiary' | 'unknown';

interface HazardLabelClassification {
  detectionId: string;
  className: string;
  role: HazardLabelRole;
  matchedHazardClass: string; // e.g., "8", "6.1", "1.1"
  imageIndex: number;
  boxY: number; // upper bound Y coordinate
}

interface HazardClassificationResult {
  classifications: HazardLabelClassification[];
  primaryDetection: HazardLabelClassification | null;
  subsidiaryDetections: HazardLabelClassification[];
  positionWarning: boolean;
  positionWarningMessage: string | null;
}
```

#### Core Functions

**`extractHazardClassFromDetection(className: string, category: string): string | null`**

Extracts the numeric hazard class from a detection's className. Rules:
- If `category` does not start with `hazardClass`, return null (not a hazard label)
- For explosives: `explosives1.1B` → `"1.1"`, `explosives1.4S` → `"1.4"`
- For other classes: `corrosiveHazmatClass8` → `"8"`, `poisonHazmatClass6.1` → `"6.1"`
- Extract by matching the pattern `Class(\d+\.?\d*)` or `(\d+\.\d+)` in the className
- For explosives, extract the division number after `explosives`

**`classifyHazardLabels(perImageResults: ImageAnalysisResult[], sddgData: { hazardClass: string; subsidiaryRisk: string }): HazardClassificationResult`**

Main classification function:
1. Iterate all detections across all images
2. For each detection with a `hazardClass*` category, extract the hazard class number
3. Match against `sddgData.hazardClass` → role = `'primary'`
4. Match against `sddgData.subsidiaryRisk` → role = `'subsidiary'`
5. Otherwise → role = `'unknown'`
6. For matching: normalize both sides (e.g., SDDG "8" matches detection "8"; SDDG "6.1" matches "6.1"). Also handle SDDG values like "1.1D" by extracting just the division "1.1" for comparison.
7. If multiple primary matches exist, pick the one with highest confidence. For subsidiary, pick the highest confidence detection per matched hazard class.
8. Y-axis check: if a primary and subsidiary detection exist in the same image, compare `box.y` values. If primary's `box.y` > subsidiary's `box.y`, set `positionWarning: true`

### Modified: `src/ml/types/ocr.ts`

Add to `AggregatedAnalysis` interface:

```typescript
/** Detected primary hazard label (matched to SDDG hazardClass) */
primaryHazardDetection: AggregatedLabel | null;

/** Detected subsidiary hazard labels (matched to SDDG subsidiaryRisk) */
subsidiaryHazardDetections: AggregatedLabel[];

/** Whether primary label is positioned below subsidiary in same image */
hazardLabelPositionWarning: boolean;

/** Warning message for label positioning */
hazardLabelPositionWarningMessage: string | null;
```

### Modified: `src/ml/hooks/useDetection.ts`

Update `aggregateResults()` to initialize the new fields with defaults (`null`, `[]`, `false`, `null`). The actual classification happens in MLDetectionScreen since it requires SDDG data from the inspection context, which the hook does not have access to.

### Modified: `src/screens/inspector/MLDetectionScreen.tsx`

#### Classification computation

After `correctedResults` are populated (in the existing `useEffect` that initializes from `analysisResults`), run classification:

```typescript
const classificationResult = useMemo(() => {
  const resultsToClassify = correctedResults.length > 0 ? correctedResults : (analysisResults || []);
  if (resultsToClassify.length === 0) return null;
  const sddgData = {
    hazardClass: inspection?.verificationCopy?.hazardClass || '',
    subsidiaryRisk: inspection?.verificationCopy?.subsidiaryRisk || '',
  };
  if (!sddgData.hazardClass) return null;
  return classifyHazardLabels(resultsToClassify, sddgData);
}, [correctedResults, analysisResults, inspection]);
```

#### Results screen UI changes

Per-detection badges in the detection list:
- **"Primary"** badge (green background) — next to the detection name
- **"Subsidiary"** badge (blue background) — next to the detection name
- Non-hazard labels and unclassified hazard labels get no role badge

Position warning banner (shown below the image's DetectionOverlay when applicable):
- Orange background, warning icon
- Text: "Primary hazard label appears below subsidiary hazard label"
- Only shown when both labels are in the same image and box.y comparison fails

#### Saving to context

In `navigateToNextScreen()`, after re-aggregating from `correctedResults`, populate the new classification fields on the `AggregatedAnalysis` before calling `setMLAnalysisResults()`:

```typescript
const finalAggregated = aggregateResults(resultsToSave);

// Classify hazard labels using SDDG data
if (classificationResult) {
  finalAggregated.primaryHazardDetection = /* map from classification */;
  finalAggregated.subsidiaryHazardDetections = /* map from classification */;
  finalAggregated.hazardLabelPositionWarning = classificationResult.positionWarning;
  finalAggregated.hazardLabelPositionWarningMessage = classificationResult.positionWarningMessage;
}

setMLAnalysisResults(finalAggregated);
```

## Hazard Label Class Names Reference

Classes that qualify as hazard labels (category starts with `hazardClass`):

| Category | Example classNames | Extracted hazard class |
|----------|-------------------|----------------------|
| hazardClass1 | `explosives1.1B`, `explosives1.4S` | `"1.1"`, `"1.4"` |
| hazardClass2 | `flammableGasHazmatClass2.1`, `nonFlammableGasHazmatClass2.2` | `"2.1"`, `"2.2"` |
| hazardClass3 | `flammableHazmatClass3`, `combustibleHazmatClass3` | `"3"` |
| hazardClass4 | `flammableSolidHazmatClass4.1`, `dangerousWhenWetHazmatClass4.3` | `"4.1"`, `"4.3"` |
| hazardClass5 | `oxidizerHazmatClass5.1` | `"5.1"` |
| hazardClass6 | `poisonHazmatClass6.1`, `infectiousSubstanceHazmatClass6.2` | `"6.1"`, `"6.2"` |
| hazardClass8 | `corrosiveHazmatClass8` | `"8"` |
| hazardClass9 | `miscellaneousHazmatClass9` | `"9"` |

Non-hazard classes to exclude: `general_marking` category (cargoAircraftOnly, orientationArrows, keepAwayFromHeat, etc.)

Special cases that need careful parsing:
- `toxicHazmatClass6` → `"6.1"` (defaults to 6.1 via labelMatchingTable)
- `hazmatClass6PackingGroupIII` → `"6.1"` (defaults to 6.1 via labelMatchingTable)
- `UN1977` → `"2.2"` (via labelMatchingTable, not name parsing)
- `fireExtinguisherManufacturedPriorToJan1976Label` → `"2.2"` (via labelMatchingTable)
- `meetsDotRequirements` → not a hazard class label per se, skip
- `nonOdorized` → not a hazard class label per se, skip

## Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `src/utils/hazardLabelClassification.ts` | New | Classification logic + Y-axis validation |
| `src/ml/types/ocr.ts` | Modify | Add 4 fields to AggregatedAnalysis |
| `src/ml/hooks/useDetection.ts` | Modify | Initialize new fields in aggregateResults() |
| `src/screens/inspector/MLDetectionScreen.tsx` | Modify | Run classification, render badges + warning, save to context |

## What Does NOT Change

- `Detection` / `CorrectedDetection` types
- `class_mapping.json`
- `InspectionFormProvider` context (already stores AggregatedAnalysis)
- `postprocess.ts` / `ocrService.ts` / `imagePreprocess.ts`
- `InspectorMarkingsLabelsValidationScreen.tsx` (can optionally use new fields later)
