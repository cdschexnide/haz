# Inspector Screen Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate 39 Inspector workflow screens from `src/components/Inspector/` to `src/screens/inspector/` to establish proper separation of screens and reusable components.

**Architecture:** File move operation using `git mv` to preserve history, followed by systematic import path updates. All changes in a single atomic commit for easy rollback.

**Tech Stack:** React Native, Expo, TypeScript, React Navigation

---

## Pre-Flight Checklist

Before starting, verify:
- [ ] Working directory is clean (`git status` shows no uncommitted changes except design doc)
- [ ] On branch `inspector-persona-testing`
- [ ] App builds successfully (`npx expo start` works)

---

## Task 1: Create Folder Structure

**Files:**
- Create: `src/screens/inspector/`
- Create: `src/screens/inspector/inner-packaging/`

**Step 1: Create the directories**

```bash
mkdir -p src/screens/inspector/inner-packaging
```

**Step 2: Verify directories exist**

```bash
ls -la src/screens/
```

Expected output should show `inspector/` alongside existing `SDDG/`.

---

## Task 2: Move Main Screen Files (Batch 1 - Core Workflow)

**Files to move:** 10 core workflow screens

**Step 1: Move core workflow screens**

```bash
cd /Users/codyschexnider/Documents/Technergetics/refactor/haz

git mv src/components/Inspector/InspectorLayoutNavigator.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorHomeScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorDisclaimerScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorWorkflowSelection.tsx src/screens/inspector/
git mv src/components/Inspector/ValidateInspectionScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorHazmatQuantityEntry.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorInitialQuestioningScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorExceptedOrLimitedQuantities.tsx src/screens/inspector/
git mv src/components/Inspector/InteractiveSDDGComplianceScreen.tsx src/screens/inspector/
git mv src/components/Inspector/SDDGManualEntryScreen.tsx src/screens/inspector/
```

**Step 2: Verify files moved**

```bash
ls src/screens/inspector/*.tsx | wc -l
```

Expected: `10`

---

## Task 3: Move Main Screen Files (Batch 2 - Package Inspection)

**Files to move:** 10 package inspection screens

**Step 1: Move package inspection screens**

```bash
git mv src/components/Inspector/MLDetectionScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorPopMarking.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorPOPMarkingDataEntry.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorPOPMethodSelectionScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorPOPScannerScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorPOPScanResultsScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorPackageVerificationScreen.tsx src/screens/inspector/
git mv src/components/Inspector/PackageFrustrationSummary.tsx src/screens/inspector/
git mv src/components/Inspector/PackageInspectionCompleteScreen.tsx src/screens/inspector/
```

**Step 2: Verify files moved**

```bash
ls src/screens/inspector/*.tsx | wc -l
```

Expected: `20`

---

## Task 4: Move Main Screen Files (Batch 3 - Completion & Misc)

**Files to move:** 3 completion/misc screens

**Step 1: Move completion and misc screens**

```bash
git mv src/components/Inspector/InspectorAMC1015Form.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorShippersDeclarationScreen.tsx src/screens/inspector/
```

**Step 2: Verify files moved**

```bash
ls src/screens/inspector/*.tsx | wc -l
```

Expected: `22`

---

## Task 5: Move Main Screen Files (Batch 4 - Material-Specific)

**Files to move:** 13 material-specific screens

**Step 1: Move material-specific screens**

```bash
git mv src/components/Inspector/InspectorDryIceScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorCapacitorsScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorMagnetizedMaterialsScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorSafetyDevicesScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorLifeSavingAppliancesScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorGeneticallyModifiedOrganismsScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorEnginesInternalCombustionScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorFirstAidChemicalKitScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorDangerousGoodsInApparatusScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorBatteryPoweredVehicleScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorLithiumBatteriesScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorCompressedGasesScreen.tsx src/screens/inspector/
git mv src/components/Inspector/InspectorCylinderTypeSelectionScreen.tsx src/screens/inspector/
```

