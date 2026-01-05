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

  // Determine allowable packing groups based on extracted SDDG data
  const allowablePackingGroups = useCallback(() => {
    const hazardClass = inspection.extractedContent?.hazardClass || "";
    const packingGroup = inspection.extractedContent?.packingGroup || "";
    const packingInstruction =
      inspection.extractedContent?.packingInstruction || "";

    if (hazardClass.startsWith("1")) {
      return ["X", "Y"];
    } else if (packingInstruction === "A7.12.") {
      return ["X", "Y"];
    } else if (hazardClass.startsWith("4") && packingGroup === "III") {
      return ["X", "Y"];
    } else if (
      packingInstruction &&
      hazardClass4ParagraphsWithNoPackingGroup.includes(packingInstruction)
    ) {
      return ["X", "Y"];
    } else if (
      packingInstruction &&
      packagingParagraphValuesThatRequirePGIPackaging.includes(packingInstruction)
    ) {
      return ["X"];
    } else if (packingGroup === "I") {
      return ["X"];
    } else if (packingGroup === "II") {
      return ["X", "Y"];
    } else if (packingGroup === "III") {
      return ["X", "Y", "Z"];
    }

    return ["X", "Y", "Z"];
  }, [inspection.extractedContent]);

  // Validate Field B (Packaging Code)
  const validateFieldB = useCallback(
    (value: string) => {
      const packagingParagraph = inspection.extractedContent?.packingInstruction;

      if (!packagingParagraph || value.trim() === "") {
        setFieldBError(null);
        setFieldBStatus("valid");
        return;
      }

      const result = validatePackagingCodeV2(
        packagingDatabaseV2,
        packagingParagraph,
        value,
        undefined
      );

      if (!result?.isValid) {
        setFieldBError(
          `Packaging code '${value}' not authorized for ${packagingParagraph}`
        );
        setFieldBStatus("invalid");
      } else {
        setFieldBError(null);
        setFieldBStatus("valid");
      }
    },
    [inspection.extractedContent?.packingInstruction]
  );

  // Validate Field C (Packing Group)
  const validateFieldC = useCallback(
    (value: string) => {
      const allowedGroups = allowablePackingGroups();

      if (!value || value.trim() === "") {
        setFieldCError("Packing group is required");
        setFieldCStatus("invalid");
        return;
      }

      if (!allowedGroups.includes(value)) {
        setFieldCError(
          `Packing group '${value}' insufficient. Required: ${allowedGroups.join(" or ")}`
        );
        setFieldCStatus("invalid");
      } else {
        setFieldCError(null);
        setFieldCStatus("valid");
      }
    },
    [allowablePackingGroups]
  );

  // Run initial validation on mount
  useEffect(() => {
    validateFieldB(fields.B);
    validateFieldC(fields.C);
  }, []);

  // Re-validate on field change
  useEffect(() => {
    validateFieldB(fields.B);
  }, [fields.B, validateFieldB]);

  useEffect(() => {
    validateFieldC(fields.C);
  }, [fields.C, validateFieldC]);

  // Handle Field B frustration
  const handleFieldBFrustration = () => {
    const packagingParagraph = inspection.extractedContent?.packingInstruction || "unknown";
    addPackageFrustration({
      category: "marking",
      itemId: "pop-field-b-validation",
      itemLabel: "Packaging Code (Field B)",
      expectedValues: ["Valid packaging code for " + packagingParagraph],
      verificationStatus: "incorrect",
      defaultMessage: `Packaging code '${fields.B}' not authorized for ${packagingParagraph}`,
      afmanReference: "AFMAN 24-604 A14.2",
    });
    setFieldBStatus("frustrated");
  };

  // Handle Field C frustration
  const handleFieldCFrustration = () => {
    const allowedGroups = allowablePackingGroups();
    addPackageFrustration({
      category: "marking",
      itemId: "pop-field-c-validation",
      itemLabel: "Packing Group (Field C)",
      expectedValues: allowedGroups,
      verificationStatus: "incorrect",
      defaultMessage: `Packing group '${fields.C}' insufficient. Required: ${allowedGroups.join(" or ")}`,
      afmanReference: "AFMAN 24-604 A14.2",
    });
    setFieldCStatus("frustrated");
  };

  // Check if can continue (all fields valid or frustrated)
  const canContinue =
    (fieldBStatus === "valid" || fieldBStatus === "frustrated") &&
    (fieldCStatus === "valid" || fieldCStatus === "frustrated");

  // Navigate to next screen
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>UN Specification Marking Validation</Text>

        {/* POP Marking Display */}
        <View style={styles.popDisplaySection}>
          <Text style={styles.sectionTitle}>Detected Marking</Text>
          <View style={styles.popRow}>
            {physicalState === PhysicalState.LIQUID ? (
              <LiquidPopMarking
                B={fields.B}
                C={fields.C}
                D={fields.D}
                E={fields.E}
                F={fields.F}
                G={fields.G}
                H={fields.H}
              />
            ) : (
              <SolidPopMarking
                B={fields.B}
                C={fields.C}
                D={fields.D}
                E="S"
                F={fields.F}
                G={fields.G}
                H={fields.H}
              />
            )}
          </View>
          <Text style={styles.confidenceText}>
            Detection Confidence: {((bestPopMarking?.confidence || 0) * 100).toFixed(0)}%
          </Text>
        </View>

        {/* Validation Section */}
        <View style={styles.validationSection}>
          <Text style={styles.sectionTitle}>Compliance Validation</Text>

          {/* Field B: Packaging Code */}
          <View style={styles.validationCard}>
            <View style={styles.validationHeader}>
              <Text style={styles.fieldLabel}>Field B: Packaging Code</Text>
              {fieldBStatus === "valid" && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}
              {fieldBStatus === "invalid" && (
                <MaterialIcons name="cancel" size={24} color="#F44336" />
              )}
              {fieldBStatus === "frustrated" && (
                <MaterialIcons name="warning" size={24} color="#FF9800" />
              )}
            </View>

            <TextInput
              style={[
                styles.input,
                fieldBStatus === "invalid" && styles.inputError,
                fieldBStatus === "frustrated" && styles.inputFrustrated,
              ]}
              value={fields.B}
              onChangeText={(text) => updateField("B", text.toUpperCase())}
              placeholder="e.g., 4G, 1A1"
              editable={fieldBStatus !== "frustrated"}
            />

            {fieldBStatus === "valid" && (
              <Text style={styles.validText}>
                Authorized for {inspection.extractedContent?.packingInstruction || "this material"}
              </Text>
            )}

            {fieldBStatus === "invalid" && fieldBError && (
              <>
                <Text style={styles.errorText}>{fieldBError}</Text>
                <TouchableOpacity
                  style={styles.frustrationButton}
                  onPress={handleFieldBFrustration}
                >
                  <MaterialIcons name="report-problem" size={18} color="#fff" />
                  <Text style={styles.frustrationButtonText}>
                    Create Frustration
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {fieldBStatus === "frustrated" && (
              <Text style={styles.frustratedText}>
                Frustration created for this field
              </Text>
            )}
          </View>

          {/* Field C: Packing Group */}
          <View style={styles.validationCard}>
            <View style={styles.validationHeader}>
              <Text style={styles.fieldLabel}>Field C: Packing Group</Text>
              {fieldCStatus === "valid" && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}
              {fieldCStatus === "invalid" && (
                <MaterialIcons name="cancel" size={24} color="#F44336" />
              )}
              {fieldCStatus === "frustrated" && (
                <MaterialIcons name="warning" size={24} color="#FF9800" />
              )}
            </View>

            <ButtonGroup
              buttons={allowablePackingGroups()}
              selectedIndex={allowablePackingGroups().indexOf(fields.C)}
              onPress={(selectedIndex) => {
                if (fieldCStatus !== "frustrated") {
                  const selectedValue = allowablePackingGroups()[selectedIndex];
                  updateField("C", selectedValue);
                }
              }}
              containerStyle={[
                styles.buttonGroupContainer,
                fieldCStatus === "invalid" && styles.buttonGroupError,
                fieldCStatus === "frustrated" && styles.buttonGroupFrustrated,
              ]}
              selectedButtonStyle={styles.selectedButton}
              textStyle={styles.buttonGroupText}
              disabled={fieldCStatus === "frustrated"}
            />

            <Text style={styles.allowedText}>
              Allowed: {allowablePackingGroups().join(", ")}
            </Text>

            {fieldCStatus === "valid" && (
              <Text style={styles.validText}>
                Meets requirement for PG {inspection.extractedContent?.packingGroup || "material"}
              </Text>
            )}

            {fieldCStatus === "invalid" && fieldCError && (
              <>
                <Text style={styles.errorText}>{fieldCError}</Text>
                <TouchableOpacity
                  style={styles.frustrationButton}
                  onPress={handleFieldCFrustration}
                >
                  <MaterialIcons name="report-problem" size={18} color="#fff" />
                  <Text style={styles.frustrationButtonText}>
                    Create Frustration
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {fieldCStatus === "frustrated" && (
              <Text style={styles.frustratedText}>
                Frustration created for this field
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
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
          style={[styles.continueButton, !canContinue && styles.disabledButton]}
          onPress={navigateToNextScreen}
          disabled={!canContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  popDisplaySection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 12,
  },
  popRow: {
    marginVertical: 8,
  },
  confidenceText: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
  validationSection: {
    marginBottom: 16,
  },
  validationCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  validationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  inputFrustrated: {
    borderColor: "#FF9800",
    backgroundColor: "#FFF3E0",
  },
  validText: {
    fontSize: 13,
    color: "#4CAF50",
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#F44336",
    marginTop: 8,
  },
  frustrationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F57C00",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  frustrationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustratedText: {
    fontSize: 13,
    color: "#FF9800",
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonGroupContainer: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 4,
  },
  buttonGroupError: {
    borderColor: "#F44336",
  },
  buttonGroupFrustrated: {
    borderColor: "#FF9800",
    opacity: 0.7,
  },
  selectedButton: {
    backgroundColor: colors.blue,
  },
  buttonGroupText: {
    fontSize: 14,
  },
  allowedText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
