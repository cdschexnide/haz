# Phase 4: Packaging Selection UI Refactor - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor 16 packaging screens from ~13,000 lines to ~5,000 lines (60% reduction) using the established UI component library.

**Architecture:** Create 2 new UI components (WizardContainer, GridSelector) and 3 new preparer components (POPMarkingForm, POPMarkingDisplay, PackagingCodeCard). Migrate all packaging screens from `src/components/` to `src/screens/preparer/`, consolidating 2 error screens into 1.

**Tech Stack:** React Native, TypeScript, @testing-library/react-native, Jest

---

## Phase 4.1: Foundation Components

### Task 1: WizardContainer Component

**Files:**
- Create: `src/components/ui/WizardContainer.tsx`
- Create: `src/components/ui/__tests__/WizardContainer.test.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Write the failing test**

Create `src/components/ui/__tests__/WizardContainer.test.tsx`:

```typescript
// src/components/ui/__tests__/WizardContainer.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WizardContainer } from '../WizardContainer';
import { Text } from 'react-native';

describe('WizardContainer', () => {
  const defaultProps = {
    title: 'Test Wizard',
    steps: ['Step 1', 'Step 2', 'Step 3'],
    currentStep: 0,
    onNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and step indicator', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Test Wizard')).toBeTruthy();
    expect(getByText('Step 1 of 3')).toBeTruthy();
  });

  it('renders children content', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps}>
        <Text>Test Content</Text>
      </WizardContainer>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('calls onNext when Next button pressed', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onNext={onNext}>
        <Text>Content</Text>
      </WizardContainer>
    );
    fireEvent.press(getByText('Next'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows Finish on last step', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps} currentStep={2}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Finish')).toBeTruthy();
  });

  it('hides Back button when onBack is undefined', () => {
    const { queryByText } = render(
      <WizardContainer {...defaultProps}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(queryByText('Back')).toBeNull();
  });

  it('shows Back button when onBack is provided', () => {
    const onBack = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onBack={onBack}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Back')).toBeTruthy();
    fireEvent.press(getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows Save & Exit button when onSaveExit is provided', () => {
    const onSaveExit = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onSaveExit={onSaveExit}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Save & Exit')).toBeTruthy();
    fireEvent.press(getByText('Save & Exit'));
    expect(onSaveExit).toHaveBeenCalledTimes(1);
  });

  it('disables Next button when nextDisabled is true', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onNext={onNext} nextDisabled>
        <Text>Content</Text>
      </WizardContainer>
    );
    fireEvent.press(getByText('Next'));
    expect(onNext).not.toHaveBeenCalled();
  });

  it('uses custom nextLabel when provided', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps} nextLabel="Continue">
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Continue')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="WizardContainer.test" --watchAll=false`

Expected: FAIL with "Cannot find module '../WizardContainer'"

**Step 3: Write minimal implementation**

Create `src/components/ui/WizardContainer.tsx`:

```typescript
// src/components/ui/WizardContainer.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StepIndicator } from './StepIndicator';
import { ActionFooter, FooterButton } from './ActionFooter';
import { colors, spacing, typography } from './theme';

export interface WizardContainerProps {
  title: string;
  steps: string[];
  currentStep: number;
  onBack?: () => void;
  onNext: () => void;
  onSaveExit?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  title,
  steps,
  currentStep,
  onBack,
  onNext,
  onSaveExit,
  nextLabel,
  nextDisabled = false,
  children,
}) => {
  const isLastStep = currentStep === steps.length - 1;
  const defaultNextLabel = isLastStep ? 'Finish' : 'Next';

  const footerButtons: FooterButton[] = [];

  if (onBack) {
    footerButtons.push({
      label: 'Back',
      onPress: onBack,
      variant: 'outline',
    });
  }

  if (onSaveExit) {
    footerButtons.push({
      label: 'Save & Exit',
      onPress: onSaveExit,
      variant: 'outline',
    });
  }

  footerButtons.push({
    label: nextLabel ?? defaultNextLabel,
    onPress: onNext,
    disabled: nextDisabled,
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <StepIndicator totalSteps={steps.length} currentStep={currentStep} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        <ActionFooter buttons={footerButtons} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="WizardContainer.test" --watchAll=false`

Expected: PASS (all 9 tests)

**Step 5: Export from index**

Add to `src/components/ui/index.ts`:

```typescript
export * from './WizardContainer';
```

**Step 6: Commit**

```bash
git add src/components/ui/WizardContainer.tsx src/components/ui/__tests__/WizardContainer.test.tsx src/components/ui/index.ts
git commit -m "feat(ui): add WizardContainer component for multi-step wizard flows"
```

---

### Task 2: GridSelector Component

**Files:**
- Create: `src/components/ui/GridSelector.tsx`
- Create: `src/components/ui/__tests__/GridSelector.test.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Write the failing test**

Create `src/components/ui/__tests__/GridSelector.test.tsx`:

```typescript
// src/components/ui/__tests__/GridSelector.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GridSelector } from '../GridSelector';

