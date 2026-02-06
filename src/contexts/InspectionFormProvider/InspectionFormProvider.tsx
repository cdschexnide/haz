import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  ExtractedSDDGContent,
  FrustrationRecord,
  PackageFrustrationRecord,
  InspectorMagnetizedMaterialData,
  InspectorShipment,
  PackagePopMarking,
  ReinspectionAttempt,
  KitInspectionData,
  LabelingContext,
} from "@/types/sddg";
import { ExceptedQuantityData, LimitedQuantityData, Inspector } from "../../../types";
import { InnerPackagingInspectionData } from "@/types/innerPackaging";
import * as FileSystem from "expo-file-system";
import { useDatabase } from "../DataProvider";
import {
  InspectionFormState,
  ChevronType,
  SDDGStepType,
  initialWorkflowState,
  initialInspectionContext,
  AggregatedAnalysis,
} from "./types";
import {
  perfTracker,
  PERFORMANCE_TRACKING_ENABLED,
} from "@/utils/performanceUtils";

interface InspectionFormContextValue {
  // State
  inspection: InspectionFormState["currentInspection"];
  workflow: InspectionFormState["workflowState"];
  isProcessing: boolean;
  hasUnsavedChanges: boolean;
  inspectionId: string | null;

  // Inspection lifecycle
  startNewInspection: () => void;
  loadInspectionForEdit: (id: string) => Promise<void>;
  saveCurrentInspection: () => Promise<string>;
  completeInspection: () => Promise<{ success: boolean; error?: string }>;
  finalizeInspection: () => Promise<{ success: boolean; error?: string }>;
  cancelInspection: () => void;
  updateReinspectedInspection: () => Promise<{
    success: boolean;
    allResolved: boolean;
    // sddgStatus: 'verified' | 'frustrated';
    sddgStatus: string;
    error?: string;
  }>;
  // SDDG data management
  setExtractedSDDGContent: (
    content: ExtractedSDDGContent,
    imageUri?: string
  ) => Promise<void>;
  setVerificationCopy: (content: ExtractedSDDGContent) => void;
  updateVerificationField: <K extends keyof ExtractedSDDGContent>(
    field: K,
    value: ExtractedSDDGContent[K]
  ) => void;

  // Frustration management
  addFrustration: (
    frustration: Omit<FrustrationRecord, "frustrationDate" | "inspector">
  ) => void;
  removeFrustration: (key: string) => void;
  addPackageFrustration: (
    frustration: Omit<
      PackageFrustrationRecord,
      "id" | "frustrationDate" | "inspector"
    >
  ) => void;
  removePackageFrustration: (itemId: string) => void;

  // Workflow management
  setCurrentChevron: (chevron: ChevronType) => void;
  setCurrentSDDGStep: (step: SDDGStepType) => void;
  setCurrentSDDGScreen: (screen: string) => void;
  completeSDDGSubstep: (substep: string) => void;
  setSDDGComplete: (complete: boolean) => void;
  setPackageComplete: (complete: boolean) => void;
  completeSDDGAndMoveToPackage: () => void;
  resetWorkflow: () => void;

  // Reinspection
  startSDDGReinspection: (keys: string[]) => void;
  startPackageReinspection: (itemIds: string[]) => void;
  resolvePackageFrustration: (itemId: string, inspector: Inspector, comments?: string) => void;
  refrustratePackageFrustration: (itemId: string, inspector: Inspector, comments?: string) => void;
  advanceReinspectionItem: () => void;
  completeReinspection: () => void;

  // Magnetized materials (special case)
  setMagnetizedMaterialInspection: (
    data: InspectorMagnetizedMaterialData
  ) => void;
  updateMagnetizedMaterialField: <
    K extends keyof InspectorMagnetizedMaterialData
  >(
    field: K,
    value: InspectorMagnetizedMaterialData[K]
  ) => void;
  clearMagnetizedMaterialInspection: () => void;

  // Inner packaging inspection (combination packaging)
  setInnerPackagingInspection: (data: InnerPackagingInspectionData) => void;
  updateInnerPackagingField: <K extends keyof InnerPackagingInspectionData>(
    field: K,
    value: InnerPackagingInspectionData[K]
  ) => void;
  updateInnerPackagingInspectionItem: (
    itemId: string,
    status: "pass" | "fail" | "not-applicable",
    notes?: string
  ) => void;
  clearInnerPackagingInspection: () => void;

  // UN3316 kit inspection data
  setKitInspectionData: (data: KitInspectionData | null) => void;

  // Labeling context (A15 edge cases)
  setLabelingContext: (data: LabelingContext | null) => void;
  updateLabelingContextField: <K extends keyof LabelingContext>(
    field: K,
    value: LabelingContext[K]
  ) => void;

  // Package POP marking
  setPackagePopMarking: (data: PackagePopMarking) => void;
  updatePackagePopField: <K extends keyof PackagePopMarking>(
    field: K,
    value: PackagePopMarking[K]
  ) => void;
  resetPackagePopMarking: () => void;

  // ML Analysis Results
  setMLAnalysisResults: (results: AggregatedAnalysis | null) => void;

  // Attachment 19 quantity handling
  setQuantityType: (quantityType: "standard" | "excepted" | "limited") => void;
  setExceptedQuantityData: (data: ExceptedQuantityData | null) => void;
  setLimitedQuantityData: (data: LimitedQuantityData | null) => void;
  setPackagePackagingType: (
    packagingType: "single" | "combination" | "composite" | null
  ) => void;

  // Inspector management
  setInspector: (
    inspector:
      | string
      | {
          inspectorName: string;
          inspectorRank: string | null;
          inspectorTitle: string;
        }
  ) => void;
}

const InspectionFormContext = createContext<
  InspectionFormContextValue | undefined
>(undefined);

