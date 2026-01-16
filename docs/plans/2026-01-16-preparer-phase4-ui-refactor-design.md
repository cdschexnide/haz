# Preparer Phase 4 UI Refactor Design

**Date:** 2026-01-16
**Scope:** Packaging Selection screens (16 screens, ~13,000 lines)
**Goal:** 60% line reduction, component reusability, theme consistency

---

## Design Decisions (Brainstormed)

1. **GrandfatheredWizard Strategy:** Monolithic refactor - keep as single wizard, extract patterns, use WizardContainer
2. **Component Location:** Split by type - generic components to `ui/`, packaging-specific to `preparer/`
3. **Wizard Pattern:** WizardContainer component for consistent wizard shell
4. **POP Scanner:** Keep camera logic inline, apply theme tokens
5. **Grid Pattern:** Create `GridSelector` component in `ui/`
6. **POP Marking:** Create `POPMarkingForm` component in `preparer/`
7. **Error Screens:** Consolidate into single `UnauthorizedPackagingScreen`
8. **Guidance Screens:** Keep separate, refactor individually with UI components

---

## Architecture Overview

### Component Distribution

```
src/components/ui/           (Generic, reusable)
├── WizardContainer.tsx      (NEW - wizard shell with step indicator + footer)
├── GridSelector.tsx         (NEW - icon grid for selection screens)
└── ... (existing 19 components)

src/components/preparer/     (Packaging-specific)
├── POPMarkingForm.tsx       (NEW - fields A-H with validation)
├── POPMarkingDisplay.tsx    (NEW - read-only visual display)
├── PackagingCodeCard.tsx    (NEW - packaging code details card)
└── ... (existing components)

src/screens/preparer/        (Refactored screens)
├── PackagingScreen.tsx
├── PackagingWizardV2Screen.tsx
├── GrandfatheredWizardScreen.tsx
├── CylinderEntryScreen.tsx
├── POPMarkingDataEntryScreen.tsx
├── POPScannerScreen.tsx
├── POPScanResultsScreen.tsx
├── UnauthorizedPackagingScreen.tsx  (NEW - combines 2 error screens)
├── LimitedQuantityGuidanceScreen.tsx
├── ExceptedQuantityGuidanceScreen.tsx
├── InnerPackagingWizardScreen.tsx
├── A8_5PackagingWizardScreen.tsx
├── ManualEntryPackagingTypeScreen.tsx
├── GeneralPackagingAcknowledgementScreen.tsx
└── GrandfatheredPackagingReferenceScreen.tsx
```

**Screen Count:** 16 original → 15 after consolidating error screens

**Estimated Line Reduction:** ~13,000 → ~5,000 (62% reduction)

---

## New UI Components (`src/components/ui/`)

### WizardContainer

Provides consistent wizard shell with step indicator and navigation footer.

```typescript
interface WizardContainerProps {
  title: string;
  steps: string[];                    // Step labels for indicator
  currentStep: number;                // 0-indexed
  onBack?: () => void;                // Hide back button if undefined
  onNext: () => void;
  onSaveExit?: () => void;            // Hide if undefined
  nextLabel?: string;                 // Default: "Next" or "Finish" on last step
  nextDisabled?: boolean;
  children: React.ReactNode;          // Step content
}
```

**Features:**
- Uses existing `StepIndicator` component
- Uses existing `ActionFooter` for navigation buttons
- Handles SafeAreaView, ScrollView, KeyboardAvoidingView wrapper
- Consistent spacing and background colors from theme

### GridSelector

Icon-based grid for selection screens (PackagingScreen, ManualEntryPackagingTypeSelection).

```typescript
interface GridOption {
  id: string;
  label: string;
  icon: React.ReactNode;              // Allows any icon component
  onPress: () => void;
  disabled?: boolean;
}

interface GridSelectorProps {
  options: GridOption[];
  columns?: 2 | 3;                    // Default: 2
  banner?: GridOption;                // Optional top banner (full width)
}
```

**Features:**
- Flexible column count
- Disabled state styling from theme
- Optional banner card above grid (for "Scan POP" in PackagingScreen)

---

