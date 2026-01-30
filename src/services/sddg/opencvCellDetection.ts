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
} from "./opencvTypes";
import {
  classifyLines,
  mergeNearbyLines,
  mergeColinearSegments,
  extendLine,
  getLineAngle,
} from "./lineUtils";
import { buildCellsFromLines, filterCells } from "./cellBuilder";

let OpenCV: any;
let ObjectType: any;
let ColorConversionCodes: any;
let ThresholdTypes: any;
let AdaptiveThresholdTypes: any;

try {
  const opencv = require("react-native-fast-opencv");
  OpenCV = opencv.OpenCV;
  ObjectType = opencv.ObjectType;
  ColorConversionCodes = opencv.ColorConversionCodes;
  ThresholdTypes = opencv.ThresholdTypes;
  AdaptiveThresholdTypes = opencv.AdaptiveThresholdTypes;
} catch (e) {
  console.warn("react-native-fast-opencv not available");
}

export function parseHoughLines(
  rawLines: number[] | null | undefined
): Line[] {
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

export function computeScaleAwareThresholds(
  config: CellDetectionConfig,
  imageDims: { width: number; height: number }
): {
  minLineLength: number;
  maxLineGap: number;
  mergeDistance: number;
  minCellWidth: number;
  minCellHeight: number;
  clusterThreshold: number;
} {
  const width = imageDims.width;
  const height = imageDims.height;
  const base = Math.max(width, height);

  return {
    minLineLength: Math.max(1, Math.round(width * config.minLineLengthPercent)),
    maxLineGap: Math.max(1, Math.round(width * config.maxLineGapPercent)),
    mergeDistance: Math.max(1, Math.round(base * config.mergeDistancePercent)),
    minCellWidth: Math.max(1, Math.round(width * config.minCellWidthPercent)),
    minCellHeight: Math.max(1, Math.round(height * config.minCellHeightPercent)),
    clusterThreshold: Math.max(
      1,
      Math.round(width * config.clusterThresholdPercent)
    ),
  };
}

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
        error: "OpenCV not available",
      };
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("Cell detection timeout")),
        config.timeoutMs
      );
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
): Promise<Omit<CellDetectionResult, "processingTimeMs">> {
  const src = await OpenCV.invoke("imread", { p1: imageUri });
  const imageWidth = src.cols;
  const imageHeight = src.rows;

  const thresholds = computeScaleAwareThresholds(config, {
    width: imageWidth,
    height: imageHeight,
  });

  const gray = await OpenCV.invoke("cvtColor", {
    p1: src,
    p2: ColorConversionCodes.COLOR_RGBA2GRAY,
  });

  const binary = await OpenCV.invoke("adaptiveThreshold", {
    p1: gray,
    p2: 255,
    p3: AdaptiveThresholdTypes.ADAPTIVE_THRESH_GAUSSIAN_C,
    p4: ThresholdTypes.THRESH_BINARY_INV,
    p5: config.adaptiveBlockSize,
    p6: config.adaptiveC,
  });

  const linesResult = await OpenCV.invoke("HoughLinesP", {
    p1: binary,
    p2: 1,
    p3: Math.PI / 180,
    p4: config.houghThreshold,
    p5: thresholds.minLineLength,
    p6: thresholds.maxLineGap,
  });

  const rawLines = await OpenCV.toJSValue(linesResult);
  const allLines = parseHoughLines(rawLines);

  let skewDetected = false;
  if (allLines.length > 0) {
    const skewCandidates = allLines.filter(line => {
      const angle = getLineAngle(line);
      const nearHorizontal = Math.abs(angle) <= config.angleToleranceDegrees;
      const nearVertical = Math.abs(angle - 90) <= config.angleToleranceDegrees;
      return !nearHorizontal && !nearVertical;
    });
    skewDetected = skewCandidates.length / allLines.length > 0.3;
  }

  const { horizontal, vertical } = classifyLines(
    allLines,
    config.angleToleranceDegrees
  );

  const mergedHorizontal = mergeColinearSegments(
    mergeNearbyLines(horizontal, thresholds.mergeDistance),
    thresholds.mergeDistance,
    config.angleToleranceDegrees
  );
  const mergedVertical = mergeColinearSegments(
    mergeNearbyLines(vertical, thresholds.mergeDistance),
    thresholds.mergeDistance,
    config.angleToleranceDegrees
  );

  const extendedHorizontal = mergedHorizontal.map(line =>
    extendLine(
      line,
      imageWidth,
      imageHeight,
      config.angleToleranceDegrees,
      config.lineExtensionPercent
    )
  );
  const extendedVertical = mergedVertical.map(line =>
    extendLine(
      line,
      imageWidth,
      imageHeight,
      config.angleToleranceDegrees,
      config.lineExtensionPercent
    )
  );

  const allCells = buildCellsFromLines(
    extendedHorizontal,
    extendedVertical,
    thresholds.clusterThreshold
  );
  const cells = filterCells(
    allCells,
    thresholds.minCellWidth,
    thresholds.minCellHeight
  );

  await OpenCV.invoke("release", { p1: src });
  await OpenCV.invoke("release", { p1: gray });
  await OpenCV.invoke("release", { p1: binary });

  return {
    success: cells.length >= 10,
    cells,
    horizontalLines: extendedHorizontal,
    verticalLines: extendedVertical,
    imageWidth,
    imageHeight,
    skewDetected,
  };
}
