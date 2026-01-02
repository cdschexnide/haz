import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface MagnetizedMaterialData {
  exceedsMagneticLimit: boolean | null;
  shieldingMeetsRequirement: boolean | null;
  twoDevicesUsed: boolean | null;
  blockingBracingProvided: boolean | null;
  protectiveDistanceMaintained: boolean | null;
  outerPackagingDescription: string;
  wantsToSpecifyWeightAndSize: boolean | null;
  weight: number;
  weightUnit: "kg" | "lbs";
  length: number;
  width: number;
  height: number;
}

function convertToKg(weight: number, unit: "kg" | "lbs"): number {
  if (unit === "kg") return weight;
  return weight * 0.453592; // Convert lbs to kg
}

const MagnetizedMaterialPrepScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const { navigate } = useNavigationRef();
  const [magnetizedData, setMagnetizedData] = useState<MagnetizedMaterialData>({
    exceedsMagneticLimit: null,
    shieldingMeetsRequirement: null,
    twoDevicesUsed: null,
    blockingBracingProvided: null,
    protectiveDistanceMaintained: null,
    outerPackagingDescription: "",
    wantsToSpecifyWeightAndSize: null,
    weight: 0,
    weightUnit: "kg",
    length: 0,
    width: 0,
    height: 0,
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleInputChange = (
    field: keyof MagnetizedMaterialData,
    value: any
  ) => {
    setMagnetizedData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === "weight") {
      const weightInKg = convertToKg(value, magnetizedData.weightUnit);
      if (store.hazProPreparerContext.magnetizedMaterialData) {
        (store.hazProPreparerContext.magnetizedMaterialData as any).weight =
          weightInKg;
      }
    } else {
      if (store.hazProPreparerContext.magnetizedMaterialData) {
        (store.hazProPreparerContext.magnetizedMaterialData as any)[field] =
          value;
      }
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveAndExit = () => {
    store.hazProPreparerContext.magnetizedMaterialData = magnetizedData;
    saveCurrentShipment("in-progress");
    navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const handleSaveAndContinue = () => {
    store.hazProPreparerContext.magnetizedMaterialData = magnetizedData;

    const completedSubsteps =
      state.hazProPreparerContext.completedSubsteps || [];
    if (!completedSubsteps.includes("MagnetizedMaterial")) {
      const updatedSubsteps = [...completedSubsteps, "MagnetizedMaterial"];
      store.hazProPreparerContext.completedSubsteps = updatedSubsteps;
    }

    navigation.navigate("LabelingAndMarking");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.briefingPanel}>
          <Text style={styles.briefingTitle}>A13.11 MAGNETIZED MATERIAL</Text>
          <Text style={styles.briefingText}>
            • Shield magnetic materials when required so magnetic-field strength
            ≤ 5.25 milli-gauss OR ≤ 2 degrees compass deviation at 4.6 m (15
            ft).
          </Text>
          <Text style={styles.briefingText}>
            • Verify with two independent measuring devices; record both
            readings.
          </Text>
          <Text style={styles.briefingText}>
            • Provide blocking & bracing as required.
          </Text>
          <Text style={styles.briefingText}>
            • Additional details: TO 00-25-251.
          </Text>
          <Text style={styles.briefingText}>
            • UN specification packaging not required.
          </Text>
          <Text style={styles.briefingText}>
            • Magnetized material exceeding 0.00525 gauss @ 4.6 m is FORBIDDEN
            for air movement.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Magnetic Field Requirements</Text>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Does this package have a magnetic field strength of more than
              0.00525 gauss measured at 4.5 m (15 ft)?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.exceedsMagneticLimit === true &&
                    styles.selectedButton,
                ]}
                onPress={() => handleInputChange("exceedsMagneticLimit", true)}
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.exceedsMagneticLimit === true &&
                      styles.selectedButtonText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.exceedsMagneticLimit === false &&
                    styles.selectedButton,
                ]}
                onPress={() => handleInputChange("exceedsMagneticLimit", false)}
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.exceedsMagneticLimit === false &&
                      styles.selectedButtonText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {magnetizedData.exceedsMagneticLimit === true && (
            <View style={styles.warningCard}>
              <MaterialIcons
                name="warning"
                size={24}
                color="#dc3545"
                style={styles.warningIcon}
              />
              <Text style={styles.warningText}>
                This package is FORBIDDEN on military aircraft.
              </Text>
            </View>
          )}

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Is the magnetic field strength ≤ 5.25 milligauss or compass
              deviation ≤ 2° at 4.6 m (15 ft)?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.shieldingMeetsRequirement === true &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("shieldingMeetsRequirement", true)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.shieldingMeetsRequirement === true &&
                      styles.selectedButtonText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.shieldingMeetsRequirement === false &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("shieldingMeetsRequirement", false)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.shieldingMeetsRequirement === false &&
                      styles.selectedButtonText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Were two independent measuring devices used to verify the magnetic
              field strength?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.twoDevicesUsed === true &&
                    styles.selectedButton,
                ]}
                onPress={() => handleInputChange("twoDevicesUsed", true)}
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.twoDevicesUsed === true &&
                      styles.selectedButtonText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.twoDevicesUsed === false &&
                    styles.selectedButton,
                ]}
                onPress={() => handleInputChange("twoDevicesUsed", false)}
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.twoDevicesUsed === false &&
                      styles.selectedButtonText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Has appropriate blocking and bracing been provided?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.blockingBracingProvided === true &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("blockingBracingProvided", true)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.blockingBracingProvided === true &&
                      styles.selectedButtonText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.blockingBracingProvided === false &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("blockingBracingProvided", false)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.blockingBracingProvided === false &&
                      styles.selectedButtonText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Is the distance between magnetic surface and outside of innermost
              container at least 102 mm (4 inches)?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.protectiveDistanceMaintained === true &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("protectiveDistanceMaintained", true)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.protectiveDistanceMaintained === true &&
                      styles.selectedButtonText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.protectiveDistanceMaintained === false &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("protectiveDistanceMaintained", false)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.protectiveDistanceMaintained === false &&
                      styles.selectedButtonText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Outer Packaging Description</Text>
            <Text style={styles.exampleText}>
              Example: 463L Pallet, 1 x Fiberboard box (4G), Equipment
              (described), or Plywood box, etc.
            </Text>
            <TextInput
              style={styles.input}
              value={magnetizedData.outerPackagingDescription}
              onChangeText={value =>
                handleInputChange("outerPackagingDescription", value)
              }
              placeholder="Describe the outer packaging used"
              multiline
              numberOfLines={3}
            />
            {!magnetizedData.outerPackagingDescription.trim() && (
              <Text style={styles.errorText}>
                Please provide a description of the outer packaging.
              </Text>
            )}
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Do you want to specify weight and size of container?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.wantsToSpecifyWeightAndSize === true &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("wantsToSpecifyWeightAndSize", true)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.wantsToSpecifyWeightAndSize === true &&
                      styles.selectedButtonText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  magnetizedData.wantsToSpecifyWeightAndSize === false &&
                    styles.selectedButton,
                ]}
                onPress={() =>
                  handleInputChange("wantsToSpecifyWeightAndSize", false)
                }
              >
                <Text
                  style={[
                    styles.yesNoButtonText,
                    magnetizedData.wantsToSpecifyWeightAndSize === false &&
                      styles.selectedButtonText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {magnetizedData.wantsToSpecifyWeightAndSize === true && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight</Text>
                <View style={styles.quantityContainer}>
                  <TextInput
                    style={[styles.textInput, styles.quantityInput]}
                    value={
                      magnetizedData.weight
                        ? magnetizedData.weight.toString()
                        : ""
                    }
                    onChangeText={value => {
                      const numValue = parseFloat(value) || 0;
                      handleInputChange("weight", numValue);
                    }}
                    keyboardType="numeric"
                    placeholder="Enter weight"
                    accessibilityLabel="Weight of package, required"
                  />
                  <View style={styles.unitSelectorContainer}>
                    <Pressable
                      style={[
                        styles.unitButton,
                        magnetizedData.weightUnit === "lbs" &&
                          styles.selectedUnitButton,
                      ]}
                      onPress={() => handleInputChange("weightUnit", "lbs")}
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: magnetizedData.weightUnit === "lbs",
                      }}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          magnetizedData.weightUnit === "lbs" &&
                            styles.selectedUnitButtonText,
                        ]}
                      >
                        lbs
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.unitButton,
                        magnetizedData.weightUnit === "kg" &&
                          styles.selectedUnitButton,
                      ]}
                      onPress={() => handleInputChange("weightUnit", "kg")}
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: magnetizedData.weightUnit === "kg",
                      }}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          magnetizedData.weightUnit === "kg" &&
                            styles.selectedUnitButtonText,
                        ]}
                      >
                        kg
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.helperText}>
                  Required for package documentation
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dimension</Text>
                <View style={styles.dimensionsRow}>
                  <View style={styles.dimensionInputWrapper}>
                    <Text style={styles.dimensionLabel}>Length</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={[styles.input, styles.dimensionInput]}
                        value={
                          magnetizedData.length
                            ? magnetizedData.length.toString()
                            : ""
                        }
                        onChangeText={value => {
                          const numValue = parseFloat(value) || 0;
                          handleInputChange("length", numValue);
                        }}
                        keyboardType="numeric"
                        placeholder="Length"
                      />
                      <Text style={styles.inputUnit}>in</Text>
                    </View>
                  </View>
                  <View style={styles.dimensionInputWrapper}>
                    <Text style={styles.dimensionLabel}>Width</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={[styles.input, styles.dimensionInput]}
                        value={
                          magnetizedData.width
                            ? magnetizedData.width.toString()
                            : ""
                        }
                        onChangeText={value => {
                          const numValue = parseFloat(value) || 0;
                          handleInputChange("width", numValue);
                        }}
                        keyboardType="numeric"
                        placeholder="Width"
                      />
                      <Text style={styles.inputUnit}>in</Text>
                    </View>
                  </View>
                  <View style={styles.dimensionInputWrapper}>
                    <Text style={styles.dimensionLabel}>Height</Text>
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={[styles.input, styles.dimensionInput]}
                        value={
                          magnetizedData.height
                            ? magnetizedData.height.toString()
                            : ""
                        }
                        onChangeText={value => {
                          const numValue = parseFloat(value) || 0;
                          handleInputChange("height", numValue);
                        }}
                        keyboardType="numeric"
                        placeholder="Height"
                      />
                      <Text style={styles.inputUnit}>in</Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          accessibilityLabel="Cancel button"
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={handleSaveAndExit}
          accessibilityLabel="Save and exit button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={handleSaveAndContinue}
          disabled={!isFormValid}
          accessibilityLabel="Save and continue button"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormValid }}
        >
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flex: 1,
  },
  briefingPanel: {
    backgroundColor: "#F1F3F5",
    padding: 16,
    borderRadius: 4,
    margin: 16,
  },
  briefingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#495057",
  },
  briefingText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: "#495057",
  },
  formContainer: {
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    marginBottom: 16,
    paddingBottom: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#495057",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#212529",
    // minHeight: 80,
    textAlignVertical: "top",
  },
  warningCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#dc3545",
    lineHeight: 20,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 4,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    color: "#212529",
    marginBottom: 12,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
  },
  yesNoButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
  },
  selectedButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  yesNoButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  selectedButtonText: {
    color: "#ffffff",
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
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#495057",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#212529",
  },
  quantityInput: {
    flex: 1,
  },
  unitSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  unitButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
  },
  selectedUnitButton: {
    backgroundColor: "#007bff",
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212529",
  },
  selectedUnitButtonText: {
    color: "#ffffff",
  },
  helperText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
    fontStyle: "italic",
  },
  dimensionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 8,
  },
  dimensionInputWrapper: {
    flex: 1,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  dimensionInput: {
    flex: 1,
    minWidth: 0,
    paddingRight: 28,
  },
  inputUnit: {
    position: "absolute",
    right: 10,
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
    zIndex: 1,
  },
  dimensionLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#495057",
  },
  exampleText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
    fontStyle: "italic",
  },
});

export default MagnetizedMaterialPrepScreen;
