import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useDatabase } from "@/contexts/DataProvider";
import { InspectorShipment } from "@/types/sddg";
import { useHazProActions } from "@/stores/useHazProStore";
import { DevBenchmarkButton } from "./dev/DevBenchmarkButton";
import {
  ScreenHeader,
  ActionFooter,
  DetailCard,
  colors,
  spacing,
} from "./ui";

interface SDDGInspectionCompleteScreenProps {
  navigation: any;
}

export default function SDDGInspectionCompleteScreen({
  navigation,
}: SDDGInspectionCompleteScreenProps) {
  const {
    inspection,
    startNewInspection,
    setSDDGComplete,
    completeSDDGSubstep,
    completeSDDGAndMoveToPackage,
  } = useInspectionForm();

  const database = useDatabase();
  const actions = useHazProActions();
  const [isSaving, setIsSaving] = useState(false);

  // Set active chevron when component mounts
  React.useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, []);

  // Get SDDG data from verification copy (source of truth)
  const sddgData = inspection.verificationCopy;

  // Handle Save & Exit
  const handleSaveAndExit = async () => {
    try {
      setIsSaving(true);

      if (!sddgData) {
        Alert.alert("Error", "No SDDG data available to save");
        return;
      }

      // Create InspectorShipment record with partial completion status
      const inspectionRecord: InspectorShipment = {
        id: Date.now().toString(),
        status: "in-progress", // Overall status - inspection not fully complete
        inspectedAt: new Date(),
        inspectionContext: { ...inspection },
        tcn: sddgData.shippersReferenceNumber || "N/A",
        unId: sddgData.unIdNo || "N/A",
        properShippingName: sddgData.properShippingName || "N/A",
        inspector: inspection.inspector,
        sddgStatus: "verified", // SDDG phase is complete with no frustrations
        packageStatus: null, // Package phase not started yet
        totalFrustrations: 0,
        sddgFrustrations: 0,
        packageFrustrations: 0,
      };

      console.log(
        "📝 [SDDGInspectionComplete] Saving partial inspection to database"
      );

      // Save to database
      const id = await database.saveInspection(inspectionRecord);

      console.log(
        "📝 [SDDGInspectionComplete] Inspection saved successfully:",
        id
      );

      // Show success message
      Alert.alert(
        "Inspection Saved",
        "SDDG inspection has been saved. You can continue the package inspection later from the home screen.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear provider state
              startNewInspection();
              // Navigate to home screen
              navigation.navigate("InspectorHomeStack", { screen: "InspectorHome" });
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        "📝 [SDDGInspectionComplete] Failed to save inspection:",
        error
      );
      Alert.alert(
        "Save Failed",
        "Failed to save inspection. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Continue to Package Inspection
  const handleContinueToPackage = () => {
    console.log("📝 [SDDGInspectionComplete] Continuing to package inspection");

    // Mark SDDG phase as complete
    completeSDDGSubstep("SDDGComplianceValidation");
    setSDDGComplete(true);
    completeSDDGAndMoveToPackage();

    // Route based on UN number (same logic as SDDGFrustrationSummary)
    const unIdNo = sddgData?.unIdNo || "";

    console.log("📝 [SDDGInspectionComplete] Routing for UN#:", unIdNo);

    if (unIdNo === "UN1845") {
      // Navigate to Dry Ice Inspector Screen for UN1845 (Carbon Dioxide, Solid - Dry Ice)
      navigation.navigate("InspectorDryIceScreen");
    } else if (unIdNo === "UN2807") {
      // Navigate to Magnetized Material Inspector Screen for UN2807 (Magnetized Material)
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (unIdNo === "UN3072" || unIdNo === "UN2990") {
      // Navigate to Life-Saving Appliances Inspector Screen for UN3072/UN2990
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (unIdNo === "UN3245") {
      // Navigate to Genetically Modified Organisms Inspector Screen for UN3245 (Genetically Modified Microorganisms)
      navigation.navigate("InspectorGeneticallyModifiedOrganismsScreen");
    } else if (unIdNo === "UN3268") {
      // Navigate to Safety Devices Inspector Screen for UN3268 (Safety Devices, Electrically Initiated)
      navigation.navigate("InspectorSafetyDevicesScreen");
    } else if (unIdNo === "UN3508") {
      // Navigate to Capacitor Inspector Screen for UN3508 (Capacitor, Asymmetric)
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (unIdNo === "UN3528" || unIdNo === "UN3529") {
      // Navigate to Internal Combustion Engines Inspector Screen for UN3528/UN3529
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (unIdNo === "UN3316") {
      // Navigate to First Aid/Chemical Kit Inspector Screen for UN3316
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (unIdNo === "UN3363") {
      // Navigate to Dangerous Goods in Apparatus Inspector Screen for UN3363
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (unIdNo === "UN3171") {
      // Navigate to Battery-Powered Vehicle Inspector Screen for UN3171
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (unIdNo === "UN3480" || unIdNo === "UN3090") {
      // Navigate to Lithium Batteries Inspector Screen for UN3480 (Lithium Ion Batteries) / UN3090 (Lithium Metal Batteries)
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else {
      // Navigate to Package Verification screen for standard workflow
      // navigation.navigate("InspectorPackageVerification");
      navigation.navigate("MLDetectionScreen");
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="SDDG Inspection Complete"
        onClose={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <MaterialIcons name="check-circle" size={48} color={colors.success} />
          <Text style={styles.successTitle}>SDDG Verified</Text>
          <Text style={styles.successSubtitle}>
            All fields validated with no compliance issues
          </Text>
        </View>

        {/* SDDG Summary Card */}
        <DetailCard
          title="Inspection Summary"
          fields={[
            {
              label: "TRANSPORTATION CONTROL NUMBER",
              value: sddgData?.shippersReferenceNumber || "N/A",
              accent: true,
            },
            {
              label: "UN/NA/ID NUMBER",
              value: sddgData?.unIdNo || "N/A",
            },
            {
              label: "PROPER SHIPPING NAME",
              value: sddgData?.properShippingName || "N/A",
            },
            {
              label: "HAZARD CLASS",
              value: sddgData?.hazardClass || "N/A",
            },
            {
              label: "INSPECTOR",
              value: inspection.inspector.inspectorName || "N/A",
            },
          ]}
        />
      </View>

      {/* Action Buttons */}
      <ActionFooter
        buttons={[
          {
            label: "Back",
            onPress: () => navigation.goBack(),
            variant: "outline",
            icon: "arrow-back",
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
            label: "Continue to Package",
            onPress: handleContinueToPackage,
            variant: "primary",
            icon: "arrow-forward",
            iconPosition: "right",
            disabled: isSaving,
          },
        ]}
        style={styles.footer}
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
    padding: spacing.md,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.success,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.xxl,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
