import { ExtractedSDDGContent } from "@/types/sddg";
import { parseQuantityAndPacking } from "@/utils/sddgQuantityAndPackingParser";

export interface Key16Quantities {
  numberOfInnerPackages: number;
  quantityPerInnerPackage: { value: number; unit: "mL" | "g" };
  totalPerPackage: { value: number; unit: "mL" | "g" | "L" | "kg" };
  grossWeight?: { value: number; unit: "kg" };
  isInKit: boolean;
}

export const getKey16Quantities = (
  verificationCopy?: ExtractedSDDGContent | null
): Key16Quantities | undefined => {
  if (!verificationCopy) return undefined;

  const parsed = parseQuantityAndPacking(verificationCopy.quantityAndPacking);
  if (!parsed.quantityPerPackage && !parsed.totalQuantity) return undefined;

  const quantity = parsed.quantityPerPackage || parsed.totalQuantity;
  if (!quantity) return undefined;

  const toInner = () => {
    if (quantity.unit === "kg") {
      return { value: quantity.value * 1000, unit: "g" as const };
    }
    if (quantity.unit === "g") {
      return { value: quantity.value, unit: "g" as const };
    }
    if (quantity.unit === "l") {
      return { value: quantity.value * 1000, unit: "mL" as const };
    }
    return { value: quantity.value, unit: "mL" as const };
  };

  const toOuter = () => {
    if (quantity.unit === "kg") {
      return { value: quantity.value, unit: "kg" as const };
    }
    if (quantity.unit === "g") {
      return { value: quantity.value, unit: "g" as const };
    }
    if (quantity.unit === "l") {
      return { value: quantity.value, unit: "L" as const };
    }
    return { value: quantity.value, unit: "mL" as const };
  };

  const isInKit = /\bKIT\b/i.test(
    verificationCopy.properShippingName || ""
  );

  let grossWeight;
  if (parsed.isGrossWeight && (quantity.unit === "kg" || quantity.unit === "g")) {
    const grossValue =
      quantity.unit === "kg" ? quantity.value : quantity.value / 1000;
    grossWeight = { value: grossValue, unit: "kg" as const };
  }

  return {
    numberOfInnerPackages: parsed.packageCount || 1,
    quantityPerInnerPackage: toInner(),
    totalPerPackage: toOuter(),
    grossWeight,
    isInKit,
  };
};
