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
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useDatabase } from "@/contexts/DataProvider";
import { InspectorShipment } from "@/types/sddg";
import { useHazProStore } from "@/stores/useHazProStore";

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
  const { actions } = useHazProStore();
  const [isSaving, setIsSaving] = useState(false);

  // Set active chevron when component mounts
  React.useEffect(() => {
    actions.setCurrentChevron("sddg");
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
      navigation.navigate("InspectorPackageVerification");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SDDG Inspection Complete</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Success Header - Compact */}
        <View style={styles.successHeader}>
          <MaterialIcons name="check-circle" size={48} color="#34C759" />
          <Text style={styles.successTitle}>SDDG Verified</Text>
          <Text style={styles.successSubtitle}>
            All fields validated with no compliance issues
          </Text>
        </View>

        {/* SDDG Summary Card - Professional Vertical Stack */}
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

          {/* Class */}
          <View style={styles.summaryField}>
            <Text style={styles.summaryLabel}>HAZARD CLASS</Text>
            <Text style={styles.summaryValue}>
              {sddgData?.hazardClass || "N/A"}
            </Text>
          </View>

          {/* Inspector */}
          <View style={styles.summaryFieldLast}>
            <Text style={styles.summaryLabel}>INSPECTOR</Text>
            <Text style={styles.summaryValue}>
              {inspection.inspector.inspectorName || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

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
          onPress={handleContinueToPackage}
          disabled={isSaving}
        >
          <Text style={styles.continueButtonText}>Continue to Package</Text>
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
    padding: 12,
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
  backButton: {
    flex: 0.8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 4,
  },
  backButtonText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
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
