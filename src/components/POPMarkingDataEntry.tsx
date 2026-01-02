import { countries } from "@/mock/countries";
import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { PhysicalState } from "../../types";
import { validatePackagingCodeV2 } from "@/utils/packagingWizardV2Helpers";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { TextInput as PaperInput } from "react-native-paper";
import LiquidPopMarking from "./LiquidPopMarking";
import SolidPopMarking from "./SolidPopMarking";

const { width } = Dimensions.get("window");
const screenWidth = width;

const PackingContainerDataEntry = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const [quantityExceedsLimit, setQuantityExceedsLimit] =
    useState<boolean>(false);
  const [isOverpack, setIsOverpack] = useState<boolean>(false);
  const [hasSelectedCountry, setHasSelectedCountry] = useState<boolean>(false);
  const [packagingCodeError, setPackagingCodeError] = useState<string | null>(
    null
  );
  const [yearError, setYearError] = useState<string | null>(null);
  const physicalState =
    state.hazProPreparerContext.hazardousMaterial?.physicalState;
  const packagingType = state.hazProPreparerContext.packaging?.packagingType;
  const showQuantityInput = packagingType?.toLowerCase() === "single";
  console.log("packagingType: ", packagingType);
  const [unit, setUnit] = useState<"liters" | "gallons" | "kg" | "lbs">(
    physicalState === PhysicalState.SOLID ? "kg" : "liters"
  );
  const [quantity, setQuantity] = useState<string>(
    state.hazProPreparerContext.packaging?.totalNetMass?.kg !== 0
      ? String(state.hazProPreparerContext.packaging?.totalNetMass?.kg)
      : ""
  );
  const [fields, setFields] = useState({
    B: state.hazProPreparerContext.packaging?.inputPOPMarking?.B || "",
    C: state.hazProPreparerContext.packaging?.inputPOPMarking?.C || "",
    D: state.hazProPreparerContext.packaging?.inputPOPMarking?.D || "",
    E: state.hazProPreparerContext.packaging?.inputPOPMarking?.E || "",
    F: state.hazProPreparerContext.packaging?.inputPOPMarking?.F || "",
    G: state.hazProPreparerContext.packaging?.inputPOPMarking?.G || "",
    H: state.hazProPreparerContext.packaging?.inputPOPMarking?.H || "",
  });

  // Reset POP marking form data when navigating back
  const resetPOPMarkingData = () => {
    if (store.hazProPreparerContext.packaging) {
      // Reset form fields
      if (store.hazProPreparerContext.packaging.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.B = "";
        store.hazProPreparerContext.packaging.inputPOPMarking.C = "";
        store.hazProPreparerContext.packaging.inputPOPMarking.D = "";
        store.hazProPreparerContext.packaging.inputPOPMarking.E = "";
        store.hazProPreparerContext.packaging.inputPOPMarking.F = "";
        store.hazProPreparerContext.packaging.inputPOPMarking.G = "";
        store.hazProPreparerContext.packaging.inputPOPMarking.H = "";
        store.hazProPreparerContext.overpack = false;
      }

      // Reset quantity data
      if (store.hazProPreparerContext.packaging.totalNetMass) {
        store.hazProPreparerContext.packaging.totalNetMass.kg = 0;
        store.hazProPreparerContext.packaging.totalNetMass.lbs = 0;
      }
      if (store.hazProPreparerContext.packaging.totalNetVolume) {
        store.hazProPreparerContext.packaging.totalNetVolume.liters = 0;
        store.hazProPreparerContext.packaging.totalNetVolume.gallons = 0;
      }

      // Reset validation state
      store.hazProPreparerContext.packaging.popIsValid = false;
    }

    // Reset packaging method
    store.hazProPreparerContext.packagingMethod = null;
  };

  // Handle Android back button - listen for navigation events
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
        // If we're going back (not forward to next screen)
        const isGoingBack =
          e.data.action.type === "GO_BACK" || e.data.action.type === "POP";

        if (isGoingBack) {
          // Reset the form data
          resetPOPMarkingData();
        }
      });

      return unsubscribe;
    }, [navigation])
  );

  useEffect(() => {
    if (!quantity || !fields.D || physicalState !== PhysicalState.SOLID) return;

    const maxAllowed = parseFloat(fields.D);
    const enteredQty = parseFloat(quantity);

    if (isNaN(maxAllowed) || isNaN(enteredQty)) return;

    if (enteredQty > maxAllowed) {
      if (!quantityExceedsLimit) {
        setQuantityExceedsLimit(true);
        Alert.alert(
          "Quantity Exceeds Limit",
          `The entered quantity (${enteredQty}) exceeds the maximum gross mass (${maxAllowed} kg) specified in Field D.`,
          [{ text: "OK" }]
        );
      }
    } else {
      setQuantityExceedsLimit(false);
    }
  }, [quantity, fields.D, physicalState]);

  useEffect(() => {
    if (state.hazProPreparerContext.packaging?.inputPOPMarking?.G !== "") {
      setHasSelectedCountry(true);
    }
  }, []);

  // Auto-select packing group if only one option is available
  useEffect(() => {
    const groups = allowablePackingGroups();
    if (groups && groups.length === 1 && !fields.C) {
      const selectedValue = groups[0];
      updateField("C", selectedValue);
      if (store.hazProPreparerContext.packaging?.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.C = selectedValue;
      }
    }
  }, [
    state.hazProPreparerContext.hazardousMaterial?.hazclassDiv,
    state.hazProPreparerContext.hazardousMaterial?.packingGroup,
    state.hazProPreparerContext.lookupFunctionsOutput?.packagingParagraph,
    fields.C,
  ]);

  const literToGallon = (liters: number) => liters * 0.264172;
  const gallonToLiter = (gallons: number) => gallons / 0.264172;
  const kgToLbs = (kg: number) => kg * 2.20462;
  const lbsToKg = (lbs: number) => lbs / 2.20462;

  const hazardClass4ParagraphsWithNoPackingGroup = ["A8.6.", "A8.7.", "A8.8."];
  const packagingParagraphValuesThatRequirePGIPackaging = ["A12.9.", "A12.11."];

  const allowablePackingGroups = () => {
    if (
      state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("1")
    ) {
      return ["X", "Y"];
    } else if (
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph ===
      "A7.12."
    ) {
      return ["X", "Y"];
    } else if (
      state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith(
        "4"
      ) &&
      state.hazProPreparerContext.hazardousMaterial?.packingGroup === "III"
    ) {
      return ["X", "Y"];
    } else if (
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph &&
      hazardClass4ParagraphsWithNoPackingGroup.includes(
        state.hazProPreparerContext.hazardousMaterial?.packagingParagraph
      )
    ) {
      return ["X", "Y"];
    } else if (
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph &&
      packagingParagraphValuesThatRequirePGIPackaging.includes(
        state.hazProPreparerContext.hazardousMaterial?.packagingParagraph
      )
    ) {
      return ["X"];
    } else if (state.hazProPreparerContext.allowablePackingGroups === "I") {
      return ["X"];
    } else if (state.hazProPreparerContext.allowablePackingGroups === "II") {
      return ["X", "Y"];
    } else if (state.hazProPreparerContext.allowablePackingGroups === "III") {
      return ["X", "Y", "Z"];
    } else if (state.hazProPreparerContext.allowablePackingGroups === "I II") {
      return ["X", "Y"];
    } else if (
      state.hazProPreparerContext.allowablePackingGroups === "II III"
    ) {
      return ["Y", "Z"];
    } else if (
      state.hazProPreparerContext.allowablePackingGroups === "I II III"
    ) {
      return ["X", "Y", "Z"];
    }
  };

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  const updateField = (key: keyof typeof fields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const validatePackagingCodeField = () => {
    const packagingParagraph =
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;
    const packagingType = state.hazProPreparerContext.packaging?.packagingType;
    const entryMethod = state.hazProPreparerContext.packagingEntryMethod;

    if (!packagingParagraph || fields.B.trim() === "") {
      return;
    }

    // If user came via Scan POP, validate against ALL packaging types (pass undefined)
    // Otherwise, validate against the selected packaging type
    const typeToValidate = entryMethod === 'scan' ? undefined : packagingType;

    const result = validatePackagingCodeV2(
      packagingDatabaseV2,
      packagingParagraph,
      fields.B,
      typeToValidate
    );

    if (!result?.isValid) {
      setPackagingCodeError("Packaging code not authorized for this material");
      if (store.hazProPreparerContext.packaging) {
        store.hazProPreparerContext.packaging.popIsValid = false;
      }
    } else {
      setPackagingCodeError(null);
      if (store.hazProPreparerContext.packaging) {
        store.hazProPreparerContext.packaging.popIsValid = true;
      }
      if (result.packagingMethod) {
        store.hazProPreparerContext.packagingMethod = result.packagingMethod;
        // If user came via scan, also set the packaging type based on validation result
        if (entryMethod === 'scan' && store.hazProPreparerContext.packaging) {
          store.hazProPreparerContext.packaging.packagingType = result.packagingMethod as any;
        }
      }
    }
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
    !packagingCodeError &&
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

  useEffect(() => {
    if (
      state.hazProPreparerContext.packaging?.packagingType === "Single" ||
      state.hazProPreparerContext.packaging?.packagingType === "Combination" ||
      state.hazProPreparerContext.packaging?.packagingType ===
        "CompositePackagingWithPlasticInnerReceptacles" ||
      state.hazProPreparerContext.packaging?.packagingType ===
        "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles"
    ) {
      if (store.hazProPreparerContext.packaging?.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.E = "S";
      }
    }
  }, []);

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

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Overpack being used</Text>
              <Switch
                value={isOverpack}
                onValueChange={stateOfOverPackSwitch => {
                  setIsOverpack(stateOfOverPackSwitch);
                  store.hazProPreparerContext.overpack = stateOfOverPackSwitch;
                }}
                accessibilityLabel="Overpack switch"
                trackColor={{ false: "#ccc", true: "#007bff" }}
                thumbColor={"#f9f9f9"}
              />
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.columnsWrapper}>
            <View style={styles.column}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    packagingCodeError && styles.inputError,
                  ]}
                  placeholder="Field B"
                  value={fields.B}
                  onChangeText={text => {
                    updateField("B", text);
                    if (
                      store.hazProPreparerContext.packaging?.inputPOPMarking
                    ) {
                      store.hazProPreparerContext.packaging.inputPOPMarking.B =
                        text;
                    }
                  }}
                  onBlur={validatePackagingCodeField}
                  accessibilityHint={
                    packagingCodeError ||
                    "Enter packaging code for outer packaging"
                  }
                />
                <Text style={styles.explanation}>
                  {explanations.B}
                  <Text style={styles.fieldId}> (Field B)</Text>
                </Text>
                {packagingCodeError && (
                  <Text style={styles.errorText}>{packagingCodeError}</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <ButtonGroup
                  buttons={allowablePackingGroups() || []}
                  selectedIndex={allowablePackingGroups()?.indexOf(fields.C)}
                  onPress={selectedIndex => {
                    const groups = allowablePackingGroups();
                    if (!groups) return;
                    const selectedValue = groups[selectedIndex];
                    updateField("C", selectedValue);
                    if (
                      store.hazProPreparerContext.packaging?.inputPOPMarking
                    ) {
                      store.hazProPreparerContext.packaging.inputPOPMarking.C =
                        selectedValue;
                    }
                  }}
                  containerStyle={styles.buttonGroupContainer}
                  selectedButtonStyle={styles.selectedButton}
                  textStyle={styles.buttonGroupButtonText}
                />
                <Text style={styles.explanation}>
                  {`${
                    explanations.C
                  } (Allowed: ${allowablePackingGroups()?.join(", ")})`}
                  <Text style={styles.fieldId}> (Field C)</Text>
                </Text>
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
                    if (
                      store.hazProPreparerContext.packaging?.inputPOPMarking
                    ) {
                      store.hazProPreparerContext.packaging.inputPOPMarking.D =
                        formatted;
                    }
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
                      if (
                        store.hazProPreparerContext.packaging?.inputPOPMarking
                      ) {
                        store.hazProPreparerContext.packaging.inputPOPMarking.E =
                          formatted;
                      }
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
                    if (
                      store.hazProPreparerContext.packaging?.inputPOPMarking
                    ) {
                      store.hazProPreparerContext.packaging.inputPOPMarking.F =
                        formatted;
                    }
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
                    if (
                      store.hazProPreparerContext.packaging?.inputPOPMarking
                    ) {
                      store.hazProPreparerContext.packaging.inputPOPMarking.G =
                        text;
                    }
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
                            if (
                              store.hazProPreparerContext.packaging
                                ?.inputPOPMarking
                            ) {
                              store.hazProPreparerContext.packaging.inputPOPMarking.G =
                                item.code;
                            }
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
                    if (
                      store.hazProPreparerContext.packaging?.inputPOPMarking
                    ) {
                      store.hazProPreparerContext.packaging.inputPOPMarking.H =
                        text;
                    }
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

        {showQuantityInput && (
          <View style={styles.quantitySection}>
            <Text style={styles.sectionLabel}>
              Enter Quantity of Hazardous Material
            </Text>
            <View style={styles.quantityRowAligned}>
              <View style={styles.quantityInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    quantityExceedsLimit && styles.inputError,
                  ]}
                  keyboardType="numeric"
                  placeholder="Quantity"
                  value={quantity}
                  onChangeText={text => {
                    const val = text.replace(/[^\d.]/g, "");
                    setQuantity(val);
                    const numVal = parseFloat(val);
                    if (physicalState === PhysicalState.LIQUID) {
                      if (unit === "liters") {
                        if (
                          store.hazProPreparerContext.packaging?.totalNetVolume
                        ) {
                          store.hazProPreparerContext.packaging.totalNetVolume.liters =
                            numVal;
                          store.hazProPreparerContext.packaging.totalNetVolume.gallons =
                            literToGallon(numVal);
                        }
                      } else {
                        if (
                          store.hazProPreparerContext.packaging?.totalNetVolume
                        ) {
                          store.hazProPreparerContext.packaging.totalNetVolume.gallons =
                            numVal;
                          store.hazProPreparerContext.packaging.totalNetVolume.liters =
                            gallonToLiter(numVal);
                        }
                      }
                    } else if (physicalState === PhysicalState.SOLID) {
                      if (unit === "kg") {
                        if (
                          store.hazProPreparerContext.packaging?.totalNetMass
                        ) {
                          store.hazProPreparerContext.packaging.totalNetMass.kg =
                            numVal;
                          store.hazProPreparerContext.packaging.totalNetMass.lbs =
                            kgToLbs(numVal);
                        }
                      } else {
                        if (
                          store.hazProPreparerContext.packaging?.totalNetMass
                        ) {
                          store.hazProPreparerContext.packaging.totalNetMass.lbs =
                            numVal;
                          store.hazProPreparerContext.packaging.totalNetMass.kg =
                            lbsToKg(numVal);
                        }
                      }
                    }
                  }}
                />
                <Text style={styles.explanation}>
                  Enter the quantity of the material
                </Text>
                {quantityExceedsLimit && (
                  <Text style={styles.warningText}>
                    Quantity exceeds the maximum gross mass in Field D.
                  </Text>
                )}
              </View>

              <View style={styles.unitContainer}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={unit}
                    onValueChange={selected => {
                      setUnit(selected);
                      setQuantity("");
                    }}
                    style={styles.picker}
                    dropdownIconColor="#000"
                    itemStyle={{ color: "#000" }}
                  >
                    {physicalState === PhysicalState.SOLID
                      ? [
                          <Picker.Item
                            key="kg"
                            label="Kilograms (kg)"
                            value="kg"
                          />,
                          <Picker.Item
                            key="lbs"
                            label="Pounds (lbs)"
                            value="lbs"
                          />,
                        ]
                      : [
                          <Picker.Item
                            key="liters"
                            label="Liters"
                            value="liters"
                          />,
                          <Picker.Item
                            key="gallons"
                            label="Gallons"
                            value="gallons"
                          />,
                        ]}
                  </Picker>
                </View>
                <Text style={styles.explanation}>Selected unit of measure</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            resetPOPMarkingData();
            store.hazProPreparerContext.completedSubsteps =
              completedSubsteps.slice(0, -1);
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
            try {
              await saveCurrentShipment("in-progress");
              navigation.navigate("PreparerHomeStack", {
                screen: "PreparerHome",
              });
            } catch (err) {
              console.log("Save failed, but error is handled by context:", err);
            }
          }}
          accessibilityLabel="Save and exit button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={() => {
            const packagingParagraph =
              state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;
            const packagingCode = fields.B;
            const entryMethod = state.hazProPreparerContext.packagingEntryMethod;

            console.log("packagingParagraph: ", packagingParagraph);
            console.log("packagingCode: ", packagingCode);
            console.log("entryMethod: ", entryMethod);
            if (!packagingParagraph) {
              console.log("IF BLOCK -> !packagingParagraph");
              return;
            }

            // If user came via Scan POP, validate against ALL packaging types
            const typeToValidate = entryMethod === 'scan' ? undefined : state.hazProPreparerContext.packaging?.packagingType;

            const validationResult = validatePackagingCodeV2(
              packagingDatabaseV2,
              packagingParagraph,
              packagingCode,
              typeToValidate
            );
            console.log(
              "validationResult: ",
              JSON.stringify(validationResult, null, 2)
            );
            if (!validationResult?.isValid) {
              console.log("IF BLOCK -> !validationResult?.isValid");
              console.log(
                "store.hazProPreparerContext.packaging: ",
                JSON.stringify(store.hazProPreparerContext.packaging, null, 2)
              );
              if (store.hazProPreparerContext.packaging) {
                console.log(
                  "IF BLOCK -> store.hazProPreparerContext.packaging"
                );
                console.log(
                  "setting ==> store.hazProPreparerContext.packaging.popIsValid = false"
                );
                store.hazProPreparerContext.packaging.popIsValid = false;
              }
              // navigation.navigate("UnauthorizedPopMarking");
              console.log(
                "navigating ==> navigation.navigate('LabelingAndMarking')"
              );
              navigation.navigate("LabelingAndMarking");
              return;
            }
            console.log(
              "validationResult.packagingMethod: ",
              JSON.stringify(validationResult.packagingMethod, null, 2)
            );
            if (validationResult.packagingMethod) {
              console.log("IF BLOCK -> validationResult.packagingMethod");

              console.log(
                "setting ==> store.hazProPreparerContext.packagingMethod = validationResult.packagingMethod"
              );
              store.hazProPreparerContext.packagingMethod =
                validationResult.packagingMethod;

              // If user came via scan, set the packaging type from validation result
              if (entryMethod === 'scan' && store.hazProPreparerContext.packaging) {
                store.hazProPreparerContext.packaging.packagingType = validationResult.packagingMethod as any;
                console.log(
                  "setting ==> store.hazProPreparerContext.packaging.packagingType = validationResult.packagingMethod (from scan)"
                );
              }

              // Use validationResult.packagingMethod for navigation decision when coming from scan
              const effectivePackagingType = entryMethod === 'scan'
                ? validationResult.packagingMethod
                : state.hazProPreparerContext.packaging?.packagingType;

              console.log(
                "effectivePackagingType: ",
                effectivePackagingType
              );
              if (
                effectivePackagingType?.toLowerCase() ===
                "single"
              ) {
                console.log(
                  "IF BLOCK -> effectivePackagingType === 'Single'"
                );
                store.hazProPreparerContext.completedSubsteps = [
                  ...completedSubsteps,
                  "POPMarkingDataEntry",
                ];
                console.log(
                  "navigating ==> navigation.navigate('LabelingAndMarking')"
                );
                navigation.navigate("LabelingAndMarking");
              } else if (
                effectivePackagingType?.toLowerCase() ===
                  "combination" ||
                effectivePackagingType?.toLowerCase() ===
                  "compositepackagingwithplasticinnerreceptacles" ||
                effectivePackagingType?.toLowerCase() ===
                  "compositepackagingwithglassporcelainorstonewareinnerreceptacles" ||
                effectivePackagingType?.toLowerCase() ===
                  "composite"
              ) {
                console.log(
                  "IF BLOCK -> effectivePackagingType === Combination/Composite/etc (anything other than Single)"
                );
                store.hazProPreparerContext.completedSubsteps = [
                  ...completedSubsteps,
                  "POPMarkingDataEntry",
                ];
                console.log(
                  "navigating ==> navigation.navigate('InnerPackagingWizard')"
                );
                navigation.navigate("InnerPackagingWizard");
              }
            }
          }}
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

export default PackingContainerDataEntry;

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
  quantitySection: {
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
  checkboxContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 40,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#212529",
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    backgroundColor: "#fafafa",
    height: 55,
  },
  picker: {
    height: 55,
    color: "#000",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#212529",
  },
  warningText: {
    color: "#dc3545",
    fontSize: 13,
    marginTop: 2,
  },
  quantityRowAligned: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  quantityInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  unitContainer: {
    flex: 1,
    marginLeft: 8,
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
});
