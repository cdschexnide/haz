# OpenCV Cell Detection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automate SDDG template region alignment using OpenCV line detection to eliminate manual region adjustment.

**Architecture:** OpenCV detects form cell boundaries via HoughLinesP, matches detected cells to template fields using anchor labels and position, computes a translation+scale transform, and applies it to auto-align the template before extraction.

**Tech Stack:** react-native-fast-opencv, TypeScript, Jest, existing ML Kit OCR

---

## Task 1: Install and Verify OpenCV Library

**Files:**
- Modify: `package.json`
- Create: `src/services/sddg/__tests__/opencvSetup.test.ts`

**Step 1: Install react-native-fast-opencv**

Run:
```bash
yarn add react-native-fast-opencv
```

Expected: Package added to package.json dependencies

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
git commit -m "chore: add react-native-fast-opencv dependency

Install OpenCV library for cell detection feature.
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
  error?: string;
}

/**
 * Configuration for cell detection
 */
export interface CellDetectionConfig {
  // Adaptive threshold parameters
  adaptiveBlockSize: number;  // Must be odd, default 11
  adaptiveC: number;          // Constant subtracted, default 2

  // HoughLinesP parameters
  houghThreshold: number;     // Min votes, default 50
  minLineLength: number;      // Min line length in pixels, default 100
  maxLineGap: number;         // Max gap to merge, default 10

  // Line classification
  angleToleranceDegrees: number;  // Degrees from horizontal/vertical, default 5

  // Line merging
  mergeDistancePixels: number;    // Max distance to merge parallel lines, default 15

  // Cell filtering
  minCellWidth: number;       // Min cell width, default 50
  minCellHeight: number;      // Min cell height, default 30

  // Timeout
  timeoutMs: number;          // Max processing time, default 5000
}

/**
 * Default configuration
 */
export const DEFAULT_CELL_DETECTION_CONFIG: CellDetectionConfig = {
  adaptiveBlockSize: 11,
  adaptiveC: 2,
  houghThreshold: 50,
  minLineLength: 100,
  maxLineGap: 10,
  angleToleranceDegrees: 5,
  mergeDistancePixels: 15,
  minCellWidth: 50,
  minCellHeight: 30,
  timeoutMs: 5000,
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
  failureReason?: string;
  processingTimeMs: number;
}
```

**Step 2: Commit**

```bash
git add src/services/sddg/opencvTypes.ts
git commit -m "feat(sddg): add type definitions for OpenCV cell detection

