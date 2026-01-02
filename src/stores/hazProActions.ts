import { hazProStore, ChevronType, SDDGStepType } from "./hazProStore";
import ShipmentDatabase from "../../src/services/shipment/ShipmentDatabase";
import DatabaseInitializer from "../../src/services/shipment/DatabaseInitializer";
import ErrorHandlingService from "../../src/services/shipment/ErrorHandlingService";
import {
  HazProPreparerContext,
  SavedShipment,
  initialHazProPreparerContext,
} from "../../src/contexts/HazProPreparerProvider/reducer";
import { ShipmentMetadata } from "../../src/services/shipment/ShipmentDatabase";
import {
  HazardousMaterialItem,
  Inspector,
  ExceptedQuantityData,
  LimitedQuantityData
} from "../../types";
import {
  ExtractedSDDGContent,
  FrustrationRecord,
  PackageFrustrationRecord,
  InspectorMagnetizedMaterialData,
  InspectorShipment,
} from "../../src/types/sddg";
import InspectorShipmentDatabase from "../../src/services/inspection/InspectorShipmentDatabase";
import { mockInspectorShipments } from "../../src/data/mockInspectorShipments";
import {
  evaluateMarkingRequirements,
  RequiredMarking,
} from "../../src/utils/markingRequirements";
import {
  evaluateLabelingRequirements,
  RequiredLabel,
} from "../../src/utils/labelingRequirements";

