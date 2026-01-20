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
      <FormField label="Packaging Code (B)" error={errors.B ? { message: errors.B } : undefined}>
        <FormInput
          testID="pop-field-B"
          value={values.B}
          onChangeText={(text) => onChange('B', text.toUpperCase())}
          placeholder="e.g., 4G"
          autoCapitalize="characters"
          editable={!isReadOnly('B')}
        />
      </FormField>

      <FormField label="Packing Group (C)" error={errors.C ? { message: errors.C } : undefined}>
        <RadioGroup
          options={packingGroupOptions}
          selectedValue={values.C}
          onValueChange={(value) => onChange('C', value)}
          disabled={isReadOnly('C')}
          horizontal
        />
      </FormField>

      <FormField label={fieldDLabel} error={errors.D ? { message: errors.D } : undefined}>
        <FormInput
          testID="pop-field-D"
          value={values.D}
          onChangeText={(text) => onChange('D', text)}
          placeholder={physicalState === 'liquid' ? 'e.g., 1.2' : 'e.g., 50'}
          keyboardType="decimal-pad"
          editable={!isReadOnly('D')}
        />
      </FormField>

      <FormField label="Test Pressure kPa (E)" error={errors.E ? { message: errors.E } : undefined}>
        <FormInput
          testID="pop-field-E"
          value={values.E}
          onChangeText={(text) => onChange('E', text)}
          placeholder="e.g., 100 or S"
          editable={!isReadOnly('E')}
        />
      </FormField>

      <FormField label="Year of Manufacture (F)" error={errors.F ? { message: errors.F } : undefined}>
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

      <FormField label="Country Code (G)" error={errors.G ? { message: errors.G } : undefined}>
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
            onChange={(code) => onChange('G', code)}
          />
        )}
      </FormField>

      <FormField label="Manufacturer Code (H)" error={errors.H ? { message: errors.H } : undefined}>
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
