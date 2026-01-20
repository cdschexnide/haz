// src/utils/navigation/unidRouting.ts

/**
 * Maps UNIDs to their specialty screen routes.
 * These materials require additional preparation steps beyond standard flow.
 */
const UNID_ROUTE_MAP: Record<string, string> = {
  'UN3166': 'UN3166FuelEntryScreen',
  'UN2807': 'MagnetizedMaterialPrepScreen',
  'UN1845': 'DryIcePrepScreen',
  'UN3090': 'LithiumBatteriesPrepScreen',
  'UN3091': 'LithiumBatteriesPrepScreen',
  'UN3480': 'LithiumBatteriesPrepScreen',
  'UN3481': 'LithiumBatteriesPrepScreen',
  'UN3529': 'EnginesInternalCombustion',
  'UN3171': 'BatteryPoweredVehicle',
  'UN3072': 'LifeSavingAppliances',
  'UN2990': 'LifeSavingAppliances',
  'UN3316': 'KitPreparationScreen',
  'UN3268': 'SafetyDevicesPreparationScreen',
};

/**
 * List of all UNIDs that have specialty screens.
 */
export const SPECIALTY_UNIDS = Object.keys(UNID_ROUTE_MAP);

/**
 * Returns the specialty screen route for a UNID, or null if none exists.
 */
export const getSpecialtyRoute = (unid: string): string | null => {
  return UNID_ROUTE_MAP[unid] || null;
};

/**
 * Returns the specialty route for a UNID, or the default route if none exists.
 */
export const getNextRoute = (unid: string, defaultRoute: string): string => {
  return UNID_ROUTE_MAP[unid] || defaultRoute;
};

/**
 * Checks if a UNID requires a specialty screen.
 */
export const hasSpecialtyScreen = (unid: string): boolean => {
  return unid in UNID_ROUTE_MAP;
};
