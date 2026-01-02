import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";
import { PhysicalState, unitOptions } from "../../../types";
import colors from "../../../src/theming/colors";
import { convertUnits } from "../../../src/utils/unitConversions";
import { Button } from "react-native-elements";
import { informativeSpecialProvisionsMap } from "../../../server/informativeStatements/informativeStatements";
import { hazProContextLookup } from "../../../server/lookupFunctions/hazProContextLookup";
import {
  isHazardousMaterialLimitedQuantity,
  IsHazardousMaterialLimitedQuantityInput,
} from "../../../server/attachment19/limitedQuantities/isHazardousMaterialLimitedQuantity";
import {
  isHazardousMaterialExceptedQuantity,
  IsHazardousMaterialExceptedQuantityInput,
} from "../../../server/attachment19/exceptedQuantities/isHazardousMaterialExceptedQuantity";

export const InspectorHazmatQuantityEntryScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, dispatch } = useContext(HazProInspectorContext);
  const physicalState: PhysicalState | undefined =
    state.hazProInspectorContext.hazardousMaterial?.physicalState;

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const [quantity, setQuantity] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(() => {
    if (physicalState === PhysicalState.SOLID) return "kg";
    if (physicalState === PhysicalState.LIQUID) return "liters";
    return "";
  });

  useEffect(() => {
    const qty = parseFloat(quantity);
    if (isNaN(qty)) return;

    if (physicalState === PhysicalState.SOLID) {
      if (selectedUnit === "kg") {
        handleNestedInspectorContextFieldUpdate("totalNetMass.kg", qty);
        handleNestedInspectorContextFieldUpdate(
          "totalNetMass.lbs",
          convertUnits(qty, "kg", "lbs")
        );
      } else {
        handleNestedInspectorContextFieldUpdate("totalNetMass.lbs", qty);
        handleNestedInspectorContextFieldUpdate(
          "totalNetMass.kg",
          convertUnits(qty, "lbs", "kg")
        );
      }
    } else if (physicalState === PhysicalState.LIQUID) {
      if (selectedUnit === "liters") {
        handleNestedInspectorContextFieldUpdate("totalNetVolume.liters", qty);
        handleNestedInspectorContextFieldUpdate(
          "totalNetVolume.gallons",
          convertUnits(qty, "liters", "gallons")
        );
      } else {
        handleNestedInspectorContextFieldUpdate("totalNetVolume.gallons", qty);
        handleNestedInspectorContextFieldUpdate(
          "totalNetVolume.liters",
          convertUnits(qty, "gallons", "liters")
        );
      }
    }
  }, [quantity, selectedUnit]);

  const isSubmitDisabled =
    !quantity || isNaN(Number(quantity)) || !selectedUnit;

  const availableUnits =
    physicalState === PhysicalState.SOLID ||
    physicalState === PhysicalState.LIQUID
      ? unitOptions[physicalState]
      : [];

  useEffect(() => {
    handleNestedInspectorContextFieldUpdate("activeStep", 3);

    const lookupInput = {
      context: {
        hazardousMaterial: state.hazProInspectorContext.hazardousMaterial,
        physicalState:
          state.hazProInspectorContext.hazardousMaterial?.physicalState,
      },
      specialProvisionsMap: informativeSpecialProvisionsMap,
      dotCylinderSpecifications: [],
      markingContext: {
        context: state.hazProInspectorContext,
      },
      labelingContext: {
        hazardousMaterial: state.hazProInspectorContext.hazardousMaterial,
        isLimitedQuantity: false,
        isExceptedQuantity: false,
      },
    };

    const lookupOutput = hazProContextLookup(lookupInput);

    // console.log('state.hazProInspectorContext.hazardousMaterial: ', JSON.stringify(state.hazProInspectorContext.hazardousMaterial, null, 2));
    // console.log('lookupOutput: ', JSON.stringify(lookupOutput, null, 2));
  }, []);

  const onSubmit = () => {
    const qty = parseFloat(quantity);
    let isReportableQuantity: boolean = false;

    // console.log('state.hazProInspectorContext.lookupFunctionsOutput: ', JSON.stringify(state.hazProInspectorContext.lookupFunctionsOutput, null, 2));

    if (!isNaN(qty)) {
      const rqr =
        state.hazProInspectorContext.lookupFunctionsOutput
          ?.reportableQuantityRequirement;

      if (
        selectedUnit === "kg" &&
        rqr?.kilograms !== undefined &&
        qty > rqr.kilograms
      ) {
        handleNestedInspectorContextFieldUpdate("isReportableQuantity", true);
        isReportableQuantity = true;
      }

      if (
        selectedUnit === "lbs" &&
        rqr?.pounds !== undefined &&
        qty > rqr.pounds
      ) {
        handleNestedInspectorContextFieldUpdate("isReportableQuantity", true);
        isReportableQuantity = true;
      }
    }

    // Determine default answers
    const hazmat = state.hazProInspectorContext.hazardousMaterial;
    // const isReportable = state.hazProInspectorContext.isReportableQuantity;
    const inferredQuestions = [
      ...state.hazProInspectorContext.initial1015Questions,
    ];

    if (hazmat) {
      inferredQuestions[0].value =
        hazmat.hazclassDiv?.startsWith("7") ||
        hazmat.subsidiaryRisk?.includes("7")
          ? true
          : false;
      inferredQuestions[1].value = hazmat.hazclassDiv?.startsWith("1")
        ? true
        : false;
      inferredQuestions[2].value = isReportableQuantity ? true : false;
      inferredQuestions[3].value =
        hazmat.physicalState === PhysicalState.LIQUID ? true : false;
    }

    handleNestedInspectorContextFieldUpdate(
      "initial1015Questions",
      inferredQuestions
    );

    if (state.hazProInspectorContext.hazardousMaterial !== null) {
      // limited - SOLID
      if (
        state.hazProInspectorContext.hazardousMaterial.physicalState ===
          PhysicalState.SOLID &&
        typeof state.hazProInspectorContext.totalNetMass?.kg !== "undefined"
      ) {
        const isLimitedQuantityInput: IsHazardousMaterialLimitedQuantityInput =
          {
            materials: [
              {
                material: state.hazProInspectorContext.hazardousMaterial,
                packagingQuantities: {
                  physicalState:
                    state.hazProInspectorContext.hazardousMaterial
                      .physicalState,
                  quantityPerPackageIn_kg:
                    state.hazProInspectorContext.totalNetMass?.kg,
                  quantityPerPackageIn_g:
                    state.hazProInspectorContext.totalNetMass?.kg * 1000,
                },
              },
            ],
          };
        const isLimitedQuantity = isHazardousMaterialLimitedQuantity(
          isLimitedQuantityInput
        );
        if (isLimitedQuantity?.isLimited) {
          handleNestedInspectorContextFieldUpdate("isLimitedQuantity", true);
          navigation.navigate("InspectorExceptedOrLimitedQuantities");
          return;
        } else if (!isLimitedQuantity?.isLimited) {
          handleNestedInspectorContextFieldUpdate("isLimitedQuantity", false);
          navigation.navigate("InspectorInitialQuestioningScreen");
          return;
        }
      } else if (
        state.hazProInspectorContext.hazardousMaterial.physicalState ===
          PhysicalState.LIQUID &&
        typeof state.hazProInspectorContext.totalNetVolume?.liters !==
          "undefined"
      ) {
        // limited - LIQUID
        const isLimitedQuantityInput: IsHazardousMaterialLimitedQuantityInput =
          {
            materials: [
              {
                material: state.hazProInspectorContext.hazardousMaterial,
                packagingQuantities: {
                  physicalState:
                    state.hazProInspectorContext.hazardousMaterial
                      .physicalState,
                  quantityPerPackageIn_mL:
                    state.hazProInspectorContext.totalNetVolume.liters * 1000,
                  quantityPerPackageIn_L:
                    state.hazProInspectorContext.totalNetVolume.liters,
                },
              },
            ],
          };
        const isLimitedQuantity = isHazardousMaterialLimitedQuantity(
          isLimitedQuantityInput
        );
        if (isLimitedQuantity?.isLimited) {
          handleNestedInspectorContextFieldUpdate("isLimitedQuantity", true);
          navigation.navigate("InspectorExceptedOrLimitedQuantities");
          return;
        } else if (!isLimitedQuantity?.isLimited) {
          handleNestedInspectorContextFieldUpdate("isLimitedQuantity", false);
          navigation.navigate("InspectorInitialQuestioningScreen");
          return;
        }
      }

      if (
        state.hazProInspectorContext.hazardousMaterial.physicalState ===
          PhysicalState.SOLID &&
        typeof state.hazProInspectorContext.totalNetMass?.kg !== "undefined"
      ) {
        const isExceptedQuantityInput: IsHazardousMaterialExceptedQuantityInput =
          {
            material: state.hazProInspectorContext.hazardousMaterial,
            outerPackagingQuantityIn_grams:
              state.hazProInspectorContext.totalNetMass.kg * 1000,
          };
        const isExceptedQuantity = isHazardousMaterialExceptedQuantity(
          isExceptedQuantityInput
        );
        if (isExceptedQuantity?.isExcepted) {
          handleNestedInspectorContextFieldUpdate("isExceptedQuantity", true);
          navigation.navigate("InspectorExceptedOrLimitedQuantities");
          return;
        } else if (!isExceptedQuantity?.isExcepted) {
          handleNestedInspectorContextFieldUpdate("isExceptedQuantity", false);
          navigation.navigate("InspectorInitialQuestioningScreen");
          return;
        }
      } else if (
        state.hazProInspectorContext.hazardousMaterial.physicalState ===
          PhysicalState.LIQUID &&
        typeof state.hazProInspectorContext.totalNetVolume?.liters !==
          "undefined"
      ) {
        const isExceptedQuantityInput: IsHazardousMaterialExceptedQuantityInput =
          {
            material: state.hazProInspectorContext.hazardousMaterial,
            outerPackagingQuantityIn_mLs:
              state.hazProInspectorContext.totalNetVolume?.liters * 1000,
          };
        const isExceptedQuantity = isHazardousMaterialExceptedQuantity(
          isExceptedQuantityInput
        );
        if (isExceptedQuantity?.isExcepted) {
          handleNestedInspectorContextFieldUpdate("isExceptedQuantity", true);
          navigation.navigate("InspectorExceptedOrLimitedQuantities");
          return;
        } else if (!isExceptedQuantity?.isExcepted) {
          handleNestedInspectorContextFieldUpdate("isExceptedQuantity", false);
          navigation.navigate("InspectorInitialQuestioningScreen");
          return;
        }
      }
    }
    navigation.navigate("InspectorInitialQuestioningScreen");
  };

  const goBack = () => {
    handleNestedInspectorContextFieldUpdate("activeStep", 2);
    navigation.navigate("InspectorMaterialIDScreen");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Enter Quantity</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedUnit}
              onValueChange={setSelectedUnit}
              mode="dropdown"
            >
              {availableUnits.map(unit => (
                <Picker.Item key={unit} label={unit} value={unit} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <Button
            title="Cancel"
            type="outline"
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonText}
            containerStyle={styles.buttonWrapper}
            onPress={goBack}
          />
          <Button
            title="Submit"
            buttonStyle={styles.submitButton}
            titleStyle={styles.submitButtonText}
            containerStyle={styles.buttonWrapper}
            disabled={isSubmitDisabled}
            onPress={onSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: colors.white,
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    width: "20%",
  },
  cancelButton: {
    borderColor: "#007bff",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 5,
  },
  disabledSubmitButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
