# Preparer Workflow Remaining Phases - Claude Code Handoff

**Date:** 2026-01-20
**Scope:** Phases 1-3 + Specialty Screens (~15 screens remaining)
**Prerequisite:** Phase 4-6 patterns established

---

## Project Context

You are continuing a React Native (Expo) hazardous materials preparation app refactoring project called HazPro. Previous phases have established patterns and components that you must build upon.

### Repository Structure
```
/Users/codyschexnider/Documents/Technergetics/refactor/haz/
├── src/
│   ├── components/           # Legacy components (to be refactored)
│   │   ├── ui/              # UI component library (19+ components)
│   │   │   ├── index.ts     # Centralized exports
│   │   │   ├── theme.ts     # Design tokens
│   │   │   ├── WizardContainer.tsx  # (To be created in Phase 4)
│   │   │   ├── GridSelector.tsx     # (To be created in Phase 4)
│   │   │   └── Button.tsx, FormField.tsx, ActionFooter.tsx, etc.
│   │   └── preparer/        # Preparer-specific shared components
│   │       ├── index.ts
│   │       ├── POPMarkingForm.tsx   # (To be created in Phase 4)
│   │       └── AddressFormSection.tsx, SignatureSection.tsx, etc.
│   ├── screens/
│   │   └── preparer/        # Refactored preparer screens
│   │       ├── index.ts
│   │       └── LabelingAndMarkingScreen.tsx, ShippersDeclarationScreen.tsx, etc.
│   └── stores/              # Valtio state management
│       └── useHazProStore.ts
└── docs/
    ├── architecture/
    │   └── preparer-workflow.md    # Complete workflow documentation
    └── plans/
        ├── 2026-01-15-preparer-phase5-6-ui-refactor-design.md
        ├── 2026-01-16-preparer-phase4-ui-refactor-design.md
        └── 2026-01-16-preparer-phase4-implementation.md
```

### Branch Information
- Current branch: `inspector-persona-testing`
- Base branch: `temp-transfer`

---

## Completed Work (Reference Only)

### Phase 5-6: Documentation & Certification (COMPLETED)
**Screens migrated:**
- `LabelingAndMarkingScreen` (862 → ~180 lines)
- `ShippersDeclarationScreen` (1,380 → ~500 lines)
- `CertifyFormScreen` (373 → ~150 lines)

**Components created:**
- UI: `KeyValueRow`, `ChecklistItem`, `LoadingOverlay`, `DocumentModal`
- Preparer: `SignatureSection`, `VehicleLabelingNotice`, `StandardLabelingContent`, `CertificationInfoCard`

### Phase 4: Packaging Selection (DESIGN & PLAN COMPLETED, NOT YET IMPLEMENTED)
**Design:** `docs/plans/2026-01-16-preparer-phase4-ui-refactor-design.md`
**Implementation Plan:** `docs/plans/2026-01-16-preparer-phase4-implementation.md`

**Components to be created:**
- UI: `WizardContainer`, `GridSelector`
- Preparer: `POPMarkingForm`, `POPMarkingDisplay`, `PackagingCodeCard`

**Screens to be migrated (16 screens, ~13,000 lines):**
- PackagingScreen, PackagingWizardV2, GrandfatheredWizard, CylinderEntryScreen
- POPMarkingDataEntry, POPScannerScreen, POPScanResultsScreen
- InnerPackagingWizard, A8_5PackagingWizard
- And more (see implementation plan)

---

## Your Task: Design Remaining Phases

Create a refactor design document for the **remaining preparer workflow screens** that have NOT been addressed in Phases 4-6.

### Screens to Analyze and Include

**Phase 1: Shipment Creation**
| Screen | File | Est. Lines | Purpose |
|--------|------|------------|---------|
| PreparerHomeScreen | `src/components/PreparerHomeScreen.tsx` | ~TBD | Entry point, shipment list |
| DisclaimerScreen | `src/components/DisclaimerScreen.tsx` | ~TBD | Legal disclaimer |
| ShipmentCreationScreen | `src/components/ShipmentCreationScreen.tsx` | ~TBD | TCN, shipper/consignee entry |