Define interfaces for Line, Point, DetectedCell, CellDetectionResult,
CellDetectionConfig, AlignmentTransform, and AutoAlignmentResult."
```

---

## Task 3: Implement Line Classification Utilities

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
  findIntersection,
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

  describe('mergeNearbyLines', () => {
    it('should merge two parallel horizontal lines close together', () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 500, y2: 100 },
        { x1: 50, y1: 105, x2: 450, y2: 105 },
      ];
      const merged = mergeNearbyLines(lines, 15);
      expect(merged.length).toBe(1);
      // Merged line should span full extent
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

    it('should return null if intersection is outside line segments', () => {
      const horizontal: Line = { x1: 0, y1: 100, x2: 100, y2: 100 };
      const vertical: Line = { x1: 200, y1: 0, x2: 200, y2: 300 };
      const intersection = findIntersection(horizontal, vertical);

      expect(intersection).toBeNull();
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
 */

import { Line, Point } from './opencvTypes';

/**
 * Calculate angle of a line in degrees (0-180)
 * 0 = horizontal, 90 = vertical
 */
export function getLineAngle(line: Line): number {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;

  // atan2 returns radians from -PI to PI
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
 * Calculate perpendicular distance from a point to a line
 */
function perpendicularDistance(point: Point, line: Line): number {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return 0;

  // Cross product gives signed area of parallelogram
  const crossProduct = Math.abs(
    (point.y - line.y1) * dx - (point.x - line.x1) * dy
  );

  return crossProduct / length;
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
 * Merge nearby parallel lines into single lines
 */
export function mergeNearbyLines(lines: Line[], maxDistance: number): Line[] {
  if (lines.length === 0) return [];

  // Determine if these are horizontal or vertical lines
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
      // Add to current group
      currentGroup.push(sorted[i]);
    } else {
      // Merge current group and start new one
      merged.push(mergeLineGroup(currentGroup, isHoriz));
      currentGroup = [sorted[i]];
    }
  }

  // Don't forget the last group
  merged.push(mergeLineGroup(currentGroup, isHoriz));

  return merged;
}

/**
 * Merge a group of nearby lines into a single line
 */
function mergeLineGroup(lines: Line[], isHoriz: boolean): Line {
  if (lines.length === 1) return lines[0];

  if (isHoriz) {
    // For horizontal lines: average y, extend x to full span
    const avgY = lines.reduce((sum, l) => sum + (l.y1 + l.y2) / 2, 0) / lines.length;
    const minX = Math.min(...lines.map(l => Math.min(l.x1, l.x2)));
    const maxX = Math.max(...lines.map(l => Math.max(l.x1, l.x2)));
    return { x1: minX, y1: avgY, x2: maxX, y2: avgY };
  } else {
    // For vertical lines: average x, extend y to full span
    const avgX = lines.reduce((sum, l) => sum + (l.x1 + l.x2) / 2, 0) / lines.length;
    const minY = Math.min(...lines.map(l => Math.min(l.y1, l.y2)));
    const maxY = Math.max(...lines.map(l => Math.max(l.y1, l.y2)));
    return { x1: avgX, y1: minY, x2: avgX, y2: maxY };
  }
}

/**
 * Find intersection point of two line segments
 * Returns null if lines are parallel or don't intersect within segments
 */
export function findIntersection(line1: Line, line2: Line): Point | null {
  const x1 = line1.x1, y1 = line1.y1, x2 = line1.x2, y2 = line1.y2;
  const x3 = line2.x1, y3 = line2.y1, x4 = line2.x2, y4 = line2.y2;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // Lines are parallel
  if (Math.abs(denom) < 0.0001) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  // Check if intersection is within both line segments
  // Use small tolerance for floating point
  const tolerance = 0.1;
  if (t < -tolerance || t > 1 + tolerance || u < -tolerance || u > 1 + tolerance) {
    return null;
  }

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
): { horizontal: Line[]; vertical: Line[] } {
  const horizontal: Line[] = [];
  const vertical: Line[] = [];

  for (const line of lines) {
    if (isHorizontal(line, toleranceDegrees)) {
      horizontal.push(line);
    } else if (isVertical(line, toleranceDegrees)) {
      vertical.push(line);
    }
    // Diagonal lines are ignored
  }

  return { horizontal, vertical };
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
line merging, and intersection finding. Full test coverage."
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

      const grid = buildGrid(intersections);

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

      const grid = buildGrid(intersections);

      expect(grid.rows).toBe(3);
      expect(grid.cols).toBe(3);
    });
  });

  describe('buildCellsFromLines', () => {
    it('should build cells from a simple 2x2 grid', () => {
      // Two horizontal lines
      const horizontal: Line[] = [
        { x1: 0, y1: 0, x2: 200, y2: 0 },
        { x1: 0, y1: 100, x2: 200, y2: 100 },
        { x1: 0, y1: 200, x2: 200, y2: 200 },
      ];
      // Two vertical lines
      const vertical: Line[] = [
        { x1: 0, y1: 0, x2: 0, y2: 200 },
        { x1: 100, y1: 0, x2: 100, y2: 200 },
        { x1: 200, y1: 0, x2: 200, y2: 200 },
      ];

      const cells = buildCellsFromLines(horizontal, vertical);

      // Should produce 4 cells (2x2)
      expect(cells.length).toBe(4);

      // Check first cell
      const topLeft = cells.find(c => c.x === 0 && c.y === 0);
      expect(topLeft).toBeDefined();
      expect(topLeft!.width).toBe(100);
      expect(topLeft!.height).toBe(100);
    });

    it('should handle no intersections gracefully', () => {
      const horizontal: Line[] = [{ x1: 0, y1: 0, x2: 100, y2: 0 }];
      const vertical: Line[] = [{ x1: 200, y1: 0, x2: 200, y2: 100 }]; // No intersection

      const cells = buildCellsFromLines(horizontal, vertical);
      expect(cells.length).toBe(0);
    });
  });

  describe('filterCells', () => {
    it('should filter out cells smaller than minimum size', () => {
      const cells: DetectedCell[] = [
        { x: 0, y: 0, width: 100, height: 50 },   // Valid
        { x: 100, y: 0, width: 30, height: 50 },  // Too narrow
        { x: 0, y: 50, width: 100, height: 20 },  // Too short
        { x: 100, y: 50, width: 30, height: 20 }, // Both too small
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
  points: Point[][];  // [row][col]
}

/**
 * Build a sorted grid from intersection points
 */
export function buildGrid(intersections: Point[]): Grid {
  if (intersections.length === 0) {
    return { rows: 0, cols: 0, points: [] };
  }

  // Get unique x and y values, sorted
  const xValues = [...new Set(intersections.map(p => Math.round(p.x)))].sort((a, b) => a - b);
  const yValues = [...new Set(intersections.map(p => Math.round(p.y)))].sort((a, b) => a - b);

  // Cluster nearby values (within 10px)
  const clusterThreshold = 10;
  const clusteredX = clusterValues(xValues, clusterThreshold);
  const clusteredY = clusterValues(yValues, clusterThreshold);

  // Build grid matrix
  const points: Point[][] = [];
  for (let row = 0; row < clusteredY.length; row++) {
    points[row] = [];
    for (let col = 0; col < clusteredX.length; col++) {
      // Find the actual intersection closest to this grid position
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
 * Cluster nearby values together
 */
function clusterValues(values: number[], threshold: number): number[] {
  if (values.length === 0) return [];

  const clustered: number[] = [values[0]];

  for (let i = 1; i < values.length; i++) {
    const lastCluster = clustered[clustered.length - 1];
    if (values[i] - lastCluster > threshold) {
      clustered.push(values[i]);
    } else {
      // Update cluster center to average
      clustered[clustered.length - 1] = (lastCluster + values[i]) / 2;
    }
  }

  return clustered;
}

/**
 * Build cells from horizontal and vertical lines
 */
export function buildCellsFromLines(
  horizontalLines: Line[],
  verticalLines: Line[]
): DetectedCell[] {
  // Find all intersections
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
    // Need at least 4 points to form a cell
    return [];
  }

  // Build grid from intersections
  const grid = buildGrid(intersections);

  if (grid.rows < 2 || grid.cols < 2) {
    return [];
  }

  // Build cells from adjacent grid points
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

Add grid building from intersection points and cell extraction.
Includes clustering for handling imprecise intersections."
```

