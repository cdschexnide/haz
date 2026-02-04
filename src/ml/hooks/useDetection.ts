/**
 * useDetection hook - manages the detection pipeline with optional OCR
 *
 * Supports both YOLOX object detection for hazmat labels and
 * ML Kit text recognition for package markings (POP, UN numbers, etc.)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CapturedImage,
  DetectionState,
  ImageDetectionResult,
  ClassInfo,
  Detection,
  // OCR types
  ImageAnalysisResult,
  AggregatedAnalysis,
  AggregatedLabel,
  AnalysisOptions,
  ExtractedMarkings,
} from '../types';
import {
  loadModel,
  isModelLoaded,
  runInference,
  preprocessImage,
  decodeYOLOXOutput,
  loadClassMapping,
  isRuntimeAvailable,
  getRuntimeError,
} from '../services';
import { performOCR, extractMarkingsFromText, detectMSLPresence } from '../services/ocrService';
import { POPMarkingType } from '@/utils/popMarkingParser';

// Import class mapping
const CLASS_MAPPING: ClassInfo[] = require('../data/class_mapping.json');

/**
 * Extended detection state that includes OCR-related fields
 */
interface ExtendedDetectionState extends DetectionState {
  analysisResults: ImageAnalysisResult[];
  aggregatedResults: AggregatedAnalysis | null;
  processingStatus: string;
  ocrEnabled: boolean;
}

interface UseDetectionReturn {
  state: ExtendedDetectionState;
  isRuntimeAvailable: boolean;
  runtimeError: string | null;
  loadModelAsync: () => Promise<boolean>;
  // Original detection-only functions (backward compatible)
  processImage: (image: CapturedImage) => Promise<ImageDetectionResult | null>;
  processAllImages: (images: CapturedImage[]) => Promise<ImageDetectionResult[]>;
  // New combined analysis functions
  processImageWithAnalysis: (
    image: CapturedImage,
    options?: AnalysisOptions
  ) => Promise<ImageAnalysisResult | null>;
  processAllImagesWithAnalysis: (
    images: CapturedImage[],
    options?: AnalysisOptions
  ) => Promise<AggregatedAnalysis | null>;
  // State management
  clearResults: () => void;
  addImage: (image: CapturedImage) => void;
  removeImage: (index: number) => void;
  setOCREnabled: (enabled: boolean) => void;
}

/**
 * Default analysis options
 */
const DEFAULT_OPTIONS: AnalysisOptions = {
  enableOCR: true,
  confidenceThreshold: 0.4,
  extractPOPMarking: true,
  extractUNNumbers: true,
};

/**
 * Aggregate results across multiple images
 * Exported so it can be used to re-aggregate after manual corrections
 */
