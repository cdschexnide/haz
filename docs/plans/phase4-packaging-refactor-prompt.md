# Phase 4: Packaging Selection UI Refactor - Claude Code Handoff

**Date:** 2026-01-16
**Scope:** 16 screens, ~13,000 lines → target ~5,000 lines (60% reduction)
**Complexity:** Highest in the refactoring project

---

## Project Context

You are refactoring a React Native (Expo) hazardous materials preparation app called HazPro. This is Phase 4 of a multi-phase UI refactoring effort following established patterns from Phases 1-3 and 5-6.

### Repository Structure
```
/Users/codyschexnider/Documents/Technergetics/refactor/haz/
├── src/
│   ├── components/           # Legacy components (to be refactored)
│   │   ├── ui/              # UI component library (established)
│   │   │   ├── index.ts     # Centralized exports
│   │   │   ├── theme.ts     # Design tokens
│   │   │   ├── Button.tsx, FormField.tsx, ActionFooter.tsx, etc.
│   │   └── preparer/        # Preparer-specific shared components
│   │       ├── index.ts
│   │       └── AddressFormSection.tsx, ShipmentTable.tsx, etc.
│   ├── screens/
│   │   └── preparer/        # Refactored preparer screens
│   │       ├── index.ts
│   │       └── PreparerHomeScreen.tsx, ShipmentCreationScreen.tsx, etc.
│   └── utils/               # Utility functions
├── server/                  # Backend/data layer
│   └── documentNodes/       # Document lookup utilities
└── docs/plans/              # Design documents
```

### Branch Information
- Current branch: `inspector-persona-testing`
- Base branch: `temp-transfer`
- Git status: Clean (all Phase 5-6 work committed)

---

## Phase 4 Target Screens

### Main Packaging Screens (9,685 lines total)

| Screen | Lines | Complexity | Purpose |
|--------|-------|------------|---------|
| **GrandfatheredWizard.tsx** | 4,064 | EXTREME | 10+ step wizard for grandfathered explosive packaging |
| **CylinderEntryScreen.tsx** | 1,804 | HIGH | DOT cylinder specification entry (Class 2 gases) |
| **PackagingWizardV2.tsx** | 1,160 | HIGH | 3-step wizard: Type → Category → Container Code |
| **POPMarkingDataEntry.tsx** | 1,101 | HIGH | Manual entry of POP marking fields (A-H) |
| **InnerPackagingWizard.tsx** | 670 | MEDIUM | Inner container selection for combination packaging |
| **A8_5PackagingWizard.tsx** | 614 | MEDIUM | Class 3.5 hazmat packaging (cylinders/composite) |
| **PackagingScreen.tsx** | 272 | LOW | Main entry point - quadrant layout selector |

### Supporting Screens (3,302 lines total)

| Screen | Lines | Complexity | Purpose |
|--------|-------|------------|---------|
| **LimitedQuantityPackagingGuidance.tsx** | 579 | MEDIUM | Guidance for limited quantity packaging |
| **POPScanResultsScreen.tsx** | 570 | MEDIUM | Review OCR scan results |
| **ExceptedQuantityPackagingGuidance.tsx** | 440 | MEDIUM | Guidance for excepted quantity packaging |
| **POPScannerScreen.tsx** | 424 | MEDIUM | Camera OCR scanning for POP markings |
| **ManualEntryPackagingTypeSelection.tsx** | 421 | MEDIUM | Select packaging type for manual entry |
| **GeneralPackagingAcknowledgementScreen.tsx** | 240 | LOW | Checkbox acknowledgement screen |
| **GrandfatheredPackagingReferenceScreen.tsx** | 226 | LOW | Reference viewer wrapper |
| **UnauthorizedPopMarking.tsx** | 223 | LOW | Error screen for unauthorized POP |
| **UnauthorizedCylinderSpecification.tsx** | 179 | LOW | Error screen for unauthorized cylinder |

**Total: ~12,987 lines across 16 screens**

---

## Established Patterns to Follow

### UI Component Library (`src/components/ui/`)

19 components available - import from `@/components/ui`:

**Layout & Navigation:**
- `ScreenHeader` - Header with back button, title, optional right action
- `ActionFooter` - Screen footer with Back/Next/Save buttons
- `SectionHeader` - Section title with optional subtitle