describe('GridSelector', () => {
  const mockOptions = [
    { id: '1', label: 'Option 1', icon: <Text>Icon1</Text>, onPress: jest.fn() },
    { id: '2', label: 'Option 2', icon: <Text>Icon2</Text>, onPress: jest.fn() },
    { id: '3', label: 'Option 3', icon: <Text>Icon3</Text>, onPress: jest.fn() },
    { id: '4', label: 'Option 4', icon: <Text>Icon4</Text>, onPress: jest.fn() },
  ];

  beforeEach(() => {
    mockOptions.forEach(opt => (opt.onPress as jest.Mock).mockClear());
  });

  it('renders all options with labels', () => {
    const { getByText } = render(<GridSelector options={mockOptions} />);
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
    expect(getByText('Option 3')).toBeTruthy();
    expect(getByText('Option 4')).toBeTruthy();
  });

  it('renders icons for each option', () => {
    const { getByText } = render(<GridSelector options={mockOptions} />);
    expect(getByText('Icon1')).toBeTruthy();
    expect(getByText('Icon2')).toBeTruthy();
  });

  it('calls onPress when option is pressed', () => {
    const { getByText } = render(<GridSelector options={mockOptions} />);
    fireEvent.press(getByText('Option 1'));
    expect(mockOptions[0].onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled option is pressed', () => {
    const disabledOptions = [
      { ...mockOptions[0], disabled: true },
      mockOptions[1],
    ];
    const { getByText } = render(<GridSelector options={disabledOptions} />);
    fireEvent.press(getByText('Option 1'));
    expect(disabledOptions[0].onPress).not.toHaveBeenCalled();
  });

  it('renders banner when provided', () => {
    const banner = {
      id: 'banner',
      label: 'Banner Label',
      icon: <Text>BannerIcon</Text>,
      onPress: jest.fn(),
    };
    const { getByText } = render(
      <GridSelector options={mockOptions} banner={banner} />
    );
    expect(getByText('Banner Label')).toBeTruthy();
    expect(getByText('BannerIcon')).toBeTruthy();
  });

  it('calls banner onPress when banner is pressed', () => {
    const banner = {
      id: 'banner',
      label: 'Banner Label',
      icon: <Text>BannerIcon</Text>,
      onPress: jest.fn(),
    };
    const { getByText } = render(
      <GridSelector options={mockOptions} banner={banner} />
    );
    fireEvent.press(getByText('Banner Label'));
    expect(banner.onPress).toHaveBeenCalledTimes(1);
  });

  it('applies disabled styling to disabled options', () => {
    const disabledOptions = [{ ...mockOptions[0], disabled: true }];
    const { getByTestId } = render(<GridSelector options={disabledOptions} />);
    const option = getByTestId('grid-option-1');
    expect(option.props.accessibilityState.disabled).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="GridSelector.test" --watchAll=false`

Expected: FAIL with "Cannot find module '../GridSelector'"

**Step 3: Write minimal implementation**

Create `src/components/ui/GridSelector.tsx`:

```typescript
// src/components/ui/GridSelector.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';

export interface GridOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export interface GridSelectorProps {
  options: GridOption[];
  columns?: 2 | 3;
  banner?: GridOption;
}

export const GridSelector: React.FC<GridSelectorProps> = ({
  options,
  columns = 2,
  banner,
}) => {
  const renderOption = (option: GridOption, isBanner: boolean = false) => {
    const isDisabled = option.disabled ?? false;

    return (
      <TouchableOpacity
        key={option.id}
        testID={`grid-option-${option.id}`}
        style={[
          isBanner ? styles.banner : styles.option,
          isBanner ? {} : { width: `${100 / columns - 1}%` as any },
          isDisabled && styles.optionDisabled,
        ]}
        onPress={option.onPress}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.7}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityLabel={option.label}
      >
        <View style={styles.iconContainer}>{option.icon}</View>
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {banner && renderOption(banner, true)}
      <View style={styles.grid}>
        {options.map(option => renderOption(option))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
  },
  banner: {
    width: '100%',
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  option: {
    aspectRatio: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.sm,
  },
  optionDisabled: {
    backgroundColor: colors.borderLight,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.cardTitle,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="GridSelector.test" --watchAll=false`

Expected: PASS (all 7 tests)

**Step 5: Export from index**

Add to `src/components/ui/index.ts`:

```typescript
export * from './GridSelector';
```

**Step 6: Commit**

```bash
git add src/components/ui/GridSelector.tsx src/components/ui/__tests__/GridSelector.test.tsx src/components/ui/index.ts
git commit -m "feat(ui): add GridSelector component for icon-based grid selection"
```

---

### Task 3: POPMarkingForm Component

**Files:**
- Create: `src/components/preparer/POPMarkingForm.tsx`
- Create: `src/components/preparer/__tests__/POPMarkingForm.test.tsx`
- Modify: `src/components/preparer/index.ts`

**Step 1: Write the failing test**

Create `src/components/preparer/__tests__/POPMarkingForm.test.tsx`:

```typescript
// src/components/preparer/__tests__/POPMarkingForm.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { POPMarkingForm } from '../POPMarkingForm';

describe('POPMarkingForm', () => {
  const defaultValues = {
    A: 'u',
    B: '',
    C: '',
    D: '',
    E: '',
    F: '',
    G: '',
    H: '',
  };

  const defaultProps = {
    values: defaultValues,
    onChange: jest.fn(),
    physicalState: 'solid' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all POP marking fields', () => {
    const { getByText } = render(<POPMarkingForm {...defaultProps} />);
    expect(getByText('Packaging Code (B)')).toBeTruthy();
    expect(getByText('Packing Group (C)')).toBeTruthy();
    expect(getByText('Maximum Gross Mass (D)')).toBeTruthy();
    expect(getByText('Year of Manufacture (F)')).toBeTruthy();
    expect(getByText('Country Code (G)')).toBeTruthy();
    expect(getByText('Manufacturer Code (H)')).toBeTruthy();
  });

  it('calls onChange when field B is updated', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <POPMarkingForm {...defaultProps} onChange={onChange} />
    );
    const input = getByTestId('pop-field-B');
    fireEvent.changeText(input, '4G');
    expect(onChange).toHaveBeenCalledWith('B', '4G');
  });

  it('shows Specific Gravity label for liquids', () => {
    const { getByText } = render(
      <POPMarkingForm {...defaultProps} physicalState="liquid" />
    );
    expect(getByText('Specific Gravity (D)')).toBeTruthy();
  });

  it('shows Maximum Gross Mass label for solids', () => {
    const { getByText } = render(
      <POPMarkingForm {...defaultProps} physicalState="solid" />
    );
    expect(getByText('Maximum Gross Mass (D)')).toBeTruthy();
  });

  it('renders packing group options', () => {
    const { getByText } = render(
      <POPMarkingForm {...defaultProps} allowablePackingGroups={['X', 'Y', 'Z']} />
    );
    expect(getByText('X')).toBeTruthy();
    expect(getByText('Y')).toBeTruthy();
    expect(getByText('Z')).toBeTruthy();
  });

  it('filters packing group options when specified', () => {
    const { getByText, queryByText } = render(
      <POPMarkingForm {...defaultProps} allowablePackingGroups={['X', 'Y']} />
    );
    expect(getByText('X')).toBeTruthy();
    expect(getByText('Y')).toBeTruthy();
    expect(queryByText('Z')).toBeNull();
  });

  it('displays error for field B when provided', () => {
    const { getByText } = render(
      <POPMarkingForm
        {...defaultProps}
        errors={{ B: 'Invalid packaging code' }}
      />
    );
    expect(getByText('Invalid packaging code')).toBeTruthy();
  });

  it('renders field as read-only when in readOnlyFields', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <POPMarkingForm
        {...defaultProps}
        onChange={onChange}
        readOnlyFields={['B']}
        values={{ ...defaultValues, B: '4G' }}
      />
    );
    const input = getByTestId('pop-field-B');
    expect(input.props.editable).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="POPMarkingForm.test" --watchAll=false`

Expected: FAIL with "Cannot find module '../POPMarkingForm'"

**Step 3: Write minimal implementation**

Create `src/components/preparer/POPMarkingForm.tsx`:

```typescript
// src/components/preparer/POPMarkingForm.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField, FormInput, RadioGroup, spacing } from '@/components/ui';
import { CountryAutocomplete } from './CountryAutocomplete';

export interface POPMarkingFields {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
}

export interface POPMarkingFormProps {
  values: POPMarkingFields;
  onChange: (field: keyof POPMarkingFields, value: string) => void;
  physicalState: 'solid' | 'liquid';
  packagingType?: 'single' | 'combination' | 'composite';
  readOnlyFields?: (keyof POPMarkingFields)[];
  errors?: Partial<Record<keyof POPMarkingFields, string>>;
  allowablePackingGroups?: ('X' | 'Y' | 'Z')[];
}

export const POPMarkingForm: React.FC<POPMarkingFormProps> = ({
  values,
  onChange,
  physicalState,
  readOnlyFields = [],
  errors = {},
  allowablePackingGroups = ['X', 'Y', 'Z'],
}) => {
  const isReadOnly = (field: keyof POPMarkingFields) =>
    readOnlyFields.includes(field);

  const fieldDLabel =
    physicalState === 'liquid' ? 'Specific Gravity (D)' : 'Maximum Gross Mass (D)';

  const packingGroupOptions = allowablePackingGroups.map(pg => ({
    value: pg,
    label: pg,
  }));

  return (
    <View style={styles.container}>
      <FormField label="Packaging Code (B)" error={errors.B}>
        <FormInput
          testID="pop-field-B"
          value={values.B}
          onChangeText={(text) => onChange('B', text.toUpperCase())}
          placeholder="e.g., 4G"
          autoCapitalize="characters"
          editable={!isReadOnly('B')}
        />
      </FormField>

      <FormField label="Packing Group (C)" error={errors.C}>
        <RadioGroup
          options={packingGroupOptions}
          selectedValue={values.C}
          onValueChange={(value) => onChange('C', value)}
          disabled={isReadOnly('C')}
          horizontal
        />
      </FormField>

      <FormField label={fieldDLabel} error={errors.D}>
        <FormInput
          testID="pop-field-D"
          value={values.D}
          onChangeText={(text) => onChange('D', text)}
          placeholder={physicalState === 'liquid' ? 'e.g., 1.2' : 'e.g., 50'}
          keyboardType="decimal-pad"
          editable={!isReadOnly('D')}
        />
      </FormField>

      <FormField label="Test Pressure kPa (E)" error={errors.E}>
        <FormInput
          testID="pop-field-E"
          value={values.E}
          onChangeText={(text) => onChange('E', text)}
          placeholder="e.g., 100 or S"
          editable={!isReadOnly('E')}
        />
      </FormField>

      <FormField label="Year of Manufacture (F)" error={errors.F}>
        <FormInput
          testID="pop-field-F"
          value={values.F}
          onChangeText={(text) => onChange('F', text)}
          placeholder="e.g., 24"
          keyboardType="number-pad"
          maxLength={2}
          editable={!isReadOnly('F')}
        />
      </FormField>

      <FormField label="Country Code (G)" error={errors.G}>
        {isReadOnly('G') ? (
          <FormInput
            testID="pop-field-G"
            value={values.G}
            onChangeText={() => {}}
            editable={false}
          />
        ) : (
          <CountryAutocomplete
            value={values.G}
            onSelect={(code) => onChange('G', code)}
          />
        )}
      </FormField>

      <FormField label="Manufacturer Code (H)" error={errors.H}>
        <FormInput
          testID="pop-field-H"
          value={values.H}
          onChangeText={(text) => onChange('H', text.toUpperCase())}
          placeholder="e.g., ABC"
          autoCapitalize="characters"
          editable={!isReadOnly('H')}
        />
      </FormField>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="POPMarkingForm.test" --watchAll=false`

Expected: PASS (all 8 tests)

**Step 5: Export from index**

Add to `src/components/preparer/index.ts`:

```typescript
export * from './POPMarkingForm';
```

**Step 6: Commit**

```bash
git add src/components/preparer/POPMarkingForm.tsx src/components/preparer/__tests__/POPMarkingForm.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add POPMarkingForm component for POP field entry"
```

---

### Task 4: POPMarkingDisplay Component

**Files:**
- Create: `src/components/preparer/POPMarkingDisplay.tsx`
- Create: `src/components/preparer/__tests__/POPMarkingDisplay.test.tsx`
- Modify: `src/components/preparer/index.ts`

**Step 1: Write the failing test**

Create `src/components/preparer/__tests__/POPMarkingDisplay.test.tsx`:

```typescript
// src/components/preparer/__tests__/POPMarkingDisplay.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { POPMarkingDisplay } from '../POPMarkingDisplay';

describe('POPMarkingDisplay', () => {
  const solidValues = {
    A: 'u',
    B: '4G',
    C: 'Y',
    D: '50',
    E: 'S',
    F: '24',
    G: 'USA',
    H: 'ABC',
  };

  const liquidValues = {
    A: 'u',
    B: '1A1',
    C: 'X',
    D: '1.2',
    E: '100',
    F: '24',
    G: 'USA',
    H: 'XYZ',
  };

  it('renders solid POP marking format', () => {
    const { getByText } = render(
      <POPMarkingDisplay values={solidValues} physicalState="solid" />
    );
    expect(getByText(/4G/)).toBeTruthy();
    expect(getByText(/Y/)).toBeTruthy();
    expect(getByText(/50/)).toBeTruthy();
  });

  it('renders liquid POP marking format', () => {
    const { getByText } = render(
      <POPMarkingDisplay values={liquidValues} physicalState="liquid" />
    );
    expect(getByText(/1A1/)).toBeTruthy();
    expect(getByText(/X/)).toBeTruthy();
    expect(getByText(/1\.2/)).toBeTruthy();
  });

  it('renders UN symbol', () => {
    const { getByTestId } = render(
      <POPMarkingDisplay values={solidValues} physicalState="solid" />
    );
    expect(getByTestId('pop-display-container')).toBeTruthy();
  });

  it('renders compact variant', () => {
    const { getByTestId } = render(
      <POPMarkingDisplay values={solidValues} physicalState="solid" variant="compact" />
    );
    const container = getByTestId('pop-display-container');
    expect(container).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="POPMarkingDisplay.test" --watchAll=false`

Expected: FAIL with "Cannot find module '../POPMarkingDisplay'"

**Step 3: Write minimal implementation**

Create `src/components/preparer/POPMarkingDisplay.tsx`:

```typescript
// src/components/preparer/POPMarkingDisplay.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/components/ui';
import { POPMarkingFields } from './POPMarkingForm';

export interface POPMarkingDisplayProps {
  values: POPMarkingFields;
  physicalState: 'solid' | 'liquid';
  variant?: 'compact' | 'full';
}

export const POPMarkingDisplay: React.FC<POPMarkingDisplayProps> = ({
  values,
  physicalState,
  variant = 'full',
}) => {
  const isCompact = variant === 'compact';

  // Format: u/B/C/D/E/F/G/H for solids: u/4G/Y/50/S/24/USA/ABC
  // Format: u/B/C/D/E/F/G/H for liquids: u/1A1/X/1.2/100/24/USA/XYZ
  const topLine = `${values.A} ${values.B}/${values.C}/${values.D}`;
  const bottomLine = physicalState === 'liquid'
    ? `${values.E}/${values.F}`
    : `${values.E}/${values.F}`;
  const countryLine = `${values.G}/${values.H}`;

  return (
    <View
      testID="pop-display-container"
      style={[styles.container, isCompact && styles.containerCompact]}
    >
      <View style={styles.unSymbol}>
        <Text style={styles.unText}>UN</Text>
      </View>
      <View style={styles.markingContent}>
        <Text style={[styles.markingText, isCompact && styles.markingTextCompact]}>
          {topLine}
        </Text>
        <Text style={[styles.markingText, isCompact && styles.markingTextCompact]}>
          {bottomLine}
        </Text>
        <Text style={[styles.markingText, isCompact && styles.markingTextCompact]}>
          {countryLine}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  containerCompact: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  unSymbol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  markingContent: {
    flex: 1,
  },
  markingText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  markingTextCompact: {
    fontSize: 12,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="POPMarkingDisplay.test" --watchAll=false`

Expected: PASS (all 4 tests)

**Step 5: Export from index**

Add to `src/components/preparer/index.ts`:

```typescript
export * from './POPMarkingDisplay';
```

**Step 6: Commit**

```bash
git add src/components/preparer/POPMarkingDisplay.tsx src/components/preparer/__tests__/POPMarkingDisplay.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add POPMarkingDisplay component for read-only POP display"
```

---

### Task 5: PackagingCodeCard Component

**Files:**
- Create: `src/components/preparer/PackagingCodeCard.tsx`
- Create: `src/components/preparer/__tests__/PackagingCodeCard.test.tsx`
- Modify: `src/components/preparer/index.ts`

**Step 1: Write the failing test**

Create `src/components/preparer/__tests__/PackagingCodeCard.test.tsx`:

```typescript
// src/components/preparer/__tests__/PackagingCodeCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PackagingCodeCard } from '../PackagingCodeCard';

describe('PackagingCodeCard', () => {
  const defaultProps = {
    code: '4G',
    description: 'Fiberboard box',
  };

  it('renders code and description', () => {
    const { getByText } = render(<PackagingCodeCard {...defaultProps} />);
    expect(getByText('4G')).toBeTruthy();
    expect(getByText('Fiberboard box')).toBeTruthy();
  });

  it('renders restrictions when provided', () => {
    const { getByText } = render(
      <PackagingCodeCard
        {...defaultProps}
        restrictions={['Max 25kg', 'Not for liquids']}
      />
    );
    expect(getByText('Max 25kg')).toBeTruthy();
    expect(getByText('Not for liquids')).toBeTruthy();
  });

  it('applies selected styling when selected', () => {
    const { getByTestId } = render(
      <PackagingCodeCard {...defaultProps} selected />
    );
    const card = getByTestId('packaging-code-card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderColor: expect.any(String) })])
    );
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PackagingCodeCard {...defaultProps} onPress={onPress} />
    );
    fireEvent.press(getByTestId('packaging-code-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when not provided', () => {
    const { getByTestId } = render(<PackagingCodeCard {...defaultProps} />);
    // Should not throw when pressed without onPress
    fireEvent.press(getByTestId('packaging-code-card'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="PackagingCodeCard.test" --watchAll=false`

Expected: FAIL with "Cannot find module '../PackagingCodeCard'"

**Step 3: Write minimal implementation**

Create `src/components/preparer/PackagingCodeCard.tsx`:

```typescript
// src/components/preparer/PackagingCodeCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/components/ui';

export interface PackagingCodeCardProps {
  code: string;
  description: string;
  restrictions?: string[];
  selected?: boolean;
  onPress?: () => void;
}

export const PackagingCodeCard: React.FC<PackagingCodeCardProps> = ({
  code,
  description,
  restrictions = [],
  selected = false,
  onPress,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      testID="packaging-code-card"
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      <View style={styles.header}>
        <Text style={styles.code}>{code}</Text>
        {selected && (
          <MaterialIcons name="check-circle" size={24} color={colors.success} />
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      {restrictions.length > 0 && (
        <View style={styles.restrictions}>
          {restrictions.map((restriction, index) => (
            <View key={index} style={styles.restrictionItem}>
              <MaterialIcons name="info" size={14} color={colors.warning} />
              <Text style={styles.restrictionText}>{restriction}</Text>
            </View>
          ))}
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  containerSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.infoLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.headerTitle,
    color: colors.primary,
  },
  description: {
    ...typography.body,
    color: colors.textPrimary,
  },
  restrictions: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  restrictionText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="PackagingCodeCard.test" --watchAll=false`

Expected: PASS (all 5 tests)

**Step 5: Export from index**

Add to `src/components/preparer/index.ts`:

```typescript
export * from './PackagingCodeCard';
```

**Step 6: Commit**

```bash
git add src/components/preparer/PackagingCodeCard.tsx src/components/preparer/__tests__/PackagingCodeCard.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add PackagingCodeCard component for packaging code display"
```

---

## Phase 4.2: Simple Screens

### Task 6: PackagingScreen Refactor

**Files:**
- Create: `src/screens/preparer/PackagingScreen.tsx`
- Modify: `src/screens/preparer/index.ts`
- Delete (later): `src/components/PackagingScreen.tsx`

**Step 1: Create the refactored screen**

Create `src/screens/preparer/PackagingScreen.tsx`:

```typescript
// src/screens/preparer/PackagingScreen.tsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { GridSelector, colors, spacing } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';

export interface PackagingScreenProps {
  navigation: any;
}

export const PackagingScreen: React.FC<PackagingScreenProps> = ({ navigation }) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const isClass2 = state.hazProPreparerContext.hazardousMaterial?.hazclassDiv?.startsWith('2');

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const markStepComplete = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      'PackagingScreen',
    ];
  }, [completedSubsteps, store.hazProPreparerContext]);

  const initializePOPMarking = useCallback(() => {
    if (store.hazProPreparerContext.packaging && !store.hazProPreparerContext.packaging.inputPOPMarking) {
      store.hazProPreparerContext.packaging.inputPOPMarking = {
        A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null,
      };
    }
  }, [store.hazProPreparerContext.packaging]);

  const setPackagingFlags = useCallback((usesCylinder: boolean, usesPop: boolean) => {
    if (store.hazProPreparerContext.packaging) {
      store.hazProPreparerContext.packaging.usesDotCylinderMarking = usesCylinder;
      store.hazProPreparerContext.packaging.usesPopMarking = usesPop;
    }
  }, [store.hazProPreparerContext.packaging]);

  const handleScanPOP = useCallback(() => {
    markStepComplete();
    setPackagingFlags(false, true);
    store.hazProPreparerContext.packagingEntryMethod = 'scan';
    initializePOPMarking();
    navigation.navigate('POPScannerScreen');
  }, [markStepComplete, setPackagingFlags, initializePOPMarking, navigation]);

  const handleEnterPOP = useCallback(() => {
    markStepComplete();
    if (isClass2) {
      setPackagingFlags(true, false);
      navigation.navigate('CylinderEntryScreen');
    } else {
      setPackagingFlags(false, true);
      store.hazProPreparerContext.packagingEntryMethod = 'manual';
      navigation.navigate('ManualEntryPackagingTypeSelectionScreen');
    }
  }, [markStepComplete, setPackagingFlags, isClass2, navigation]);

  const handleWalkthrough = useCallback(() => {
    markStepComplete();
    setPackagingFlags(false, true);
    store.hazProPreparerContext.packagingEntryMethod = 'walkthrough';
    store.hazProPreparerContext.packagingWizardStep = 0;
    if (store.hazProPreparerContext.packaging) {
      store.hazProPreparerContext.packaging.packagingType = undefined;
      store.hazProPreparerContext.packaging.selectedPackagingOptionId = undefined;
      if (store.hazProPreparerContext.packaging.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.B = null;
      }
    }
    if (store.hazProPreparerContext.shipment) {
      store.hazProPreparerContext.shipment.selectedOuterPackaging = null;
    }
    navigation.navigate('PackagingWizardV2');
  }, [markStepComplete, setPackagingFlags, navigation]);

  const handleUploadCOE = useCallback(() => {
    markStepComplete();
    navigation.navigate('CoeAndCaaDisclaimer');
  }, [markStepComplete, navigation]);

  const handleUploadDOTSP = useCallback(() => {
    markStepComplete();
    navigation.navigate('DotSpScreen');
  }, [markStepComplete, navigation]);

  const banner = {
    id: 'scan',
    label: 'Scan POP Marking',
    icon: <Ionicons name="scan-outline" size={72} color={isClass2 ? colors.textSecondary : colors.white} />,
    onPress: handleScanPOP,
    disabled: isClass2,
  };

  const options = [
    {
      id: 'enter',
      label: 'Enter POP',
      icon: <MaterialIcons name="edit" size={72} color={colors.white} />,
      onPress: handleEnterPOP,
    },
    {
      id: 'coe',
      label: 'Upload COE/CAA',
      icon: <MaterialCommunityIcons name="certificate-outline" size={72} color={colors.white} />,
      onPress: handleUploadCOE,
    },
    {
      id: 'walkthrough',
      label: 'Walkthrough',
      icon: <MaterialCommunityIcons name="compass-outline" size={72} color={isClass2 ? colors.textSecondary : colors.white} />,
      onPress: handleWalkthrough,
      disabled: isClass2,
    },
    {
      id: 'dotsp',
      label: 'Upload DOT-SP',
      icon: <MaterialCommunityIcons name="file-document-outline" size={72} color={colors.white} />,
      onPress: handleUploadDOTSP,
    },
  ];

  return (
    <View style={styles.container}>
      <GridSelector options={options} banner={banner} columns={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.sm,
  },
});

export default PackagingScreen;
```

**Step 2: Export from index**

Add to `src/screens/preparer/index.ts`:

```typescript
export * from './PackagingScreen';
export { default as PackagingScreen } from './PackagingScreen';
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: No errors related to PackagingScreen

**Step 4: Commit**

```bash
git add src/screens/preparer/PackagingScreen.tsx src/screens/preparer/index.ts
git commit -m "refactor(preparer): migrate PackagingScreen to use GridSelector (272 -> ~90 lines)"
```

---

### Task 7: GeneralPackagingAcknowledgementScreen Refactor

**Files:**
- Create: `src/screens/preparer/GeneralPackagingAcknowledgementScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Note:** Read the original `src/components/GeneralPackagingAcknowledgementScreen.tsx` first to understand the exact acknowledgement text and logic, then refactor using `ChecklistItem` and `ActionFooter`.

**Step 1: Read original file**

Read: `src/components/GeneralPackagingAcknowledgementScreen.tsx`

**Step 2: Create refactored screen**

The refactored screen should:
- Use `ChecklistItem` for each acknowledgement checkbox
- Use `ActionFooter` for navigation buttons
- Use `InfoBox` for any informational messages
- Apply theme tokens

**Step 3: Export from index**

Add to `src/screens/preparer/index.ts`:

```typescript
export * from './GeneralPackagingAcknowledgementScreen';
export { default as GeneralPackagingAcknowledgementScreen } from './GeneralPackagingAcknowledgementScreen';
```

**Step 4: Commit**

```bash
git add src/screens/preparer/GeneralPackagingAcknowledgementScreen.tsx src/screens/preparer/index.ts
git commit -m "refactor(preparer): migrate GeneralPackagingAcknowledgementScreen to UI library"
```

---

### Task 8: UnauthorizedPackagingScreen (Consolidation)

**Files:**
- Create: `src/screens/preparer/UnauthorizedPackagingScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Note:** This consolidates `UnauthorizedPopMarking.tsx` and `UnauthorizedCylinderSpecification.tsx` into one configurable screen.

**Step 1: Read original files**

Read: `src/components/UnauthorizedPopMarking.tsx`
Read: `src/components/UnauthorizedCylinderSpecification.tsx`

**Step 2: Create consolidated screen**

```typescript
// src/screens/preparer/UnauthorizedPackagingScreen.tsx

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import {
  ScreenHeader,
  ActionFooter,
  InfoBox,
  colors,
  spacing,
} from '@/components/ui';

export type UnauthorizedPackagingType = 'pop' | 'cylinder';

export interface UnauthorizedPackagingScreenProps {
  navigation: any;
  route: {
    params: {
      type: UnauthorizedPackagingType;
      enteredValue?: string;
      reason?: string;
    };
  };
}

const content: Record<UnauthorizedPackagingType, { title: string; message: string }> = {
  pop: {
    title: 'Unauthorized POP Marking',
    message: 'The POP marking entered is not authorized for this hazardous material. Please verify the packaging code and try again, or select a different packaging option.',
  },
  cylinder: {
    title: 'Unauthorized Cylinder Specification',
    message: 'The cylinder specification entered is not authorized for this hazardous material. Please verify the DOT specification and try again.',
  },
};

export const UnauthorizedPackagingScreen: React.FC<UnauthorizedPackagingScreenProps> = ({
  navigation,
  route,
}) => {
  const { type, enteredValue, reason } = route.params;
  const { title, message } = content[type];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <InfoBox variant="error" message={message} />

        {enteredValue && (
          <InfoBox
            variant="info"
            title="Entered Value"
            message={enteredValue}
          />
        )}

        {reason && (
          <InfoBox
            variant="warning"
            title="Reason"
            message={reason}
          />
        )}
      </View>

      <ActionFooter
        buttons={[
          {
            label: 'Go Back',
            onPress: () => navigation.goBack(),
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
});

export default UnauthorizedPackagingScreen;
```

**Step 3: Export from index**

Add to `src/screens/preparer/index.ts`:

```typescript
export * from './UnauthorizedPackagingScreen';
export { default as UnauthorizedPackagingScreen } from './UnauthorizedPackagingScreen';
```

**Step 4: Commit**

```bash
git add src/screens/preparer/UnauthorizedPackagingScreen.tsx src/screens/preparer/index.ts
git commit -m "refactor(preparer): consolidate unauthorized screens into UnauthorizedPackagingScreen"
```

---

### Task 9: GrandfatheredPackagingReferenceScreen Refactor

**Files:**
- Create: `src/screens/preparer/GrandfatheredPackagingReferenceScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Note:** This is a thin wrapper using `DocumentModal`. Read the original first.

**Step 1: Read original file**

Read: `src/components/GrandfatheredPackagingReferenceScreen.tsx`

**Step 2: Create refactored screen using DocumentModal**

**Step 3: Export and commit**

---

## Phase 4.3: Medium Screens

### Task 10-15: Medium Screen Refactors

For each medium screen, follow the same pattern:

1. Read the original file
2. Create refactored version using UI components
3. Export from index
4. Commit

**Screens to refactor:**
- Task 10: `ManualEntryPackagingTypeScreen` - Use `RadioGroup` or `GridSelector`
- Task 11: `ExceptedQuantityGuidanceScreen` - Use `InfoBox`, `ChecklistItem`, `ActionFooter`
- Task 12: `LimitedQuantityGuidanceScreen` - Use `InfoBox`, `ChecklistItem`, `ActionFooter`
- Task 13: `POPScanResultsScreen` - Use `POPMarkingForm` with `readOnlyFields`
- Task 14: `InnerPackagingWizardScreen` - Use `WizardContainer`
- Task 15: `A8_5PackagingWizardScreen` - Use `WizardContainer`

---

## Phase 4.4: Complex Screens

### Task 16: POPMarkingDataEntryScreen Refactor

**Files:**
- Create: `src/screens/preparer/POPMarkingDataEntryScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Step 1: Read original file**

Read: `src/components/POPMarkingDataEntry.tsx` (full file)

**Step 2: Create refactored screen**

The refactored screen should:
- Use `POPMarkingForm` for field entry
- Use `POPMarkingDisplay` for the preview
- Use `WizardContainer` for the layout (if multi-step) or `ScreenHeader`/`ActionFooter`
- Extract validation logic to stay in the screen
- Apply theme tokens

**Step 3: Export and commit**

---

### Task 17: POPScannerScreen Refactor

**Files:**
- Create: `src/screens/preparer/POPScannerScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Note:** Keep camera logic inline, apply theme tokens.

---

### Task 18: PackagingWizardV2Screen Refactor

**Files:**
- Create: `src/screens/preparer/PackagingWizardV2Screen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Step 1: Read original file**

Read: `src/components/PackagingWizardV2.tsx` (full file)

**Step 2: Create refactored screen**

The refactored screen should:
- Use `WizardContainer` for the wizard shell
- Keep step content inline but simplified
- Remove inline `NavigationFooter` component (use `WizardContainer`)
- Remove local `theme` object (use `@/components/ui` theme)
- Keep existing helper imports from `@/utils/packagingWizardV2Helpers`

---

### Task 19: CylinderEntryScreen Refactor

**Files:**
- Create: `src/screens/preparer/CylinderEntryScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

---

## Phase 4.5: GrandfatheredWizard

### Task 20: GrandfatheredWizardScreen Refactor

**Files:**
- Create: `src/screens/preparer/GrandfatheredWizardScreen.tsx`
- Modify: `src/screens/preparer/index.ts`

**Step 1: Read original file**

Read: `src/components/GrandfatheredWizard.tsx` (full file - 4,064 lines)

**Step 2: Create refactored screen**

The refactored screen should:
- Use `WizardContainer` for the wizard shell
- Keep all `shared/` spec option component imports
- Extract step content into local components or keep inline
- Remove local step indicator/footer implementations
- Apply theme tokens to inline styles
- Group related state

**Expected reduction:** 4,064 -> ~1,200 lines

---

## Phase 4.6: Navigation Updates

### Task 21: Update Navigation

**Files:**
- Modify: `src/navigation/MainLayoutNavigator.tsx` (or wherever navigation is configured)

**Step 1: Update imports**

Change imports from `@/components/` to `@/screens/preparer/` for all migrated screens.

**Step 2: Update screen registrations**

Ensure all screen names match the navigation calls in the refactored screens.

**Step 3: Test navigation flows**

Manually test each packaging flow to ensure navigation works correctly.

---

## Phase 4.7: Cleanup

### Task 22: Delete Old Files

**Files to delete from `src/components/`:**
- `PackagingScreen.tsx`
- `PackagingWizardV2.tsx`
- `GrandfatheredWizard.tsx`
- `CylinderEntryScreen.tsx`
- `POPMarkingDataEntry.tsx`
- `POPScannerScreen.tsx`
- `POPScanResultsScreen.tsx`
- `UnauthorizedPopMarking.tsx`
- `UnauthorizedCylinderSpecification.tsx`
- `ManualEntryPackagingTypeSelection.tsx`
- `LimitedQuantityPackagingGuidance.tsx`
- `ExceptedQuantityPackagingGuidance.tsx`
- `GeneralPackagingAcknowledgementScreen.tsx`
- `GrandfatheredPackagingReferenceScreen.tsx`
- `InnerPackagingWizard.tsx`
- `A8_5PackagingWizard.tsx`

**Step 1: Delete files**

```bash
git rm src/components/PackagingScreen.tsx
# ... repeat for all files
```

**Step 2: Commit**

```bash
git commit -m "chore: delete old packaging screen files after migration"
```

---

## Phase 4.8: Final Verification

### Task 23: Run All Tests

```bash
npm test -- --watchAll=false --testPathIgnorePatterns=".worktrees"
```

Expected: All tests pass

### Task 24: TypeScript Check

```bash
npx tsc --noEmit
```

Expected: No errors

### Task 25: Line Count Verification

```bash
wc -l src/screens/preparer/*Packaging*.tsx src/screens/preparer/*POP*.tsx src/screens/preparer/*Cylinder*.tsx src/screens/preparer/*Wizard*.tsx src/screens/preparer/*Guidance*.tsx src/screens/preparer/*Unauthorized*.tsx src/screens/preparer/*Grandfathered*.tsx 2>/dev/null | tail -1
```

Expected: Total ~5,000 lines (down from ~13,000)

---

## Success Criteria Checklist

- [ ] All 5 new components created with tests (Tasks 1-5)
- [ ] All 16 screens migrated (Tasks 6-20)
- [ ] Navigation updated (Task 21)
- [ ] Old files deleted (Task 22)
- [ ] All tests pass (Task 23)
- [ ] TypeScript compiles (Task 24)
- [ ] ~60% line reduction achieved (Task 25)
- [ ] All existing functionality preserved
