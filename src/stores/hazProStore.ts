import { proxy, subscribe } from "valtio";
import {
  HazProPreparerContext,
  initialHazProPreparerContext,
} from "../../src/contexts/HazProPreparerProvider/reducer";
import { ShipmentMetadata } from "../../src/services/shipment/ShipmentDatabase";
import { SDDGInspectionContext } from "../../src/types/sddg";
import {
  SDDGWorkflowState,
  initialWorkflowState,
  initialInspectionContext,
} from "../../src/contexts/InspectionFormProvider/types";

export type ChevronType = "sddg" | "package" | "complete";
export type SDDGStepType =
  | "upload"
  | "verification"
  | "declaration"
  | "compliance"
  | "frustration"
  | "capacitor-inspection";

export interface HazProState {
  hazProPreparerContext: HazProPreparerContext;
  shipmentsIndex: Record<string, ShipmentMetadata>;
  isLoadingShipments: boolean;
  loadingShipmentId?: string;
  loadingInspectionId?: string;
  databaseError: string | null;
  sddgWorkflow: SDDGWorkflowState;
  sddgInspectionContext: SDDGInspectionContext;
}

// proxy state with initial values
export const hazProStore = proxy<HazProState>({
  hazProPreparerContext: initialHazProPreparerContext,
  shipmentsIndex: {},
  isLoadingShipments: false,
  loadingShipmentId: undefined,
  loadingInspectionId: undefined,
  databaseError: null,
  sddgWorkflow: initialWorkflowState,
  sddgInspectionContext: initialInspectionContext,
});

// Enable Redux DevTools in development
if (process.env.NODE_ENV === "development") {
  import("valtio/utils").then(({ devtools }) => {
    devtools(hazProStore, { name: "HazProStore" });
  });
}

if (process.env.NODE_ENV === "development") {
  subscribe(hazProStore, () => {
    // console.log('[HazProStore] State updated:', hazProStore);
  });
}

// Export types for use in components
export type HazProSnapshot = typeof hazProStore;
