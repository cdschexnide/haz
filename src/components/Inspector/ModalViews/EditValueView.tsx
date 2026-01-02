import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EditValueViewProps {
  fieldKey: string;
  fieldLabel: string;
  initialValue: string;
  onSave: (newValue: string) => void;
  onBack: () => void;
}

// Binary field configuration
const BINARY_FIELD_OPTIONS: Record<string, { options: [string, string]; label: string }> = {
  aircraftType: {
    options: ["PASSENGER AND CARGO AIRCRAFT", "CARGO AIRCRAFT ONLY"],
    label: "Aircraft Type",
  },
  shipmentType: {
    options: ["NON-RADIOACTIVE", "RADIOACTIVE"],
    label: "Shipment Type",
  },
};

// Helper to determine which option is currently selected
const getCurrentBinarySelection = (fieldKey: string, value: string): string => {
  const config = BINARY_FIELD_OPTIONS[fieldKey];
  if (!config) return value;

  const upperValue = value.toUpperCase();

  if (fieldKey === "aircraftType") {
    // If contains CARGO but NOT PASSENGER, it's cargo only
    if (upperValue.includes("CARGO") && !upperValue.includes("PASSENGER")) {
      return config.options[1]; // CARGO AIRCRAFT ONLY
    }
    return config.options[0]; // PASSENGER AND CARGO AIRCRAFT
  }

  if (fieldKey === "shipmentType") {
    // If contains RADIOACTIVE but NOT NON, it's radioactive
    if (upperValue.includes("RADIOACTIVE") && !upperValue.includes("NON")) {
      return config.options[1]; // RADIOACTIVE
    }
    return config.options[0]; // NON-RADIOACTIVE
  }

  return value;
};

/**
 * EditValueView - Clean, focused interface for correcting OCR errors
 *
 * Features:
 * - Large, easy-to-edit text input
 * - Contextual help text
 * - Auto-save on blur or explicit save
 * - Success confirmation
 * - Easy navigation back
 */
const EditValueView: React.FC<EditValueViewProps> = ({
  fieldKey,
  fieldLabel,
  initialValue,
  onSave,
  onBack,
}) => {
  const [editedValue, setEditedValue] = useState(initialValue);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if this is a binary field
  const binaryConfig = BINARY_FIELD_OPTIONS[fieldKey];
  const isBinaryField = !!binaryConfig;

  // For binary fields, determine the current selection
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    if (isBinaryField) {
      return getCurrentBinarySelection(fieldKey, initialValue);
    }
    return "";
  });

  useEffect(() => {
    setEditedValue(initialValue);
    setHasChanges(false);
    setShowSuccess(false);
    if (isBinaryField) {
      setSelectedOption(getCurrentBinarySelection(fieldKey, initialValue));
    }
  }, [initialValue, fieldKey, isBinaryField]);

  const handleValueChange = (text: string) => {
    setEditedValue(text);
    setHasChanges(text !== initialValue);
    setShowSuccess(false);
  };

  // Handler for binary option selection
  const handleBinaryOptionSelect = (option: string) => {
    Vibration.vibrate(10);
    setSelectedOption(option);
    const currentSelection = getCurrentBinarySelection(fieldKey, initialValue);
    setHasChanges(option !== currentSelection);
    setShowSuccess(false);
  };

  const handleSave = () => {
    if (hasChanges) {
      if (isBinaryField) {
        onSave(selectedOption);
      } else {
        onSave(editedValue);
      }
      setShowSuccess(true);
      setHasChanges(false);
      // Auto-hide success message after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {/* Field Label */}
        <Text style={styles.fieldLabel}>{fieldLabel}</Text>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={18} color="#007AFF" />
          <Text style={styles.infoText}>
            {isBinaryField
              ? "Select the correct option as it appears on the physical SDDG"
              : "Enter the correct information as it appears on the physical SDDG"
            }
          </Text>
        </View>

        {/* Binary Field Selector OR Text Input */}
        {isBinaryField && binaryConfig ? (
          <View style={styles.binaryOptionsContainer}>
            {binaryConfig.options.map((option, index) => {
              const isSelected = selectedOption === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.binaryOptionButton,
                    isSelected && styles.binaryOptionButtonSelected,
                  ]}
                  onPress={() => handleBinaryOptionSelect(option)}
                  activeOpacity={0.7}
                >
                  <View style={styles.binaryOptionContent}>
                    <View style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.binaryOptionText,
                      isSelected && styles.binaryOptionTextSelected,
                    ]}>
                      {option}
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <>
            {/* Editable Text Input */}
            <TextInput
              style={styles.textInput}
              value={editedValue}
              onChangeText={handleValueChange}
              placeholder="Enter field value..."
              placeholderTextColor="#A8A8A8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
              onBlur={handleSave} // Auto-save on blur
            />

            {/* Character Count (helpful for fields with limits) */}
            <Text style={styles.characterCount}>
              {editedValue.length} characters
            </Text>
          </>
        )}

        {/* Success Message */}
        {showSuccess && (
          <View style={styles.successBanner}>
            <MaterialIcons name="check-circle" size={18} color="#34C759" />
            <Text style={styles.successText}>Value saved successfully</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Footer - Always Visible */}
      <View style={styles.footer}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <MaterialIcons name="arrow-back" size={18} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              !hasChanges && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text
              style={[
                styles.saveButtonText,
                !hasChanges && styles.saveButtonTextDisabled,
              ]}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditValueView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1D1D1F',
    lineHeight: 18,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#1D1D1F',
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginBottom: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EC',
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    minHeight: 44,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#8E8E93',
  },
  // Binary field selector styles
  binaryOptionsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  binaryOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  binaryOptionButtonSelected: {
    backgroundColor: '#E8F4FF',
    borderColor: '#007AFF',
  },
  binaryOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  binaryOptionText: {
    fontSize: 15,
    color: '#1D1D1F',
    fontWeight: '500',
    flex: 1,
  },
  binaryOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
