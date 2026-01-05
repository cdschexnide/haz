import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProStore } from "../../stores/useHazProStore";
import { evaluateMarkingRequirementsInspector } from "../../utils/markingRequirementsInspector";
import { evaluateLabelingRequirements } from "../../utils/labelingRequirementsInspector";
import {
  findMatchingDetection,
  findMatchingMarkingInOCR,
  getUnmatchedDetections,
} from "../../utils/labelMatchingTable";
import { AggregatedLabel } from "../../ml/types/ocr";

// ============ TYPES ============

type MatchStatus = "matched" | "unmatched";
type ValidationStatus = "pending" | "validated" | "frustrated";

interface ValidationItem {
  id: string;
  category: "marking" | "label";
  label: string;
  expectedValues: string[];
  matchStatus: MatchStatus;
  matchedDetection: AggregatedLabel | null;
  matchConfidence: number | null;
  validationStatus: ValidationStatus;
  afmanReference?: string;
}

interface ValidationSection {
  title: string;
  icon: string;
  data: ValidationItem[];
}

interface InspectorMarkingsLabelsValidationScreenProps {
  navigation: any;
}

// ============ COMPONENT ============

export default function InspectorMarkingsLabelsValidationScreen({
  navigation,
}: InspectorMarkingsLabelsValidationScreenProps) {
  const {
    inspection,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionForm();
  const { actions } = useHazProStore();

  // State
  const [sections, setSections] = useState<ValidationSection[]>([]);
  const [additionalDetections, setAdditionalDetections] = useState<AggregatedLabel[]>([]);
  const [showAdditionalDetections, setShowAdditionalDetections] = useState(false);

  // Set chevron on mount
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, [actions]);

  // Initialize validation items
  const initializeValidationItems = useCallback(() => {
    try {
      // Get ML analysis results
      const mlResults = inspection.mlAnalysisResults;
      const detectedLabels = mlResults?.allDetectedLabels || [];
      const perImageResults = mlResults?.perImageResults || [];

      // Combine all OCR text for marking matching
      const allOCRText = perImageResults
        .map((result) => result.ocrResult?.fullText || "")
        .join(" ");

      // Get required markings
      const requiredMarkings = evaluateMarkingRequirementsInspector(inspection);
      const markingItems: ValidationItem[] = Object.entries(requiredMarkings).map(
        ([label, expectedValues], index) => {
          // Check if marking was found in OCR text
          const foundInOCR = findMatchingMarkingInOCR(label, allOCRText);

          return {
            id: `marking-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`,
            category: "marking" as const,
            label,
            expectedValues,
            matchStatus: foundInOCR ? "matched" : "unmatched",
            matchedDetection: null,
            matchConfidence: foundInOCR ? 0.8 : null,
            validationStatus: "pending" as const,
            afmanReference: "AFMAN 24-604",
          };
        }
      );

      // Get required labels
      const requiredLabels = evaluateLabelingRequirements(inspection);
      const matchedClassNames = new Set<string>();

      const labelItems: ValidationItem[] = Object.entries(requiredLabels).map(
        ([label, expectedValues], index) => {
          // Find matching ML detection
          const matchedDetection = findMatchingDetection(
            label,
            expectedValues,
            detectedLabels
          );

          if (matchedDetection) {
            matchedClassNames.add(matchedDetection.className);
          }

          return {
            id: `label-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`,
            category: "label" as const,
            label,
            expectedValues,
            matchStatus: matchedDetection ? "matched" : "unmatched",
            matchedDetection,
            matchConfidence: matchedDetection?.maxConfidence || null,
            validationStatus: "pending" as const,
            afmanReference: "AFMAN 24-604",
          };
        }
      );

      // Get additional detections (ML found but not in requirements)
      const unmatchedDetections = getUnmatchedDetections(
        detectedLabels,
        matchedClassNames
      );
      setAdditionalDetections(unmatchedDetections);

      // Build sections
      const newSections: ValidationSection[] = [];

      if (markingItems.length > 0) {
        newSections.push({
          title: "MARKINGS",
          icon: "label",
          data: markingItems,
        });
      }

      if (labelItems.length > 0) {
        newSections.push({
          title: "LABELS",
          icon: "local-offer",
          data: labelItems,
        });
      }

      setSections(newSections);

      console.log("[MarkingsLabelsValidation] Initialized:", {
        markings: markingItems.length,
        labels: labelItems.length,
        additionalDetections: unmatchedDetections.length,
        matchedMarkings: markingItems.filter((m) => m.matchStatus === "matched").length,
        matchedLabels: labelItems.filter((l) => l.matchStatus === "matched").length,
      });
    } catch (error) {
      console.error("[MarkingsLabelsValidation] Initialization error:", error);
      setSections([]);
    }
  }, [inspection]);

  // Initialize on mount
  useEffect(() => {
    initializeValidationItems();
  }, [initializeValidationItems]);

  // Computed values
  const allItems = sections.flatMap((section) => section.data);
  const allItemsAddressed = allItems.every(
    (item) => item.validationStatus !== "pending"
  );
  const markingsProgress = sections
    .find((s) => s.title === "MARKINGS")
    ?.data.filter((i) => i.validationStatus !== "pending").length || 0;
  const markingsTotal = sections.find((s) => s.title === "MARKINGS")?.data.length || 0;
  const labelsProgress = sections
    .find((s) => s.title === "LABELS")
    ?.data.filter((i) => i.validationStatus !== "pending").length || 0;
  const labelsTotal = sections.find((s) => s.title === "LABELS")?.data.length || 0;

  // ============ HANDLERS ============

  const handleValidate = useCallback((item: ValidationItem) => {
    // If previously frustrated, remove the frustration
    if (item.validationStatus === "frustrated") {
      removePackageFrustration(item.id);
    }

    // Update local state
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, validationStatus: "validated" as const }
            : dataItem
        ),
      }))
    );
  }, [removePackageFrustration]);

  const handleFrustrate = useCallback((item: ValidationItem) => {
    // Add frustration to context
    addPackageFrustration({
      category: item.category,
      itemId: item.id,
      itemLabel: item.label,
      expectedValues: item.expectedValues,
      verificationStatus: "missing",
      defaultMessage: `Required ${item.category} "${item.label}" not found on package`,
      afmanReference: item.afmanReference || "AFMAN 24-604",
    });

    // Update local state
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, validationStatus: "frustrated" as const }
            : dataItem
        ),
      }))
    );
  }, [addPackageFrustration]);

  // ============ RENDER HELPERS ============

  const renderValidationCard = ({ item }: { item: ValidationItem }) => {
    const isMatched = item.matchStatus === "matched";
    const isValidated = item.validationStatus === "validated";
    const isFrustrated = item.validationStatus === "frustrated";

    // Determine card styling based on state
    let borderColor = "#E5E5EA";
    let backgroundColor = "#FFFFFF";
    let leftBorderColor = item.category === "marking" ? "#FF9500" : "#007AFF";

    if (isValidated) {
      borderColor = "#34C759";
      backgroundColor = "#F0FFF4";
      leftBorderColor = "#34C759";
    } else if (isFrustrated) {
      borderColor = "#FF3B30";
      backgroundColor = "#FFF5F5";
      leftBorderColor = "#FF3B30";
    } else if (isMatched) {
      borderColor = "#007AFF";
      backgroundColor = "#FFFFFF";
    } else {
      // Unmatched - needs attention
      backgroundColor = "#FFF8E1";
      borderColor = "#FF9500";
    }

    return (
      <View
        style={[
          styles.card,
          {
            borderColor,
            backgroundColor,
            borderLeftColor: leftBorderColor,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          {renderStatusBadge(item)}
        </View>

        {/* Expected Values */}
        <View style={styles.expectedValuesContainer}>
          {item.expectedValues.map((value, index) => (
            <View key={index} style={styles.expectedValueChip}>
              <Text style={styles.expectedValueText}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Match Info */}
        {isMatched && item.matchedDetection && (
          <Text style={styles.matchInfoText}>
            Detected: "{item.matchedDetection.className}"
          </Text>
        )}
        {isMatched && !item.matchedDetection && item.category === "marking" && (
          <Text style={styles.matchInfoText}>Found in package text (OCR)</Text>
        )}
        {!isMatched && (
          <View style={styles.warningRow}>
            <MaterialIcons name="warning" size={16} color="#FF9500" />
            <Text style={styles.warningText}>Verify manually on package</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.validateButton,
              isValidated && styles.validateButtonActive,
            ]}
            onPress={() => handleValidate(item)}
          >
            <MaterialIcons
              name="check"
              size={24}
              color={isValidated ? "#FFFFFF" : "#34C759"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.frustrateButton,
              isFrustrated && styles.frustrateButtonActive,
            ]}
            onPress={() => handleFrustrate(item)}
          >
            <MaterialIcons
              name="close"
              size={24}
              color={isFrustrated ? "#FFFFFF" : "#FF3B30"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStatusBadge = (item: ValidationItem) => {
    if (item.validationStatus === "validated") {
      return (
        <View style={[styles.badge, styles.badgeValidated]}>
          <MaterialIcons name="check-circle" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>Verified</Text>
        </View>
      );
    }

    if (item.validationStatus === "frustrated") {
      return (
        <View style={[styles.badge, styles.badgeFrustrated]}>
          <MaterialIcons name="cancel" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>Frustration</Text>
        </View>
      );
    }

    if (item.matchStatus === "matched") {
      const confidence = item.matchConfidence
        ? Math.round(item.matchConfidence * 100)
        : null;
      return (
        <View style={[styles.badge, styles.badgeMatched]}>
          <MaterialIcons name="auto-awesome" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>
            ML Detected{confidence ? ` ${confidence}%` : ""}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.badgeUnmatched]}>
        <MaterialIcons name="search-off" size={14} color="#FFFFFF" />
        <Text style={styles.badgeText}>Not Detected</Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: ValidationSection }) => {
    const completedCount = section.data.filter(
      (item) => item.validationStatus !== "pending"
    ).length;
    const totalCount = section.data.length;

    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <MaterialIcons
            name={section.icon as any}
            size={20}
            color="#1D1D1F"
          />
          <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
        </View>
        <View style={styles.sectionHeaderBadge}>
          <Text style={styles.sectionHeaderBadgeText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Markings & Labels Validation</Text>
        <TouchableOpacity>
          <MaterialIcons name="help-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Content Placeholder */}
      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          Validation items will appear here after Task 4
        </Text>
        <Text style={styles.placeholderSubtext}>
          Markings: {markingsProgress}/{markingsTotal} | Labels: {labelsProgress}/{labelsTotal}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => Alert.alert("Save Progress", "Progress saved.")}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !allItemsAddressed && styles.disabledButton]}
          disabled={!allItemsAddressed}
        >
          <Text style={[styles.buttonText, !allItemsAddressed && styles.disabledButtonText]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#C7C7CC",
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#C7C7CC",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#8E8E93",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    paddingVertical: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D1D1F",
    letterSpacing: 0.5,
  },
  sectionHeaderBadge: {
    backgroundColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sectionHeaderBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3C3C43",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeMatched: {
    backgroundColor: "#007AFF",
  },
  badgeUnmatched: {
    backgroundColor: "#FF9500",
  },
  badgeValidated: {
    backgroundColor: "#34C759",
  },
  badgeFrustrated: {
    backgroundColor: "#FF3B30",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  expectedValuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  expectedValueChip: {
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  expectedValueText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#3C3C43",
  },
  matchInfoText: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 12,
    fontStyle: "italic",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 13,
    color: "#FF9500",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  validateButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#34C759",
  },
  validateButtonActive: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  frustrateButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FF3B30",
  },
  frustrateButtonActive: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
});
