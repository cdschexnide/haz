# OpenCV Cell Detection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automate SDDG template region alignment using OpenCV line detection to eliminate manual region adjustment.

**Architecture:** OpenCV detects form cell boundaries via HoughLinesP, matches detected cells to template fields using anchor labels and position fallback, computes a translation+scale transform, and applies it to auto-align the template before extraction.

**Tech Stack:** react-native-fast-opencv@0.4.7, TypeScript, Jest, existing ML Kit OCR

**Revision Note:** This plan was revised based on code review feedback. Key changes:
- Percentage-based thresholds (scale-aware)
- Line extension and colinear segment merging
- Position-based fallback for matching
- Fixed scale calculation bug (separate X/Y counts)
- Correct UI screen target (InteractiveSDDGComplianceScreen)
- Extended timeout to 10 seconds

---

## Task 1: Install and Verify OpenCV Library

**Files:**
- Modify: `package.json`
- Create: `src/services/sddg/__tests__/opencvSetup.test.ts`

**Step 1: Install react-native-fast-opencv (pinned version)**

Run:
```bash
yarn add react-native-fast-opencv@0.4.7
```

Expected: Package added to package.json with pinned version 0.4.7

**Step 2: Rebuild native modules (iOS)**

Run:
```bash
cd ios && pod install && cd ..
```

Expected: Pods installed successfully

**Step 3: Create a basic OpenCV verification test**

Create file `src/services/sddg/__tests__/opencvSetup.test.ts`:

```typescript
/**
 * OpenCV Setup Verification Test
 *
 * This test verifies that react-native-fast-opencv is properly installed
 * and basic functions are available. Since OpenCV requires native modules,
 * these tests mock the library for unit testing purposes.
 */

// Mock react-native-fast-opencv for Jest environment
jest.mock('react-native-fast-opencv', () => ({
  OpenCV: {
    invoke: jest.fn(),
  },
  ObjectType: {
    Mat: 'Mat',
    MatVector: 'MatVector',
    PointVector: 'PointVector',
  },
  ColorConversionCodes: {
    COLOR_BGR2GRAY: 6,
    COLOR_RGBA2GRAY: 11,
  },
  ThresholdTypes: {
    THRESH_BINARY: 0,
    THRESH_BINARY_INV: 1,
  },
  AdaptiveThresholdTypes: {
    ADAPTIVE_THRESH_MEAN_C: 0,
    ADAPTIVE_THRESH_GAUSSIAN_C: 1,
  },
}));

import { OpenCV, ColorConversionCodes } from 'react-native-fast-opencv';

describe('OpenCV Setup Verification', () => {
  it('should have OpenCV module available', () => {
    expect(OpenCV).toBeDefined();
    expect(OpenCV.invoke).toBeDefined();
  });

  it('should have color conversion codes', () => {
    expect(ColorConversionCodes.COLOR_BGR2GRAY).toBe(6);
    expect(ColorConversionCodes.COLOR_RGBA2GRAY).toBe(11);
  });
});
```

**Step 4: Run the test to verify setup**

Run:
```bash
yarn test src/services/sddg/__tests__/opencvSetup.test.ts
```

Expected: 2 tests pass

**Step 5: Commit**

```bash
git add package.json yarn.lock ios/Podfile.lock src/services/sddg/__tests__/opencvSetup.test.ts
git commit -m "chore: add react-native-fast-opencv@0.4.7 dependency

Install OpenCV library (pinned version) for cell detection feature.
Add basic setup verification test."
```

---

## Task 2: Create Type Definitions for Cell Detection

**Files:**
- Create: `src/services/sddg/opencvTypes.ts`

**Step 1: Create the types file**

Create file `src/services/sddg/opencvTypes.ts`:

```typescript
/**
 * Type definitions for OpenCV cell detection
 *
 * Note: Thresholds use percentages of image dimensions for scale-awareness.
 */

/**
 * A line segment detected by HoughLinesP
 */
export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * A point representing a line intersection
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * A detected cell (rectangle) on the form
 */
export interface DetectedCell {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Result of cell detection
 */
export interface CellDetectionResult {
  success: boolean;
  cells: DetectedCell[];
  horizontalLines: Line[];
  verticalLines: Line[];
  imageWidth: number;
  imageHeight: number;
  processingTimeMs: number;
  skewDetected?: boolean;
  error?: string;
}

/**
 * Configuration for cell detection
 * All size thresholds are percentages of image dimensions (0-1)
 */
export interface CellDetectionConfig {
  // Adaptive threshold parameters
  adaptiveBlockSize: number;  // Must be odd, default 11
  adaptiveC: number;          // Constant subtracted, default 2

  // HoughLinesP parameters
  houghThreshold: number;           // Min votes, default 50
  minLineLengthPercent: number;     // Min line length as % of image width, default 0.05 (5%)
  maxLineGapPercent: number;        // Max gap as % of image width, default 0.005 (0.5%)

  // Line classification
  angleToleranceDegrees: number;    // Degrees from horizontal/vertical, default 5

  // Line merging
  mergeDistancePercent: number;     // Max distance to merge parallel lines as % of image, default 0.005

  // Line extension
  lineExtensionPercent: number;     // Extend lines by this % beyond endpoints, default 0.2 (20%)

  // Cell filtering (as % of image dimensions)
  minCellWidthPercent: number;      // Min cell width as % of image width, default 0.02 (2%)
  minCellHeightPercent: number;     // Min cell height as % of image height, default 0.01 (1%)

  // Grid clustering
  clusterThresholdPercent: number;  // Cluster intersections within this % of image width, default 0.005

  // Timeout
  timeoutMs: number;                // Max processing time, default 10000 (10s)
}

/**
 * Default configuration with percentage-based thresholds
 */
export const DEFAULT_CELL_DETECTION_CONFIG: CellDetectionConfig = {
  adaptiveBlockSize: 11,
  adaptiveC: 2,
  houghThreshold: 50,
  minLineLengthPercent: 0.05,       // 5% of image width
  maxLineGapPercent: 0.005,         // 0.5% of image width
  angleToleranceDegrees: 5,
  mergeDistancePercent: 0.005,      // 0.5% of image dimension
  lineExtensionPercent: 0.2,        // Extend by 20%
  minCellWidthPercent: 0.02,        // 2% of image width
  minCellHeightPercent: 0.01,       // 1% of image height
  clusterThresholdPercent: 0.005,   // 0.5% of image width
  timeoutMs: 10000,                 // 10 seconds
};

/**
 * Transform to align template to detected cells
 */
export interface AlignmentTransform {
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Result of template auto-alignment
 */
export interface AutoAlignmentResult {
  success: boolean;
  transform: AlignmentTransform;
  matchedFields: number;
  totalFields: number;
  confidence: number;
  alignmentMethod: 'anchor' | 'position' | 'hybrid';
  anchorMatches: number;
  positionMatches: number;
  failureReason?: string;
  processingTimeMs: number;
}
```

**Step 2: Commit**

```bash
git add src/services/sddg/opencvTypes.ts
git commit -m "feat(sddg): add type definitions for OpenCV cell detection

Define interfaces with percentage-based thresholds for scale-awareness.
Includes Line, Point, DetectedCell, CellDetectionResult, config types,
AlignmentTransform, and AutoAlignmentResult."
```

---

## Task 3: Implement Line Classification and Manipulation Utilities

**Files:**
- Create: `src/services/sddg/lineUtils.ts`
- Create: `src/services/sddg/__tests__/lineUtils.test.ts`

**Step 1: Write failing tests for line utilities**

Create file `src/services/sddg/__tests__/lineUtils.test.ts`:

