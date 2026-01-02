import { AircraftType } from "@//types/dryIceInspection";

export const convertToLbs = (weight: number, unit: "kg" | "lbs"): number =>
  unit === "kg" ? weight * 2.20462 : weight;

export const calculateDryIceSafeLimit = (
  aircraftType: AircraftType,
  airChangesPerHour?: number
): number | undefined => {
  switch (aircraftType) {
    case "C130Other":
      return 600; // A13.10 reference A3.3.9.6.10.7
    case "AMCContract":
      return 440; // A13.10 reference A3.3.9.6.12
    case "NonPressurized":
      return Number.POSITIVE_INFINITY; // A13.10 reference A3.3.9.6.11
    default:
      // For pressurized aircraft, calculation would be based on Figure A3.6 or aircraft‑specific chart
      // For now, return undefined to indicate manual calculation required
      return undefined;
  }
};

export const isDryIceWithinSafeLimit = (
  weight: number,
  unit: "kg" | "lbs",
  safeLimit: number | undefined
): boolean => {
  if (!safeLimit || safeLimit === Number.POSITIVE_INFINITY) {
    return true;
  }

  const weightLbs = convertToLbs(weight, unit);
  return weightLbs <= safeLimit;
};

export const getSafeLimitDisplayText = (
  aircraftType: AircraftType,
  safeLimit: number | undefined
): string => {
  if (aircraftType === "NonPressurized") {
    return "No weight limit for non-pressurized aircraft";
  }

  if (safeLimit === undefined) {
    return `Calculate using Figure A3.6 or ${aircraftType}-specific chart`;
  }

  return `Maximum ${safeLimit} lbs for ${aircraftType}`;
};
