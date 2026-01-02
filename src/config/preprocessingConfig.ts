/**
 * Image Preprocessing Configuration
 *
 * Defines preprocessing settings for OCR accuracy enhancement.
 * All preprocessing is done in pure JavaScript/TypeScript without native libraries.
 */

export type IntensityLevel = "low" | "medium" | "high";
export type PresetMode = "speed" | "balanced" | "quality";

export interface PreprocessingConfig {
  /** Master toggle for all preprocessing */
  enabled: boolean;

  /** Full-image preprocessing (applied once per form) */
  fullImage: {
    /** Enhance contrast using CLAHE-like algorithm */
    enhanceContrast: boolean;
    /** Normalize brightness using gamma correction */
    normalizeBrightness: boolean;
    /** Apply sharpening to reduce blur */
    sharpen: boolean;
    /** Preprocessing intensity (affects quality vs speed) */
    intensity: IntensityLevel;
  };

  /** Per-region preprocessing (applied to each field before OCR) */
  perRegion: {
    /** Enhance contrast for text regions */
    enhanceContrast: boolean;
    /** Apply sharpening to text regions */
    sharpen: boolean;
    /** Detect blur and skip/warn if too blurry */
    detectBlur: boolean;
    /** Use adaptive padding based on field type */
    adaptivePadding: boolean;
    /** Preprocessing intensity */
    intensity: IntensityLevel;
  };

  /** Performance optimization settings */
  performance: {
    /** Cache preprocessed full image to avoid reprocessing */
    cachePreprocessed: boolean;
    /** Maximum time allowed for preprocessing (ms) */
    maxProcessingTime: number;
    /** Skip preprocessing if image already appears good */
    skipIfGoodQuality: boolean;
  };

  /** Algorithm parameters (advanced tuning) */
  parameters: {
    contrast: {
      /** CLAHE tile size (4 = faster, 8 = better quality) */
      tileSize: number;
      /** Clip limit for histogram equalization (1.0-4.0) */
      clipLimit: number;
      /** Minimum contrast improvement to apply (0-1) */
      minImprovement: number;
    };
    brightness: {
      /** Target brightness level (0-255, 127 = middle gray) */
      targetBrightness: number;
      /** Maximum gamma correction factor */
      maxGamma: number;
      /** Minimum gamma correction factor */
      minGamma: number;
    };
    sharpening: {
      /** Sharpening amount (1.0-3.0) */
      amount: number;
      /** Gaussian blur radius for unsharp mask */
      radius: number;
      /** Threshold to avoid amplifying noise */
      threshold: number;
    };
    blur: {
      /** Laplacian variance threshold (below = blurry) */
      blurThreshold: number;
      /** Maximum blur score to attempt OCR (0-1) */
      maxAcceptableBlur: number;
      /** Enable adaptive sharpening based on blur level */
      adaptiveSharpen: boolean;
    };
    padding: {
      /** Base padding for all regions (pixels) */
      basePadding: number;
      /** Additional padding for small fields */
      smallFieldExtra: number;
      /** Additional padding for large fields */
      largeFieldExtra: number;
    };
  };
}

/**
 * Default preprocessing configuration (balanced preset)
 */
export const DEFAULT_PREPROCESSING_CONFIG: PreprocessingConfig = {
  enabled: true,

  fullImage: {
    enhanceContrast: true,
    normalizeBrightness: true,
    sharpen: true,
    intensity: "medium",
  },

  perRegion: {
    enhanceContrast: true,
    sharpen: true,
    detectBlur: true,
    adaptivePadding: true,
    intensity: "medium",
  },

  performance: {
    cachePreprocessed: true,
    maxProcessingTime: 8000, // 8 seconds max additional time
    skipIfGoodQuality: true,
  },

  parameters: {
    contrast: {
      tileSize: 4, // 4x4 tiles for speed
      clipLimit: 2.0,
      minImprovement: 0.1,
    },
    brightness: {
      targetBrightness: 127,
      maxGamma: 2.5,
      minGamma: 0.4,
    },
    sharpening: {
      amount: 1.5,
      radius: 1.0,
      threshold: 0.05,
    },
    blur: {
      blurThreshold: 100,
      maxAcceptableBlur: 0.8,
      adaptiveSharpen: true,
    },
    padding: {
      basePadding: 10,
      smallFieldExtra: 5,
      largeFieldExtra: 0,
    },
  },
};

/**
 * Speed-optimized preset (faster processing, lower quality)
 */
export const SPEED_PRESET: Partial<PreprocessingConfig> = {
  fullImage: {
    enhanceContrast: true,
    normalizeBrightness: true,
    sharpen: false, // Skip sharpening for speed
    intensity: "low",
  },
  perRegion: {
    enhanceContrast: false, // Skip per-region contrast
    sharpen: true, // Only sharpen
    detectBlur: false,
    adaptivePadding: true,
    intensity: "low",
  },
};

/**
 * Quality-optimized preset (slower processing, best accuracy)
 */
export const QUALITY_PRESET: Partial<PreprocessingConfig> = {
  fullImage: {
    enhanceContrast: true,
    normalizeBrightness: true,
    sharpen: true,
    intensity: "high",
  },
  perRegion: {
    enhanceContrast: true,
    sharpen: true,
    detectBlur: true,
    adaptivePadding: true,
    intensity: "high",
  },
};

/**
 * Get preset configuration
 */
export function getPresetConfig(preset: PresetMode): PreprocessingConfig {
  const base = { ...DEFAULT_PREPROCESSING_CONFIG };

  switch (preset) {
    case "speed":
      return { ...base, ...SPEED_PRESET };
    case "quality":
      return { ...base, ...QUALITY_PRESET };
    case "balanced":
    default:
      return base;
  }
}

/**
 * Merge custom config with defaults
 */
export function mergeConfig(
  custom: Partial<PreprocessingConfig>
): PreprocessingConfig {
  return {
    ...DEFAULT_PREPROCESSING_CONFIG,
    ...custom,
    fullImage: {
      ...DEFAULT_PREPROCESSING_CONFIG.fullImage,
      ...custom.fullImage,
    },
    perRegion: {
      ...DEFAULT_PREPROCESSING_CONFIG.perRegion,
      ...custom.perRegion,
    },
    performance: {
      ...DEFAULT_PREPROCESSING_CONFIG.performance,
      ...custom.performance,
    },
    parameters: {
      contrast: {
        ...DEFAULT_PREPROCESSING_CONFIG.parameters.contrast,
        ...custom.parameters?.contrast,
      },
      brightness: {
        ...DEFAULT_PREPROCESSING_CONFIG.parameters.brightness,
        ...custom.parameters?.brightness,
      },
      sharpening: {
        ...DEFAULT_PREPROCESSING_CONFIG.parameters.sharpening,
        ...custom.parameters?.sharpening,
      },
      blur: {
        ...DEFAULT_PREPROCESSING_CONFIG.parameters.blur,
        ...custom.parameters?.blur,
      },
      padding: {
        ...DEFAULT_PREPROCESSING_CONFIG.parameters.padding,
        ...custom.parameters?.padding,
      },
    },
  };
}
