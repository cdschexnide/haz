import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProStore } from "../../stores/useHazProStore";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";
import { validatePackagingCodeV2 } from "../../utils/packagingWizardV2Helpers";
import { hazardousMaterialsList } from "../../hazardousMaterials/hazardousMaterialsList";
import { PhysicalState } from "../../../types";
import SolidPopMarking from "../SolidPopMarking";
import LiquidPopMarking from "../LiquidPopMarking";
import colors from "../../theming/colors";

const hazardClass4ParagraphsWithNoPackingGroup = ["A8.6.", "A8.7.", "A8.8."];
const packagingParagraphValuesThatRequirePGIPackaging = ["A12.9.", "A12.11."];

const InspectorPOPMarkingValidationScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const {
    inspection,
    updatePackagePopField,
    setPackagePopMarking,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionForm();

  const { actions } = useHazProStore();

  // Get ML-detected POP marking
  const bestPopMarking = inspection.mlAnalysisResults?.bestPopMarking;
  const hasDetectedPOP = bestPopMarking !== null && bestPopMarking !== undefined;

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  if (!hasDetectedPOP) {
    return <NotDetectedState navigation={navigation} />;
  }

  return <DetectedState navigation={navigation} />;
};

// Placeholder components - will be implemented in subsequent tasks
const NotDetectedState = ({ navigation }: { navigation: any }) => {
  const { addPackageFrustration, inspection } = useInspectionForm();
  const [hasFrustrated, setHasFrustrated] = useState(false);

  const handleEnterManually = () => {
    navigation.navigate("InspectorPOPMarkingDataEntry");
  };

  const handleMarkAsMissing = () => {
    addPackageFrustration({
      category: "marking",
      itemId: "pop-marking-missing",
      itemLabel: "UN Specification Marking",
      expectedValues: ["UN specification marking present"],
      verificationStatus: "missing",
      defaultMessage:
        "Required UN specification packaging marking not found on package",
      afmanReference: "AFMAN 24-604 A14.2",
    });
    setHasFrustrated(true);
  };

  const navigateToNextScreen = () => {
    const unIdNo = inspection.extractedContent?.unIdNo || "";

    if (unIdNo === "UN1845") {
      navigation.navigate("InspectorDryIceScreen");
    } else if (unIdNo === "UN2807") {
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (unIdNo === "UN3072" || unIdNo === "UN2990") {
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (unIdNo === "UN3245") {
      navigation.navigate("InspectorGeneticallyModifiedOrganismsScreen");
    } else if (unIdNo === "UN3268") {
      navigation.navigate("InspectorSafetyDevicesScreen");
    } else if (unIdNo === "UN3508") {
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (unIdNo === "UN3528" || unIdNo === "UN3529") {
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (unIdNo === "UN3316") {
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (unIdNo === "UN3363") {
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (unIdNo === "UN3171") {
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (unIdNo === "UN3480" || unIdNo === "UN3090") {
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else {
      navigation.navigate("InspectorPackageVerification");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>UN Specification Marking Validation</Text>

        <View style={styles.warningCard}>
          <MaterialIcons name="warning" size={48} color="#F57C00" />
          <Text style={styles.warningTitle}>No POP Marking Detected</Text>
          <Text style={styles.warningText}>
            The ML/OCR analysis did not find a UN specification packaging
            marking on the package images.
          </Text>
          <Text style={styles.warningText}>
            Per AFMAN 24-604 A14.2, UN specification markings are mandatory for
            all hazmat packages unless exempted.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleEnterManually}
        >
          <MaterialIcons name="edit" size={24} color={colors.blue} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Enter Manually</Text>
            <Text style={styles.optionDescription}>
              Navigate to manual POP marking entry
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            hasFrustrated && styles.optionButtonFrustrated,
          ]}
          onPress={handleMarkAsMissing}
          disabled={hasFrustrated}
        >
          <MaterialIcons
            name={hasFrustrated ? "check-circle" : "report-problem"}
            size={24}
            color={hasFrustrated ? "#4CAF50" : "#F57C00"}
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              {hasFrustrated ? "Marked as Missing" : "Mark as Missing (Frustration)"}
            </Text>
            <Text style={styles.optionDescription}>
              Package lacks required UN marking
            </Text>
          </View>
          {!hasFrustrated && (
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => {
            Alert.alert("Save Progress", "Inspection progress saved.", [
              { text: "OK" },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !hasFrustrated && styles.disabledButton,
          ]}
          onPress={navigateToNextScreen}
          disabled={!hasFrustrated}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const DetectedState = ({ navigation }: { navigation: any }) => {
  const {
    inspection,
    updatePackagePopField,
    setPackagePopMarking,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionForm();

  const bestPopMarking = inspection.mlAnalysisResults?.bestPopMarking;

  // Detect physical state from extracted SDDG content
  const detectPhysicalState = (): PhysicalState => {
    const hazardousMaterial = hazardousMaterialsList.find(
      (material) => material.unid === inspection.extractedContent?.unIdNo
    );
    const psn = hazardousMaterial?.properShippingName?.toLowerCase() || "";
    const hazClass = hazardousMaterial?.hazclassDiv?.toLowerCase() || "";

    if (
      psn.includes("solid") ||
      psn.includes("powder") ||
      psn.includes("granules") ||
      psn.includes("flakes") ||
      hazClass === "4.1" ||
      hazClass === "4.2" ||
      hazClass === "4.3"
    ) {
      return PhysicalState.SOLID;
    }

    if (hazClass.startsWith("2.")) {
      return PhysicalState.SOLID;
    }

    if (
      hazClass === "3" ||
      psn.includes("liquid") ||
      psn.includes("solution")
    ) {
      return PhysicalState.LIQUID;
    }

    return PhysicalState.SOLID;
  };

  const physicalState = detectPhysicalState();

  // Initialize editable fields from ML-detected values
  const [fields, setFields] = useState({
    B: bestPopMarking?.fields?.B || "",
    C: bestPopMarking?.fields?.C || "",
    D: bestPopMarking?.fields?.D || "",
    E: bestPopMarking?.fields?.E || (physicalState === PhysicalState.SOLID ? "S" : ""),
    F: bestPopMarking?.fields?.F || "",
    G: bestPopMarking?.fields?.G || "",
    H: bestPopMarking?.fields?.H || "",
  });

  // Validation states: 'valid' | 'invalid' | 'frustrated'
  const [fieldBStatus, setFieldBStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
  const [fieldCStatus, setFieldCStatus] = useState<"valid" | "invalid" | "frustrated">("valid");

  // Error messages
  const [fieldBError, setFieldBError] = useState<string | null>(null);
  const [fieldCError, setFieldCError] = useState<string | null>(null);

  // Initialize package pop marking in context
  useEffect(() => {
    if (bestPopMarking?.fields) {
      setPackagePopMarking({
        B: bestPopMarking.fields.B || "",
        C: bestPopMarking.fields.C || "",
        D: bestPopMarking.fields.D || "",
        E: bestPopMarking.fields.E || (physicalState === PhysicalState.SOLID ? "S" : ""),
        F: bestPopMarking.fields.F || "",
        G: bestPopMarking.fields.G || "",
        H: bestPopMarking.fields.H || "",
      });
    }
  }, []);

  const updateField = (key: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    updatePackagePopField(key, value);
  };

  // Placeholder for validation - will be implemented in next task
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UN Specification Marking Validation</Text>
      <Text>Fields initialized: B={fields.B}, C={fields.C}</Text>
      <Text>Physical State: {physicalState}</Text>
    </View>
  );
};

export default InspectorPOPMarkingValidationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#212529",
  },
  warningCard: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFB74D",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E65100",
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonFrustrated: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  optionDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
