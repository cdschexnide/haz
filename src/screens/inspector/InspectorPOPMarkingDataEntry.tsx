import { countries } from "../../../src/mock/countries";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";
import {
  useInspectionFormActions,
  useExtractedContent,
  useMLAnalysisResults,
  usePackagePopMarking,
  useInspectionFrustrations,
  useReinspectionState,
} from "../../../src/contexts/InspectionFormProvider";
import colors from "../../../src/theming/colors";
import { PhysicalState } from "../../../types";
import { validatePackagingCodeV2 } from "../../../src/utils/packagingWizardV2Helpers";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  Dimensions,
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
import { TextInput as PaperInput } from "react-native-paper";
import LiquidPopMarking from "../LiquidPopMarking";
import SolidPopMarking from "../SolidPopMarking";
import { hazardousMaterialsList } from "../../../src/hazardousMaterials/hazardousMaterialsList";
import { useHazProActions } from "../../../src/stores/useHazProStore";
import { DevBenchmarkButton } from "../dev/DevBenchmarkButton";

const { width } = Dimensions.get("window");
const screenWidth = width;

const hazardClass4ParagraphsWithNoPackingGroup = ["A8.6.", "A8.7.", "A8.8."];
const packagingParagraphValuesThatRequirePGIPackaging = ["A12.9.", "A12.11."];

