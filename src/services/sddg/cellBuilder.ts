/**
 * Build cells from detected lines
 */

import { Line, Point, DetectedCell } from "./opencvTypes";
import { findIntersection } from "./lineUtils";

export interface Grid {
  rows: number;
  cols: number;
  points: Point[][];
}

function clusterValues(values: number[], threshold: number): number[] {
  if (values.length === 0) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const clustered: number[] = [sorted[0]];
  let clusterSum = sorted[0];
  let clusterCount = 1;

  for (let i = 1; i < sorted.length; i++) {
    const currentMean = clusterSum / clusterCount;
    if (sorted[i] - currentMean <= threshold) {
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

export function buildGrid(
  intersections: Point[],
  clusterThreshold: number
): Grid {
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
        const distToBest =
          Math.abs(best.x - targetX) + Math.abs(best.y - targetY);
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

export function filterCells(
  cells: DetectedCell[],
  minWidth: number,
  minHeight: number
): DetectedCell[] {
  return cells.filter(
    cell => cell.width >= minWidth && cell.height >= minHeight
  );
}
