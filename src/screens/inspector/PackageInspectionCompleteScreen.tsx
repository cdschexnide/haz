import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProActions } from "../../stores/useHazProStore";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import {
  ScreenHeader,
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
    workflow,
    updateReinspectedInspection,
    completeReinspection,
  } = useInspectionForm();

  const isReinspectionMode = workflow.reinspection.mode === "package";

  const actions = useHazProActions();
  const [isSaving, setIsSaving] = useState(false);

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

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

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroIconContainer}>
            <MaterialIcons name="check-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.heroTitle}>Package Verified</Text>
          <Text style={styles.heroSubtitle}>
            Inspection complete
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, isSaving && styles.ctaButtonDisabled]}
          onPress={handleContinueToForm1015}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Text style={styles.ctaButtonText}>Continue to Form 1015</Text>
              <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
            </>
          )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
