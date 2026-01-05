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
  }, []);

  const initializeValidationItems = useCallback(() => {
    // TODO: Implement in Task 4
    console.log("[MarkingsLabelsValidation] Initialization placeholder");
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
