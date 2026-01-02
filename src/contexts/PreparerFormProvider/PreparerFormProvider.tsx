import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  PreparerFormState,
  initialPreparerFormState,
  HazardousMaterialData,
  LookupFunctionsOutput,
  PackagingData,
  ShipperData,
  ConsigneeData,
  PreparerData,
  ModifiersAndRequiredAcknowledgements,
  POPMarking,
} from './types';

/**
 * PreparerFormProvider Context Interface
 * Manages the current preparer workflow state
 */
interface PreparerFormContextValue {
  // State
  preparerContext: PreparerFormState;
  isProcessing: boolean;
  hasUnsavedChanges: boolean;

  // Lifecycle methods
  startNewShipment: () => void;
  loadShipmentForEdit: (id: string) => Promise<void>;
  saveCurrentShipment: () => Promise<string>;
  completeShipment: () => Promise<{ success: boolean; error?: string }>;
  cancelShipment: () => void;

  // Material management
  setHazardousMaterial: (material: HazardousMaterialData) => void;
  setLookupFunctionsOutput: (output: LookupFunctionsOutput) => void;
  setAllowablePackingGroups: (groups: string) => void;

  // Markings & Labels
  setRequiredMarkings: (markings: Record<string, string>) => void;
  setRequiredLabels: (labels: Record<string, string>) => void;

  // Modifiers & Acknowledgements
  setModifiersAndAcknowledgements: (modifiers: ModifiersAndRequiredAcknowledgements) => void;
  updateModifiersAndAcknowledgements: (updates: Partial<ModifiersAndRequiredAcknowledgements>) => void;

  // Shipment data
  updateShipment: (updates: Partial<PreparerFormState['shipment']>) => void;

  // Packaging management
  updatePackaging: (updates: Partial<PackagingData>) => void;
  setPackagingType: (type: string) => void;
  setPOPMarking: (popData: Partial<POPMarking>) => void;
  setTotalNetMass: (mass: { lbs?: number; kg?: number }) => void;
  setTotalNetVolume: (volume: { liters?: number; gallons?: number }) => void;

  // Shipper/Consignee management
  updateShipper: (updates: Partial<ShipperData>) => void;
  updateConsignee: (updates: Partial<ConsigneeData>) => void;

  // Preparer management
  updatePreparer: (updates: Partial<PreparerData>) => void;
  setPreparerSignature: (signature: string) => void;

  // Workflow management
  setActiveStep: (step: number) => void;
  setActiveSubstep: (substep: string | null) => void;
  completeSubstep: (substep: string) => void;
  setPackagingWizardStep: (step: number) => void;
  setPackagingMethod: (method: string) => void;

  // Certification flags
  setUsesCoeCertification: (uses: boolean) => void;
  setUsesCaaCertification: (uses: boolean) => void;
  setUsesDotSpPermit: (uses: boolean) => void;
  setIsLimitedQuantity: (isLimited: boolean) => void;
  setIsExceptedQuantity: (isExcepted: boolean) => void;

  // SDDG specific fields
  setTechnicalName: (name: string) => void;
  setIsWaste: (isWaste: boolean) => void;
  setAirWaybillNo: (no: string) => void;
  updatePagination: (updates: Partial<PreparerFormState['pagination']>) => void;

  // Generic update for any nested field
  updatePreparerContext: <K extends keyof PreparerFormState>(
    field: K,
    value: PreparerFormState[K]
  ) => void;
}

const PreparerFormContext = createContext<PreparerFormContextValue | undefined>(undefined);

/**
 * PreparerFormProvider Component
 * Manages current preparer shipment state in memory with auto-save to SQLite
 */
