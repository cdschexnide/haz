/**
 * Template auto-alignment using detected cells
 *
 * Matches detected cells to template fields using:
 * 1. Anchor labels (primary)
 * 2. Position-based matching (fallback, always attempted)
 *
 * Then computes translation+scale transform.
 */

import { SDDGTemplate } from "@/types/sddg-template";
import { TextBlock } from "./anchorTypes";
import {
  DetectedCell,
  AlignmentTransform,
  AutoAlignmentResult,
} from "./opencvTypes";

const ALIGNMENT_ANCHORS: Record<string, string[]> = {
  shipper: ["SHIPPER"],
  consignee: ["CONSIGNEE"],
  "air_waybill.awb_number": ["AIR WAYBILL", "AIR WAYBILL NO"],
  "shipper_reference.tcn": ["SHIPPER'S REFERENCE", "TCN"],
  "transportation_details.airport_departure": ["AIRPORT OF DEPARTURE"],
  "transportation_details.airport_destination": ["AIRPORT OF DESTINATION"],
  "dangerous_goods.un_number": ["UN or ID NO", "UN OR ID"],
  "dangerous_goods.proper_shipping_name": ["PROPER SHIPPING NAME"],
  additional_handling: ["ADDITIONAL HANDLING"],
  "signature_block.name_title": ["NAME/TITLE", "NAME OF SIGNATORY"],
};

const TEMPLATE_FIELD_POSITIONS: Record<string, { x: number; y: number }> = {
  shipper: { x: 0.31, y: 0.13 },
  consignee: { x: 0.31, y: 0.21 },
  "air_waybill.awb_number": { x: 0.77, y: 0.09 },
  "shipper_reference.tcn": { x: 0.77, y: 0.16 },
  "transportation_details.airport_departure": { x: 0.5, y: 0.34 },
  "transportation_details.airport_destination": { x: 0.31, y: 0.39 },
  "dangerous_goods.un_number": { x: 0.08, y: 0.58 },
  "dangerous_goods.proper_shipping_name": { x: 0.25, y: 0.58 },
  additional_handling: { x: 0.49, y: 0.76 },
  "signature_block.name_title": { x: 0.79, y: 0.88 },
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
    const normalizedText = block.text.toUpperCase().replace(/\\s+/g, " ").trim();

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

export function computeTransform(
  matches: Array<{
    template: { x: number; y: number };
    detected: { x: number; y: number };
  }>,
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

  let scaleXSum = 0;
  let scaleYSum = 0;
  let scaleXCount = 0;
  let scaleYCount = 0;

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

  let offsetXSum = 0;
  let offsetYSum = 0;

  for (const m of matches) {
    offsetXSum += m.detected.x - m.template.x * scaleX;
    offsetYSum += m.detected.y - m.template.y * scaleY;
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

      if (value && typeof value === "object") {
        if (
          "x" in value &&
          "y" in value &&
          "w" in value &&
          "h" in value &&
          "fieldType" in value
        ) {
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
  const parts = fieldPath.split(".");
  let current: any = template.regions;

  for (const part of parts) {
    if (!current[part]) return null;
    current = current[part];
  }

  if (current && "x" in current && "y" in current && "w" in current && "h" in current) {
    return {
      x: current.x + current.w / 2,
      y: current.y + current.h / 2,
    };
  }

  return null;
}

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
    method: "anchor" | "position";
  }> = [];

  const matchedFieldPaths = new Set<string>();

  for (const fieldPath of Object.keys(ALIGNMENT_ANCHORS)) {
    const matchedCell = matchCellToTemplateFieldByAnchor(
      fieldPath,
      cells,
      textBlocks
    );

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
          method: "anchor",
        });
        matchedFieldPaths.add(fieldPath);
      }
    }
  }

  const POSITION_THRESHOLD = 0.15;
  for (const fieldPath of Object.keys(TEMPLATE_FIELD_POSITIONS)) {
    if (matchedFieldPaths.has(fieldPath)) continue;
    const templateCenter = getFieldCenter(template, fieldPath);
    if (!templateCenter) continue;

    const normalized = TEMPLATE_FIELD_POSITIONS[fieldPath];
    const matchedCell = matchFieldByPosition(
      cells,
      normalized,
      imageDims,
      POSITION_THRESHOLD
    );

    if (matchedCell) {
      matches.push({
        fieldPath,
        template: templateCenter,
        detected: {
          x: matchedCell.x + matchedCell.width / 2,
          y: matchedCell.y + matchedCell.height / 2,
        },
        method: "position",
      });
    }
  }

  if (matches.length < 3) {
    const anchorMatches = matches.filter(m => m.method === "anchor").length;
    const positionMatches = matches.filter(m => m.method === "position").length;
    const alignmentMethod =
      anchorMatches > 0 && positionMatches > 0
        ? "hybrid"
        : anchorMatches > 0
        ? "anchor"
        : "position";
    return {
      success: false,
      transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
      matchedFields: matches.length,
      totalFields: Object.keys(ALIGNMENT_ANCHORS).length,
      confidence: matches.length / Object.keys(ALIGNMENT_ANCHORS).length,
      alignmentMethod,
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
    const anchorMatches = matches.filter(m => m.method === "anchor").length;
    const positionMatches = matches.filter(m => m.method === "position").length;
    const alignmentMethod =
      anchorMatches > 0 && positionMatches > 0
        ? "hybrid"
        : anchorMatches > 0
        ? "anchor"
        : "position";
    return {
      success: false,
      transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
      matchedFields: matches.length,
      totalFields: Object.keys(ALIGNMENT_ANCHORS).length,
      confidence: 0,
      alignmentMethod,
      anchorMatches,
      positionMatches,
      failureReason: "Computed transform exceeds reasonable bounds",
      processingTimeMs: Date.now() - startTime,
    };
  }

  const matchRatio = matches.length / Object.keys(ALIGNMENT_ANCHORS).length;
  const transformQuality =
    1 -
    (Math.abs(transform.scaleX - 1) + Math.abs(transform.scaleY - 1)) / 0.6;
  const confidence = matchRatio * 0.7 + transformQuality * 0.3;

  const anchorMatches = matches.filter(m => m.method === "anchor").length;
  const positionMatches = matches.filter(m => m.method === "position").length;

  const alignmentMethod =
    anchorMatches > 0 && positionMatches > 0
      ? "hybrid"
      : anchorMatches > 0
      ? "anchor"
      : "position";

  return {
    success: true,
    transform,
    matchedFields: matches.length,
    totalFields: Object.keys(ALIGNMENT_ANCHORS).length,
    confidence,
    alignmentMethod,
    anchorMatches,
    positionMatches,
    processingTimeMs: Date.now() - startTime,
  };
}
