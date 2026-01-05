/**
 * OCR Types for ML Detection + Text Recognition
 *
 * These types support the combined analysis pipeline that runs
 * both YOLOX object detection and ML Kit text recognition on package images.
 */

import { BoundingBox } from './detection';
import { POPMarkingFields, POPMarkingType } from '@/utils/popMarkingParser';

/**
 * A single block of text detected by OCR with optional position
 */
export interface OCRTextBlock {
  text: string;
  boundingBox: BoundingBox | null;
  confidence?: number;
}

/**
 * A single line of text detected by OCR with optional position
 */
export interface OCRTextLine {
  text: string;
  boundingBox: BoundingBox | null;
}

/**
 * Raw OCR result from ML Kit text recognition
 */
export interface ImageOCRResult {
  /** Complete concatenated text from all blocks */
  fullText: string;
  /** Individual text blocks with positions */
  textBlocks: OCRTextBlock[];
  /** Individual text lines with positions (for line-level extraction) */
  textLines: OCRTextLine[];
  /** Time taken for OCR processing in milliseconds */
  processingTime: number;
}

/**
 * Parsed POP marking data extracted from OCR text
 */
export interface ParsedPOPMarking {
  /** Whether a POP marking was successfully identified */
  found: boolean;
  /** Parsed POP marking fields (A-H) */
  fields: POPMarkingFields | null;
  /** Confidence score from 0-1 */
  confidence: number;
  /** Validation issues found during parsing */
  issues: string[];
  /** Detected type of POP marking */
  detectedType: POPMarkingType;
  /** The raw text that was parsed */
  sourceText: string;
}

/**
 * Weight/mass value extracted from text
 */
export interface ExtractedWeight {
  value: string;
  unit: 'KG' | 'G' | 'LB' | 'OZ' | 'KILOGRAMS' | 'GRAMS' | 'POUNDS' | 'OUNCES';
}

/**
 * All markings and data extracted from OCR text
 */
export interface ExtractedMarkings {
  /** Parsed POP marking if found */
  popMarking: ParsedPOPMarking | null;
  /** UN identification numbers found (e.g., ["UN1203", "UN3082"]) */
  unNumbers: string[];
  /** Weight/mass values found */
  weights: ExtractedWeight[];
  /** Hazard class indicators found (e.g., ["3", "6.1"]) */
  hazardClasses: string[];
  /** Date patterns found (e.g., ["05/23", "2023"]) */
  dates: string[];
  /** Country of origin if identified */
  countryOfOrigin: string | null;
  /** Any other significant text patterns */
  otherMarkings: string[];
  /** EX classification numbers found (e.g., ["EX-2019037142"]) */
  exNumbers: string[];
  /** Proper shipping names found (e.g., ["FUZES DETONATING"]) */
  properShippingNames: string[];
  /** UN numbers paired with their proper shipping names */
  unWithPSN: { un: string; psn: string }[];
}

/**
 * Combined analysis result for a single image
 * Extends detection result with OCR data
 */
export interface ImageAnalysisResult {
  /** Source image URI */
  imageUri: string;
  /** Original image width */
  imageWidth: number;
  /** Original image height */
  imageHeight: number;
  /** YOLOX hazmat label detections */
  detections: import('./detection').Detection[];
  /** YOLOX inference time in milliseconds */
  inferenceTime: number;
  /** Raw OCR result (null if OCR disabled or failed) */
  ocrResult: ImageOCRResult | null;
  /** Parsed markings from OCR text */
  extractedMarkings: ExtractedMarkings | null;
  /** Combined processing time (detection + OCR) */
  totalProcessingTime: number;
}

/**
 * Aggregated label detection across all images
 */
export interface AggregatedLabel {
  /** Class name of the detected label */
  className: string;
  /** Category (e.g., "hazardClass3", "general_marking") */
  category: string;
  /** Highest confidence seen for this label */
  maxConfidence: number;
  /** Number of times this label was detected */
  occurrences: number;
  /** Index of image with highest confidence detection */
  bestImageIndex: number;
}

/**
 * Aggregated analysis results across all processed images
 */
export interface AggregatedAnalysis {
  /** Best POP marking found (highest confidence) */
  bestPopMarking: {
    fields: POPMarkingFields;
    confidence: number;
    sourceImageIndex: number;
    detectedType: POPMarkingType;
  } | null;

  /** All unique detected labels with aggregated stats */
  allDetectedLabels: AggregatedLabel[];

  /** All unique UN numbers found across images */
  allUnNumbers: string[];

  /** All weights found */
  allWeights: ExtractedWeight[];

  /** All hazard classes found */
  allHazardClasses: string[];

  /** Best country of origin (first found) */
  countryOfOrigin: string | null;

  /** Number of images successfully processed */
  imagesProcessed: number;

  /** Total processing time across all images */
  totalProcessingTime: number;

  /** Per-image results for detailed view */
  perImageResults: ImageAnalysisResult[];
}

/**
 * State for the combined detection + OCR pipeline
 */
export interface AnalysisState {
  /** Images captured/selected for analysis */
  capturedImages: import('./detection').CapturedImage[];
  /** Analysis results per image */
  results: ImageAnalysisResult[];
  /** Aggregated results across all images */
  aggregatedResults: AggregatedAnalysis | null;
  /** Whether analysis is in progress */
  isProcessing: boolean;
  /** Current processing status message */
  processingStatus: string;
  /** Error message if analysis failed */
  error: string | null;
  /** Whether the YOLOX model is loaded */
  modelLoaded: boolean;
  /** Whether OCR is enabled */
  ocrEnabled: boolean;
}

/**
 * Options for the analysis pipeline
 */
export interface AnalysisOptions {
  /** Whether to run OCR on images (default: true) */
  enableOCR?: boolean;
  /** Minimum confidence threshold for detections (default: 0.4) */
  confidenceThreshold?: number;
  /** Whether to extract POP markings from OCR text (default: true) */
  extractPOPMarking?: boolean;
  /** Whether to extract UN numbers from OCR text (default: true) */
  extractUNNumbers?: boolean;
}