---

## Task 5: Implement OpenCV Cell Detection Service

**Files:**
- Create: `src/services/sddg/opencvCellDetection.ts`
- Create: `src/services/sddg/__tests__/opencvCellDetection.test.ts`

**Step 1: Write failing tests**

Create file `src/services/sddg/__tests__/opencvCellDetection.test.ts`:

```typescript
import { detectCells, parseHoughLines } from '../opencvCellDetection';
import { CellDetectionConfig, DEFAULT_CELL_DETECTION_CONFIG, Line } from '../opencvTypes';

// Mock react-native-fast-opencv
jest.mock('react-native-fast-opencv', () => ({
  OpenCV: {
    invoke: jest.fn(),
    toJSValue: jest.fn(),
  },
  ObjectType: {
    Mat: 'Mat',
    MatVector: 'MatVector',
  },
  ColorConversionCodes: {
    COLOR_RGBA2GRAY: 11,
  },
  ThresholdTypes: {
    THRESH_BINARY_INV: 1,
  },
  AdaptiveThresholdTypes: {
    ADAPTIVE_THRESH_GAUSSIAN_C: 1,
  },
}));

describe('opencvCellDetection', () => {
  describe('parseHoughLines', () => {
    it('should parse HoughLinesP output array to Line objects', () => {
      // HoughLinesP returns flat array: [x1, y1, x2, y2, x1, y1, x2, y2, ...]
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

    it('should handle incomplete line data', () => {
      // Only 3 values - not enough for a line
      const rawLines = [0, 100, 500];
      const lines = parseHoughLines(rawLines);
      expect(lines.length).toBe(0);
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

    it('should use default config when not provided', async () => {
      const { OpenCV } = require('react-native-fast-opencv');

      // Mock successful but empty result
      OpenCV.invoke.mockResolvedValue({ cols: 100, rows: 100 });
      OpenCV.toJSValue.mockReturnValue([]);

      await detectCells('test-image.png');

      // Verify it doesn't throw
      expect(OpenCV.invoke).toHaveBeenCalled();
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
yarn test src/services/sddg/__tests__/opencvCellDetection.test.ts
```

Expected: Tests fail with "Cannot find module '../opencvCellDetection'"

**Step 3: Implement OpenCV cell detection**

Create file `src/services/sddg/opencvCellDetection.ts`:

