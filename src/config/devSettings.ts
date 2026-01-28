/**
 * Development settings for feature flags and debugging
 */

export type SDDGExtractionMethod = "anchor-based" | "manual-regions";

export interface DevSettings {
  /**
   * SDDG extraction method:
   * - "anchor-based": Automatic extraction using anchor detection (new)
   * - "manual-regions": Manual region adjustment screen (legacy)
   */
  sddgExtractionMethod: SDDGExtractionMethod;

  /**
   * Show debug overlay after extraction
   * Displays detected anchors and computed regions on the image
   */
  showExtractionDebugOverlay: boolean;
}

/**
 * Default dev settings
 * Change sddgExtractionMethod to "anchor-based" to enable new extraction
 */
export const DEFAULT_DEV_SETTINGS: DevSettings = {
  sddgExtractionMethod: "anchor-based", // New default
  showExtractionDebugOverlay: false,
};

// In-memory settings (can be persisted to AsyncStorage later)
let currentSettings: DevSettings = { ...DEFAULT_DEV_SETTINGS };

export function getDevSettings(): DevSettings {
  return { ...currentSettings };
}

export function updateDevSettings(updates: Partial<DevSettings>): void {
  currentSettings = { ...currentSettings, ...updates };
}

export function resetDevSettings(): void {
  currentSettings = { ...DEFAULT_DEV_SETTINGS };
}
