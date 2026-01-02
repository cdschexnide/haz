import {
  DryIceShipmentData,
  DryIceInspectionItem,
} from "@//types/dryIceInspection";
import {
  calculateDryIceSafeLimit,
  getSafeLimitDisplayText,
} from "./dryIceSafeLimits";

export const generateDryIceInspectionItems = (
  sddgQuantityPacking?: string
): DryIceInspectionItem[] => {
  return [
    {
      id: "kraft-paper-wrapping",
      category: "Packaging",
      label: "Kraft Paper Wrapping",
      description:
        "Verify the dry ice is wrapped in Kraft paper and secured with tape",
      requirement: "AFMAN 24-604 A13.10.2.1",
      verificationStatus: "unchecked",
      isRequired: true,
    },
    {
      id: "vented-container",
      category: "Packaging",
      label: "Vented Container Design",
      description:
        "Verify container permits CO2 gas release and prevents pressure buildup",
      requirement: "AFMAN 24-604 A13.10.2.1",
      verificationStatus: "unchecked",
      isRequired: true,
    },
    {
      id: "quantity-verification",
      category: "Documentation",
      label: "Quantity Verification (Key 16)",
      description: `Verify quantity matches what is shown on SDDG QUANTITY AND TYPE OF PACKING (Key 16)${
        sddgQuantityPacking ? `: ${sddgQuantityPacking}` : ""
      }`,
      requirement: "AFMAN 24-604 SDDG Key 16",
      verificationStatus: "unchecked",
      isRequired: true,
    },
  ];
};

export const getDefaultFrustrationMessage = (
  inspectionItemId: string
): string => {
  const frustrationMessages: Record<string, string> = {
    "kraft-paper-wrapping":
      "Dry ice not properly wrapped in kraft paper or not secured with tape",
    "vented-container":
      "Container does not permit proper CO2 gas release or may allow pressure buildup",
    "quantity-verification":
      "Quantity does not match what is shown on SDDG QUANTITY AND TYPE OF PACKING (Key 16)",
  };

  return (
    frustrationMessages[inspectionItemId] || "Failed inspection requirement"
  );
};
