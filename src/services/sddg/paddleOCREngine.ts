import TextRecognition from "@react-native-ml-kit/text-recognition";
import { OCRResult } from "../types/ocr";

/**
 * OCR Engine Service
 * Uses Google ML Kit Text Recognition for on-device OCR
 * Works with template-based field extraction
 */

let isInitialized = false;

/**
 * Initialize OCR engine (call once at app startup)
 * ML Kit doesn't require model loading - it's built into the OS
 */
export async function initializePaddleOCR(): Promise<void> {
  if (isInitialized) {
    console.log("OCR already initialized");
    return;
  }

  try {
    console.log("Initializing ML Kit OCR...");

    // ML Kit is native and doesn't require explicit initialization
    // Just mark as ready
    isInitialized = true;

    console.log("✅ ML Kit OCR initialized successfully");
  } catch (error) {
    throw new Error(`Failed to initialize OCR: ${error}`);
  }
}

/**
 * Extract text from an image using ML Kit OCR
 * Works with full images or cropped regions (for template-based extraction)
 */
/**
 * Process ML Kit blocks to reconstruct text with preserved line breaks
 * Groups blocks by Y-coordinate to detect lines
 */
function processBlocksWithLineBreaks(blocks: any[]): string {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  // Calculate Y-center for each block and add index
  const blocksWithPosition = blocks.map((block, index) => {
    if (!block.cornerPoints || block.cornerPoints.length === 0) {
      return null;
    }

    const yCoords = block.cornerPoints.map((p: {x: number, y: number}) => p.y);
    const yCenter = yCoords.reduce((a: number, b: number) => a + b, 0) / yCoords.length;
    const xCoords = block.cornerPoints.map((p: {x: number, y: number}) => p.x);
    const xCenter = xCoords.reduce((a: number, b: number) => a + b, 0) / xCoords.length;

    return {
      text: block.text,
      yCenter,
      xCenter,
      originalIndex: index,
    };
  }).filter((b): b is NonNullable<typeof b> => b !== null);

  // Sort by Y-coordinate (top to bottom)
  blocksWithPosition.sort((a, b) => a.yCenter - b.yCenter);

  // Group blocks into lines based on Y-coordinate proximity
  const LINE_THRESHOLD = 20; // pixels - blocks within 20px vertically are on same line
  const lines: Array<Array<typeof blocksWithPosition[0]>> = [];
  let currentLine: Array<typeof blocksWithPosition[0]> = [];

  for (const block of blocksWithPosition) {
    if (currentLine.length === 0) {
      currentLine.push(block);
    } else {
      const lastBlock = currentLine[currentLine.length - 1];
      const yDiff = Math.abs(block.yCenter - lastBlock.yCenter);

      if (yDiff < LINE_THRESHOLD) {
        // Same line
        currentLine.push(block);
      } else {
        // New line
        lines.push(currentLine);
        currentLine = [block];
      }
    }
  }

  // Don't forget the last line
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Sort blocks within each line by X-coordinate (left to right)
  lines.forEach(line => {
    line.sort((a, b) => a.xCenter - b.xCenter);
  });

  // Join blocks within lines with spaces, join lines with newlines
  const textWithLineBreaks = lines
    .map(line => line.map(block => block.text).join(" "))
    .join("\n");

  return textWithLineBreaks;
}

export async function extractText(imageUri: string): Promise<OCRResult> {
  if (!isInitialized) {
    await initializePaddleOCR();
  }

  try {
    console.log("Running ML Kit OCR inference...");

    // ML Kit does detection + recognition in one call
    const result = await TextRecognition.recognize(imageUri);

    console.log(`Detected ${result.blocks.length} text blocks`);

    // Convert ML Kit blocks to our OCRResult format
    const recognizedTexts: Array<{
      text: string;
      confidence: number;
      box: [number, number][];
    }> = [];

    for (const block of result.blocks) {
      // Convert ML Kit corner points to our box format
      // ML Kit provides cornerPoints as [{x, y}, {x, y}, {x, y}, {x, y}]
      const box: [number, number][] = block.cornerPoints
        ? block.cornerPoints.map(point => [point.x, point.y])
        : [];

      recognizedTexts.push({
        text: block.text,
        confidence: 1.0, // ML Kit doesn't provide per-block confidence
        box: box as [number, number][],
      });
    }

    // Process blocks to reconstruct text with line breaks preserved
    const fullText = processBlocksWithLineBreaks(result.blocks);

    // Calculate average confidence (ML Kit doesn't provide this, so we use 1.0)
    const avgConfidence = 1.0;

    console.log(`Extracted ${fullText.length} characters of text with line breaks`);
    console.log(`Reconstructed ${fullText.split("\n").length} lines from ${result.blocks.length} blocks`);

    return {
      text: fullText,
      confidence: avgConfidence,
      boxes: recognizedTexts,
    };
  } catch (error) {
    throw new Error(`ML Kit OCR extraction failed: ${error}`);
  }
}

/**
 * Cleanup OCR engine (call when app closes)
 * ML Kit doesn't require explicit cleanup, but provided for API compatibility
 */
export async function terminatePaddleOCR(): Promise<void> {
  isInitialized = false;
  console.log("OCR engine terminated");
}
