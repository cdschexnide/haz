# Preparer Phase 1 UI Refactor - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the 3 Shipment Creation phase screens (PreparerHomeScreen, DisclaimerScreen, ShipmentCreationScreen) to use reusable UI components, reducing technical debt by ~60%.

**Architecture:** Extract inline component definitions into `src/components/ui/` for generic components and `src/components/preparer/` for preparer-specific components. Move screen files to `src/screens/preparer/`. Use existing theme system for consistent styling.

**Tech Stack:** React Native, TypeScript, Valtio (state), react-hook-form + Yup (forms), @testing-library/react-native (tests), Jest (test runner)

---

## Task 1: Create FormField Component

**Files:**
- Create: `src/components/ui/FormField.tsx`
- Create: `src/components/ui/__tests__/FormField.test.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Write the test file**

```typescript
// src/components/ui/__tests__/FormField.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('renders label correctly', () => {
    const { getByText } = render(
      <FormField label="Test Label">
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders required asterisk when required prop is true', () => {
    const { getByText } = render(
      <FormField label="Test Label" required>
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('*')).toBeTruthy();
  });

  it('renders error message when error prop is provided', () => {
    const { getByText } = render(
      <FormField label="Test Label" error={{ message: 'This field is required' }}>
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <FormField label="Test Label">
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('Child content')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="FormField.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../FormField'"

**Step 3: Write the FormField component**

```typescript
// src/components/ui/FormField.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from './theme';

interface FieldError {
  message?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: ReactNode;
  flex?: number;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  flex,
  style,
}) => {
  return (
    <View style={[styles.container, flex !== undefined && { flex }, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      {children}
      {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="FormField.test" --watchAll=false`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/components/ui/FormField.tsx src/components/ui/__tests__/FormField.test.tsx
git commit -m "feat(ui): add FormField component for form labels and errors"
```

---

## Task 2: Create FormRow Component

**Files:**
- Create: `src/components/ui/FormRow.tsx`
- Create: `src/components/ui/__tests__/FormRow.test.tsx`

**Step 1: Write the test file**

```typescript
// src/components/ui/__tests__/FormRow.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FormRow } from '../FormRow';

describe('FormRow', () => {
  it('renders children in a row', () => {
    const { getByText } = render(
      <FormRow>
        <Text>Field 1</Text>
        <Text>Field 2</Text>
      </FormRow>
    );
    expect(getByText('Field 1')).toBeTruthy();
    expect(getByText('Field 2')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <FormRow>
        <Text>Field 1</Text>
        <Text>Field 2</Text>
      </FormRow>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="FormRow.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../FormRow'"

**Step 3: Write the FormRow component**

```typescript
// src/components/ui/FormRow.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from './theme';

export interface FormRowProps {
  children: ReactNode;
  lastRow?: boolean;
  style?: ViewStyle;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  lastRow = false,
  style,
}) => {
  return (
    <View style={[styles.row, lastRow && styles.lastRow, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  lastRow: {
    marginBottom: 0,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="FormRow.test" --watchAll=false`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/components/ui/FormRow.tsx src/components/ui/__tests__/FormRow.test.tsx
git commit -m "feat(ui): add FormRow component for horizontal form layouts"
```

---

## Task 3: Create FormInput Component

**Files:**
- Create: `src/components/ui/FormInput.tsx`
- Create: `src/components/ui/__tests__/FormInput.test.tsx`

**Step 1: Write the test file**

```typescript
// src/components/ui/__tests__/FormInput.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  it('renders placeholder text', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('displays value correctly', () => {
    const { getByDisplayValue } = render(
      <FormInput value="Test value" onChangeText={() => {}} />
    );
    expect(getByDisplayValue('Test value')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter text" onChangeText={mockOnChange} />
    );
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New text');
    expect(mockOnChange).toHaveBeenCalledWith('New text');
  });

  it('applies error styling when error prop is provided', () => {
    const { toJSON } = render(
      <FormInput placeholder="Enter text" error={{ message: 'Error' }} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('is not editable when disabled', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter text" disabled />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="FormInput.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../FormInput'"

**Step 3: Write the FormInput component**

```typescript
// src/components/ui/FormInput.tsx
import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';

interface FieldError {
  message?: string;
}

export interface FormInputProps extends TextInputProps {
  error?: FieldError;
  disabled?: boolean;
  inputStyle?: ViewStyle;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ error, disabled = false, inputStyle, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        editable={!disabled}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.borderLight,
    color: colors.textSecondary,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="FormInput.test" --watchAll=false`
Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add src/components/ui/FormInput.tsx src/components/ui/__tests__/FormInput.test.tsx
git commit -m "feat(ui): add FormInput component with error and disabled states"
```

---

## Task 4: Create RadioGroup Component

**Files:**
- Create: `src/components/ui/RadioGroup.tsx`
- Create: `src/components/ui/__tests__/RadioGroup.test.tsx`

**Step 1: Write the test file**

```typescript
// src/components/ui/__tests__/RadioGroup.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RadioGroup } from '../RadioGroup';

const mockOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );
    expect(getByText('Option A')).toBeTruthy();
    expect(getByText('Option B')).toBeTruthy();
    expect(getByText('Option C')).toBeTruthy();
  });

  it('renders the label', () => {
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );
    expect(getByText('Test Group')).toBeTruthy();
  });

  it('calls onChange when option is pressed', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    fireEvent.press(getByText('Option B'));
    expect(mockOnChange).toHaveBeenCalledWith('b');
  });

  it('shows required asterisk when required', () => {
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={() => {}}
        required
      />
    );
    expect(getByText('*')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="RadioGroup.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../RadioGroup'"

**Step 3: Write the RadioGroup component**

```typescript
// src/components/ui/RadioGroup.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from './theme';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  horizontal?: boolean;
  style?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  horizontal = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <View style={[styles.optionsContainer, horizontal && styles.horizontal]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {value === option.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="RadioGroup.test" --watchAll=false`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/components/ui/RadioGroup.tsx src/components/ui/__tests__/RadioGroup.test.tsx
git commit -m "feat(ui): add RadioGroup component with horizontal layout option"
```

---

## Task 5: Create DatePickerField Component

**Files:**
- Create: `src/components/ui/DatePickerField.tsx`
- Create: `src/components/ui/__tests__/DatePickerField.test.tsx`

**Step 1: Write the test file**

```typescript
// src/components/ui/__tests__/DatePickerField.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DatePickerField } from '../DatePickerField';

describe('DatePickerField', () => {
  it('renders the label', () => {
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={null}
        onChange={() => {}}
      />
    );
    expect(getByText('Select Date')).toBeTruthy();
  });

  it('displays placeholder when no date selected', () => {
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={null}
        onChange={() => {}}
      />
    );
    expect(getByText('Select a date')).toBeTruthy();
  });

  it('displays formatted date when value provided', () => {
    const testDate = new Date('2026-01-14');
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={testDate}
        onChange={() => {}}
      />
    );
    // Date format: YYYY-MM-DD
    expect(getByText('2026-01-14')).toBeTruthy();
  });

  it('shows required asterisk when required', () => {
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={null}
        onChange={() => {}}
        required
      />
    );
    expect(getByText('*')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="DatePickerField.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../DatePickerField'"

**Step 3: Write the DatePickerField component**

```typescript
// src/components/ui/DatePickerField.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

interface FieldError {
  message?: string;
}

export interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  required?: boolean;
  error?: FieldError;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TouchableOpacity
        style={[styles.button, error && styles.buttonError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, !value && styles.placeholder]}>
          {value ? formatDate(value) : 'Select a date'}
        </Text>
        <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  buttonError: {
    borderColor: colors.error,
  },
  buttonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="DatePickerField.test" --watchAll=false`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/components/ui/DatePickerField.tsx src/components/ui/__tests__/DatePickerField.test.tsx
git commit -m "feat(ui): add DatePickerField component with platform-specific picker"
```

---

## Task 6: Create ConfirmationCard Component

**Files:**
- Create: `src/components/ui/ConfirmationCard.tsx`
- Create: `src/components/ui/__tests__/ConfirmationCard.test.tsx`

**Step 1: Write the test file**

```typescript
// src/components/ui/__tests__/ConfirmationCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmationCard } from '../ConfirmationCard';

describe('ConfirmationCard', () => {
  const defaultProps = {
    title: 'Test Title',
    content: 'Test content message',
    onAccept: jest.fn(),
    onDecline: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title correctly', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders content correctly', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    expect(getByText('Test content message')).toBeTruthy();
  });

  it('renders default button labels', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    expect(getByText('Accept')).toBeTruthy();
    expect(getByText('Decline')).toBeTruthy();
  });

  it('renders custom button labels', () => {
    const { getByText } = render(
      <ConfirmationCard
        {...defaultProps}
        acceptLabel="Confirm"
        declineLabel="Cancel"
      />
    );
    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onAccept when accept button pressed', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    fireEvent.press(getByText('Accept'));
    expect(defaultProps.onAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onDecline when decline button pressed', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    fireEvent.press(getByText('Decline'));
    expect(defaultProps.onDecline).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="ConfirmationCard.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../ConfirmationCard'"

**Step 3: Write the ConfirmationCard component**

```typescript
// src/components/ui/ConfirmationCard.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './theme';
import { Button } from './Button';

export interface ConfirmationCardProps {
  title: string;
  content: string | ReactNode;
  onAccept: () => void;
  onDecline: () => void;
  acceptLabel?: string;
  declineLabel?: string;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  title,
  content,
  onAccept,
  onDecline,
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <View style={styles.content}>
        {typeof content === 'string' ? (
          <Text style={styles.contentText}>{content}</Text>
        ) : (
          content
        )}
      </View>
      <View style={styles.buttonRow}>
        <Button
          label={declineLabel}
          onPress={onDecline}
          variant="destructive"
          style={styles.button}
        />
        <Button
          label={acceptLabel}
          onPress={onAccept}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.medium,
    maxWidth: 400,
    width: '90%',
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  content: {
    marginBottom: spacing.xl,
  },
  contentText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="ConfirmationCard.test" --watchAll=false`
Expected: PASS (6 tests)

**Step 5: Commit**

```bash
git add src/components/ui/ConfirmationCard.tsx src/components/ui/__tests__/ConfirmationCard.test.tsx
git commit -m "feat(ui): add ConfirmationCard component for accept/decline flows"
```

---

## Task 7: Update UI Library Exports

**Files:**
- Modify: `src/components/ui/index.ts`

**Step 1: Update the index.ts file**

Add these lines to the existing exports in `src/components/ui/index.ts`:

```typescript
// Form components
export * from './FormField';
export * from './FormRow';
export * from './FormInput';
export * from './RadioGroup';
export * from './DatePickerField';
export * from './ConfirmationCard';
```

The complete file should now be:

```typescript
// src/components/ui/index.ts

// Theme
export * from './theme';

// Components
export * from './Button';
export * from './ScreenHeader';
export * from './ActionFooter';
export * from './StatusBadge';
export * from './ValidationCard';
export * from './DetailCard';
export * from './SectionHeader';
export * from './StepIndicator';
export * from './InfoBox';

// Form components
export * from './FormField';
export * from './FormRow';
export * from './FormInput';
export * from './RadioGroup';
export * from './DatePickerField';
export * from './ConfirmationCard';
```

**Step 2: Verify imports work**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to new components)

**Step 3: Commit**

```bash
git add src/components/ui/index.ts
git commit -m "feat(ui): export new form components from ui library"
```

---

## Task 8: Create Preparer Components Directory

**Files:**
- Create: `src/components/preparer/index.ts`

**Step 1: Create the directory and index file**

```typescript
// src/components/preparer/index.ts

// Preparer-specific shared components
// Components will be added as they are created
```

**Step 2: Commit**

```bash
mkdir -p src/components/preparer
git add src/components/preparer/index.ts
git commit -m "chore: create preparer components directory"
```

---

## Task 9: Create CountryAutocomplete Component

**Files:**
- Create: `src/components/preparer/CountryAutocomplete.tsx`
- Create: `src/components/preparer/__tests__/CountryAutocomplete.test.tsx`
- Modify: `src/components/preparer/index.ts`

**Step 1: Write the test file**

```typescript
// src/components/preparer/__tests__/CountryAutocomplete.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CountryAutocomplete } from '../CountryAutocomplete';

describe('CountryAutocomplete', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <CountryAutocomplete {...defaultProps} />
    );
    expect(getByPlaceholderText('Search country...')).toBeTruthy();
  });

  it('displays current value', () => {
    const { getByDisplayValue } = render(
      <CountryAutocomplete {...defaultProps} value="United States" />
    );
    expect(getByDisplayValue('United States')).toBeTruthy();
  });

  it('shows suggestions when typing', () => {
    const { getByPlaceholderText, getByText } = render(
      <CountryAutocomplete {...defaultProps} />
    );
    const input = getByPlaceholderText('Search country...');
    fireEvent.changeText(input, 'United');
    expect(getByText('United States')).toBeTruthy();
  });

  it('calls onChange when suggestion selected', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <CountryAutocomplete {...defaultProps} onChange={mockOnChange} />
    );
    const input = getByPlaceholderText('Search country...');
    fireEvent.changeText(input, 'United');
    fireEvent.press(getByText('United States'));
    expect(mockOnChange).toHaveBeenCalledWith('United States');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="CountryAutocomplete.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../CountryAutocomplete'"

**Step 3: Write the CountryAutocomplete component**

```typescript
// src/components/preparer/CountryAutocomplete.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/components/ui/theme';

// Common countries list - can be extended or imported from data file
const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'Italy',
  'Spain',
  'South Korea',
  'Mexico',
  'Brazil',
  'China',
  'India',
  'Netherlands',
  'Belgium',
  'Poland',
  'Turkey',
  'Saudi Arabia',
  'United Arab Emirates',
];

interface FieldError {
  message?: string;
}

export interface CountryAutocompleteProps {
  value: string;
  onChange: (country: string) => void;
  error?: FieldError;
  onStateReset?: () => void;
  label?: string;
  required?: boolean;
}

export const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({
  value,
  onChange,
  error,
  onStateReset,
  label,
  required = false,
}) => {
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [query]);

  const handleSelect = (country: string) => {
    setQuery(country);
    onChange(country);
    setShowSuggestions(false);
    if (onStateReset) {
      onStateReset();
    }
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow press on suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={query}
        onChangeText={handleChangeText}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder="Search country..."
        placeholderTextColor={colors.textSecondary}
      />
      {showSuggestions && filteredCountries.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
      {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    zIndex: 10,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    maxHeight: 200,
    zIndex: 100,
  },
  suggestionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  suggestionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="CountryAutocomplete.test" --watchAll=false`
Expected: PASS (4 tests)

**Step 5: Update exports**

Add to `src/components/preparer/index.ts`:
```typescript
export * from './CountryAutocomplete';
```

**Step 6: Commit**

```bash
git add src/components/preparer/CountryAutocomplete.tsx src/components/preparer/__tests__/CountryAutocomplete.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add CountryAutocomplete component"
```

---

## Task 10: Create ToolButtonsBar Component

**Files:**
- Create: `src/components/preparer/ToolButtonsBar.tsx`
- Create: `src/components/preparer/__tests__/ToolButtonsBar.test.tsx`
- Modify: `src/components/preparer/index.ts`

**Step 1: Write the test file**

```typescript
// src/components/preparer/__tests__/ToolButtonsBar.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToolButtonsBar } from '../ToolButtonsBar';

const mockTools = [
  { icon: 'calculate', label: 'Gas Calculator', onPress: jest.fn() },
  { icon: 'ac-unit', label: 'Dry Ice', onPress: jest.fn() },
  { icon: 'swap-horiz', label: 'Unit Converter', onPress: jest.fn(), disabled: true },
];

describe('ToolButtonsBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tool buttons', () => {
    const { getByText } = render(<ToolButtonsBar tools={mockTools} />);
    expect(getByText('Gas Calculator')).toBeTruthy();
    expect(getByText('Dry Ice')).toBeTruthy();
    expect(getByText('Unit Converter')).toBeTruthy();
  });

  it('calls onPress when tool button is pressed', () => {
    const { getByText } = render(<ToolButtonsBar tools={mockTools} />);
    fireEvent.press(getByText('Gas Calculator'));
    expect(mockTools[0].onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress for disabled tool', () => {
    const { getByText } = render(<ToolButtonsBar tools={mockTools} />);
    fireEvent.press(getByText('Unit Converter'));
    expect(mockTools[2].onPress).not.toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<ToolButtonsBar tools={mockTools} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="ToolButtonsBar.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../ToolButtonsBar'"

**Step 3: Write the ToolButtonsBar component**

```typescript
// src/components/preparer/ToolButtonsBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/components/ui/theme';

export interface ToolButtonConfig {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface ToolButtonsBarProps {
  tools: ToolButtonConfig[];
}

export const ToolButtonsBar: React.FC<ToolButtonsBarProps> = ({ tools }) => {
  return (
    <View style={styles.container}>
      {tools.map((tool, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.toolButton, tool.disabled && styles.toolButtonDisabled]}
          onPress={tool.onPress}
          disabled={tool.disabled}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={tool.icon}
            size={24}
            color={tool.disabled ? colors.textSecondary : colors.primary}
          />
          <Text
            style={[styles.toolLabel, tool.disabled && styles.toolLabelDisabled]}
            numberOfLines={2}
          >
            {tool.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 80,
  },
  toolButtonDisabled: {
    backgroundColor: colors.borderLight,
  },
  toolLabel: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  toolLabelDisabled: {
    color: colors.textSecondary,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="ToolButtonsBar.test" --watchAll=false`
Expected: PASS (4 tests)

**Step 5: Update exports**

Add to `src/components/preparer/index.ts`:
```typescript
export * from './ToolButtonsBar';
```

**Step 6: Commit**

```bash
git add src/components/preparer/ToolButtonsBar.tsx src/components/preparer/__tests__/ToolButtonsBar.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add ToolButtonsBar component for calculator tools"
```

---

## Task 11: Create ShipmentContextMenu Component

**Files:**
- Create: `src/components/preparer/ShipmentContextMenu.tsx`
- Create: `src/components/preparer/__tests__/ShipmentContextMenu.test.tsx`
- Modify: `src/components/preparer/index.ts`

**Step 1: Write the test file**

```typescript
// src/components/preparer/__tests__/ShipmentContextMenu.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShipmentContextMenu } from '../ShipmentContextMenu';

// Mock BottomSheet from @rneui/themed
jest.mock('@rneui/themed', () => ({
  BottomSheet: ({ isVisible, children }: { isVisible: boolean; children: React.ReactNode }) =>
    isVisible ? children : null,
}));

describe('ShipmentContextMenu', () => {
  const mockShipment = {
    id: '123',
    status: 'in-progress' as const,
    savedAt: new Date(),
    hazProPreparerContext: {} as any,
  };

  const defaultProps = {
    visible: true,
    shipment: mockShipment,
    onClose: jest.fn(),
    onResume: jest.fn(),
    onViewSDDG: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    expect(getByText('Resume Preparation')).toBeTruthy();
  });

  it('shows Resume option for in-progress shipment', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    expect(getByText('Resume Preparation')).toBeTruthy();
  });

  it('shows View SDDG option for completed shipment', () => {
    const completedShipment = { ...mockShipment, status: 'completed' as const };
    const { getByText } = render(
      <ShipmentContextMenu {...defaultProps} shipment={completedShipment} />
    );
    expect(getByText('View SDDG')).toBeTruthy();
  });

  it('calls onResume when Resume pressed', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    fireEvent.press(getByText('Resume Preparation'));
    expect(defaultProps.onResume).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel pressed', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    fireEvent.press(getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="ShipmentContextMenu.test" --watchAll=false`
Expected: FAIL with "Cannot find module '../ShipmentContextMenu'"

**Step 3: Write the ShipmentContextMenu component**

```typescript
// src/components/preparer/ShipmentContextMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/components/ui/theme';

interface SavedShipment {
  id: string;
  status: 'in-progress' | 'completed';
  savedAt: Date;
  hazProPreparerContext: any;
}

export interface ShipmentContextMenuProps {
  visible: boolean;
  shipment: SavedShipment | null;
  onClose: () => void;
  onResume: () => void;
  onViewSDDG: () => void;
}

export const ShipmentContextMenu: React.FC<ShipmentContextMenuProps> = ({
  visible,
  shipment,
  onClose,
  onResume,
  onViewSDDG,
}) => {
  if (!shipment) return null;

  const isCompleted = shipment.status === 'completed';

  return (
    <BottomSheet isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shipment Options</Text>
        </View>

        {!isCompleted && (
          <TouchableOpacity style={styles.option} onPress={onResume}>
            <MaterialIcons name="play-arrow" size={24} color={colors.primary} />
            <Text style={styles.optionText}>Resume Preparation</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <TouchableOpacity style={styles.option} onPress={onViewSDDG}>
            <MaterialIcons name="description" size={24} color={colors.primary} />
            <Text style={styles.optionText}>View SDDG</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.option, styles.cancelOption]}
          onPress={onClose}
        >
          <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  cancelOption: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
  },
  cancelText: {
    color: colors.textSecondary,
  },
});
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="ShipmentContextMenu.test" --watchAll=false`
Expected: PASS (5 tests)

**Step 5: Update exports**

Add to `src/components/preparer/index.ts`:
```typescript
export * from './ShipmentContextMenu';
```

**Step 6: Commit**

```bash
git add src/components/preparer/ShipmentContextMenu.tsx src/components/preparer/__tests__/ShipmentContextMenu.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add ShipmentContextMenu bottom sheet component"
```

---

## Task 12: Create Preparer Screens Directory

**Files:**
- Create: `src/screens/preparer/index.ts`

**Step 1: Create the directory and index file**

```typescript
// src/screens/preparer/index.ts

// Preparer workflow screens
// Screens will be added as they are migrated
```

**Step 2: Commit**

```bash
mkdir -p src/screens/preparer
git add src/screens/preparer/index.ts
git commit -m "chore: create preparer screens directory"
```

---

## Task 13: Refactor DisclaimerScreen

**Files:**
- Create: `src/screens/preparer/DisclaimerScreen.tsx`
- Create: `src/screens/preparer/__tests__/DisclaimerScreen.test.tsx`
- Modify: `src/screens/preparer/index.ts`

**Step 1: Write the test file**

```typescript
// src/screens/preparer/__tests__/DisclaimerScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DisclaimerScreen } from '../DisclaimerScreen';

describe('DisclaimerScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders disclaimer title', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    expect(getByText('Important Disclaimer')).toBeTruthy();
  });

  it('renders disclaimer content', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    expect(getByText(/HazPro is a support tool/)).toBeTruthy();
  });

  it('navigates to ShipmentCreation on Accept', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    fireEvent.press(getByText('Accept'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ShipmentCreation');
  });

  it('navigates to PreparerHome on Decline', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    fireEvent.press(getByText('Decline'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PreparerHome');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="screens/preparer/__tests__/DisclaimerScreen" --watchAll=false`
Expected: FAIL with "Cannot find module '../DisclaimerScreen'"

**Step 3: Write the refactored DisclaimerScreen**

```typescript
// src/screens/preparer/DisclaimerScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ConfirmationCard, colors } from '@/components/ui';

interface DisclaimerScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const DISCLAIMER_CONTENT = `HazPro is a support tool designed to assist in the preparation of hazardous materials shipments. It is not a substitute for proper training, certification, or professional judgment.

Users are responsible for ensuring all shipments comply with applicable regulations, including AFMAN 24-604 and other governing standards. Always verify information independently and consult qualified personnel when in doubt.`;

export const DisclaimerScreen: React.FC<DisclaimerScreenProps> = ({
  navigation,
}) => {
  const handleAccept = () => {
    navigation.navigate('ShipmentCreation');
  };

  const handleDecline = () => {
    navigation.navigate('PreparerHome');
  };

  return (
    <View style={styles.container}>
      <ConfirmationCard
        title="Important Disclaimer"
        content={DISCLAIMER_CONTENT}
        onAccept={handleAccept}
        onDecline={handleDecline}
        acceptLabel="Accept"
        declineLabel="Decline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
  },
});

export default DisclaimerScreen;
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="screens/preparer/__tests__/DisclaimerScreen" --watchAll=false`
Expected: PASS (4 tests)

**Step 5: Update exports**

Add to `src/screens/preparer/index.ts`:
```typescript
export * from './DisclaimerScreen';
export { default as DisclaimerScreen } from './DisclaimerScreen';
```

**Step 6: Commit**

```bash
git add src/screens/preparer/DisclaimerScreen.tsx src/screens/preparer/__tests__/DisclaimerScreen.test.tsx src/screens/preparer/index.ts
git commit -m "refactor(preparer): migrate DisclaimerScreen to use ConfirmationCard

- Reduced from ~112 lines to ~45 lines
- Uses ConfirmationCard from UI library
- Moves to src/screens/preparer/ folder"
```

---

## Task 14: Update Navigation to Use New DisclaimerScreen

**Files:**
- Modify: `src/components/MainLayoutNavigator.tsx`

**Step 1: Find the current DisclaimerScreen import**

Read the navigation file to find where DisclaimerScreen is imported and used.

**Step 2: Update the import**

Change:
```typescript
import DisclaimerScreen from './DisclaimerScreen';
```

To:
```typescript
import { DisclaimerScreen } from '@/screens/preparer';
```

**Step 3: Verify the app still works**

Run: `npx expo start` and test the navigation flow manually:
1. Open app
2. Tap "Create New Shipment" on Preparer Home
3. Verify Disclaimer screen appears
4. Tap Accept - should navigate to Shipment Creation
5. Go back and tap Decline - should return to Preparer Home

**Step 4: Commit**

```bash
git add src/components/MainLayoutNavigator.tsx
git commit -m "refactor(nav): use new DisclaimerScreen from screens/preparer"
```

---

## Task 15: Delete Old DisclaimerScreen

**Files:**
- Delete: `src/components/DisclaimerScreen.tsx`
- Move tests: `src/components/__tests__/DisclaimerScreen.test.tsx` (update to point to new location)

**Step 1: Verify no other imports of the old file**

Run: `grep -r "from.*DisclaimerScreen" src/ --include="*.tsx" --include="*.ts"`

Ensure only the new import from `@/screens/preparer` is used.

**Step 2: Delete the old file**

```bash
rm src/components/DisclaimerScreen.tsx
```

**Step 3: Update or remove old test file**

Since we have new tests at `src/screens/preparer/__tests__/DisclaimerScreen.test.tsx`, remove the old one:

```bash
rm src/components/__tests__/DisclaimerScreen.test.tsx
```

**Step 4: Verify tests still pass**

Run: `npm test -- --testPathPattern="DisclaimerScreen" --watchAll=false`
Expected: PASS (tests from new location)

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old DisclaimerScreen from components folder"
```

---

## Task 16-20: Remaining Tasks (Summary)

The remaining tasks follow the same pattern. Due to the complexity of ShipmentCreationScreen and PreparerHomeScreen, these are summarized:

### Task 16: Create AddressFormSection Component
- Extract shipper/consignee address fields into reusable component
- Uses FormField, FormInput, CountryAutocomplete
- Handles conditional state field (enabled only for USA)

### Task 17: Create ShipmentTable Component
- Extract FlatList with search, swipe actions, empty states
- Uses existing styles from PreparerHomeScreen
- Handles filtering and row rendering

### Task 18: Refactor ShipmentCreationScreen
- Move to `src/screens/preparer/ShipmentCreationScreen.tsx`
- Use FormField, FormRow, FormInput, RadioGroup, DatePickerField, AddressFormSection
- Use ActionFooter for buttons
- Target: ~500 lines (down from ~1270)

### Task 19: Refactor PreparerHomeScreen
- Move to `src/screens/preparer/PreparerHomeScreen.tsx`
- Use ToolButtonsBar, ShipmentTable, ShipmentContextMenu
- Keep modal components as-is for now
- Target: ~400 lines (down from ~1000)

### Task 20: Update Navigation and Clean Up
- Update MainLayoutNavigator.tsx with all new imports
- Delete old files from src/components/
- Run full test suite
- Manual verification of complete workflow

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `npm test` passes all tests
- [ ] `npx tsc --noEmit` shows no new TypeScript errors
- [ ] Navigation flow works: Home → Disclaimer → ShipmentCreation → (back to Home)
- [ ] Resume shipment functionality works
- [ ] All 4 calculator modals open and close correctly
- [ ] Form validation works on ShipmentCreationScreen
- [ ] Save & Continue navigates to MaterialIDScreen

---

## File Changes Summary

**New Files (14):**
- `src/components/ui/FormField.tsx`
- `src/components/ui/FormRow.tsx`
- `src/components/ui/FormInput.tsx`
- `src/components/ui/RadioGroup.tsx`
- `src/components/ui/DatePickerField.tsx`
- `src/components/ui/ConfirmationCard.tsx`
- `src/components/preparer/CountryAutocomplete.tsx`
- `src/components/preparer/ToolButtonsBar.tsx`
- `src/components/preparer/ShipmentContextMenu.tsx`
- `src/screens/preparer/DisclaimerScreen.tsx`
- `src/screens/preparer/ShipmentCreationScreen.tsx`
- `src/screens/preparer/PreparerHomeScreen.tsx`
- Plus test files for each

**Modified Files (2):**
- `src/components/ui/index.ts`
- `src/components/MainLayoutNavigator.tsx`

**Deleted Files (3):**
- `src/components/DisclaimerScreen.tsx`
- `src/components/ShipmentCreationScreen.tsx`
- `src/components/PreparerHomeScreen.tsx`
