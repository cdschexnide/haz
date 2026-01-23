/**
 * YOLOX postprocessing: decode output tensor, apply NMS
 */

import { Detection, BoundingBox, ClassInfo, DEFAULT_MODEL_CONFIG, MAX_DETECTIONS } from '../types';
import { PreprocessResult, convertBoxToOriginalCoords } from './imagePreprocess';

// Class mapping loaded from JSON
let classMapping: ClassInfo[] | null = null;

/**
 * Load class mapping from bundled JSON
 */
export function loadClassMapping(mapping: ClassInfo[]): void {
  classMapping = mapping;
  console.log(`[Postprocess] Loaded ${classMapping.length} classes`);
}

/**
 * Get class info by ID
 */
export function getClassInfo(classId: number): ClassInfo | undefined {
  return classMapping?.find(c => c.id === classId);
}

/**
 * Sigmoid activation function
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Calculate Intersection over Union (IoU) for two bounding boxes
 */
function calculateIoU(box1: BoundingBox, box2: BoundingBox): number {
  const x1 = Math.max(box1.x, box2.x);
  const y1 = Math.max(box1.y, box2.y);
  const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
  const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

  const intersectionWidth = Math.max(0, x2 - x1);
  const intersectionHeight = Math.max(0, y2 - y1);
  const intersectionArea = intersectionWidth * intersectionHeight;

  const box1Area = box1.width * box1.height;
  const box2Area = box2.width * box2.height;
  const unionArea = box1Area + box2Area - intersectionArea;

  return unionArea > 0 ? intersectionArea / unionArea : 0;
}

/**
 * Apply Non-Maximum Suppression to filter overlapping detections
 */
function applyNMS(
  detections: Detection[],
  iouThreshold: number
): Detection[] {
  if (detections.length === 0) return [];

  // Sort by confidence (descending)
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const kept: Detection[] = [];

  while (sorted.length > 0) {
    const current = sorted.shift()!;
    kept.push(current);

    for (let i = sorted.length - 1; i >= 0; i--) {
      const iou = calculateIoU(current.box, sorted[i].box);
      if (iou > iouThreshold) {
        sorted.splice(i, 1);
      }
    }
  }

  return kept;
}

/**
 * Generate grid coordinates for YOLOX anchors
 */
function generateGrids(
  inputSize: number,
  strides: number[]
): { grids: number[][]; expandedStrides: number[] } {
  const grids: number[][] = [];
  const expandedStrides: number[] = [];

  for (const stride of strides) {
    const gridSize = inputSize / stride;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grids.push([x, y]);
        expandedStrides.push(stride);
      }
    }
  }

  return { grids, expandedStrides };
}

interface RawDetection {
  box: BoundingBox;
  classId: number;
  confidence: number;
}

// Our export uses decode_in_inference=False
const FORCE_SIGMOID = true;

/**
 * Decode YOLOX output tensor to detections
 */
