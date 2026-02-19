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
import { ScreenHeader, ActionFooter, colors, spacing } from "./ui";

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

    navigation.navigate("InspectorSddgOriginalCopiesCheckScreen", {
      showSummaryOnFailure: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="SDDG Inspection Complete"
        onClose={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroIconContainer}>
            <MaterialIcons name="check-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.heroTitle}>SDDG Verified</Text>
          <Text style={styles.heroSubtitle}>
            Ready for package inspection
          </Text>
        </View>
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
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  heroCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    width: "100%",
    maxWidth: 400,
  },
  heroIconContainer: {
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.success,
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
