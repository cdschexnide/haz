# OpenCV Cell Detection for SDDG Form Extraction

**Date**: 2026-01-28
**Status**: Design Complete

## Problem Statement

The SDDG extraction system has two approaches:

1. **Template-based extraction**: Uses predefined pixel coordinates to crop regions and run OCR. Works perfectly when regions are correctly positioned, but requires manual adjustment (3-4 minutes per form) because static coordinates don't adapt to scan variations.

2. **Anchor-based extraction**: Attempts to infer value regions from label positions. Unreliable because values appear in different positions relative to labels across different scans.

**Root cause**: We're guessing where regions should be instead of detecting where they actually are.

**Key insight**: The manual region adjustment proves that region-based OCR extraction works excellently. The bottleneck is automatically determining correct region boundaries.

## Solution

Use OpenCV to detect the actual black cell borders on SDDG forms, then auto-align template regions to match detected cells. This automates the manual drag/resize work while preserving the proven template-based extraction pipeline.

## Architecture

```
Scanned Image
     |
[Orientation Correction] <-- existing
     |
[OpenCV Cell Detection] <-- NEW
     |
[Cell-to-Template Matching] <-- NEW
     |
[Transform Computation] <-- NEW
     |
Auto-Aligned Template
     |
[Template Extractor] <-- existing, unchanged
     |
SDDGData + Confidence
     |
[Optional: Manual Refinement] <-- existing, pre-populated with auto-aligned regions
```

## Technical Design

### 1. OpenCV Cell Detection

**Library**: `react-native-fast-opencv` (v0.4.7)

**File**: `src/services/sddg/opencvCellDetection.ts`

```typescript
interface DetectedCell {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CellDetectionResult {
  success: boolean;
  cells: DetectedCell[];
  horizontalLines: Line[];
  verticalLines: Line[];
  imageWidth: number;
  imageHeight: number;
}

async function detectCells(imageUri: string): Promise<CellDetectionResult>
```

**Algorithm**:

1. **Grayscale conversion**: `cvtColor(mat, COLOR_BGR2GRAY)`
2. **Adaptive threshold**: `adaptiveThreshold(gray, 255, ADAPTIVE_THRESH_GAUSSIAN_C, THRESH_BINARY_INV, 11, 2)`
3. **Line detection**: `HoughLinesP(binary, 1, PI/180, threshold=50, minLineLength=100, maxLineGap=10)`
4. **Classify lines**: Separate horizontal (within 5 degrees) and vertical lines
5. **Merge nearby lines**: Lines within 15px of same orientation merge into one
6. **Find intersections**: Every horizontal-vertical pair that crosses
7. **Build cells**: Create cells from adjacent intersection points
8. **Filter noise**: Discard cells smaller than 50x30 pixels

### 2. Cell-to-Template Matching

**File**: `src/services/sddg/templateAutoAlignment.ts`

```typescript
interface AlignmentResult {
  success: boolean;
  transform: { offsetX: number; offsetY: number; scaleX: number; scaleY: number };
  alignedTemplate: SDDGTemplate;
  matchedFields: number;
  totalFields: number;
  confidence: number;
  failureReason?: string;
}

async function autoAlignTemplate(
  imageUri: string,
  cells: DetectedCell[],
  ocrTextBlocks: TextBlock[],
  baseTemplate: SDDGTemplate
): Promise<AlignmentResult>
```

**Matching Strategy (Hybrid)**:

1. **Anchor Label Matching** (primary):
   - Key anchors: "SHIPPER", "CONSIGNEE", "UN or ID NO", "ADDITIONAL HANDLING", etc.
   - Find which detected cell contains each anchor label
   - Match to corresponding template field
   - Target: 5-8 reliable anchor matches

2. **Position-Based Matching** (fallback):
   - For fields without anchor matches
   - Normalize positions to percentages (0-1 range)
   - Find detected cell closest to expected position
   - Only use if distance < 10% of form dimension

**Transform Computation**:

- From matched pairs: `(templateRegion, detectedCell)`
- Compute offset: average difference in position
- Compute scale: ratio of detected cell sizes to template sizes
- Apply transform to all template regions

### 3. Integration into Extraction Flow

**Modified**: `src/services/sddg/templateExtractor.ts`

