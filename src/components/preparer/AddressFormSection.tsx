// src/components/preparer/AddressFormSection.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField, FormRow, FormInput } from '@/components/ui';
import { CountryAutocomplete } from './CountryAutocomplete';

interface FieldError {
  message?: string;
}

export interface AddressFormSectionProps {
  type: 'shipper' | 'consignee';
  // Country
  country: string;
  onCountryChange: (country: string) => void;
  countryError?: FieldError;
  // Location Name (shipper) or DODAAC (consignee)
  locationOrDodaac: string;
  onLocationOrDodaacChange: (value: string) => void;
  locationOrDodaacError?: FieldError;
  // Street
  street: string;
  onStreetChange: (street: string) => void;
  streetError?: FieldError;
  // City
  city: string;
  onCityChange: (city: string) => void;
  cityError?: FieldError;
  // State (optional, only enabled for USA)
  state: string;
  onStateChange: (state: string) => void;
  // Zip Code
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
  zipCodeError?: FieldError;
  // Additional options
  streetRequired?: boolean;
  cityRequired?: boolean;
  zipCodeRequired?: boolean;
}

export const AddressFormSection: React.FC<AddressFormSectionProps> = ({
  type,
  country,
  onCountryChange,
  countryError,
  locationOrDodaac,
  onLocationOrDodaacChange,
  locationOrDodaacError,
  street,
  onStreetChange,
  streetError,
  city,
  onCityChange,
  cityError,
  state,
  onStateChange,
  zipCode,
  onZipCodeChange,
  zipCodeError,
  streetRequired = type === 'shipper',
  cityRequired = type === 'shipper',
  zipCodeRequired = type === 'shipper',
}) => {
  const isUSA = country.toLowerCase().includes('united states');
  const locationLabel = type === 'shipper' ? 'Location Name' : 'DODAAC';
  const locationPlaceholder = type === 'shipper' ? 'Enter location name' : 'Enter DODAAC';

  return (
    <View style={styles.container}>
      {/* Country */}
      <FormRow>
        <FormField label="Country" required error={countryError} flex={1}>
          <CountryAutocomplete
            value={country}
            onChange={onCountryChange}
            error={countryError}
          />
        </FormField>
      </FormRow>

      {/* Location Name / DODAAC */}
      <FormRow>
        <FormField
          label={locationLabel}
          required
          error={locationOrDodaacError}
          flex={1}
        >
          <FormInput
            placeholder={locationPlaceholder}
            value={locationOrDodaac}
            onChangeText={onLocationOrDodaacChange}
            error={locationOrDodaacError}
          />
        </FormField>
      </FormRow>

      {/* Street */}
      <FormRow>
        <FormField
          label="Street"
          required={streetRequired}
          error={streetError}
          flex={1}
        >
          <FormInput
            placeholder="Enter street address"
            value={street}
            onChangeText={onStreetChange}
            error={streetError}
          />
        </FormField>
      </FormRow>

      {/* City, State, Zip */}
      <FormRow lastRow>
        <FormField
          label="City"
          required={cityRequired}
          error={cityError}
          flex={2}
        >
          <FormInput
            placeholder="Enter city"
            value={city}
            onChangeText={onCityChange}
            error={cityError}
          />
        </FormField>

        <FormField label="State" flex={1}>
          <FormInput
            placeholder="Enter state"
            value={state}
            onChangeText={onStateChange}
            disabled={!isUSA}
            editable={isUSA}
          />
        </FormField>

        <FormField
          label="Zip Code"
          required={zipCodeRequired}
          error={zipCodeError}
          flex={1}
        >
          <FormInput
            placeholder="Enter zip code"
            value={zipCode}
            onChangeText={onZipCodeChange}
            error={zipCodeError}
          />
        </FormField>
      </FormRow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container doesn't need additional styling as FormRow handles spacing
  },
});