**Phase 2: Material Identification**
| Screen | File | Est. Lines | Purpose |
|--------|------|------------|---------|
| MaterialIDScreen | `src/components/MaterialIDScreen.tsx` | ~TBD | UN number search, material selection |
| ExplosiveDetailsWizard | `src/components/ExplosiveDetailsWizard.tsx` | ~TBD | Grandfathered explosive wizard |

**Phase 3: Quantity Entry**
| Screen | File | Est. Lines | Purpose |
|--------|------|------------|---------|
| QuantityEntryScreen | `src/components/QuantityEntryScreen.tsx` | ~TBD | Quantity input, eligibility check |
| SpecialProvisionsAcknowledgementScreen | `src/components/SpecialProvisionsAcknowledgementScreen.tsx` | ~TBD | SP acknowledgement |

**Specialty Material Screens (UNID-Based Routing)**
| Screen | File | UN Numbers | Purpose |
|--------|------|------------|---------|
| UN3166FuelEntryScreen | `src/components/UN3166FuelEntryScreen.tsx` | UN3166 | Vehicle fuel entry |
| MagnetizedMaterialPrepScreen | `src/components/MagnetizedMaterialPrepScreen.tsx` | UN2807 | Magnetized material |
| SafetyDevicesPreparationScreen | `src/components/SafetyDevicesPreparationScreen.tsx` | UN3268 | Safety devices |
| DryIcePrepScreen | `src/components/DryIcePrepScreen.tsx` | UN1845 | Dry ice |
| LithiumBatteriesPrepScreen | `src/components/LithiumBatteriesPrepScreen.tsx` | UN3090, UN3480 | Lithium batteries |
| EnginesInternalCombustion | `src/components/EnginesInternalCombustion.tsx` | UN3529, etc. | Engines |
| BatteryPoweredVehicle | `src/components/BatteryPoweredVehicle.tsx` | UN3171 | Battery vehicles |
| LifeSavingAppliances | `src/components/LifeSavingAppliances.tsx` | UN3072, UN2990 | Life saving |
| KitPreparationScreen | `src/components/KitPreparationScreen.tsx` | UN3316 | Kits |
| AbsorbentCushioningRequirements | `src/components/AbsorbentCushioningRequirements.tsx` | N/A | Liquid packaging |

---

## Established Patterns to Follow

### UI Component Library (`src/components/ui/`)
Import from `@/components/ui`:
- Layout: `ScreenHeader`, `ActionFooter`, `SectionHeader`, `WizardContainer` (Phase 4)
- Forms: `FormField`, `FormInput`, `FormRow`, `RadioGroup`, `DatePickerField`
- Display: `Button`, `InfoBox`, `DetailCard`, `KeyValueRow`, `ChecklistItem`
- Overlays: `LoadingOverlay`, `DocumentModal`, `StepIndicator`
- Selection: `GridSelector` (Phase 4)

### Theme Tokens (`src/components/ui/theme.ts`)
```typescript
colors.primary, colors.success, colors.error, colors.warning
colors.textPrimary, colors.textSecondary, colors.border, colors.background, colors.surface
spacing.xs (4), spacing.sm (8), spacing.md (12), spacing.lg (16), spacing.xl (20)
borderRadius.sm (4), borderRadius.md (8), borderRadius.lg (12)
typography.headerTitle, typography.cardTitle, typography.body, typography.caption
```

### Screen Structure Pattern
```typescript
import { ScreenHeader, ActionFooter, colors, spacing } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';

export const ScreenName: React.FC<Props> = ({ navigation }) => {
  const { state, store, actions } = useHazProStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Title" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>{/* Content */}</ScrollView>
      <ActionFooter buttons={[...]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
});
```

