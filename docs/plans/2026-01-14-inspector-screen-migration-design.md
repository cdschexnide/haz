# Inspector Screen Migration Design

**Date:** 2026-01-14
**Author:** Claude Code (brainstorming session)
**Status:** Approved

## Summary

Migrate Inspector workflow screens from `src/components/Inspector/` to `src/screens/inspector/` to establish proper separation of concerns between screens (routes) and reusable UI components.

## Current State

- Inspector screens are scattered in `src/components/Inspector/` (65+ files)
- No clear distinction between screens and reusable components
- Some SDDG screens already exist in `src/screens/SDDG/` (3 files)
- `InspectorLayoutNavigator.tsx` registers all screen routes

## Goals

1. Create `src/screens/inspector/` folder for Inspector workflow screens
2. Move screen files (routes registered in navigator) to new location
3. Keep reusable UI components in `src/components/Inspector/`
4. Update all import paths
5. Preserve git history using `git mv`

## Decisions Made

| Decision | Choice |
|----------|--------|
| Screen identification | Files registered in InspectorLayoutNavigator.tsx |
| Folder naming | `src/screens/inspector` (lowercase) |
| Navigator location | Move to `src/screens/inspector/` |
| Inner packaging subfolder | `src/screens/inspector/inner-packaging/` (kebab-case) |
| Migration approach | Big Bang - all at once in one commit |

## New Folder Structure

```
src/screens/inspector/
├── InspectorLayoutNavigator.tsx
├── InspectorHomeScreen.tsx
├── InspectorDisclaimerScreen.tsx
├── InspectorWorkflowSelection.tsx
│
├── # SDDG-related screens
├── InteractiveSDDGComplianceScreen.tsx
├── SDDGManualEntryScreen.tsx
│
├── # Package Inspection flow
├── MLDetectionScreen.tsx
├── InspectorPopMarking.tsx
├── InspectorPOPMarkingDataEntry.tsx
├── InspectorPOPMethodSelectionScreen.tsx
├── InspectorPOPScannerScreen.tsx
├── InspectorPOPScanResultsScreen.tsx
├── InspectorMarkingsLabelsValidationScreen.tsx
├── InspectorPackageVerificationScreen.tsx
├── PackageFrustrationSummary.tsx
├── PackageInspectionCompleteScreen.tsx
├── InspectorAMC1015Form.tsx
│
├── # Material-specific screens
├── InspectorDryIceScreen.tsx
├── InspectorCapacitorsScreen.tsx
├── InspectorMagnetizedMaterialsScreen.tsx
├── InspectorSafetyDevicesScreen.tsx
├── InspectorLifeSavingAppliancesScreen.tsx
├── InspectorGeneticallyModifiedOrganismsScreen.tsx
├── InspectorEnginesInternalCombustionScreen.tsx
├── InspectorFirstAidChemicalKitScreen.tsx
├── InspectorDangerousGoodsInApparatusScreen.tsx
├── InspectorBatteryPoweredVehicleScreen.tsx
├── InspectorLithiumBatteriesScreen.tsx
├── InspectorCompressedGasesScreen.tsx
├── InspectorCylinderTypeSelectionScreen.tsx
│
├── # Additional screens
├── InspectorShippersDeclarationScreen.tsx
├── InspectorHazmatQuantityEntry.tsx
├── InspectorInitialQuestioningScreen.tsx
├── InspectorExceptedOrLimitedQuantities.tsx
├── ValidateInspectionScreen.tsx
│
└── inner-packaging/
    ├── InnerPackagingConfirmation.tsx
    ├── OpeningProcedures.tsx
    ├── InnerPackagingInspection.tsx
    └── ClosingProcedures.tsx
```

## Files Staying in src/components/Inspector/

These are reusable UI components, not screens:

- Form1015CheckboxWithStatus.tsx
- InspectorChecklistItem.tsx
- InspectorChevronHeaderCell.tsx
- InspectorMainLayout.tsx (wrapper component)
- InspectorForm1015LabelingAndMarkingChecklist.tsx
- InspectorForm1015PackagingChecklist.tsx
- InspectorFormSDDGChecklist.tsx
- InspectorInitialQuestioningChecklist.tsx
- InspectorSDDGMiniPreview.tsx
- InspectorSDDGModalView.tsx
- InspectorShippersDeclarationForm.tsx
- InspectorWorkflowChevron.tsx
- InspectorWorkflowRow.tsx
- SDDGFieldModal.tsx
- SDDGRecommendedFrustrationBanner.tsx
- SDDGWorkflowHeader.tsx
- SimpleFieldEditModal.tsx
- TappableSDDGField.tsx
- TappableTableCell.tsx
- InteractiveSDDGForm.tsx
- ModalViews/ folder (DecisionView, EditValueView, FrustrationDetailsView, RecommendedIssueView, ReportIssueView)
- `__tests__/` folder