const InspectorPOPMarkingDataEntry = ({ navigation }: { navigation: any }) => {
  // Selector hooks for specific data
  const extractedContent = useExtractedContent();
  const mlAnalysisResults = useMLAnalysisResults();
  const packagePopMarking = usePackagePopMarking();
  const { packageFrustrations } = useInspectionFrustrations();
  const reinspection = useReinspectionState();

  // Actions-only hook
  const {
    updatePackagePopField,
    resetPackagePopMarking,
    setPackagePopMarking,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionFormActions();

  const actions = useHazProActions();

  const [hasSelectedCountry, setHasSelectedCountry] = useState<boolean>(false);
  const [yearError, setYearError] = useState<string | null>(null);

  // Detect physical state from extracted SDDG content
  const detectPhysicalState = (): PhysicalState => {
    const hazardousMaterial = hazardousMaterialsList.find(
      material => material.unid === extractedContent?.unIdNo
    );
    const psn = hazardousMaterial?.properShippingName?.toLowerCase() || "";
    const hazClass = hazardousMaterial?.hazclassDiv?.toLowerCase() || "";

    // Check for definitive solids
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

    // Check for gases
    if (hazClass.startsWith("2.")) {
      return PhysicalState.SOLID; // Use solid format for gases
    }

    // Check for liquids
    if (
      hazClass === "3" ||
      psn.includes("liquid") ||
      psn.includes("solution")
    ) {
      return PhysicalState.LIQUID;
    }

    // Default to solid
    return PhysicalState.SOLID;
  };

  const physicalState = detectPhysicalState();

  // Get ML-detected POP marking fields (if available)
  const mlPopFields = mlAnalysisResults?.bestPopMarking?.fields;

  const [fields, setFields] = useState({
    B: packagePopMarking?.B || mlPopFields?.B || "",
    C: packagePopMarking?.C || mlPopFields?.C || "",
    D: packagePopMarking?.D || mlPopFields?.D || "",
    E: packagePopMarking?.E || mlPopFields?.E || "",
    F: packagePopMarking?.F || mlPopFields?.F || "",
    G: packagePopMarking?.G || mlPopFields?.G || "",
    H: packagePopMarking?.H || mlPopFields?.H || "",
  });

  // Validation state for Field B and Field C
  const [fieldBStatus, setFieldBStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
  const [fieldCStatus, setFieldCStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
  const [fieldBError, setFieldBError] = useState<string | null>(null);
  const [fieldCError, setFieldCError] = useState<string | null>(null);

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  // Initialize package pop marking in context if it doesn't exist
  // Pre-populate with ML-detected values if available
  useEffect(() => {
    if (!packagePopMarking) {
      const mlFields = mlAnalysisResults?.bestPopMarking?.fields;
      setPackagePopMarking({
        B: mlFields?.B || "",
        C: mlFields?.C || "",
        D: mlFields?.D || "",
        E: mlFields?.E || (physicalState === PhysicalState.SOLID ? "S" : ""),
        F: mlFields?.F || "",
        G: mlFields?.G || "",
        H: mlFields?.H || "",
      });
    }
  }, []);

  // Handle back navigation - reset POP marking data
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
        const isGoingBack =
          e.data.action.type === "GO_BACK" || e.data.action.type === "POP";

        if (isGoingBack) {
          resetPackagePopMarking();
        }
      });

      return unsubscribe;
    }, [navigation, resetPackagePopMarking])
  );

  useEffect(() => {
    if (packagePopMarking?.G !== "") {
      setHasSelectedCountry(true);
    }
  }, []);

  // Auto-set Field E for solids
  useEffect(() => {
    if (physicalState === PhysicalState.SOLID && !fields.E) {
      updateField("E", "S");
      updatePackagePopField("E", "S");
    }
  }, [physicalState]);

  // Auto-select packing group if only one option is available
  useEffect(() => {
    const groups = allowablePackingGroups();
    if (groups && groups.length === 1 && !fields.C) {
      const selectedValue = groups[0];
      updateField("C", selectedValue);
      updatePackagePopField("C", selectedValue);
    }
  }, [
    extractedContent?.hazardClass,
    extractedContent?.packingGroup,
    extractedContent?.packingInstruction,
    fields.C,
  ]);

  // Determine allowable packing groups based on extracted SDDG data
  const allowablePackingGroups = () => {
    const hazardClass = extractedContent?.hazardClass || "";
    const packingGroup = extractedContent?.packingGroup || "";
    const packingInstruction =
      extractedContent?.packingInstruction || "";

    // Hazard Class 1 (Explosives)
    if (hazardClass.startsWith("1")) {
      return ["X", "Y"];
    }
    // Special packaging paragraph A7.12
    else if (packingInstruction === "A7.12.") {
      return ["X", "Y"];
    }
    // Hazard Class 4 with Packing Group III
    else if (hazardClass.startsWith("4") && packingGroup === "III") {
      return ["X", "Y"];
    }
    // Hazard Class 4 paragraphs with no packing group
    else if (
      packingInstruction &&
      hazardClass4ParagraphsWithNoPackingGroup.includes(packingInstruction)
    ) {
      return ["X", "Y"];
    }
    // Paragraphs that require PG I packaging
    else if (
      packingInstruction &&
      packagingParagraphValuesThatRequirePGIPackaging.includes(
        packingInstruction
      )
    ) {
      return ["X"];
    } else if (packingGroup === "I") {
      return ["X"];
    } else if (packingGroup === "II") {
      return ["X", "Y"];
    } else if (packingGroup === "III") {
      return ["X", "Y", "Z"];
    }

    // Default: allow all packing groups
    return ["X", "Y", "Z"];
  };

  // Validate Field B (packaging code)
  const validateFieldB = useCallback((value: string) => {
    const packagingParagraph = extractedContent?.packingInstruction;

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
      setFieldBError(`Packaging code '${value}' not authorized for ${packagingParagraph}`);
      setFieldBStatus("invalid");
    } else {
      setFieldBError(null);
      setFieldBStatus("valid");
    }
  }, [extractedContent?.packingInstruction]);

  // Validate Field C (packing group)
  const validateFieldC = useCallback((value: string) => {
    const allowedGroups = allowablePackingGroups();

    if (!value || value.trim() === "") {
      setFieldCError("Packing group is required");
      setFieldCStatus("invalid");
      return;
    }

    if (!allowedGroups.includes(value)) {
      setFieldCError(`Packing group '${value}' insufficient. Required: ${allowedGroups.join(" or ")}`);
      setFieldCStatus("invalid");
    } else {
      setFieldCError(null);
      setFieldCStatus("valid");
    }
  }, [allowablePackingGroups]);

  // Run Field B validation on mount and field change
  useEffect(() => {
    validateFieldB(fields.B);
  }, [fields.B, validateFieldB]);

  // Run Field C validation on mount and field change
  useEffect(() => {
    validateFieldC(fields.C);
  }, [fields.C, validateFieldC]);

  const updateField = (key: keyof typeof fields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const validateYearField = (yearValue: string) => {
    if (yearValue.length !== 2) {
      setYearError(null);
      return;
    }

    const currentYear = new Date().getFullYear();
    const currentYearLastTwoDigits = currentYear % 100;
    const enteredYear = parseInt(yearValue, 10);

    if (isNaN(enteredYear)) {
      setYearError("Invalid year format");
      return;
    }

    if (enteredYear > currentYearLastTwoDigits) {
      setYearError(
        `Year cannot be after ${currentYear}. Enter ${String(
          currentYearLastTwoDigits
        ).padStart(2, "0")} or earlier.`
      );
    } else {
      setYearError(null);
    }
  };

  const isFormValid =
    /^[a-zA-Z0-9]{2,4}$/.test(fields.B) &&
    /^[XYZ]$/.test(fields.C) &&
    /^\d+(\.\d+)?$/.test(fields.D) &&
    /^\d{2}$/.test(fields.F) &&
    /^[A-Z]+$/.test(fields.G) &&
    /^[A-Z]+$/.test(fields.H) &&
    !fieldBError &&
    !yearError;

  const explanations = {
    B: "Packaging code for outer packaging",
    C: "Packing Group",
    D:
      physicalState === PhysicalState.LIQUID
        ? "Relative Density"
        : "Maximum Gross Mass (In Kilograms)",
    E: "Test Pressure (In kiloPascals)",
    F: "Year of manufacture (last 2 digits)",
    G: "State (Country) Authorizing Mark",
    H: "Symbol of Manufacturer/Certifier",
  };

  const handleContinue = () => {
    console.log("📝 [InspectorPOPMarkingDataEntry] Continue button pressed");

    // Detect reinspection mode
    const isReinspection = reinspection.mode === "package";

    if (isReinspection) {
      // REINSPECTION MODE

      // Check if there are frustrated marking/label items (excluding POP)
      const markingLabelFrustrations = packageFrustrations.filter(
        f => (f.category === "marking" || f.category === "label") &&
             !f.itemId.startsWith("pop-")
      );

      console.log("📝 [InspectorPOPMarkingDataEntry] Reinspection mode:", {
        markingLabelFrustrationsCount: markingLabelFrustrations.length,
      });

      if (markingLabelFrustrations.length > 0) {
        // Navigate to markings/labels for reinspection
        console.log("📝 Reinspection: Navigating to InspectorMarkingsLabelsValidationScreen");
        navigation.navigate("InspectorMarkingsLabelsValidationScreen");
      } else {
        // No more frustrated items - inspection complete
        console.log("📝 Reinspection: No more frustrations, navigating to PackageInspectionCompleteScreen");
        navigation.navigate("PackageInspectionCompleteScreen");
      }
    } else {
      // FIRST INSPECTION MODE

      // Always navigate to markings/labels validation
      console.log("📝 First inspection: Navigating to InspectorMarkingsLabelsValidationScreen");
      navigation.navigate("InspectorMarkingsLabelsValidationScreen");
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
        <Text style={styles.title}>Packing Container Data Entry</Text>

        <View style={styles.previewSection}>
          <View style={styles.popRow}>
            {physicalState === PhysicalState.LIQUID && (
              <LiquidPopMarking
                B={fields.B}
                C={fields.C}
                D={fields.D}
                E={fields.E}
                F={fields.F}
                G={fields.G}
                H={fields.H}
              />
            )}
            {physicalState === PhysicalState.SOLID && (
              <SolidPopMarking
                B={fields.B}
                C={fields.C}
                D={fields.D}
                E={"S"}
                F={fields.F}
                G={fields.G}
                H={fields.H}
              />
            )}
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.columnsWrapper}>
            <View style={styles.column}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    fieldBStatus === "invalid" && styles.inputError,
                    fieldBStatus === "frustrated" && styles.inputFrustrated,
                  ]}
                  placeholder="Field B"
                  value={fields.B}
                  onChangeText={text => {
                    updateField("B", text);
                    updatePackagePopField("B", text);
                  }}
                  editable={fieldBStatus !== "frustrated"}
                  accessibilityHint={
                    fieldBError ||
                    "Enter packaging code for outer packaging"
                  }
                />
                <Text style={styles.explanation}>
                  {explanations.B}
                  <Text style={styles.fieldId}> (Field B)</Text>
                </Text>
                {fieldBError && fieldBStatus === "invalid" && (
                  <Text style={styles.errorText}>{fieldBError}</Text>
                )}
                {fieldBStatus === "invalid" && (
                  <TouchableOpacity
                    style={styles.frustrationButton}
                    onPress={() => {
                      addPackageFrustration({
                        category: "marking",
                        itemId: "pop-field-b",
                        itemLabel: "Packaging Code (Field B)",
                        expectedValues: [extractedContent?.packingInstruction || "valid packaging code"],
                        verificationStatus: "incorrect",
                        defaultMessage: fieldBError || "Packaging code validation failed",
                        afmanReference: "AFMAN 24-604 A11.3.2",
                      });
                      setFieldBStatus("frustrated");
                    }}
                  >
                    <MaterialIcons name="report-problem" size={18} color="#fff" />
                    <Text style={styles.frustrationButtonText}>Create Frustration</Text>
                  </TouchableOpacity>
                )}
                {fieldBStatus === "frustrated" && (
                  <Text style={styles.frustratedText}>Frustration created for this field</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <ButtonGroup
                  buttons={allowablePackingGroups()}
                  selectedIndex={allowablePackingGroups().indexOf(fields.C)}
                  onPress={selectedIndex => {
                    if (fieldCStatus === "frustrated") return;
                    const groups = allowablePackingGroups();
                    const selectedValue = groups[selectedIndex];
                    updateField("C", selectedValue);
                    updatePackagePopField("C", selectedValue);
                  }}
                  containerStyle={[
                    styles.buttonGroupContainer,
                    fieldCStatus === "invalid" && styles.buttonGroupError,
                    fieldCStatus === "frustrated" && styles.buttonGroupFrustrated,
                  ]}
                  selectedButtonStyle={styles.selectedButton}
                  textStyle={styles.buttonGroupButtonText}
                  disabled={fieldCStatus === "frustrated"}
                />
                <Text style={styles.explanation}>
                  {`${explanations.C} (Allowed: ${allowablePackingGroups().join(
                    ", "
                  )})`}
                  <Text style={styles.fieldId}> (Field C)</Text>
                </Text>
                {fieldCError && fieldCStatus === "invalid" && (
                  <Text style={styles.errorText}>{fieldCError}</Text>
                )}
                {fieldCStatus === "invalid" && (
                  <TouchableOpacity
                    style={styles.frustrationButton}
                    onPress={() => {
                      addPackageFrustration({
                        category: "marking",
                        itemId: "pop-field-c",
                        itemLabel: "Packing Group (Field C)",
                        expectedValues: allowablePackingGroups(),
                        verificationStatus: fields.C ? "incorrect" : "missing",
                        defaultMessage: fieldCError || "Packing group validation failed",
                        afmanReference: "AFMAN 24-604 A11.3.3",
                      });
                      setFieldCStatus("frustrated");
                    }}
                  >
                    <MaterialIcons name="report-problem" size={18} color="#fff" />
                    <Text style={styles.frustrationButtonText}>Create Frustration</Text>
                  </TouchableOpacity>
                )}
                {fieldCStatus === "frustrated" && (
                  <Text style={styles.frustratedText}>Frustration created for this field</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Field D"
                  value={fields.D}
                  onChangeText={text => {
                    const formatted = text.replace(/[^\d.]/g, "");
                    updateField("D", formatted);
                    updatePackagePopField("D", formatted);
                  }}
                />
                <Text style={styles.explanation}>
                  {explanations.D}
                  <Text style={styles.fieldId}> (Field D)</Text>
                </Text>
              </View>
              {physicalState === PhysicalState.LIQUID && (
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Field E"
                    value={fields.E}
                    onChangeText={text => {
                      const formatted = text.replace(/[^\d.]/g, "");
                      updateField("E", formatted);
                      updatePackagePopField("E", formatted);
                    }}
                  />
                  <Text style={styles.explanation}>
                    {explanations.E}
                    <Text style={styles.fieldId}> (Field E)</Text>
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.column}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, yearError && styles.inputError]}
                  keyboardType="numeric"
                  placeholder="Field F"
                  value={fields.F}
                  maxLength={2}
                  onChangeText={text => {
                    const formatted = text.replace(/[^\d]/g, "");
                    updateField("F", formatted);
                    updatePackagePopField("F", formatted);
                    validateYearField(formatted);
                  }}
                  onBlur={() => validateYearField(fields.F)}
                  accessibilityHint={
                    yearError || "Enter last 2 digits of manufacture year"
                  }
                />
                <Text style={styles.explanation}>
                  {explanations.F}
                  <Text style={styles.fieldId}> (Field F)</Text>
                </Text>
                {yearError && <Text style={styles.errorText}>{yearError}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <PaperInput
                  placeholder="Field G"
                  value={fields.G}
                  onChangeText={text => {
                    updateField("G", text);
                    updatePackagePopField("G", text);
                  }}
                  onFocus={() => {
                    setHasSelectedCountry(false);
                  }}
                  mode="outlined"
                  outlineColor="#ccc"
                  activeOutlineColor="#007bff"
                  style={styles.comboboxInput}
                />
                {fields.G.length > 0 && !hasSelectedCountry && (
                  <View style={styles.suggestionContainer}>
                    {countries
                      .filter(
                        c =>
                          c.name
                            .toLowerCase()
                            .includes(fields.G.toLowerCase()) ||
                          c.code.toLowerCase().includes(fields.G.toLowerCase())
                      )
                      .slice(0, 5)
                      .map(item => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.countrySuggestion}
                          onPress={() => {
                            updateField("G", item.code);
                            updatePackagePopField("G", item.code);
                            setHasSelectedCountry(true);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: "#000" }}>
                            {item.name} ({item.code})
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}

                <Text style={styles.explanation}>
                  {explanations.G}
                  <Text style={styles.fieldId}> (Field G)</Text>
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Field H"
                  value={fields.H}
                  onChangeText={text => {
                    updateField("H", text);
                    updatePackagePopField("H", text);
                  }}
                />
                <Text style={styles.explanation}>
                  {explanations.H}
                  <Text style={styles.fieldId}> (Field H)</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            resetPackagePopMarking();
            navigation.goBack();
          }}
          accessibilityLabel="Cancel button"
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={async () => {
            Alert.alert("Save Progress", "Inspection progress saved.", [
              { text: "OK" },
            ]);
          }}
          accessibilityLabel="Save and exit button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!isFormValid}
          accessibilityLabel="Continue button"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormValid }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Dev Benchmark Button - only visible in __DEV__ */}
      <DevBenchmarkButton position="bottom-right" />
    </KeyboardAvoidingView>
  );
};

export default InspectorPOPMarkingDataEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 12,
    paddingBottom: 24,
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
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#212529",
  },
  previewSection: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    padding: 12,
    marginBottom: 12,
  },
  formSection: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    padding: 12,
    marginBottom: 12,
  },
  popRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  columnsWrapper: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    backgroundColor: "#dee2e6",
    marginHorizontal: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
    height: 55,
    color: "#000",
  },
  inputError: {
    borderColor: "#dc3545",
    backgroundColor: "#fff8f8",
  },
  comboboxInput: {
    backgroundColor: "#fafafa",
    height: 55,
    color: "#000",
  },
  suggestionContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopWidth: 0,
  },
  explanation: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  fieldId: {
    fontWeight: "700",
    fontSize: 13,
    color: "#495057",
  },
  buttonGroupContainer: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 55,
  },
  selectedButton: {
    backgroundColor: colors.blue,
  },
  countrySuggestion: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
    fontSize: 14,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#dc3545",
    marginTop: 2,
  },
  buttonGroupButtonText: {
    color: "#000",
  },
  inputFrustrated: {
    borderColor: "#FF9800",
    backgroundColor: "#FFF3E0",
    opacity: 0.7,
  },
  buttonGroupError: {
    borderColor: "#F44336",
  },
  buttonGroupFrustrated: {
    borderColor: "#FF9800",
    opacity: 0.7,
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
});