export function aggregateResults(results: ImageAnalysisResult[]): AggregatedAnalysis {
  console.log('[useDetection] Aggregating results from', results.length, 'images');

  let totalProcessingTime = 0;
  const labelMap = new Map<string, AggregatedLabel>();
  const allUnNumbers = new Set<string>();
  const allWeights: { value: string; unit: string }[] = [];
  const allHazardClasses = new Set<string>();
  let bestPopMarking: AggregatedAnalysis['bestPopMarking'] = null;
  let countryOfOrigin: string | null = null;
  let rawPopMarkingText: string | null = null;
  const allEXNumbers = new Set<string>();
  const allPSNs = new Set<string>();
  const allUnWithPSN: { un: string; psn: string }[] = [];
  const allOCRText: string[] = []; // Collect all OCR text for MSL detection

  results.forEach((result, imageIndex) => {
    totalProcessingTime += result.totalProcessingTime;

    // Aggregate detections
    result.detections.forEach((detection) => {
      const existing = labelMap.get(detection.className);
      if (existing) {
        existing.occurrences += 1;
        if (detection.confidence > existing.maxConfidence) {
          existing.maxConfidence = detection.confidence;
          existing.bestImageIndex = imageIndex;
        }
      } else {
        labelMap.set(detection.className, {
          className: detection.className,
          category: detection.category,
          maxConfidence: detection.confidence,
          occurrences: 1,
          bestImageIndex: imageIndex,
        });
      }
    });

    // Collect OCR text for MSL detection
    if (result.ocrResult?.fullText) {
      allOCRText.push(result.ocrResult.fullText);
    }

    // Aggregate OCR data
    if (result.extractedMarkings) {
      const markings = result.extractedMarkings;

      // UN numbers
      markings.unNumbers.forEach((un) => allUnNumbers.add(un));

      // Weights
      allWeights.push(...markings.weights);

      // Hazard classes
      markings.hazardClasses.forEach((hc) => allHazardClasses.add(hc));

      // Country of origin (first found wins)
      if (!countryOfOrigin && markings.countryOfOrigin) {
        countryOfOrigin = markings.countryOfOrigin;
      }

      // Raw POP marking text (first found wins)
      if (!rawPopMarkingText && markings.rawPopMarkingText) {
        rawPopMarkingText = markings.rawPopMarkingText;
      }

      // EX numbers
      markings.exNumbers?.forEach((ex) => allEXNumbers.add(ex));

      // Proper shipping names
      markings.properShippingNames?.forEach((psn) => allPSNs.add(psn));

      // UN+PSN pairs (keep all, may have duplicates with different images)
      if (markings.unWithPSN) {
        allUnWithPSN.push(...markings.unWithPSN);
      }

      // POP marking (highest confidence wins)
      if (markings.popMarking?.found && markings.popMarking.fields) {
        const popConfidence = markings.popMarking.confidence;
        if (!bestPopMarking || popConfidence > bestPopMarking.confidence) {
          bestPopMarking = {
            fields: markings.popMarking.fields,
            confidence: popConfidence,
            sourceImageIndex: imageIndex,
            detectedType: markings.popMarking.detectedType,
          };
        }
      }
    }
  });

  // Sort labels by confidence
  const sortedLabels = Array.from(labelMap.values()).sort(
    (a, b) => b.maxConfidence - a.maxConfidence
  );

  // Run MSL detection on combined OCR text from all images
  const combinedOCRText = allOCRText.join('\n');
  const mslDetection = detectMSLPresence(combinedOCRText);

  if (mslDetection.detected) {
    console.log('[useDetection] MSL detected with', mslDetection.confidence, 'confidence');
  }

  const aggregated: AggregatedAnalysis = {
    bestPopMarking,
    allDetectedLabels: sortedLabels,
    allUnNumbers: Array.from(allUnNumbers),
    allWeights,
    allHazardClasses: Array.from(allHazardClasses),
    countryOfOrigin,
    allEXNumbers: Array.from(allEXNumbers),
    allPSNs: Array.from(allPSNs),
    allUnWithPSN,
    rawPopMarkingText,
    mslDetected: mslDetection.detected,
    mslConfidence: mslDetection.confidence,
    mslMatchedPatterns: mslDetection.matchedPatterns,
    primaryHazardDetection: null,
    subsidiaryHazardDetections: [],
    hazardLabelPositionWarning: false,
    hazardLabelPositionWarningMessage: null,
    imagesProcessed: results.length,
    totalProcessingTime,
    perImageResults: results,
  };

  console.log('[useDetection] Aggregation complete:', {
    labels: sortedLabels.length,
    unNumbers: allUnNumbers.size,
    exNumbers: allEXNumbers.size,
    unWithPSN: allUnWithPSN.length,
    hasPOP: !!bestPopMarking,
    mslDetected: mslDetection.detected,
    mslConfidence: mslDetection.confidence,
    totalTime: totalProcessingTime,
  });

  return aggregated;
}

