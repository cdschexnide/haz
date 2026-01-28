# OpenCV Cell Detection for SDDG Form Extraction

**Date**: 2026-01-28
**Status**: Design Complete (Revised after code review)

## Problem Statement

The SDDG extraction system has two approaches:

1. **Template-based extraction**: Uses predefined pixel coordinates to crop regions and run OCR. Works perfectly when regions are correctly positioned, but requires manual adjustment (3-4 minutes per form) because static coordinates don't adapt to scan variations.

2. **Anchor-based extraction**: Attempts to infer value regions from label positions. Unreliable because values appear in different positions relative to labels across different scans.

**Root cause**: We're guessing where regions should be instead of detecting where they actually are.

**Key insight**: The manual region adjustment proves that region-based OCR extraction works excellently. The bottleneck is automatically determining correct region boundaries.

## Solution

Use OpenCV to detect the actual black cell borders on SDDG forms, then auto-align template regions to match detected cells. This automates the manual drag/resize work while preserving the proven template-based extraction pipeline.

## Known Limitations (MVP)

**Skew/Rotation Not Supported**: This MVP handles translation and scale only. Forms with significant skew (>5°) or rotation will not align correctly.

- The existing `correctImageOrientation()` handles 90° rotations
- Small skews from scanner feed or camera angle are **not** corrected
- When skew is detected (line classification fails), the system will prompt: "Form appears skewed. Please re-scan with form aligned straight."
- **Future iteration**: Add deskew pre-processing step

## Architecture

```
Scanned Image
     |
[Orientation Correction] <-- existing (handles 90° rotation)
     |
[OpenCV Cell Detection] <-- NEW
     |
[Cell-to-Template Matching] <-- NEW (hybrid: anchors + position fallback)
     |
[Transform Computation] <-- NEW (translation + scale)
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

**Library**: `react-native-fast-opencv@0.4.7` (pinned version)

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
3. **Line detection**: `HoughLinesP(binary, 1, PI/180, threshold, minLineLength, maxLineGap)`
   - `minLineLength`: 5% of image width (scale-aware, not fixed pixels)
   - `maxLineGap`: 0.5% of image width (scale-aware)
4. **Classify lines**: Separate horizontal (within 5°) and vertical (within 5° of 90°)
5. **Merge colinear segments**: Segments on the same line within gap threshold → merge into single line
6. **Extend lines**: Extend merged lines by 20% beyond endpoints to handle broken borders
7. **Merge nearby parallel lines**: Lines within 0.5% of image dimension → merge into one
8. **Find intersections**: Every horizontal-vertical pair that crosses
9. **Build cells**: Create cells from adjacent intersection points (cluster threshold: 0.5% of image width)
10. **Filter noise**: Discard cells smaller than 2% x 1% of image dimensions

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
  alignmentMethod: 'anchor' | 'position' | 'hybrid';
  failureReason?: string;
}

async function autoAlignTemplate(
  cells: DetectedCell[],
  ocrTextBlocks: TextBlock[],
  baseTemplate: SDDGTemplate,
  imageDims: { width: number; height: number }
): Promise<AlignmentResult>
```

**Matching Strategy (Hybrid)**:

1. **Anchor Label Matching** (primary):
   - Key anchors: "SHIPPER", "CONSIGNEE", "UN or ID NO", "ADDITIONAL HANDLING", etc.
   - Find which detected cell contains each anchor label
   - Match to corresponding template field
   - Target: 5-8 reliable anchor matches

2. **Position-Based Matching** (fallback - always attempted):
   - For ALL fields, not just those without anchor matches
   - Normalize template field centers to percentages (0-1 range)
   - Find detected cell closest to expected normalized position
   - Only use match if distance < 10% of form dimension
   - Supplements anchor matches to improve transform accuracy

**Transform Computation**:

- From matched pairs: `(templateRegion, detectedCell)`
- Compute scale: ratio of detected cell sizes to template sizes
  - Track `scaleXCount` and `scaleYCount` separately
  - Divide each sum by its respective count
- Compute offset: average difference in position after scaling
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
      cellResult.cells, textBlocks, template, { width, height }
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
[SDDGProcessingScreen] <-- Auto-alignment happens here (invisible to user)
       |
   +-------+
   |       |
Success  Low Confidence
   |       |
   v       v
Results   Results + Warning Banner
   |       "Some values may be incorrect. [Adjust Regions]"
   |       |
   +---+---+
       |
       v
[InteractiveSDDGComplianceScreen]
       |
