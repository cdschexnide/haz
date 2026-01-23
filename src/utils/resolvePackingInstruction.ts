import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";

const getPrimaryParagraph = (paragraphValue: string): string => {
  if (!paragraphValue) {
    return "";
  }
  return paragraphValue.split(/[,:]/)[0]?.trim() || "";
};

export const resolvePackingInstruction = (
  unIdNo?: string,
  fallback?: string
): string => {
  const hazmatParagraph = hazardousMaterialsList.find(
    material => material.unid === (unIdNo || "").toUpperCase()
  )?.packagingParagraph;

  const resolved =
    hazmatParagraph && hazmatParagraph.toUpperCase() !== "FORBIDDEN"
      ? hazmatParagraph
      : fallback || "";

  return getPrimaryParagraph(resolved).toUpperCase();
};
