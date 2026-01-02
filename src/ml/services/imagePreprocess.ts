/**
 * Image preprocessing service for YOLOX model input
 * Converts images to 640x640 RGB NCHW float32 tensors
 */

import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';
import * as jpeg from 'jpeg-js';
import { DEFAULT_MODEL_CONFIG } from '../types';

// Ensure Buffer is available globally for jpeg-js
global.Buffer = global.Buffer || Buffer;

// YOLOX uses BGR channel order and places image at TOP-LEFT
const USE_RGB_CHANNEL_ORDER = false;
const USE_CENTERED_LETTERBOX = false;

export interface PreprocessResult {
  tensor: Float32Array;
  originalWidth: number;
  originalHeight: number;
  scale: number;
  padX: number;
  padY: number;
}

/**
 * Preprocess an image for YOLOX inference
 * @param imageUri - URI of the image to process
 * @returns Preprocessed tensor and metadata for coordinate conversion
 */
export async function preprocessImage(imageUri: string): Promise<PreprocessResult | null> {
  try {
    console.log('[Preprocess] Starting image preprocessing:', imageUri);

    // Get original image dimensions using manipulator with no actions
    const originalInfo = await ImageManipulator.manipulateAsync(
      imageUri,
      [],
      { format: ImageManipulator.SaveFormat.JPEG }
    );

    const originalWidth = originalInfo.width;
    const originalHeight = originalInfo.height;

    console.log(`[Preprocess] Original dimensions: ${originalWidth}x${originalHeight}`);

    // Calculate scaling to fit in 640x640 while maintaining aspect ratio
    const targetSize = DEFAULT_MODEL_CONFIG.inputWidth;
    const scale = Math.min(targetSize / originalWidth, targetSize / originalHeight);
    const scaledWidth = Math.round(originalWidth * scale);
    const scaledHeight = Math.round(originalHeight * scale);

    // Calculate padding position
    let padX: number, padY: number;
    if (USE_CENTERED_LETTERBOX) {
      padX = Math.floor((targetSize - scaledWidth) / 2);
      padY = Math.floor((targetSize - scaledHeight) / 2);
    } else {
      // YOLOX standard: top-left positioning
      padX = 0;
      padY = 0;
    }

    console.log(`[Preprocess] Scaled: ${scaledWidth}x${scaledHeight}, Padding: (${padX}, ${padY})`);

    // Resize image to scaled dimensions
    const resized = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: scaledWidth, height: scaledHeight } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!resized.base64) {
      throw new Error('Failed to get base64 data from resized image');
    }

    // Decode JPEG to get raw pixel data
    const jpegBuffer = Buffer.from(resized.base64, 'base64');
    const rawImage = jpeg.decode(jpegBuffer, { useTArray: true });

    console.log(`[Preprocess] Decoded image: ${rawImage.width}x${rawImage.height}`);

    // Create output tensor with padding (filled with 114 - YOLOX default padding value)
    const tensorSize = 3 * targetSize * targetSize;
    const tensor = new Float32Array(tensorSize);

    // Fill with padding value (114 is standard YOLOX gray, 0-255 range)
    const paddingValue = 114.0;
    tensor.fill(paddingValue);

    // Copy pixel data to tensor in NCHW format
    const pixels = rawImage.data;

    for (let y = 0; y < scaledHeight; y++) {
      for (let x = 0; x < scaledWidth; x++) {
        const srcIdx = (y * scaledWidth + x) * 4; // RGBA from JPEG decoder
        const dstX = x + padX;
        const dstY = y + padY;

        if (dstX >= 0 && dstX < targetSize && dstY >= 0 && dstY < targetSize) {
          // NCHW format, 0-255 range
          const ch0Idx = 0 * targetSize * targetSize + dstY * targetSize + dstX;
          const ch1Idx = 1 * targetSize * targetSize + dstY * targetSize + dstX;
          const ch2Idx = 2 * targetSize * targetSize + dstY * targetSize + dstX;

          if (USE_RGB_CHANNEL_ORDER) {
            // RGB order
            tensor[ch0Idx] = pixels[srcIdx + 0]; // R
            tensor[ch1Idx] = pixels[srcIdx + 1]; // G
            tensor[ch2Idx] = pixels[srcIdx + 2]; // B
          } else {
            // BGR order (OpenCV/YOLOX standard)
            tensor[ch0Idx] = pixels[srcIdx + 2]; // B
            tensor[ch1Idx] = pixels[srcIdx + 1]; // G
            tensor[ch2Idx] = pixels[srcIdx + 0]; // R
          }
        }
      }
    }

    // Log tensor statistics
    let minVal = Infinity, maxVal = -Infinity, sum = 0;
    for (let i = 0; i < tensor.length; i++) {
      if (tensor[i] < minVal) minVal = tensor[i];
      if (tensor[i] > maxVal) maxVal = tensor[i];
      sum += tensor[i];
    }
    console.log(`[Preprocess] Tensor stats - min:${minVal.toFixed(1)}, max:${maxVal.toFixed(1)}, mean:${(sum/tensor.length).toFixed(1)}`);

    console.log('[Preprocess] Tensor created successfully');

    return {
      tensor,
      originalWidth,
      originalHeight,
      scale,
      padX,
      padY,
    };
  } catch (error) {
    console.error('[Preprocess] Error:', error);
    return null;
  }
}

/**
 * Convert detection coordinates from model space back to original image space
 */
export function convertToOriginalCoords(
  x: number,
  y: number,
  preprocessResult: PreprocessResult
): { x: number; y: number } {
  const { scale, padX, padY } = preprocessResult;

  const originalX = (x - padX) / scale;
  const originalY = (y - padY) / scale;

  return { x: originalX, y: originalY };
}

/**
 * Convert bounding box from model space to original image space
 */
export function convertBoxToOriginalCoords(
  box: { x: number; y: number; width: number; height: number },
  preprocessResult: PreprocessResult
): { x: number; y: number; width: number; height: number } {
  const { scale, padX, padY } = preprocessResult;

  return {
    x: (box.x - padX) / scale,
    y: (box.y - padY) / scale,
    width: box.width / scale,
    height: box.height / scale,
  };
}
