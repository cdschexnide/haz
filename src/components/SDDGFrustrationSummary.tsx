import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useDatabase } from "@/contexts/DataProvider";
import { FrustrationRecord, InspectorShipment } from "@/types/sddg";
import { useHazProActions } from "@/stores/useHazProStore";
import { DevBenchmarkButton } from "./dev/DevBenchmarkButton";
import { evaluateAttachment19Eligibility } from "@/utils/eligibility/attachment19Eligibility";
import { getKey16Quantities } from "@/utils/eligibility/getKey16Quantities";
import { getPackagingTypeFromKey16 } from "@/utils/getPackagingTypeFromKey16";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { hasSpecialProvisionAlphaCode } from "@/utils/specialProvisions";
import {
  getPostSddgStartRoute,
  getSpecialAuthorizationGateDecision,
} from "@/utils/inspectorWorkflowRouting";
import {
  ScreenHeader,
  ActionFooter,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "./ui";

interface SDDGFrustrationSummaryProps {
  navigation: any;
}

export default function SDDGFrustrationSummary({
  navigation,
}: SDDGFrustrationSummaryProps) {
  const {
    inspection,
    workflow,
    inspectionId,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    startSDDGReinspection,
    completeSDDGSubstep,
    setSDDGComplete,
    completeInspection,
    completeSDDGAndMoveToPackage,
    completeReinspection,
    updateReinspectedInspection,
    startNewInspection,
    setQuantityType,
    setExceptedQuantityData,
    setLimitedQuantityData,
    setPackagePackagingType,
    setSpecialAuthorizationData,
  } = useInspectionForm();
  const actions = useHazProActions();
  const database = useDatabase();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, []);

  // Access frustrations from inspection context (no reactivity issues with Context API)
  const frustrations = inspection.frustrations || [];

  console.log("🔴 [FrustrationSummary] Component rendered");
  console.log(
    "🔴 [FrustrationSummary] Frustration count:",
    frustrations.length
  );
  console.log("🔴 [FrustrationSummary] Has inspection context:", !!inspection);

  // Track frustrations changes
  React.useEffect(() => {
    console.log(
      "🔴 [FrustrationSummary] useEffect - frustrations count changed:",
      frustrations.length
    );
  }, [frustrations.length]);

  // Update workflow step when component mounts
  React.useEffect(() => {
    console.log("🔴 [FrustrationSummary] Mounting - setting workflow step");
    setCurrentSDDGStep("frustration");
    setCurrentSDDGScreen("SDDGFrustrationSummary");
    console.log(
      "🔴 [FrustrationSummary] After setting workflow - frustrations count:",
      frustrations.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Go back to compliance validation
    navigation.goBack();
  };

  const handleReinspectFrustrations = () => {
    console.log("🔄 [SDDGFrustrationSummary] Starting SDDG reinspection");

    if (frustrations.length === 0) {
      Alert.alert(
        "No Frustrations",
        "There are no frustrated items to reinspect.",
        [{ text: "OK" }]
      );
      return;
    }

    // Extract the frustrated keys
    const frustratedKeys = frustrations.map(f => f.key);
    console.log("🔄 [SDDGFrustrationSummary] Frustrated keys:", frustratedKeys);

    // Start reinspection mode
    startSDDGReinspection(frustratedKeys);

    // Navigate to interactive compliance validation for reinspection
    navigation.navigate("InteractiveSDDGComplianceScreen");
  };

  const handleCompleteWithFrustration = async () => {
    const isReinspectionMode = workflow.reinspection.mode === "sddg";

    if (isReinspectionMode) {
      // We're completing a reinspection - update the existing inspection
      console.log("🔄 [FrustrationSummary] Completing reinspection");

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

      // Clear inspection and navigate home
      startNewInspection();
      navigation.navigate("InspectorHomeScreen");
    } else {
      // Original inspection flow - continue to package inspection
      completeSDDGSubstep("SDDGFrustrationSummary");
      setSDDGComplete(true);

      // Log the SDDG completion with frustrations
      console.log("SDDG phase completed with frustrations:", {
        frustrationCount: frustrations.length,
        inspector: inspection.inspector,
        completionTime: new Date(),
      });

      // This completes the SDDG chevron and moves to Package workflow
      completeSDDGAndMoveToPackage();

      const unIdNo =
        inspection?.extractedContent?.unIdNo ||
        inspection?.verificationCopy?.unIdNo ||
        "";
      console.log("LOGGING UN# -> ", unIdNo);
      console.log("Navigating to package workflow start screen");

      if (inspection.verificationCopy) {
        const specialAuthorizationGate =
          getSpecialAuthorizationGateDecision(inspection);

        if (specialAuthorizationGate.shouldResetAuthorization) {
          setSpecialAuthorizationData(null);
        }

        if (specialAuthorizationGate.action === "go_to_ml_detection") {
          setQuantityType("standard");
          setExceptedQuantityData(null);
          setLimitedQuantityData(null);
          setPackagePackagingType(null);
          navigation.navigate("MLDetectionScreen", { unIdNo });
          return;
        }

        if (
          specialAuthorizationGate.action ===
          "go_to_special_authorization_check"
        ) {
          navigation.navigate("InspectorSpecialAuthorizationCheckScreen", {
            packingInstruction: specialAuthorizationGate.packingInstruction,
          });
          return;
        }

        const eligibility = evaluateAttachment19Eligibility({
          sddgContent: inspection.verificationCopy,
          quantities: getKey16Quantities(inspection.verificationCopy),
        });
        const packagingType = getPackagingTypeFromKey16(
          inspection.verificationCopy.quantityAndPacking
        );
        const hazmatItem = hazardousMaterialsList.find(
          item => item.unid === inspection.verificationCopy?.unIdNo
        );
        const hasA2Restriction =
          hazmatItem &&
          hasSpecialProvisionAlphaCode(hazmatItem.specialProvision, "A2");
        const resolvedPackagingType =
          hasA2Restriction && packagingType === "single" ? null : packagingType;
        setQuantityType("standard");
        setExceptedQuantityData(eligibility.exceptedQuantityData);
        setLimitedQuantityData(eligibility.limitedQuantityData);
        setPackagePackagingType(resolvedPackagingType);

        const isEligible =
          eligibility.exceptedQuantityData.eligible ||
          eligibility.limitedQuantityData.eligible;
        const startRoute = getPostSddgStartRoute(inspection);
        const attachment28Params = {
          continueRoute: "InspectorSpecialProvisionsScreen",
          continueParams: {
            continueRoute: "MLDetectionScreen",
            continueParams: { unIdNo },
          },
        };
        const packagingParams = {
          nextRoute: "InspectorAttachment28WizardScreen",
          nextParams: attachment28Params,
        };

        if (startRoute.screen !== "InspectorAttachment28WizardScreen") {
          navigation.navigate(startRoute.screen);
          return;
        }

        if (isEligible) {
          navigation.navigate("InspectorQuantityTypeSelectionScreen", packagingParams);
        } else {
          navigation.navigate("InspectorPackagingTypeSelectionScreen", packagingParams);
        }
        return;
      }

      const startRoute = getPostSddgStartRoute(inspection);
      if (startRoute.screen !== "InspectorAttachment28WizardScreen") {
        navigation.navigate(startRoute.screen);
        return;
      }

      navigation.navigate("InspectorPackagingTypeSelectionScreen", {
        nextRoute: "InspectorAttachment28WizardScreen",
        nextParams: {
          continueRoute: "InspectorSpecialProvisionsScreen",
          continueParams: {
            continueRoute: "MLDetectionScreen",
            continueParams: { unIdNo },
          },
        },
      });
    }
  };

  // Handle Save & Exit - save inspection with frustrations and exit without continuing to package
  const handleSaveAndExit = async () => {
    try {
      setIsSaving(true);

      const sddgData = inspection.verificationCopy;
      if (!sddgData) {
        Alert.alert("Error", "No SDDG data available to save");
        return;
      }

      // Create inspection record with frustrated SDDG status
      const inspectionRecord: InspectorShipment = {
        id: Date.now().toString(),
        status: "in-progress",
        inspectedAt: new Date(),
        inspectionContext: { ...inspection },
        tcn: sddgData.shippersReferenceNumber || "N/A",
        unId: sddgData.unIdNo || "N/A",
        properShippingName: sddgData.properShippingName || "N/A",
        inspector: inspection.inspector,
        sddgStatus: "frustrated",
        packageStatus: null,
        totalFrustrations: frustrations.length,
        sddgFrustrations: frustrations.length,
        packageFrustrations: 0,
      };

      console.log(
        "📝 [SDDGFrustrationSummary] Saving inspection with frustrations"
      );

      const savedId = await database.saveInspection(inspectionRecord);

      console.log(
        "📝 [SDDGFrustrationSummary] Inspection saved successfully with ID:",
        savedId
      );

      // Mark SDDG workflow complete AFTER successful save
      completeSDDGSubstep("SDDGFrustrationSummary");
      setSDDGComplete(true);

      Alert.alert(
        "Inspection Saved",
        `SDDG inspection saved with ${frustrations.length} frustration(s). You can reinspect or continue package inspection later.`,
        [
          {
            text: "OK",
            onPress: () => {
              startNewInspection();
              navigation.navigate("InspectorHomeStack", {
                screen: "InspectorHome",
              });
            },
          },
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(
        "📝 [SDDGFrustrationSummary] Failed to save inspection:",
        error
      );
      Alert.alert(
        "Save Failed",
        `Failed to save inspection: ${errorMessage}. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatInspectorName = (inspector: typeof inspection.inspector): string => {
    if (typeof inspector === "string") {
      return inspector;
    }
    const name = inspector.inspectorName?.trim() || "";
    const title = inspector.inspectorTitle?.trim() || "";
    if (name && title) {
      return `${name}, ${title}`;
    }
    return name || title || "Unknown";
  };

  const renderFrustrationCard = (
    frustration: FrustrationRecord,
    index: number
  ) => (
    <View key={`${frustration.key}-${index}`} style={styles.frustrationCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>
          {frustration.fieldLabel.toUpperCase()}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.valueComparisonRow}>
          <View style={styles.valueCard}>
            <Text style={styles.valueLabel}>INCORRECT</Text>
            <Text style={styles.incorrectValueText}>
              {frustration.fieldValue || "No data"}
            </Text>
          </View>
          <View style={[styles.valueCard, styles.valueCardCorrect]}>
            <Text style={styles.valueLabel}>SHOULD BE</Text>
            <Text style={styles.correctValueText}>
              {frustration.correctValue || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.metaColumns}>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>DATE/TIME</Text>
            <Text style={styles.metaValue}>
              {formatDate(frustration.frustrationDate)}
            </Text>
          </View>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>INSPECTOR</Text>
            <Text style={styles.metaValue}>
              {formatInspectorName(inspection.inspector)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="SDDG Frustration Summary"
        onClose={handleCancel}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {frustrations.map((frustration, index) =>
          renderFrustrationCard(frustration, index)
        )}
      </ScrollView>

      {/* Action Buttons */}
      <ActionFooter
        buttons={[
          {
            label: "Cancel",
            onPress: handleCancel,
            variant: "outline",
            disabled: isSaving,
          },
          {
            label: "Save & Exit",
            onPress: handleSaveAndExit,
            variant: "secondary",
            icon: "save",
            loading: isSaving,
            disabled: isSaving,
          },
          {
            label: "Reinspect",
            onPress: handleReinspectFrustrations,
            variant: "primary",
            icon: "refresh",
            disabled: isSaving,
          },
          {
            label: "Continue to Package",
            onPress: handleCompleteWithFrustration,
            variant: "primary",
            disabled: isSaving,
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  frustrationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.light,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: spacing.lg,
  },
  valueComparisonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  valueCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  valueCardCorrect: {
    borderColor: colors.success,
  },
  valueLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  incorrectValueText: {
    fontWeight: "700",
    color: colors.error,
    fontSize: 15,
  },
  correctValueText: {
    fontWeight: "700",
    color: colors.success,
    fontSize: 15,
  },
  metaColumns: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