export function InspectionFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const database = useDatabase();

  const [inspection, setInspection] = useState({ ...initialInspectionContext });
  const [workflow, setWorkflow] = useState({ ...initialWorkflowState });
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [inspectionId, setInspectionId] = useState<string | null>(null);

  // Ref to track current inspection state without causing recreation cycles
  const inspectionRef = useRef(inspection);

  useEffect(() => {
    inspectionRef.current = inspection;
  }, [inspection]);

  const startNewInspection = useCallback(() => {
    console.log("📝 [InspectionForm] Starting new inspection");
    const currentInspector = inspectionRef.current.inspector;
    setInspection({ ...initialInspectionContext, inspector: currentInspector });
    setWorkflow({ ...initialWorkflowState });
    setInspectionId(null);
    setHasUnsavedChanges(false);
  }, []);

  const loadInspectionForEdit = useCallback(
    async (id: string) => {
      const perfId = perfTracker.start("loadInspectionForEdit", { id });

      try {
        console.log("📝📝📝 [InspectionForm] LOAD INSPECTION FOR EDIT CALLED");
        console.log(
          "📝 [InspectionForm] Loading inspection for edit with ID:",
          id
        );
        console.log(
          "📝 [InspectionForm] Database initialized:",
          database.isInitialized
        );
        setIsProcessing(true);

        console.log("📝 [InspectionForm] Calling database.loadInspection...");
        const dbLoadStart = performance.now();
        const loaded = await database.loadInspection(id);
        const dbLoadTime = performance.now() - dbLoadStart;

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "database.loadInspection", dbLoadTime);
        }

        console.log(
          "📝 [InspectionForm] Database load result:",
          loaded ? "SUCCESS" : "NULL"
        );

        if (!loaded) {
          console.error(
            "📝 [InspectionForm] ERROR - Inspection not found in database"
          );
          perfTracker.end(perfId, 0);
          throw new Error(`Inspection ${id} not found`);
        }

        console.log(
          "📝 [InspectionForm] Loaded inspection status:",
          loaded.status
        );
        console.log("📝 [InspectionForm] Loaded inspection TCN:", loaded.tcn);
        console.log(
          "📝 [InspectionForm] Loaded inspection frustrations count:",
          loaded.inspectionContext.frustrations?.length || 0
        );

        // Store the inspection ID
        console.log("📝 [InspectionForm] Setting inspection ID:", id);
        setInspectionId(id);

        // Measure state update time
        const stateUpdateStart = performance.now();

        // Load inspection context (with backward compatibility for resolved frustrations)
        console.log("📝 [InspectionForm] Setting inspection context...");
        setInspection({
          ...loaded.inspectionContext,
          resolvedFrustrations:
            loaded.inspectionContext.resolvedFrustrations || [],
          resolvedPackageFrustrations:
            loaded.inspectionContext.resolvedPackageFrustrations || [],
          quantityType: loaded.inspectionContext.quantityType || "standard",
          exceptedQuantityData:
            loaded.inspectionContext.exceptedQuantityData || null,
          limitedQuantityData:
            loaded.inspectionContext.limitedQuantityData || null,
          packagePackagingType:
            loaded.inspectionContext.packagePackagingType || null,
          labelingContext:
            loaded.inspectionContext.labelingContext || null,
        });

        // Reset workflow to appropriate state based on inspection status
        if (loaded.status === "completed" || loaded.status === "frustrated") {
          console.log("📝 [InspectionForm] Setting workflow to complete state");
          // For completed inspections, set workflow to complete state
          setWorkflow({
            ...initialWorkflowState,
            currentChevron: "complete",
            sddgComplete: true,
            packageComplete: true,
          });
        } else {
          console.log("📝 [InspectionForm] Setting workflow to initial state");
          // For in-progress, restore to sddg or package based on frustrations
          setWorkflow({ ...initialWorkflowState });
        }

        const stateUpdateTime = performance.now() - stateUpdateStart;
        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "setState", stateUpdateTime);
        }

        setHasUnsavedChanges(false);
        console.log("📝 [InspectionForm] Inspection loaded successfully ✅");
        perfTracker.end(perfId);
      } catch (error) {
        perfTracker.end(perfId, 0);
        console.error(
          "📝 [InspectionForm] ❌ Failed to load inspection:",
          error
        );
        console.error(
          "📝 [InspectionForm] ❌ Error stack:",
          error instanceof Error ? error.stack : "No stack"
        );
        throw error;
      } finally {
        console.log("📝 [InspectionForm] Setting isProcessing to false");
        setIsProcessing(false);
      }
    },
    [database]
  );

  const saveCurrentInspection = useCallback(
    async (inspectionData?: typeof inspection): Promise<string> => {
      const perfId = perfTracker.start("saveCurrentInspection", {
        hasProvidedData: !!inspectionData,
        existingId: inspectionId
      });

      try {
        // Use provided data or fall back to ref to access current state without causing recreation cycles
        const currentInspection = inspectionData || inspectionRef.current;

        if (
          !currentInspection.extractedContent ||
          !currentInspection.verificationCopy
        ) {
          perfTracker.end(perfId, 0);
          throw new Error("No inspection data to save");
        }

        console.log("📝 [InspectionForm] Saving current inspection");
        console.log("📝 [InspectionForm] Existing inspectionId:", inspectionId);
        setIsProcessing(true);

        // Measure status calculation time
        const statusStart = performance.now();

        // Determine status
        const hasFrustrations =
          currentInspection.frustrations.length > 0 ||
          currentInspection.packageFrustrations.length > 0;
        const status = hasFrustrations ? "frustrated" : "completed";

        // Determine item statuses
        const sddgStatus =
          currentInspection.frustrations.length > 0 ? "frustrated" : "verified";
        const packageStatus =
          currentInspection.packageFrustrations.length > 0
            ? "frustrated"
            : "verified";

        // Use existing inspectionId if available (for reinspection updates), otherwise create new
        const recordId = inspectionId || Date.now().toString();

        const statusTime = performance.now() - statusStart;
        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "calculate-status", statusTime);
        }

        // Measure context copy time (THIS IS THE SUSPECT!)
        const copyStart = performance.now();
        const inspectionContextCopy = { ...currentInspection };
        const copyTime = performance.now() - copyStart;
        console.log(`⏱️ [PERF] copy-context: ${copyTime.toFixed(1)}ms`);

        // Measure ML results size (this stringify is part of the overhead!)
        const sizeStart = performance.now();
        const mlResultsSize = currentInspection.mlAnalysisResults
          ? JSON.stringify(currentInspection.mlAnalysisResults).length
          : 0;
        const sizeTime = performance.now() - sizeStart;
        console.log(`📝 [InspectionForm] ML Results size: ${(mlResultsSize / 1024).toFixed(1)} KB (measured in ${sizeTime.toFixed(1)}ms)`);

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "copy-context", copyTime, mlResultsSize);
          if (sizeTime > 10) {
            perfTracker.recordSubMetric(perfId, "measure-ml-size", sizeTime, mlResultsSize);
          }
        }

        // Measure record assembly time
        const assembleStart = performance.now();
        const inspectionRecord: InspectorShipment = {
          id: recordId,
          status: status,
          inspectedAt: new Date(),
          inspectionContext: inspectionContextCopy,
          tcn: currentInspection.verificationCopy.shippersReferenceNumber || "N/A",
          unId: currentInspection.verificationCopy.unIdNo || "N/A",
          properShippingName:
            currentInspection.verificationCopy.properShippingName || "N/A",
          inspector: currentInspection.inspector,
          sddgStatus,
          packageStatus,
          totalFrustrations:
            currentInspection.frustrations.length +
            currentInspection.packageFrustrations.length,
          sddgFrustrations: currentInspection.frustrations.length,
          packageFrustrations: currentInspection.packageFrustrations.length,
        };
        const assembleTime = performance.now() - assembleStart;
        console.log(`⏱️ [PERF] assemble-record: ${assembleTime.toFixed(1)}ms`);

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "assemble-record", assembleTime);
        }

        // Save to database
        console.log(`⏱️ [PERF] Starting database.saveInspection...`);
        const dbSaveStart = performance.now();
        const id = await database.saveInspection(inspectionRecord);
        const dbSaveTime = performance.now() - dbSaveStart;
        console.log(`⏱️ [PERF] database.saveInspection: ${dbSaveTime.toFixed(1)}ms`);

        if (PERFORMANCE_TRACKING_ENABLED) {
          perfTracker.recordSubMetric(perfId, "database.saveInspection", dbSaveTime);
        }

        setHasUnsavedChanges(false);

        // Log total time breakdown
        const totalTime = performance.now() - statusStart;
        console.log(`⏱️ [PERF] saveCurrentInspection TOTAL: ${totalTime.toFixed(1)}ms`);
        console.log(`⏱️ [PERF] BREAKDOWN: status=${statusTime.toFixed(0)}ms, copy=${copyTime.toFixed(0)}ms, assemble=${assembleTime.toFixed(0)}ms, dbSave=${dbSaveTime.toFixed(0)}ms`);

        console.log("📝 [InspectionForm] Inspection saved successfully:", id);
        perfTracker.end(perfId);
        return id;
      } catch (error) {
        perfTracker.end(perfId, 0);
        console.error("📝 [InspectionForm] Failed to save inspection:", error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [database, inspectionId]
  );

  const completeInspection = useCallback(async () => {
    try {
      console.log("📝 [InspectionForm] Completing inspection");

      // Create updated inspection with completion time
      const updatedInspection = {
        ...inspectionRef.current,
        inspectionCompleteTime: new Date(),
      };

      // Save to database with updated data
      const id = await saveCurrentInspection(updatedInspection);

      // Update state after successful save
      setInspection(updatedInspection);

      console.log("📝 [InspectionForm] Inspection completed successfully:", id);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(
        "📝 [InspectionForm] Failed to complete inspection:",
        error
      );

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [saveCurrentInspection]);

  const finalizeInspection = useCallback(async () => {
    try {
      console.log("📝 [InspectionForm] Finalizing inspection");

      const updatedInspection = {
        ...inspectionRef.current,
        inspectionCompleteTime: new Date(),
      };

      inspectionRef.current = updatedInspection;
      setInspection(updatedInspection);

      if (inspectionId) {
        const updateResult = await updateReinspectedInspection();
        if (!updateResult.success) {
          return { success: false, error: updateResult.error };
        }
      } else {
        await saveCurrentInspection(updatedInspection);
      }

      startNewInspection();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }, [inspectionId, saveCurrentInspection, startNewInspection, updateReinspectedInspection]);

  const cancelInspection = useCallback(() => {
    console.log("📝 [InspectionForm] Canceling inspection");
    startNewInspection();
  }, [startNewInspection]);

  const updateReinspectedInspection = useCallback(async () => {
    const perfId = perfTracker.start("updateReinspectedInspection", {
      inspectionId
    });

    try {
      if (!inspectionId) {
        perfTracker.end(perfId, 0);
        throw new Error("No inspection ID available for update");
      }

      console.log(
        "📝 [InspectionForm] Updating reinspected inspection:",
        inspectionId
      );
      setIsProcessing(true);

      const currentInspection = inspectionRef.current;

      // Measure status calculation time
      const calcStart = performance.now();

      // Determine new statuses
      const sddgFrustrations = currentInspection.frustrations.length;
      const packageFrustrations = currentInspection.packageFrustrations.length;
      const sddgStatus = sddgFrustrations === 0 ? "verified" : "frustrated";
      const packageStatus =
        packageFrustrations === 0 ? "verified" : "frustrated";
      const status =
        sddgFrustrations + packageFrustrations === 0
          ? "completed"
          : "frustrated";

      const calcTime = performance.now() - calcStart;
      if (PERFORMANCE_TRACKING_ENABLED) {
        perfTracker.recordSubMetric(perfId, "calculate-status", calcTime);
      }

      // Update inspection in database
      const dbUpdateStart = performance.now();
      await database.updateInspection(inspectionId, {
        status,
        sddgStatus,
        packageStatus,
        totalFrustrations: sddgFrustrations + packageFrustrations,
        sddgFrustrations,
        packageFrustrations,
        inspectionContext: { ...currentInspection },
      });
      const dbUpdateTime = performance.now() - dbUpdateStart;

      if (PERFORMANCE_TRACKING_ENABLED) {
        perfTracker.recordSubMetric(perfId, "database.updateInspection", dbUpdateTime);
      }

      console.log("📝 [InspectionForm] Reinspection updated successfully");

      // Check if all SDDG frustrations were resolved
      const allResolved = sddgFrustrations === 0;

      perfTracker.end(perfId);
      return {
        success: true,
        allResolved,
        sddgStatus,
      };
    } catch (error) {
      perfTracker.end(perfId, 0);
      console.error(
        "📝 [InspectionForm] Failed to update reinspection:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        allResolved: false,
        sddgStatus: "frustrated" as const,
      };
    } finally {
      setIsProcessing(false);
    }
  }, [inspectionId, database]);

  const setExtractedSDDGContent = useCallback(
    async (content: ExtractedSDDGContent, imageUri: string = "") => {
      console.log("📝 [InspectionForm] Setting extracted SDDG content");

      // Persist scanned SDDG image to durable storage before setting state
      let persistentImageUri = imageUri || null;
      if (imageUri) {
        try {
          const dir = `${FileSystem.documentDirectory}sddg_images/`;
          const dirInfo = await FileSystem.getInfoAsync(dir);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
          }
          // Preserve original file extension
          const ext = imageUri.includes(".") ? imageUri.substring(imageUri.lastIndexOf(".")) : ".jpg";
          const filename = `sddg_${Date.now()}${ext}`;
          const destUri = `${dir}${filename}`;
          await FileSystem.copyAsync({ from: imageUri, to: destUri });
          persistentImageUri = destUri;
          console.log("📝 [InspectionForm] SDDG image persisted to:", destUri);
        } catch (err) {
          console.error("📝 [InspectionForm] Failed to persist SDDG image, using original URI:", err);
          // Keep the original temp URI as fallback
        }
      }

      setInspection(prev => {
        // CRITICAL: Preserve existing frustrations
        const existingFrustrations = [...prev.frustrations];
        const existingPackageFrustrations = [...prev.packageFrustrations];

        // Clean up old persisted image only after new one is safely stored
        if (prev.originalImageUri && prev.originalImageUri.includes("sddg_images/")) {
          FileSystem.deleteAsync(prev.originalImageUri, { idempotent: true }).catch(() => {});
        }

        return {
          ...prev,
          extractedContent: { ...content },
          verificationCopy: { ...content }, // Create copy for user modifications
          originalImageUri: persistentImageUri,
          inspectionStartTime: new Date(),
          inspectionCompleteTime: null,
          // PRESERVE frustrations
          frustrations: existingFrustrations,
          packageFrustrations: existingPackageFrustrations,
        };
      });

      setHasUnsavedChanges(true);
    },
    []
  );

  const setVerificationCopy = useCallback((content: ExtractedSDDGContent) => {
    console.log("📝 [InspectionForm] Setting verification copy");

    setInspection(prev => ({
      ...prev,
      verificationCopy: { ...content },
    }));

    setHasUnsavedChanges(true);
  }, []);

  const updateVerificationField = useCallback(
    <K extends keyof ExtractedSDDGContent>(
      field: K,
      value: ExtractedSDDGContent[K]
    ) => {
      console.log("📝 [InspectionForm] Updating verification field:", field);

      setInspection(prev => ({
        ...prev,
        verificationCopy: prev.verificationCopy
          ? {
              ...prev.verificationCopy,
              [field]: value,
            }
          : null,
      }));

      setHasUnsavedChanges(true);
    },
    []
  );

  const addFrustration = useCallback(
    (frustration: Omit<FrustrationRecord, "frustrationDate" | "inspector">) => {
      console.log("📝 [InspectionForm] Adding frustration:", frustration.key);

      setInspection(prev => {
        const existingFrustration = prev.frustrations.find(
          f => f.key === frustration.key
        );
        const resolvedFrustration = prev.resolvedFrustrations.find(
          f => f.key === frustration.key
        );

        // Build reinspection history
        const baseRecord = existingFrustration || resolvedFrustration;
        let reinspectionHistory = baseRecord?.reinspectionHistory || [];

        if (workflow.reinspection.mode === "sddg") {
          console.log(
            "📝 [InspectionForm] In reinspection mode, adding frustrated attempt to history"
          );
          reinspectionHistory = [
            ...reinspectionHistory,
            {
              date: new Date(),
              inspector: prev.inspector,
              action: "frustrated" as const,
              additionalComments: frustration.additionalComments,
            },
          ];
        }

        // Create new frustration with metadata
        const newFrustration: FrustrationRecord = {
          ...frustration,
          frustrationDate: baseRecord?.frustrationDate || new Date(),
          inspector: baseRecord?.inspector || prev.inspector,
          reinspectionHistory,
        };

        // Remove any existing frustration with same key, then add new one
        const updatedFrustrations = [
          ...prev.frustrations.filter(f => f.key !== frustration.key),
          newFrustration,
        ];

        // If it was in resolved, remove it from there
        const updatedResolvedFrustrations = prev.resolvedFrustrations.filter(
          f => f.key !== frustration.key
        );

        console.log(
          "📝 [InspectionForm] Frustrations after add:",
          updatedFrustrations.length
        );
        if (resolvedFrustration) {
          console.log(
            "📝 [InspectionForm] Moved frustration back from resolved to current"
          );
        }

        return {
          ...prev,
          frustrations: updatedFrustrations,
          resolvedFrustrations: updatedResolvedFrustrations,
        };
      });

      setHasUnsavedChanges(true);
    },
    [workflow.reinspection.mode]
  );

  const removeFrustration = useCallback(
    (key: string) => {
      console.log("📝 [InspectionForm] Removing frustration:", key);

      setInspection(prev => {
        const existingFrustration = prev.frustrations.find(f => f.key === key);

        // Update verificationCopy with correctValue if it exists
        let updatedVerificationCopy = prev.verificationCopy;
        if (existingFrustration?.correctValue && prev.verificationCopy) {
          updatedVerificationCopy = {
            ...prev.verificationCopy,
            [key]: existingFrustration.correctValue,
          };
          console.log(
            `📝 [InspectionForm] Updated ${key} in verificationCopy:`,
            existingFrustration.fieldValue,
            "→",
            existingFrustration.correctValue
          );
        }

        // If in reinspection mode, add validation attempt to history and move to resolved
        if (workflow.reinspection.mode === "sddg" && existingFrustration) {
          console.log(
            "📝 [InspectionForm] In reinspection mode, adding verified attempt to history and moving to resolved"
          );

          // Add verification history
          const updatedFrustration: FrustrationRecord = {
            ...existingFrustration,
            reinspectionHistory: [
              ...(existingFrustration.reinspectionHistory || []),
              {
                date: new Date(),
                inspector: prev.inspector,
                action: "verified" as const,
              },
            ],
          };

          // Move to resolvedFrustrations instead of deleting
          const finalFrustrations = prev.frustrations.filter(
            f => f.key !== key
          );
          const finalResolvedFrustrations = [
            ...prev.resolvedFrustrations,
            updatedFrustration,
          ];

          console.log(
            "📝 [InspectionForm] Frustrations after remove (with history):",
            finalFrustrations.length
          );
          console.log(
            "📝 [InspectionForm] Resolved frustrations after move:",
            finalResolvedFrustrations.length
          );

          return {
            ...prev,
            verificationCopy: updatedVerificationCopy,
            frustrations: finalFrustrations,
            resolvedFrustrations: finalResolvedFrustrations,
          };
        }

        // Normal mode: just remove
        const updatedFrustrations = prev.frustrations.filter(
          f => f.key !== key
        );
        console.log(
          "📝 [InspectionForm] Frustrations after remove:",
          updatedFrustrations.length
        );

        return {
          ...prev,
          verificationCopy: updatedVerificationCopy,
          frustrations: updatedFrustrations,
        };
      });

      setHasUnsavedChanges(true);
    },
    [workflow.reinspection.mode]
  );

  const addPackageFrustration = useCallback(
    (
      frustration: Omit<
        PackageFrustrationRecord,
        "id" | "frustrationDate" | "inspector"
      >
    ) => {
      console.log(
        "📝 [InspectionForm] Adding package frustration:",
        frustration.itemId
      );

      setInspection(prev => {
        const existingFrustration = prev.packageFrustrations.find(
          f => f.itemId === frustration.itemId
        );
        const resolvedFrustration = prev.resolvedPackageFrustrations.find(
          f => f.itemId === frustration.itemId
        );

        // Build reinspection history
        const baseRecord = existingFrustration || resolvedFrustration;
        let reinspectionHistory = baseRecord?.reinspectionHistory || [];

        if (workflow.reinspection.mode === "package") {
          console.log(
            "📝 [InspectionForm] In package reinspection mode, adding frustrated attempt to history"
          );
          reinspectionHistory = [
            ...reinspectionHistory,
            {
              date: new Date(),
              inspector: prev.inspector,
              action: "frustrated" as const,
              additionalComments: frustration.additionalComments,
            },
          ];
        }

        // Create new frustration with metadata
        const newFrustration: PackageFrustrationRecord = {
          ...frustration,
          id:
            baseRecord?.id ||
            `${frustration.category}-${frustration.itemId}-${Date.now()}`,
          frustrationDate: baseRecord?.frustrationDate || new Date(),
          inspector: baseRecord?.inspector || prev.inspector,
          reinspectionHistory,
        };

        // Remove any existing frustration with same itemId, then add new one
        const updatedFrustrations = [
          ...prev.packageFrustrations.filter(
            f => f.itemId !== frustration.itemId
          ),
          newFrustration,
        ];

        // If it was in resolved, remove it from there
        const updatedResolvedFrustrations =
          prev.resolvedPackageFrustrations.filter(
            f => f.itemId !== frustration.itemId
          );

        console.log(
          "📝 [InspectionForm] Package frustrations after add:",
          updatedFrustrations.length
        );
        if (resolvedFrustration) {
          console.log(
            "📝 [InspectionForm] Moved package frustration back from resolved to current"
          );
        }

        return {
          ...prev,
          packageFrustrations: updatedFrustrations,
          resolvedPackageFrustrations: updatedResolvedFrustrations,
        };
      });

      setHasUnsavedChanges(true);
    },
    [workflow.reinspection.mode]
  );

  const removePackageFrustration = useCallback(
    (itemId: string) => {
      console.log("📝 [InspectionForm] Removing package frustration:", itemId);

      setInspection(prev => {
        const existingFrustration = prev.packageFrustrations.find(
          f => f.itemId === itemId
        );

        // If in reinspection mode, add validation attempt to history and move to resolved
        if (workflow.reinspection.mode === "package" && existingFrustration) {
          console.log(
            "📝 [InspectionForm] In package reinspection mode, adding verified attempt to history and moving to resolved"
          );

          // Add verification history
          const updatedFrustration: PackageFrustrationRecord = {
            ...existingFrustration,
            reinspectionHistory: [
              ...(existingFrustration.reinspectionHistory || []),
              {
                date: new Date(),
                inspector: prev.inspector,
                action: "verified" as const,
              },
            ],
          };

          // Move to resolvedPackageFrustrations instead of deleting
          const finalFrustrations = prev.packageFrustrations.filter(
            f => f.itemId !== itemId
          );
          const finalResolvedFrustrations = [
            ...prev.resolvedPackageFrustrations,
            updatedFrustration,
          ];

          console.log(
            "📝 [InspectionForm] Package frustrations after remove (with history):",
            finalFrustrations.length
          );
          console.log(
            "📝 [InspectionForm] Resolved package frustrations after move:",
            finalResolvedFrustrations.length
          );

          return {
            ...prev,
            packageFrustrations: finalFrustrations,
            resolvedPackageFrustrations: finalResolvedFrustrations,
          };
        }

        // Normal mode: just remove
        const updatedFrustrations = prev.packageFrustrations.filter(
          f => f.itemId !== itemId
        );
        console.log(
          "📝 [InspectionForm] Package frustrations after remove:",
          updatedFrustrations.length
        );

        return {
          ...prev,
          packageFrustrations: updatedFrustrations,
        };
      });

      setHasUnsavedChanges(true);
    },
    [workflow.reinspection.mode]
  );

  const setCurrentChevron = useCallback((chevron: ChevronType) => {
    console.log("📝 [InspectionForm] Setting chevron:", chevron);
    setWorkflow(prev => ({ ...prev, currentChevron: chevron }));
  }, []);

  const setCurrentSDDGStep = useCallback((step: SDDGStepType) => {
    console.log("📝 [InspectionForm] Setting SDDG step:", step);
    setWorkflow(prev => ({ ...prev, currentSDDGStep: step }));
  }, []);

  const setCurrentSDDGScreen = useCallback((screen: string) => {
    console.log("📝 [InspectionForm] Setting SDDG screen:", screen);
    setWorkflow(prev => ({ ...prev, currentSDDGScreen: screen }));
  }, []);

  const completeSDDGSubstep = useCallback((substep: string) => {
    console.log("📝 [InspectionForm] Completing substep:", substep);
    setWorkflow(prev => {
      if (prev.completedSDDGSubsteps.includes(substep)) {
        return prev;
      }
      return {
        ...prev,
        completedSDDGSubsteps: [...prev.completedSDDGSubsteps, substep],
      };
    });
  }, []);

  const setSDDGComplete = useCallback((complete: boolean) => {
    console.log("📝 [InspectionForm] Setting SDDG complete:", complete);
    setWorkflow(prev => ({ ...prev, sddgComplete: complete }));
  }, []);

  const setPackageComplete = useCallback((complete: boolean) => {
    console.log("📝 [InspectionForm] Setting package complete:", complete);
    setWorkflow(prev => ({ ...prev, packageComplete: complete }));
  }, []);

  const completeSDDGAndMoveToPackage = useCallback(() => {
    console.log("📝 [InspectionForm] Completing SDDG and moving to package");
    setWorkflow(prev => ({
      ...prev,
      sddgComplete: true,
      currentChevron: "package",
    }));
  }, []);

  const resetWorkflow = useCallback(() => {
    console.log("📝 [InspectionForm] Resetting workflow");
    setWorkflow({ ...initialWorkflowState });
  }, []);

  const startSDDGReinspection = useCallback((keys: string[]) => {
    console.log(
      "📝 [InspectionForm] Starting SDDG reinspection for keys:",
      keys
    );
    setWorkflow(prev => ({
      ...prev,
      currentChevron: "sddg",
      currentSDDGStep: "compliance",
      currentSDDGScreen: "SDDGComplianceValidation",
      reinspection: {
        mode: "sddg",
        targetFrustrations: keys,
        sessionId: `sddg-reinspection-${Date.now()}`,
        currentItemIndex: 0,
        totalItems: keys.length,
      },
    }));
  }, []);

  const startPackageReinspection = useCallback((itemIds: string[]) => {
    console.log(
      "📝 [InspectionForm] Starting package reinspection for items:",
      itemIds
    );
    setWorkflow(prev => ({
      ...prev,
      currentChevron: "package",
      reinspection: {
        mode: "package",
        targetFrustrations: itemIds,
        sessionId: `package-reinspection-${Date.now()}`,
        currentItemIndex: 0,
        totalItems: itemIds.length,
      },
    }));
  }, []);

  // Helper to format inspector for audit trail
  const formatInspector = (inspector: Inspector): string => {
    const name = inspector.inspectorName || "";
    return name.replace(",", " ").replace(/\s+/g, " ").trim() || "Unknown Inspector";
  };

  const resolvePackageFrustration = useCallback((
    itemId: string,
    inspector: Inspector,
    comments?: string
  ) => {
    console.log("📝 [InspectionForm] Resolving package frustration:", itemId);

    setInspection(prev => {
      const frustration = prev.packageFrustrations.find(f => f.itemId === itemId);
      if (!frustration) {
        console.warn("📝 [InspectionForm] Frustration not found:", itemId);
        return prev;
      }

      const reinspectionAttempt: ReinspectionAttempt = {
        date: new Date(),
        inspector: formatInspector(inspector),
        action: "verified",
        additionalComments: comments,
      };

      const updatedFrustration = {
        ...frustration,
        reinspectionHistory: [
          ...(frustration.reinspectionHistory || []),
          reinspectionAttempt,
        ],
      };

      console.log("📝 [InspectionForm] Moving frustration to resolved:", {
        itemId,
        reinspectionCount: updatedFrustration.reinspectionHistory.length,
      });

      return {
        ...prev,
        packageFrustrations: prev.packageFrustrations.filter(f => f.itemId !== itemId),
        resolvedPackageFrustrations: [
          ...prev.resolvedPackageFrustrations,
          updatedFrustration,
        ],
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const refrustratePackageFrustration = useCallback((
    itemId: string,
    inspector: Inspector,
    comments?: string
  ) => {
    console.log("📝 [InspectionForm] Re-frustrating package item:", itemId);

    setInspection(prev => {
      const reinspectionAttempt: ReinspectionAttempt = {
        date: new Date(),
        inspector: formatInspector(inspector),
        action: "frustrated",
        additionalComments: comments,
      };

      return {
        ...prev,
        packageFrustrations: prev.packageFrustrations.map(f =>
          f.itemId === itemId
            ? {
                ...f,
                reinspectionHistory: [
                  ...(f.reinspectionHistory || []),
                  reinspectionAttempt,
                ],
              }
            : f
        ),
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const advanceReinspectionItem = useCallback(() => {
    setWorkflow(prev => {
      if (
        prev.reinspection.currentItemIndex <
        prev.reinspection.totalItems - 1
      ) {
        return {
          ...prev,
          reinspection: {
            ...prev.reinspection,
            currentItemIndex: prev.reinspection.currentItemIndex + 1,
          },
        };
      }
      return prev;
    });
  }, []);

  const completeReinspection = useCallback(() => {
    console.log("📝 [InspectionForm] Completing reinspection");
    setWorkflow(prev => ({
      ...prev,
      reinspection: {
        mode: null,
        targetFrustrations: [],
        sessionId: null,
        currentItemIndex: 0,
        totalItems: 0,
      },
    }));
  }, []);

  const setMagnetizedMaterialInspection = useCallback(
    (data: InspectorMagnetizedMaterialData) => {
      console.log("📝 [InspectionForm] Setting magnetized material inspection");
      setInspection(prev => ({
        ...prev,
        magnetizedMaterialInspection: { ...data },
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const updateMagnetizedMaterialField = useCallback(
    <K extends keyof InspectorMagnetizedMaterialData>(
      field: K,
      value: InspectorMagnetizedMaterialData[K]
    ) => {
      console.log(
        "📝 [InspectionForm] Updating magnetized material field:",
        field
      );
      setInspection(prev => ({
        ...prev,
        magnetizedMaterialInspection: prev.magnetizedMaterialInspection
          ? {
              ...prev.magnetizedMaterialInspection,
              [field]: value,
            }
          : null,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const clearMagnetizedMaterialInspection = useCallback(() => {
    console.log("📝 [InspectionForm] Clearing magnetized material inspection");
    setInspection(prev => ({
      ...prev,
      magnetizedMaterialInspection: null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setInnerPackagingInspection = useCallback(
    (data: InnerPackagingInspectionData) => {
      console.log("📝 [InspectionForm] Setting inner packaging inspection");
      setInspection(prev => ({
        ...prev,
        innerPackagingInspection: { ...data },
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const updateInnerPackagingField = useCallback(
    <K extends keyof InnerPackagingInspectionData>(
      field: K,
      value: InnerPackagingInspectionData[K]
    ) => {
      console.log("📝 [InspectionForm] Updating inner packaging field:", field);
      setInspection(prev => ({
        ...prev,
        innerPackagingInspection: prev.innerPackagingInspection
          ? {
              ...prev.innerPackagingInspection,
              [field]: value,
            }
          : null,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const updateInnerPackagingInspectionItem = useCallback(
    (
      itemId: string,
      status: "pass" | "fail" | "not-applicable",
      notes?: string
    ) => {
      console.log(
        "📝 [InspectionForm] Updating inner packaging inspection item:",
        itemId,
        status
      );
      setInspection(prev => {
        if (!prev.innerPackagingInspection) return prev;

        const updatedItems = prev.innerPackagingInspection.inspectionItems.map(
          item =>
            item.id === itemId
              ? { ...item, status, notes: notes || item.notes }
              : item
        );

        return {
          ...prev,
          innerPackagingInspection: {
            ...prev.innerPackagingInspection,
            inspectionItems: updatedItems,
          },
        };
      });
      setHasUnsavedChanges(true);
    },
    []
  );

  const clearInnerPackagingInspection = useCallback(() => {
    console.log("📝 [InspectionForm] Clearing inner packaging inspection");
    setInspection(prev => ({
      ...prev,
      innerPackagingInspection: null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setKitInspectionData = useCallback((data: KitInspectionData | null) => {
    console.log("📝 [InspectionForm] Setting kit inspection data");
    setInspection(prev => ({
      ...prev,
      kitInspectionData: data ? { ...data, contents: [...data.contents] } : null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setLabelingContext = useCallback((data: LabelingContext | null) => {
    console.log("📝 [InspectionForm] Setting labeling context");
    setInspection(prev => ({
      ...prev,
      labelingContext: data ? { ...data } : null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateLabelingContextField = useCallback(
    <K extends keyof LabelingContext>(field: K, value: LabelingContext[K]) => {
      console.log("📝 [InspectionForm] Updating labeling context field:", field);
      setInspection(prev => ({
        ...prev,
        labelingContext: prev.labelingContext
          ? {
              ...prev.labelingContext,
              [field]: value,
            }
          : { [field]: value },
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const setPackagePopMarking = useCallback((data: PackagePopMarking) => {
    console.log("📝 [InspectionForm] Setting package POP marking");
    setInspection(prev => ({
      ...prev,
      packagePopMarking: { ...data },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updatePackagePopField = useCallback(
    <K extends keyof PackagePopMarking>(
      field: K,
      value: PackagePopMarking[K]
    ) => {
      console.log("📝 [InspectionForm] Updating package POP field:", field);
      setInspection(prev => ({
        ...prev,
        packagePopMarking: prev.packagePopMarking
          ? {
              ...prev.packagePopMarking,
              [field]: value,
            }
          : null,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const resetPackagePopMarking = useCallback(() => {
    console.log("📝 [InspectionForm] Resetting package POP marking");
    setInspection(prev => ({
      ...prev,
      packagePopMarking: null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setMLAnalysisResults = useCallback(
    (results: AggregatedAnalysis | null) => {
      console.log(
        "📝 [InspectionForm] Setting ML analysis results:",
        results
          ? {
              labels: results.allDetectedLabels.length,
              hasPOP: !!results.bestPopMarking,
              unNumbers: results.allUnNumbers.length,
            }
          : "null"
      );
      setInspection(prev => ({
        ...prev,
        mlAnalysisResults: results,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const setQuantityType = useCallback(
    (quantityType: "standard" | "excepted" | "limited") => {
      console.log("📝 [InspectionForm] Setting quantity type:", quantityType);
      setInspection(prev => ({
        ...prev,
        quantityType,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const setExceptedQuantityData = useCallback(
    (data: ExceptedQuantityData | null) => {
      console.log("📝 [InspectionForm] Setting excepted quantity data");
      setInspection(prev => ({
        ...prev,
        exceptedQuantityData: data ? { ...data } : null,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const setLimitedQuantityData = useCallback(
    (data: LimitedQuantityData | null) => {
      console.log("📝 [InspectionForm] Setting limited quantity data");
      setInspection(prev => ({
        ...prev,
        limitedQuantityData: data ? { ...data } : null,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const setPackagePackagingType = useCallback(
    (packagingType: "single" | "combination" | "composite" | null) => {
      console.log("📝 [InspectionForm] Setting packaging type:", packagingType);
      setInspection(prev => ({
        ...prev,
        packagePackagingType: packagingType,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const setInspector = useCallback(
    (
      inspector:
        | string
        | {
            inspectorName: string;
            inspectorRank: string | null;
            inspectorTitle: string;
          }
    ) => {
      console.log("📝 [InspectionForm] Setting current inspector:", inspector);
      setInspection(prev => ({
        ...prev,
        inspector: inspector,
      }));
    },
    []
  );

  const value: InspectionFormContextValue = useMemo(
    () => ({
      inspection,
      workflow,
      isProcessing,
      hasUnsavedChanges,
      inspectionId,
      startNewInspection,
      loadInspectionForEdit,
      saveCurrentInspection,
      completeInspection,
      finalizeInspection,
      cancelInspection,
      updateReinspectedInspection,
      setExtractedSDDGContent,
      setVerificationCopy,
      updateVerificationField,
      addFrustration,
      removeFrustration,
      addPackageFrustration,
      removePackageFrustration,
      setCurrentChevron,
      setCurrentSDDGStep,
      setCurrentSDDGScreen,
      completeSDDGSubstep,
      setSDDGComplete,
      setPackageComplete,
      completeSDDGAndMoveToPackage,
      resetWorkflow,
      startSDDGReinspection,
      startPackageReinspection,
      resolvePackageFrustration,
      refrustratePackageFrustration,
      advanceReinspectionItem,
      completeReinspection,
      setMagnetizedMaterialInspection,
      updateMagnetizedMaterialField,
      clearMagnetizedMaterialInspection,
      setInnerPackagingInspection,
      updateInnerPackagingField,
      updateInnerPackagingInspectionItem,
      clearInnerPackagingInspection,
      setKitInspectionData,
      setLabelingContext,
      updateLabelingContextField,
      setPackagePopMarking,
      updatePackagePopField,
      resetPackagePopMarking,
      setMLAnalysisResults,
      setQuantityType,
      setExceptedQuantityData,
      setLimitedQuantityData,
      setPackagePackagingType,
      setInspector,
    }),
    [
      inspection,
      workflow,
      isProcessing,
      hasUnsavedChanges,
      inspectionId,
      startNewInspection,
      loadInspectionForEdit,
      saveCurrentInspection,
      completeInspection,
      finalizeInspection,
      cancelInspection,
      updateReinspectedInspection,
      setExtractedSDDGContent,
      setVerificationCopy,
      updateVerificationField,
      addFrustration,
      removeFrustration,
      addPackageFrustration,
      removePackageFrustration,
      setCurrentChevron,
      setCurrentSDDGStep,
      setCurrentSDDGScreen,
      completeSDDGSubstep,
      setSDDGComplete,
      setPackageComplete,
      completeSDDGAndMoveToPackage,
      resetWorkflow,
      startSDDGReinspection,
      startPackageReinspection,
      resolvePackageFrustration,
      refrustratePackageFrustration,
      advanceReinspectionItem,
      completeReinspection,
      setMagnetizedMaterialInspection,
      updateMagnetizedMaterialField,
      clearMagnetizedMaterialInspection,
      setInnerPackagingInspection,
      updateInnerPackagingField,
      updateInnerPackagingInspectionItem,
      clearInnerPackagingInspection,
      setKitInspectionData,
      setLabelingContext,
      updateLabelingContextField,
      setPackagePopMarking,
      updatePackagePopField,
      resetPackagePopMarking,
      setMLAnalysisResults,
      setQuantityType,
      setExceptedQuantityData,
      setLimitedQuantityData,
      setPackagePackagingType,
      setInspector,
    ]
  );

  return (
    <InspectionFormContext.Provider value={value}>
      {children}
    </InspectionFormContext.Provider>
  );
}

export function useInspectionForm() {
  const context = useContext(InspectionFormContext);
  if (!context) {
    throw new Error(
      "useInspectionForm must be used within InspectionFormProvider"
    );
  }
  return context;
}

// ============================================================================
// PERFORMANCE OPTIMIZATION: Selector Hooks
// ============================================================================
// These hooks provide focused access to specific parts of the context,
// documenting data dependencies and enabling future optimization.
// ============================================================================

/**
 * Actions-only hook - returns only action methods.
 * Use this when you only need to dispatch actions and don't need to read state.
 *
 * PERFORMANCE: Actions are stable useCallback references. Components that
 * only use actions can benefit from reduced re-render scope.
 */
export function useInspectionFormActions() {
  const context = useContext(InspectionFormContext);
  if (!context) {
    throw new Error(
      "useInspectionFormActions must be used within InspectionFormProvider"
    );
  }

  // Return only action methods - these are stable references
  return {
    startNewInspection: context.startNewInspection,
    loadInspectionForEdit: context.loadInspectionForEdit,
    saveCurrentInspection: context.saveCurrentInspection,
    completeInspection: context.completeInspection,
    finalizeInspection: context.finalizeInspection,
    cancelInspection: context.cancelInspection,
    updateReinspectedInspection: context.updateReinspectedInspection,
    setExtractedSDDGContent: context.setExtractedSDDGContent,
    setVerificationCopy: context.setVerificationCopy,
    updateVerificationField: context.updateVerificationField,
    addFrustration: context.addFrustration,
    removeFrustration: context.removeFrustration,
    addPackageFrustration: context.addPackageFrustration,
    removePackageFrustration: context.removePackageFrustration,
    setCurrentChevron: context.setCurrentChevron,
    setCurrentSDDGStep: context.setCurrentSDDGStep,
    setCurrentSDDGScreen: context.setCurrentSDDGScreen,
    completeSDDGSubstep: context.completeSDDGSubstep,
    setSDDGComplete: context.setSDDGComplete,
    setPackageComplete: context.setPackageComplete,
    completeSDDGAndMoveToPackage: context.completeSDDGAndMoveToPackage,
    resetWorkflow: context.resetWorkflow,
    startSDDGReinspection: context.startSDDGReinspection,
    startPackageReinspection: context.startPackageReinspection,
    resolvePackageFrustration: context.resolvePackageFrustration,
    refrustratePackageFrustration: context.refrustratePackageFrustration,
    advanceReinspectionItem: context.advanceReinspectionItem,
    completeReinspection: context.completeReinspection,
    setMagnetizedMaterialInspection: context.setMagnetizedMaterialInspection,
    updateMagnetizedMaterialField: context.updateMagnetizedMaterialField,
    clearMagnetizedMaterialInspection: context.clearMagnetizedMaterialInspection,
    setInnerPackagingInspection: context.setInnerPackagingInspection,
    updateInnerPackagingField: context.updateInnerPackagingField,
    updateInnerPackagingInspectionItem: context.updateInnerPackagingInspectionItem,
    clearInnerPackagingInspection: context.clearInnerPackagingInspection,
    setKitInspectionData: context.setKitInspectionData,
    setLabelingContext: context.setLabelingContext,
    updateLabelingContextField: context.updateLabelingContextField,
    setPackagePopMarking: context.setPackagePopMarking,
    updatePackagePopField: context.updatePackagePopField,
    resetPackagePopMarking: context.resetPackagePopMarking,
    setMLAnalysisResults: context.setMLAnalysisResults,
    setQuantityType: context.setQuantityType,
    setExceptedQuantityData: context.setExceptedQuantityData,
    setLimitedQuantityData: context.setLimitedQuantityData,
    setPackagePackagingType: context.setPackagePackagingType,
    setInspector: context.setInspector,
  };
}

/**
 * Selector hook for frustrations data.
 * Returns both SDDG frustrations and package frustrations.
 */
export function useInspectionFrustrations() {
  const { inspection } = useInspectionForm();
  return {
    frustrations: inspection.frustrations,
    packageFrustrations: inspection.packageFrustrations,
  };
}

/**
 * Selector hook for verification copy data.
 */
export function useVerificationCopy() {
  const { inspection } = useInspectionForm();
  return inspection.verificationCopy;
}

/**
 * Selector hook for extracted SDDG content.
 */
export function useExtractedContent() {
  const { inspection } = useInspectionForm();
  return inspection.extractedContent;
}

/**
 * Selector hook for inspector data.
 */
export function useInspectorData() {
  const { inspection } = useInspectionForm();
  return inspection.inspector;
}

/**
 * Selector hook for workflow state.
 */
export function useWorkflowState() {
  const { workflow } = useInspectionForm();
  return workflow;
}

/**
 * Selector hook for reinspection state.
 */
export function useReinspectionState() {
  const { workflow } = useInspectionForm();
  return workflow.reinspection;
}

/**
 * Selector hook for ML analysis results.
 */
export function useMLAnalysisResults() {
  const { inspection } = useInspectionForm();
  return inspection.mlAnalysisResults;
}

/**
 * Selector hook for package POP marking data.
 */
export function usePackagePopMarking() {
  const { inspection } = useInspectionForm();
  return inspection.packagePopMarking;
}

/**
 * Selector hook for package packaging type.
 */
export function usePackagePackagingType() {
  const { inspection } = useInspectionForm();
  return inspection.packagePackagingType;
}

/**
 * Selector hook for inspection ID.
 */
export function useInspectionId() {
  const { inspectionId } = useInspectionForm();
  return inspectionId;
}
