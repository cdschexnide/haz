import { SDDGInspectionContext } from "@/types/sddg";
import type { AggregatedAnalysis } from "@/ml/types/ocr";

/**
 * Workflow chevron types
 */
export type ChevronType = "sddg" | "package" | "complete";

/**
 * SDDG workflow step types
 */
export type SDDGStepType =
  | "upload"
  | "verification"
  | "declaration"
  | "compliance"
  | "frustration"
  | "capacitor-inspection";

/**
 * Reinspection mode types
 */
export type ReinspectionModeType = "sddg" | "package" | null;

/**
 * Reinspection state
 */
export interface ReinspectionState {
  mode: ReinspectionModeType;
  targetFrustrations: string[]; // Keys for SDDG, itemIds for Package
  sessionId: string | null;
  currentItemIndex: number;
  totalItems: number;
}

/**
 * SDDG Workflow state
 */
export interface SDDGWorkflowState {
  currentChevron: ChevronType;
  currentSDDGStep: SDDGStepType;
  currentSDDGScreen: string;
  completedSDDGSubsteps: string[];
  sddgComplete: boolean;
  packageComplete: boolean;
  reinspection: ReinspectionState;
}

/**
 * Complete inspection form state
 */
export interface InspectionFormState {
  // Current inspection session (in-memory only)
  currentInspection: SDDGInspectionContext;

  // Workflow tracking
  workflowState: SDDGWorkflowState;

  // UI state
  isProcessing: boolean;
  hasUnsavedChanges: boolean;
  lastSyncTime: Date | null;

  // Metadata
  inspector: string;
}

/**
 * Initial workflow state
 */
export const initialWorkflowState: SDDGWorkflowState = {
  currentChevron: "sddg",
  currentSDDGStep: "upload",
  currentSDDGScreen: "SDDGUploadAndParse",
  completedSDDGSubsteps: [],
  sddgComplete: false,
  packageComplete: false,
  reinspection: {
    mode: null,
    targetFrustrations: [],
    sessionId: null,
    currentItemIndex: 0,
    totalItems: 0,
  },
};

/**
 * Initial inspection context
 */
export const initialInspectionContext: SDDGInspectionContext = {
  extractedContent: null,
  verificationCopy: null,
  originalImageUri: null,
  frustrations: [],
  packageFrustrations: [],
  resolvedFrustrations: [],
  resolvedPackageFrustrations: [],
  magnetizedMaterialInspection: null,
  innerPackagingInspection: null,
  kitInspectionData: null,
  packagePopMarking: null,
  labelingContext: null,
  mlAnalysisResults: null,
  quantityType: "standard",
  exceptedQuantityData: null,
  limitedQuantityData: null,
  packagePackagingType: null,
  specialAuthorizationType: null,
  specialAuthorizationReference: null,
  specialAuthorizationAttested: false,
  specialAuthorizationPreloadedFromPreparer: false,
  coeAndCaaDocuments: {
    coeDocuments: [],
    caaDocuments: [],
  },
  dotSpWaivers: [],
  inspector: {
    inspectorName: "",
    inspectorRank: null,
    inspectorTitle: "",
  },
  inspectionStartTime: null,
  inspectionCompleteTime: null,
};

/**
 * Re-export AggregatedAnalysis for convenience
 */
export type { AggregatedAnalysis };