```typescript
import {
  isHorizontal,
  isVertical,
  getLineAngle,
  mergeNearbyLines,
  mergeColinearSegments,
  extendLine,
  findIntersection,
  classifyLines,
} from '../lineUtils';
import { Line, Point } from '../opencvTypes';

describe('lineUtils', () => {
  describe('getLineAngle', () => {
    it('should return 0 for horizontal line', () => {
      const line: Line = { x1: 0, y1: 100, x2: 200, y2: 100 };
      expect(getLineAngle(line)).toBe(0);
    });

    it('should return 90 for vertical line', () => {
      const line: Line = { x1: 100, y1: 0, x2: 100, y2: 200 };
      expect(getLineAngle(line)).toBe(90);
    });

    it('should return 45 for diagonal line', () => {
      const line: Line = { x1: 0, y1: 0, x2: 100, y2: 100 };
      expect(getLineAngle(line)).toBe(45);
    });
  });

  describe('isHorizontal', () => {
    it('should return true for perfectly horizontal line', () => {
      const line: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      expect(isHorizontal(line, 5)).toBe(true);
    });

    it('should return true for nearly horizontal line within tolerance', () => {
      const line: Line = { x1: 0, y1: 100, x2: 500, y2: 104 }; // ~0.46 degrees
      expect(isHorizontal(line, 5)).toBe(true);
    });

    it('should return false for vertical line', () => {
      const line: Line = { x1: 100, y1: 0, x2: 100, y2: 500 };
      expect(isHorizontal(line, 5)).toBe(false);
    });
  });

  describe('isVertical', () => {
    it('should return true for perfectly vertical line', () => {
      const line: Line = { x1: 100, y1: 0, x2: 100, y2: 500 };
      expect(isVertical(line, 5)).toBe(true);
    });

    it('should return true for nearly vertical line within tolerance', () => {
      const line: Line = { x1: 100, y1: 0, x2: 104, y2: 500 }; // ~0.46 degrees from vertical
      expect(isVertical(line, 5)).toBe(true);
    });

    it('should return false for horizontal line', () => {
      const line: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      expect(isVertical(line, 5)).toBe(false);
    });
  });

  describe('mergeColinearSegments', () => {
    it('should merge segments on the same horizontal line', () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 100, y2: 100 },
        { x1: 120, y1: 100, x2: 250, y2: 100 },  // Gap of 20px
      ];
      const merged = mergeColinearSegments(lines, 50);  // Allow 50px gap
      expect(merged.length).toBe(1);
      expect(merged[0].x1).toBe(0);
      expect(merged[0].x2).toBe(250);
    });

    it('should not merge segments with large gap', () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 100, y2: 100 },
        { x1: 200, y1: 100, x2: 300, y2: 100 },  // Gap of 100px
      ];
      const merged = mergeColinearSegments(lines, 50);  // Allow only 50px gap
      expect(merged.length).toBe(2);
    });
  });

  describe('extendLine', () => {
    it('should extend horizontal line by percentage', () => {
      const line: Line = { x1: 100, y1: 200, x2: 400, y2: 200 };
      const extended = extendLine(line, 0.2);  // Extend by 20%
      // Original length: 300, extension: 60 each side
      expect(extended.x1).toBe(40);  // 100 - 60
      expect(extended.x2).toBe(460); // 400 + 60
      expect(extended.y1).toBe(200);
      expect(extended.y2).toBe(200);
    });

    it('should extend vertical line by percentage', () => {
      const line: Line = { x1: 200, y1: 100, x2: 200, y2: 400 };
      const extended = extendLine(line, 0.2);
      expect(extended.x1).toBe(200);
      expect(extended.x2).toBe(200);
      expect(extended.y1).toBe(40);
      expect(extended.y2).toBe(460);
    });
  });

  describe('mergeNearbyLines', () => {
    it('should merge two parallel horizontal lines close together', () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 500, y2: 100 },
        { x1: 50, y1: 105, x2: 450, y2: 105 },
      ];
      const merged = mergeNearbyLines(lines, 15);
      expect(merged.length).toBe(1);
      expect(merged[0].x1).toBe(0);
      expect(merged[0].x2).toBe(500);
    });

    it('should not merge lines that are far apart', () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 500, y2: 100 },
        { x1: 0, y1: 200, x2: 500, y2: 200 },
      ];
      const merged = mergeNearbyLines(lines, 15);
      expect(merged.length).toBe(2);
    });

    it('should handle empty input', () => {
      const merged = mergeNearbyLines([], 15);
      expect(merged.length).toBe(0);
    });
  });

  describe('findIntersection', () => {
    it('should find intersection of perpendicular lines', () => {
      const horizontal: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      const vertical: Line = { x1: 200, y1: 0, x2: 200, y2: 300 };
      const intersection = findIntersection(horizontal, vertical);

      expect(intersection).not.toBeNull();
      expect(intersection!.x).toBeCloseTo(200, 0);
      expect(intersection!.y).toBeCloseTo(100, 0);
    });

    it('should return null for parallel lines', () => {
      const line1: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      const line2: Line = { x1: 0, y1: 200, x2: 500, y2: 200 };
      const intersection = findIntersection(line1, line2);

      expect(intersection).toBeNull();
    });

    it('should find intersection even if outside original segments (extended lines)', () => {
      // After extension, lines that didn't originally intersect may now intersect
      const horizontal: Line = { x1: 0, y1: 100, x2: 300, y2: 100 };
      const vertical: Line = { x1: 200, y1: 0, x2: 200, y2: 300 };
      const intersection = findIntersection(horizontal, vertical);

      expect(intersection).not.toBeNull();
      expect(intersection!.x).toBeCloseTo(200, 0);
      expect(intersection!.y).toBeCloseTo(100, 0);
    });
  });

  describe('classifyLines', () => {
    it('should separate horizontal and vertical lines', () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 500, y2: 100 },   // Horizontal
        { x1: 200, y1: 0, x2: 200, y2: 500 },   // Vertical
        { x1: 0, y1: 0, x2: 100, y2: 100 },     // Diagonal (ignored)
      ];
      const { horizontal, vertical } = classifyLines(lines, 5);

      expect(horizontal.length).toBe(1);
      expect(vertical.length).toBe(1);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
yarn test src/services/sddg/__tests__/lineUtils.test.ts
```

Expected: Tests fail with "Cannot find module '../lineUtils'"

**Step 3: Implement line utilities**

Create file `src/services/sddg/lineUtils.ts`:

