import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

enum SafetyRequirementStatus {
  NOT_SELECTED = "not_selected",
  YES = "yes",
  NO = "no",
}

const LithiumBatteriesPrepScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const unid = state.hazProPreparerContext.hazardousMaterial?.unid || "";
  const isMetal = unid === "UN3090";
  const [selectedPackagingMethod, setSelectedPackagingMethod] =
    useState<string>("");
  const [selectedOuterPackaging, setSelectedOuterPackaging] =
    useState<string>("");
  const [innerPackagingDescription, setInnerPackagingDescription] =
    useState<string>("");
  const [quantityOfBatteries, setQuantityOfBatteries] = useState<string>("");
  const [totalWeight, setTotalWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [wattHourRating, setWattHourRating] = useState<string>("");
  const [lithiumContentInGrams, setLithiumContentInGrams] =
    useState<string>("");
  const [meetsUN38Requirements, setMeetsUN38Requirements] =
    useState<SafetyRequirementStatus>(SafetyRequirementStatus.NOT_SELECTED);
  const [hasShortCircuitProtection, setHasShortCircuitProtection] =
    useState<SafetyRequirementStatus>(SafetyRequirementStatus.NOT_SELECTED);
  const [hasSafetyVent, setHasSafetyVent] = useState<SafetyRequirementStatus>(
    SafetyRequirementStatus.NOT_SELECTED
  );
  const [hasReverseCurrentProtection, setHasReverseCurrentProtection] =
    useState<SafetyRequirementStatus>(SafetyRequirementStatus.NOT_SELECTED);
  const [isDefectiveOrDamaged, setIsDefectiveOrDamaged] =
    useState<SafetyRequirementStatus>(SafetyRequirementStatus.NOT_SELECTED);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [meetsExceptedQuantity, setMeetsExceptedQuantity] =
    useState<boolean>(false);

  const packagingOptions = [
    { label: "Combination Packaging", value: "combination" },
    { label: "Large Packaging (Single Battery)", value: "large" },
    { label: "Batteries Exceeding 12kg", value: "heavy" },
  ];

  const getOuterPackagingOptions = () => {
    switch (selectedPackagingMethod) {
      case "combination":
        return [
          { label: "Metal Box (4A)", value: "Metal Box (4A)" },
          { label: "Metal Box (4B)", value: "Metal Box (4B)" },
          { label: "Metal Box (4C)", value: "Metal Box (4C)" },
          { label: "Wooden Box (4C1)", value: "Wooden Box (4C1)" },
          { label: "Wooden Box (4C2)", value: "Wooden Box (4C2)" },
          { label: "Wooden Box (4D)", value: "Wooden Box (4D)" },
          { label: "Wooden Box (4F)", value: "Wooden Box (4F)" },
          { label: "Fiberboard Box (4G)", value: "Fiberboard Box (4G)" },
          {
            label: "Solid Plastic Box (4H1)",
            value: "Solid Plastic Box (4H1)",
          },
          {
            label: "Solid Plastic Box (4H2)",
            value: "Solid Plastic Box (4H2)",
          },
          { label: "Metal Drum (1A2)", value: "Metal Drum (1A2)" },
          { label: "Metal Drum (1B2)", value: "Metal Drum (1B2)" },
          { label: "Metal Drum (1N2)", value: "Metal Drum (1N2)" },
          { label: "Fiber Drum (1G)", value: "Fiber Drum (1G)" },
          { label: "Plastic Drum (1H2)", value: "Plastic Drum (1H2)" },
          { label: "Plywood Drum (1D)", value: "Plywood Drum (1D)" },
          { label: "Plastic Jerrican (3H2)", value: "Plastic Jerrican (3H2)" },
          { label: "Metal Jerrican (3A2)", value: "Metal Jerrican (3A2)" },
          { label: "Metal Jerrican (3B2)", value: "Metal Jerrican (3B2)" },
        ];
      case "large":
        return [
          {
            label: "Metal with Non-Conductive Lining (50A)",
            value: "Metal with Non-Conductive Lining (50A)",
          },
          {
            label: "Metal with Non-Conductive Lining (50B)",
            value: "Metal with Non-Conductive Lining (50B)",
          },
          {
            label: "Metal with Non-Conductive Lining (50C)",
            value: "Metal with Non-Conductive Lining (50C)",
          },
          { label: "Rigid Plastic (50H)", value: "Rigid Plastic (50H)" },
          { label: "Wooden (50C)", value: "Wooden (50C)" },
          { label: "Wooden (50D)", value: "Wooden (50D)" },
          { label: "Wooden (50F)", value: "Wooden (50F)" },
          { label: "Rigid Fiberboard (50G)", value: "Rigid Fiberboard (50G)" },
        ];
      case "heavy":
        return [
          { label: "Strong Outer Packaging", value: "Strong Outer Packaging" },
          { label: "Protective Enclosure", value: "Protective Enclosure" },
          { label: "Pallet", value: "Pallet" },
        ];
      default:
        return [];
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishAndSave();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveAndExit = () => {
    saveLithiumBatteryData();
    saveCurrentShipment("in-progress");
    navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const checkExceptedQuantityConditions = (): boolean => {
    if (isMetal) {
      const lithiumContent = parseFloat(lithiumContentInGrams) || 0;
      const batteryCount = parseInt(quantityOfBatteries) || 0;
      const weightInKg =
        weightUnit === "kg"
          ? parseFloat(totalWeight) || 0
          : (parseFloat(totalWeight) || 0) * 0.45359237;

      if (lithiumContent > 2) {
        return false;
      }

      if (lithiumContent > 0.3 && lithiumContent <= 2 && batteryCount > 2) {
        return false;
      }

      if (lithiumContent <= 0.3 && weightInKg > 2.5) {
        return false;
      }

      return true;
    } else {
      const wattHour = parseFloat(wattHourRating) || 0;
      const weightInKg =
        weightUnit === "kg"
          ? parseFloat(totalWeight) || 0
          : (parseFloat(totalWeight) || 0) * 0.45359237;

      if (wattHour > 100) {
        return false;
      }

      if (weightInKg > 5) {
        return false;
      }

      return true;
    }
  };

  useEffect(() => {
    if (
      quantityOfBatteries &&
      totalWeight &&
      (isMetal ? lithiumContentInGrams : wattHourRating)
    ) {
      setMeetsExceptedQuantity(checkExceptedQuantityConditions());
    }
  }, [
    quantityOfBatteries,
    totalWeight,
    weightUnit,
    lithiumContentInGrams,
    wattHourRating,
    isMetal,
  ]);

  const saveLithiumBatteryData = () => {
    const lithiumBatteryData = {
      batteryType: isMetal ? "lithium_metal" : "lithium_ion",
      packagingMethod: selectedPackagingMethod,
      outerPackagingType: selectedOuterPackaging,
      innerPackagingDescription:
        selectedPackagingMethod === "combination"
          ? innerPackagingDescription
          : "",
      quantityOfBatteries: parseInt(quantityOfBatteries) || 0,
      totalWeight: {
        value: parseFloat(totalWeight) || 0,
        unit: weightUnit,
      },
      safetyFeatures: {
        shortCircuitProtection:
          hasShortCircuitProtection === SafetyRequirementStatus.YES,
        safetyVent: hasSafetyVent === SafetyRequirementStatus.YES,
        reverseCurrentProtection:
          hasReverseCurrentProtection === SafetyRequirementStatus.YES,
      },
      meetsUN38Requirements:
        meetsUN38Requirements === SafetyRequirementStatus.YES,
      isDefectiveOrDamaged:
        isDefectiveOrDamaged === SafetyRequirementStatus.YES,
      specialInstructions,
      handlingInstructions:
        "Protect from damage. Prevent short circuits. Keep away from other hazardous materials.",
      wattHourRating: parseFloat(wattHourRating) || 0,
      lithiumContentInGrams: parseFloat(lithiumContentInGrams) || 0,
    };

    const lithiumBatteryExceptionParams = {
      wattHourRating: parseFloat(wattHourRating) || 0,
      quantityIn_Kgs:
        weightUnit === "kg"
          ? parseFloat(totalWeight) || 0
          : (parseFloat(totalWeight) || 0) * 0.45359237, // Convert lbs to kg
      lithiumContentInGrams: parseFloat(lithiumContentInGrams) || 0,
      numberOfLithiumBatteries: parseInt(quantityOfBatteries) || 0,
    };

    const meetsExceptedQuantityConditions = checkExceptedQuantityConditions();

    store.hazProPreparerContext.lithiumBatteryData = lithiumBatteryData;
    store.hazProPreparerContext.lithiumBatteryExceptionParams =
      lithiumBatteryExceptionParams;

    store.hazProPreparerContext.isLithiumBatteryExceptedQuantity =
      meetsExceptedQuantityConditions;
  };

  const finishAndSave = () => {
    saveLithiumBatteryData();

    const completedSubsteps =
      state.hazProPreparerContext.completedSubsteps || [];
    if (!completedSubsteps.includes("LithiumBatteries")) {
      const updatedSubsteps = [...completedSubsteps, "LithiumBatteries"];
      store.hazProPreparerContext.completedSubsteps = updatedSubsteps;
    }

    navigation.navigate("LabelingAndMarking");
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return selectedPackagingMethod !== "";
      case 1:
        return (
          selectedOuterPackaging !== "" &&
          (selectedPackagingMethod !== "combination" ||
            innerPackagingDescription.trim() !== "")
        );
      case 2:
        const hasValidQuantity =
          quantityOfBatteries.trim() !== "" &&
          totalWeight.trim() !== "" &&
          !isNaN(parseInt(quantityOfBatteries)) &&
          !isNaN(parseFloat(totalWeight));
        if (isMetal) {
          return (
            hasValidQuantity &&
            lithiumContentInGrams.trim() !== "" &&
            !isNaN(parseFloat(lithiumContentInGrams))
          );
        } else {
          return (
            hasValidQuantity &&
            wattHourRating.trim() !== "" &&
            !isNaN(parseFloat(wattHourRating))
          );
        }
      case 3:
        return (
          meetsUN38Requirements === SafetyRequirementStatus.YES &&
          hasShortCircuitProtection === SafetyRequirementStatus.YES &&
          hasSafetyVent === SafetyRequirementStatus.YES &&
          hasReverseCurrentProtection === SafetyRequirementStatus.YES &&
          isDefectiveOrDamaged === SafetyRequirementStatus.NO
        );
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <Text style={styles.stepText}>Step {step + 1} of 4</Text>
      <View style={styles.stepDots}>
        {[0, 1, 2, 3].map(index => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              index === step ? styles.activeStepIndicator : null,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderPackagingMethodStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        Select Packaging Method for {isMetal ? "Lithium Metal" : "Lithium Ion"}{" "}
        Batteries
      </Text>

      {packagingOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionCard,
            selectedPackagingMethod === option.value && styles.selectedCard,
          ]}
          onPress={() => setSelectedPackagingMethod(option.value)}
        >
          <View style={styles.optionCardContent}>
            <View style={styles.cardTextContainer}>
              <Text
                style={[
                  styles.optionCardTitle,
                  selectedPackagingMethod === option.value &&
                    styles.selectedCardText,
                ]}
              >
                {option.label}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPackagingOptionsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Outer Packaging</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedOuterPackaging}
          onValueChange={value => setSelectedOuterPackaging(value)}
          style={[
            styles.picker,
            { color: selectedOuterPackaging ? "#212529" : "#6c757d" },
          ]}
        >
          <Picker.Item
            label="Select Outer Packaging Type"
            value=""
            color="#6c757d"
          />
          {getOuterPackagingOptions().map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      {selectedPackagingMethod === "combination" && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Inner Packaging Description</Text>
          <TextInput
            style={styles.textInput}
            value={innerPackagingDescription}
            onChangeText={setInnerPackagingDescription}
            placeholder="Describe non-metallic inner packaging"
          />
          <Text style={styles.helperText}>
            Must completely enclose the battery and prevent contact with
            conductive materials
          </Text>
        </View>
      )}
    </View>
  );

  const renderQuantityStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Battery Quantity and Weight</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Number of Batteries/Cells *</Text>
        <TextInput
          style={styles.textInput}
          value={quantityOfBatteries}
          onChangeText={setQuantityOfBatteries}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Total Weight *</Text>
        <View style={styles.weightInputRow}>
          <TextInput
            style={styles.weightInput}
            value={totalWeight}
            onChangeText={setTotalWeight}
            keyboardType="numeric"
            placeholder="Enter weight"
          />
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === "kg" && styles.selectedUnitButton,
              ]}
              onPress={() => setWeightUnit("kg")}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  weightUnit === "kg" && styles.selectedUnitButtonText,
                ]}
              >
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === "lbs" && styles.selectedUnitButton,
              ]}
              onPress={() => setWeightUnit("lbs")}
            >
              <Text
                style={[
                  styles.unitButtonText,
                  weightUnit === "lbs" && styles.selectedUnitButtonText,
                ]}
              >
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {parseFloat(totalWeight) > 30 &&
          selectedPackagingMethod !== "heavy" && (
            <Text style={styles.warningText}>
              Warning: Packages exceeding 30 kg (66 lbs) require special
              handling
            </Text>
          )}
      </View>

      {!isMetal && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Watt-Hour Rating (Wh) *</Text>
          <TextInput
            style={styles.textInput}
            value={wattHourRating}
            onChangeText={setWattHourRating}
            keyboardType="numeric"
            placeholder="Enter Watt-hour rating"
          />
          <Text style={styles.helperText}>
            For lithium-ion batteries (UN3480, UN3481). Excepted quantities
            require ≤ 100 Wh.
          </Text>
        </View>
      )}

      {isMetal && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Lithium Content (grams) *</Text>
          <TextInput
            style={styles.textInput}
            value={lithiumContentInGrams}
            onChangeText={setLithiumContentInGrams}
            keyboardType="numeric"
            placeholder="Enter lithium content in grams"
          />
          <Text style={styles.helperText}>
            For lithium metal batteries (UN3090, UN3091). Excepted quantities
            require ≤ 2g.
          </Text>
        </View>
      )}

      <View style={[styles.infoPanel]}>
        <Text style={styles.infoPanelTitle}>
          Excepted Quantity Determination
        </Text>
        <Text style={styles.infoPanelText}>
          {isMetal
            ? "Lithium metal batteries (UN3090) may qualify for excepted quantity shipping when:\n• Lithium content is ≤ 2g\n• For batteries with 0.3g-2g content: Maximum 2 batteries per package\n• For batteries with ≤ 0.3g content: Maximum net quantity 2.5kg per package"
            : "Lithium-ion batteries (UN3480) may qualify for excepted quantity shipping when:\n• Watt-hour rating is ≤ 100Wh\n• Net quantity limits apply per package based on Table A3.5"}
        </Text>

        {quantityOfBatteries &&
          totalWeight &&
          (isMetal ? lithiumContentInGrams : wattHourRating) && (
            <View
              style={[
                styles.exceptedQuantityStatus,
                meetsExceptedQuantity
                  ? styles.exceptedQuantityStatusYes
                  : styles.exceptedQuantityStatusNo,
              ]}
            >
              <Text style={styles.exceptedQuantityStatusText}>
                {meetsExceptedQuantity
                  ? "✓ Based on entered values, this shipment qualifies for excepted quantity"
                  : "✕ Based on entered values, this shipment does not qualify for excepted quantity"}
              </Text>
            </View>
          )}
      </View>
    </View>
  );

  const renderSafetyRequirementsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Safety Requirements</Text>

      {/* UN 38.3 Test Requirements */}
      <View style={styles.safetyRequirementCard}>
        <View style={styles.safetyRequirementRow}>
          <Text style={styles.safetyRequirementText}>
            Meets UN Manual of Tests and Criteria requirements (38.3)
          </Text>
          <View style={styles.yesNoButtonContainer}>
            <TouchableOpacity
              style={[
                styles.responseButton,
                meetsUN38Requirements === SafetyRequirementStatus.YES &&
                  styles.yesButtonActive,
              ]}
              onPress={() =>
                setMeetsUN38Requirements(SafetyRequirementStatus.YES)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  meetsUN38Requirements === SafetyRequirementStatus.YES &&
                    styles.responseButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.responseButton,
                meetsUN38Requirements === SafetyRequirementStatus.NO &&
                  styles.noButtonActive,
              ]}
              onPress={() =>
                setMeetsUN38Requirements(SafetyRequirementStatus.NO)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  meetsUN38Requirements === SafetyRequirementStatus.NO &&
                    styles.responseButtonTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {meetsUN38Requirements === SafetyRequirementStatus.NO && (
          <Text style={styles.errorText}>
            Batteries must meet UN Manual of Tests and Criteria requirements for
            air transport
          </Text>
        )}
      </View>

      {/* Short Circuit Protection */}
      <View style={styles.safetyRequirementCard}>
        <View style={styles.safetyRequirementRow}>
          <Text style={styles.safetyRequirementText}>
            Has protection against external short circuits
          </Text>
          <View style={styles.yesNoButtonContainer}>
            <TouchableOpacity
              style={[
                styles.responseButton,
                hasShortCircuitProtection === SafetyRequirementStatus.YES &&
                  styles.yesButtonActive,
              ]}
              onPress={() =>
                setHasShortCircuitProtection(SafetyRequirementStatus.YES)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  hasShortCircuitProtection === SafetyRequirementStatus.YES &&
                    styles.responseButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.responseButton,
                hasShortCircuitProtection === SafetyRequirementStatus.NO &&
                  styles.noButtonActive,
              ]}
              onPress={() =>
                setHasShortCircuitProtection(SafetyRequirementStatus.NO)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  hasShortCircuitProtection === SafetyRequirementStatus.NO &&
                    styles.responseButtonTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {hasShortCircuitProtection === SafetyRequirementStatus.NO && (
          <Text style={styles.errorText}>
            Short circuit protection is required for all lithium batteries
          </Text>
        )}
      </View>

      {/* Safety Venting Device */}
      <View style={styles.safetyRequirementCard}>
        <View style={styles.safetyRequirementRow}>
          <Text style={styles.safetyRequirementText}>
            Has safety venting device or protection against violent rupture
          </Text>
          <View style={styles.yesNoButtonContainer}>
            <TouchableOpacity
              style={[
                styles.responseButton,
                hasSafetyVent === SafetyRequirementStatus.YES &&
                  styles.yesButtonActive,
              ]}
              onPress={() => setHasSafetyVent(SafetyRequirementStatus.YES)}
            >
              <Text
                style={[
                  styles.responseButtonText,
                  hasSafetyVent === SafetyRequirementStatus.YES &&
                    styles.responseButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.responseButton,
                hasSafetyVent === SafetyRequirementStatus.NO &&
                  styles.noButtonActive,
              ]}
              onPress={() => setHasSafetyVent(SafetyRequirementStatus.NO)}
            >
              <Text
                style={[
                  styles.responseButtonText,
                  hasSafetyVent === SafetyRequirementStatus.NO &&
                    styles.responseButtonTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {hasSafetyVent === SafetyRequirementStatus.NO && (
          <Text style={styles.errorText}>
            Safety venting or rupture protection is required
          </Text>
        )}
      </View>

      {/* Reverse Current Protection */}
      <View style={styles.safetyRequirementCard}>
        <View style={styles.safetyRequirementRow}>
          <Text style={styles.safetyRequirementText}>
            Has protection against dangerous reverse current flow
          </Text>
          <View style={styles.yesNoButtonContainer}>
            <TouchableOpacity
              style={[
                styles.responseButton,
                hasReverseCurrentProtection === SafetyRequirementStatus.YES &&
                  styles.yesButtonActive,
              ]}
              onPress={() =>
                setHasReverseCurrentProtection(SafetyRequirementStatus.YES)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  hasReverseCurrentProtection === SafetyRequirementStatus.YES &&
                    styles.responseButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.responseButton,
                hasReverseCurrentProtection === SafetyRequirementStatus.NO &&
                  styles.noButtonActive,
              ]}
              onPress={() =>
                setHasReverseCurrentProtection(SafetyRequirementStatus.NO)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  hasReverseCurrentProtection === SafetyRequirementStatus.NO &&
                    styles.responseButtonTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {hasReverseCurrentProtection === SafetyRequirementStatus.NO && (
          <Text style={styles.errorText}>
            Protection against dangerous reverse current flow is required
          </Text>
        )}
      </View>

      {/* Defective or Damaged */}
      <View style={styles.safetyRequirementCard}>
        <View style={styles.safetyRequirementRow}>
          <Text style={styles.safetyRequirementText}>
            Battery is defective or damaged
          </Text>
          <View style={styles.yesNoButtonContainer}>
            <TouchableOpacity
              style={[
                styles.responseButton,
                isDefectiveOrDamaged === SafetyRequirementStatus.YES &&
                  styles.noButtonActive, // Using noButtonActive for "Yes" here as this is negative
              ]}
              onPress={() =>
                setIsDefectiveOrDamaged(SafetyRequirementStatus.YES)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  isDefectiveOrDamaged === SafetyRequirementStatus.YES &&
                    styles.responseButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.responseButton,
                isDefectiveOrDamaged === SafetyRequirementStatus.NO &&
                  styles.yesButtonActive, // Using yesButtonActive for "No" here as this is positive
              ]}
              onPress={() =>
                setIsDefectiveOrDamaged(SafetyRequirementStatus.NO)
              }
            >
              <Text
                style={[
                  styles.responseButtonText,
                  isDefectiveOrDamaged === SafetyRequirementStatus.NO &&
                    styles.responseButtonTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isDefectiveOrDamaged === SafetyRequirementStatus.YES && (
          <View style={styles.warningPanel}>
            <Text style={styles.warningTitle}>
              WARNING: Transport Prohibited
            </Text>
            <Text style={styles.warningMessage}>
              Defective or damaged lithium batteries that could produce a
              dangerous evolution of heat, fire, or short circuit are PROHIBITED
              from air transport.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Special Handling Instructions (Optional)
        </Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Enter any special handling instructions"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Excepted Quantity Summary */}
      <View
        style={[
          styles.exceptedQuantityStatusSummary,
          meetsExceptedQuantity
            ? styles.exceptedQuantityStatusYes
            : styles.exceptedQuantityStatusNo,
        ]}
      >
        <Text style={styles.exceptedQuantityStatusTitle}>
          {meetsExceptedQuantity
            ? "Excepted Quantity Status: QUALIFIED"
            : "Excepted Quantity Status: NOT QUALIFIED"}
        </Text>
        <Text style={styles.exceptedQuantityStatusDescription}>
          {meetsExceptedQuantity
            ? "This lithium battery shipment meets all excepted quantity requirements based on the information provided."
            : "This lithium battery shipment does not meet all excepted quantity requirements. Standard dangerous goods regulations apply."}
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    switch (step) {
      case 0:
        return renderPackagingMethodStep();
      case 1:
        return renderPackagingOptionsStep();
      case 2:
        return renderQuantityStep();
      case 3:
        return renderSafetyRequirementsStep();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <StepIndicator />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.briefingPanel}>
          <Text style={styles.briefingTitle}>
            Lithium Battery Transport Requirements
          </Text>
          <Text style={styles.briefingText}>
            Lithium cells and batteries must meet UN Manual of Tests and
            Criteria requirements. Batteries must have protection against short
            circuits and violent rupture.
          </Text>
        </View>

        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={handleSaveAndExit}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isStepValid() && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={!isStepValid()}
        >
          <Text style={styles.buttonText}>
            {step === 3 ? "Finish" : "Next"}
          </Text>
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
    backgroundColor: "#f8f9fa",
    padding: 16,
    margin: 5,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0066cc",
  },
  briefingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#212529",
  },
  briefingText: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  stepIndicatorContainer: {
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  stepText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 8,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dee2e6",
    marginHorizontal: 4,
  },
  activeStepIndicator: {
    backgroundColor: "#0066cc",
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212529",
  },
  optionCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
  },
  selectedCard: {
    borderColor: "#0066cc",
    backgroundColor: "#e6f2ff",
  },
  optionCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
  },
  optionCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  selectedCardText: {
    color: "#0066cc",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#212529",
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  multilineInput: {
    height: 96,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  helperText: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  weightInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    marginRight: 12,
  },
  unitSelector: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    overflow: "hidden",
  },
  unitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
  },
  selectedUnitButton: {
    backgroundColor: colors.blue,
  },
  unitButtonText: {
    fontSize: 16,
    color: "#212529",
  },
  selectedUnitButtonText: {
    color: "#ffffff",
  },
  warningText: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
  },
  safetyRequirementCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
  },
  safetyRequirementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  safetyRequirementText: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    marginRight: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginTop: 8,
  },
  warningPanel: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fff3cd",
    borderRadius: 4,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 4,
  },
  warningMessage: {
    fontSize: 14,
    color: "#856404",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: "row",
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
    backgroundColor: "#6c757d",
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
  yesNoButtonContainer: {
    flexDirection: "row",
    minWidth: 160,
  },
  responseButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#dee2e6",
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  yesButtonActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  noButtonActive: {
    backgroundColor: colors.noRed,
    borderColor: colors.noRed,
  },
  responseButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  responseButtonTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  infoPanel: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#212529",
  },
  infoPanelText: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  exceptedQuantityStatus: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 4,
  },
  exceptedQuantityStatusYes: {
    borderColor: colors.green,
    backgroundColor: "#dff3e6",
  },
  exceptedQuantityStatusNo: {
    borderColor: colors.noRed,
    backgroundColor: "#fff3e6",
  },
  exceptedQuantityStatusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212529",
  },
  exceptedQuantityStatusSummary: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 4,
  },
  exceptedQuantityStatusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#212529",
  },
  exceptedQuantityStatusDescription: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 15,
  },
  picker: {
    height: 55,
    width: "100%",
  },
});

export default LithiumBatteriesPrepScreen;
