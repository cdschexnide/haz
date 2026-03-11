/**
 * ExecuTorch Runtime service for YOLOX model loading and inference
 * Uses react-native-executorch for on-device ML inference
 */

import { DEFAULT_MODEL_CONFIG } from "../types";

// Lazy-loaded ExecuTorch module class
let ExecutorchModuleClass: any = null;
let ScalarType: any = null;
let etLoadError: Error | null = null;
let runtimeAvailability: boolean | null = null;

// Model asset - bundled with the app
// const MODEL_ASSET = require("../../../assets/models/yolox_confidence_boost_epoch60.pte");
const MODEL_ASSET = require("../../../assets/models/yolox_msl_finetune_epoch60.pte");

// Module instance
let execuTorchModule: any | null = null;
let isLoading = false;
let downloadProgress = 0;

/**
 * Normalize unknown runtime errors to a stable Error shape.
 */
function normalizeRuntimeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

/**
 * Store runtime unavailability details and keep runtime globals clean.
 */
function markRuntimeUnavailable(error: unknown): boolean {
  const normalizedError = normalizeRuntimeError(error);
  runtimeAvailability = false;
  etLoadError = normalizedError;
  ExecutorchModuleClass = null;
  ScalarType = null;
  return false;
}

/**
 * Returns a user-readable runtime error message.
 */
function getFriendlyRuntimeMessage(error: Error): string {
  const message = error.message || "Unknown ExecuTorch runtime error";
  if (message.includes("libexecutorch.so")) {
    return (
      "ExecuTorch native library not found (libexecutorch.so). " +
      "Build/install an arm64 development build (npx expo run:android) " +
      "or disable ML detection on this build."
    );
  }
  return message;
}

/**
 * Try to load and verify the react-native-executorch runtime.
 */
function ensureExecuTorchRuntimeAvailable(): boolean {
  if (runtimeAvailability === true && ExecutorchModuleClass) return true;
  if (runtimeAvailability === false) return false;

  try {
    const executorch = require("react-native-executorch");
    const RuntimeModule = executorch?.ExecutorchModule;
    const RuntimeScalarType = executorch?.ScalarType;

    if (!RuntimeModule) {
      throw new Error("react-native-executorch loaded, but ExecutorchModule is missing");
    }

    // Probe constructor once so missing native libraries fail here, not later.
    const probeInstance = new RuntimeModule();
    if (probeInstance?.destroy && typeof probeInstance.destroy === "function") {
      probeInstance.destroy();
    }

    ExecutorchModuleClass = RuntimeModule;
    ScalarType = RuntimeScalarType;
    runtimeAvailability = true;
    etLoadError = null;
    console.log("[ExecuTorch] Runtime loaded successfully");
    return true;
  } catch (error) {
    const normalizedError = normalizeRuntimeError(error);
    const friendlyMessage = getFriendlyRuntimeMessage(normalizedError);
    markRuntimeUnavailable(new Error(friendlyMessage));
    console.warn(`[ExecuTorch] Runtime unavailable: ${friendlyMessage}`);
    return false;
  }
}

/**
 * Check if ExecuTorch runtime is available
 */
export function isExecuTorchRuntimeAvailable(): boolean {
  return ensureExecuTorchRuntimeAvailable();
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
    const runtimeLoaded = ensureExecuTorchRuntimeAvailable();
    if (!runtimeLoaded || !ExecutorchModuleClass) {
      isLoading = false;
      downloadProgress = 0;
      return false;
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
    const normalizedError = normalizeRuntimeError(error);
    const friendlyMessage = getFriendlyRuntimeMessage(normalizedError);
    etLoadError = new Error(friendlyMessage);
    runtimeAvailability = false;
    console.warn(`[ExecuTorch] Failed to load model: ${friendlyMessage}`);
    execuTorchModule = null;
    isLoading = false;
    downloadProgress = 0;
    return false;
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
    console.warn("[ExecuTorch] Model not loaded");
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
      console.warn("[ExecuTorch] No output from model");
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
    console.warn(`[ExecuTorch] Inference error: ${String(error)}`);
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
