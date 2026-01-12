import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useInspectionFormActions,
  useInspectionFrustrations,
  useInspectorData,
  useReinspectionState,
  useInspectionId,
} from "../../../src/contexts/InspectionFormProvider";
import { PackageFrustrationRecord } from "../../../src/types/sddg";
import { useHazProActions } from "../../../src/stores/useHazProStore";
import { DevBenchmarkButton } from "../dev/DevBenchmarkButton";

interface PackageFrustrationSummaryProps {
  navigation: any;
}

export default function PackageFrustrationSummary({
  navigation,
}: PackageFrustrationSummaryProps) {
  // Selector hooks for specific data
  const { packageFrustrations: pkgFrustrations } = useInspectionFrustrations();
  const inspector = useInspectorData();
  const reinspection = useReinspectionState();
  const inspectionId = useInspectionId();

  // Actions-only hook
  const {
    startPackageReinspection,
    completeInspection,
    completeReinspection,
    updateReinspectedInspection,
  } = useInspectionFormActions();

  const actions = useHazProActions();

  // Get package frustrations from inspection context
  const packageFrustrations = pkgFrustrations || [];

  // Separate frustrations by category
  const markingFrustrations = packageFrustrations.filter(
    f => f.category === "marking"
  );
  const labelFrustrations = packageFrustrations.filter(
    f => f.category === "label"
  );
  const dryIceFrustrations = packageFrustrations.filter(
    f => f.category === "dryice"
  );
  const magnetizedFrustrations = packageFrustrations.filter(
    f => f.category === "magnetized"
  );

  console.log("📦 [PackageFrustrationSummary] Component rendered");
  console.log(
    "📦 [PackageFrustrationSummary] Total frustrations:",
    packageFrustrations.length
  );
  console.log(
    "📦 [PackageFrustrationSummary] Marking frustrations:",
    markingFrustrations.length
  );
  console.log(
    "📦 [PackageFrustrationSummary] Label frustrations:",
    labelFrustrations.length
  );
  console.log(
    "🧊 [PackageFrustrationSummary] Dry ice frustrations:",
    dryIceFrustrations.length
  );
  console.log(
    "🧲 [PackageFrustrationSummary] Magnetized material frustrations:",
    magnetizedFrustrations.length
  );

  // Set active chevron when component mounts
  React.useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  // Track frustrations changes
  React.useEffect(() => {
    console.log(
      "📦 [PackageFrustrationSummary] useEffect - frustrations count changed:",
      packageFrustrations.length
    );
  }, [packageFrustrations.length]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const handleCancel = () => {
    // Go back to POP marking screen
    navigation.goBack();
  };

  const handleReinspectFrustrations = () => {
    console.log("📦 [PackageFrustrationSummary] Starting package reinspection");

    if (packageFrustrations.length === 0) {
      Alert.alert(
        "No Frustrations",
        "There are no frustrated package items to reinspect.",
        [{ text: "OK" }]
      );
      return;
    }

    // Extract the frustrated item IDs
    const frustratedItemIds = packageFrustrations.map(f => f.itemId);
    console.log(
      "📦 [PackageFrustrationSummary] Frustrated item IDs:",
      frustratedItemIds
    );

    // Start reinspection mode
    startPackageReinspection(frustratedItemIds);

    // Determine navigation based on what's frustrated
    const hasPOPFrustrations = packageFrustrations.some(f =>
      f.itemId.startsWith("pop-") || f.itemId.includes("pop-")
    );

    const hasMarkingOrLabelFrustrations = packageFrustrations.some(f =>
      f.category === "marking" || f.category === "label"
    );

    console.log("📦 [PackageFrustrationSummary] Frustration breakdown:", {
      hasPOP: hasPOPFrustrations,
      hasMarkingLabel: hasMarkingOrLabelFrustrations,
    });

    if (hasPOPFrustrations) {
      // Navigate to POP marking screen first
      console.log("📦 [PackageFrustrationSummary] Navigating to POP marking reinspection");
      navigation.navigate("InspectorPOPMarkingDataEntry");
    } else if (hasMarkingOrLabelFrustrations) {
      // Skip POP, go directly to markings/labels
      console.log("📦 [PackageFrustrationSummary] Navigating to markings/labels reinspection");
      navigation.navigate("InspectorMarkingsLabelsValidationScreen");
    } else {
      // Other categories (dry ice, magnetized, etc.) - not yet supported
      Alert.alert(
        "Reinspection Required",
        "Special inspection workflows (dry ice, magnetized materials) require manual reinspection. Please contact your supervisor.",
        [{ text: "OK" }]
      );
    }
  };

  const handleCompleteWithFrustration = async () => {
    const isReinspectionMode = reinspection.mode === "package";

    if (isReinspectionMode) {
      // We're completing a package reinspection - update the existing inspection
      console.log(
        "📦 [PackageFrustrationSummary] Completing package reinspection"
      );

      if (!inspectionId) {
        Alert.alert("Error", "Unable to find inspection ID");
        return;
      }

      const result = await updateReinspectedInspection();

      if (!result.success) {
        Alert.alert("Error", result.error || "Failed to save reinspection");
        return;
      }

      // Complete reinspection workflow
      completeReinspection();

      // Log the completion with frustrations (reinspection)
      console.log("Package reinspection completed with frustrations:", {
        frustrationCount: packageFrustrations.length,
        markingFrustrations: markingFrustrations.length,
        labelFrustrations: labelFrustrations.length,
        dryIceFrustrations: dryIceFrustrations.length,
        inspector: inspector,
        completionTime: new Date(),
      });

      // Navigate to Form 1015 (same as initial inspection flow)
      navigation.navigate("InspectorAMC1015Form");
    } else {
      // Original inspection flow - complete and go to Form 1015
      completeInspection();

      // Log the completion with frustrations
      console.log("Package inspection completed with frustrations:", {
        frustrationCount: packageFrustrations.length,
        markingFrustrations: markingFrustrations.length,
        labelFrustrations: labelFrustrations.length,
        dryIceFrustrations: dryIceFrustrations.length,
        inspector: inspector,
        completionTime: new Date(),
      });

      // Navigate directly to Form 1015
      navigation.navigate("InspectorAMC1015Form");
    }
  };

  const renderPackageFrustrationCard = (
    frustration: PackageFrustrationRecord,
    index: number
  ) => {
    // Create SDDG-style field label with category distinction
    const categoryLabel =
      frustration.category === "marking"
        ? "Package Marking"
        : frustration.category === "label"
        ? "Package Label"
        : "Dry Ice Inspection";
    const fieldLabel = `${frustration.itemLabel.toUpperCase()} (${categoryLabel})`;

    // Determine field value display
    const fieldValue =
      frustration.verificationStatus === "missing"
        ? "Missing"
        : frustration.expectedValues.length > 0
        ? `Expected: ${frustration.expectedValues.join(", ")}`
        : "No data";

    // Determine colors based on verification status
    const iconColor =
      frustration.verificationStatus === "missing" ? "#FF3B30" : "#FF9500";
    const borderColor =
      frustration.verificationStatus === "missing" ? "#FFE5E5" : "#FFE5CC";

    return (
      <View
        key={frustration.id}
        style={[styles.frustrationCard, { borderColor }]}
      >
        <View style={styles.frustrationHeader}>
          <MaterialIcons name="error" size={24} color={iconColor} />
          <Text style={styles.frustrationFieldLabel}>{fieldLabel}</Text>
        </View>

        <View style={styles.frustrationDetails}>
          {/* Only show Field Value for marking and label frustrations, not dry ice */}
          {frustration.category !== "dryice" && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Field Value:</Text>
              <Text style={[styles.detailValue, styles.fieldValueText]}>
                {fieldValue}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date/Time:</Text>
            <Text style={styles.detailValue}>
              {formatDate(frustration.frustrationDate)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspector:</Text>
            <Text style={styles.detailValue}>
              {typeof frustration.inspector === "string"
                ? frustration.inspector
                : `${frustration.inspector?.inspectorRank || ""} ${
                    frustration.inspector?.inspectorName || ""
                  }`.trim() || "Unknown"}
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.detailLabel}>Frustration Message:</Text>
            <Text style={styles.frustrationMessage}>
              {frustration.defaultMessage}
            </Text>
          </View>

          {frustration.additionalComments && (
            <View style={styles.messageContainer}>
              <Text style={styles.detailLabel}>Additional Comments:</Text>
              <Text style={styles.additionalComments}>
                {frustration.additionalComments}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <MaterialIcons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Package Frustration Summary</Text>
        <View style={styles.frustrationCountBadge}>
          <Text style={styles.frustrationCountText}>
            {packageFrustrations.length}
          </Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {packageFrustrations.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="check-circle" size={64} color="#34C759" />
              <Text style={styles.emptyStateTitle}>
                No Package Issues Found
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                All package markings and labels have been verified successfully.
              </Text>
            </View>
          ) : (
            packageFrustrations.map((frustration, index) =>
              renderPackageFrustrationCard(frustration, index)
            )
          )}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.reinspectionButton}
          onPress={() => {
            // Placeholder for reinspection frustrations functionality
            console.log('Package reinspection frustrations button pressed');
            Alert.alert(
              'Reinspection Required',
              'These items must be corrected and re-inspected before shipment can proceed.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.reinspectionButtonText}>Reinspect Frustrations</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.reinspectionButton}
          onPress={handleReinspectFrustrations}
        >
          <MaterialIcons name="refresh" size={20} color="#007AFF" />
          <Text style={styles.reinspectionButtonText}>
            Reinspect
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteWithFrustration}
        >
          <Text style={styles.completeButtonText}>
            Complete with Frustration & Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dev Benchmark Button - only visible in __DEV__ */}
      <DevBenchmarkButton position="bottom-right" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#1D1D1F",
    marginHorizontal: 8,
  },
  frustrationCountBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  frustrationCountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  frustrationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  frustrationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  frustrationFieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginLeft: 8,
    flex: 1,
  },
  frustrationDetails: {
    marginLeft: 32,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#1D1D1F",
    flex: 1,
  },
  fieldValueText: {
    fontWeight: "600",
    color: "#007AFF",
  },
  messageContainer: {
    marginTop: 8,
  },
  frustrationMessage: {
    fontSize: 14,
    color: "#1D1D1F",
    marginTop: 4,
    lineHeight: 20,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  additionalComments: {
    fontSize: 14,
    color: "#1D1D1F",
    marginTop: 4,
    lineHeight: 20,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    fontStyle: "italic",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
  reinspectionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  reinspectionButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});