## Import Path Updates

### Navigator imports (from src/screens/inspector/InspectorLayoutNavigator.tsx)

```typescript
// Screen imports - same folder
import InspectorHomeScreen from "./InspectorHomeScreen";
import MLDetectionScreen from "./MLDetectionScreen";

// Component imports - need path change
import InspectorMainLayout from "../../components/Inspector/InspectorMainLayout";
import SDDGUploadAndParse from "../../components/SDDGUploadAndParse";

// SDDG screens already in screens folder
import SDDGCameraScreen from "../SDDG/SDDGCameraScreen";

// Inner packaging - subfolder
import InnerPackagingConfirmation from "./inner-packaging/InnerPackagingConfirmation";
```

### Screen imports to UI components

```typescript
// From src/screens/inspector/SomeScreen.tsx
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { ContentCard } from "../../components/ui/ContentCard";
import InspectorMainLayout from "../../components/Inspector/InspectorMainLayout";
```

## Execution Steps

1. **Create folder structure**
   ```bash
   mkdir -p src/screens/inspector/inner-packaging
   ```

2. **Move files using git mv** (preserves history)
   - Move 34 main screen files
   - Move 4 inner packaging screen files
   - Move InspectorLayoutNavigator.tsx

3. **Update imports in moved files**
   - UI components: `../../components/ui/...`
   - Inspector components: `../../components/Inspector/...`
   - Other components: `../../components/...`
   - Contexts: `../../contexts/...`
   - Utils: `../../utils/...`

4. **Update imports in external files**
   - Root app/navigation files referencing InspectorLayoutNavigator

5. **Verify build**
   ```bash
   npx expo start
   ```

6. **Run tests**
   ```bash
   npm test
   ```

7. **Commit**
   ```bash
   git commit -m "refactor(inspector): migrate screens to src/screens/inspector"
   ```

## Files to Move (Complete List)

### Main Screens (34 files)

1. InspectorHomeScreen.tsx
2. InspectorWorkflowSelection.tsx
3. InspectorDisclaimerScreen.tsx
4. ValidateInspectionScreen.tsx
5. InspectorHazmatQuantityEntry.tsx
6. InspectorInitialQuestioningScreen.tsx
7. InspectorExceptedOrLimitedQuantities.tsx
8. InteractiveSDDGComplianceScreen.tsx
9. SDDGManualEntryScreen.tsx
10. InspectorShippersDeclarationScreen.tsx
11. InspectorPackageVerificationScreen.tsx
12. InspectorPopMarking.tsx
13. InspectorPOPMarkingDataEntry.tsx
14. InspectorPOPMethodSelectionScreen.tsx
15. InspectorPOPScannerScreen.tsx
16. InspectorPOPScanResultsScreen.tsx
17. MLDetectionScreen.tsx
18. InspectorMarkingsLabelsValidationScreen.tsx
19. PackageFrustrationSummary.tsx
20. PackageInspectionCompleteScreen.tsx
21. InspectorAMC1015Form.tsx
22. InspectorDryIceScreen.tsx
23. InspectorCapacitorsScreen.tsx
24. InspectorMagnetizedMaterialsScreen.tsx
25. InspectorSafetyDevicesScreen.tsx
26. InspectorLifeSavingAppliancesScreen.tsx
27. InspectorGeneticallyModifiedOrganismsScreen.tsx
28. InspectorEnginesInternalCombustionScreen.tsx
29. InspectorFirstAidChemicalKitScreen.tsx
30. InspectorDangerousGoodsInApparatusScreen.tsx
31. InspectorBatteryPoweredVehicleScreen.tsx
32. InspectorLithiumBatteriesScreen.tsx
33. InspectorCompressedGasesScreen.tsx
34. InspectorCylinderTypeSelectionScreen.tsx

### Inner Packaging Screens (4 files)

35. InnerPackaging/InnerPackagingConfirmation.tsx
36. InnerPackaging/OpeningProcedures.tsx
37. InnerPackaging/InnerPackagingInspection.tsx
38. InnerPackaging/ClosingProcedures.tsx

### Navigator (1 file)

39. InspectorLayoutNavigator.tsx

**Total: 39 files to move**

## Risk Mitigation

- Use `git mv` to preserve file history
- Run build immediately after migration to catch import errors
- Expo/React Native will fail fast on broken imports
- All changes in single commit for easy rollback if needed

## Success Criteria

- [ ] All 39 files moved to `src/screens/inspector/`
- [ ] All imports updated and build succeeds
- [ ] Tests pass
- [ ] App runs without navigation errors
- [ ] Git history preserved for moved files