**Step 2: Verify files moved**

```bash
ls src/screens/inspector/*.tsx | wc -l
```

Expected: `35`

---

## Task 6: Move Inner Packaging Screens

**Files to move:** 4 inner packaging screens

**Step 1: Move inner packaging screens**

```bash
git mv src/components/Inspector/InnerPackaging/InnerPackagingConfirmation.tsx src/screens/inspector/inner-packaging/
git mv src/components/Inspector/InnerPackaging/OpeningProcedures.tsx src/screens/inspector/inner-packaging/
git mv src/components/Inspector/InnerPackaging/InnerPackagingInspection.tsx src/screens/inspector/inner-packaging/
git mv src/components/Inspector/InnerPackaging/ClosingProcedures.tsx src/screens/inspector/inner-packaging/
```

**Step 2: Remove empty InnerPackaging directory**

```bash
rmdir src/components/Inspector/InnerPackaging
```

**Step 3: Verify inner packaging files moved**

```bash
ls src/screens/inspector/inner-packaging/*.tsx | wc -l
```

Expected: `4`

**Step 4: Verify total file count**

```bash
find src/screens/inspector -name "*.tsx" | wc -l
```

Expected: `39`

---

## Task 7: Update App.tsx Import

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update the import path**

In `src/App.tsx`, change line 13 from:
```typescript
import InspectorLayoutNavigator from "./components/Inspector/InspectorLayoutNavigator";
```

To:
```typescript
import InspectorLayoutNavigator from "./screens/inspector/InspectorLayoutNavigator";
```

---

## Task 8: Update InspectorLayoutNavigator Imports

**Files:**
- Modify: `src/screens/inspector/InspectorLayoutNavigator.tsx`

**Step 1: Update all imports**

The navigator needs comprehensive import updates. Replace the entire import section (lines 1-50) with:

```typescript
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// Screens in same folder (./*)
import InspectorHomeScreen from "./InspectorHomeScreen";
import InspectorWorkflowSelection from "./InspectorWorkflowSelection";
import InspectorDisclaimerScreen from "./InspectorDisclaimerScreen";
import ValidateInspection from "./ValidateInspectionScreen";
import { InspectorHazmatQuantityEntryScreen } from "./InspectorHazmatQuantityEntry";
import InspectorInitialQuestioningScreen from "./InspectorInitialQuestioningScreen";
import { InspectorExceptedOrLimitedQuantities } from "./InspectorExceptedOrLimitedQuantities";
import InteractiveSDDGComplianceScreen from "./InteractiveSDDGComplianceScreen";
import SDDGManualEntryScreen from "./SDDGManualEntryScreen";
import InspectorShippersDeclarationScreen from "./InspectorShippersDeclarationScreen";
import InspectorPackageVerificationScreen from "./InspectorPackageVerificationScreen";
import InspectorPopMarking from "./InspectorPopMarking";
import InspectorPOPMarkingDataEntry from "./InspectorPOPMarkingDataEntry";
import PackageFrustrationSummary from "./PackageFrustrationSummary";
import PackageInspectionCompleteScreen from "./PackageInspectionCompleteScreen";
import { InspectorAMC1015Form } from "./InspectorAMC1015Form";
import InspectorDryIceScreen from "./InspectorDryIceScreen";
import InspectorCapacitorsScreen from "./InspectorCapacitorsScreen";
import InspectorMagnetizedMaterialsScreen from "./InspectorMagnetizedMaterialsScreen";
import InspectorSafetyDevicesScreen from "./InspectorSafetyDevicesScreen";
import InspectorLifeSavingAppliancesScreen from "./InspectorLifeSavingAppliancesScreen";
import InspectorGeneticallyModifiedOrganismsScreen from "./InspectorGeneticallyModifiedOrganismsScreen";
import InspectorEnginesInternalCombustionScreen from "./InspectorEnginesInternalCombustionScreen";
import InspectorFirstAidChemicalKitScreen from "./InspectorFirstAidChemicalKitScreen";
import InspectorDangerousGoodsInApparatusScreen from "./InspectorDangerousGoodsInApparatusScreen";
import InspectorBatteryPoweredVehicleScreen from "./InspectorBatteryPoweredVehicleScreen";
import InspectorLithiumBatteriesScreen from "./InspectorLithiumBatteriesScreen";
import InspectorCompressedGasesScreen from "./InspectorCompressedGasesScreen";
import InspectorCylinderTypeSelectionScreen from "./InspectorCylinderTypeSelectionScreen";
import InspectorPOPScannerScreen from "./InspectorPOPScannerScreen";
import InspectorPOPScanResultsScreen from "./InspectorPOPScanResultsScreen";
import InspectorPOPMethodSelectionScreen from "./InspectorPOPMethodSelectionScreen";
import MLDetectionScreen from "./MLDetectionScreen";
import InspectorMarkingsLabelsValidationScreen from "./InspectorMarkingsLabelsValidationScreen";

// Inner packaging screens (./inner-packaging/*)
import InnerPackagingConfirmation from "./inner-packaging/InnerPackagingConfirmation";
import OpeningProcedures from "./inner-packaging/OpeningProcedures";
import InnerPackagingInspection from "./inner-packaging/InnerPackagingInspection";
import ClosingProcedures from "./inner-packaging/ClosingProcedures";

// Components that stayed in src/components/ (../../components/*)
import InspectorMainLayout from "../../components/Inspector/InspectorMainLayout";
import ShippersDeclarationScreen from "../../components/ShippersDeclarationScreen";
import SDDGUploadAndParse from "../../components/SDDGUploadAndParse";
import SDDGVerificationScreen from "../../components/SDDGVerificationScreen";
import SDDGFrustrationSummary from "../../components/SDDGFrustrationSummary";
import SDDGComplianceValidation from "../../components/SDDGComplianceValidation";
import SDDGInspectionCompleteScreen from "../../components/SDDGInspectionCompleteScreen";

// SDDG screens in src/screens/SDDG/ (../SDDG/*)
import SDDGCameraScreen from "../SDDG/SDDGCameraScreen";
import SDDGProcessingScreen from "../SDDG/SDDGProcessingScreen";
import SDDGRegionAdjustmentScreen from "../SDDG/SDDGRegionAdjustmentScreen";
```

---

## Task 9: Update Screen Import Paths (Automated)

**Description:** Each of the 35 moved screen files needs import path updates. We'll handle this systematically.

**Import Path Mapping (from `src/screens/inspector/`):**

| Old Path Pattern | New Path Pattern |
|-----------------|------------------|
| `../TopNavBar` | `../../components/TopNavBar` |
| `../ui` | `../../components/ui` |
| `../ui/...` | `../../components/ui/...` |
| `../dev/...` | `../../components/dev/...` |
| `../GasCalculatorTool` | `../../components/GasCalculatorTool` |
| `../DryIceCalculator` | `../../components/DryIceCalculator` |
| `../UnitConversionTool` | `../../components/UnitConversionTool` |
| `../PlacardingTool` | `../../components/PlacardingTool` |
| `../CompatibilitySegregationModal` | `../../components/CompatibilitySegregationModal` |
| `../../contexts/...` | `../../contexts/...` (unchanged) |
| `../../ml/...` | `../../ml/...` (unchanged) |
| `../../stores/...` | `../../stores/...` (unchanged) |
| `../../utils/...` | `../../utils/...` (unchanged) |
| `../../types/...` | `../../types/...` (unchanged) |
| `../../../src/contexts/...` | `../../contexts/...` |
| `../../../src/types/...` | `../../types/...` |
| `../../../src/theming/...` | `../../theming/...` |
| `../../../src/utils/...` | `../../utils/...` |
| `./InspectorAMC1015Form` | `./InspectorAMC1015Form` (unchanged - same folder) |
| `./MLDetectionScreen` | `./MLDetectionScreen` (unchanged - same folder) |