```typescript
// After orientation correction, before field extraction:

let alignedTemplate = template;
let autoAlignmentResult: AlignmentResult | undefined;

if (!customTemplate) {
  const cellResult = await detectCells(correctedUri);

  if (cellResult.success && cellResult.cells.length >= 10) {
    const ocrResult = await TextRecognition.recognize(correctedUri);
    const textBlocks = convertToTextBlocks(ocrResult);

    autoAlignmentResult = await autoAlignTemplate(
      correctedUri, cellResult.cells, textBlocks, template
    );

    if (autoAlignmentResult.success) {
      alignedTemplate = autoAlignmentResult.alignedTemplate;
    }
  }
}

// Continue with existing extraction using alignedTemplate
```

### 4. User Experience Flow

```
Scan/Select Image
       |
[Processing Screen] <-- Auto-alignment happens here (invisible to user)
       |
   +-------+
   |       |
Success  Low Confidence
   |       |
   v       v
Results   Results + Warning Banner
Screen    "Auto-alignment uncertain. Consider adjusting regions."
   |       |
   +---+---+
       |
[Optional: "Adjust Regions" button]
       |
Region Adjustment Screen
(pre-populated with auto-aligned regions)
```

**UI Changes**:

- `SDDGRegionAdjustmentScreen.tsx`: Accept `preAlignedTemplate` param
- `SDDGResultsScreen.tsx`: Show warning banner when alignment confidence is low

## Error Handling

### Detection Failures

| Scenario | Cells Detected | Action |
|----------|----------------|--------|
| Good scan | 20+ cells | Full auto-alignment |
| Faded lines | 10-20 cells | Partial alignment, lower confidence |
| Poor scan | <10 cells | Skip alignment, use default template, flag |
| Library error | Exception | Catch, log, use default template |

### Matching Failures

| Scenario | Anchor Matches | Action |
|----------|----------------|--------|
| All anchors found | 8+ matches | High confidence |
| Some anchors | 3-7 matches | Medium confidence, use position fallback |
| Few anchors | <3 matches | Low confidence, flag for review |

### Safety Guards

```typescript
function isTransformReasonable(transform: Transform): boolean {
  // Offset shouldn't exceed 20% of image dimension
  if (Math.abs(transform.offsetX) > imageWidth * 0.2) return false;
  if (Math.abs(transform.offsetY) > imageHeight * 0.2) return false;

  // Scale should be between 0.7 and 1.3
  if (transform.scaleX < 0.7 || transform.scaleX > 1.3) return false;
  if (transform.scaleY < 0.7 || transform.scaleY > 1.3) return false;

  return true;
}
```

**Timeout**: OpenCV detection limited to 5 seconds.

## Implementation Plan

### New Dependencies

- `react-native-fast-opencv` (requires native rebuild)

### New Files

| File | Purpose | ~Lines |
|------|---------|--------|
| `src/services/sddg/opencvCellDetection.ts` | Line detection, cell extraction | ~200 |
| `src/services/sddg/templateAutoAlignment.ts` | Matching, transform computation | ~250 |

### Modified Files

| File | Changes |
|------|---------|
| `src/services/sddg/templateExtractor.ts` | Add auto-alignment call (~30 lines) |
| `src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx` | Accept pre-aligned template (~10 lines) |
| `src/screens/SDDG/SDDGResultsScreen.tsx` | Warning banner (~20 lines) |

### Implementation Order

1. Install `react-native-fast-opencv`, verify with grayscale test
2. Implement `opencvCellDetection.ts`
3. Implement `templateAutoAlignment.ts`
4. Integrate into `templateExtractor.ts`
5. Update UI screens
6. Test with sample SDDG forms

## Success Criteria

- Auto-alignment succeeds on >80% of clearly scanned forms
- When successful, extraction accuracy matches manual adjustment
- Processing time increase <3 seconds
- Graceful fallback when detection fails

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Line detection method | HoughLinesP | More robust to scan quality than contour detection |
| Cell-to-field mapping | Hybrid (labels + position) | Labels provide ground truth, position handles remainder |
| Transform type | Translation + Scale | Handles common variations without over-fitting |
| UX flow | Auto with optional refinement | Fast happy path, manual refinement when needed |
| Fallback behavior | Proceed with warning | Doesn't block user, encourages correction |
