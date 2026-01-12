# InspectionFormProvider Context Selectors Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add selector hooks to InspectionFormProvider to reduce re-renders in Inspector screens

**Architecture:** Create specialized hooks that extract specific data from the context, enabling components to subscribe to only what they need. Actions-only hook provides stable references that don't trigger re-renders.

**Tech Stack:** React Context, useMemo, useCallback

---

## Analysis Summary

From field usage analysis across 11 Inspector screens:

| Screen | Data Fields Needed | Actions Needed |
|--------|-------------------|----------------|
| SDDGUploadAndParse | extractedContent | setExtractedSDDGContent, setVerificationCopy |
| InteractiveSDDGComplianceScreen | verificationCopy, extractedContent, frustrations, workflow | addFrustration, removeFrustration, updateVerificationField, etc. |
| SDDGFrustrationSummary | frustrations, verificationCopy, workflow.reinspection | removeFrustration, startSDDGReinspection |
| SDDGInspectionCompleteScreen | verificationCopy, frustrations, inspector, workflow | completeSDDGAndMoveToPackage |
| InspectorMarkingsLabelsValidationScreen | verificationCopy, packageFrustrations, workflow | addPackageFrustration, removePackageFrustration |
| PackageFrustrationSummary | packageFrustrations, verificationCopy, inspector, workflow | removePackageFrustration, resolvePackageFrustration |
| PackageInspectionCompleteScreen | verificationCopy, frustrations, packageFrustrations, inspector, workflow | completeInspection, updateReinspectedInspection, completeReinspection |
| MLDetectionScreen | mlAnalysisResults | setMLAnalysisResults |
| InspectorPOPMarkingDataEntry | packagePopMarking | setPackagePopMarking, updatePackagePopField, resetPackagePopMarking |
| InspectorAMC1015Form | inspection (full), inspectionId | saveCurrentInspection |
| InspectorHomeScreen | (none - only navigation) | startNewInspection |

## Selector Hooks to Implement

### Task 1: Create Actions-Only Hook

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:1422-1430`

**Implementation:**

```typescript
/**
 * Actions-only hook - NO reactive state subscription.
 * Use this when you only need to dispatch actions and don't need to read state.
 *
 * PERFORMANCE: Actions are stable useCallback references, so this hook
 * minimizes re-renders compared to useInspectionForm().
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
    setPackagePopMarking: context.setPackagePopMarking,
    updatePackagePopField: context.updatePackagePopField,
    resetPackagePopMarking: context.resetPackagePopMarking,
    setMLAnalysisResults: context.setMLAnalysisResults,
    setInspector: context.setInspector,
  };
}
```

### Task 2: Create State Selector Hooks

Add below useInspectionFormActions():

```typescript
/**
 * Selector hook for frustrations data.
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
 * Selector hook for inspection ID.
 */
export function useInspectionId() {
  const { inspectionId } = useInspectionForm();
  return inspectionId;
}
```

### Task 3: Update Screens to Use Selector Hooks

Update each screen to use the appropriate selector hooks instead of destructuring everything from useInspectionForm().

**Example pattern:**
```typescript
// Before
const { inspection, workflow, addFrustration, removeFrustration } = useInspectionForm();

// After
const { addFrustration, removeFrustration } = useInspectionFormActions();
const { frustrations } = useInspectionFrustrations();
const workflow = useWorkflowState();
```

---

## Implementation Order

1. Add selector hooks to InspectionFormProvider.tsx
2. Update screens one by one (no functional changes, just import changes)
3. Verify TypeScript compilation
4. Test each screen manually

## Constraint Reminder

**CRITICAL:** This is performance-only optimization. Every change must pass:
"Does the app still do exactly what it did before, just faster?"
