import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import { useDatabase } from "../../../src/contexts/DataProvider";
import { InspectorShipment } from "../../../src/types/sddg";
import { useHazProStore } from "../../../src/stores/useHazProStore";

interface PackageInspectionCompleteScreenProps {
  navigation: any;
}

export default function PackageInspectionCompleteScreen({
  navigation,
}: PackageInspectionCompleteScreenProps) {
  const { inspection, startNewInspection, completeInspection } =
    useInspectionForm();

  const database = useDatabase();
  const { actions } = useHazProStore();
  const [isSaving, setIsSaving] = useState(false);

  // Set active chevron when component mounts
  React.useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Get SDDG data from verification copy (source of truth)
  const sddgData = inspection.verificationCopy;

  // Calculate frustration counts
  const sddgFrustrations = inspection.frustrations || [];
  const packageFrustrations = inspection.packageFrustrations || [];
  const totalFrustrations =
    sddgFrustrations.length + packageFrustrations.length;

  // Determine SDDG status
  const sddgStatus = sddgFrustrations.length > 0 ? "frustrated" : "verified";

  // Handle Save & Exit
  const handleSaveAndExit = async () => {
    try {
      setIsSaving(true);

      if (!sddgData) {
        Alert.alert("Error", "No SDDG data available to save");
        return;
      }

      // Create InspectorShipment record with full completion status
      const inspectionRecord: InspectorShipment = {
        id: Date.now().toString(),
        status: "completed", // Both SDDG and Package phases complete
        inspectedAt: new Date(),
        inspectionContext: { ...inspection },
        tcn: sddgData.shippersReferenceNumber || "N/A",
        unId: sddgData.unIdNo || "N/A",
        properShippingName: sddgData.properShippingName || "N/A",
        inspector: inspection.inspector,
        sddgStatus: sddgStatus,
        packageStatus: "verified", // Package phase complete with no frustrations
        totalFrustrations: totalFrustrations,
        sddgFrustrations: sddgFrustrations.length,
        packageFrustrations: 0, // Confirmed zero package frustrations
      };

      console.log(
        "📦 [PackageInspectionComplete] Saving completed inspection to database"
      );

      // Save to database
      const id = await database.saveInspection(inspectionRecord);

      console.log(
        "📦 [PackageInspectionComplete] Inspection saved successfully:",
        id
      );

      // Show success message
      Alert.alert(
        "Inspection Saved",
        "Package inspection has been saved successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear provider state
              startNewInspection();
              // Navigate to home screen
              navigation.navigate("InspectorHomeStack", {
                screen: "InspectorHome",
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        "📦 [PackageInspectionComplete] Failed to save inspection:",
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

  // Handle Continue to Form 1015
  const handleContinueToForm1015 = async () => {
    try {
      setIsSaving(true);

      console.log("📦 [PackageInspectionComplete] Continuing to Form 1015");

      // Save inspection to database (but don't clear provider - form needs the data)
      const result = await completeInspection();

      if (!result.success) {
        Alert.alert("Error", result.error || "Failed to save inspection", [
          { text: "OK" },
        ]);
        return;
      }

      console.log(
        "📦 [PackageInspectionComplete] Inspection saved, navigating to Form 1015"
      );

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Package Inspection Complete</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <MaterialIcons name="check-circle" size={48} color="#34C759" />
          <Text style={styles.successTitle}>Package Verified</Text>
          <Text style={styles.successSubtitle}>
            All markings and labels validated with no compliance issues
          </Text>
        </View>

        {/* Inspection Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Inspection Summary</Text>

          {/* TCN - Critical field with accent */}
          <View style={styles.summaryFieldTCN}>
            <Text style={styles.summaryLabel}>
              TRANSPORTATION CONTROL NUMBER
            </Text>
            <Text style={styles.summaryValue}>
              {sddgData?.shippersReferenceNumber || "N/A"}
            </Text>
          </View>

          {/* UN# */}
          <View style={styles.summaryField}>
            <Text style={styles.summaryLabel}>UN/NA/ID NUMBER</Text>
            <Text style={styles.summaryValue}>{sddgData?.unIdNo || "N/A"}</Text>
          </View>

          {/* PSN */}
          <View style={styles.summaryField}>
            <Text style={styles.summaryLabel}>PROPER SHIPPING NAME</Text>
            <Text style={styles.summaryValue}>
              {sddgData?.properShippingName || "N/A"}
            </Text>
          </View>

          {/* SDDG Status */}
          <View style={styles.summaryField}>
            <Text style={styles.summaryLabel}>SDDG STATUS</Text>
            <View style={styles.statusRow}>
              <MaterialIcons
                name={sddgStatus === "verified" ? "check-circle" : "error"}
                size={18}
                color={sddgStatus === "verified" ? "#34C759" : "#FF9500"}
              />
              <Text
                style={[
                  styles.summaryValue,
                  { marginLeft: 8 },
                  sddgStatus === "verified"
                    ? styles.statusVerified
                    : styles.statusFrustrated,
                ]}
              >
                {sddgStatus === "verified"
                  ? "Verified"
                  : `Frustrated (${sddgFrustrations.length})`}
              </Text>
            </View>
          </View>

          {/* Package Status */}
          <View style={styles.summaryField}>
            <Text style={styles.summaryLabel}>PACKAGE STATUS</Text>
            <View style={styles.statusRow}>
              <MaterialIcons name="check-circle" size={18} color="#34C759" />
              <Text
                style={[
                  styles.summaryValue,
                  styles.statusVerified,
                  { marginLeft: 8 },
                ]}
              >
                Verified
              </Text>
            </View>
          </View>

          {/* Inspector */}
          <View style={styles.summaryFieldLast}>
            <Text style={styles.summaryLabel}>INSPECTOR</Text>
            <Text style={styles.summaryValue}>
              {inspection.inspector.inspectorName}
            </Text>
          </View>
        </View>

        {/* Additional Info if SDDG has frustrations */}
        {sddgFrustrations.length > 0 && (
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              SDDG has {sddgFrustrations.length} frustration
              {sddgFrustrations.length !== 1 ? "s" : ""}. Package inspection
              passed with no issues.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveAndExit}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color="#007AFF" />
              <Text style={styles.saveButtonText}>Save & Exit</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueToForm1015}
          disabled={isSaving}
        >
          <Text style={styles.continueButtonText}>Continue to Form 1015</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 24,
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    gap: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34C759",
  },
  successSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  summaryFieldTCN: {
    paddingVertical: 12,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  summaryField: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  summaryFieldLast: {
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusVerified: {
    color: "#34C759",
  },
  statusFrustrated: {
    color: "#FF9500",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1D1F",
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
