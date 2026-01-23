import { parseQuantityAndPacking } from "@/utils/sddgQuantityAndPackingParser";

export type PackagingTypeSelection = "single" | "combination" | "composite";

export const getPackagingTypeFromKey16 = (
  quantityAndPacking: string | null | undefined
): PackagingTypeSelection | null => {
  const parsed = parseQuantityAndPacking(quantityAndPacking);
  if (!parsed.packagingCode) return null;

  const code = parsed.packagingCode.toUpperCase();

  // UN packaging codes starting with 1-5 are single packagings; 6 are composite.
  if (/^[1-5]/.test(code)) return "single";
  if (/^6/.test(code)) return "composite";

  return null;
};