```typescript
/**
 * OpenCV-based cell detection for SDDG forms
 *
 * Uses HoughLinesP to detect lines, then builds cells from line intersections.
 */

import {
  Line,
  DetectedCell,
  CellDetectionResult,
  CellDetectionConfig,
  DEFAULT_CELL_DETECTION_CONFIG,
} from './opencvTypes';
import { classifyLines, mergeNearbyLines } from './lineUtils';
import { buildCellsFromLines, filterCells } from './cellBuilder';

// Conditionally import OpenCV (may not be available in test environment)
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
  // OpenCV not available (e.g., in Jest tests without native modules)
  console.warn('react-native-fast-opencv not available');
}

/**
 * Parse HoughLinesP output to Line objects
 * HoughLinesP returns a flat array: [x1, y1, x2, y2, x1, y1, x2, y2, ...]
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

    // Set up timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Cell detection timeout')), config.timeoutMs);
    });

    // Run detection with timeout
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

/**
 * Internal cell detection implementation
 */
async function detectCellsInternal(
  imageUri: string,
  config: CellDetectionConfig
): Promise<Omit<CellDetectionResult, 'processingTimeMs'>> {
  // 1. Load image
  const src = await OpenCV.invoke('imread', { p1: imageUri });
  const imageWidth = src.cols;
  const imageHeight = src.rows;

  // 2. Convert to grayscale
  const gray = await OpenCV.invoke('cvtColor', {
    p1: src,
    p2: ColorConversionCodes.COLOR_RGBA2GRAY,
  });

  // 3. Apply adaptive threshold
  const binary = await OpenCV.invoke('adaptiveThreshold', {
    p1: gray,
    p2: 255,
    p3: AdaptiveThresholdTypes.ADAPTIVE_THRESH_GAUSSIAN_C,
    p4: ThresholdTypes.THRESH_BINARY_INV,
    p5: config.adaptiveBlockSize,
    p6: config.adaptiveC,
  });

  // 4. Detect lines using HoughLinesP
  const linesResult = await OpenCV.invoke('HoughLinesP', {
    p1: binary,
    p2: 1,                          // rho
    p3: Math.PI / 180,              // theta
    p4: config.houghThreshold,      // threshold
    p5: config.minLineLength,       // minLineLength
    p6: config.maxLineGap,          // maxLineGap
  });

  // 5. Parse and classify lines
  const rawLines = await OpenCV.toJSValue(linesResult);
  const allLines = parseHoughLines(rawLines);

  const { horizontal, vertical } = classifyLines(allLines, config.angleToleranceDegrees);

  // 6. Merge nearby parallel lines
  const mergedHorizontal = mergeNearbyLines(horizontal, config.mergeDistancePixels);
  const mergedVertical = mergeNearbyLines(vertical, config.mergeDistancePixels);

  // 7. Build cells from line intersections
  const allCells = buildCellsFromLines(mergedHorizontal, mergedVertical);

  // 8. Filter by minimum size
  const cells = filterCells(allCells, config.minCellWidth, config.minCellHeight);

  // Clean up OpenCV objects
  await OpenCV.invoke('release', { p1: src });
  await OpenCV.invoke('release', { p1: gray });
  await OpenCV.invoke('release', { p1: binary });

  return {
    success: cells.length >= 10,  // Need at least 10 cells for a valid form
    cells,
    horizontalLines: mergedHorizontal,
    verticalLines: mergedVertical,
    imageWidth,
    imageHeight,
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

Add detectCells function using HoughLinesP for line detection.
Includes timeout handling and graceful error recovery."
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
  matchCellToTemplateField,
  findCellContainingPoint,
  isTransformReasonable,
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

    it('should handle point on cell boundary', () => {
      const cell = findCellContainingPoint(cells, 100, 50);
      expect(cell).not.toBeNull();
    });
  });

  describe('computeTransform', () => {
    it('should compute identity transform for matching regions', () => {
      const matches: Array<{ template: { x: number; y: number }; detected: { x: number; y: number } }> = [
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

    it('should compute offset for shifted regions', () => {
      const matches: Array<{ template: { x: number; y: number }; detected: { x: number; y: number } }> = [
        { template: { x: 100, y: 100 }, detected: { x: 150, y: 120 } },
        { template: { x: 200, y: 200 }, detected: { x: 250, y: 220 } },
      ];
      const imageDims = { width: 1000, height: 1000 };

      const transform = computeTransform(matches, imageDims);

      expect(transform.offsetX).toBeCloseTo(50, 1);
      expect(transform.offsetY).toBeCloseTo(20, 1);
    });

    it('should compute scale for scaled regions', () => {
      const matches: Array<{ template: { x: number; y: number }; detected: { x: number; y: number } }> = [
        { template: { x: 100, y: 100 }, detected: { x: 110, y: 110 } },  // 10% larger
        { template: { x: 200, y: 200 }, detected: { x: 220, y: 220 } },
      ];
      const imageDims = { width: 1000, height: 1000 };

      const transform = computeTransform(matches, imageDims);

      expect(transform.scaleX).toBeCloseTo(1.1, 1);
      expect(transform.scaleY).toBeCloseTo(1.1, 1);
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

    it('should reject large offset', () => {
      const transform: AlignmentTransform = { offsetX: 1000, offsetY: 0, scaleX: 1, scaleY: 1 };
      expect(isTransformReasonable(transform, imageDims)).toBe(false);
    });

    it('should accept reasonable scale', () => {
      const transform: AlignmentTransform = { offsetX: 0, offsetY: 0, scaleX: 1.1, scaleY: 0.95 };
      expect(isTransformReasonable(transform, imageDims)).toBe(true);
    });

    it('should reject extreme scale', () => {
      const transform: AlignmentTransform = { offsetX: 0, offsetY: 0, scaleX: 2.0, scaleY: 1 };
      expect(isTransformReasonable(transform, imageDims)).toBe(false);
    });
  });

  describe('applyTransformToTemplate', () => {
    it('should apply offset to all regions', () => {
      const template: SDDGTemplate = {
        formType: 'TEST',
        formName: 'Test Form',
        identifiers: [],
        regions: {
          shipper: { x: 100, y: 200, w: 300, h: 100, fieldType: 'text' },
        },
      };
      const transform: AlignmentTransform = { offsetX: 50, offsetY: 25, scaleX: 1, scaleY: 1 };

      const aligned = applyTransformToTemplate(template, transform);

      expect(aligned.regions.shipper!.x).toBe(150);
      expect(aligned.regions.shipper!.y).toBe(225);
      expect(aligned.regions.shipper!.w).toBe(300);  // Width unchanged with scale=1
    });

    it('should apply scale to all regions', () => {
      const template: SDDGTemplate = {
        formType: 'TEST',
        formName: 'Test Form',
        identifiers: [],
        regions: {
          shipper: { x: 100, y: 200, w: 300, h: 100, fieldType: 'text' },
        },
      };
      const transform: AlignmentTransform = { offsetX: 0, offsetY: 0, scaleX: 1.1, scaleY: 1.1 };

      const aligned = applyTransformToTemplate(template, transform);

      expect(aligned.regions.shipper!.x).toBe(110);
      expect(aligned.regions.shipper!.y).toBe(220);
      expect(aligned.regions.shipper!.w).toBe(330);
      expect(aligned.regions.shipper!.h).toBe(110);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run:
```bash
yarn test src/services/sddg/__tests__/templateAutoAlignment.test.ts
```

Expected: Tests fail with "Cannot find module '../templateAutoAlignment'"

**Step 3: Implement template auto-alignment**

Create file `src/services/sddg/templateAutoAlignment.ts`:

```typescript
/**
 * Template auto-alignment using detected cells
 *
 * Matches detected cells to template fields using anchor labels and position,
 * then computes a translation+scale transform to align the template.
 */

