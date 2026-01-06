import React, { useState, useEffect, useCallback, useRef } from "react";
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
    workflow,
    addPackageFrustration,
    removePackageFrustration,
    resolvePackageFrustration,
    refrustratePackageFrustration,
  } = useInspectionForm();
  const { actions } = useHazProStore();

  // State
  const [sections, setSections] = useState<ValidationSection[]>([]);
  const [additionalDetections, setAdditionalDetections] = useState<AggregatedLabel[]>([]);
  const [showAdditionalDetections, setShowAdditionalDetections] = useState(false);
  const hasInitialized = useRef(false);

  // Set chevron on mount
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, [actions]);

  // Initialize validation items (only once on mount)
  const initializeValidationItems = useCallback(() => {
    // Skip re-initialization if already initialized
    // This prevents resetting validation status when inspection context updates
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    try {
      // Get ML analysis results
      const mlResults = inspection.mlAnalysisResults;
      const detectedLabels = mlResults?.allDetectedLabels || [];
      const perImageResults = mlResults?.perImageResults || [];

      // Get existing package frustrations to preserve status
      const existingFrustrationIds = new Set(
        inspection.packageFrustrations.map((f) => f.itemId)
      );

      // Combine all OCR text for marking matching
      const allOCRText = perImageResults
        .map((result) => result.ocrResult?.fullText || "")
        .join(" ");

      // Get required markings
      const requiredMarkings = evaluateMarkingRequirementsInspector(inspection);
      const markingItems: ValidationItem[] = Object.entries(requiredMarkings).map(
        ([label, expectedValues], index) => {
          // Special handling for PSN and UN Number - use structured data from ML analysis
          let foundInOCR = false;
          let matchConfidence: number | null = null;

          if (label === "PSN and UN Number") {
            // Check structured data - allUnWithPSN contains parsed UN+PSN pairs
            const hasUnWithPSN = (mlResults?.allUnWithPSN?.length ?? 0) > 0;
            foundInOCR = hasUnWithPSN;
            matchConfidence = hasUnWithPSN ? 0.95 : null; // Higher confidence for structured data

          } else {
            // Fall back to regex pattern matching for other markings
            foundInOCR = findMatchingMarkingInOCR(label, allOCRText);
            matchConfidence = foundInOCR ? 0.8 : null;
          }

          const itemId = `marking-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`;

          return {
            id: itemId,
            category: "marking" as const,
            label,
            expectedValues,
            matchStatus: foundInOCR ? "matched" : "unmatched",
            matchedDetection: null,
            matchConfidence,
            // Preserve frustrated status if this item was already frustrated
            validationStatus: existingFrustrationIds.has(itemId) ? "frustrated" as const : "pending" as const,
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

          const itemId = `label-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`;

          return {
            id: itemId,
            category: "label" as const,
            label,
            expectedValues,
            matchStatus: matchedDetection ? "matched" : "unmatched",
            matchedDetection,
            matchConfidence: matchedDetection?.maxConfidence || null,
            // Preserve frustrated status if this item was already frustrated
            validationStatus: existingFrustrationIds.has(itemId) ? "frustrated" as const : "pending" as const,
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

      // Filter items in reinspection mode to show only frustrated items
      if (workflow.reinspection.mode === "package") {
        const frustratedIds = new Set(workflow.reinspection.targetFrustrations);
        const filteredSections = newSections.map(section => ({
          ...section,
          data: section.data.filter(item => frustratedIds.has(item.id)),
        })).filter(section => section.data.length > 0);
        setSections(filteredSections);

        console.log("[MarkingsLabelsValidation] Reinspection mode - filtered to frustrated items:", {
          totalFrustrations: frustratedIds.size,
          sectionsWithItems: filteredSections.length,
          items: filteredSections.flatMap(s => s.data).map(i => i.id),
        });
      } else {
        setSections(newSections);

        console.log("[MarkingsLabelsValidation] Initialized:", {
          markings: markingItems.length,
          labels: labelItems.length,
          additionalDetections: unmatchedDetections.length,
          matchedMarkings: markingItems.filter((m) => m.matchStatus === "matched").length,
          matchedLabels: labelItems.filter((l) => l.matchStatus === "matched").length,
        });
      }
    } catch (error) {
      console.error("[MarkingsLabelsValidation] Initialization error:", error);
      setSections([]);
    }
  }, [inspection, workflow.reinspection.mode, workflow.reinspection.targetFrustrations]);

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
    const isReinspection = workflow.reinspection.mode === "package";

    if (isReinspection && item.validationStatus === "frustrated") {
      console.log("[MarkingsLabels] Resolving frustration in reinspection:", item.id);
      resolvePackageFrustration(item.id, inspection.inspector);
    } else {
      if (item.validationStatus === "frustrated") {
        removePackageFrustration(item.id);
      }
    }

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
  }, [workflow.reinspection.mode, inspection.inspector, resolvePackageFrustration, removePackageFrustration]);

  const handleFrustrate = useCallback((item: ValidationItem) => {
    const isReinspection = workflow.reinspection.mode === "package";

    // If already frustrated, toggle back to pending (remove frustration)
    if (item.validationStatus === "frustrated") {
      removePackageFrustration(item.id);

      // Update local state back to pending
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          data: section.data.map((dataItem) =>
            dataItem.id === item.id
              ? { ...dataItem, validationStatus: "pending" as const }
              : dataItem
          ),
        }))
      );
      return;
    }

    // In reinspection mode, use refrustratePackageFrustration to track re-frustration
    if (isReinspection) {
      console.log("[MarkingsLabels] Re-frustrating item in reinspection:", item.id);
      refrustratePackageFrustration(item.id, inspection.inspector);
    } else {
      // Add frustration to context (first inspection)
      addPackageFrustration({
        category: item.category,
        itemId: item.id,
        itemLabel: item.label,
        expectedValues: item.expectedValues,
        verificationStatus: "missing",
        defaultMessage: `Required ${item.category} "${item.label}" not found on package`,
        afmanReference: item.afmanReference || "AFMAN 24-604",
      });
    }

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
  }, [workflow.reinspection.mode, inspection.inspector, addPackageFrustration, removePackageFrustration, refrustratePackageFrustration]);

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
      borderColor = "#34C759";
      leftBorderColor = "#34C759";
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
        {/* {isMatched && item.matchedDetection && (
          <Text style={styles.matchInfoText}>
            Detected: "{item.matchedDetection.className}"
          </Text>
        )} */}
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
      return (
        <View style={[styles.badge, styles.badgeMatched]}>
          <MaterialIcons name="check-circle" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>Detected</Text>
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

  const renderAdditionalDetections = () => {
    if (additionalDetections.length === 0) return null;

    return (
      <View style={styles.additionalSection}>
        <TouchableOpacity
          style={styles.additionalHeader}
          onPress={() => setShowAdditionalDetections(!showAdditionalDetections)}
        >
          <View style={styles.additionalHeaderLeft}>
            <MaterialIcons
              name={showAdditionalDetections ? "expand-less" : "expand-more"}
              size={24}
              color="#8E8E93"
            />
            <Text style={styles.additionalHeaderText}>
              Additional Detections ({additionalDetections.length})
            </Text>
          </View>
          <Text style={styles.additionalHeaderSubtext}>
            ML detected but not required
          </Text>
        </TouchableOpacity>

        {showAdditionalDetections && (
          <View style={styles.additionalContent}>
            {additionalDetections.map((detection, index) => (
              <View key={index} style={styles.additionalItem}>
                <MaterialIcons name="label" size={16} color="#8E8E93" />
                <Text style={styles.additionalItemText}>
                  {detection.className}
                </Text>
                <Text style={styles.additionalItemConfidence}>
                  {Math.round(detection.maxConfidence * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const navigateToNextScreen = useCallback(() => {
    const isReinspection = workflow.reinspection.mode === "package";

    // In reinspection mode, check frustrations and navigate accordingly
    if (isReinspection) {
      const hasPackageFrustrations = inspection.packageFrustrations.length > 0;

      if (hasPackageFrustrations) {
        // Navigate to frustration summary to review remaining frustrations
        console.log("[MarkingsLabels] Reinspection complete with remaining frustrations");
        navigation.navigate("PackageFrustrationSummary");
      } else {
        // All frustrations resolved - inspection is complete
        console.log("[MarkingsLabels] Reinspection complete - all frustrations resolved");
        navigation.navigate("PackageInspectionCompleteScreen");
      }
      return;
    }

    // First inspection: route based on UN number (same logic as POP validation screen)
    const unIdNo =
      inspection.verificationCopy?.unIdNo ||
      inspection.extractedContent?.unIdNo ||
      "";

    if (unIdNo === "UN1845") {
      navigation.navigate("InspectorDryIceScreen");
    } else if (unIdNo === "UN2807") {
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (unIdNo === "UN3072" || unIdNo === "UN2990") {
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (unIdNo === "UN3245") {
      navigation.navigate("InspectorGeneticallyModifiedOrganismsScreen");
    } else if (unIdNo === "UN3268") {
      navigation.navigate("InspectorSafetyDevicesScreen");
    } else if (unIdNo === "UN3508") {
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (unIdNo === "UN3528" || unIdNo === "UN3529") {
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (unIdNo === "UN3316") {
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (unIdNo === "UN3363") {
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (unIdNo === "UN3171") {
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (unIdNo === "UN3480" || unIdNo === "UN3090") {
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else {
      // No material-specific screen needed - go directly to summary or complete
      // Check if there are any package frustrations from POP validation or markings/labels validation
      const hasPackageFrustrations = inspection.packageFrustrations.length > 0;

      if (hasPackageFrustrations) {
        // Navigate to frustration summary to review package issues
        navigation.navigate("PackageFrustrationSummary");
      } else {
        // No frustrations - inspection is complete
        navigation.navigate("PackageInspectionCompleteScreen");
      }
    }
  }, [navigation, inspection, workflow.reinspection.mode]);

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

      {/* Main Content */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderValidationCard}
        renderSectionHeader={renderSectionHeader}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
        ListFooterComponent={renderAdditionalDetections}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={18} color="#007AFF" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() =>
            Alert.alert("Save Progress", "Your verification progress has been saved.")
          }
        >
          <MaterialIcons name="save" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !allItemsAddressed && styles.disabledButton,
          ]}
          onPress={allItemsAddressed ? navigateToNextScreen : undefined}
          disabled={!allItemsAddressed}
        >
          <Text
            style={[
              styles.buttonText,
              !allItemsAddressed && styles.disabledButtonText,
            ]}
          >
            Continue
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={18}
            color={allItemsAddressed ? "#FFFFFF" : "#8E8E93"}
          />
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
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
    backgroundColor: "#34C759",
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
  additionalSection: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    overflow: "hidden",
  },
  additionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  additionalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  additionalHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
  },
  additionalHeaderSubtext: {
    fontSize: 12,
    color: "#8E8E93",
  },
  additionalContent: {
    padding: 16,
    paddingTop: 8,
  },
  additionalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  additionalItemText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C43",
  },
  additionalItemConfidence: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    gap: 4,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 6,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: "#E5E5EA",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#8E8E93",
  },
});