**Import Path Mapping (from `src/screens/inspector/inner-packaging/`):**

| Old Path Pattern | New Path Pattern |
|-----------------|------------------|
| `../../../../src/contexts/...` | `../../../contexts/...` |
| `../../../../src/utils/...` | `../../../utils/...` |
| `../../../../src/types/...` | `../../../types/...` |

**Step 1: Run systematic import updates**

For each file in `src/screens/inspector/`, update imports according to the mapping table above.

**Key files requiring significant updates:**
1. `InspectorHomeScreen.tsx` - has many `../` imports to components
2. `MLDetectionScreen.tsx` - imports from `../ui`, `../dev`
3. `InteractiveSDDGComplianceScreen.tsx` - imports Inspector components
4. All material-specific screens - similar patterns

---

## Task 10: Update InspectorHomeScreen.tsx Imports

**Files:**
- Modify: `src/screens/inspector/InspectorHomeScreen.tsx`

**Step 1: Update import paths**

Replace the import section. Key changes:

```typescript
// Change these imports:
import { HazProPreparerContext } from "../../../src/contexts/HazProPreparerProvider/HazProPreparerContext";
import TopNavBar from "../TopNavBar";
import { useNavigationRef } from "../../../src/contexts/NavigationRefProvider/useNavigationRef";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";
import legacyColors from "../../../src/theming/colors";
import GasCalculatorTool from "../GasCalculatorTool";
import DryIceCalculator from "../DryIceCalculator";
import UnitConversionTool from "../UnitConversionTool";
import PlacardingTool from "../PlacardingTool";
import CompatibilitySegregationModal from "../CompatibilitySegregationModal";
import { InspectorShipment } from "../../../src/types/sddg";
import { useDatabase } from "../../../src/contexts/DataProvider";
import { useInspectionFormActions } from "../../../src/contexts/InspectionFormProvider";
import { InspectorAMC1015Form } from "./InspectorAMC1015Form";
import { MLDetectionScreen } from "./MLDetectionScreen";
import { DevBenchmarkButton } from "../dev/DevBenchmarkButton";
import { colors, spacing, borderRadius, shadows } from "../ui";

// To these:
import { HazProPreparerContext } from "../../contexts/HazProPreparerProvider/HazProPreparerContext";
import TopNavBar from "../../components/TopNavBar";
import { useNavigationRef } from "../../contexts/NavigationRefProvider/useNavigationRef";
import { HazProInspectorContext } from "../../contexts/HazProInspectorProvider/HazProInspectorContext";
import legacyColors from "../../theming/colors";
import GasCalculatorTool from "../../components/GasCalculatorTool";
import DryIceCalculator from "../../components/DryIceCalculator";
import UnitConversionTool from "../../components/UnitConversionTool";
import PlacardingTool from "../../components/PlacardingTool";
import CompatibilitySegregationModal from "../../components/CompatibilitySegregationModal";
import { InspectorShipment } from "../../types/sddg";
import { useDatabase } from "../../contexts/DataProvider";
import { useInspectionFormActions } from "../../contexts/InspectionFormProvider";
import { InspectorAMC1015Form } from "./InspectorAMC1015Form";
import { MLDetectionScreen } from "./MLDetectionScreen";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { colors, spacing, borderRadius, shadows } from "../../components/ui";
```

---

## Task 11: Update MLDetectionScreen.tsx Imports

**Files:**
- Modify: `src/screens/inspector/MLDetectionScreen.tsx`

**Step 1: Update import paths**

Key changes needed:

```typescript
// Change:
import { DevBenchmarkButton } from "../dev/DevBenchmarkButton";
import { ScreenHeader, ActionFooter, InfoBox, colors, spacing, borderRadius } from "../ui";

// To:
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { ScreenHeader, ActionFooter, InfoBox, colors, spacing, borderRadius } from "../../components/ui";
```

Note: The `../../ml/...`, `../../contexts/...`, `../../stores/...` imports remain unchanged.

---

## Task 12: Update Inner Packaging Screen Imports

**Files:**
- Modify: `src/screens/inspector/inner-packaging/InnerPackagingConfirmation.tsx`
- Modify: `src/screens/inspector/inner-packaging/OpeningProcedures.tsx`
- Modify: `src/screens/inspector/inner-packaging/InnerPackagingInspection.tsx`
- Modify: `src/screens/inspector/inner-packaging/ClosingProcedures.tsx`

**Step 1: Update InnerPackagingConfirmation.tsx**

```typescript
// Change:
import { useInspectionForm } from "../../../../src/contexts/InspectionFormProvider";
import { parseContainerTypeFromQuantityPacking, getContainerTypeLabel } from "../../../../src/utils/innerPackagingParser";
import { initializeInnerPackagingInspection } from "../../../../src/utils/innerPackagingInspection";

// To:
import { useInspectionForm } from "../../../contexts/InspectionFormProvider";
import { parseContainerTypeFromQuantityPacking, getContainerTypeLabel } from "../../../utils/innerPackagingParser";
import { initializeInnerPackagingInspection } from "../../../utils/innerPackagingInspection";
```

**Step 2: Apply similar changes to other inner packaging files**

All `../../../../src/` paths become `../../../`.

---

## Task 13: Update Remaining Screen Files

**Description:** Update imports in all remaining screen files systematically.

**Files to update (apply pattern from Tasks 10-12):**
- InspectorDisclaimerScreen.tsx
- InspectorWorkflowSelection.tsx
- ValidateInspectionScreen.tsx
- InspectorHazmatQuantityEntry.tsx
- InspectorInitialQuestioningScreen.tsx
- InspectorExceptedOrLimitedQuantities.tsx
- InteractiveSDDGComplianceScreen.tsx
- SDDGManualEntryScreen.tsx
- InspectorShippersDeclarationScreen.tsx
- InspectorPackageVerificationScreen.tsx
- InspectorPopMarking.tsx
- InspectorPOPMarkingDataEntry.tsx
- InspectorPOPMethodSelectionScreen.tsx
- InspectorPOPScannerScreen.tsx
- InspectorPOPScanResultsScreen.tsx
- InspectorMarkingsLabelsValidationScreen.tsx
- PackageFrustrationSummary.tsx
- PackageInspectionCompleteScreen.tsx
- InspectorAMC1015Form.tsx
- InspectorDryIceScreen.tsx
- InspectorCapacitorsScreen.tsx
- InspectorMagnetizedMaterialsScreen.tsx
- InspectorSafetyDevicesScreen.tsx
- InspectorLifeSavingAppliancesScreen.tsx
- InspectorGeneticallyModifiedOrganismsScreen.tsx
- InspectorEnginesInternalCombustionScreen.tsx
- InspectorFirstAidChemicalKitScreen.tsx
- InspectorDangerousGoodsInApparatusScreen.tsx
- InspectorBatteryPoweredVehicleScreen.tsx
- InspectorLithiumBatteriesScreen.tsx
- InspectorCompressedGasesScreen.tsx
- InspectorCylinderTypeSelectionScreen.tsx

**Common patterns to apply:**
- `../` → `../../components/` (for component imports)
- `../ui` → `../../components/ui`
- `../dev/` → `../../components/dev/`
- `../../../src/` → `../../` (remove redundant path)
- Screen-to-screen imports (`./SomeScreen`) stay the same

---

## Task 14: Verify TypeScript Compilation

**Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors (or only pre-existing errors unrelated to this migration)

