import { ExtractedSDDGContent } from "@/types/sddg";
import { FrustrationRecord, PackageFrustrationRecord } from "@/types/sddg";
import { AggregatedAnalysis } from "@/ml/types/ocr";
import { PackagingTypeSelection } from "@/utils/getAllowedPackagingTypes";

/**
 * Creates a mock inspection form context value for use with jest.mock.
 *
 * Usage in test files:
 *
 * ```typescript
 * const mockContext = createMockInspectionContext({ verificationCopy: sddgData });
 * jest.mock("@/contexts/InspectionFormProvider", () => ({
 *   useInspectionForm: () => mockContext,
 * }));
 * ```
 */
export interface MockInspectionOverrides {
  verificationCopy?: ExtractedSDDGContent | null;
  extractedContent?: ExtractedSDDGContent | null;
  frustrations?: FrustrationRecord[];
  packageFrustrations?: PackageFrustrationRecord[];
  resolvedFrustrations?: FrustrationRecord[];
  resolvedPackageFrustrations?: PackageFrustrationRecord[];
  mlAnalysisResults?: AggregatedAnalysis | null;
  packagePackagingType?: PackagingTypeSelection | null;
  originalImageUri?: string;
  quantityType?: "standard" | "excepted" | "limited";
  sddgComplete?: boolean;
  packageComplete?: boolean;
  currentChevron?: "sddg" | "package" | "complete";
  reinspectionMode?: "sddg" | "package" | null;
}

export function createMockInspectionContext(
  overrides: MockInspectionOverrides = {}
) {
  const inspection = {
    extractedContent: overrides.extractedContent ?? overrides.verificationCopy ?? null,
    verificationCopy: overrides.verificationCopy ?? null,
    originalImageUri: overrides.originalImageUri ?? "file:///test-image.jpg",
    frustrations: overrides.frustrations ?? [],
    packageFrustrations: overrides.packageFrustrations ?? [],
    resolvedFrustrations: overrides.resolvedFrustrations ?? [],
    resolvedPackageFrustrations: overrides.resolvedPackageFrustrations ?? [],
    magnetizedMaterialInspection: null,
    innerPackagingInspection: null,
    kitInspectionData: null,
    packagePopMarking: null,
    labelingContext: null,
    mlAnalysisResults: overrides.mlAnalysisResults ?? null,
    quantityType: overrides.quantityType ?? "standard",
    exceptedQuantityData: null,
    limitedQuantityData: null,
    packagePackagingType: overrides.packagePackagingType ?? null,
    inspector: {
      inspectorName: "TEST INSPECTOR",
      inspectorRank: "SGT",
      inspectorTitle: "Hazmat Inspector",
    },
    inspectionStartTime: new Date(),
    inspectionCompleteTime: null,
  };

  const workflow = {
    currentChevron: overrides.currentChevron ?? "sddg",
    currentSDDGStep: "verification",
    currentSDDGScreen: "InteractiveSDDGComplianceScreen",
    completedSDDGSubsteps: [],
    sddgComplete: overrides.sddgComplete ?? false,
    packageComplete: overrides.packageComplete ?? false,
    reinspection: {
      mode: overrides.reinspectionMode ?? null,
      targetFrustrations: [],
      sessionId: null,
      currentItemIndex: 0,
      totalItems: 0,
    },
  };

  return {
    inspection,
    workflow,
    isProcessing: false,
    hasUnsavedChanges: false,
    inspectionId: "test-inspection-id",

    // Inspection lifecycle
    startNewInspection: jest.fn(),
    loadInspectionForEdit: jest.fn().mockResolvedValue(undefined),
    saveCurrentInspection: jest.fn().mockResolvedValue("test-id"),
    completeInspection: jest.fn().mockResolvedValue({ success: true }),
    finalizeInspection: jest.fn().mockResolvedValue({ success: true }),
    cancelInspection: jest.fn(),
    updateReinspectedInspection: jest.fn().mockResolvedValue({
      success: true,
      allResolved: true,
      sddgStatus: "verified",
    }),

    // SDDG data
    setExtractedSDDGContent: jest.fn(),
    setVerificationCopy: jest.fn(),
    updateVerificationField: jest.fn(),

    // Frustrations
    addFrustration: jest.fn(),
    removeFrustration: jest.fn(),
    addPackageFrustration: jest.fn(),
    removePackageFrustration: jest.fn(),

    // Workflow
    setCurrentChevron: jest.fn(),
    setCurrentSDDGStep: jest.fn(),
    setCurrentSDDGScreen: jest.fn(),
    completeSDDGSubstep: jest.fn(),
    setSDDGComplete: jest.fn(),
    setPackageComplete: jest.fn(),
    completeSDDGAndMoveToPackage: jest.fn(),
    resetWorkflow: jest.fn(),

    // Reinspection
    startSDDGReinspection: jest.fn(),
    startPackageReinspection: jest.fn(),
    resolvePackageFrustration: jest.fn(),
    refrustratePackageFrustration: jest.fn(),
    advanceReinspectionItem: jest.fn(),
    completeReinspection: jest.fn(),

    // Special data
    setMagnetizedMaterialInspection: jest.fn(),
    updateMagnetizedMaterialField: jest.fn(),
    clearMagnetizedMaterialInspection: jest.fn(),
    setInnerPackagingInspection: jest.fn(),
    updateInnerPackagingField: jest.fn(),
    updateInnerPackagingInspectionItem: jest.fn(),
    clearInnerPackagingInspection: jest.fn(),
    setKitInspectionData: jest.fn(),
    setLabelingContext: jest.fn(),
    updateLabelingContextField: jest.fn(),

    // POP marking
    setPackagePopMarking: jest.fn(),
    updatePackagePopField: jest.fn(),
    resetPackagePopMarking: jest.fn(),

    // ML results
    setMLAnalysisResults: jest.fn(),

    // Quantity
    setQuantityType: jest.fn(),
    setExceptedQuantityData: jest.fn(),
    setLimitedQuantityData: jest.fn(),
    setPackagePackagingType: jest.fn(),

    // Inspector
    setInspector: jest.fn(),
  };
}