```typescript
/**
 * Line detection and manipulation utilities
 *
 * Includes colinear segment merging and line extension to handle
 * broken table borders from text, folds, or low contrast.
 */

import { Line, Point } from './opencvTypes';

/**
 * Calculate angle of a line in degrees (0-90)
 * 0 = horizontal, 90 = vertical
 */
export function getLineAngle(line: Line): number {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;

  const radians = Math.atan2(Math.abs(dy), Math.abs(dx));
  return radians * (180 / Math.PI);
}

/**
 * Check if a line is horizontal (within tolerance)
 */
export function isHorizontal(line: Line, toleranceDegrees: number): boolean {
  const angle = getLineAngle(line);
  return angle <= toleranceDegrees;
}

/**
 * Check if a line is vertical (within tolerance)
 */
export function isVertical(line: Line, toleranceDegrees: number): boolean {
  const angle = getLineAngle(line);
  return angle >= (90 - toleranceDegrees);
}

/**
 * Get length of a line
 */
export function getLineLength(line: Line): number {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get the average y-position for a horizontal line, or x-position for vertical
 */
function getLinePosition(line: Line, isHoriz: boolean): number {
  if (isHoriz) {
    return (line.y1 + line.y2) / 2;
  }
  return (line.x1 + line.x2) / 2;
}

/**
 * Check if two segments are colinear (on the same line)
 */
function areColinear(line1: Line, line2: Line, isHoriz: boolean, tolerance: number): boolean {
  const pos1 = getLinePosition(line1, isHoriz);
  const pos2 = getLinePosition(line2, isHoriz);
  return Math.abs(pos1 - pos2) <= tolerance;
}

/**
 * Merge colinear segments that have small gaps between them
 * This handles broken table borders where text or damage creates gaps
 */
export function mergeColinearSegments(lines: Line[], maxGap: number): Line[] {
  if (lines.length <= 1) return [...lines];

  // Determine if horizontal or vertical
  const isHoriz = lines.length > 0 && isHorizontal(lines[0], 10);
  const tolerance = 10; // Tolerance for colinearity check

  // Group colinear segments
  const groups: Line[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    if (used.has(i)) continue;

    const group = [lines[i]];
    used.add(i);

    for (let j = i + 1; j < lines.length; j++) {
      if (used.has(j)) continue;

      if (areColinear(lines[i], lines[j], isHoriz, tolerance)) {
        // Check if gap between segments is small enough
        const gap = getGapBetweenSegments(lines[i], lines[j], isHoriz);
        if (gap <= maxGap) {
          group.push(lines[j]);
          used.add(j);
        }
      }
    }

    groups.push(group);
  }

  // Merge each group into a single line
  return groups.map(group => mergeSegmentGroup(group, isHoriz));
}

/**
 * Get gap between two colinear segments
 */
function getGapBetweenSegments(line1: Line, line2: Line, isHoriz: boolean): number {
  if (isHoriz) {
    const min1 = Math.min(line1.x1, line1.x2);
    const max1 = Math.max(line1.x1, line1.x2);
    const min2 = Math.min(line2.x1, line2.x2);
    const max2 = Math.max(line2.x1, line2.x2);

    if (max1 < min2) return min2 - max1;
    if (max2 < min1) return min1 - max2;
    return 0; // Overlapping
  } else {
    const min1 = Math.min(line1.y1, line1.y2);
    const max1 = Math.max(line1.y1, line1.y2);
    const min2 = Math.min(line2.y1, line2.y2);
    const max2 = Math.max(line2.y1, line2.y2);

    if (max1 < min2) return min2 - max1;
    if (max2 < min1) return min1 - max2;
    return 0;
  }
}

/**
 * Merge a group of colinear segments into one line
 */
function mergeSegmentGroup(segments: Line[], isHoriz: boolean): Line {
  if (segments.length === 1) return segments[0];

  if (isHoriz) {
    const avgY = segments.reduce((sum, l) => sum + (l.y1 + l.y2) / 2, 0) / segments.length;
    const minX = Math.min(...segments.flatMap(l => [l.x1, l.x2]));
    const maxX = Math.max(...segments.flatMap(l => [l.x1, l.x2]));
    return { x1: minX, y1: avgY, x2: maxX, y2: avgY };
  } else {
    const avgX = segments.reduce((sum, l) => sum + (l.x1 + l.x2) / 2, 0) / segments.length;
    const minY = Math.min(...segments.flatMap(l => [l.y1, l.y2]));
    const maxY = Math.max(...segments.flatMap(l => [l.y1, l.y2]));
    return { x1: avgX, y1: minY, x2: avgX, y2: maxY };
  }
}

/**
 * Extend a line by a percentage beyond its endpoints
 * Handles broken borders where lines don't quite reach intersections
 */
export function extendLine(line: Line, extensionPercent: number): Line {
  const length = getLineLength(line);
  const extension = length * extensionPercent;

  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;

  // Normalize direction
  const dirX = dx / length;
  const dirY = dy / length;

  return {
    x1: line.x1 - dirX * extension,
    y1: line.y1 - dirY * extension,
    x2: line.x2 + dirX * extension,
    y2: line.y2 + dirY * extension,
  };
}

/**
 * Merge nearby parallel lines into single lines
 */
export function mergeNearbyLines(lines: Line[], maxDistance: number): Line[] {
  if (lines.length === 0) return [];

  const isHoriz = lines.length > 0 && isHorizontal(lines[0], 10);

  // Sort by position (y for horizontal, x for vertical)
  const sorted = [...lines].sort((a, b) =>
    getLinePosition(a, isHoriz) - getLinePosition(b, isHoriz)
  );

  const merged: Line[] = [];
  let currentGroup: Line[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prevPos = getLinePosition(sorted[i - 1], isHoriz);
    const currPos = getLinePosition(sorted[i], isHoriz);

    if (Math.abs(currPos - prevPos) <= maxDistance) {
      currentGroup.push(sorted[i]);
    } else {
      merged.push(mergeLineGroup(currentGroup, isHoriz));
      currentGroup = [sorted[i]];
    }
  }

  merged.push(mergeLineGroup(currentGroup, isHoriz));

  return merged;
}

/**
 * Merge a group of nearby lines into a single line
 */
function mergeLineGroup(lines: Line[], isHoriz: boolean): Line {
  if (lines.length === 1) return lines[0];

  if (isHoriz) {
    const avgY = lines.reduce((sum, l) => sum + (l.y1 + l.y2) / 2, 0) / lines.length;
    const minX = Math.min(...lines.map(l => Math.min(l.x1, l.x2)));
    const maxX = Math.max(...lines.map(l => Math.max(l.x1, l.x2)));
    return { x1: minX, y1: avgY, x2: maxX, y2: avgY };
  } else {
    const avgX = lines.reduce((sum, l) => sum + (l.x1 + l.x2) / 2, 0) / lines.length;
    const minY = Math.min(...lines.map(l => Math.min(l.y1, l.y2)));
    const maxY = Math.max(...lines.map(l => Math.max(l.y1, l.y2)));
    return { x1: avgX, y1: minY, x2: avgX, y2: maxY };
  }
}

/**
 * Find intersection point of two lines (treats as infinite lines)
 * Returns null if lines are parallel
 */
export function findIntersection(line1: Line, line2: Line): Point | null {
  const x1 = line1.x1, y1 = line1.y1, x2 = line1.x2, y2 = line1.y2;
  const x3 = line2.x1, y3 = line2.y1, x4 = line2.x2, y4 = line2.y2;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // Lines are parallel
  if (Math.abs(denom) < 0.0001) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

  const x = x1 + t * (x2 - x1);
  const y = y1 + t * (y2 - y1);

  return { x, y };
}

/**
 * Classify lines into horizontal and vertical groups
 */
export function classifyLines(
  lines: Line[],
  toleranceDegrees: number
): { horizontal: Line[]; vertical: Line[]; skewDetected: boolean } {
  const horizontal: Line[] = [];
  const vertical: Line[] = [];
  let diagonalCount = 0;

  for (const line of lines) {
    if (isHorizontal(line, toleranceDegrees)) {
      horizontal.push(line);
    } else if (isVertical(line, toleranceDegrees)) {
      vertical.push(line);
    } else {
      diagonalCount++;
    }
  }

  // Detect skew: if most lines are diagonal, the form is likely skewed
  const totalClassified = horizontal.length + vertical.length;
  const skewDetected = totalClassified > 0 && diagonalCount > totalClassified;

  return { horizontal, vertical, skewDetected };
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
yarn test src/services/sddg/__tests__/lineUtils.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/services/sddg/lineUtils.ts src/services/sddg/__tests__/lineUtils.test.ts
git commit -m "feat(sddg): implement line classification utilities

Add functions for line angle calculation, horizontal/vertical classification,
colinear segment merging, line extension, and intersection finding.
Includes skew detection. Full test coverage."
```

---

## Task 4: Implement Cell Building from Line Intersections

**Files:**
- Create: `src/services/sddg/cellBuilder.ts`
- Create: `src/services/sddg/__tests__/cellBuilder.test.ts`

**Step 1: Write failing tests**

Create file `src/services/sddg/__tests__/cellBuilder.test.ts`:

```typescript
import { buildCellsFromLines, buildGrid, filterCells } from '../cellBuilder';
import { Line, DetectedCell, Point } from '../opencvTypes';

describe('cellBuilder', () => {
  describe('buildGrid', () => {
    it('should build a grid from intersections', () => {
      const intersections: Point[] = [
        { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 200, y: 0 },
        { x: 0, y: 50 }, { x: 100, y: 50 }, { x: 200, y: 50 },
        { x: 0, y: 100 }, { x: 100, y: 100 }, { x: 200, y: 100 },
      ];

      const grid = buildGrid(intersections, 10);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(3);
      expect(grid.points[0][0]).toEqual({ x: 0, y: 0 });
      expect(grid.points[2][2]).toEqual({ x: 200, y: 100 });
    });

    it('should handle unsorted intersections', () => {
      const intersections: Point[] = [
        { x: 200, y: 100 }, { x: 0, y: 0 }, { x: 100, y: 50 },
        { x: 0, y: 100 }, { x: 200, y: 0 }, { x: 100, y: 0 },
        { x: 0, y: 50 }, { x: 200, y: 50 }, { x: 100, y: 100 },
      ];

      const grid = buildGrid(intersections, 10);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(3);
    });

    it('should use percentage-based clustering', () => {
      // Points slightly off-grid should cluster together
      const intersections: Point[] = [
        { x: 0, y: 0 }, { x: 102, y: 3 }, { x: 200, y: 0 },
        { x: 2, y: 100 }, { x: 98, y: 101 }, { x: 201, y: 99 },
      ];

      const grid = buildGrid(intersections, 15);  // 15px cluster threshold

      expect(grid.rows).toBe(2);
      expect(grid.cols).toBe(3);
    });
  });

  describe('buildCellsFromLines', () => {
    it('should build cells from a simple 2x2 grid', () => {
      const horizontal: Line[] = [
        { x1: 0, y1: 0, x2: 200, y2: 0 },
        { x1: 0, y1: 100, x2: 200, y2: 100 },
        { x1: 0, y1: 200, x2: 200, y2: 200 },
      ];
      const vertical: Line[] = [
        { x1: 0, y1: 0, x2: 0, y2: 200 },
        { x1: 100, y1: 0, x2: 100, y2: 200 },
        { x1: 200, y1: 0, x2: 200, y2: 200 },
      ];

      const cells = buildCellsFromLines(horizontal, vertical, 10);

      expect(cells.length).toBe(4);

      const topLeft = cells.find(c => c.x === 0 && c.y === 0);
      expect(topLeft).toBeDefined();
      expect(topLeft!.width).toBe(100);
      expect(topLeft!.height).toBe(100);
    });

    it('should handle no intersections gracefully', () => {
      const horizontal: Line[] = [{ x1: 0, y1: 0, x2: 100, y2: 0 }];
      const vertical: Line[] = [{ x1: 200, y1: 100, x2: 200, y2: 200 }];

      const cells = buildCellsFromLines(horizontal, vertical, 10);
      expect(cells.length).toBe(0);
    });
  });

  describe('filterCells', () => {
    it('should filter out cells smaller than minimum size', () => {
      const cells: DetectedCell[] = [
        { x: 0, y: 0, width: 100, height: 50 },
        { x: 100, y: 0, width: 30, height: 50 },
        { x: 0, y: 50, width: 100, height: 20 },
        { x: 100, y: 50, width: 30, height: 20 },
      ];

      const filtered = filterCells(cells, 50, 30);

      expect(filtered.length).toBe(1);
      expect(filtered[0]).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });

    it('should keep all cells if they meet minimum size', () => {
      const cells: DetectedCell[] = [
        { x: 0, y: 0, width: 100, height: 50 },
        { x: 100, y: 0, width: 100, height: 50 },
      ];

      const filtered = filterCells(cells, 50, 30);
      expect(filtered.length).toBe(2);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
yarn test src/services/sddg/__tests__/cellBuilder.test.ts
```

