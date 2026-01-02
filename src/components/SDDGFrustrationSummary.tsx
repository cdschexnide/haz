import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { FrustrationRecord } from "@/types/sddg";
import { useHazProStore } from "@/stores/useHazProStore";

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
  } = useInspectionForm();
  const { actions } = useHazProStore();

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

      // Navigate to ML Detection Screen for label detection
      // The ML screen will handle routing to package verification or specialized screens
      // based on UN number after detection is complete
      const unIdNo =
        inspection?.extractedContent?.unIdNo ||
        inspection?.verificationCopy?.unIdNo;
      console.log("LOGGING UN# -> ", unIdNo);
      console.log("Navigating to MLDetectionScreen for label detection");

      navigation.navigate("MLDetectionScreen", { unIdNo });
    }
  };

  const renderFrustrationCard = (
    frustration: FrustrationRecord,
    index: number
  ) => (
    <View key={`${frustration.key}-${index}`} style={styles.frustrationCard}>
      <View style={styles.frustrationHeader}>
        <MaterialIcons name="error" size={24} color="#FF3B30" />
        <Text style={styles.frustrationFieldLabel}>
          {frustration.fieldLabel}
        </Text>
      </View>

      <View style={styles.frustrationDetails}>
        <View style={styles.valueComparisonContainer}>
          <View style={styles.detailRow}>
            <MaterialIcons name="close" size={16} color="#FF3B30" />
            <Text style={styles.detailLabel}>Incorrect Value:</Text>
            <Text style={[styles.detailValue, styles.incorrectValueText]}>
              {frustration.fieldValue || "No data"}
            </Text>
          </View>

          {frustration.correctValue && (
            <View style={[styles.detailRow, styles.correctValueRow]}>
              <MaterialIcons name="check" size={16} color="#34C759" />
              <Text style={styles.detailLabel}>Should be:</Text>
              <Text style={[styles.detailValue, styles.correctValueText]}>
                {frustration.correctValue}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date/Time:</Text>
          <Text style={styles.detailValue}>
            {formatDate(frustration.frustrationDate)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Inspector:</Text>
          <Text style={styles.detailValue}>
            {typeof inspection.inspector === "string"
              ? inspection.inspector
              : `${inspection.inspector.inspectorName.trim()}, ${inspection.inspector.inspectorTitle.trim()}`}
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

  return (
    <View style={styles.container}>
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
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reinspectionButton}
          onPress={handleReinspectFrustrations}
        >
          <MaterialIcons name="refresh" size={20} color="#007AFF" />
          <Text style={styles.reinspectionButtonText}>
            Reinspect Frustrations
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
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
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    minWidth: 90,
  },
  detailValue: {
    fontSize: 14,
    color: "#1D1D1F",
    flex: 1,
  },
  valueComparisonContainer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
  },
  incorrectValueText: {
    fontWeight: "600",
    color: "#FF3B30",
    textDecorationLine: "line-through",
  },
  correctValueRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  correctValueText: {
    fontWeight: "700",
    color: "#34C759",
    fontSize: 15,
  },
  messageContainer: {
    marginTop: 8,
  },
  frustrationMessage: {
    fontSize: 14,
    color: "#1D1D1F",
    marginTop: 4,
    lineHeight: 20,
    backgroundColor: "#FFF5F5",
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