---

## Key Reference Documents

Before starting, read these documents thoroughly:

1. **Workflow Architecture:** `docs/architecture/preparer-workflow.md`
   - Complete workflow diagram
   - Screen-by-screen breakdown
   - State management patterns
   - Navigation routing

2. **Phase 5-6 Design:** `docs/plans/2026-01-15-preparer-phase5-6-ui-refactor-design.md`
   - Component extraction patterns
   - Line reduction strategies

3. **Phase 4 Design:** `docs/plans/2026-01-16-preparer-phase4-ui-refactor-design.md`
   - WizardContainer design
   - GridSelector design
   - POPMarkingForm design

4. **Phase 4 Implementation:** `docs/plans/2026-01-16-preparer-phase4-implementation.md`
   - TDD task structure
   - Test patterns
   - Commit conventions

---

## Design Document Requirements

Your design document should include:

### 1. Line Count Analysis
Run `wc -l` on each target screen to determine current sizes.

### 2. Component Extraction Opportunities
Identify reusable patterns that could become shared components:
- Are there forms that repeat across specialty screens?
- Are there display patterns for material-specific data?
- Can acknowledgement screens share a common component?

### 3. Leverage Existing Components
For each screen, identify which existing UI/preparer components can be used.

### 4. New Component Proposals
If new shared components are needed, define their interfaces:
```typescript
interface NewComponentProps {
  // props
}
```

### 5. Screen Refactoring Approach
For each screen:
- Before/After line estimates
- Components to use
- Key simplifications

### 6. Implementation Phases
Organize screens into implementation phases:
- Phase 1.1, 1.2, etc. for shipment creation
- Phase 2.1, 2.2, etc. for material identification
- Phase 3.1, 3.2, etc. for quantity entry
- Specialty screens grouped by complexity

### 7. Success Criteria
- Target line reduction percentage
- Test coverage requirements
- Functionality preservation

---

## Process

1. **Use `/brainstorming` skill** to explore requirements and make design decisions
2. **Read each target screen** to understand current implementation
3. **Identify patterns** across screens for potential extraction
4. **Create design document** at `docs/plans/2026-01-20-preparer-phase1-3-ui-refactor-design.md`
5. **Commit the design** with descriptive message

---

## Questions to Answer During Brainstorming

1. **ShipmentCreationScreen** is likely large with many form fields - should address entry (shipper, consignee, preparer) be extracted to a shared component like `AddressFormSection`? (Note: `AddressFormSection` already exists)

2. **MaterialIDScreen** has search and selection - should the search results list be a separate component?

3. **Specialty screens** (UN3166, DryIce, LithiumBatteries, etc.) - do they share patterns that could be abstracted into a `SpecialtyMaterialForm` or similar?

4. **Acknowledgement screens** (SpecialProvisions, GeneralPackaging from Phase 4) - should they use a shared `AcknowledgementScreen` component?

5. **QuantityEntryScreen** - how much complexity is in the eligibility calculation vs. the UI? Should calculation logic be extracted to a utility?

---

## Getting Started

```bash
# 1. Verify you're on the right branch
git branch --show-current  # Should be inspector-persona-testing

# 2. Verify tests pass
npm test -- --watchAll=false --testPathIgnorePatterns=".worktrees"

# 3. Verify TypeScript compiles
npx tsc --noEmit

# 4. Start with brainstorming
# Use the /brainstorming skill to explore requirements before creating design doc
```

---

## Notes

- The `ExplosiveDetailsWizard` may be similar in complexity to `GrandfatheredWizard` (Phase 4) - consider the same approach
- `PreparerHomeScreen` includes a shipment list with resume capability - this is a key UX feature to preserve
- Specialty screens route from acknowledgement screens based on UN number - navigation must be preserved
- Some specialty screens may have material-specific validation that must be preserved
