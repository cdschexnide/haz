import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FrustrationRecord } from "../../../../src/types/sddg";

interface FrustrationDetailsViewProps {
  fieldLabel: string;
  frustration: FrustrationRecord;
  onEditValue: () => void;
  onEditComments: () => void;
  onResolve: () => void;
  isReinspectionMode?: boolean;
}

/**
 * FrustrationDetailsView - Unified view for managing existing frustrations
 *
 * Features:
 * - Shows existing frustration details prominently
 * - Three action cards: Edit Value, Update Comments, Resolve Issue
 * - Can edit value without affecting frustration
 * - Clear "resolve" action (green button for positive outcome)
 */
const FrustrationDetailsView: React.FC<FrustrationDetailsViewProps> = ({
  fieldLabel,
  frustration,
  onEditValue,
  onEditComments,
  onResolve,
  isReinspectionMode = false,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Field Label with Frustrated Badge */}
        <View style={styles.header}>
          <Text style={styles.fieldLabel}>{fieldLabel}</Text>
          <View style={styles.frustratedBadge}>
            <MaterialIcons name="warning" size={14} color="#FFFFFF" />
            <Text style={styles.frustratedBadgeText}>FRUSTRATED</Text>
          </View>
        </View>

        {/* Current Frustration Details */}
        <View style={styles.frustrationBox}>
          {/* Incorrect vs Correct Value Comparison - Compact Horizontal Layout */}
          <View style={styles.valueComparisonSection}>
            <View style={styles.valueComparisonContainer}>
              {/* Incorrect Value */}
              <View style={styles.valueColumn}>
                <View style={styles.valueRow}>
                  <MaterialIcons name="close" size={14} color="#FF3B30" />
                  <Text style={styles.incorrectValueLabel}>Incorrect:</Text>
                </View>
                <Text style={styles.incorrectValueText}>
                  {frustration.fieldValue || "No data"}
                </Text>
              </View>

              {/* Arrow Separator */}
              {frustration.correctValue && (
                <View style={styles.arrowSeparator}>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color="#8E8E93"
                  />
                </View>
              )}

              {/* Correct Value */}
              {frustration.correctValue && (
                <View style={styles.valueColumn}>
                  <View style={styles.valueRow}>
                    <MaterialIcons name="check" size={14} color="#34C759" />
                    <Text style={styles.correctValueLabel}>Correct:</Text>
                  </View>
                  <Text style={styles.correctValueText}>
                    {frustration.correctValue}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {frustration.additionalComments && (
            <View style={styles.commentsSection}>
              <Text style={styles.commentsLabel}>Additional Comments:</Text>
              <Text style={styles.commentsText}>
                "{frustration.additionalComments}"
              </Text>
            </View>
          )}

          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Reported:</Text>
              <Text style={styles.metadataValue}>
                {formatDate(frustration.frustrationDate)}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Inspector:</Text>
              <Text style={styles.metadataValue}>
                {typeof frustration.inspector === "string"
                  ? frustration.inspector
                  : frustration.inspector.inspectorName || "Unknown"}
              </Text>
            </View>
          </View>

          {/* Reinspection History */}
          {frustration.reinspectionHistory &&
            frustration.reinspectionHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyLabel}>Reinspection History:</Text>
                {frustration.reinspectionHistory.map((attempt, index) => (
                  <View key={index} style={styles.historyItem}>
                    <MaterialIcons
                      name={
                        attempt.action === "verified"
                          ? "check-circle"
                          : "warning"
                      }
                      size={14}
                      color={
                        attempt.action === "verified" ? "#34C759" : "#FF9500"
                      }
                    />
                    <Text style={styles.historyText}>
                      {attempt.action === "verified"
                        ? "Verified"
                        : "Re-frustrated"}{" "}
                      on {formatDate(attempt.date)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
        </View>

        {/* Actions Available */}
        <Text style={styles.actionsHeader}>Actions Available:</Text>

        {/* Action 1: Edit Field Value - Hidden in Reinspection Mode */}
        {!isReinspectionMode && (
          <TouchableOpacity
            style={[styles.actionCard, styles.editCard]}
            onPress={onEditValue}
            activeOpacity={0.7}
          >
            <View style={styles.actionCardHeader}>
              <View style={[styles.actionIconCircle, styles.editIconCircle]}>
                <MaterialIcons name="edit" size={18} color="#007AFF" />
              </View>
              <Text style={styles.actionCardTitle}>EDIT FIELD VALUE</Text>
            </View>
            <Text style={styles.actionCardDescription}>
              Correct the OCR-scanned data or update the field value
            </Text>
            <View style={styles.actionCardFooter}>
              <Text style={styles.editActionText}>Edit Value</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#007AFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Action 2: Update Compliance Report */}
        <TouchableOpacity
          style={[styles.actionCard, styles.updateCard]}
          onPress={onEditComments}
          activeOpacity={0.7}
        >
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconCircle, styles.updateIconCircle]}>
              <MaterialIcons name="description" size={18} color="#FF9500" />
            </View>
            <Text style={styles.actionCardTitle}>UPDATE REPORT</Text>
          </View>
          <Text style={styles.actionCardDescription}>
            Modify the compliance notes or add additional details
          </Text>
          <View style={styles.actionCardFooter}>
            <Text style={styles.updateActionText}>Edit Comments</Text>
            <MaterialIcons name="arrow-forward" size={14} color="#FF9500" />
          </View>
        </TouchableOpacity>

        {/* Action 3: Resolve Issue */}
        <TouchableOpacity
          style={[styles.actionCard, styles.resolveCard]}
          onPress={onResolve}
          activeOpacity={0.7}
        >
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconCircle, styles.resolveIconCircle]}>
              <MaterialIcons name="check-circle" size={18} color="#34C759" />
            </View>
            <Text style={styles.actionCardTitle}>RESOLVE ISSUE</Text>
          </View>
          <Text style={styles.actionCardDescription}>
            Mark this field as compliant and remove the frustration
          </Text>
          <View style={styles.actionCardFooter}>
            <Text style={styles.resolveActionText}>Remove Frustration</Text>
            <MaterialIcons name="arrow-forward" size={14} color="#34C759" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FrustrationDetailsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
  },
  frustratedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  frustratedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  frustrationBox: {
    backgroundColor: "#FFF5F5",
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  commentsSection: {
    marginBottom: 12,
  },
  commentsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 14,
    color: "#3C3C43",
    fontStyle: "italic",
    lineHeight: 20,
  },
  valueComparisonSection: {
    marginBottom: 12,
  },
  valueComparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueColumn: {
    gap: 4,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrowSeparator: {
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  incorrectValueLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF3B30",
  },
  incorrectValueText: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "600",
    textDecorationLine: "line-through",
  },
  correctValueLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34C759",
  },
  correctValueText: {
    fontSize: 14,
    color: "#34C759",
    fontWeight: "700",
  },
  metadataRow: {
    flexDirection: "row",
    gap: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#FFD1D1",
  },
  metadataItem: {
    // Removed flex: 1 to prevent spreading
  },
  metadataLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 13,
    color: "#1D1D1F",
  },
  historySection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#FFD1D1",
  },
  historyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  historyText: {
    fontSize: 12,
    color: "#3C3C43",
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
    marginBottom: 8,
    borderWidth: 2,
  },
  editCard: {
    backgroundColor: "#F0F8FF",
    borderColor: "#007AFF",
  },
  updateCard: {
    backgroundColor: "#FFF9F0",
    borderColor: "#FF9500",
  },
  resolveCard: {
    backgroundColor: "#F0FFF4",
    borderColor: "#34C759",
  },
  actionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  actionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  updateIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  resolveIconCircle: {
    backgroundColor: "#FFFFFF",
  },
  actionCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionCardDescription: {
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
    marginBottom: 8,
  },
  actionCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  editActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  updateActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },
  resolveActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34C759",
  },
});