export function useDetection(): UseDetectionReturn {
  const [state, setState] = useState<ExtendedDetectionState>({
    capturedImages: [],
    results: [],
    analysisResults: [],
    aggregatedResults: null,
    isProcessing: false,
    processingStatus: '',
    error: null,
    modelLoaded: false,
    ocrEnabled: true,
  });

  // Track if component is mounted for async safety
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load class mapping on mount
  useEffect(() => {
    loadClassMapping(CLASS_MAPPING);
  }, []);

  // Safe state update
  const safeSetState = useCallback(
    (updater: (prev: ExtendedDetectionState) => ExtendedDetectionState) => {
      if (isMounted.current) {
        setState(updater);
      }
    },
    []
  );

  // Load model
  const loadModelAsync = useCallback(async (): Promise<boolean> => {
    if (isModelLoaded()) {
      safeSetState((prev) => ({ ...prev, modelLoaded: true }));
      return true;
    }

    safeSetState((prev) => ({
      ...prev,
      isProcessing: true,
      processingStatus: 'Loading detection model...',
      error: null,
    }));

    try {
      console.log('[useDetection] Loading model...');
      const success = await loadModel();

      safeSetState((prev) => ({
        ...prev,
        modelLoaded: success,
        isProcessing: false,
        processingStatus: '',
        error: success ? null : 'Failed to load detection model',
      }));

      return success;
    } catch (error) {
      console.error('[useDetection] Model load error:', error);
      safeSetState((prev) => ({
        ...prev,
        modelLoaded: false,
        isProcessing: false,
        processingStatus: '',
        error: `Model load error: ${error}`,
      }));
      return false;
    }
  }, [safeSetState]);

  // Process a single image (detection only - backward compatible)
  const processImage = useCallback(
    async (image: CapturedImage): Promise<ImageDetectionResult | null> => {
      if (!isModelLoaded()) {
        console.error('[useDetection] Model not loaded');
        return null;
      }

      try {
        const startTime = Date.now();

        // Preprocess image
        console.log('[useDetection] Preprocessing image...');
        const preprocessResult = await preprocessImage(image.uri);

        if (!preprocessResult) {
          throw new Error('Failed to preprocess image');
        }

        // Run inference
        console.log('[useDetection] Running inference...');
        const inferenceResult = await runInference(preprocessResult.tensor);

        if (!inferenceResult) {
          throw new Error('Failed to run inference');
        }

        // Post-process
        console.log('[useDetection] Post-processing...');
        const detections = decodeYOLOXOutput(
          inferenceResult.data,
          inferenceResult.dims,
          preprocessResult
        );

        const totalTime = Date.now() - startTime;

        const result: ImageDetectionResult = {
          imageUri: image.uri,
          imageWidth: preprocessResult.originalWidth,
          imageHeight: preprocessResult.originalHeight,
          detections,
          inferenceTime: totalTime,
        };

        console.log(
          `[useDetection] Processed image: ${detections.length} detections in ${totalTime}ms`
        );

        return result;
      } catch (error) {
        console.error('[useDetection] Process error:', error);
        return null;
      }
    },
    []
  );

  // Process a single image with both detection and OCR
  const processImageWithAnalysis = useCallback(
    async (
      image: CapturedImage,
      options: AnalysisOptions = DEFAULT_OPTIONS
    ): Promise<ImageAnalysisResult | null> => {
      const { enableOCR = true } = options;
      const startTime = Date.now();

      try {
        console.log('[useDetection] Processing image with analysis, OCR:', enableOCR);

        // Run detection and OCR in parallel for speed
        const [detectionResult, ocrResult] = await Promise.all([
          processImage(image),
          enableOCR ? performOCR(image.uri) : Promise.resolve(null),
        ]);

        if (!detectionResult) {
          console.error('[useDetection] Detection failed');
          return null;
        }

        // Extract markings from OCR text, passing line data for UN+PSN extraction
        let extractedMarkings: ExtractedMarkings | null = null;
        if (ocrResult?.fullText) {
          extractedMarkings = extractMarkingsFromText(
            ocrResult.fullText,
            ocrResult.textLines || []
          );
        }

        const totalProcessingTime = Date.now() - startTime;

        const result: ImageAnalysisResult = {
          imageUri: detectionResult.imageUri,
          imageWidth: detectionResult.imageWidth,
          imageHeight: detectionResult.imageHeight,
          detections: detectionResult.detections,
          inferenceTime: detectionResult.inferenceTime,
          ocrResult,
          extractedMarkings,
          totalProcessingTime,
        };

        console.log('[useDetection] Analysis complete:', {
          detections: result.detections.length,
          hasOCR: !!ocrResult,
          hasPOP: extractedMarkings?.popMarking?.found || false,
          unNumbers: extractedMarkings?.unNumbers?.length || 0,
          totalTime: totalProcessingTime,
        });

        return result;
      } catch (error) {
        console.error('[useDetection] Analysis error:', error);
        return null;
      }
    },
    [processImage]
  );

  // Process all images with combined analysis
  const processAllImagesWithAnalysis = useCallback(
    async (
      images: CapturedImage[],
      options: AnalysisOptions = DEFAULT_OPTIONS
    ): Promise<AggregatedAnalysis | null> => {
      if (images.length === 0) {
        console.warn('[useDetection] No images to process');
        return null;
      }

      safeSetState((prev) => ({
        ...prev,
        isProcessing: true,
        processingStatus: 'Preparing analysis...',
        error: null,
        analysisResults: [],
        aggregatedResults: null,
      }));

      const results: ImageAnalysisResult[] = [];

      try {
        // Ensure model is loaded
        if (!isModelLoaded()) {
          safeSetState((prev) => ({
            ...prev,
            processingStatus: 'Loading detection model...',
          }));

          const loaded = await loadModelAsync();
          if (!loaded) {
            throw new Error('Failed to load model');
          }
        }

        // Process images sequentially to avoid memory issues
        for (let i = 0; i < images.length; i++) {
          const imageNum = i + 1;
          const total = images.length;

          safeSetState((prev) => ({
            ...prev,
            processingStatus: `Analyzing image ${imageNum}/${total}...`,
          }));

          console.log(`[useDetection] Processing image ${imageNum}/${total}`);

          const result = await processImageWithAnalysis(images[i], options);
          if (result) {
            results.push(result);

            // Update state with intermediate results
            safeSetState((prev) => ({
              ...prev,
              analysisResults: [...results],
            }));
          }
        }

        // Aggregate results
        safeSetState((prev) => ({
          ...prev,
          processingStatus: 'Aggregating results...',
        }));

        const aggregated = aggregateResults(results);

        safeSetState((prev) => ({
          ...prev,
          isProcessing: false,
          processingStatus: '',
          analysisResults: results,
          aggregatedResults: aggregated,
        }));

        return aggregated;
      } catch (error) {
        console.error('[useDetection] Process all analysis error:', error);
        safeSetState((prev) => ({
          ...prev,
          isProcessing: false,
          processingStatus: '',
          error: `Processing error: ${error}`,
          analysisResults: results,
          aggregatedResults: results.length > 0 ? aggregateResults(results) : null,
        }));
        return results.length > 0 ? aggregateResults(results) : null;
      }
    },
    [loadModelAsync, processImageWithAnalysis, safeSetState]
  );

  // Process all captured images (detection only - backward compatible)
  const processAllImages = useCallback(
    async (images: CapturedImage[]): Promise<ImageDetectionResult[]> => {
      if (images.length === 0) return [];

      safeSetState((prev) => ({
        ...prev,
        isProcessing: true,
        processingStatus: 'Processing images...',
        error: null,
      }));

      const results: ImageDetectionResult[] = [];

      try {
        // Ensure model is loaded
        if (!isModelLoaded()) {
          const loaded = await loadModelAsync();
          if (!loaded) {
            throw new Error('Failed to load model');
          }
        }

        // Process images sequentially to avoid memory issues
        for (let i = 0; i < images.length; i++) {
          console.log(`[useDetection] Processing image ${i + 1}/${images.length}`);

          safeSetState((prev) => ({
            ...prev,
            processingStatus: `Processing image ${i + 1}/${images.length}...`,
          }));

          const result = await processImage(images[i]);
          if (result) {
            results.push(result);

            // Update state with intermediate results
            safeSetState((prev) => ({
              ...prev,
              results: [...prev.results, result],
            }));
          }
        }

        safeSetState((prev) => ({
          ...prev,
          isProcessing: false,
          processingStatus: '',
        }));

        return results;
      } catch (error) {
        console.error('[useDetection] Process all error:', error);
        safeSetState((prev) => ({
          ...prev,
          isProcessing: false,
          processingStatus: '',
          error: `Processing error: ${error}`,
        }));
        return results;
      }
    },
    [loadModelAsync, processImage, safeSetState]
  );

  // Clear all results
  const clearResults = useCallback(() => {
    safeSetState((prev) => ({
      ...prev,
      capturedImages: [],
      results: [],
      analysisResults: [],
      aggregatedResults: null,
      error: null,
      processingStatus: '',
    }));
  }, [safeSetState]);

  // Add a captured image
  const addImage = useCallback(
    (image: CapturedImage) => {
      safeSetState((prev) => ({
        ...prev,
        capturedImages: [...prev.capturedImages, image],
      }));
    },
    [safeSetState]
  );

  // Remove a captured image
  const removeImage = useCallback(
    (index: number) => {
      safeSetState((prev) => ({
        ...prev,
        capturedImages: prev.capturedImages.filter((_, i) => i !== index),
        results: prev.results.filter((_, i) => i !== index),
        analysisResults: prev.analysisResults.filter((_, i) => i !== index),
        // Recalculate aggregation if needed
        aggregatedResults:
          prev.analysisResults.length > 1
            ? aggregateResults(prev.analysisResults.filter((_, i) => i !== index))
            : null,
      }));
    },
    [safeSetState]
  );

  // Toggle OCR enabled
  const setOCREnabled = useCallback(
    (enabled: boolean) => {
      safeSetState((prev) => ({
        ...prev,
        ocrEnabled: enabled,
      }));
    },
    [safeSetState]
  );

  return {
    state,
    isRuntimeAvailable: isRuntimeAvailable(),
    runtimeError: getRuntimeError(),
    loadModelAsync,
    processImage,
    processAllImages,
    processImageWithAnalysis,
    processAllImagesWithAnalysis,
    clearResults,
    addImage,
    removeImage,
    setOCREnabled,
  };
}

export default useDetection;
