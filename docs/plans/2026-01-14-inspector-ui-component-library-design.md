# Inspector UI Component Library & Screen Refactor Design

**Date:** 2026-01-14
**Author:** Claude (with user collaboration)
**Status:** Approved

---

## Executive Summary

This design document outlines the creation of a reusable UI component library and subsequent refactoring of all Inspector workflow screens. The goal is to reduce technical debt, improve code maintainability, and establish industry-standard frontend practices before external engineers review the codebase.

**Key constraints:**
- Visual appearance must remain pixel-perfect (no look/feel changes)
- Big bang approach: build component library first, then refactor all screens
- Focus exclusively on Inspector workflow (15 screens)

---

## Component Library Structure

### Folder Structure (Flat/Simple)

```
src/components/ui/
├── index.ts                    # Barrel export
├── theme.ts                    # Colors, spacing, typography tokens
├── Button.tsx                  # Primary, secondary, destructive, outline, ghost
├── ScreenHeader.tsx            # Back/title/action pattern
├── ActionFooter.tsx            # 2-4 button footer configurations
├── StatusBadge.tsx             # Verified/Frustrated/Detected/etc
├── ValidationCard.tsx          # Card with status border + actions
├── DetailCard.tsx              # Key-value display card
├── SectionHeader.tsx           # Icon + title + count badge
├── StepIndicator.tsx           # Progress dots
└── InfoBox.tsx                 # Warning/info/success message boxes
```

---

## Component Specifications

### 1. theme.ts - Design Tokens

Centralizes all styling constants currently scattered across 60+ files.

```typescript
export const colors = {
  // Primary actions
  primary: '#007AFF',
  primaryPressed: '#0056B3',

  // Semantic colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',

  // Neutral
  textPrimary: '#1D1D1F',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  background: '#F8F9FA',
  surface: '#FFFFFF',

  // Status backgrounds
  successLight: '#F0FFF4',
  errorLight: '#FFF5F5',
  warningLight: '#FFF9E6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 4,   // buttons
  md: 8,   // containers
  lg: 12,  // cards
};

export const typography = {
  headerTitle: { fontSize: 18, fontWeight: '600' as const },
  cardTitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, color: '#8E8E93' },
  label: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const },
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
};
```

---

### 2. Button.tsx

Replaces 15+ lines of duplicated TouchableOpacity code per button instance.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | required | Button text |
| onPress | () => void | required | Press handler |
| variant | 'primary' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' | 'primary' | Visual style |
| icon | string | undefined | MaterialIcons name |
| iconPosition | 'left' \| 'right' | 'left' | Icon placement |
| disabled | boolean | false | Disabled state |
| loading | boolean | false | Shows ActivityIndicator |
| fullWidth | boolean | false | flex: 1 for footer layouts |

