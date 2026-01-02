import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ReportIssueViewProps {
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  recommendedMessage?: string;
  initialCorrectValue?: string;
  onSubmit: (correctValue: string, additionalComments?: string) => void;
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
    if (upperValue.includes("CARGO") && !upperValue.includes("PASSENGER")) {
      return config.options[1]; // CARGO AIRCRAFT ONLY
    }
    return config.options[0]; // PASSENGER AND CARGO AIRCRAFT
  }

  if (fieldKey === "shipmentType") {
    if (upperValue.includes("RADIOACTIVE") && !upperValue.includes("NON")) {
      return config.options[1]; // RADIOACTIVE
    }
    return config.options[0]; // NON-RADIOACTIVE
  }

  return value;
};

// Helper to get the OTHER binary option (the correct one when current is wrong)
const getOtherBinaryOption = (fieldKey: string, currentValue: string): string => {
  const config = BINARY_FIELD_OPTIONS[fieldKey];
  if (!config) return "";

  const currentSelection = getCurrentBinarySelection(fieldKey, currentValue);
  // Return the option that is NOT the current selection
  return currentSelection === config.options[0] ? config.options[1] : config.options[0];
};

/**
 * ReportIssueView - Deliberate, serious interface for documenting compliance violations
 *
 * Features:
 * - Read-only display of current (incorrect) value
 * - Required input for correct value
 * - Optional additional comments
 * - Prominent red "Save Frustration" button
 */
const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  fieldKey,
  fieldLabel,
  fieldValue,
  recommendedMessage,
  initialCorrectValue,
  onSubmit,
  onBack,
}) => {
  // Check if this is a binary field
  const isBinaryField = !!BINARY_FIELD_OPTIONS[fieldKey];

  // For binary fields, auto-determine the correct value
  const binaryCorrectValue = isBinaryField ? getOtherBinaryOption(fieldKey, fieldValue) : "";

  const [correctValue, setCorrectValue] = useState(
    initialCorrectValue || (isBinaryField ? binaryCorrectValue : "")
  );
  const [additionalComments, setAdditionalComments] = useState("");
  const correctValueInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Pre-populate with recommended message if available
    if (recommendedMessage) {
      setAdditionalComments(recommendedMessage);
    } else {
      setAdditionalComments("");
    }
  }, [recommendedMessage]);

  useEffect(() => {
    // Pre-populate correct value if available
    if (initialCorrectValue) {
      setCorrectValue(initialCorrectValue);
    } else if (isBinaryField) {
      // For binary fields, auto-set the correct value
      setCorrectValue(binaryCorrectValue);
    }
  }, [initialCorrectValue, isBinaryField, binaryCorrectValue]);

  // Auto-focus the correct value input when component mounts (only for non-binary fields)
  useEffect(() => {
    if (!isBinaryField) {
      // Small delay to ensure modal animation completes
      const timer = setTimeout(() => {
        correctValueInputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isBinaryField]);

  const handleSubmit = () => {
    // For binary fields, correct value is auto-determined
    const finalCorrectValue = isBinaryField ? binaryCorrectValue : correctValue.trim();

    if (!finalCorrectValue) {
      return; // Button will be disabled, but this is a safety check
    }
    onSubmit(finalCorrectValue, additionalComments.trim() || undefined);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {/* Field Label */}
        <Text style={styles.fieldLabel}>{fieldLabel}</Text>

        {/* Current Value (Read-Only) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current (Incorrect) Value:</Text>
          <View style={[styles.valueBox, isBinaryField && styles.valueBoxError]}>
            <Text style={styles.valueText}>{fieldValue || "No data"}</Text>
          </View>
        </View>

        {/* Correct Value - Different UI for binary vs text fields */}
        {isBinaryField ? (
          <View style={styles.section}>
            <View style={styles.autoCorrectLabelContainer}>
              <Text style={styles.sectionLabel}>Correct Value:</Text>
              <View style={styles.autoBadge}>
                <Text style={styles.autoBadgeText}>AUTO-DETERMINED</Text>
              </View>
            </View>
            <View style={styles.correctValueBox}>
              <MaterialIcons name="check-circle" size={20} color="#34C759" />
              <Text style={styles.correctValueText}>{binaryCorrectValue}</Text>
            </View>
            <Text style={styles.helperText}>
              Since there are only two options, the correct value is automatically determined.
            </Text>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.requiredLabelContainer}>
              <Text style={styles.sectionLabel}>Correct Value:</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredBadgeText}>REQUIRED</Text>
              </View>
            </View>
            <TextInput
              ref={correctValueInputRef}
              style={[styles.correctValueInput, !correctValue.trim() && styles.inputError]}
              value={correctValue}
              onChangeText={setCorrectValue}
              placeholder="Enter the correct value for this field..."
              placeholderTextColor="#A8A8A8"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              What should this field contain? This is the most important information for re-inspection.
            </Text>
          </View>
        )}

        {/* Additional Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Additional Details{" "}
            {recommendedMessage ? "(Pre-filled)" : "(Optional)"}:
          </Text>
          <TextInput
            style={styles.commentsInput}
            value={additionalComments}
            onChangeText={setAdditionalComments}
            placeholder="Describe specific compliance issue or regulation violation..."
            placeholderTextColor="#A8A8A8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.helperText}>
            Provide additional context to help with re-inspection
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom, above keyboard */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={18} color="#8E8E93" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !isBinaryField && !correctValue.trim() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isBinaryField && !correctValue.trim()}
        >
          <Text style={[
            styles.submitButtonText,
            !isBinaryField && !correctValue.trim() && styles.submitButtonTextDisabled
          ]}>
            Save Frustration
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReportIssueView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 16,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF5F5",
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF3B30",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  warningText: {
    fontSize: 14,
    color: "#1D1D1F",
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  valueBox: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  valueBoxError: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  valueText: {
    fontSize: 15,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  // Auto-determined correct value styles
  autoCorrectLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  autoBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  correctValueBox: {
    backgroundColor: "#E8F8EC",
    borderRadius: 8,
    padding: 14,
    borderWidth: 2,
    borderColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  correctValueText: {
    fontSize: 15,
    color: "#1D1D1F",
    fontWeight: "600",
    flex: 1,
  },
  commentsInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: "#1D1D1F",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginBottom: 6,
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  requiredLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requiredBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  correctValueInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#1D1D1F",
    fontWeight: "600",
    borderWidth: 2,
    borderColor: "#007AFF",
    marginBottom: 6,
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  submitButtonDisabled: {
    backgroundColor: "#C7C7CC",
    opacity: 0.6,
  },
  submitButtonTextDisabled: {
    color: "#8E8E93",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    minHeight: 44,
  },
  backButtonText: {
    color: "#8E8E93",
    fontSize: 15,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 44,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
