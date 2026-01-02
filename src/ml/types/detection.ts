/**
 * TypeScript types for hazmat label detection
 */

// Re-export OCR types for convenience
export * from './ocr';

/** Bounding box coordinates in pixel space */
export interface BoundingBox {
  x: number;      // Top-left x coordinate
  y: number;      // Top-left y coordinate
  width: number;  // Box width
  height: number; // Box height
}

/** Single detection result */
export interface Detection {
  id: string;
  box: BoundingBox;
  classId: number;
  className: string;
  category: string;
  confidence: number;
}

/** Class mapping entry from class_mapping.json */
export interface ClassInfo {
  id: number;
  name: string;
  path: string;
  category: string;
}

/** Detection results for a single image */
export interface ImageDetectionResult {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  detections: Detection[];
  inferenceTime: number;
}

/** Aggregated results from multiple images */
export interface MultiImageDetectionResult {
  images: ImageDetectionResult[];
  uniqueLabels: Map<string, Detection[]>; // className -> detections
  totalDetections: number;
}

/** Model configuration */
export interface ModelConfig {
  inputWidth: number;
  inputHeight: number;
  numClasses: number;
  confidenceThreshold: number;
  nmsThreshold: number;
  strides: number[];
}

/** Default model configuration for YOLOX-Tiny */
export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  inputWidth: 640,
  inputHeight: 640,
  numClasses: 92,
  confidenceThreshold: 0.4,
  nmsThreshold: 0.45,
  strides: [8, 16, 32],
};

/** Maximum number of detections to keep (for performance) */
export const MAX_DETECTIONS = 100;

/** Camera capture state */
export type CaptureState = 'idle' | 'capturing' | 'processing' | 'complete' | 'error';

/** Captured image info */
export interface CapturedImage {
  uri: string;
  width: number;
  height: number;
  timestamp: number;
}

/** Detection state for the hook */
export interface DetectionState {
  capturedImages: CapturedImage[];
  results: ImageDetectionResult[];
  isProcessing: boolean;
  error: string | null;
  modelLoaded: boolean;
}

/** Source of a detection - ML model or manual user correction */
export type DetectionSource = 'ml' | 'manual';

/** Extended detection with source tracking for corrections */
export interface CorrectedDetection extends Detection {
  /** Where this detection came from */
  source: DetectionSource;
  /** Original class ID if reclassified */
  originalClassId?: number;
  /** Original class name if reclassified */
  originalClassName?: string;
}

/** Record of a manual correction made by user */
export interface ManualCorrection {
  /** Type of correction */
  type: 'add' | 'edit' | 'delete';
  /** Which image this correction applies to */
  imageIndex: number;
  /** ID of the detection affected */
  detectionId: string;
  /** Original class info (for edit/delete) */
  originalClass?: { id: number; name: string };
  /** New class info (for add/edit) */
  newClass?: { id: number; name: string };
  /** When correction was made */
  timestamp: number;
}
