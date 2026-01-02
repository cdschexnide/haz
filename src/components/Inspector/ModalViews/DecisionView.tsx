import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DecisionViewProps {
  fieldLabel: string;
  fieldValue: string;
  onChooseEdit: () => void;
  onChooseReport: () => void;
}

/**
 * DecisionView - Initial modal state where user chooses their intent
 *
 * Purpose: Clearly separate two user journeys:
 * 1. Edit Value - Fix OCR errors (most common)
 * 2. Report Issue - Document compliance violations (less common)
 */
const DecisionView: React.FC<DecisionViewProps> = ({
  fieldLabel,
  fieldValue,
  onChooseEdit,
  onChooseReport,
}) => {
  return (
    <View style={styles.container}>
      {/* Field Label */}
      <Text style={styles.fieldLabel}>{fieldLabel}</Text>

      {/* Current Value Display */}
      <View style={styles.valueBox}>
        <Text style={styles.valueLabel}>Current Value:</Text>
        <Text style={styles.valueText}>{fieldValue || "No data"}</Text>
      </View>

      {/* Section Header */}
      <Text style={styles.sectionHeader}>What would you like to do?</Text>

      {/* Option 1: Edit/Correct Information */}
      <TouchableOpacity
        style={[styles.actionCard, styles.editCard]}
        onPress={onChooseEdit}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, styles.editIconCircle]}>
                <MaterialIcons name="edit" size={20} color="#007AFF" />
              </View>
              <Text style={styles.cardTitle}>
                CORRECT OCR EXTRACTED INFORMATION
              </Text>
            </View>
            <Text style={styles.cardDescription}>
              Fix OCR scanning errors or update incorrect field values
            </Text>
          </View>
          <View style={styles.cardAction}>
            <Text style={styles.editActionText}>Edit This Field</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Option 2: Report Compliance Issue */}
      <TouchableOpacity
        style={[styles.actionCard, styles.reportCard]}
        onPress={onChooseReport}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, styles.reportIconCircle]}>
                <MaterialIcons name="warning" size={20} color="#FF9500" />
              </View>
              <Text style={styles.cardTitle}>FRUSTRATE THIS FIELD</Text>
            </View>
            <Text style={styles.cardDescription}>
              Document AFMAN24-604 non-compliance that requires re-inspection
            </Text>
          </View>
          <View style={styles.cardAction}>
            <Text style={styles.reportActionText}>Frustrate</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#FF9500" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DecisionView;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  valueBox: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 15,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  editCard: {
    backgroundColor: "#F0F8FF",
    borderColor: "#007AFF",
  },
  reportCard: {
    backgroundColor: "#FFF9F0",
    borderColor: "#FF9500",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  reportIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editActionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },
  reportActionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF9500",
  },
});