export function decodeYOLOXOutput(
  outputData: Float32Array,
  outputDims: readonly number[],
  preprocessResult: PreprocessResult,
  confidenceThreshold: number = DEFAULT_MODEL_CONFIG.confidenceThreshold
): Detection[] {
  console.log(`[Postprocess] Decoding output with dims: [${outputDims.join(', ')}]`);

  const numClasses = DEFAULT_MODEL_CONFIG.numClasses;
  const inputSize = DEFAULT_MODEL_CONFIG.inputWidth;
  const strides = DEFAULT_MODEL_CONFIG.strides;

  // Generate grids for anchor decoding
  const { grids, expandedStrides } = generateGrids(inputSize, strides);

  // Determine output format
  let numAnchors: number;
  let numOutputs: number;

  if (outputDims.length === 3) {
    numAnchors = outputDims[1];
    numOutputs = outputDims[2];
  } else if (outputDims.length === 2) {
    numAnchors = outputDims[0];
    numOutputs = outputDims[1];
  } else {
    console.error('[Postprocess] Unexpected output dimensions:', outputDims);
    return [];
  }

  console.log(`[Postprocess] Num anchors: ${numAnchors}, Outputs per anchor: ${numOutputs}`);

  const isPreNormalized = !FORCE_SIGMOID;

  const rawDetections: RawDetection[] = [];

  // Process each anchor
  for (let i = 0; i < numAnchors; i++) {
    const offset = i * numOutputs;

    const xCenter = outputData[offset + 0];
    const yCenter = outputData[offset + 1];
    const w = outputData[offset + 2];
    const h = outputData[offset + 3];

    const objectnessRaw = outputData[offset + 4];
    const objectness = isPreNormalized ? objectnessRaw : sigmoid(objectnessRaw);

    if (objectness < confidenceThreshold) {
      continue;
    }

    // Find best class
    let maxClassScore = -Infinity;
    let bestClassId = 0;

    for (let c = 0; c < numClasses; c++) {
      const classScore = outputData[offset + 5 + c];
      if (classScore > maxClassScore) {
        maxClassScore = classScore;
        bestClassId = c;
      }
    }

    const classProb = isPreNormalized ? maxClassScore : sigmoid(maxClassScore);
    const confidence = objectness * classProb;

    if (confidence < confidenceThreshold) {
      continue;
    }

    // Get grid position for this anchor
    const gridIdx = i < grids.length ? i : i % grids.length;
    const [gridX, gridY] = grids[gridIdx];
    const stride = expandedStrides[gridIdx];

    // YOLOX box decoding
    const absX = (xCenter + gridX) * stride;
    const absY = (yCenter + gridY) * stride;
    const absW = Math.exp(w) * stride;
    const absH = Math.exp(h) * stride;

    const box: BoundingBox = {
      x: absX - absW / 2,
      y: absY - absH / 2,
      width: absW,
      height: absH,
    };

    rawDetections.push({
      box,
      classId: bestClassId,
      confidence,
    });
  }

  console.log(`[Postprocess] Found ${rawDetections.length} raw detections above threshold`);

  // Pre-filter for NMS performance
  let filteredDetections = rawDetections;
  if (rawDetections.length > 1000) {
    filteredDetections = [...rawDetections]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 1000);
  }

  // Apply NMS per class
  const detectionsByClass = new Map<number, RawDetection[]>();

  for (const det of filteredDetections) {
    if (!detectionsByClass.has(det.classId)) {
      detectionsByClass.set(det.classId, []);
    }
    detectionsByClass.get(det.classId)!.push(det);
  }

  const afterClassNMS: Detection[] = [];

  for (const [classId, dets] of detectionsByClass) {
    const classDetections: Detection[] = dets.map((d, idx) => {
      const classInfo = getClassInfo(classId);
      return {
        id: `det_${classId}_${idx}`,
        box: d.box,
        classId,
        className: classInfo?.name || `class_${classId}`,
        category: classInfo?.category || 'unknown',
        confidence: d.confidence,
      };
    });

    const nmsResult = applyNMS(classDetections, DEFAULT_MODEL_CONFIG.nmsThreshold);
    afterClassNMS.push(...nmsResult);
  }

  console.log(`[Postprocess] After per-class NMS: ${afterClassNMS.length} detections`);

  // Apply global NMS
  const globalNmsThreshold = 0.7;
  const afterGlobalNMS = applyNMS(afterClassNMS, globalNmsThreshold);

  console.log(`[Postprocess] After global NMS: ${afterGlobalNMS.length} detections`);

  // Convert coordinates to original image space
  const convertedDetections: Detection[] = afterGlobalNMS.map((det, idx) => {
    const originalBox = convertBoxToOriginalCoords(det.box, preprocessResult);

    const clampedBox: BoundingBox = {
      x: Math.max(0, originalBox.x),
      y: Math.max(0, originalBox.y),
      width: Math.min(originalBox.width, preprocessResult.originalWidth - originalBox.x),
      height: Math.min(originalBox.height, preprocessResult.originalHeight - originalBox.y),
    };

    return {
      ...det,
      id: `detection_${idx}`,
      box: clampedBox,
    };
  });

  // Sort by confidence and limit
  convertedDetections.sort((a, b) => b.confidence - a.confidence);
  const limitedDetections = convertedDetections.slice(0, MAX_DETECTIONS);

  console.log(`[Postprocess] Final detections: ${limitedDetections.length}`);

  return limitedDetections;
}

/**
 * Format class name for display (convert camelCase to readable format)
 */
export function formatClassName(name: string): string {
  // Special handling for explosives with compatibility group (e.g., "explosives1.1B" -> "Explosives 1.1B")
  const explosivesMatch = name.match(/^explosives(\d+\.?\d*)([A-Z])?(_.*)?$/i);
  if (explosivesMatch) {
    const division = explosivesMatch[1];
    const compatGroup = explosivesMatch[2] || "";
    const suffix = explosivesMatch[3]
      ? explosivesMatch[3]
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim()
      : "";
    return `Explosives ${division}${compatGroup}${suffix ? " " + suffix : ""}`;
  }

  // Default formatting for other class names
  let formatted = name.replace(/([A-Z])/g, ' $1').replace(/([0-9]+)/g, ' $1');
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  formatted = formatted.replace(/\s+/g, ' ').trim();
  return formatted;
}

/**
 * Get category color for display
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    general_marking: '#3B82F6',
    hazardClass1: '#EF4444',
    hazardClass2: '#22C55E',
    hazardClass3: '#F97316',
    hazardClass4: '#EAB308',
    hazardClass5: '#A855F7',
    hazardClass6: '#EC4899',
    hazardClass8: '#6366F1',
    hazardClass9: '#64748B',
    unknown: '#9CA3AF',
  };

  return colors[category] || colors.unknown;
}
