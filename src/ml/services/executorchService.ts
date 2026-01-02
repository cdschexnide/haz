/**
 * ExecuTorch Runtime service for YOLOX model loading and inference
 * Uses react-native-executorch for on-device ML inference
 */

import { DEFAULT_MODEL_CONFIG } from "../types";

// Lazy-loaded ExecuTorch module class
let ExecutorchModuleClass: any = null;
let ScalarType: any = null;
let etLoadError: Error | null = null;

// Model asset - bundled with the app
const MODEL_ASSET = require("../../../assets/models/yolox_confidence_boost_epoch60.pte");

// Module instance
let execuTorchModule: any | null = null;
let isLoading = false;
let downloadProgress = 0;

/**
 * Try to load the react-native-executorch module
 */
function loadExecuTorchRuntime(): boolean {
  if (ExecutorchModuleClass) return true;
  if (etLoadError) return false;

  try {
    const executorch = require("react-native-executorch");
    ExecutorchModuleClass = executorch.ExecutorchModule;
    ScalarType = executorch.ScalarType;
    console.log("[ExecuTorch] Runtime loaded successfully");
    return true;
  } catch (error) {
    etLoadError = error as Error;
    console.error("[ExecuTorch] Failed to load runtime:", error);
    console.error(
      "[ExecuTorch] This requires a development build with New Architecture enabled"
    );
    return false;
  }
}

/**
 * Check if ExecuTorch runtime is available
 */
export function isExecuTorchRuntimeAvailable(): boolean {
  if (ExecutorchModuleClass) return true;
  if (etLoadError) return false;

  try {
    const executorch = require("react-native-executorch");
    ExecutorchModuleClass = executorch.ExecutorchModule;
    ScalarType = executorch.ScalarType;
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the ExecuTorch runtime load error if any
 */
export function getExecuTorchRuntimeError(): string | null {
  return etLoadError?.message || null;
}

/**
 * Get current download progress (0-100)
 */
export function getDownloadProgress(): number {
  return downloadProgress;
}

/**
 * Load the ExecuTorch model from app assets
 * @returns Promise<boolean> - true if model loaded successfully
 */
export async function loadModel(): Promise<boolean> {
  if (execuTorchModule) {
    return true; // Already loaded
  }

  if (isLoading) {
    // Wait for existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return execuTorchModule !== null;
  }

  isLoading = true;
  downloadProgress = 0;

  try {
    console.log("[ExecuTorch] Starting model load...");

    // First, try to load ExecuTorch runtime
    const runtimeLoaded = loadExecuTorchRuntime();
    if (!runtimeLoaded || !ExecutorchModuleClass) {
      throw new Error(
        "ExecuTorch Runtime not available. Please run a development build with New Architecture enabled.\n" +
          "Run: npx expo run:android"
      );
    }

    // Create new ExecutorchModule instance
    execuTorchModule = new ExecutorchModuleClass();

    console.log("[ExecuTorch] Loading model from asset...");

    // Load the model - the library handles asset resolution
    await execuTorchModule.load(MODEL_ASSET, (progress: number) => {
      downloadProgress = Math.round(progress * 100);
      console.log(`[ExecuTorch] Download progress: ${downloadProgress}%`);
    });

    downloadProgress = 100;
    console.log("[ExecuTorch] Model loaded successfully");

    isLoading = false;
    return true;
  } catch (error) {
    console.error("[ExecuTorch] Failed to load model:", error);
    execuTorchModule = null;
    isLoading = false;
    downloadProgress = 0;
    throw error;
  }
}

/**
 * Run inference on preprocessed image data
 * @param inputData - Float32Array of preprocessed image (1, 3, 640, 640)
 * @returns Promise with output tensor data
 */
export async function runInference(
  inputData: Float32Array
): Promise<{ data: Float32Array; dims: readonly number[] } | null> {
  if (!execuTorchModule) {
    console.error("[ExecuTorch] Model not loaded");
    return null;
  }

  try {
    const startTime = Date.now();

    // Create input tensor in the format expected by ExecutorchModule
    const inputTensor = {
      dataPtr: inputData,
      sizes: [
        1,
        3,
        DEFAULT_MODEL_CONFIG.inputWidth,
        DEFAULT_MODEL_CONFIG.inputHeight,
      ],
      scalarType: ScalarType?.FLOAT ?? 6, // FLOAT = 6
    };

    // Run forward pass
    const outputs = await execuTorchModule.forward([inputTensor]);

    const endTime = Date.now();
    console.log(`[ExecuTorch] Inference time: ${endTime - startTime}ms`);

    if (!outputs || outputs.length === 0) {
      console.error("[ExecuTorch] No output from model");
      return null;
    }

    // Extract output tensor
    const outputTensor = outputs[0];

    let outputData: Float32Array;
    let outputDims: readonly number[];

    if (outputTensor.dataPtr) {
      // TensorPtr format
      outputData =
        outputTensor.dataPtr instanceof Float32Array
          ? outputTensor.dataPtr
          : new Float32Array(outputTensor.dataPtr);
      outputDims = outputTensor.sizes || [1, 8400, 97];
    } else if (outputTensor instanceof Float32Array) {
      // Raw Float32Array
      outputData = outputTensor;
      outputDims = [1, 8400, 97];
    } else if (Array.isArray(outputTensor)) {
      // Nested array
      outputData = new Float32Array(outputTensor.flat(Infinity));
      outputDims = [1, 8400, 97];
    } else {
      // Try to convert
      outputData = new Float32Array(outputTensor);
      outputDims = [1, 8400, 97];
    }

    console.log(`[ExecuTorch] Output shape: [${outputDims.join(", ")}]`);

    return {
      data: outputData,
      dims: outputDims,
    };
  } catch (error) {
    console.error("[ExecuTorch] Inference error:", error);
    return null;
  }
}

/**
 * Check if model is loaded
 */
export function isModelLoaded(): boolean {
  return execuTorchModule !== null;
}

/**
 * Unload the model to free memory
 */
export function unloadModel(): void {
  if (execuTorchModule) {
    execuTorchModule = null;
    console.log("[ExecuTorch] Model unloaded");
  }
}

/**
 * Get model info
 */
export function getModelInfo(): {
  inputNames: readonly string[];
  outputNames: readonly string[];
} | null {
  if (!execuTorchModule) {
    return null;
  }

  return {
    inputNames: ["input"],
    outputNames: ["output"],
  };
}