**Variant styles:**
- `primary`: Blue background (#007AFF), white text
- `secondary`: White background, blue border/text
- `destructive`: Red background (#FF3B30), white text
- `outline`: White background, gray border, gray text
- `ghost`: Transparent, blue text

---

### 3. ScreenHeader.tsx

Standardizes the header pattern used in every Inspector screen.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Screen title |
| onBack | () => void | undefined | Back arrow handler |
| onClose | () => void | undefined | X button handler (takes precedence) |
| rightIcon | string | undefined | Right action icon |
| onRightPress | () => void | undefined | Right action handler |
| rightBadgeCount | number | undefined | Badge on right icon |

**Layout:** Left icon | Center title | Right icon (with optional badge)

---

### 4. ActionFooter.tsx

Configurable footer supporting 2-4 buttons with consistent spacing.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| buttons | FooterButton[] | Array of button configurations |
| style | object | Optional style overrides |

**FooterButton interface:**
```typescript
interface FooterButton {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
}
```

**Common configurations:**
- 2-button: Back (outline) + Continue (primary)
- 3-button: Back + Save & Exit + Continue
- 4-button: Cancel + Save & Exit + Reinspect + Continue

---

### 5. StatusBadge.tsx

Unified badge component for all validation states.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | BadgeStatus | required | Determines colors/icon |
| label | string | undefined | Override default label |
| size | 'sm' \| 'md' | 'md' | Badge size |

**BadgeStatus values:**
| Status | Background | Icon | Default Label |
|--------|------------|------|---------------|
| verified | #34C759 | check-circle | Verified |
| frustrated | #FF3B30 | cancel | Frustrated |
| detected | #34C759 | check-circle | Detected |
| not-detected | #FF9500 | search-off | Not Detected |
| matched | #34C759 | check-circle | Matched |
| unmatched | #FF9500 | help-outline | Unmatched |
| pending | #E5E5EA | schedule | Pending |
| na | #F8F9FA | remove | N/A |
| in-progress | #007AFF | autorenew | In Progress |

---

### 6. ValidationCard.tsx

Core component for marking/label validation screens.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| label | string | Item name (e.g., "PSN and UN Number") |
| expectedValues | string[] | Array of expected values shown as chips |
| validationStatus | 'pending' \| 'validated' \| 'frustrated' | Current validation state |
| matchStatus | 'matched' \| 'unmatched' | ML detection match status |
| confidence | number | 0-1 confidence score |
| afmanReference | string | AFMAN reference (e.g., "AFMAN 24-604 A14.2") |
| onValidate | () => void | Validate button handler |
| onFrustrate | () => void | Frustrate button handler |
| disabled | boolean | Disable action buttons |

**Visual states:**
- Pending + Matched: White bg, green left border, "Detected" badge
- Pending + Unmatched: Yellow bg, orange left border, "Not Detected" badge
- Validated: Light green bg, green left border, "Verified" badge, no actions
- Frustrated: Light red bg, red left border, "Frustrated" badge, no actions

---

### 7. DetailCard.tsx

Key-value display card used in summary screens.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| title | string | Optional card title |
| icon | string | Optional title icon |
| fields | DetailField[] | Array of label/value pairs |
| status | 'default' \| 'success' \| 'error' \| 'warning' | Border color |

**DetailField interface:**
```typescript
interface DetailField {
  label: string;
  value: string | React.ReactNode;
  accent?: boolean;  // Blue left border (like TCN field)
}
```

---

### 8. SectionHeader.tsx

Section header for SectionList components.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| title | string | Section title |
| icon | string | Optional MaterialIcons name |
| count | { completed: number; total: number } | Progress badge |

---

### 9. StepIndicator.tsx

Progress dots for multi-step material-specific screens.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| totalSteps | number | Total number of steps |
| currentStep | number | Current step (0-indexed) |
| stepStatuses | StepStatus[] | Optional status per step |
| showLabel | boolean | Show "Step X of Y" text |

**StepStatus values:** 'pending' | 'active' | 'pass' | 'fail'

---

### 10. InfoBox.tsx

Contextual message boxes for warnings, info, success, error states.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | required | Box content |
| variant | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Visual style |
| title | string | undefined | Optional bold title |

---

## Screen Refactoring Plan

### Screens to Refactor (15 total)

| Phase | Screen | File Location | Complexity |
|-------|--------|---------------|------------|
| Home | InspectorHomeScreen | src/components/Inspector/ | Medium |
| SDDG | InteractiveSDDGComplianceScreen | src/components/Inspector/ | Medium |
| SDDG | SDDGFrustrationSummary | src/components/ | Medium |
| SDDG | SDDGInspectionCompleteScreen | src/components/ | Medium |
| Package | MLDetectionScreen | src/components/Inspector/ | High |
| Package | InspectorPOPMarkingValidationScreen | src/components/Inspector/ | Medium |
| Package | InspectorMarkingsLabelsValidationScreen | src/components/Inspector/ | High |
| Material | InspectorDryIceScreen | src/components/Inspector/ | Low |
| Material | InspectorMagnetizedMaterialsScreen | src/components/Inspector/ | Low |
| Material | InspectorLithiumBatteriesScreen | src/components/Inspector/ | Low |
| Material | InspectorCapacitorsScreen | src/components/Inspector/ | Low |
| Material | InspectorLifeSavingAppliancesScreen | src/components/Inspector/ | Low |
| Material | InspectorSafetyDevicesScreen | src/components/Inspector/ | Low |
| Completion | PackageFrustrationSummary | src/components/Inspector/ | Medium |
| Completion | PackageInspectionCompleteScreen | src/components/Inspector/ | Medium |
| Completion | InspectorAMC1015Form | src/components/Inspector/ | High |

### Refactoring Order

**Phase 1: Component Library**
1. Create `src/components/ui/` folder
2. Implement all 10 components
3. Create barrel export (index.ts)
4. Manual testing of components in isolation

**Phase 2: Simple Screens (Material-Specific)**
Validates components work correctly with minimal risk.
1. InspectorDryIceScreen
2. InspectorMagnetizedMaterialsScreen
3. InspectorCapacitorsScreen
4. InspectorLifeSavingAppliancesScreen
5. InspectorSafetyDevicesScreen
6. InspectorLithiumBatteriesScreen

**Phase 3: Medium Complexity Screens**
1. SDDGInspectionCompleteScreen
2. SDDGFrustrationSummary
3. PackageInspectionCompleteScreen
4. PackageFrustrationSummary
5. InspectorPOPMarkingValidationScreen
6. InteractiveSDDGComplianceScreen
7. InspectorHomeScreen

**Phase 4: High Complexity Screens**
1. InspectorMarkingsLabelsValidationScreen
2. MLDetectionScreen
3. InspectorAMC1015Form

---

## Refactoring Guidelines

### For Each Screen:

1. **Import the UI library**
   ```typescript
   import {
     ScreenHeader,
     ActionFooter,
     Button,
     StatusBadge,
     colors,
     spacing
   } from '../../components/ui';
   ```

2. **Replace header code** with `<ScreenHeader />`

3. **Replace footer code** with `<ActionFooter />`

4. **Replace inline buttons** with `<Button />`

5. **Replace badge code** with `<StatusBadge />`

6. **Replace hardcoded colors** with theme tokens
   - `#007AFF` → `colors.primary`
   - `#34C759` → `colors.success`
   - `#FF3B30` → `colors.error`

7. **Replace hardcoded spacing** with spacing tokens
   - `padding: 16` → `padding: spacing.lg`
   - `gap: 8` → `gap: spacing.sm`

8. **Remove redundant StyleSheet entries** that are now in components

9. **Verify pixel-perfect match** with current implementation

---

## Expected Outcomes

### Code Reduction Estimates

| Screen | Before (lines) | After (lines) | Reduction |
|--------|----------------|---------------|-----------|
| Typical screen | ~400 | ~200 | ~50% |
| Complex screen | ~800 | ~450 | ~44% |
| Simple screen | ~250 | ~150 | ~40% |

### Maintainability Improvements

- **Single source of truth** for colors, spacing, typography
- **Consistent patterns** across all Inspector screens
- **Easier onboarding** for new engineers
- **Simpler bug fixes** - fix once in component, applies everywhere
- **Testable components** - can unit test UI components independently

---

## Success Criteria

1. All 15 Inspector screens refactored to use component library
2. Zero visual differences (pixel-perfect match)
3. All existing functionality preserved
4. No regression in existing tests
5. Code review ready for external engineers

---

## Appendix: Current vs. Refactored Example

### Before (InspectorDryIceScreen.tsx excerpt)

```typescript
// ~80 lines for header + footer alone
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Dry Ice Verification</Text>
  <TouchableOpacity onPress={() => setShowHelp(true)}>
    <MaterialIcons name="help-outline" size={24} color="#007AFF" />
  </TouchableOpacity>
</View>

{/* ... content ... */}

<View style={styles.footer}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
    <Text style={styles.backButtonText}>Back</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.continueButton}
    onPress={handleContinue}
  >
    <Text style={styles.continueButtonText}>Continue</Text>
    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
  </TouchableOpacity>
</View>
```

### After

```typescript
<ScreenHeader
  title="Dry Ice Verification"
  onBack={() => navigation.goBack()}
  rightIcon="help-outline"
  onRightPress={() => setShowHelp(true)}
/>

{/* ... content ... */}

<ActionFooter
  buttons={[
    { label: 'Back', icon: 'arrow-back', onPress: () => navigation.goBack(), variant: 'outline' },
    { label: 'Continue', icon: 'arrow-forward', iconPosition: 'right', onPress: handleContinue },
  ]}
/>
```

**Reduction:** 80 lines → 15 lines for header + footer
