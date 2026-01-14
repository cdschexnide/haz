# Preparer Phase 1 UI Refactor Design

**Date:** 2026-01-14
**Scope:** Phase 1 - Shipment Creation (PreparerHomeScreen, DisclaimerScreen, ShipmentCreationScreen)
**Goal:** Reduce technical debt, improve maintainability, leverage existing UI library

---

## Problem Statement

The Preparer workflow screens contain significant technical debt:
- Inline component definitions duplicated across files
- Hardcoded colors/spacing instead of theme usage
- No separation between screens and reusable components
- ~2,400 lines across 3 screens that could be reduced by ~50%

## Folder Structure

```
src/
├── screens/
│   └── preparer/
│       ├── PreparerHomeScreen.tsx
│       ├── DisclaimerScreen.tsx
│       ├── ShipmentCreationScreen.tsx
│       └── index.ts
│
├── components/
│   ├── ui/                             # Generic UI library
│   │   ├── Button.tsx                  # Exists
│   │   ├── ScreenHeader.tsx            # Exists
│   │   ├── ActionFooter.tsx            # Exists
│   │   ├── InfoBox.tsx                 # Exists
│   │   ├── FormField.tsx               # NEW
│   │   ├── FormRow.tsx                 # NEW
│   │   ├── FormInput.tsx               # NEW
│   │   ├── RadioGroup.tsx              # NEW
│   │   ├── DatePickerField.tsx         # NEW
│   │   ├── ConfirmationCard.tsx        # NEW
│   │   └── index.ts
│   │
│   └── preparer/                       # Preparer-specific components
│       ├── ToolButtonsBar.tsx          # NEW
│       ├── ShipmentTable.tsx           # NEW
│       ├── ShipmentContextMenu.tsx     # NEW
│       ├── AddressFormSection.tsx      # NEW
│       ├── CountryAutocomplete.tsx     # NEW
│       └── index.ts
```

---

## New UI Library Components

### FormField
Label wrapper with required indicator and error display.

```typescript
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: ReactNode;
  flex?: number;
}
```

### FormRow
Horizontal container for form fields with consistent gap.

```typescript
interface FormRowProps {
  children: ReactNode;
  lastRow?: boolean;
}
```

### FormInput
Styled TextInput with error state and keyboard navigation.

```typescript
interface FormInputProps extends TextInputProps {
  error?: FieldError;
  disabled?: boolean;
  inputRef?: React.RefObject<TextInput>;
  onSubmitEditing?: () => void;
}
```

### RadioGroup
Radio button group with label and options.

```typescript
interface RadioGroupProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  horizontal?: boolean;
}
```

### DatePickerField
Date input with picker modal.

```typescript
interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  required?: boolean;
  error?: FieldError;
}
```

### ConfirmationCard
Centered card with title, content, and accept/decline buttons.

```typescript
interface ConfirmationCardProps {
  title: string;
  content: string | ReactNode;
  onAccept: () => void;
  onDecline: () => void;
  acceptLabel?: string;
  declineLabel?: string;
}
```

---

## Preparer-Specific Components

### ToolButtonsBar
Row of calculator/helper tool buttons.

```typescript
interface ToolButtonConfig {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

interface ToolButtonsBarProps {
  tools: ToolButtonConfig[];
}
```

### ShipmentTable
Filterable shipment list with swipe actions.

```typescript
interface ShipmentTableProps {
  shipments: SavedShipment[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShipmentPress: (shipment: SavedShipment) => void;
  onShipmentLongPress: (shipment: SavedShipment) => void;
  onDelete: (shipmentId: string) => void;
  onCopy: (shipmentId: string) => void;
  isLoading?: boolean;
}
```

### ShipmentContextMenu
Bottom sheet for shipment actions.

```typescript
interface ShipmentContextMenuProps {
  visible: boolean;
  shipment: SavedShipment | null;
  onClose: () => void;
  onResume: () => void;
  onViewSDDG: () => void;
}
```

### AddressFormSection
Reusable address entry fields for shipper/consignee.

```typescript
interface AddressFormSectionProps {
  type: 'shipper' | 'consignee';
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  store: HazProStore;
}
```

### CountryAutocomplete
Searchable country dropdown.

```typescript
interface CountryAutocompleteProps {
  value: string;
  onChange: (country: string) => void;
  error?: FieldError;
  onStateReset?: () => void;
}
```

---

## Refactored Screens

### DisclaimerScreen (~40 lines, down from ~112)

```typescript
import { ConfirmationCard } from '@/components/ui';

export const DisclaimerScreen = ({ navigation }) => {
  const disclaimerText = "...";

  return (
    <View style={styles.container}>
      <ConfirmationCard
        title="Important Disclaimer"
        content={disclaimerText}
        onAccept={() => navigation.navigate("ShipmentCreation")}
        onDecline={() => navigation.navigate("PreparerHome")}
      />
    </View>
  );
};
```

### ShipmentCreationScreen (~500 lines, down from ~1270)

Uses: ScreenHeader, ActionFooter, FormField, FormRow, FormInput, RadioGroup, DatePickerField, AddressFormSection

Key sections:
- ScreenHeader with back navigation
- RadioGroup for POE/POD/Chapter3 questions
- AddressFormSection for shipper (conditional)
- AddressFormSection for consignee (conditional)
- FormField/FormInput for preparer fields
- DatePickerField for certification date
- ActionFooter for Cancel/Save & Continue

### PreparerHomeScreen (~400 lines, down from ~1000)

Uses: ScreenHeader, ToolButtonsBar, ShipmentTable, ShipmentContextMenu

Key sections:
- ScreenHeader with drawer toggle
- ToolButtonsBar for 4 calculator buttons
- ShipmentTable for shipment list
- ShipmentContextMenu for bottom sheet
- Modal state for calculator tools

---

## Implementation Order

### Step 1: Create UI Library Components
1. FormField.tsx
2. FormRow.tsx
3. FormInput.tsx
4. RadioGroup.tsx
5. DatePickerField.tsx
6. ConfirmationCard.tsx
7. Update ui/index.ts

### Step 2: Create Preparer Shared Components
1. CountryAutocomplete.tsx
2. AddressFormSection.tsx
3. ToolButtonsBar.tsx
4. ShipmentTable.tsx
5. ShipmentContextMenu.tsx
6. Create preparer/index.ts

### Step 3: Refactor Screens
1. DisclaimerScreen.tsx (simplest, validates ConfirmationCard)
2. ShipmentCreationScreen.tsx (validates form components)
3. PreparerHomeScreen.tsx (most complex, done last)

### Step 4: Update Navigation
1. Update MainLayoutNavigator.tsx imports
2. Verify navigation paths
3. Remove old files from src/components/

---

## Testing Strategy

- Manual testing of each screen after refactoring
- Verify navigation: Home → Disclaimer → ShipmentCreation → MaterialID
- Verify resume functionality from saved shipments
- Verify all 4 calculator modals work

## Out of Scope

- Calculator modal components (keep as-is)
- Navigation structure changes (only import paths)
- State management patterns (Valtio usage unchanged)
- Other workflow phases (future iterations)

## Estimated Impact

| Metric | Before | After |
|--------|--------|-------|
| Total lines (3 screens) | ~2,400 | ~1,000 |
| New UI components | 0 | 6 |
| New preparer components | 0 | 5 |
| Duplicated code patterns | Many | Eliminated |
