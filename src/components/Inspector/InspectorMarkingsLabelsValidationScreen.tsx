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
  }, []);

  // Initialize validation items
  useEffect(() => {
    initializeValidationItems();
  }, [initializeValidationItems]);

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
});
