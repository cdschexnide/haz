/**
 * Coordinate Converter Utility
 * Converts between display coordinates (screen pixels) and template coordinates (2550×3300)
 */

import { Region } from "../../types/sddg-template";

// Template dimensions at 300 DPI
export const TEMPLATE_WIDTH = 2550;
export const TEMPLATE_HEIGHT = 3300;

/**
 * Convert template coordinates to display coordinates
 * @param templateRegion Region in template coordinates (2550×3300)
 * @param displayWidth Actual image width on screen
 * @param displayHeight Actual image height on screen
 * @returns Region in display coordinates
 */
export function templateToDisplay(
  templateRegion: Region,
  displayWidth: number,
  displayHeight: number
): Region {
  const scaleX = displayWidth / TEMPLATE_WIDTH;
  const scaleY = displayHeight / TEMPLATE_HEIGHT;

  return {
    x: templateRegion.x * scaleX,
    y: templateRegion.y * scaleY,
    w: templateRegion.w * scaleX,
    h: templateRegion.h * scaleY,
  };
}

/**
 * Convert display coordinates to template coordinates
 * @param displayRegion Region in display coordinates (screen pixels)
 * @param displayWidth Actual image width on screen
 * @param displayHeight Actual image height on screen
 * @returns Region in template coordinates (2550×3300)
 */
export function displayToTemplate(
  displayRegion: Region,
  displayWidth: number,
  displayHeight: number
): Region {
  const scaleX = TEMPLATE_WIDTH / displayWidth;
  const scaleY = TEMPLATE_HEIGHT / displayHeight;

  return {
    x: Math.round(displayRegion.x * scaleX),
    y: Math.round(displayRegion.y * scaleY),
    w: Math.round(displayRegion.w * scaleX),
    h: Math.round(displayRegion.h * scaleY),
  };
}

/**
 * Ensure region stays within image bounds
 * @param region Region to constrain
 * @param imageWidth Image width
 * @param imageHeight Image height
 * @param minSize Minimum region size (default 32)
 * @returns Constrained region
 */
export function constrainRegion(
  region: Region,
  imageWidth: number,
  imageHeight: number,
  minSize: number = 32
): Region {
  let { x, y, w, h } = region;

  // Ensure minimum size
  w = Math.max(w, minSize);
  h = Math.max(h, minSize);

  // Ensure region stays within bounds
  x = Math.max(0, Math.min(x, imageWidth - w));
  y = Math.max(0, Math.min(y, imageHeight - h));

  // Ensure width and height don't exceed image bounds
  if (x + w > imageWidth) {
    w = imageWidth - x;
  }
  if (y + h > imageHeight) {
    h = imageHeight - y;
  }

  return { x, y, w, h };
}

/**
 * Update region based on corner drag
 * @param region Current region
 * @param corner Which corner is being dragged ('tl'|'tr'|'bl'|'br')
 * @param deltaX X movement
 * @param deltaY Y movement
 * @returns Updated region
 */
export function updateRegionByCorner(
  region: Region,
  corner: "tl" | "tr" | "bl" | "br",
  deltaX: number,
  deltaY: number
): Region {
  let { x, y, w, h } = region;

  switch (corner) {
    case "tl": // Top-left
      x += deltaX;
      y += deltaY;
      w -= deltaX;
      h -= deltaY;
      break;
    case "tr": // Top-right
      y += deltaY;
      w += deltaX;
      h -= deltaY;
      break;
    case "bl": // Bottom-left
      x += deltaX;
      w -= deltaX;
      h += deltaY;
      break;
    case "br": // Bottom-right
      w += deltaX;
      h += deltaY;
      break;
  }

  return { x, y, w, h };
}

/**
 * Update region based on edge drag
 * @param region Current region
 * @param edge Which edge is being dragged ('top'|'right'|'bottom'|'left')
 * @param deltaX X movement
 * @param deltaY Y movement
 * @returns Updated region
 */
export function updateRegionByEdge(
  region: Region,
  edge: "top" | "right" | "bottom" | "left",
  deltaX: number,
  deltaY: number
): Region {
  let { x, y, w, h } = region;

  switch (edge) {
    case "top":
      y += deltaY;
      h -= deltaY;
      break;
    case "right":
      w += deltaX;
      break;
    case "bottom":
      h += deltaY;
      break;
    case "left":
      x += deltaX;
      w -= deltaX;
      break;
  }

  return { x, y, w, h };
}

/**
 * Move entire region
 * @param region Current region
 * @param deltaX X movement
 * @param deltaY Y movement
 * @returns Updated region
 */
export function moveRegion(
  region: Region,
  deltaX: number,
  deltaY: number
): Region {
  return {
    x: region.x + deltaX,
    y: region.y + deltaY,
    w: region.w,
    h: region.h,
  };
}