## New Preparer Components (`src/components/preparer/`)

### POPMarkingForm

Editable form for POP marking fields A-H with validation.

```typescript
interface POPMarkingFormProps {
  values: POPMarkingFields;           // { A, B, C, D, E, F, G, H }
  onChange: (field: keyof POPMarkingFields, value: string) => void;
  physicalState: 'solid' | 'liquid';  // Affects field D/E labels
  packagingType?: 'single' | 'combination' | 'composite';
  readOnlyFields?: (keyof POPMarkingFields)[];  // Fields to show as display-only
  errors?: Partial<Record<keyof POPMarkingFields, string>>;
  allowablePackingGroups?: ('X' | 'Y' | 'Z')[];  // Filter packing group options
}
```

**Features:**
- Field C: RadioGroup for packing group (X/Y/Z)
- Field G: Country picker (uses existing `countries` data)
- Validation display per field using `FormField` error prop
- Conditional labels based on physicalState (e.g., "Gross Mass (kg)" vs "Specific Gravity")

### POPMarkingDisplay

Read-only visual representation of a POP marking.

```typescript
interface POPMarkingDisplayProps {
  values: POPMarkingFields;
  physicalState: 'solid' | 'liquid';
  variant?: 'compact' | 'full';       // compact for inline display
}
```

### PackagingCodeCard

Displays packaging code details (used in wizard results).

```typescript
interface PackagingCodeCardProps {
  code: string;                       // e.g., "4G"
  description: string;                // e.g., "Fiberboard box"
  restrictions?: string[];            // Any applicable restrictions
  selected?: boolean;                 // Highlight if selected
  onPress?: () => void;               // Make tappable if provided
}
```

---

## Screen Refactoring Approach

### Simple Screens (Quick Wins)

| Screen | Before | After | Approach |
|--------|--------|-------|----------|
| PackagingScreen | 272 | ~80 | Use `GridSelector` with banner |
| GeneralPackagingAcknowledgementScreen | 240 | ~60 | Use `ChecklistItem`, `ActionFooter` |
| UnauthorizedPopMarking + UnauthorizedCylinderSpecification | 402 | ~100 | Combine into `UnauthorizedPackagingScreen` with `type` prop |
| GrandfatheredPackagingReferenceScreen | 226 | ~60 | Thin wrapper using `DocumentModal` |

### Medium Screens

| Screen | Before | After | Approach |
|--------|--------|-------|----------|
| ManualEntryPackagingTypeSelection | 421 | ~120 | Use `GridSelector` or `RadioGroup` |
| LimitedQuantityPackagingGuidance | 579 | ~180 | Use `InfoBox`, `ChecklistItem`, `ActionFooter` |
| ExceptedQuantityPackagingGuidance | 440 | ~150 | Use `InfoBox`, `ChecklistItem`, `ActionFooter` |
| POPScanResultsScreen | 570 | ~200 | Use `POPMarkingForm` with `readOnlyFields` |
| POPScannerScreen | 424 | ~250 | Keep camera inline, apply theme tokens |
| InnerPackagingWizard | 670 | ~200 | Use `WizardContainer` |
| A8_5PackagingWizard | 614 | ~180 | Use `WizardContainer` |

### Complex Screens

| Screen | Before | After | Approach |
|--------|--------|-------|----------|
| POPMarkingDataEntry | 1,101 | ~300 | Use `POPMarkingForm`, `POPMarkingDisplay` |
| PackagingWizardV2 | 1,160 | ~400 | Use `WizardContainer`, extract inline components |
| CylinderEntryScreen | 1,804 | ~500 | Use `WizardContainer`, `FormField`, `FormInput` |
| GrandfatheredWizard | 4,064 | ~1,200 | Use `WizardContainer`, keep `shared/` components |

---

## GrandfatheredWizard Strategy

The 4,064-line GrandfatheredWizard is the most complex screen.

**Current Structure:**
- 20+ imported "spec option" components from `shared/`
- Complex conditional logic to determine which spec options to show
- Multi-step wizard with dynamic step count based on explosive type
- Dimension inputs, weight validation, exception handling

**Refactoring Approach:**