// Type-safe actions for state mutations
export const hazProActions = {
  // Field update actions with full type safety
  updateHazardousMaterial(material: HazardousMaterialItem | null) {
    hazProStore.hazProPreparerContext.hazardousMaterial = material;
  },

  updatePackaging(updates: Partial<HazProPreparerContext["packaging"]>) {
    if (hazProStore.hazProPreparerContext.packaging) {
      Object.assign(hazProStore.hazProPreparerContext.packaging, updates);
    }
  },

  updatePOPMarking<
    K extends keyof NonNullable<
      HazProPreparerContext["packaging"]
    >["inputPOPMarking"]
  >(
    field: K,
    value: NonNullable<HazProPreparerContext["packaging"]>["inputPOPMarking"][K]
  ) {
    if (hazProStore.hazProPreparerContext.packaging?.inputPOPMarking) {
      hazProStore.hazProPreparerContext.packaging.inputPOPMarking[field] =
        value;
    }
  },

  updateShipment(
    updates: Partial<NonNullable<HazProPreparerContext["shipment"]>>
  ) {
    if (hazProStore.hazProPreparerContext.shipment) {
      Object.assign(hazProStore.hazProPreparerContext.shipment, updates);
    }
  },

  updateShipper(
    updates: Partial<NonNullable<HazProPreparerContext["shipper"]>>
  ) {
    if (hazProStore.hazProPreparerContext.shipper) {
      Object.assign(hazProStore.hazProPreparerContext.shipper, updates);
    }
  },

  updateConsignee(
    updates: Partial<NonNullable<HazProPreparerContext["consignee"]>>
  ) {
    if (hazProStore.hazProPreparerContext.consignee) {
      Object.assign(hazProStore.hazProPreparerContext.consignee, updates);
    }
  },

  updatePreparer(
    updates: Partial<NonNullable<HazProPreparerContext["preparer"]>>
  ) {
    if (!hazProStore.hazProPreparerContext.preparer) {
      hazProStore.hazProPreparerContext.preparer = {
        preparerName: null,
        preparerRank: null,
        preparerTitle: null,
        certificationPlace: null,
        certificationDate: null,
        signature: null,
      };
    }
    Object.assign(hazProStore.hazProPreparerContext.preparer, updates);
  },

  // Complex nested updates with type safety
  updateNestedPackagingField<
    K1 extends keyof NonNullable<HazProPreparerContext["packaging"]>,
    K2 extends keyof NonNullable<HazProPreparerContext["packaging"]>[K1]
  >(
    field1: K1,
    field2: K2,
    value: NonNullable<HazProPreparerContext["packaging"]>[K1][K2]
  ) {
    if (hazProStore.hazProPreparerContext.packaging) {
      (hazProStore.hazProPreparerContext.packaging[field1] as any)[field2] =
        value;
    }
  },

  // Step management
  setActiveStep(step: number | null) {
    hazProStore.hazProPreparerContext.activeStep = step;
  },

  setActiveSubstep(substep: number | null) {
    hazProStore.hazProPreparerContext.activeSubstep = substep;
  },

  completeSubstep(substep: string) {
    if (
      !hazProStore.hazProPreparerContext.completedSubsteps.includes(substep)
    ) {
      hazProStore.hazProPreparerContext.completedSubsteps.push(substep);
    }
  },

  // Excepted and Limited Quantities Management
  updateExceptedQuantityData(data: Partial<ExceptedQuantityData>) {
    if (hazProStore.hazProPreparerContext.exceptedQuantityData) {
      Object.assign(hazProStore.hazProPreparerContext.exceptedQuantityData, data);
    } else {
      hazProStore.hazProPreparerContext.exceptedQuantityData = data as ExceptedQuantityData;
    }
  },

  clearExceptedQuantityData() {
    hazProStore.hazProPreparerContext.exceptedQuantityData = undefined;
  },

  updateLimitedQuantityData(data: Partial<LimitedQuantityData>) {
    if (hazProStore.hazProPreparerContext.limitedQuantityData) {
      Object.assign(hazProStore.hazProPreparerContext.limitedQuantityData, data);
    } else {
      hazProStore.hazProPreparerContext.limitedQuantityData = data as LimitedQuantityData;
    }
  },

  clearLimitedQuantityData() {
    hazProStore.hazProPreparerContext.limitedQuantityData = undefined;
  },

  setIsExceptedQuantity(value: boolean) {
    hazProStore.hazProPreparerContext.isExceptedQuantity = value;
    if (!value) {
      hazProActions.clearExceptedQuantityData();
    }
  },

  setIsLimitedQuantity(value: boolean) {
    hazProStore.hazProPreparerContext.isLimitedQuantity = value;
    if (!value) {
      hazProActions.clearLimitedQuantityData();
    }
  },

  clearExceptedLimitedQuantityData() {
    hazProStore.hazProPreparerContext.isExceptedQuantity = false;
    hazProStore.hazProPreparerContext.isLimitedQuantity = false;
    hazProActions.clearExceptedQuantityData();
    hazProActions.clearLimitedQuantityData();
  },

  // Database initialization and operations
  async initializeDatabase() {
    hazProStore.isLoadingShipments = true;
    hazProStore.databaseError = null;

    try {
      await DatabaseInitializer.initializeWithMockData();
      await hazProActions.refreshShipmentsIndex();
      await ErrorHandlingService.logError(
        "HazProActions",
        "initializeDatabase",
        "Database initialized successfully with mock data",
        "info"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initialize database";
      hazProStore.databaseError = errorMessage;
      await ErrorHandlingService.logError(
        "HazProActions",
        "initializeDatabase",
        error,
        "error"
      );
      throw error;
    } finally {
      hazProStore.isLoadingShipments = false;
    }
  },

  async clearAndReinitializeDatabase() {
    hazProStore.isLoadingShipments = true;
    hazProStore.databaseError = null;

    try {
      await DatabaseInitializer.clearAndReinitialize();
      await hazProActions.refreshShipmentsIndex();
      await ErrorHandlingService.logError(
        "HazProActions",
        "clearAndReinitializeDatabase",
        "Database cleared and reinitialized successfully",
        "info"
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to clear and reinitialize database";
      hazProStore.databaseError = errorMessage;
      await ErrorHandlingService.logError(
        "HazProActions",
        "clearAndReinitializeDatabase",
        error,
        "error"
      );
      throw error;
    } finally {
      hazProStore.isLoadingShipments = false;
    }
  },

  async saveCurrentShipment(status: "in-progress" | "completed", id?: string) {
    hazProStore.isLoadingShipments = true;
    hazProStore.databaseError = null;

    try {
      const shipment: SavedShipment = {
        id: id || Date.now().toString(),
        status,
        savedAt: new Date(),
        hazProPreparerContext: hazProStore.hazProPreparerContext,
      };

      await ShipmentDatabase.saveShipment(shipment);
      await ErrorHandlingService.logError(
        "HazProActions",
        "saveShipment",
        `Shipment saved successfully (${status})`,
        "info"
      );

      // Update shipments index
      await hazProActions.refreshShipmentsIndex();

      // Reset context if completed
      if (status === "completed") {
        hazProActions.resetContext();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save shipment";
      hazProStore.databaseError = errorMessage;
      await ErrorHandlingService.logError(
        "HazProActions",
        "saveShipment",
        error,
        "error"
      );

      // Attempt recovery
      const recovered = await ErrorHandlingService.attemptRecovery(
        error,
        "HazProActions",
        "saveShipment"
      );
      if (!recovered) {
        throw error;
      }
    } finally {
      hazProStore.isLoadingShipments = false;
    }
  },

  async loadShipment(shipmentId: string) {
    hazProStore.isLoadingShipments = true;
    hazProStore.loadingShipmentId = shipmentId;
    hazProStore.databaseError = null;

    try {
      const shipmentFile = await ShipmentDatabase.loadShipment(shipmentId);

      if (shipmentFile) {
        // Replace entire context with loaded data
        hazProStore.hazProPreparerContext = {
          ...shipmentFile.hazProPreparerContext,
          currentShipmentId: shipmentId,
        };
        await ErrorHandlingService.logError(
          "HazProActions",
          "loadShipment",
          `Shipment ${shipmentId} loaded successfully`,
          "info"
        );
      } else {
        const error = `Shipment ${shipmentId} not found`;
        hazProStore.databaseError = error;
        await ErrorHandlingService.logError(
          "HazProActions",
          "loadShipment",
          error,
          "warning"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load shipment";
      hazProStore.databaseError = errorMessage;
      await ErrorHandlingService.logError(
        "HazProActions",
        "loadShipment",
        error,
        "error"
      );
    } finally {
      hazProStore.isLoadingShipments = false;
      hazProStore.loadingShipmentId = undefined;
    }
  },

  async deleteShipment(shipmentId: string) {
    hazProStore.isLoadingShipments = true;
    hazProStore.databaseError = null;

    try {
      await ShipmentDatabase.deleteShipment(shipmentId);
      await ErrorHandlingService.logError(
        "HazProActions",
        "deleteShipment",
        `Shipment ${shipmentId} deleted successfully`,
        "info"
      );

      // Update shipments index
      await hazProActions.refreshShipmentsIndex();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete shipment";
      hazProStore.databaseError = errorMessage;
      await ErrorHandlingService.logError(
        "HazProActions",
        "deleteShipment",
        error,
        "error"
      );
    } finally {
      hazProStore.isLoadingShipments = false;
    }
  },

  async refreshShipmentsIndex() {
    try {
      const shipments = await ShipmentDatabase.listShipments();
      hazProStore.shipmentsIndex = shipments;
    } catch (error) {
      console.error("Failed to refresh shipments index:", error);
    }
  },

  // Context management
  resetContext() {
    hazProStore.hazProPreparerContext = initialHazProPreparerContext;
  },

  clearDatabaseError() {
    hazProStore.databaseError = null;
  },

  // Batch updates
  batchUpdate(updates: () => void) {
    // Valtio automatically batches updates in the same tick
    updates();
  },

  // Complex state updates
  updateLithiumBatteryData(
    updates: Partial<NonNullable<HazProPreparerContext["lithiumBatteryData"]>>
  ) {
    if (!hazProStore.hazProPreparerContext.lithiumBatteryData) {
      hazProStore.hazProPreparerContext.lithiumBatteryData = {} as any;
    }
    Object.assign(
      hazProStore.hazProPreparerContext.lithiumBatteryData,
      updates
    );
  },

  updateUN3166Details(
    updates: Partial<HazProPreparerContext["un3166Details"]>
  ) {
    Object.assign(hazProStore.hazProPreparerContext.un3166Details, updates);
  },

  /**
   * Computes and updates required markings and labels based on current context
   * Call this whenever hazardous material, packaging, or related data changes
   */
  updateRequiredMarkingsAndLabels() {
    // Compute using utility functions
    const markings = evaluateMarkingRequirements(
      hazProStore.hazProPreparerContext
    );
    const labels = evaluateLabelingRequirements(
      hazProStore.hazProPreparerContext
    );

    // Store full structured arrays
    hazProStore.hazProPreparerContext.requiredMarkingsArray = markings;
    hazProStore.hazProPreparerContext.requiredLabelsArray = labels;

    // Also update legacy Record format for backwards compatibility
    const markingsRecord: Record<string, string> = {};
    markings.forEach(marking => {
      markingsRecord[marking.label] = marking.label;
    });
    hazProStore.hazProPreparerContext.requiredMarkings = markingsRecord;

    const labelsRecord: Record<string, string> = {};
    labels.forEach(label => {
      labelsRecord[label.label] = label.label;
    });
    hazProStore.hazProPreparerContext.requiredLabels = labelsRecord;
  },

  updateAccessorialHazmat(
    hazmat: HazProPreparerContext["additionalHandlingInfo"]["accessorialHazmat"]
  ) {
    hazProStore.hazProPreparerContext.additionalHandlingInfo.accessorialHazmat =
      hazmat;
  },

  addNote(note: string) {
    hazProStore.hazProPreparerContext.additionalHandlingInfo.notes.push(note);
  },

  removeNote(index: number) {
    hazProStore.hazProPreparerContext.additionalHandlingInfo.notes.splice(
      index,
      1
    );
  },

  // Special provisions and modifiers
  acknowledgeGeneralPackagingRequirements() {
    if (
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements
    ) {
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
        true;
    }
  },

  acknowledgeInformativeStatements() {
    if (
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements
    ) {
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements.informativeStatementsAcknowledged =
        true;
    }
  },

  acknowledgeWorkflowModifiers() {
    if (
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements
    ) {
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged =
        true;
    }
  },

  acknowledgeSpecialProvisions() {
    if (
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements
    ) {
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsAcknowledged =
        true;
    }
  },

  // SDDG Inspection Actions
  setExtractedSDDGContent(
    content: ExtractedSDDGContent,
    imageUri: string = ""
  ) {
    // PRESERVE existing frustrations before any updates
    const existingFrustrations = [
      ...hazProStore.sddgInspectionContext.frustrations,
    ];

    // Set both extractedContent (original OCR) and verificationCopy (for user corrections)
    hazProStore.sddgInspectionContext.extractedContent = content;
    hazProStore.sddgInspectionContext.verificationCopy = { ...content }; // Create a copy for user modifications
    hazProStore.sddgInspectionContext.originalImageUri = imageUri;
    hazProStore.sddgInspectionContext.inspectionStartTime = new Date();
    hazProStore.sddgInspectionContext.inspectionCompleteTime = null;

    // CRITICAL FIX: Only clear frustrations if there were none to begin with
    // or if we're genuinely starting a new inspection (not re-rendering during workflow)
    if (existingFrustrations.length === 0) {
      hazProStore.sddgInspectionContext.frustrations = [];
    } else {
      hazProStore.sddgInspectionContext.frustrations = existingFrustrations;
    }
  },

  // Verification Copy Actions
  setVerificationCopy(content: ExtractedSDDGContent) {
    hazProStore.sddgInspectionContext.verificationCopy = { ...content };
  },

  updateVerificationCopyField<K extends keyof ExtractedSDDGContent>(
    field: K,
    value: ExtractedSDDGContent[K]
  ) {
    if (hazProStore.sddgInspectionContext.verificationCopy) {
      hazProStore.sddgInspectionContext.verificationCopy[field] = value;
    }
  },

  addFrustration(
    frustration: Omit<FrustrationRecord, "frustrationDate" | "inspector">
  ) {
    const newFrustration: FrustrationRecord = {
      ...frustration,
      frustrationDate: new Date(),
      inspector: hazProStore.sddgInspectionContext.inspector,
    };

    // Create a new array with existing frustrations (excluding any with same key) plus the new one
    const existingFrustrations =
      hazProStore.sddgInspectionContext.frustrations.filter(
        (f: any) => f.key !== frustration.key
      );

    // Replace the entire array to ensure Valtio detects the change
    hazProStore.sddgInspectionContext.frustrations = [
      ...existingFrustrations,
      newFrustration,
    ];
  },

  removeFrustration(key: string) {
    hazProStore.sddgInspectionContext.frustrations =
      hazProStore.sddgInspectionContext.frustrations.filter(
        (f: any) => f.key !== key
      );
  },

  // Package Frustration Actions
  addPackageFrustration(
    frustration: Omit<
      PackageFrustrationRecord,
      "id" | "frustrationDate" | "inspector"
    >
  ) {
    const newFrustration: PackageFrustrationRecord = {
      ...frustration,
      id: `${frustration.category}-${frustration.itemId}-${Date.now()}`, // Generate unique ID
      frustrationDate: new Date(),
      inspector: hazProStore.sddgInspectionContext.inspector,
    };

    // Create a new array with existing frustrations (excluding any with same itemId) plus the new one
    const existingFrustrations =
      hazProStore.sddgInspectionContext.packageFrustrations.filter(
        (f: any) => f.itemId !== frustration.itemId
      );

    // Replace the entire array to ensure Valtio detects the change
    hazProStore.sddgInspectionContext.packageFrustrations = [
      ...existingFrustrations,
      newFrustration,
    ];
  },

  removePackageFrustration(itemId: string) {
    hazProStore.sddgInspectionContext.packageFrustrations =
      hazProStore.sddgInspectionContext.packageFrustrations.filter(
        (f: any) => f.itemId !== itemId
      );
  },

  clearInspectionContext() {
    hazProStore.sddgInspectionContext = {
      extractedContent: null,
      verificationCopy: null,
      originalImageUri: null,
      frustrations: [],
      packageFrustrations: [],
      inspector: hazProStore.sddgInspectionContext.inspector,
      inspectionStartTime: null,
      inspectionCompleteTime: null,
    };
  },

  // Reset SDDG workflow data (keeps inspector info)
  resetSDDGWorkflowData() {
    hazProStore.sddgInspectionContext.extractedContent = null;
    hazProStore.sddgInspectionContext.verificationCopy = null;
    hazProStore.sddgInspectionContext.originalImageUri = null;
    hazProStore.sddgInspectionContext.frustrations = [];
    hazProStore.sddgInspectionContext.packageFrustrations = [];
    hazProStore.sddgInspectionContext.inspectionStartTime = null;
    hazProStore.sddgInspectionContext.inspectionCompleteTime = null;
    // Reset workflow state
    hazProStore.sddgWorkflow.currentChevron = "sddg";
    hazProStore.sddgWorkflow.currentSDDGStep = "upload";
    hazProStore.sddgWorkflow.currentSDDGScreen = "SDDGUploadAndParse";
    hazProStore.sddgWorkflow.completedSDDGSubsteps = [];
    hazProStore.sddgWorkflow.sddgComplete = false;
    hazProStore.sddgWorkflow.packageComplete = false;
  },

  completeInspection() {
    hazProStore.sddgInspectionContext.inspectionCompleteTime = new Date();
  },

  setInspector(inspector: Inspector) {
    hazProStore.sddgInspectionContext.inspector = inspector;
  },

  // SDDG Workflow Actions
  setCurrentChevron(chevron: ChevronType) {
    hazProStore.sddgWorkflow.currentChevron = chevron;
  },
  setCurrentSDDGStep(step: SDDGStepType) {
    hazProStore.sddgWorkflow.currentSDDGStep = step;
  },
  setSDDGComplete(complete: boolean) {
    hazProStore.sddgWorkflow.sddgComplete = complete;
  },
  setPackageComplete(complete: boolean) {
    hazProStore.sddgWorkflow.packageComplete = complete;
  },
  resetWorkflow() {
    hazProStore.sddgWorkflow = {
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
  },
  // Combined action for completing SDDG and moving to Package
  completeSDDGAndMoveToPackage() {
    hazProStore.sddgWorkflow.sddgComplete = true;
    hazProStore.sddgWorkflow.currentChevron = "package";
  },

  // SDDG Substep Management Actions
  setCurrentSDDGScreen(screen: string) {
    hazProStore.sddgWorkflow.currentSDDGScreen = screen;
  },

  completeSDDGSubstep(substep: string) {
    if (!hazProStore.sddgWorkflow.completedSDDGSubsteps.includes(substep)) {
      hazProStore.sddgWorkflow.completedSDDGSubsteps.push(substep);
    }
  },

  resetSDDGSubsteps() {
    hazProStore.sddgWorkflow.completedSDDGSubsteps = [];
    hazProStore.sddgWorkflow.currentSDDGScreen = "SDDGUploadAndParse";
    hazProStore.sddgWorkflow.currentSDDGStep = "upload";
  },

  // Magnetized Material Inspector Actions
  setMagnetizedMaterialInspection(data: InspectorMagnetizedMaterialData) {
    hazProStore.sddgInspectionContext.magnetizedMaterialInspection = {
      ...data,
    };
  },

  updateMagnetizedMaterialInspectionField<
    K extends keyof InspectorMagnetizedMaterialData
  >(field: K, value: InspectorMagnetizedMaterialData[K]) {
    if (hazProStore.sddgInspectionContext.magnetizedMaterialInspection) {
      hazProStore.sddgInspectionContext.magnetizedMaterialInspection[field] =
        value;
    }
  },

  clearMagnetizedMaterialInspection() {
    hazProStore.sddgInspectionContext.magnetizedMaterialInspection = null;
  },

  // Reinspection Actions
  startSDDGReinspection(frustratedKeys: string[]) {
    hazProStore.sddgWorkflow.reinspection = {
      mode: "sddg",
      targetFrustrations: frustratedKeys,
      sessionId: `sddg-reinspection-${Date.now()}`,
      currentItemIndex: 0,
      totalItems: frustratedKeys.length,
    };
  },

  startPackageReinspection(frustratedItemIds: string[]) {
    hazProStore.sddgWorkflow.reinspection = {
      mode: "package",
      targetFrustrations: frustratedItemIds,
      sessionId: `package-reinspection-${Date.now()}`,
      currentItemIndex: 0,
      totalItems: frustratedItemIds.length,
    };
  },

  advanceReinspectionItem() {
    if (
      hazProStore.sddgWorkflow.reinspection.currentItemIndex <
      hazProStore.sddgWorkflow.reinspection.totalItems - 1
    ) {
      hazProStore.sddgWorkflow.reinspection.currentItemIndex++;
    }
  },

  completeReinspection() {
    hazProStore.sddgWorkflow.reinspection = {
      mode: null,
      targetFrustrations: [],
      sessionId: null,
      currentItemIndex: 0,
      totalItems: 0,
    };
  },

  updateFrustrationStatus(
    type: "sddg" | "package",
    id: string,
    newStatus: "resolved" | "confirmed"
  ) {
    if (type === "sddg") {
      // For SDDG, if resolved, remove the frustration
      if (newStatus === "resolved") {
        hazProStore.sddgInspectionContext.frustrations =
          hazProStore.sddgInspectionContext.frustrations.filter(
            (f: any) => f.key !== id
          );
      }
    } else if (type === "package") {
      // For package, if resolved, remove the frustration
      if (newStatus === "resolved") {
        hazProStore.sddgInspectionContext.packageFrustrations =
          hazProStore.sddgInspectionContext.packageFrustrations.filter(
            (f: any) => f.itemId !== id
          );
      }
    }
  },

  // Inspector Shipment Management Actions
  async initializeInspectorDatabase() {
    hazProStore.isLoadingInspectorShipments = true;
    hazProStore.databaseError = null;

    try {
      await InspectorShipmentDatabase.initializeWithMockData(
        mockInspectorShipments
      );
      await hazProActions.refreshInspectorShipmentsIndex();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initialize inspector database";
      hazProStore.databaseError = errorMessage;
      console.error(
        "Failed to initialize inspector database:",
        error
      );
      throw error;
    } finally {
      hazProStore.isLoadingInspectorShipments = false;
    }
  },

  async saveCurrentInspection() {
    hazProStore.isLoadingInspectorShipments = true;
    hazProStore.databaseError = null;

    try {
      // Validate that we have the required inspection context
      if (
        !hazProStore.sddgInspectionContext.extractedContent ||
        !hazProStore.sddgInspectionContext.verificationCopy
      ) {
        throw new Error("No inspection data to save");
      }

      // Determine inspection status
      const hasFrustrations =
        hazProStore.sddgInspectionContext.frustrations.length > 0 ||
        hazProStore.sddgInspectionContext.packageFrustrations.length > 0;
      const status = hasFrustrations ? "frustrated" : "completed";

      // Determine item statuses
      const sddgStatus =
        hazProStore.sddgInspectionContext.frustrations.length > 0
          ? "frustrated"
          : "verified";
      const packageStatus =
        hazProStore.sddgInspectionContext.packageFrustrations.length > 0
          ? "frustrated"
          : "verified";

      const inspection: InspectorShipment = {
        id: Date.now().toString(),
        status: status,
        inspectedAt: new Date(),
        inspectionContext: { ...hazProStore.sddgInspectionContext },
        tcn: hazProStore.sddgInspectionContext.verificationCopy
          .shippersReferenceNumber,
        unId: hazProStore.sddgInspectionContext.verificationCopy.unIdNo,
        properShippingName:
          hazProStore.sddgInspectionContext.verificationCopy.properShippingName,
        inspector: hazProStore.sddgInspectionContext.inspector,
        sddgStatus,
        packageStatus,
        totalFrustrations:
          hazProStore.sddgInspectionContext.frustrations.length +
          hazProStore.sddgInspectionContext.packageFrustrations.length,
        sddgFrustrations: hazProStore.sddgInspectionContext.frustrations.length,
        packageFrustrations:
          hazProStore.sddgInspectionContext.packageFrustrations.length,
      };

      await InspectorShipmentDatabase.saveInspection(inspection);

      // Update inspector shipments index
      await hazProActions.refreshInspectorShipmentsIndex();

      // Reset inspection context after successful save
      hazProActions.clearCurrentInspection();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save inspection";
      hazProStore.databaseError = errorMessage;
      console.error("Failed to save inspection:", error);
      throw error;
    } finally {
      hazProStore.isLoadingInspectorShipments = false;
    }
  },

  async loadInspectionShipment(id: string) {
    hazProStore.isLoadingInspectorShipments = true;
    hazProStore.loadingInspectionId = id;
    hazProStore.databaseError = null;

    try {
      const inspection = await InspectorShipmentDatabase.loadInspection(id);

      if (inspection) {
        // Load the full inspection into currentInspectionShipment
        hazProStore.currentInspectionShipment = inspection;

        // Also load the inspection context for viewing/editing
        hazProStore.sddgInspectionContext = { ...inspection.inspectionContext };
      } else {
        const error = `Inspection ${id} not found`;
        hazProStore.databaseError = error;
        console.warn("Inspection not found:", id);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load inspection";
      hazProStore.databaseError = errorMessage;
      console.error("Failed to load inspection:", error);
    } finally {
      hazProStore.isLoadingInspectorShipments = false;
      hazProStore.loadingInspectionId = undefined;
    }
  },

  async deleteInspectionShipment(id: string) {
    hazProStore.isLoadingInspectorShipments = true;
    hazProStore.databaseError = null;

    try {
      await InspectorShipmentDatabase.deleteInspection(id);

      // Clear current inspection if it was the deleted one
      if (hazProStore.currentInspectionShipment?.id === id) {
        hazProActions.clearCurrentInspection();
      }

      // Update inspector shipments index
      await hazProActions.refreshInspectorShipmentsIndex();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete inspection";
      hazProStore.databaseError = errorMessage;
      console.error("Failed to delete inspection:", error);
    } finally {
      hazProStore.isLoadingInspectorShipments = false;
    }
  },

  async refreshInspectorShipmentsIndex() {
    try {
      const inspections = await InspectorShipmentDatabase.listInspections();

      // Convert array to indexed object for fast lookups
      const indexedInspections: Record<string, typeof inspections[0]> = {};
      inspections.forEach(inspection => {
        indexedInspections[inspection.id] = inspection;
      });

      hazProStore.inspectorShipmentsIndex = indexedInspections;
    } catch (error) {
      console.error(
        "Failed to refresh inspector shipments index:",
        error
      );
    }
  },

  clearCurrentInspection() {
    hazProStore.currentInspectionShipment = null;
    hazProActions.clearInspectionContext();
    hazProActions.resetWorkflow();
  },

  startNewInspection() {
    hazProActions.clearCurrentInspection();
  },

  async completeInspectionWithFrustration() {
    try {
      // Mark inspection as complete
      hazProActions.completeInspection();

      // Save the inspection
      await hazProActions.saveCurrentInspection();

      // Return success for navigation purposes
      return { success: true };
    } catch (error) {
      console.error(
        "Failed to complete inspection with frustration:",
        error
      );
      return { success: false, error };
    }
  },

  async getInspectorDatabaseStats() {
    try {
      return await InspectorShipmentDatabase.getStats();
    } catch (error) {
      console.error("Failed to get database stats:", error);
      return {
        totalInspections: 0,
        completedInspections: 0,
        frustratedInspections: 0,
      };
    }
  },
};