Expected: Tests fail with "Cannot find module '../cellBuilder'"

**Step 3: Implement cell builder**

Create file `src/services/sddg/cellBuilder.ts`:

```typescript
/**
 * Build cells from detected lines
 */

import { Line, Point, DetectedCell } from './opencvTypes';
import { findIntersection } from './lineUtils';

/**
 * Grid structure for organizing intersection points
 */
export interface Grid {
  rows: number;
  cols: number;
  points: Point[][];
}

/**
 * Cluster nearby values together (percentage-based threshold)
 */
function clusterValues(values: number[], threshold: number): number[] {
  if (values.length === 0) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const clustered: number[] = [sorted[0]];
  let clusterSum = sorted[0];
  let clusterCount = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - (clusterSum / clusterCount) <= threshold) {
      clusterSum += sorted[i];
      clusterCount++;
      clustered[clustered.length - 1] = clusterSum / clusterCount;
    } else {
      clustered.push(sorted[i]);
      clusterSum = sorted[i];
      clusterCount = 1;
    }
  }

  return clustered;
}

/**
 * Build a sorted grid from intersection points
 * Uses configurable cluster threshold for scale-awareness
 */
export function buildGrid(intersections: Point[], clusterThreshold: number): Grid {
  if (intersections.length === 0) {
    return { rows: 0, cols: 0, points: [] };
  }

  const xValues = intersections.map(p => p.x);
  const yValues = intersections.map(p => p.y);

  const clusteredX = clusterValues(xValues, clusterThreshold);
  const clusteredY = clusterValues(yValues, clusterThreshold);

  const points: Point[][] = [];
  for (let row = 0; row < clusteredY.length; row++) {
    points[row] = [];
    for (let col = 0; col < clusteredX.length; col++) {
      const targetX = clusteredX[col];
      const targetY = clusteredY[row];

      const closest = intersections.reduce((best, p) => {
        const distToBest = Math.abs(best.x - targetX) + Math.abs(best.y - targetY);
        const distToP = Math.abs(p.x - targetX) + Math.abs(p.y - targetY);
        return distToP < distToBest ? p : best;
      }, intersections[0]);

      points[row][col] = closest;
    }
  }

  return {
    rows: clusteredY.length,
    cols: clusteredX.length,
    points,
  };
}

/**
 * Build cells from horizontal and vertical lines
 */
export function buildCellsFromLines(
  horizontalLines: Line[],
  verticalLines: Line[],
  clusterThreshold: number
): DetectedCell[] {
  const intersections: Point[] = [];

  for (const h of horizontalLines) {
    for (const v of verticalLines) {
      const intersection = findIntersection(h, v);
      if (intersection) {
        intersections.push(intersection);
      }
    }
  }

  if (intersections.length < 4) {
    return [];
  }

  const grid = buildGrid(intersections, clusterThreshold);

  if (grid.rows < 2 || grid.cols < 2) {
    return [];
  }

  const cells: DetectedCell[] = [];

  for (let row = 0; row < grid.rows - 1; row++) {
    for (let col = 0; col < grid.cols - 1; col++) {
      const topLeft = grid.points[row][col];
      const bottomRight = grid.points[row + 1][col + 1];

      cells.push({
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
      });
    }
  }

  return cells;
}

/**
 * Filter cells by minimum size
 */
export function filterCells(
  cells: DetectedCell[],
  minWidth: number,
  minHeight: number
): DetectedCell[] {
  return cells.filter(cell =>
    cell.width >= minWidth && cell.height >= minHeight
  );
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
yarn test src/services/sddg/__tests__/cellBuilder.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/services/sddg/cellBuilder.ts src/services/sddg/__tests__/cellBuilder.test.ts
git commit -m "feat(sddg): implement cell building from line intersections

Add grid building with configurable cluster threshold for scale-awareness.
Handles imprecise intersections from line extension."
```

---

## Task 5: Implement OpenCV Cell Detection Service

**Files:**
- Create: `src/services/sddg/opencvCellDetection.ts`
- Create: `src/services/sddg/__tests__/opencvCellDetection.test.ts`

**Step 1: Write failing tests**

Create file `src/services/sddg/__tests__/opencvCellDetection.test.ts`:

```typescript
import { detectCells, parseHoughLines, computeScaleAwareThresholds } from '../opencvCellDetection';
import { CellDetectionConfig, DEFAULT_CELL_DETECTION_CONFIG } from '../opencvTypes';

jest.mock('react-native-fast-opencv', () => ({
  OpenCV: {
    invoke: jest.fn(),
    toJSValue: jest.fn(),
  },
  ObjectType: { Mat: 'Mat' },
  ColorConversionCodes: { COLOR_RGBA2GRAY: 11 },
  ThresholdTypes: { THRESH_BINARY_INV: 1 },
  AdaptiveThresholdTypes: { ADAPTIVE_THRESH_GAUSSIAN_C: 1 },
}));

describe('opencvCellDetection', () => {
  describe('parseHoughLines', () => {
    it('should parse HoughLinesP output array to Line objects', () => {
      const rawLines = [0, 100, 500, 100, 200, 0, 200, 300];
      const lines = parseHoughLines(rawLines);

      expect(lines.length).toBe(2);
      expect(lines[0]).toEqual({ x1: 0, y1: 100, x2: 500, y2: 100 });
      expect(lines[1]).toEqual({ x1: 200, y1: 0, x2: 200, y2: 300 });
    });

    it('should return empty array for null/undefined input', () => {
      expect(parseHoughLines(null as any)).toEqual([]);
      expect(parseHoughLines(undefined as any)).toEqual([]);
      expect(parseHoughLines([])).toEqual([]);
    });
  });

  describe('computeScaleAwareThresholds', () => {
    it('should compute pixel values from percentages', () => {
      const config = DEFAULT_CELL_DETECTION_CONFIG;
      const imageDims = { width: 2550, height: 3300 };

      const thresholds = computeScaleAwareThresholds(config, imageDims);

      expect(thresholds.minLineLength).toBe(Math.round(2550 * 0.05));  // 127px
      expect(thresholds.maxLineGap).toBe(Math.round(2550 * 0.005));    // 12px
      expect(thresholds.mergeDistance).toBe(Math.round(2550 * 0.005)); // 12px
      expect(thresholds.minCellWidth).toBe(Math.round(2550 * 0.02));   // 51px
      expect(thresholds.minCellHeight).toBe(Math.round(3300 * 0.01));  // 33px
    });
  });

  describe('detectCells', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return failure result when OpenCV throws', async () => {
      const { OpenCV } = require('react-native-fast-opencv');
      OpenCV.invoke.mockRejectedValue(new Error('OpenCV error'));

      const result = await detectCells('test-image.png');

      expect(result.success).toBe(false);
      expect(result.error).toContain('OpenCV error');
      expect(result.cells).toEqual([]);
    });

    it('should use 10 second timeout by default', async () => {
      expect(DEFAULT_CELL_DETECTION_CONFIG.timeoutMs).toBe(10000);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
yarn test src/services/sddg/__tests__/opencvCellDetection.test.ts
```