**Form Components:**
- `FormField` - Label wrapper with error display
- `FormInput` - Text input with validation styling
- `FormRow` - Horizontal container for multiple fields
- `RadioGroup` - Single/multiple choice options
- `DatePickerField` - Date picker with modal

**Display Components:**
- `Button` - Primary interactive button (primary/secondary/outline/ghost variants)
- `StatusBadge` - Status indicator (success/error/warning/pending)
- `DetailCard` - Key-value pair display card
- `ValidationCard` - Validation feedback card
- `ConfirmationCard` - Modal confirmation card
- `InfoBox` - Informational guidance box
- `KeyValueRow` - Label-value row display
- `ChecklistItem` - Checkbox with label/description

**Overlay Components:**
- `LoadingOverlay` - Full-screen loading spinner
- `DocumentModal` - HTML document display modal
- `StepIndicator` - Multi-step progress indicator

### Theme Tokens (`src/components/ui/theme.ts`)

```typescript
// Colors
colors.primary        // #007AFF - primary actions
colors.success        // #34C759 - success states
colors.error          // #FF3B30 - error states
colors.warning        // #FF9500 - warnings
colors.textPrimary    // #1D1D1F - main text
colors.textSecondary  // #8E8E93 - secondary text
colors.border         // #E5E5EA - borders
colors.background     // #F8F9FA - page background
colors.surface        // #FFFFFF - card background

// Spacing
spacing.xs: 4, spacing.sm: 8, spacing.md: 12, spacing.lg: 16, spacing.xl: 20, spacing.xxl: 24

// Border Radius
borderRadius.sm: 4, borderRadius.md: 8, borderRadius.lg: 12

// Typography
typography.headerTitle  // fontSize: 18, fontWeight: '600'
typography.cardTitle    // fontSize: 16, fontWeight: '600'
typography.body         // fontSize: 14, fontWeight: '400'
typography.caption      // fontSize: 12, color: textSecondary
typography.label        // fontSize: 11, fontWeight: '600', uppercase
```

### Import Pattern

```typescript
// UI library - all in one import
import {
  ScreenHeader, ActionFooter, SectionHeader,
  FormField, FormInput, FormRow, RadioGroup,
  Button, InfoBox, StepIndicator,
  colors, spacing, typography, borderRadius
} from '@/components/ui';

// Preparer-specific components
import { ComponentName } from '@/components/preparer';

// Store
import { useHazProStore } from '@/stores/useHazProStore';
```

### Screen Structure Pattern

```typescript
interface ScreenNameProps {
  navigation: any;
}

export const ScreenName: React.FC<ScreenNameProps> = ({ navigation }) => {
  // 1. Store access
  const { state, actions } = useHazProStore();

  // 2. Local state
  const [step, setStep] = useState(0);

  // 3. Callbacks (useCallback for handlers)
  const handleNext = useCallback(() => {
    // logic
  }, [dependencies]);

  // 4. Render
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Screen Title" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        {/* Content using UI components */}
      </ScrollView>

      <ActionFooter
        buttons={[
          { label: 'Back', onPress: handleBack, variant: 'outline' },
          { label: 'Next', onPress: handleNext },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
});

export default ScreenName;
```

---

## Recommended Approach

### Phase 4 Breakdown (Suggested Order)

**Phase 4.1: Foundation Components (Create First)**
1. Create `src/components/packaging/` directory for packaging-specific shared components
2. Create `WizardContainer` - Reusable multi-step wizard shell
3. Create `PackagingTypeSelector` - Quadrant/grid selector for packaging types
4. Create `PackagingCodeCard` - Card for displaying packaging code details
5. Create `POPMarkingForm` - Form for POP marking fields A-H

**Phase 4.2: Simple Screens (Quick Wins)**
1. `PackagingScreen.tsx` (272 lines) → Entry point, use PackagingTypeSelector
2. `GeneralPackagingAcknowledgementScreen.tsx` (240 lines) → Use ChecklistItem
3. `UnauthorizedCylinderSpecification.tsx` (179 lines) → Error display
4. `UnauthorizedPopMarking.tsx` (223 lines) → Error display

