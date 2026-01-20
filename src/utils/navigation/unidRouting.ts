// src/utils/navigation/unidRouting.ts

/**
 * Maps UNIDs to their specialty screen routes.
 * These materials require additional preparation steps beyond standard flow.
 */
const UNID_ROUTE_MAP: Record<string, string> = {
  // Vehicles and engines
  'UN3166': 'UN3166FuelEntryScreen',
  'UN3171': 'BatteryPoweredVehicle',
  'UN3528': 'EnginesInternalCombustion',
  'UN3529': 'EnginesInternalCombustion',
  'UN3530': 'EnginesInternalCombustion',

  // Batteries
  'UN3090': 'LithiumBatteriesPrepScreen',
  'UN3091': 'LithiumBatteriesPrepScreen',
  'UN3480': 'LithiumBatteriesPrepScreen',
  'UN3481': 'LithiumBatteriesPrepScreen',

  // Capacitors
  'UN3499': 'Capacitors',
  'UN3508': 'Capacitors',

  // Special materials
  'UN1845': 'DryIcePrepScreen',
  'UN2807': 'MagnetizedMaterialPrepScreen',
  'UN3268': 'SafetyDevicesPreparationScreen',
  'UN3316': 'KitPreparationScreen',
  'UN3363': 'DangerousGoods',

  // Life-saving and biological
  'UN2990': 'LifeSavingAppliances',
  'UN3072': 'LifeSavingAppliances',
  'UN2814': 'GeneticallyModifiedOrganisms',
  'UN2900': 'GeneticallyModifiedOrganisms',
  'UN3245': 'GeneticallyModifiedOrganisms',
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