Expected: Tests fail

**Step 3: Implement OpenCV cell detection**

Create file `src/services/sddg/opencvCellDetection.ts`:

```typescript
/**
 * OpenCV-based cell detection for SDDG forms
 *
 * Uses HoughLinesP to detect lines, merges colinear segments,
 * extends lines, and builds cells from intersections.
 *
 * All thresholds are percentage-based for scale-awareness.
 */

import {
  Line,
  DetectedCell,
  CellDetectionResult,
  CellDetectionConfig,
  DEFAULT_CELL_DETECTION_CONFIG,
} from './opencvTypes';
import { classifyLines, mergeNearbyLines, mergeColinearSegments, extendLine } from './lineUtils';
import { buildCellsFromLines, filterCells } from './cellBuilder';

let OpenCV: any;
let ObjectType: any;
let ColorConversionCodes: any;
let ThresholdTypes: any;
let AdaptiveThresholdTypes: any;

try {
  const opencv = require('react-native-fast-opencv');
  OpenCV = opencv.OpenCV;
  ObjectType = opencv.ObjectType;
  ColorConversionCodes = opencv.ColorConversionCodes;
  ThresholdTypes = opencv.ThresholdTypes;
  AdaptiveThresholdTypes = opencv.AdaptiveThresholdTypes;
} catch (e) {
  console.warn('react-native-fast-opencv not available');
}

/**
 * Computed pixel thresholds from percentage config
 */
export interface ScaleAwareThresholds {
  minLineLength: number;
  maxLineGap: number;
  mergeDistance: number;
  lineExtension: number;
  minCellWidth: number;
  minCellHeight: number;
  clusterThreshold: number;
}

/**
 * Compute pixel values from percentage-based config
 */
export function computeScaleAwareThresholds(
  config: CellDetectionConfig,
  imageDims: { width: number; height: number }
): ScaleAwareThresholds {
  return {
    minLineLength: Math.round(imageDims.width * config.minLineLengthPercent),
    maxLineGap: Math.round(imageDims.width * config.maxLineGapPercent),
    mergeDistance: Math.round(imageDims.width * config.mergeDistancePercent),
    lineExtension: config.lineExtensionPercent,
    minCellWidth: Math.round(imageDims.width * config.minCellWidthPercent),
    minCellHeight: Math.round(imageDims.height * config.minCellHeightPercent),
    clusterThreshold: Math.round(imageDims.width * config.clusterThresholdPercent),
  };
}

/**
 * Parse HoughLinesP output to Line objects
 */
export function parseHoughLines(rawLines: number[] | null | undefined): Line[] {
  if (!rawLines || rawLines.length === 0) {
    return [];
  }

  const lines: Line[] = [];
  for (let i = 0; i + 3 < rawLines.length; i += 4) {
    lines.push({
      x1: rawLines[i],
      y1: rawLines[i + 1],
      x2: rawLines[i + 2],
      y2: rawLines[i + 3],
    });
  }

  return lines;
}

/**
 * Detect cells in an image using OpenCV
 */
export async function detectCells(
  imageUri: string,
  config: CellDetectionConfig = DEFAULT_CELL_DETECTION_CONFIG
): Promise<CellDetectionResult> {
  const startTime = Date.now();

  try {
    if (!OpenCV) {
      return {
        success: false,
        cells: [],
        horizontalLines: [],
        verticalLines: [],
        imageWidth: 0,
        imageHeight: 0,
        processingTimeMs: Date.now() - startTime,
        error: 'OpenCV not available',
      };
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Cell detection timeout')), config.timeoutMs);
    });

    const detectionPromise = detectCellsInternal(imageUri, config);
    const result = await Promise.race([detectionPromise, timeoutPromise]);

    return {
      ...result,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      cells: [],
      horizontalLines: [],
      verticalLines: [],
      imageWidth: 0,
      imageHeight: 0,
      processingTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function detectCellsInternal(
  imageUri: string,
  config: CellDetectionConfig
): Promise<Omit<CellDetectionResult, 'processingTimeMs'>> {
  // 1. Load image
  const src = await OpenCV.invoke('imread', { p1: imageUri });
  const imageWidth = src.cols;
  const imageHeight = src.rows;

  // 2. Compute scale-aware thresholds
  const thresholds = computeScaleAwareThresholds(config, { width: imageWidth, height: imageHeight });

  // 3. Convert to grayscale
  const gray = await OpenCV.invoke('cvtColor', {
    p1: src,
    p2: ColorConversionCodes.COLOR_RGBA2GRAY,
  });

  // 4. Apply adaptive threshold
  const binary = await OpenCV.invoke('adaptiveThreshold', {
    p1: gray,
    p2: 255,
    p3: AdaptiveThresholdTypes.ADAPTIVE_THRESH_GAUSSIAN_C,
    p4: ThresholdTypes.THRESH_BINARY_INV,
    p5: config.adaptiveBlockSize,
    p6: config.adaptiveC,
  });

  // 5. Detect lines using HoughLinesP
  const linesResult = await OpenCV.invoke('HoughLinesP', {
    p1: binary,
    p2: 1,
    p3: Math.PI / 180,
    p4: config.houghThreshold,
    p5: thresholds.minLineLength,
    p6: thresholds.maxLineGap,
  });

  // 6. Parse and classify lines
  const rawLines = await OpenCV.toJSValue(linesResult);
  const allLines = parseHoughLines(rawLines);

  const { horizontal, vertical, skewDetected } = classifyLines(allLines, config.angleToleranceDegrees);

  // 7. Merge colinear segments (handles broken borders)
  const colinearMergedH = mergeColinearSegments(horizontal, thresholds.maxLineGap * 3);
  const colinearMergedV = mergeColinearSegments(vertical, thresholds.maxLineGap * 3);

  // 8. Extend lines (handles borders that don't quite reach intersections)
  const extendedH = colinearMergedH.map(l => extendLine(l, thresholds.lineExtension));
  const extendedV = colinearMergedV.map(l => extendLine(l, thresholds.lineExtension));

  // 9. Merge nearby parallel lines
  const mergedHorizontal = mergeNearbyLines(extendedH, thresholds.mergeDistance);
  const mergedVertical = mergeNearbyLines(extendedV, thresholds.mergeDistance);

  // 10. Build cells from intersections
  const allCells = buildCellsFromLines(mergedHorizontal, mergedVertical, thresholds.clusterThreshold);

  // 11. Filter by minimum size
  const cells = filterCells(allCells, thresholds.minCellWidth, thresholds.minCellHeight);

  // Clean up
  await OpenCV.invoke('release', { p1: src });
  await OpenCV.invoke('release', { p1: gray });
  await OpenCV.invoke('release', { p1: binary });

  return {
    success: cells.length >= 10,
    cells,
    horizontalLines: mergedHorizontal,
    verticalLines: mergedVertical,
    imageWidth,
    imageHeight,
    skewDetected,
  };
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
yarn test src/services/sddg/__tests__/opencvCellDetection.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/services/sddg/opencvCellDetection.ts src/services/sddg/__tests__/opencvCellDetection.test.ts
git commit -m "feat(sddg): implement OpenCV cell detection service

Add detectCells function with scale-aware thresholds, colinear segment
merging, line extension, and 10s timeout. Includes skew detection."
```

---

## Task 6: Implement Template Auto-Alignment

**Files:**
- Create: `src/services/sddg/templateAutoAlignment.ts`
- Create: `src/services/sddg/__tests__/templateAutoAlignment.test.ts`

**Step 1: Write failing tests**

Create file `src/services/sddg/__tests__/templateAutoAlignment.test.ts`:

