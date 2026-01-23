import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useInspectionFormActions,
  useInspectionFrustrations,
  useInspectorData,
  useReinspectionState,
  useInspectionId,
} from "../../contexts/InspectionFormProvider";
import { PackageFrustrationRecord } from "../../types/sddg";
import { useHazProActions } from "../../stores/useHazProStore";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { getPackageFrustrationSnapshot } from "../../utils/getPackageFrustrationSnapshot";
import {
  ScreenHeader,
  ActionFooter,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../components/ui";

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
  const packagingFrustrations = packageFrustrations.filter(
    f => f.category === "packaging"
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
  console.log(
    "📦 [PackageFrustrationSummary] Packaging frustrations:",
    packagingFrustrations.length
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

    const snapshot = getPackageFrustrationSnapshot({ packageFrustrations });
    const frustratedItemIds = snapshot.ids;
    console.log(
      "📦 [PackageFrustrationSummary] Frustrated item IDs:",
      frustratedItemIds
    );

    // Start reinspection mode
    startPackageReinspection(frustratedItemIds);

    // Determine navigation based on what's frustrated
    const hasPOPFrustrations = (snapshot.idsByCategory.pop || []).length > 0;
    const hasMarkingOrLabelFrustrations =
      (snapshot.idsByCategory.marking || []).length > 0 ||
      (snapshot.idsByCategory.label || []).length > 0;
  const hasPackagingFrustrations =
    (snapshot.idsByCategory.packaging || []).length > 0;
  const hasKitFrustrations = packageFrustrations.some(
    f => f.category === "first-aid-chemical-kit"
  );
  const hasDryIceFrustrations = packageFrustrations.some(
    f => f.category === "dryice"
  );
  const hasMagnetizedFrustrations = packageFrustrations.some(
    f => f.category === "magnetized"
  );
  const hasLifeSavingFrustrations = packageFrustrations.some(
    f => f.category === "life-saving"
  );
  const hasApparatusFrustrations = packageFrustrations.some(
    f => f.category === "dangerous-goods-apparatus"
  );
  const hasClass9GeneralFrustrations = packageFrustrations.some(
    f => f.category === "class9-general"
  );
  const hasAsbestosFrustrations = packageFrustrations.some(
    f => f.category === "asbestos"
  );
  const hasCapacitorFrustrations = packageFrustrations.some(
    f => f.category === "capacitor"
  );
  const hasEngineFrustrations = packageFrustrations.some(
    f => f.category === "engines-internal-combustion"
  );
  const hasConsumerCommodityFrustrations = packageFrustrations.some(
    f => f.category === "consumer-commodity"
  );
  const hasMiscArticlesFrustrations = packageFrustrations.some(
    f => f.category === "misc-dangerous-goods-articles"
  );
  const hasFuelVehicleFrustrations = packageFrustrations.some(
    f => f.category === "fuel-powered-vehicle"
  );
  const hasBatteryVehicleFrustrations = packageFrustrations.some(
    f => f.category === "battery-vehicle"
  );
  const hasLithiumBatteryFrustrations = packageFrustrations.some(
    f => f.category === "lithium_battery"
  );
  const hasLithiumContainedFrustrations = packageFrustrations.some(
    f => f.category === "lithium_battery_contained"
  );
  const hasLithiumPackedFrustrations = packageFrustrations.some(
    f => f.category === "lithium_battery_packed"
  );
  const hasInfectiousSubstancesFrustrations = packageFrustrations.some(
    f => f.category === "infectious-substances"
  );
  const hasCategoryBFrustrations = packageFrustrations.some(
    f => f.category === "biological-category-b"
  );

    console.log("📦 [PackageFrustrationSummary] Frustration breakdown:", {
      hasPOP: hasPOPFrustrations,
      hasMarkingLabel: hasMarkingOrLabelFrustrations,
      hasPackaging: hasPackagingFrustrations,
      hasKit: hasKitFrustrations,
      hasDryIce: hasDryIceFrustrations,
      hasMagnetized: hasMagnetizedFrustrations,
      hasLifeSaving: hasLifeSavingFrustrations,
      hasApparatus: hasApparatusFrustrations,
      hasClass9General: hasClass9GeneralFrustrations,
      hasAsbestos: hasAsbestosFrustrations,
      hasCapacitor: hasCapacitorFrustrations,
      hasEngines: hasEngineFrustrations,
      hasConsumerCommodity: hasConsumerCommodityFrustrations,
      hasMiscArticles: hasMiscArticlesFrustrations,
      hasFuelVehicle: hasFuelVehicleFrustrations,
      hasBatteryVehicle: hasBatteryVehicleFrustrations,
      hasLithiumBattery: hasLithiumBatteryFrustrations,
      hasLithiumContained: hasLithiumContainedFrustrations,
      hasLithiumPacked: hasLithiumPackedFrustrations,
      hasInfectiousSubstances: hasInfectiousSubstancesFrustrations,
      hasCategoryB: hasCategoryBFrustrations,
    });

    if (hasPackagingFrustrations) {
      console.log("📦 [PackageFrustrationSummary] Navigating to packaging reinspection");
      navigation.navigate("InspectorAttachment28WizardScreen");
    } else if (hasPOPFrustrations) {
      console.log("📦 [PackageFrustrationSummary] Navigating to POP marking reinspection");
      navigation.navigate("InspectorPOPMarkingDataEntry");
    } else if (hasKitFrustrations) {
      console.log("📦 [PackageFrustrationSummary] Navigating to kit reinspection");
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (hasDryIceFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to dry ice reinspection"
      );
      navigation.navigate("InspectorDryIceScreen");
    } else if (hasMagnetizedFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to magnetized material reinspection"
      );
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (hasLifeSavingFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to life-saving appliances reinspection"
      );
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (hasApparatusFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to dangerous goods in apparatus reinspection"
      );
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (hasClass9GeneralFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to Class 9 general reinspection"
      );
      navigation.navigate("InspectorClass9GeneralScreen");
    } else if (hasAsbestosFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to asbestos reinspection"
      );
      navigation.navigate("InspectorAsbestosScreen");
    } else if (hasCapacitorFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to capacitor reinspection"
      );
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (hasEngineFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to internal combustion reinspection"
      );
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (hasConsumerCommodityFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to consumer commodity reinspection"
      );
      navigation.navigate("InspectorConsumerCommodityScreen");
    } else if (hasMiscArticlesFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to UN3548 reinspection"
      );
      navigation.navigate("InspectorMiscDangerousGoodsArticlesScreen");
    } else if (hasFuelVehicleFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to fuel-powered vehicle reinspection"
      );
      navigation.navigate("InspectorFuelPoweredVehicleScreen");
    } else if (hasBatteryVehicleFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to battery-powered vehicle reinspection"
      );
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (hasLithiumBatteryFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to lithium battery reinspection"
      );
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else if (hasLithiumContainedFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to lithium contained-in-equipment reinspection"
      );
      navigation.navigate("InspectorLithiumBatteriesContainedInEquipmentScreen");
    } else if (hasLithiumPackedFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to lithium packed-with-equipment reinspection"
      );
      navigation.navigate("InspectorLithiumBatteriesPackedWithEquipmentScreen");
    } else if (hasInfectiousSubstancesFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to infectious substances reinspection"
      );
      navigation.navigate("InspectorInfectiousSubstancesScreen");
    } else if (hasCategoryBFrustrations) {
      console.log(
        "📦 [PackageFrustrationSummary] Navigating to Category B reinspection"
      );
      navigation.navigate("InspectorBiologicalSubstancesCategoryBScreen");
    } else if (hasMarkingOrLabelFrustrations) {
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
        : frustration.category === "packaging"
        ? "Packaging"
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
      frustration.verificationStatus === "missing" ? colors.error : colors.warning;
    const borderColor =
      frustration.verificationStatus === "missing" ? colors.errorLight : "#FFE5CC";

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
      <ScreenHeader
        title="Package Frustration Summary"
        onClose={handleCancel}
        rightIcon="error"
        rightBadgeCount={packageFrustrations.length}
      />

      <View style={styles.mainContent}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {packageFrustrations.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="check-circle" size={64} color={colors.success} />
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
      <ActionFooter
        buttons={[
          {
            label: "Cancel",
            onPress: handleCancel,
            variant: "outline",
          },
          {
            label: "Reinspect",
            onPress: handleReinspectFrustrations,
            variant: "secondary",
            icon: "refresh",
          },
          {
            label: "Complete with Frustration & Continue",
            onPress: handleCompleteWithFrustration,
            variant: "destructive",
          },
        ]}
      />

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
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  frustrationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.light,
    borderWidth: 1,
    borderColor: colors.errorLight,
  },
  frustrationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  frustrationFieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  frustrationDetails: {
    marginLeft: 32,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  fieldValueText: {
    fontWeight: "600",
    color: colors.primary,
  },
  messageContainer: {
    marginTop: spacing.sm,
  },
  frustrationMessage: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    lineHeight: 20,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  additionalComments: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    lineHeight: 20,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontStyle: "italic",
  },
});
