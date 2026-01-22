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
import { useHazProActions } from "../../stores/useHazProStore";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { useRenderTracker, useContextRenderTracker } from "@/hooks/useRenderTracker";
import { evaluateMarkingRequirementsInspector } from "../../utils/markingRequirementsInspector";
import { evaluateLabelingRequirements } from "../../utils/labelingRequirementsInspector";
import {
  findMatchingDetection,
  findMatchingMarkingInOCR,
  getUnmatchedDetections,
} from "../../utils/labelMatchingTable";
import { AggregatedLabel } from "../../ml/types/ocr";
import {
  ScreenHeader,
  ActionFooter,
  StatusBadge,
  SectionHeader,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../components/ui";
import { navigateToPackageOutcome } from "../../utils/navigateToPackageOutcome";
import { shouldSkipPopMarking } from "@/utils/inspectorWorkflowRouting";

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
  route?: { params?: { fromPopMarking?: boolean } };
}

// ============ COMPONENT ============

function InspectorMarkingsLabelsValidationScreenComponent({
  navigation,
  route,
}: InspectorMarkingsLabelsValidationScreenProps) {
  // === CONTEXT SUBSCRIPTIONS ===
  // NOTE: useInspectionForm() subscribes to ENTIRE context - potential render issue!
  const inspectionFormContext = useInspectionForm();
  const {
    inspection,
    workflow,
    addPackageFrustration,
    removePackageFrustration,
    resolvePackageFrustration,
    refrustratePackageFrustration,
  } = inspectionFormContext;
  const actions = useHazProActions();

  // === LOCAL STATE ===
  const [sections, setSections] = useState<ValidationSection[]>([]);
  const [additionalDetections, setAdditionalDetections] = useState<AggregatedLabel[]>([]);
  const [showAdditionalDetections, setShowAdditionalDetections] = useState(false);
  const hasInitialized = useRef(false);

  // === RENDER TRACKING ===
  useRenderTracker('InspectorMarkingsLabelsValidationScreen', { navigation }, {
    sectionsCount: sections.length,
    additionalDetectionsCount: additionalDetections.length,
    showAdditionalDetections,
    hasInitialized: hasInitialized.current,
    packageFrustrationCount: inspection?.packageFrustrations?.length ?? 0,
  });

  // Track context changes
  useContextRenderTracker('InspectorMarkingsLabelsValidationScreen', 'InspectionFormContext', {
    packageFrustrationCount: inspection?.packageFrustrations?.length ?? 0,
    mlResultsPresent: !!inspection?.mlAnalysisResults,
  });

  const isExceptedQuantity = inspection.quantityType === "excepted";
  const cameFromPopMarking = route?.params?.fromPopMarking === true;

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
      // Include BOTH current frustrations AND resolved frustrations to prevent
      // re-frustrating items that were already resolved in previous reinspections
      const existingFrustrationIds = new Set([
        ...inspection.packageFrustrations.map((f) => f.itemId),
        ...(inspection.resolvedPackageFrustrations || []).map((f) => f.itemId),
      ]);

      // Combine all OCR text for marking matching
      const allOCRText = perImageResults
        .map((result) => result.ocrResult?.fullText || "")
        .join(" ");

      const markingItems: ValidationItem[] = [];
      const matchedClassNames = new Set<string>();
      if (isExceptedQuantity) {
        const label = "Excepted Quantity Marking";
        const expectedValues = ["Excepted Quantity"];
        const matchedDetection = findMatchingDetection(
          label,
          expectedValues,
          detectedLabels
        );
        if (matchedDetection) {
          matchedClassNames.add(matchedDetection.className);
        }
        const itemId = "marking-excepted-quantity";
        const isAlreadyFrustrated = existingFrustrationIds.has(itemId);
        const validationStatus = isAlreadyFrustrated
          ? "frustrated" as const
          : matchedDetection
            ? "validated" as const
            : "frustrated" as const;

        if (!matchedDetection && !isAlreadyFrustrated) {
          addPackageFrustration({
            category: "marking",
            itemId,
            itemLabel: label,
            expectedValues,
            verificationStatus: "missing",
            defaultMessage: `Required marking "${label}" not found on package`,
            afmanReference: "AFMAN 24-604 A19.2.13",
          });
        }

        markingItems.push({
          id: itemId,
          category: "marking" as const,
          label,
          expectedValues,
          matchStatus: matchedDetection ? "matched" : "unmatched",
          matchedDetection,
          matchConfidence: matchedDetection?.maxConfidence || null,
          validationStatus,
          afmanReference: "AFMAN 24-604 A19.2.13",
        });
      } else {
        // Get required markings
        const requiredMarkings = evaluateMarkingRequirementsInspector(inspection);
        markingItems.push(
          ...Object.entries(requiredMarkings).map(
            ([label, expectedValues], index) => {
              // Special handling for PSN and UN Number - use structured data from ML analysis
              let foundInOCR = false;
              let matchConfidence: number | null = null;
              let matchedDetection: AggregatedLabel | null = null;

              if (label === "UN Specification Marking" && cameFromPopMarking) {
                foundInOCR = true;
                matchConfidence = 1;
              } else if (label === "EX Number/NSN") {
                foundInOCR = true;
                matchConfidence = 1;
              } else if (label === "PSN and UN Number") {
                // Check structured data - allUnWithPSN contains parsed UN+PSN pairs
                const hasUnWithPSN = (mlResults?.allUnWithPSN?.length ?? 0) > 0;
                foundInOCR = hasUnWithPSN;
                matchConfidence = hasUnWithPSN ? 0.95 : null; // Higher confidence for structured data

              } else if (label === "Military Shipping Label (MSL) or DD Form 1387") {
                foundInOCR = true;
                matchConfidence = 1;

              } else if (label === "Limited Quantity Marking") {
                matchedDetection = findMatchingDetection(
                  label,
                  expectedValues,
                  detectedLabels
                );
                if (matchedDetection) {
                  matchedClassNames.add(matchedDetection.className);
                }
                foundInOCR =
                  Boolean(matchedDetection) ||
                  findMatchingMarkingInOCR(label, allOCRText);
                matchConfidence = matchedDetection ? matchedDetection.maxConfidence : foundInOCR ? 0.8 : null;
              } else {
                // Fall back to regex pattern matching for other markings
                foundInOCR = findMatchingMarkingInOCR(label, allOCRText);
                matchConfidence = foundInOCR ? 0.8 : null;
              }

              const itemId = `marking-${index}-${label.replace(/\s+/g, "-").toLowerCase()}`;

              // Determine validation status:
              // - Already frustrated: keep frustrated
              // - Matched/detected: validated
              // - Unmatched/not detected: frustrated (auto-frustrate missing items)
              const isAlreadyFrustrated = existingFrustrationIds.has(itemId);
              const validationStatus = isAlreadyFrustrated
                ? "frustrated" as const
                : foundInOCR
                  ? "validated" as const
                  : "frustrated" as const;

              // Add frustration to context for unmatched items that aren't already frustrated
              if (!foundInOCR && !isAlreadyFrustrated) {
                addPackageFrustration({
                  category: "marking",
                  itemId,
                  itemLabel: label,
                  expectedValues,
                  verificationStatus: "missing",
                  defaultMessage: `Required marking "${label}" not found on package`,
                  afmanReference: "AFMAN 24-604",
                });
              }

              return {
                id: itemId,
                category: "marking" as const,
                label,
                expectedValues,
                matchStatus: foundInOCR ? "matched" : "unmatched",
                matchedDetection,
                matchConfidence,
                validationStatus,
                afmanReference: "AFMAN 24-604",
              };
            }
          )
        );
      }

      // Get required labels
      const requiredLabels = isExceptedQuantity ? {} : evaluateLabelingRequirements(inspection);

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

          // Determine validation status:
          // - Already frustrated: keep frustrated
          // - Matched/detected: validated
          // - Unmatched/not detected: frustrated (auto-frustrate missing items)
          const isAlreadyFrustrated = existingFrustrationIds.has(itemId);
          const validationStatus = isAlreadyFrustrated
            ? "frustrated" as const
            : matchedDetection
              ? "validated" as const
              : "frustrated" as const;

          // Add frustration to context for unmatched items that aren't already frustrated
          if (!matchedDetection && !isAlreadyFrustrated) {
            addPackageFrustration({
              category: "label",
              itemId,
              itemLabel: label,
              expectedValues,
              verificationStatus: "missing",
              defaultMessage: `Required label "${label}" not found on package`,
              afmanReference: "AFMAN 24-604",
            });
          }

          return {
            id: itemId,
            category: "label" as const,
            label,
            expectedValues,
            matchStatus: matchedDetection ? "matched" : "unmatched",
            matchedDetection,
            matchConfidence: matchedDetection?.maxConfidence || null,
            validationStatus,
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
    let borderColor = colors.border;
    let backgroundColor = colors.surface;
    let leftBorderColor = item.category === "marking" ? colors.warning : colors.primary;

    if (isValidated) {
      borderColor = colors.success;
      backgroundColor = colors.successLight;
      leftBorderColor = colors.success;
    } else if (isFrustrated) {
      borderColor = colors.error;
      backgroundColor = colors.errorLight;
      leftBorderColor = colors.error;
    } else if (isMatched) {
      borderColor = colors.success;
      leftBorderColor = colors.success;
      backgroundColor = colors.surface;
    } else {
      // Unmatched - needs attention
      backgroundColor = colors.warningLight;
      borderColor = colors.warning;
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

        {/* Expected Values - filter out redundant values that match the card title */}
        {(() => {
          const normalizedLabel = item.label.toLowerCase().replace(/[^a-z0-9]/g, '');
          const nonRedundantValues = item.expectedValues.filter((value) => {
            const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
            // Filter out values that are essentially the same as the label
            return normalizedValue !== normalizedLabel &&
                   !normalizedLabel.includes(normalizedValue) &&
                   !normalizedValue.includes(normalizedLabel);
          });

          if (nonRedundantValues.length === 0) return null;

          return (
            <View style={styles.expectedValuesContainer}>
              {nonRedundantValues.map((value, index) => (
                <View key={index} style={styles.expectedValueChip}>
                  <Text style={styles.expectedValueText}>{value}</Text>
                </View>
              ))}
            </View>
          );
        })()}

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
              color={isValidated ? colors.white : colors.success}
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
              color={isFrustrated ? colors.white : colors.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStatusBadge = (item: ValidationItem) => {
    if (item.validationStatus === "validated") {
      return <StatusBadge status="verified" />;
    }

    if (item.validationStatus === "frustrated") {
      return <StatusBadge status="frustrated" label="Frustration" />;
    }

    if (item.matchStatus === "matched") {
      return <StatusBadge status="detected" />;
    }

    return <StatusBadge status="not-detected" />;
  };

  const renderSectionHeader = ({ section }: { section: ValidationSection }) => {
    const completedCount = section.data.filter(
      (item) => item.validationStatus !== "pending"
    ).length;
    const totalCount = section.data.length;

    return (
      <SectionHeader
        title={section.title}
        icon={section.icon as any}
        count={{ completed: completedCount, total: totalCount }}
      />
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
              color={colors.textSecondary}
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
                <MaterialIcons name="label" size={16} color={colors.textSecondary} />
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
      // Check local UI state for remaining frustrated items (more reliable than context state due to async updates)
      const allItems = sections.flatMap(s => s.data);
      const hasRemainingFrustrations = allItems.some(item => item.validationStatus === "frustrated");

      if (hasRemainingFrustrations) {
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

    if (shouldSkipPopMarking(inspection)) {
      navigateToPackageOutcome(navigation, inspection);
      return;
    }

    navigation.navigate("InspectorPOPMarkingDataEntry");
  }, [navigation, inspection, workflow.reinspection.mode, sections]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={isExceptedQuantity ? "Excepted Quantity Marking" : "Markings & Labels Validation"}
        onBack={() => navigation.goBack()}
        rightIcon="help-outline"
        onRightPress={() => {}}
      />

      {/* Main Content */}
      {isExceptedQuantity && (
        <View style={styles.eqBanner}>
          <MaterialIcons name="info" size={18} color={colors.primary} />
          <Text style={styles.eqBannerText}>
            Excepted Quantity shipments require the EQ marking only (A19.2.13). Other markings and labels do not apply.
          </Text>
        </View>
      )}
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
      <ActionFooter
        buttons={[
          {
            label: "Cancel",
            onPress: () => navigation.goBack(),
            variant: "outline",
            icon: "arrow-back",
          },
          {
            label: "Save & Exit",
            onPress: () =>
              Alert.alert("Save Progress", "Your verification progress has been saved."),
            variant: "secondary",
            icon: "save",
          },
          {
            label: "Continue",
            onPress: navigateToNextScreen,
            variant: "primary",
            icon: "arrow-forward",
            iconPosition: "right",
            disabled: !allItemsAddressed,
          },
        ]}
      />

      {/* Dev Benchmark Button - only visible in __DEV__ */}
      <DevBenchmarkButton position="bottom-right" />
    </SafeAreaView>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.light,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  expectedValuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  expectedValueChip: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expectedValueText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  matchInfoText: {
    fontSize: 13,
    color: colors.primary,
    marginBottom: spacing.md,
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  validateButton: {
    backgroundColor: colors.surface,
    borderColor: colors.success,
  },
  validateButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  frustrateButton: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
  },
  frustrateButtonActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  additionalSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  additionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  additionalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  additionalHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  additionalHeaderSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  additionalContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  additionalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  additionalItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  additionalItemConfidence: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  eqBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.infoLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eqBannerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
  },
});

// Wrap in React.memo with custom comparison
// The navigation prop from React Navigation changes frequently, so we ignore it
export default React.memo(
  InspectorMarkingsLabelsValidationScreenComponent,
  () => true // Always consider props equal - state/context changes still trigger re-renders
);
