type LithiumBatteryData = {
  batteryType: "lithium_metal" | "lithium_metal_equipment";
  packagingMethod: string;
  outerPackagingType: string;
  innerPackagingDescription: string;
  quantityOfBatteries: number;
  totalWeight: { value: number; unit: "kg" | "lb" };
  safetyFeatures: {
    shortCircuitProtection: boolean;
    safetyVent: boolean;
    reverseCurrentProtection: boolean;
  };
  meetsUN38Requirements: boolean;
  isDefectiveOrDamaged: boolean;
  specialInstructions: string;
  handlingInstructions: string;
  wattHourRating: number;
  lithiumContentInGrams: number;
};

const kgFromTotalWeight = (weight: { value: number; unit: "kg" | "lb" }) =>
  weight.unit === "kg" ? weight.value : weight.value * 0.45359237;

export const buildLithiumBatteryKey16 = (
  data: LithiumBatteryData | undefined,
  packageCount = 1
): string => {
  const kg = data ? kgFromTotalWeight(data.totalWeight).toFixed(2) : undefined;
  const pkgWord =
    packageCount === 1
      ? data?.outerPackagingType
      : `${data?.outerPackagingType}s`;
  return `${packageCount} ${pkgWord} x ${kg} kg`;
};