```typescript
import {
  computeTransform,
  applyTransformToTemplate,
  findCellContainingPoint,
  isTransformReasonable,
  matchFieldByPosition,
} from '../templateAutoAlignment';
import { DetectedCell, AlignmentTransform } from '../opencvTypes';
import { SDDGTemplate } from '@/types/sddg-template';

describe('templateAutoAlignment', () => {
  describe('findCellContainingPoint', () => {
    const cells: DetectedCell[] = [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 100, y: 0, width: 100, height: 50 },
      { x: 0, y: 50, width: 100, height: 50 },
    ];

    it('should find cell containing a point', () => {
      const cell = findCellContainingPoint(cells, 50, 25);
      expect(cell).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });

    it('should return null for point outside all cells', () => {
      const cell = findCellContainingPoint(cells, 300, 300);
      expect(cell).toBeNull();
    });
  });

  describe('matchFieldByPosition', () => {
    const cells: DetectedCell[] = [
      { x: 50, y: 100, width: 200, height: 100 },    // Top-left area
      { x: 300, y: 100, width: 200, height: 100 },   // Top-right area
      { x: 50, y: 500, width: 200, height: 100 },    // Middle-left area
    ];

    it('should match field to nearest cell within threshold', () => {
      // Template field at normalized position (0.1, 0.1) on 1000x1000 image
      // Should match first cell centered at (150, 150)
      const imageDims = { width: 1000, height: 1000 };
      const templateCenter = { x: 0.1, y: 0.15 };  // Normalized
      const threshold = 0.15;  // 15%

      const cell = matchFieldByPosition(cells, templateCenter, imageDims, threshold);
      expect(cell).toEqual(cells[0]);
    });

    it('should return null if no cell within threshold', () => {
      const imageDims = { width: 1000, height: 1000 };
      const templateCenter = { x: 0.9, y: 0.9 };  // Bottom-right, no cell there
      const threshold = 0.1;

      const cell = matchFieldByPosition(cells, templateCenter, imageDims, threshold);
      expect(cell).toBeNull();
    });
  });

  describe('computeTransform', () => {
    it('should compute identity transform for matching regions', () => {
      const matches = [
        { template: { x: 100, y: 100 }, detected: { x: 100, y: 100 } },
        { template: { x: 200, y: 200 }, detected: { x: 200, y: 200 } },
      ];
      const imageDims = { width: 1000, height: 1000 };

      const transform = computeTransform(matches, imageDims);

      expect(transform.offsetX).toBeCloseTo(0, 1);
      expect(transform.offsetY).toBeCloseTo(0, 1);
      expect(transform.scaleX).toBeCloseTo(1, 2);
      expect(transform.scaleY).toBeCloseTo(1, 2);
    });

    it('should track scaleX and scaleY counts separately', () => {
      // Only X differences are significant
      const matches = [
        { template: { x: 100, y: 100 }, detected: { x: 110, y: 100 } },
        { template: { x: 200, y: 100 }, detected: { x: 220, y: 100 } },
      ];
      const imageDims = { width: 1000, height: 1000 };

      const transform = computeTransform(matches, imageDims);

      // X scale should be ~1.1, Y scale should be 1 (no Y variation)
      expect(transform.scaleX).toBeCloseTo(1.1, 1);
      expect(transform.scaleY).toBeCloseTo(1, 1);
    });
  });

  describe('isTransformReasonable', () => {
    const imageDims = { width: 2550, height: 3300 };

    it('should accept identity transform', () => {
      const transform: AlignmentTransform = { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
      expect(isTransformReasonable(transform, imageDims)).toBe(true);
    });

    it('should accept small offset', () => {
      const transform: AlignmentTransform = { offsetX: 100, offsetY: 100, scaleX: 1, scaleY: 1 };
      expect(isTransformReasonable(transform, imageDims)).toBe(true);
    });

    it('should reject large offset (>20%)', () => {
      const transform: AlignmentTransform = { offsetX: 600, offsetY: 0, scaleX: 1, scaleY: 1 };
      expect(isTransformReasonable(transform, imageDims)).toBe(false);
    });

    it('should reject extreme scale', () => {
      const transform: AlignmentTransform = { offsetX: 0, offsetY: 0, scaleX: 2.0, scaleY: 1 };
      expect(isTransformReasonable(transform, imageDims)).toBe(false);
    });
  });

  describe('applyTransformToTemplate', () => {
    it('should apply offset and scale to all regions', () => {
      const template: SDDGTemplate = {
        formType: 'TEST',
        formName: 'Test Form',
        identifiers: [],
        regions: {
          shipper: { x: 100, y: 200, w: 300, h: 100, fieldType: 'text' },
        },
      };
      const transform: AlignmentTransform = { offsetX: 50, offsetY: 25, scaleX: 1.1, scaleY: 1.1 };

      const aligned = applyTransformToTemplate(template, transform);

      expect(aligned.regions.shipper!.x).toBe(Math.round(100 * 1.1 + 50));  // 160
      expect(aligned.regions.shipper!.y).toBe(Math.round(200 * 1.1 + 25));  // 245
      expect(aligned.regions.shipper!.w).toBe(Math.round(300 * 1.1));       // 330
      expect(aligned.regions.shipper!.h).toBe(Math.round(100 * 1.1));       // 110
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
yarn test src/services/sddg/__tests__/templateAutoAlignment.test.ts
```

Expected: Tests fail

**Step 3: Implement template auto-alignment**

Create file `src/services/sddg/templateAutoAlignment.ts`:

```typescript
/**
 * Template auto-alignment using detected cells
 *
 * Matches detected cells to template fields using:
 * 1. Anchor labels (primary)
 * 2. Position-based matching (fallback, always attempted)
 *
 * Then computes translation+scale transform.
 *
 * NOTE: Scale X and Y are tracked separately to fix the calculation bug
 * identified in code review.
 */

import { SDDGTemplate, FieldRegion } from '@/types/sddg-template';
import { TextBlock } from './anchorTypes';
import { DetectedCell, AlignmentTransform, AutoAlignmentResult } from './opencvTypes';

const ALIGNMENT_ANCHORS: Record<string, string[]> = {
  shipper: ['SHIPPER'],
  consignee: ['CONSIGNEE'],
  'air_waybill.awb_number': ['AIR WAYBILL', 'AIR WAYBILL NO'],
  'shipper_reference.tcn': ["SHIPPER'S REFERENCE", 'TCN'],
  'transportation_details.airport_departure': ['AIRPORT OF DEPARTURE'],
  'transportation_details.airport_destination': ['AIRPORT OF DESTINATION'],
  'dangerous_goods.un_number': ['UN or ID NO', 'UN OR ID'],
  'dangerous_goods.proper_shipping_name': ['PROPER SHIPPING NAME'],
  additional_handling: ['ADDITIONAL HANDLING'],
  'signature_block.name_title': ['NAME/TITLE', 'NAME OF SIGNATORY'],
};

// Template field centers as normalized percentages (0-1)
// Based on AMC_IMT_1033 at 2550x3300
const TEMPLATE_FIELD_POSITIONS: Record<string, { x: number; y: number }> = {
  shipper: { x: 0.31, y: 0.13 },
  consignee: { x: 0.31, y: 0.21 },
  'air_waybill.awb_number': { x: 0.77, y: 0.09 },
  'shipper_reference.tcn': { x: 0.77, y: 0.16 },
  'transportation_details.airport_departure': { x: 0.50, y: 0.34 },
  'transportation_details.airport_destination': { x: 0.31, y: 0.39 },
  'dangerous_goods.un_number': { x: 0.08, y: 0.58 },
  'dangerous_goods.proper_shipping_name': { x: 0.25, y: 0.58 },
  additional_handling: { x: 0.49, y: 0.76 },
  'signature_block.name_title': { x: 0.79, y: 0.88 },
};

export function findCellContainingPoint(
  cells: DetectedCell[],
  x: number,
  y: number
): DetectedCell | null {
  for (const cell of cells) {
    if (
      x >= cell.x &&
      x <= cell.x + cell.width &&
      y >= cell.y &&
      y <= cell.y + cell.height
    ) {
      return cell;
    }
  }
  return null;
}

/**
 * Match field to nearest cell by normalized position
 */
export function matchFieldByPosition(
  cells: DetectedCell[],
  templateCenterNormalized: { x: number; y: number },
  imageDims: { width: number; height: number },
  thresholdPercent: number
): DetectedCell | null {
  const targetX = templateCenterNormalized.x * imageDims.width;
  const targetY = templateCenterNormalized.y * imageDims.height;
  const thresholdPx = Math.max(imageDims.width, imageDims.height) * thresholdPercent;

  let bestCell: DetectedCell | null = null;
  let bestDistance = Infinity;

  for (const cell of cells) {
    const cellCenterX = cell.x + cell.width / 2;
    const cellCenterY = cell.y + cell.height / 2;
    const distance = Math.sqrt(
      Math.pow(cellCenterX - targetX, 2) + Math.pow(cellCenterY - targetY, 2)
    );

    if (distance < thresholdPx && distance < bestDistance) {
      bestDistance = distance;
      bestCell = cell;
    }
  }

  return bestCell;
}

function matchCellToTemplateFieldByAnchor(
  fieldPath: string,
  cells: DetectedCell[],
  textBlocks: TextBlock[]
): DetectedCell | null {
  const anchorLabels = ALIGNMENT_ANCHORS[fieldPath];
  if (!anchorLabels) return null;

  for (const block of textBlocks) {
    const normalizedText = block.text.toUpperCase().replace(/\s+/g, ' ').trim();

    for (const label of anchorLabels) {
      if (normalizedText.includes(label.toUpperCase())) {
        const centerX = block.boundingBox.x + block.boundingBox.width / 2;
        const centerY = block.boundingBox.y + block.boundingBox.height / 2;
        return findCellContainingPoint(cells, centerX, centerY);
      }
    }
  }

  return null;
}

/**
 * Compute alignment transform from matched point pairs
 * FIX: Track scaleXCount and scaleYCount separately
 */
export function computeTransform(
  matches: Array<{ template: { x: number; y: number }; detected: { x: number; y: number } }>,
  imageDims: { width: number; height: number }
): AlignmentTransform {
  if (matches.length === 0) {
    return { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
  }

  if (matches.length === 1) {
    const m = matches[0];
    return {
      offsetX: m.detected.x - m.template.x,
      offsetY: m.detected.y - m.template.y,
      scaleX: 1,
      scaleY: 1,
    };
  }

  // FIX: Track X and Y scale counts separately
  let scaleXSum = 0, scaleYSum = 0;
  let scaleXCount = 0, scaleYCount = 0;

  for (let i = 0; i < matches.length; i++) {
    for (let j = i + 1; j < matches.length; j++) {
      const templateDx = Math.abs(matches[j].template.x - matches[i].template.x);
      const templateDy = Math.abs(matches[j].template.y - matches[i].template.y);
      const detectedDx = Math.abs(matches[j].detected.x - matches[i].detected.x);
      const detectedDy = Math.abs(matches[j].detected.y - matches[i].detected.y);

      if (templateDx > 50) {
        scaleXSum += detectedDx / templateDx;
        scaleXCount++;
      }
      if (templateDy > 50) {
        scaleYSum += detectedDy / templateDy;
        scaleYCount++;
      }
    }
  }

  const scaleX = scaleXCount > 0 ? scaleXSum / scaleXCount : 1;
  const scaleY = scaleYCount > 0 ? scaleYSum / scaleYCount : 1;

  let offsetXSum = 0, offsetYSum = 0;

  for (const m of matches) {
    offsetXSum += m.detected.x - (m.template.x * scaleX);
    offsetYSum += m.detected.y - (m.template.y * scaleY);
  }

  const offsetX = offsetXSum / matches.length;
  const offsetY = offsetYSum / matches.length;

  return { offsetX, offsetY, scaleX, scaleY };
}

export function isTransformReasonable(
  transform: AlignmentTransform,
  imageDims: { width: number; height: number }
): boolean {
  const maxOffsetX = imageDims.width * 0.2;
  const maxOffsetY = imageDims.height * 0.2;

  if (Math.abs(transform.offsetX) > maxOffsetX) return false;
  if (Math.abs(transform.offsetY) > maxOffsetY) return false;

  if (transform.scaleX < 0.7 || transform.scaleX > 1.3) return false;
  if (transform.scaleY < 0.7 || transform.scaleY > 1.3) return false;

  return true;
}

export function applyTransformToTemplate(
  template: SDDGTemplate,
  transform: AlignmentTransform
): SDDGTemplate {
  const aligned = JSON.parse(JSON.stringify(template)) as SDDGTemplate;

  function transformRegions(obj: any): void {
    for (const key in obj) {
      const value = obj[key];

      if (value && typeof value === 'object') {
        if ('x' in value && 'y' in value && 'w' in value && 'h' in value && 'fieldType' in value) {
          value.x = Math.round(value.x * transform.scaleX + transform.offsetX);
          value.y = Math.round(value.y * transform.scaleY + transform.offsetY);
          value.w = Math.round(value.w * transform.scaleX);
          value.h = Math.round(value.h * transform.scaleY);
        } else {
          transformRegions(value);
        }
      }
    }
  }

  transformRegions(aligned.regions);

  return aligned;
}

function getFieldCenter(
  template: SDDGTemplate,
  fieldPath: string
): { x: number; y: number } | null {
  const parts = fieldPath.split('.');
  let current: any = template.regions;

  for (const part of parts) {
    if (!current[part]) return null;
    current = current[part];
  }

  if (current && 'x' in current && 'y' in current && 'w' in current && 'h' in current) {
    return {
      x: current.x + current.w / 2,
      y: current.y + current.h / 2,
    };
  }

  return null;
}

/**
 * Main auto-alignment function with hybrid matching
 */
export async function autoAlignTemplate(
  cells: DetectedCell[],
  textBlocks: TextBlock[],
  template: SDDGTemplate,
  imageDims: { width: number; height: number }
): Promise<AutoAlignmentResult> {
  const startTime = Date.now();

  const matches: Array<{
    fieldPath: string;
    template: { x: number; y: number };
    detected: { x: number; y: number };
    method: 'anchor' | 'position';
  }> = [];

  let anchorMatches = 0;
  let positionMatches = 0;

  // 1. Try anchor label matching first
  for (const fieldPath of Object.keys(ALIGNMENT_ANCHORS)) {
    const matchedCell = matchCellToTemplateFieldByAnchor(fieldPath, cells, textBlocks);

    if (matchedCell) {
      const templateCenter = getFieldCenter(template, fieldPath);

      if (templateCenter) {
        matches.push({
          fieldPath,
          template: templateCenter,
          detected: {
            x: matchedCell.x + matchedCell.width / 2,
            y: matchedCell.y + matchedCell.height / 2,
          },
          method: 'anchor',
        });
        anchorMatches++;
      }
    }
  }

  // 2. Position-based fallback for all fields (supplements anchor matches)
  for (const [fieldPath, normalizedPos] of Object.entries(TEMPLATE_FIELD_POSITIONS)) {
    // Skip if already matched by anchor
    if (matches.some(m => m.fieldPath === fieldPath)) continue;

    const matchedCell = matchFieldByPosition(cells, normalizedPos, imageDims, 0.1);

    if (matchedCell) {
      const templateCenter = getFieldCenter(template, fieldPath);

      if (templateCenter) {
        matches.push({
          fieldPath,
          template: templateCenter,
          detected: {
            x: matchedCell.x + matchedCell.width / 2,
            y: matchedCell.y + matchedCell.height / 2,
          },
          method: 'position',
        });
        positionMatches++;
      }
    }
  }

  const totalFields = Object.keys(ALIGNMENT_ANCHORS).length;

  // Need at least 3 total matches for reliable alignment
  if (matches.length < 3) {
    return {
      success: false,
      transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
      matchedFields: matches.length,
      totalFields,
      confidence: matches.length / totalFields,
      alignmentMethod: anchorMatches >= positionMatches ? 'anchor' : 'position',
      anchorMatches,
      positionMatches,
      failureReason: `Insufficient matches: ${matches.length}/3 required`,
      processingTimeMs: Date.now() - startTime,
    };
  }

  const transform = computeTransform(
    matches.map(m => ({ template: m.template, detected: m.detected })),
    imageDims
  );

  if (!isTransformReasonable(transform, imageDims)) {
    return {
      success: false,
      transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
      matchedFields: matches.length,
      totalFields,
      confidence: 0,
      alignmentMethod: 'hybrid',
      anchorMatches,
      positionMatches,
      failureReason: 'Computed transform exceeds reasonable bounds',
      processingTimeMs: Date.now() - startTime,
    };
  }

  const matchRatio = matches.length / totalFields;
  const transformQuality = 1 - (Math.abs(transform.scaleX - 1) + Math.abs(transform.scaleY - 1)) / 0.6;
  const confidence = matchRatio * 0.7 + transformQuality * 0.3;

  // Determine alignment method
  let alignmentMethod: 'anchor' | 'position' | 'hybrid';
  if (anchorMatches >= 5 && positionMatches === 0) {
    alignmentMethod = 'anchor';
  } else if (anchorMatches === 0 && positionMatches >= 3) {
    alignmentMethod = 'position';
  } else {
    alignmentMethod = 'hybrid';
  }

  return {
    success: true,
    transform,
    matchedFields: matches.length,
    totalFields,
    confidence,
    alignmentMethod,
    anchorMatches,
    positionMatches,
    processingTimeMs: Date.now() - startTime,
  };
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
yarn test src/services/sddg/__tests__/templateAutoAlignment.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/services/sddg/templateAutoAlignment.ts src/services/sddg/__tests__/templateAutoAlignment.test.ts
git commit -m "feat(sddg): implement template auto-alignment with hybrid matching

Add anchor label matching (primary) and position-based fallback.
Fix scale calculation bug: track scaleXCount and scaleYCount separately.
Includes transform validation and confidence scoring."
```