**Phase 4.3: Medium Screens**
1. `ManualEntryPackagingTypeSelection.tsx` (421 lines)
2. `ExceptedQuantityPackagingGuidance.tsx` (440 lines)
3. `LimitedQuantityPackagingGuidance.tsx` (579 lines)
4. `POPScanResultsScreen.tsx` (570 lines)
5. `GrandfatheredPackagingReferenceScreen.tsx` (226 lines)

**Phase 4.4: Complex Wizards**
1. `A8_5PackagingWizard.tsx` (614 lines) → Use WizardContainer
2. `InnerPackagingWizard.tsx` (670 lines) → Use WizardContainer
3. `POPMarkingDataEntry.tsx` (1,101 lines) → Use POPMarkingForm
4. `POPScannerScreen.tsx` (424 lines) → Camera integration

**Phase 4.5: High Complexity Screens**
1. `PackagingWizardV2.tsx` (1,160 lines) → Use WizardContainer + PackagingTypeSelector
2. `CylinderEntryScreen.tsx` (1,804 lines) → May need CylinderSpecForm component

**Phase 4.6: Extreme Complexity**
1. `GrandfatheredWizard.tsx` (4,064 lines) → Consider breaking into sub-wizards

### Key Decisions Needed

Before starting implementation, the user should decide:

1. **Component Location:** Create `src/components/packaging/` or add to `src/components/preparer/`?
2. **Wizard Pattern:** Extract common wizard logic to `WizardContainer` component or custom hook (`useWizardState`)?
3. **POP Scanner:** Keep camera logic inline or extract to utility?
4. **GrandfatheredWizard Strategy:** Refactor monolithically or split into sub-screens?

---

## TDD & Subagent-Driven Development

Follow the same workflow used in Phase 5-6:

1. **Use `/brainstorming` skill** before creating design doc
2. **Create design doc** at `docs/plans/2026-01-XX-preparer-phase4-ui-refactor-design.md`
3. **Create implementation plan** at `docs/plans/2026-01-XX-preparer-phase4-implementation.md`
4. **Execute with subagent-driven development:**
   - Fresh subagent per task
   - TDD: Write tests first
   - Two-stage review: spec compliance, then code quality
   - Mark todos complete after each task

### Test Pattern

```typescript
// src/components/packaging/__tests__/ComponentName.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('renders correctly with required props', () => {
    const { getByText } = render(<ComponentName prop="value" />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('calls onPress when button pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<ComponentName onPress={onPress} />);
    fireEvent.press(getByTestId('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Reference Files

### Completed Phase Examples
- Design: `docs/plans/2026-01-15-preparer-phase5-6-ui-refactor-design.md`
- Implementation: `docs/plans/2026-01-15-preparer-phase5-6-implementation.md`

### UI Library Reference
- Components: `src/components/ui/index.ts`
- Theme: `src/components/ui/theme.ts`

### Refactored Screen Examples
- Simple: `src/screens/preparer/DisclaimerScreen.tsx` (51 lines)
- Medium: `src/screens/preparer/LabelingAndMarkingScreen.tsx` (182 lines)
- Complex: `src/screens/preparer/ShipmentCreationScreen.tsx` (751 lines)

### Target Screens (Read Before Refactoring)
- `src/components/PackagingScreen.tsx`
- `src/components/PackagingWizardV2.tsx`
- `src/components/GrandfatheredWizard.tsx`
- `src/components/CylinderEntryScreen.tsx`
- `src/components/POPMarkingDataEntry.tsx`

---

## Success Criteria

1. **Line Reduction:** ~60% reduction (13,000 → ~5,000 lines)
2. **Component Reuse:** New packaging components used across multiple screens
3. **Theme Compliance:** All hardcoded colors/spacing replaced with theme tokens
4. **Test Coverage:** Each new component has unit tests
5. **TypeScript:** No new `any` types (except navigation prop)
6. **Navigation:** All screens work in existing navigation structure
7. **Functionality:** All existing features preserved

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

- The `GrandfatheredWizard.tsx` at 4,064 lines is exceptionally complex - consider whether it should be split into multiple screens or kept as one wizard with extracted step components
- POP Scanner uses `expo-camera` and `@react-native-ml-kit/text-recognition` - camera logic may stay inline
- Many screens share similar "quadrant selection" patterns - good extraction candidate
- The `packagingDatabaseV2` lookup is a key dependency - don't change its interface
