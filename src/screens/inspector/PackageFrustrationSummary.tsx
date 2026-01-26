import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
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

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatInspectorName = (inspector: PackageFrustrationRecord["inspector"]): string => {
    if (typeof inspector === "string") {
      return inspector;
    }
    const name = `${inspector?.inspectorRank || ""} ${inspector?.inspectorName || ""}`.trim();
    return name || "Unknown";
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "marking":
        return "Package Marking";
      case "label":
        return "Package Label";
      case "packaging":
        return "Packaging";
      case "magnetized":
        return "Magnetized Material";
      case "dryice":
        return "Dry Ice";
      case "first-aid-chemical-kit":
        return "First Aid / Chemical Kit";
      case "life-saving":
        return "Life-Saving Appliances";
      case "dangerous-goods-apparatus":
        return "Dangerous Goods in Apparatus";
      case "class9-general":
        return "Class 9 General";
      case "asbestos":
        return "Asbestos";
      case "capacitor":
        return "Capacitors";
      case "engines-internal-combustion":
        return "Internal Combustion Engines";
      case "consumer-commodity":
        return "Consumer Commodity";
      case "misc-dangerous-goods-articles":
        return "Misc Dangerous Goods Articles";
      case "fuel-powered-vehicle":
        return "Fuel-Powered Vehicle";
      case "battery-vehicle":
        return "Battery-Powered Vehicle";
      case "lithium_battery":
        return "Lithium Batteries";
      case "lithium_battery_contained":
        return "Lithium Batteries (Contained)";
      case "lithium_battery_packed":
        return "Lithium Batteries (Packed)";
      case "infectious-substances":
        return "Infectious Substances";
      case "biological-category-b":
        return "Biological Category B";
      default:
        return "Package";
    }
  };

  // Group frustrations by category
  const groupedFrustrations = useMemo(() => {
    const groups: Record<string, PackageFrustrationRecord[]> = {};
    packageFrustrations.forEach((frustration) => {
      const category = frustration.category || "other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(frustration);
    });
    return groups;
  }, [packageFrustrations]);

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
      // Original inspection flow - go to Form 1015, save on completion
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

  const renderItemRow = (
    frustration: PackageFrustrationRecord,
    index: number,
    isLast: boolean
  ) => {
    const showDescription = Boolean(frustration.additionalComments);

    return (
      <View key={frustration.id}>
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>{frustration.itemLabel}</Text>
          {showDescription && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Description</Text>
              <Text style={styles.metaValue}>{frustration.additionalComments}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Date/Time</Text>
            <Text style={styles.metaValue}>{formatDateTime(frustration.frustrationDate)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Inspector</Text>
            <Text style={styles.metaValue}>{formatInspectorName(frustration.inspector)}</Text>
          </View>
        </View>
        {!isLast && <View style={styles.itemDivider} />}
      </View>
    );
  };

  const renderCategoryCard = (category: string, frustrations: PackageFrustrationRecord[]) => {
    const categoryLabel = getCategoryLabel(category);

    return (
      <View key={category} style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryHeaderText}>{categoryLabel.toUpperCase()}</Text>
        </View>
        <View style={styles.categoryBody}>
          {frustrations.map((frustration, index) =>
            renderItemRow(frustration, index, index === frustrations.length - 1)
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
      />

      <View style={styles.mainContent}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {packageFrustrations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>
                No Package Issues Found
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                All package markings and labels have been verified successfully.
              </Text>
            </View>
          ) : (
            Object.entries(groupedFrustrations).map(([category, frustrations]) =>
              renderCategoryCard(category, frustrations)
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
    padding: spacing.sm,
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
  // Category Card Styles
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.light,
    overflow: "hidden",
  },
  categoryHeader: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  categoryHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  categoryBody: {
    paddingVertical: spacing.xs,
  },
  // Item Row Styles
  itemRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    width: 80,
  },
  metaValue: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
});
