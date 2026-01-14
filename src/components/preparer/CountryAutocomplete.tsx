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

// Common countries list
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
