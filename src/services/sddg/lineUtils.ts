/**
 * Line detection and manipulation utilities
 */

import { Line, Point } from "./opencvTypes";

/**
 * Calculate angle of a line in degrees (0-180)
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
  return angle >= 90 - toleranceDegrees;
}

/**
 * Get the average y-position for a horizontal line, or x-position for vertical
 */
function getLinePosition(line: Line, isHoriz: boolean): number {
  return isHoriz ? (line.y1 + line.y2) / 2 : (line.x1 + line.x2) / 2;
}

/**
 * Merge nearby parallel lines into single lines
 */
export function mergeNearbyLines(lines: Line[], maxDistance: number): Line[] {
  if (lines.length === 0) return [];

  const isHoriz = isHorizontal(lines[0], 10);
  const sorted = [...lines].sort(
    (a, b) => getLinePosition(a, isHoriz) - getLinePosition(b, isHoriz)
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

function mergeLineGroup(lines: Line[], isHoriz: boolean): Line {
  if (lines.length === 1) return lines[0];

  if (isHoriz) {
    const avgY =
      lines.reduce((sum, l) => sum + (l.y1 + l.y2) / 2, 0) / lines.length;
    const minX = Math.min(...lines.map(l => Math.min(l.x1, l.x2)));
    const maxX = Math.max(...lines.map(l => Math.max(l.x1, l.x2)));
    return { x1: minX, y1: avgY, x2: maxX, y2: avgY };
  }

  const avgX =
    lines.reduce((sum, l) => sum + (l.x1 + l.x2) / 2, 0) / lines.length;
  const minY = Math.min(...lines.map(l => Math.min(l.y1, l.y2)));
  const maxY = Math.max(...lines.map(l => Math.max(l.y1, l.y2)));
  return { x1: avgX, y1: minY, x2: avgX, y2: maxY };
}

/**
 * Merge colinear line segments that overlap or are within a small gap
 */
export function mergeColinearSegments(
  lines: Line[],
  maxGap: number,
  toleranceDegrees: number
): Line[] {
  if (lines.length === 0) return [];

  const isHoriz = isHorizontal(lines[0], toleranceDegrees);
  const grouped = mergeNearbyLines(lines, maxGap);

  return grouped.map(line => {
    if (isHoriz) {
      return {
        x1: Math.min(line.x1, line.x2),
        y1: line.y1,
        x2: Math.max(line.x1, line.x2),
        y2: line.y2,
      };
    }
    return {
      x1: line.x1,
      y1: Math.min(line.y1, line.y2),
      x2: line.x2,
      y2: Math.max(line.y1, line.y2),
    };
  });
}

/**
 * Extend a horizontal or vertical line by percentage of image size
 */
export function extendLine(
  line: Line,
  imageWidth: number,
  imageHeight: number,
  toleranceDegrees: number,
  extensionPercent: number
): Line {
  if (isHorizontal(line, toleranceDegrees)) {
    const y = (line.y1 + line.y2) / 2;
    const extension = imageWidth * extensionPercent;
    return {
      x1: Math.max(0, Math.min(line.x1, line.x2) - extension),
      y1: y,
      x2: Math.min(imageWidth, Math.max(line.x1, line.x2) + extension),
      y2: y,
    };
  }
  if (isVertical(line, toleranceDegrees)) {
    const x = (line.x1 + line.x2) / 2;
    const extension = imageHeight * extensionPercent;
    return {
      x1: x,
      y1: Math.max(0, Math.min(line.y1, line.y2) - extension),
      x2: x,
      y2: Math.min(imageHeight, Math.max(line.y1, line.y2) + extension),
    };
  }
  return line;
}

/**
 * Find intersection point of two line segments
 * Returns null if lines are parallel or don't intersect within segments
 */
export function findIntersection(line1: Line, line2: Line): Point | null {
  const x1 = line1.x1,
    y1 = line1.y1,
    x2 = line1.x2,
    y2 = line1.y2;
  const x3 = line2.x1,
    y3 = line2.y1,
    x4 = line2.x2,
    y4 = line2.y2;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 0.0001) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

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
  }

  return { horizontal, vertical };
}