import { SDDGTemplate, FieldRegion } from '@/types/sddg-template';
import { TextBlock } from './anchorTypes';
import { DetectedCell, AlignmentTransform, AutoAlignmentResult } from './opencvTypes';

/**
 * Anchor labels used for matching cells to template fields
 */
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

/**
 * Find the cell containing a given point
 */
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
 * Match a template field to a detected cell using anchor labels
 */
export function matchCellToTemplateField(
  fieldPath: string,
  cells: DetectedCell[],
  textBlocks: TextBlock[]
): DetectedCell | null {
  const anchorLabels = ALIGNMENT_ANCHORS[fieldPath];
  if (!anchorLabels) return null;

  // Find text block matching any anchor label
  for (const block of textBlocks) {
    const normalizedText = block.text.toUpperCase().replace(/\s+/g, ' ').trim();

    for (const label of anchorLabels) {
      if (normalizedText.includes(label.toUpperCase())) {
        // Find cell containing this text block
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
 */
export function computeTransform(
  matches: Array<{ template: { x: number; y: number }; detected: { x: number; y: number } }>,
  imageDims: { width: number; height: number }
): AlignmentTransform {
  if (matches.length === 0) {
    return { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
  }

  if (matches.length === 1) {
    // Single match: only compute offset, no scale
    const m = matches[0];
    return {
      offsetX: m.detected.x - m.template.x,
      offsetY: m.detected.y - m.template.y,
      scaleX: 1,
      scaleY: 1,
    };
  }

  // Multiple matches: compute both offset and scale
  // Use least squares approach

  // First, estimate scale from distance ratios
  let scaleXSum = 0, scaleYSum = 0, scaleCount = 0;

  for (let i = 0; i < matches.length; i++) {
    for (let j = i + 1; j < matches.length; j++) {
      const templateDx = Math.abs(matches[j].template.x - matches[i].template.x);
      const templateDy = Math.abs(matches[j].template.y - matches[i].template.y);
      const detectedDx = Math.abs(matches[j].detected.x - matches[i].detected.x);
      const detectedDy = Math.abs(matches[j].detected.y - matches[i].detected.y);

      if (templateDx > 50) {
        scaleXSum += detectedDx / templateDx;
        scaleCount++;
      }
      if (templateDy > 50) {
        scaleYSum += detectedDy / templateDy;
        scaleCount++;
      }
    }
  }

  const scaleX = scaleCount > 0 ? scaleXSum / (scaleCount / 2) : 1;
  const scaleY = scaleCount > 0 ? scaleYSum / (scaleCount / 2) : 1;

  // Then compute offset after accounting for scale
  let offsetXSum = 0, offsetYSum = 0;

  for (const m of matches) {
    offsetXSum += m.detected.x - (m.template.x * scaleX);
    offsetYSum += m.detected.y - (m.template.y * scaleY);
  }

  const offsetX = offsetXSum / matches.length;
  const offsetY = offsetYSum / matches.length;

  return { offsetX, offsetY, scaleX, scaleY };
}

/**
 * Check if a computed transform is reasonable
 */
export function isTransformReasonable(
  transform: AlignmentTransform,
  imageDims: { width: number; height: number }
): boolean {
  // Offset shouldn't exceed 20% of image dimension
  const maxOffsetX = imageDims.width * 0.2;
  const maxOffsetY = imageDims.height * 0.2;

  if (Math.abs(transform.offsetX) > maxOffsetX) return false;
  if (Math.abs(transform.offsetY) > maxOffsetY) return false;

  // Scale should be between 0.7 and 1.3
  if (transform.scaleX < 0.7 || transform.scaleX > 1.3) return false;
  if (transform.scaleY < 0.7 || transform.scaleY > 1.3) return false;

  return true;
}

/**
 * Apply transform to all regions in a template
 */
export function applyTransformToTemplate(
  template: SDDGTemplate,
  transform: AlignmentTransform
): SDDGTemplate {
  // Deep clone the template
  const aligned = JSON.parse(JSON.stringify(template)) as SDDGTemplate;

  // Recursively transform all regions
  function transformRegions(obj: any): void {
    for (const key in obj) {
      const value = obj[key];

      if (value && typeof value === 'object') {
        // Check if it's a FieldRegion (has x, y, w, h, fieldType)
        if ('x' in value && 'y' in value && 'w' in value && 'h' in value && 'fieldType' in value) {
          // Apply transform
          value.x = Math.round(value.x * transform.scaleX + transform.offsetX);
          value.y = Math.round(value.y * transform.scaleY + transform.offsetY);
          value.w = Math.round(value.w * transform.scaleX);
          value.h = Math.round(value.h * transform.scaleY);
        } else {
          // Recurse into nested objects
          transformRegions(value);
        }
      }
    }
  }

  transformRegions(aligned.regions);

  return aligned;
}

/**
 * Get the center point of a template field region
 */
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
 * Main auto-alignment function
 */
export async function autoAlignTemplate(
  cells: DetectedCell[],
  textBlocks: TextBlock[],
  template: SDDGTemplate,
  imageDims: { width: number; height: number }
): Promise<AutoAlignmentResult> {
  const startTime = Date.now();

  // Collect matched point pairs
  const matches: Array<{
    fieldPath: string;
    template: { x: number; y: number };
    detected: { x: number; y: number };
  }> = [];

  // Try to match each anchor field to a detected cell
  for (const fieldPath of Object.keys(ALIGNMENT_ANCHORS)) {
    const matchedCell = matchCellToTemplateField(fieldPath, cells, textBlocks);

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
        });
      }
    }
  }

  // Need at least 3 matches for reliable alignment
  if (matches.length < 3) {
    return {
      success: false,
      transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
      matchedFields: matches.length,
      totalFields: Object.keys(ALIGNMENT_ANCHORS).length,
      confidence: matches.length / Object.keys(ALIGNMENT_ANCHORS).length,
      alignmentMethod: 'anchor',
      failureReason: `Insufficient anchor matches: ${matches.length}/3 required`,
      processingTimeMs: Date.now() - startTime,
    };
  }

  // Compute transform
  const transform = computeTransform(
    matches.map(m => ({ template: m.template, detected: m.detected })),
    imageDims
  );

  // Validate transform
  if (!isTransformReasonable(transform, imageDims)) {
    return {
      success: false,
      transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
      matchedFields: matches.length,
      totalFields: Object.keys(ALIGNMENT_ANCHORS).length,
      confidence: 0,
      alignmentMethod: 'anchor',
      failureReason: 'Computed transform exceeds reasonable bounds',
      processingTimeMs: Date.now() - startTime,
    };
  }

  // Compute confidence based on number of matches and transform quality
  const matchRatio = matches.length / Object.keys(ALIGNMENT_ANCHORS).length;
  const transformQuality = 1 - (
    Math.abs(transform.scaleX - 1) +
    Math.abs(transform.scaleY - 1)
  ) / 0.6;  // Max deviation is 0.3 each way
  const confidence = (matchRatio * 0.7 + transformQuality * 0.3);

  return {
    success: true,
    transform,
    matchedFields: matches.length,
    totalFields: Object.keys(ALIGNMENT_ANCHORS).length,
    confidence,
    alignmentMethod: matches.length >= 5 ? 'anchor' : 'hybrid',
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
git commit -m "feat(sddg): implement template auto-alignment

Add functions to match detected cells to template fields using anchor
labels, compute translation+scale transform, and apply to template.
Includes validation for reasonable transform bounds."
```

---

## Task 7: Integrate Auto-Alignment into Template Extractor

**Files:**
- Modify: `src/services/sddg/templateExtractor.ts`
- Create: `src/services/sddg/__tests__/templateExtractor.autoAlignment.test.ts`

**Step 1: Write integration test**

Create file `src/services/sddg/__tests__/templateExtractor.autoAlignment.test.ts`:

```typescript
/**
 * Integration tests for auto-alignment in template extractor
 */

// Mock dependencies
jest.mock('react-native-fast-opencv', () => ({
  OpenCV: { invoke: jest.fn(), toJSValue: jest.fn() },
  ObjectType: { Mat: 'Mat' },
  ColorConversionCodes: { COLOR_RGBA2GRAY: 11 },
  ThresholdTypes: { THRESH_BINARY_INV: 1 },
  AdaptiveThresholdTypes: { ADAPTIVE_THRESH_GAUSSIAN_C: 1 },
}));

jest.mock('@react-native-ml-kit/text-recognition', () => ({
  recognize: jest.fn(),
}));

jest.mock('../paddleOCREngine', () => ({
  extractText: jest.fn().mockResolvedValue({ text: '', confidence: 0.9 }),
}));

jest.mock('@/utils/sddg/imageUtils', () => ({
  correctImageOrientation: jest.fn().mockResolvedValue({
    imageUri: 'corrected.png',
    width: 2550,
    height: 3300,
    rotated: false,
    rotationDegrees: 0,
  }),
  scaleRegion: jest.fn((region) => region),
  cropRegion: jest.fn().mockResolvedValue('cropped.png'),
}));

jest.mock('@/utils/sddg/imagePreprocessing', () => ({
  preprocessFullImage: jest.fn().mockResolvedValue({
    uri: 'preprocessed.png',
    metrics: { processingTime: 100 },
    appliedOperations: [],
  }),
  preprocessRegion: jest.fn().mockResolvedValue({
    uri: 'region.png',
    appliedOperations: [],
  }),
}));

import { detectCells } from '../opencvCellDetection';
import { autoAlignTemplate } from '../templateAutoAlignment';

jest.mock('../opencvCellDetection');
jest.mock('../templateAutoAlignment');

describe('templateExtractor auto-alignment integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call detectCells when no custom template provided', async () => {
    (detectCells as jest.Mock).mockResolvedValue({
      success: true,
      cells: Array(15).fill({ x: 0, y: 0, width: 100, height: 50 }),
      horizontalLines: [],
      verticalLines: [],
      imageWidth: 2550,
      imageHeight: 3300,
      processingTimeMs: 500,
    });

    (autoAlignTemplate as jest.Mock).mockResolvedValue({
      success: true,
      transform: { offsetX: 10, offsetY: 5, scaleX: 1.02, scaleY: 1.01 },
      matchedFields: 6,
      totalFields: 10,
      confidence: 0.85,
      alignmentMethod: 'anchor',
      processingTimeMs: 200,
    });

    // Import after mocks are set up
    const { shouldAttemptAutoAlignment } = await import('../templateExtractor');

    // Test the decision function
    expect(shouldAttemptAutoAlignment(undefined)).toBe(true);
    expect(shouldAttemptAutoAlignment({} as any)).toBe(false);  // Custom template skips
  });

  it('should skip auto-alignment when custom template is provided', async () => {
    const { shouldAttemptAutoAlignment } = await import('../templateExtractor');

    const customTemplate = { formType: 'AMC_IMT_1033', regions: {} };
    expect(shouldAttemptAutoAlignment(customTemplate as any)).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
yarn test src/services/sddg/__tests__/templateExtractor.autoAlignment.test.ts
```

Expected: Test fails (shouldAttemptAutoAlignment doesn't exist yet)

**Step 3: Modify templateExtractor.ts to add auto-alignment**

Add imports at the top of `src/services/sddg/templateExtractor.ts`:

```typescript
// Add after existing imports
import { detectCells } from './opencvCellDetection';
import { autoAlignTemplate, applyTransformToTemplate } from './templateAutoAlignment';
import { convertToMLKitFormat } from './anchorBasedExtractor';
```

Add helper function after imports:

```typescript
/**
 * Determine if auto-alignment should be attempted
 */
export function shouldAttemptAutoAlignment(customTemplate?: SDDGTemplate): boolean {
  // Skip auto-alignment if user provided a custom (manually adjusted) template
  return !customTemplate;
}
```

Modify the `extractFormData` function to add auto-alignment after orientation correction (around line 165, after the preprocessing block):

```typescript
    // 4a. NEW: Auto-align template using OpenCV cell detection
    // Skip if using custom template (user has already positioned regions)
    let autoAlignmentMetadata: {
      attempted: boolean;
      success: boolean;
      matchedFields: number;
      confidence: number;
      method: string;
    } = {
      attempted: false,
      success: false,
      matchedFields: 0,
      confidence: 0,
      method: 'none',
    };

    if (shouldAttemptAutoAlignment(customTemplate)) {
      console.log('🔍 Attempting OpenCV auto-alignment...');

      try {
        // Detect cells using OpenCV
        const cellResult = await detectCells(preprocessedImageUri);

        if (cellResult.success && cellResult.cells.length >= 10) {
          console.log(`✓ Detected ${cellResult.cells.length} cells in ${cellResult.processingTimeMs}ms`);

          // Get text blocks for anchor matching
          const TextRecognition = require('@react-native-ml-kit/text-recognition').default;
          const mlKitResult = await TextRecognition.recognize(preprocessedImageUri);
          const textBlocks = convertToMLKitFormat(mlKitResult);

          // Compute alignment
          const alignmentResult = await autoAlignTemplate(
            cellResult.cells,
            textBlocks,
            template,
            { width: imageDims.width, height: imageDims.height }
          );

          autoAlignmentMetadata = {
            attempted: true,
            success: alignmentResult.success,
            matchedFields: alignmentResult.matchedFields,
            confidence: alignmentResult.confidence,
            method: alignmentResult.alignmentMethod,
          };

          if (alignmentResult.success) {
            alignedTemplate = applyTransformToTemplate(template, alignmentResult.transform);
            console.log(`✓ Auto-alignment successful: ${alignmentResult.matchedFields} anchors matched, ` +
              `confidence=${(alignmentResult.confidence * 100).toFixed(1)}%`);
            console.log(`  Transform: offset=(${alignmentResult.transform.offsetX.toFixed(0)}, ${alignmentResult.transform.offsetY.toFixed(0)}), ` +
              `scale=(${alignmentResult.transform.scaleX.toFixed(3)}, ${alignmentResult.transform.scaleY.toFixed(3)})`);
          } else {
            console.warn(`⚠ Auto-alignment failed: ${alignmentResult.failureReason}`);
            console.log('  Proceeding with default template');
          }
        } else {
          console.warn(`⚠ Cell detection insufficient: ${cellResult.cells.length} cells (need ≥10)`);
          autoAlignmentMetadata.attempted = true;
        }
      } catch (error) {
        console.error('✗ Auto-alignment error:', error);
        autoAlignmentMetadata.attempted = true;
        // Continue with unaligned template
      }
    }
```

Update the metadata in the return value to include auto-alignment info:

```typescript
    // In the return statement, add to metadata:
    metadata: {
      // ... existing fields ...
      autoAlignmentAttempted: autoAlignmentMetadata.attempted,
      autoAlignmentSuccess: autoAlignmentMetadata.success,
      autoAlignmentMatchedFields: autoAlignmentMetadata.matchedFields,
      autoAlignmentConfidence: autoAlignmentMetadata.confidence,
      autoAlignmentMethod: autoAlignmentMetadata.method,
    },
```

**Step 4: Run tests to verify they pass**

Run:
```bash
yarn test src/services/sddg/__tests__/templateExtractor.autoAlignment.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/services/sddg/templateExtractor.ts src/services/sddg/__tests__/templateExtractor.autoAlignment.test.ts
git commit -m "feat(sddg): integrate OpenCV auto-alignment into template extractor

Add auto-alignment step after orientation correction. Detects cells
using OpenCV, matches to template fields, computes transform, and
applies to template. Skipped when custom template is provided.
Includes alignment metadata in extraction result."
```

---

## Task 8: Update UI for Alignment Feedback

**Files:**
- Modify: `src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx`

**Step 1: Update RegionAdjustmentScreen to accept pre-aligned template**

Modify route params type in `SDDGRegionAdjustmentScreen.tsx`:

```typescript
// Update the route params destructuring (around line 55)
const { imageUri, isScanned, preAlignedTemplate } = route.params as {
  imageUri: string;
  isScanned?: boolean;
  preAlignedTemplate?: SDDGTemplate;
};
```

Update `loadImageAndRegions` to use pre-aligned template:

```typescript
const loadImageAndRegions = async () => {
  try {
    setLoading(true);

    // Apply the same orientation correction as template extractor
    const orientationResult = await correctImageOrientation(
      imageUri,
      2550,
      3300
    );

    setCorrectedImageUri(orientationResult.imageUri);
    const dims = {
      width: orientationResult.width,
      height: orientationResult.height,
    };
    setImageDims(dims);

    // Calculate display scale
    const screenWidth = Dimensions.get("window").width;
    const scale = screenWidth / dims.width;
    setDisplayScale(scale);

    // Use pre-aligned template if provided, otherwise use default
    const template = preAlignedTemplate || AMC_IMT_1033_TEMPLATE;

    if (preAlignedTemplate) {
      console.log('✓ Using pre-aligned template from OpenCV detection');
    }

    const extractedRegions = extractAllRegions(template);

    // Convert to display coordinates
    const regionsWithDisplay = extractedRegions.map(r => ({
      ...r,
      displayRegion: templateToDisplay(
        r.templateRegion,
        dims.width,
        dims.height
      ),
    }));

    setRegions(regionsWithDisplay);
    setLoading(false);
  } catch (error) {
    console.error("Error loading image and regions:", error);
    setLoading(false);
  }
};
```

**Step 2: Test manually**

This is a UI change that requires manual testing on device/simulator.

**Step 3: Commit**

```bash
git add src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx
git commit -m "feat(sddg): accept pre-aligned template in region adjustment screen

Region adjustment screen now uses pre-aligned template (from OpenCV)
as the starting point instead of default template. Users refine from
a closer starting position."
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

Expected: All tests pass (or only unrelated tests fail)

**Step 3: Final commit for documentation**

```bash
git add -A
git commit -m "docs: update implementation with final adjustments

Complete OpenCV cell detection feature implementation."
```

---

## Summary

This implementation plan creates the OpenCV cell detection feature in 9 tasks:

1. **Install OpenCV** - Add dependency and verify setup
2. **Type definitions** - Create interfaces for cells, lines, transforms
3. **Line utilities** - Classification, merging, intersection finding
4. **Cell builder** - Build cells from line intersections
5. **Cell detection service** - OpenCV integration with HoughLinesP
6. **Template auto-alignment** - Match cells to fields, compute transform
7. **Extractor integration** - Wire auto-alignment into extraction pipeline
8. **UI updates** - Accept pre-aligned template in adjustment screen
9. **Verification** - Run full test suite

Each task follows TDD with specific test files, implementation, and commits.

---

Plan complete and saved to `docs/plans/2026-01-28-opencv-cell-detection-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?