[Optional: "Adjust Regions" button navigates to SDDGRegionAdjustmentScreen]
```

**UI Changes**:

- `SDDGRegionAdjustmentScreen.tsx`: Accept `preAlignedTemplate` param
- `InteractiveSDDGComplianceScreen.tsx`: Show dismissible warning banner when alignment confidence is low, with "Adjust Regions" action button

## Error Handling

### Detection Failures

| Scenario | Cells Detected | Action |
|----------|----------------|--------|
| Good scan | 20+ cells | Full auto-alignment |
| Faded lines | 10-20 cells | Partial alignment, lower confidence |
| Poor scan | <10 cells | Skip alignment, use default template, flag |
| Skewed scan | Lines not classified | Show "Form appears skewed" message, suggest re-scan |
| Library error | Exception | Catch, log, use default template |

### Matching Failures

| Scenario | Matches | Action |
|----------|---------|--------|
| Strong alignment | 8+ anchor matches | High confidence, anchor method |
| Good alignment | 5-7 anchor matches | Good confidence, hybrid method |
| Weak alignment | 3-4 matches (anchor + position) | Medium confidence, flag for review |
| Poor alignment | <3 total matches | Low confidence, use default template, flag |

### Safety Guards

```typescript
function isTransformReasonable(transform: Transform, imageDims): boolean {
  // Offset shouldn't exceed 20% of image dimension
  if (Math.abs(transform.offsetX) > imageDims.width * 0.2) return false;
  if (Math.abs(transform.offsetY) > imageDims.height * 0.2) return false;

  // Scale should be between 0.7 and 1.3
  if (transform.scaleX < 0.7 || transform.scaleX > 1.3) return false;
  if (transform.scaleY < 0.7 || transform.scaleY > 1.3) return false;

  return true;
}
```

**Timeout**: OpenCV detection limited to 10 seconds (extended from 5s for older devices).

## Implementation Plan

### New Dependencies

- `react-native-fast-opencv@0.4.7` (pinned, requires native rebuild)

### New Files

| File | Purpose | ~Lines |
|------|---------|--------|
| `src/services/sddg/opencvCellDetection.ts` | Line detection, cell extraction | ~250 |
| `src/services/sddg/templateAutoAlignment.ts` | Matching, transform computation | ~300 |

### Modified Files

| File | Changes |
|------|---------|
| `src/services/sddg/templateExtractor.ts` | Add auto-alignment call (~40 lines) |
| `src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx` | Accept pre-aligned template (~10 lines) |
| `src/screens/inspector/InteractiveSDDGComplianceScreen.tsx` | Warning banner (~30 lines) |

### Implementation Order

1. Install `react-native-fast-opencv@0.4.7`, verify with grayscale test
2. Implement `opencvCellDetection.ts` with scale-aware thresholds
3. Implement `templateAutoAlignment.ts` with hybrid matching
4. Integrate into `templateExtractor.ts`
5. Update UI screens (warning banner on InteractiveSDDGComplianceScreen)
6. Test with sample SDDG forms

### Testing Strategy

**Unit Tests**: Cover line utilities, cell building, transform computation, matching logic.

**Integration Tests (Post-MVP)**: Create a corpus of anonymized SDDG scans with expected cell counts and anchor matches. This is deferred to post-MVP but should be added before production release.

**Manual Testing**: Test with the sample forms in `assets/` directory during development.

## Success Criteria

- Auto-alignment succeeds on >80% of **clearly scanned, non-skewed** forms
- When successful, extraction accuracy matches manual adjustment
- Processing time increase <5 seconds on modern devices
- Graceful fallback with user feedback when detection fails
- Clear messaging when skew is detected

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Line detection method | HoughLinesP + extend/merge | Handles broken table borders from text/folds |
| Cell-to-field mapping | Hybrid (anchors + position) | Anchors provide ground truth, position supplements |
| Transform type | Translation + Scale only | Handles common variations; rotation deferred to future |
| Thresholds | Percentage-based | Scale-aware across different image resolutions |
| UX flow | Auto with optional refinement | Fast happy path, manual refinement when needed |
| Fallback behavior | Proceed with warning banner | Doesn't block user, provides actionable recovery |
| Skew handling | Document limitation, prompt re-scan | MVP scope; deskew deferred to future iteration |
| Warning UI | InteractiveSDDGComplianceScreen | User sees results first, then decides on adjustment |
| Timeout | 10 seconds | Accommodates older devices without downscaling complexity |

## Revision History

- **2026-01-28 (v2)**: Revised based on code review feedback
  - Added "Known Limitations" section for skew handling
  - Changed to percentage-based thresholds (scale-aware)
  - Added line extension and colinear merging for broken borders
  - Clarified position-based fallback implementation
  - Fixed UI screen reference (InteractiveSDDGComplianceScreen, not SDDGResultsScreen)
  - Extended timeout to 10 seconds
  - Pinned library version to 0.4.7
  - Added testing strategy section
