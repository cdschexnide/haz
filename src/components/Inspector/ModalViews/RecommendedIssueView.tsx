import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface RecommendedIssueViewProps {
  fieldLabel: string;
  fieldValue: string;
  recommendedMessage: string;
  onEdit: () => void;
  onReport: () => void;
  onDismiss: () => void;
}

/**
 * RecommendedIssueView - Handle automated compliance issue detections
 *
 * Features:
 * - Explains WHY the system flagged this field
 * - Three clear paths: Fix the value, Report the issue, or Dismiss as false positive
 * - Educational for first-time users
 * - Automated detection labeled clearly with robot icon
 */
const RecommendedIssueView: React.FC<RecommendedIssueViewProps> = ({
  fieldLabel,
  fieldValue,
  recommendedMessage,
  onEdit,
  onReport,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Field Label */}
        <Text style={styles.fieldLabel}>{fieldLabel}</Text>

        {/* Automated Detection Banner */}
        <View style={styles.detectionBox}>
          <View style={styles.detectionHeader}>
            <MaterialIcons name="psychology" size={20} color="#FF9500" />
            <Text style={styles.detectionTitle}>AUTOMATED DETECTION</Text>
          </View>
          <Text style={styles.detectionMessage}>{recommendedMessage}</Text>
        </View>

        {/* Current Value Display */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Current Value:</Text>
          <View style={styles.valueBox}>
            <Text style={styles.valueText}>{fieldValue || "No data"}</Text>
          </View>
        </View>

        {/* Actions Header */}
        <Text style={styles.actionsHeader}>What would you like to do?</Text>

        {/* Option 1: Correct the Value */}
        <TouchableOpacity
          style={[styles.actionCard, styles.editCard]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, styles.editIconCircle]}>
                  <MaterialIcons name="edit" size={18} color="#007AFF" />
                </View>
                <Text style={styles.cardTitle}>CORRECT THE VALUE</Text>
              </View>
              <Text style={styles.cardDescription}>
                Add or fix the missing/incorrect information
              </Text>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.editActionText}>Edit Field</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#007AFF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 2: Confirm Issue */}
        <TouchableOpacity
          style={[styles.actionCard, styles.reportCard]}
          onPress={onReport}
          activeOpacity={0.7}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, styles.reportIconCircle]}>
                  <MaterialIcons name="warning" size={18} color="#FF9500" />
                </View>
                <Text style={styles.cardTitle}>CONFIRM FRUSTRATION</Text>
              </View>
              <Text style={styles.cardDescription}>
                Apply the recommended frustration
              </Text>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.reportActionText}>Frustrate</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#FF9500" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 3: Dismiss (False Positive) */}
        {/* <TouchableOpacity
          style={[styles.actionCard, styles.dismissCard]}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, styles.dismissIconCircle]}>
                  <MaterialIcons name="check-circle" size={18} color="#34C759" />
                </View>
                <Text style={styles.cardTitle}>FALSE POSITIVE</Text>
              </View>
              <Text style={styles.cardDescription}>
                The value is actually correct; dismiss this warning
              </Text>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.dismissActionText}>Dismiss Warning</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#34C759" />
            </View>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default RecommendedIssueView;

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
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  detectionBox: {
    backgroundColor: "#FFF9F0",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  detectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF9500",
    letterSpacing: 0.5,
  },
  detectionMessage: {
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
  valueText: {
    fontSize: 15,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  actionsHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
  },
  actionCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
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
  dismissCard: {
    backgroundColor: "#F0FFF4",
    borderColor: "#34C759",
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
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  reportIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  dismissIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  reportActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },
  dismissActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34C759",
  },
});