---

## Task 7: Integrate Auto-Alignment into Template Extractor

**Files:**
- Modify: `src/services/sddg/templateExtractor.ts`

**Step 1: Add imports and helper function**

Add to top of `src/services/sddg/templateExtractor.ts`:

```typescript
import { detectCells } from './opencvCellDetection';
import { autoAlignTemplate, applyTransformToTemplate } from './templateAutoAlignment';
import TextRecognition from '@react-native-ml-kit/text-recognition';
```

Add helper function:

```typescript
export function shouldAttemptAutoAlignment(customTemplate?: SDDGTemplate): boolean {
  return !customTemplate;
}
```

**Step 2: Add auto-alignment logic after orientation correction**

Insert after the preprocessing block (around line 165), before template alignment:

```typescript
    // Auto-align template using OpenCV cell detection
    let autoAlignmentMetadata = {
      attempted: false,
      success: false,
      matchedFields: 0,
      confidence: 0,
      method: 'none' as string,
      anchorMatches: 0,
      positionMatches: 0,
      skewDetected: false,
    };

    if (shouldAttemptAutoAlignment(customTemplate)) {
      console.log('🔍 Attempting OpenCV auto-alignment...');

      try {
        const cellResult = await detectCells(preprocessedImageUri);
        autoAlignmentMetadata.attempted = true;
        autoAlignmentMetadata.skewDetected = cellResult.skewDetected || false;

        if (cellResult.skewDetected) {
          console.warn('⚠ Form appears skewed. Auto-alignment may be unreliable.');
        }

        if (cellResult.success && cellResult.cells.length >= 10) {
          console.log(`✓ Detected ${cellResult.cells.length} cells in ${cellResult.processingTimeMs}ms`);

          const mlKitResult = await TextRecognition.recognize(preprocessedImageUri);
          const textBlocks = mlKitResult.blocks.map((block: any) => ({
            text: block.text,
            boundingBox: block.frame,
            confidence: block.confidence || 0.9,
          }));

          const alignmentResult = await autoAlignTemplate(
            cellResult.cells,
            textBlocks,
            template,
            { width: imageDims.width, height: imageDims.height }
          );

          autoAlignmentMetadata.success = alignmentResult.success;
          autoAlignmentMetadata.matchedFields = alignmentResult.matchedFields;
          autoAlignmentMetadata.confidence = alignmentResult.confidence;
          autoAlignmentMetadata.method = alignmentResult.alignmentMethod;
          autoAlignmentMetadata.anchorMatches = alignmentResult.anchorMatches;
          autoAlignmentMetadata.positionMatches = alignmentResult.positionMatches;

          if (alignmentResult.success) {
            alignedTemplate = applyTransformToTemplate(template, alignmentResult.transform);
            console.log(`✓ Auto-alignment successful: ${alignmentResult.matchedFields} fields matched`);
            console.log(`  Method: ${alignmentResult.alignmentMethod}, Confidence: ${(alignmentResult.confidence * 100).toFixed(1)}%`);
          } else {
            console.warn(`⚠ Auto-alignment failed: ${alignmentResult.failureReason}`);
          }
        } else {
          console.warn(`⚠ Cell detection insufficient: ${cellResult.cells.length} cells (need ≥10)`);
          if (cellResult.error) {
            console.error(`  Error: ${cellResult.error}`);
          }
        }
      } catch (error) {
        console.error('✗ Auto-alignment error:', error);
      }
    }
```

**Step 3: Update metadata in return value**

Add to the metadata object in the return statement:

```typescript
      autoAlignmentAttempted: autoAlignmentMetadata.attempted,
      autoAlignmentSuccess: autoAlignmentMetadata.success,
      autoAlignmentMatchedFields: autoAlignmentMetadata.matchedFields,
      autoAlignmentConfidence: autoAlignmentMetadata.confidence,
      autoAlignmentMethod: autoAlignmentMetadata.method,
      autoAlignmentAnchorMatches: autoAlignmentMetadata.anchorMatches,
      autoAlignmentPositionMatches: autoAlignmentMetadata.positionMatches,
      autoAlignmentSkewDetected: autoAlignmentMetadata.skewDetected,
```

**Step 4: Commit**

```bash
git add src/services/sddg/templateExtractor.ts
git commit -m "feat(sddg): integrate OpenCV auto-alignment into template extractor

Add auto-alignment step after orientation correction. Uses hybrid matching
(anchors + position fallback). Includes skew detection warning.
Skipped when custom template is provided."
```

---

## Task 8: Update UI for Alignment Feedback

**Files:**
- Modify: `src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx`
- Modify: `src/screens/inspector/InteractiveSDDGComplianceScreen.tsx`

**Step 1: Update SDDGRegionAdjustmentScreen to accept pre-aligned template**

Update route params:

```typescript
const { imageUri, isScanned, preAlignedTemplate } = route.params as {
  imageUri: string;
  isScanned?: boolean;
  preAlignedTemplate?: SDDGTemplate;
};
```

Update `loadImageAndRegions`:

```typescript
const template = preAlignedTemplate || AMC_IMT_1033_TEMPLATE;

if (preAlignedTemplate) {
  console.log('✓ Using pre-aligned template from OpenCV detection');
}
```

**Step 2: Add warning banner to InteractiveSDDGComplianceScreen**

This requires understanding the current structure of InteractiveSDDGComplianceScreen. The banner should:
- Appear when `autoAlignmentConfidence < 0.7` or `autoAlignmentSkewDetected`
- Be dismissible
- Include "Adjust Regions" button that navigates to SDDGRegionAdjustmentScreen

**Step 3: Commit**

```bash
git add src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx src/screens/inspector/InteractiveSDDGComplianceScreen.tsx
git commit -m "feat(sddg): add UI feedback for auto-alignment status

SDDGRegionAdjustmentScreen accepts pre-aligned template.
InteractiveSDDGComplianceScreen shows warning banner when alignment
is uncertain, with action to adjust regions."
```

---

## Task 9: Run Full Test Suite and Verify

**Step 1: Run all SDDG-related tests**

Run:
```bash
yarn test src/services/sddg/
```

Expected: All tests pass

**Step 2: Run full test suite**

Run:
```bash
yarn test
```

Expected: All tests pass

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete OpenCV cell detection implementation

All tasks complete. Ready for manual testing with real SDDG forms."
```

---

## Summary

This implementation plan creates the OpenCV cell detection feature in 9 tasks:

1. **Install OpenCV** - Add dependency (pinned to 0.4.7) and verify setup
2. **Type definitions** - Interfaces with percentage-based thresholds
3. **Line utilities** - Classification, colinear merging, extension, intersection
4. **Cell builder** - Build cells with configurable clustering
5. **Cell detection service** - OpenCV integration with 10s timeout, skew detection
6. **Template auto-alignment** - Hybrid matching with fixed scale calculation
7. **Extractor integration** - Wire auto-alignment into extraction pipeline
8. **UI updates** - Warning banner on InteractiveSDDGComplianceScreen
9. **Verification** - Run full test suite

**Key Revisions from Code Review:**
- Percentage-based thresholds for scale-awareness
- Colinear segment merging and line extension for broken borders
- Position-based fallback always attempted (supplements anchors)
- Fixed scale calculation bug (separate X/Y counts)
- Correct UI screen target (InteractiveSDDGComplianceScreen)
- Extended timeout to 10 seconds
- Pinned library version
- Skew detection with user messaging