1. **Keep the `shared/` spec option components as-is**
   - They're already extracted and encapsulate domain-specific logic
   - Just ensure they use theme tokens where applicable

2. **Wrap with `WizardContainer`**
   - Removes ~150 lines of navigation footer boilerplate
   - Standardizes step indicator

3. **Extract repeated patterns within the wizard:**
   - `StepContent` components for each logical step
   - Move inline styles to StyleSheet with theme tokens
   - Replace local `theme` object with `@/components/ui` theme

4. **Simplify state management:**
   - Group related state into objects
   - Use `useCallback` consistently for handlers

**Expected Result:** ~4,064 → ~1,200 lines (70% reduction)

---

## Testing Strategy

### New Component Tests

```
src/components/ui/__tests__/
├── WizardContainer.test.tsx
└── GridSelector.test.tsx

src/components/preparer/__tests__/
├── POPMarkingForm.test.tsx
├── POPMarkingDisplay.test.tsx
└── PackagingCodeCard.test.tsx
```

### Test Coverage

| Component | Key Tests |
|-----------|-----------|
| WizardContainer | Renders steps, calls onNext/onBack, disables next when `nextDisabled`, shows correct label on last step |
| GridSelector | Renders all options, handles press, respects disabled state, renders banner when provided |
| POPMarkingForm | Renders all fields, calls onChange, displays errors, respects readOnlyFields, filters packing groups |
| POPMarkingDisplay | Renders values correctly, handles solid vs liquid display |
| PackagingCodeCard | Renders code/description, shows restrictions, handles selected state |

### Test Pattern

```typescript
describe('WizardContainer', () => {
  it('renders step indicator with correct step', () => { ... });
  it('calls onNext when next button pressed', () => { ... });
  it('disables next button when nextDisabled is true', () => { ... });
  it('shows "Finish" on last step', () => { ... });
  it('hides back button when onBack is undefined', () => { ... });
});
```

---

## Implementation Order

### Phase 4.1: Foundation Components (Do First)
1. `WizardContainer` in `ui/` with tests
2. `GridSelector` in `ui/` with tests
3. `POPMarkingForm` in `preparer/` with tests
4. `POPMarkingDisplay` in `preparer/` with tests
5. `PackagingCodeCard` in `preparer/` with tests

### Phase 4.2: Simple Screens (Quick Wins)
1. `PackagingScreen` → uses `GridSelector`
2. `GeneralPackagingAcknowledgementScreen`
3. `UnauthorizedPackagingScreen` (consolidates 2 screens)
4. `GrandfatheredPackagingReferenceScreen`

### Phase 4.3: Medium Screens
1. `ManualEntryPackagingTypeScreen`
2. `ExceptedQuantityGuidanceScreen`
3. `LimitedQuantityGuidanceScreen`
4. `POPScanResultsScreen` → uses `POPMarkingForm`
5. `InnerPackagingWizardScreen` → uses `WizardContainer`
6. `A8_5PackagingWizardScreen` → uses `WizardContainer`

### Phase 4.4: Complex Screens
1. `POPMarkingDataEntryScreen` → uses `POPMarkingForm`
2. `POPScannerScreen` (camera inline, theme tokens)
3. `PackagingWizardV2Screen` → uses `WizardContainer`
4. `CylinderEntryScreen` → uses `WizardContainer`

### Phase 4.5: GrandfatheredWizard
1. `GrandfatheredWizardScreen` (last due to complexity)

---

## Migration Notes

- Old screen files deleted from `src/components/`
- Navigation updated in `MainLayoutNavigator.tsx`
- All imports updated to `@/screens/preparer/`
- Existing `shared/` spec option components remain in place

---

## Success Criteria

1. **Line Reduction:** ~60% reduction (13,000 → ~5,000 lines)
2. **Component Reuse:** New components used across multiple screens
3. **Theme Compliance:** All hardcoded colors/spacing replaced with theme tokens
4. **Test Coverage:** Each new component has unit tests
5. **TypeScript:** No new `any` types (except navigation prop)
6. **Navigation:** All screens work in existing navigation structure
7. **Functionality:** All existing features preserved