**Step 2: If errors occur, fix import paths**

Common error patterns:
- "Cannot find module './...' " → Wrong relative path
- "Module not found" → Missing file or wrong path

---

## Task 15: Verify App Builds

**Step 1: Start Expo**

```bash
npx expo start
```

**Step 2: Verify no Metro bundler errors**

Expected: App should start without import/module resolution errors.

**Step 3: Test navigation**

1. Launch app on simulator/device
2. Navigate to Inspector workflow
3. Verify InspectorHomeScreen loads
4. Start a new inspection
5. Navigate through SDDG flow
6. Verify navigation works correctly

---

## Task 16: Run Existing Tests

**Step 1: Run test suite**

```bash
npm test
```

**Step 2: Fix any broken test imports**

If tests fail due to import paths, update:
- `src/components/Inspector/__tests__/InspectorHomeScreen.test.tsx`

The test file imports the screen, so it needs path update:

```typescript
// Change:
import InspectorHomeScreen from "../InspectorHomeScreen";

// To:
import InspectorHomeScreen from "../../../screens/inspector/InspectorHomeScreen";
```

---

## Task 17: Commit Changes

**Step 1: Stage all changes**

```bash
git add -A
```

**Step 2: Review staged changes**

```bash
git status
```

Expected: ~40 renamed files, ~40 modified files (import updates)

**Step 3: Commit with descriptive message**

```bash
git commit -m "$(cat <<'EOF'
refactor(inspector): migrate screens to src/screens/inspector

Move 39 Inspector workflow screen files from src/components/Inspector/
to src/screens/inspector/ to establish proper separation of concerns
between screens (routes) and reusable UI components.

Changes:
- Create src/screens/inspector/ folder structure
- Move 35 main screen files to src/screens/inspector/
- Move 4 inner packaging screens to src/screens/inspector/inner-packaging/
- Update InspectorLayoutNavigator imports
- Update App.tsx import path
- Update all screen import paths for new location
- Keep reusable components in src/components/Inspector/

Files moved:
- InspectorLayoutNavigator.tsx
- InspectorHomeScreen.tsx
- MLDetectionScreen.tsx
- 32 other screen files
- 4 inner packaging screen files

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Update Documentation

**Files:**
- Modify: `docs/architecture/inspector-workflow-and-ml-detection.md`

**Step 1: Update file paths in documentation**

In the "File Locations Summary" table and "Quick Reference: File Paths" section, update all paths from:
- `src/components/Inspector/...` → `src/screens/inspector/...`

---

## Task 19: Final Verification

**Step 1: Clean build**

```bash
rm -rf node_modules/.cache
npx expo start --clear
```

**Step 2: Full navigation test**

1. Launch Inspector workflow
2. Complete full SDDG capture flow
3. Complete package inspection flow
4. Generate AMC Form 1015
5. Return to home

**Step 3: Verify git history preserved**

```bash
git log --follow src/screens/inspector/InspectorHomeScreen.tsx
```

Expected: Shows full commit history including commits before the move.

---

## Success Criteria

- [ ] All 39 files moved to `src/screens/inspector/`
- [ ] All imports updated correctly
- [ ] TypeScript compilation succeeds
- [ ] Expo builds without errors
- [ ] App navigation works correctly
- [ ] Existing tests pass
- [ ] Git history preserved for moved files
- [ ] Documentation updated

---

## Rollback Plan

If something goes wrong:

```bash
git reset --hard HEAD~1
```

This reverts all changes since everything is in a single commit.

---

## Notes for Executor

1. **Import updates are the critical path** - most time will be spent fixing imports
2. **Use IDE "Find and Replace" in files** - for bulk import updates
3. **TypeScript errors guide you** - run `npx tsc --noEmit` frequently
4. **Test incrementally** - don't wait until the end to test navigation
5. **The navigator is the source of truth** - if a screen import fails in the navigator, fix it there first