export function PreparerFormProvider({ children }: { children: React.ReactNode }) {
  // State (using plain objects, NO PROXIES)
  const [preparerContext, setPreparerContext] = useState<PreparerFormState>({
    ...initialPreparerFormState
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ==================== Lifecycle Methods ====================

  /**
   * Start a new shipment
   */
  const startNewShipment = useCallback(() => {
    console.log('📦 [PreparerForm] Starting new shipment');
    setPreparerContext({ ...initialPreparerFormState });
    setHasUnsavedChanges(false);
  }, []);

  /**
   * Load an existing shipment for editing
   */
  const loadShipmentForEdit = useCallback(async (id: string) => {
    try {
      console.log('📦 [PreparerForm] Loading shipment for edit:', id);
      setIsProcessing(true);

      // TODO: Load from SQLite database when persistence layer is ready
      // const loaded = await database.loadShipment(id);
      // setPreparerContext({ ...loaded.preparerContext });

      setHasUnsavedChanges(false);
      console.log('📦 [PreparerForm] Shipment loaded successfully');

    } catch (error) {
      console.error('📦 [PreparerForm] Failed to load shipment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Save current shipment to database
   */
  const saveCurrentShipment = useCallback(async (): Promise<string> => {
    try {
      console.log('📦 [PreparerForm] Saving current shipment');
      setIsProcessing(true);

      // TODO: Save to SQLite database when persistence layer is ready
      // const id = await database.saveShipment(preparerContext);
      const id = Date.now().toString();

      setHasUnsavedChanges(false);
      console.log('📦 [PreparerForm] Shipment saved successfully:', id);
      return id;

    } catch (error) {
      console.error('📦 [PreparerForm] Failed to save shipment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [preparerContext]);

  /**
   * Complete shipment and save to database
   */
  const completeShipment = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📦 [PreparerForm] Completing shipment');

      // TODO: Validate required fields before completion
      // if (!preparerContext.hazardousMaterial) {
      //   return { success: false, error: 'Hazardous material not selected' };
      // }

      const id = await saveCurrentShipment();

      console.log('📦 [PreparerForm] Shipment completed successfully:', id);
      return { success: true };

    } catch (error) {
      console.error('📦 [PreparerForm] Failed to complete shipment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [saveCurrentShipment]);

  /**
   * Cancel current shipment
   */
  const cancelShipment = useCallback(() => {
    console.log('📦 [PreparerForm] Canceling shipment');
    setPreparerContext({ ...initialPreparerFormState });
    setHasUnsavedChanges(false);
  }, []);

  // ==================== Material Management ====================

  const setHazardousMaterial = useCallback((material: HazardousMaterialData) => {
    setPreparerContext(prev => ({
      ...prev,
      hazardousMaterial: material,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setLookupFunctionsOutput = useCallback((output: LookupFunctionsOutput) => {
    setPreparerContext(prev => ({
      ...prev,
      lookupFunctionsOutput: output,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setAllowablePackingGroups = useCallback((groups: string) => {
    setPreparerContext(prev => ({
      ...prev,
      allowablePackingGroups: groups,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Markings & Labels ====================

  const setRequiredMarkings = useCallback((markings: Record<string, string>) => {
    setPreparerContext(prev => ({
      ...prev,
      requiredMarkings: markings,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setRequiredLabels = useCallback((labels: Record<string, string>) => {
    setPreparerContext(prev => ({
      ...prev,
      requiredLabels: labels,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Modifiers & Acknowledgements ====================

  const setModifiersAndAcknowledgements = useCallback((modifiers: ModifiersAndRequiredAcknowledgements) => {
    setPreparerContext(prev => ({
      ...prev,
      modifiersAndRequiredAcknowledgements: modifiers,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateModifiersAndAcknowledgements = useCallback((updates: Partial<ModifiersAndRequiredAcknowledgements>) => {
    setPreparerContext(prev => ({
      ...prev,
      modifiersAndRequiredAcknowledgements: prev.modifiersAndRequiredAcknowledgements
        ? { ...prev.modifiersAndRequiredAcknowledgements, ...updates }
        : updates as ModifiersAndRequiredAcknowledgements,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Shipment Data ====================

  const updateShipment = useCallback((updates: Partial<PreparerFormState['shipment']>) => {
    setPreparerContext(prev => ({
      ...prev,
      shipment: {
        ...prev.shipment,
        ...updates,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Packaging Management ====================

  const updatePackaging = useCallback((updates: Partial<PackagingData>) => {
    setPreparerContext(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        ...updates,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setPackagingType = useCallback((type: string) => {
    setPreparerContext(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        packagingType: type,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setPOPMarking = useCallback((popData: Partial<POPMarking>) => {
    setPreparerContext(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        inputPOPMarking: {
          ...prev.packaging.inputPOPMarking,
          ...popData,
        },
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setTotalNetMass = useCallback((mass: { lbs?: number; kg?: number }) => {
    setPreparerContext(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        totalNetMass: {
          ...prev.packaging.totalNetMass,
          ...mass,
        },
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setTotalNetVolume = useCallback((volume: { liters?: number; gallons?: number }) => {
    setPreparerContext(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        totalNetVolume: {
          ...prev.packaging.totalNetVolume,
          ...volume,
        },
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Shipper/Consignee Management ====================

  const updateShipper = useCallback((updates: Partial<ShipperData>) => {
    setPreparerContext(prev => ({
      ...prev,
      shipper: {
        ...prev.shipper,
        ...updates,
        // Handle nested address/phone updates
        address: updates.address
          ? { ...prev.shipper.address, ...updates.address }
          : prev.shipper.address,
        phoneNumber: updates.phoneNumber
          ? { ...prev.shipper.phoneNumber, ...updates.phoneNumber }
          : prev.shipper.phoneNumber,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateConsignee = useCallback((updates: Partial<ConsigneeData>) => {
    setPreparerContext(prev => ({
      ...prev,
      consignee: {
        ...prev.consignee,
        ...updates,
        // Handle nested address/phone updates
        address: updates.address
          ? { ...prev.consignee.address, ...updates.address }
          : prev.consignee.address,
        phoneNumber: updates.phoneNumber
          ? { ...prev.consignee.phoneNumber, ...updates.phoneNumber }
          : prev.consignee.phoneNumber,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Preparer Management ====================

  const updatePreparer = useCallback((updates: Partial<PreparerData>) => {
    setPreparerContext(prev => ({
      ...prev,
      preparer: {
        ...prev.preparer,
        ...updates,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setPreparerSignature = useCallback((signature: string) => {
    setPreparerContext(prev => ({
      ...prev,
      preparer: {
        ...prev.preparer,
        signature,
      },
      signature, // Also update top-level signature field
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Workflow Management ====================

  const setActiveStep = useCallback((step: number) => {
    setPreparerContext(prev => ({
      ...prev,
      activeStep: step,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setActiveSubstep = useCallback((substep: string | null) => {
    setPreparerContext(prev => ({
      ...prev,
      activeSubstep: substep,
    }));
  }, []);

  const completeSubstep = useCallback((substep: string) => {
    setPreparerContext(prev => ({
      ...prev,
      completedSubsteps: prev.completedSubsteps.includes(substep)
        ? prev.completedSubsteps
        : [...prev.completedSubsteps, substep],
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setPackagingWizardStep = useCallback((step: number) => {
    setPreparerContext(prev => ({
      ...prev,
      packagingWizardStep: step,
    }));
  }, []);

  const setPackagingMethod = useCallback((method: string) => {
    setPreparerContext(prev => ({
      ...prev,
      packagingMethod: method,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Certification Flags ====================

  const setUsesCoeCertification = useCallback((uses: boolean) => {
    setPreparerContext(prev => ({
      ...prev,
      usesCoeCertification: uses,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setUsesCaaCertification = useCallback((uses: boolean) => {
    setPreparerContext(prev => ({
      ...prev,
      usesCaaCertification: uses,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setUsesDotSpPermit = useCallback((uses: boolean) => {
    setPreparerContext(prev => ({
      ...prev,
      usesDotSpPermit: uses,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setIsLimitedQuantity = useCallback((isLimited: boolean) => {
    setPreparerContext(prev => ({
      ...prev,
      isLimitedQuantity: isLimited,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setIsExceptedQuantity = useCallback((isExcepted: boolean) => {
    setPreparerContext(prev => ({
      ...prev,
      isExceptedQuantity: isExcepted,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== SDDG Specific Fields ====================

  const setTechnicalName = useCallback((name: string) => {
    setPreparerContext(prev => ({
      ...prev,
      technicalName: name,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setIsWaste = useCallback((isWaste: boolean) => {
    setPreparerContext(prev => ({
      ...prev,
      isWaste,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setAirWaybillNo = useCallback((no: string) => {
    setPreparerContext(prev => ({
      ...prev,
      airWaybillNo: no,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updatePagination = useCallback((updates: Partial<PreparerFormState['pagination']>) => {
    setPreparerContext(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        ...updates,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Generic Update ====================

  const updatePreparerContext = useCallback(<K extends keyof PreparerFormState>(
    field: K,
    value: PreparerFormState[K]
  ) => {
    setPreparerContext(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // ==================== Context Value ====================

  const value: PreparerFormContextValue = {
    // State
    preparerContext,
    isProcessing,
    hasUnsavedChanges,

    // Lifecycle
    startNewShipment,
    loadShipmentForEdit,
    saveCurrentShipment,
    completeShipment,
    cancelShipment,

    // Material
    setHazardousMaterial,
    setLookupFunctionsOutput,
    setAllowablePackingGroups,

    // Markings & Labels
    setRequiredMarkings,
    setRequiredLabels,

    // Modifiers
    setModifiersAndAcknowledgements,
    updateModifiersAndAcknowledgements,

    // Shipment
    updateShipment,

    // Packaging
    updatePackaging,
    setPackagingType,
    setPOPMarking,
    setTotalNetMass,
    setTotalNetVolume,

    // Shipper/Consignee
    updateShipper,
    updateConsignee,

    // Preparer
    updatePreparer,
    setPreparerSignature,

    // Workflow
    setActiveStep,
    setActiveSubstep,
    completeSubstep,
    setPackagingWizardStep,
    setPackagingMethod,

    // Certification
    setUsesCoeCertification,
    setUsesCaaCertification,
    setUsesDotSpPermit,
    setIsLimitedQuantity,
    setIsExceptedQuantity,

    // SDDG
    setTechnicalName,
    setIsWaste,
    setAirWaybillNo,
    updatePagination,

    // Generic
    updatePreparerContext,
  };

  return (
    <PreparerFormContext.Provider value={value}>
      {children}
    </PreparerFormContext.Provider>
  );
}

/**
 * Hook to use PreparerFormProvider context
 */
export function usePreparerForm(): PreparerFormContextValue {
  const context = useContext(PreparerFormContext);
  if (!context) {
    throw new Error('usePreparerForm must be used within a PreparerFormProvider');
  }
  return context;
}
