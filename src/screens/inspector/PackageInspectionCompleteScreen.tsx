import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProActions } from "../../stores/useHazProStore";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import {
  ScreenHeader,
  ActionFooter,
  DetailCard,
  StatusBadge,
  InfoBox,
  colors,
  spacing,
} from "../../components/ui";

interface PackageInspectionCompleteScreenProps {
  navigation: any;
}

export default function PackageInspectionCompleteScreen({
  navigation,
}: PackageInspectionCompleteScreenProps) {
  const {
    inspection,
    workflow,
    updateReinspectedInspection,
    completeReinspection,
  } = useInspectionForm();

  const isReinspectionMode = workflow.reinspection.mode === "package";

  const actions = useHazProActions();
  const [isSaving, setIsSaving] = useState(false);

  // Set active chevron when component mounts
  React.useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  // Get SDDG data from verification copy (source of truth)
  const sddgData = inspection.verificationCopy;

  // Calculate frustration counts
  const sddgFrustrations = inspection.frustrations || [];
  const packageFrustrations = inspection.packageFrustrations || [];
  const totalFrustrations =
    sddgFrustrations.length + packageFrustrations.length;

  // Determine SDDG status
  const sddgStatus = sddgFrustrations.length > 0 ? "frustrated" : "verified";

  // Handle Continue to Form 1015
  const handleContinueToForm1015 = async () => {
    try {
      setIsSaving(true);

      console.log("📦 [PackageInspectionComplete] Continuing to Form 1015");
      console.log("📦 [PackageInspectionComplete] isReinspectionMode:", isReinspectionMode);

      if (isReinspectionMode) {
        // Reinspection mode: Update existing inspection record (like SDDG reinspection does)
        console.log("📦 [PackageInspectionComplete] Reinspection mode - updating existing inspection");

        const result = await updateReinspectedInspection();

        if (!result.success) {
          Alert.alert("Error", result.error || "Failed to update reinspection", [
            { text: "OK" },
          ]);
          return;
        }

        // Clear reinspection mode
        completeReinspection();

        console.log("📦 [PackageInspectionComplete] Reinspection updated successfully, navigating to Form 1015");
      } else {
        console.log(
          "📦 [PackageInspectionComplete] Navigating to Form 1015 (save happens on completion)"
        );
      }

      // Navigate to AMC 1015 Form
      navigation.navigate("InspectorAMC1015Form");
    } catch (error) {
      console.error(
        "📦 [PackageInspectionComplete] Failed to continue to Form 1015:",
        error
      );
      Alert.alert(
        "Error",
        "Failed to proceed to Form 1015. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Package Inspection Complete"
        onClose={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <MaterialIcons name="check-circle" size={48} color={colors.success} />
          <Text style={styles.successTitle}>Package Verified</Text>
          <Text style={styles.successSubtitle}>
            All markings and labels validated with no compliance issues
          </Text>
        </View>

        {/* Inspection Summary Card */}
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
              label: "SDDG STATUS",
              value: (
                <StatusBadge
                  status={sddgStatus}
                  label={
                    sddgStatus === "verified"
                      ? "Verified"
                      : `Frustrated (${sddgFrustrations.length})`
                  }
                />
              ),
            },
            {
              label: "PACKAGE STATUS",
              value: <StatusBadge status="verified" label="Verified" />,
            },
            {
              label: "INSPECTOR",
              value: inspection.inspector.inspectorName,
            },
          ]}
        />

        {/* Additional Info if SDDG has frustrations */}
        {sddgFrustrations.length > 0 && (
          <View style={styles.infoBoxContainer}>
            <InfoBox
              variant="info"
              message={`SDDG has ${sddgFrustrations.length} frustration${
                sddgFrustrations.length !== 1 ? "s" : ""
              }. Package inspection passed with no issues.`}
            />
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <ActionFooter
        buttons={[
          {
            label: "Back",
            onPress: () => navigation.goBack(),
            variant: "secondary",
            icon: "arrow-back",
          },
          {
            label: "Continue to Form 1015",
            onPress: handleContinueToForm1015,
            variant: "primary",
            icon: "arrow-forward",
            iconPosition: "right",
            loading: isSaving,
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
    padding: spacing.md,
    paddingBottom: spacing.xxl,
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
  infoBoxContainer: {
    marginTop: spacing.md,
  },
});
