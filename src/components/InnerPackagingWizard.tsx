import { informativeSpecialProvisionsMap } from "../../server/informativeStatements/informativeStatements";
import {
  hazProContextLookup,
  HazProContextLookupInput,
} from "../../server/lookupFunctions/hazProContextLookup";
import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import { useHazProStore } from "../stores/useHazProStore";
import { PhysicalState } from "../../types";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY_COLOR = "#007bff";
const BORDER_COLOR = "#ccc";

const screenWidth = Dimensions.get("window").width;

const InnerPackagingWizard = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const physicalState =
    state.hazProPreparerContext.hazardousMaterial?.physicalState;
  const packagingParagraph =
    state.hazProPreparerContext.hazardousMaterial?.packagingParagraph || "";

  // Get inner packaging materials from packagingDatabaseV2
  const innerOptions = useMemo(() => {
    const selectedOptionId =
      state.hazProPreparerContext.packaging?.selectedPackagingOptionId;
    if (!packagingParagraph || !selectedOptionId) return [];

    const packagingEntry = packagingDatabaseV2[packagingParagraph];
    if (!packagingEntry) return [];

    const selectedOption = packagingEntry.packagingOptions?.find(
      opt => opt.id === selectedOptionId
    );

    return selectedOption?.innerPackaging?.materials || [];
  }, [
    packagingParagraph,
    state.hazProPreparerContext.packaging?.selectedPackagingOptionId,
  ]);

  console.log("innerOptions: ", JSON.stringify(innerOptions, null, 2));

  const [quantityExceedsLimit, setQuantityExceedsLimit] =
    useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [containerCount, setContainerCount] = useState("");
  const [quantityPerContainer, setQuantityPerContainer] = useState("");
  const [unit, setUnit] = useState(physicalState === "SOLID" ? "kg" : "liters");
  const [selectedInnerPackaging, setSelectedInnerPackaging] = useState("");

  const totalQuantity = useMemo(() => {
    const count = parseFloat(containerCount);
    const per = parseFloat(quantityPerContainer);
    return isNaN(count) || isNaN(per)
      ? 0
      : parseFloat((count * per).toFixed(2));
  }, [containerCount, quantityPerContainer]);

  useEffect(() => {
    if (
      !isNaN(totalQuantity) &&
      store.hazProPreparerContext.packaging?.totalNetMass
    ) {
      store.hazProPreparerContext.packaging.totalNetMass.kg = totalQuantity;
    }
  }, [totalQuantity]);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      if (physicalState === PhysicalState.LIQUID) {
        let liquidQuantityInLiters: number | undefined;
        const packagingType =
          state.hazProPreparerContext.packaging?.packagingType;
        if (
          packagingType === "Single" ||
          packagingType === "Composite" ||
          packagingType === "CompositePackagingWithPlasticInnerReceptacles" ||
          packagingType ===
            "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles"
        ) {
          const qty = parseFloat(quantity);
          if (!isNaN(qty)) {
            liquidQuantityInLiters = unit === "gallons" ? qty * 3.78541 : qty;
          }
        } else if (packagingType === "Combination") {
          const totalQty = parseFloat(totalQuantity);
          if (!isNaN(totalQty)) {
            liquidQuantityInLiters =
              unit === "gallons" ? totalQty * 3.78541 : totalQty;
          }
        }

        const lookupInput: HazProContextLookupInput = {
          context: {
            hazardousMaterial: state.hazProPreparerContext.hazardousMaterial,
            physicalState,
          },
          specialProvisionsMap: informativeSpecialProvisionsMap,
          dotCylinderSpecifications: [],

          liquidQuantityInLiters,
          isCombinationPackaging: packagingType === "Combination",
          innerPackagingMaterial: selectedInnerPackaging || undefined,
        };

        const lookupOutput = hazProContextLookup(lookupInput);
        if (typeof lookupOutput === "string") {
          return;
        }
        store.hazProPreparerContext.lookupFunctionsOutput = lookupOutput;

        console.log("lookupOutput: ", JSON.stringify(lookupOutput, null, 2));
        if (
          typeof lookupOutput !== "string" &&
          typeof lookupOutput.absorbentCushioningCriteria !== "undefined"
        ) {
          store.hazProPreparerContext.absorbentStepRequired = true;
          navigation.navigate("AbsorbentCushioningRequirements");
          return;
        }
      }
      if (store.hazProPreparerContext.packaging?.combinationPackaging) {
        store.hazProPreparerContext.packaging.combinationPackaging.numberOfInnerContainers =
          containerCount;
      }
      if (
        store.hazProPreparerContext.packaging?.combinationPackaging
          ?.innerPackaging
      ) {
        store.hazProPreparerContext.packaging.combinationPackaging.innerPackaging.packagingType =
          selectedInnerPackaging;
      }
      if (store.hazProPreparerContext.packaging?.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.unit = unit;
      }
      navigation.navigate("LabelingAndMarking");
    }
  };
  const handleSaveExit = async () => {
    if (store.hazProPreparerContext.packaging?.combinationPackaging) {
      store.hazProPreparerContext.packaging.combinationPackaging.numberOfInnerContainers =
        containerCount;
    }
    if (
      selectedInnerPackaging &&
      store.hazProPreparerContext.packaging?.combinationPackaging
        ?.innerPackaging
    ) {
      store.hazProPreparerContext.packaging.combinationPackaging.innerPackaging.packagingType =
        selectedInnerPackaging;
    }
    if (store.hazProPreparerContext.packaging?.inputPOPMarking) {
      store.hazProPreparerContext.packaging.inputPOPMarking.unit = unit;
    }
    try {
      await saveCurrentShipment("in-progress");
      navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
    } catch (err) {
      console.log("Save failed, but error is handled by context:", err);
    }
  };

  useEffect(() => {
    let maxAllowed: number = 0;
    if (physicalState === PhysicalState.SOLID) {
      maxAllowed = parseFloat(
        state.hazProPreparerContext.packaging?.inputPOPMarking?.D || "0"
      );
    } else if (physicalState === PhysicalState.LIQUID) {
      maxAllowed = parseFloat(
        state.hazProPreparerContext.packaging?.inputPOPMarking?.E || "0"
      );
    }

    if (!isNaN(totalQuantity) && totalQuantity > maxAllowed) {
      if (!quantityExceedsLimit) {
        setQuantityExceedsLimit(true);
        Alert.alert(
          "Total Quantity Exceeded",
          `The total quantity (${totalQuantity}) exceeds the maximum allowed (${maxAllowed}) for this packaging.`,
          [{ text: "OK" }]
        );
      }
    } else {
      setQuantityExceedsLimit(false);
    }
  }, [containerCount, quantityPerContainer]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.section}>
            <Text style={styles.title}>
              Enter Container and Quantity Details
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of inner containers</Text>
              <TextInput
                value={containerCount}
                onChangeText={setContainerCount}
                keyboardType="numeric"
                style={styles.textInput}
                placeholder="e.g., 2"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity per container</Text>
              <View style={styles.inlineInputs}>
                <TextInput
                  value={quantityPerContainer}
                  onChangeText={setQuantityPerContainer}
                  keyboardType="numeric"
                  placeholder="e.g., 4"
                  placeholderTextColor="#999"
                  style={styles.quantityInput}
                />
                <Picker
                  selectedValue={unit}
                  onValueChange={setUnit}
                  style={styles.unitPicker}
                >
                  {physicalState === "SOLID" && [
                    <Picker.Item key="kg" label="kg" value="kg" />,
                    <Picker.Item key="lbs" label="lbs" value="lbs" />,
                  ]}
                  {physicalState === "LIQUID" && [
                    <Picker.Item key="liters" label="liters" value="liters" />,
                    <Picker.Item
                      key="gallons"
                      label="gallons"
                      value="gallons"
                    />,
                  ]}
                </Picker>
              </View>
            </View>

            <View
              style={
                quantityExceedsLimit
                  ? styles.totalQuantityBoxAlert
                  : styles.totalQuantityBox
              }
            >
              <Text style={styles.totalLabel}>Total Quantity:</Text>
              <Text
                style={[
                  styles.totalValue,
                  quantityExceedsLimit && { color: "red" },
                ]}
              >
                {containerCount && quantityPerContainer
                  ? `${totalQuantity} ${unit}`
                  : "--"}
              </Text>
            </View>
          </View>
        );

      case 1:
        return (
          <View>
            <Text style={styles.title}>Select Inner Packaging Type</Text>
            {innerOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.card,
                  selectedInnerPackaging === opt && styles.cardSelected,
                ]}
                onPress={() => setSelectedInnerPackaging(opt)}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    selectedInnerPackaging === opt && styles.cardTitleSelected,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Inner Packaging Details</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>
                Number of Inner Containers:
              </Text>
              <Text style={styles.summaryValue}>{containerCount}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Quantity Per Container:</Text>
              <Text style={styles.summaryValue}>
                {quantityPerContainer} {unit}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Quantity:</Text>
              <Text style={styles.summaryValue}>
                {parseFloat(quantityPerContainer) * parseInt(containerCount)}{" "}
                {unit}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Inner Packaging Type:</Text>
              <Text style={styles.summaryValue}>{selectedInnerPackaging}</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Step {step + 1} of 3</Text>
          {renderStep()}
          <View style={styles.buttonContainer}>
            {step > 0 ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(step - 1)}
                accessibilityLabel="Back button"
                accessibilityRole="button"
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity
              style={styles.saveExitButton}
              onPress={handleSaveExit}
              accessibilityLabel="Save and exit button"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Save & Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.continueButton,
                ((step === 0 && (!containerCount || quantityExceedsLimit)) ||
                  (step === 1 && !selectedInnerPackaging)) &&
                  styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={
                (step === 0 && (!containerCount || quantityExceedsLimit)) ||
                (step === 1 && !selectedInnerPackaging)
              }
              accessibilityLabel={step === 2 ? "Finish button" : "Next button"}
              accessibilityRole="button"
              accessibilityState={{
                disabled:
                  (step === 0 && (!containerCount || quantityExceedsLimit)) ||
                  (step === 1 && !selectedInnerPackaging),
              }}
            >
              <Text style={styles.buttonText}>
                {step === 2 ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
    gap: 15,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 20,
    color: "#000",
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 55,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 55,
    backgroundColor: "#f9f9f9",
    width: screenWidth * 0.25,
    color: "#000",
  },
  picker: {
    height: 55,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginTop: 10,
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#007bff",
  },
  optionText: {
    color: "#000",
    fontSize: 16,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    textAlign: "right",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: BORDER_COLOR,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  cardSelected: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#e6f0ff",
  },
  cardTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  cardTitleSelected: {
    color: PRIMARY_COLOR,
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlinePicker: {
    height: 55,
    width: screenWidth * 0.15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginLeft: 10,
  },
  totalQuantity: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  inlineInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityInput: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    height: 55,
    color: "#000",
  },
  unitPicker: {
    flex: 0.15,
    height: 55,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 6,
    color: "#000",
    backgroundColor: "#fff",
  },
  totalQuantityBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    elevation: 1,
  },
  totalQuantityBoxAlert: {
    backgroundColor: "#ffe6e6",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    elevation: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    marginTop: 30,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#003366",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    color: "#003366",
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
    backgroundColor: "#0057B7",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
});

export default InnerPackagingWizard;
