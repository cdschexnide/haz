import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface DryIceQuantityLimit {
  pounds: number;
  kilograms: number;
}

export const C17DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  "Two Packs - High-Flow @ 35,000 ft": { pounds: 3430, kilograms: 1556 },
  "Two Packs - High-Flow @ ≤ 10,000 ft": { pounds: 2080, kilograms: 943 },
  "Two Packs - Normal-Flow @ 35,000 ft": { pounds: 1880, kilograms: 853 },
  "Two Packs - Normal-Flow @ ≤ 10,000 ft": { pounds: 1040, kilograms: 472 },
  "One Pack - High-Flow @ 35,000 ft": { pounds: 1720, kilograms: 780 },
  "One Pack - High-Flow (Holding) @ 10,000 ft": {
    pounds: 1040,
    kilograms: 472,
  },
  "With passengers in cargo compartment (any flow)": {
    pounds: 1040,
    kilograms: 472,
  },
};

export const C5DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  "Cruise (Mach 0.5 and up) - ≤ 30,000 ft (Note 1)": {
    pounds: 4700,
    kilograms: 2132,
  },
  "Cruise (Mach 0.6 and up) - ≤ 30,000 ft (Note 1)": {
    pounds: 3120,
    kilograms: 1415,
  },
  "Non-pressurized flight - ≤ 10,000 ft (Note 2)": {
    pounds: 6500,
    kilograms: 2948,
  },
  "Ground ops with one APU running (Note 3)": { pounds: 2950, kilograms: 1338 },
};

export const KC10DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  /* 27-pallet all-cargo configuration, no environmental curtain */
  "No curtain - both packs operating": { pounds: 2295, kilograms: 1041 },
  "No curtain - one pack operating": { pounds: 1251, kilograms: 568 },

  /* Environmental curtain installed at station 615 */
  "Curtain at STA 615 - both packs operating": { pounds: 1782, kilograms: 808 },
  "Curtain at STA 615 - one pack operating": { pounds: 969, kilograms: 440 },

  /* Environmental curtain installed at station 879 */
  "Curtain at STA 879 - both packs operating": { pounds: 1204, kilograms: 546 },
  "Curtain at STA 879 - one pack operating": { pounds: 653, kilograms: 296 },
};

export const KC135DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  maximumAmount: { pounds: 200, kilograms: 91 },
};

const DryIcePrepScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const { navigate } = useNavigationRef();
  const [packagingType, setPackagingType] = useState<string>("");
  const [packagingTypeOption, setPackagingTypeOption] = useState<string>("");
  const [customPackagingType, setCustomPackagingType] = useState<string>("");
  const [dryIceQuantity, setDryIceQuantity] = useState<string>("");
  const [quantityUnit, setQuantityUnit] = useState<"kg" | "lbs">("lbs");
  const [containedMaterial, setContainedMaterial] = useState<string>("");
  const [isAircraftPressurized, setIsAircraftPressurized] =
    useState<boolean>(true);
  const [aircraftType, setAircraftType] = useState<string>("");
  const [aircraftVolume, setAircraftVolume] = useState<string>("");
  const [airChangesPerHour, setAirChangesPerHour] = useState<string>("");
  const [calculatedLimit, setCalculatedLimit] = useState<number | null>(null);
  const [maxAllowedKg, setMaxAllowedKg] = useState<number>(0);
  const [maxAllowedLbs, setMaxAllowedLbs] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [isVentingProvided, setIsVentingProvided] = useState<boolean>(true);
  const [showAircraftConfigOptions, setShowAircraftConfigOptions] =
    useState<boolean>(false);
  const [selectedAircraftConfig, setSelectedAircraftConfig] =
    useState<string>("");
  const [hasAircraftInfo, setHasAircraftInfo] = useState<boolean | null>(null);
  const [showUnsupportedMessage, setShowUnsupportedMessage] =
    useState<boolean>(false);
  const [availableConfigurations, setAvailableConfigurations] = useState<
    string[]
  >([]);
  const [minAircraftLimit, setMinAircraftLimit] = useState<number>(0);
  const [quantityExceedsMinLimit, setQuantityExceedsMinLimit] =
    useState<boolean>(false);
  const [showOtherAircraftPrompt, setShowOtherAircraftPrompt] =
    useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [exceededQuantityLimit, setExceededQuantityLimit] =
    useState<boolean>(false);
  const [quantityWarning, setQuantityWarning] = useState<string>("");

  const findMinQuantityLimit = (aircraftTypeValue: string): number => {
    let minLimit = Number.MAX_SAFE_INTEGER;

    switch (aircraftTypeValue) {
      case "C-17":
        Object.values(C17DryIceQuantityLimits).forEach(limit => {
          if (limit.pounds < minLimit) minLimit = limit.pounds;
        });
        break;
      case "C-5":
        Object.values(C5DryIceQuantityLimits).forEach(limit => {
          if (limit.pounds < minLimit) minLimit = limit.pounds;
        });
        break;
      case "KC-10":
        Object.values(KC10DryIceQuantityLimits).forEach(limit => {
          if (limit.pounds < minLimit) minLimit = limit.pounds;
        });
        break;
      case "KC-135":
        minLimit = KC135DryIceQuantityLimits.maximumAmount.pounds;
        break;
      case "Other":
        minLimit = 440;
        break;
      case "AMC Contract":
        minLimit = 440;
        break;
      case "C-130":
        minLimit = 600;
        break;
      default:
        minLimit = 0;
    }

    return minLimit;
  };

  const getValidConfigurations = (
    aircraftTypeValue: string,
    quantityValue: number
  ): string[] => {
    const validConfigs: string[] = [];

    if (!quantityValue) return validConfigs;

    const quantityInLbs =
      quantityUnit === "lbs"
        ? parseFloat(quantityValue.toString())
        : parseFloat(quantityValue.toString()) / 0.453592;

    switch (aircraftTypeValue) {
      case "C-17":
        Object.entries(C17DryIceQuantityLimits).forEach(([config, limit]) => {
          if (limit.pounds >= quantityInLbs) {
            validConfigs.push(config);
          }
        });
        break;
      case "C-5":
        Object.entries(C5DryIceQuantityLimits).forEach(([config, limit]) => {
          if (limit.pounds >= quantityInLbs) {
            validConfigs.push(config);
          }
        });
        break;
      case "KC-10":
        Object.entries(KC10DryIceQuantityLimits).forEach(([config, limit]) => {
          if (limit.pounds >= quantityInLbs) {
            validConfigs.push(config);
          }
        });
        break;
    }

    return validConfigs;
  };

  const handlePackagingTypeOptionChange = (option: string) => {
    setPackagingTypeOption(option);

    if (option !== "Other") {
      setPackagingType(option);
      setCustomPackagingType("");
      if (!store.hazProPreparerContext.dryIceData) {
        store.hazProPreparerContext.dryIceData = {};
      }
      store.hazProPreparerContext.dryIceData.packagingType = option;
    } else if (customPackagingType) {
      setPackagingType(customPackagingType);
      if (!store.hazProPreparerContext.dryIceData) {
        store.hazProPreparerContext.dryIceData = {};
      }
      store.hazProPreparerContext.dryIceData.packagingType =
        customPackagingType;
    } else {
      setPackagingType("");
    }
  };

  const handleCustomPackagingTypeChange = (value: string) => {
    setCustomPackagingType(value);
    setPackagingType(value);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.packagingType = value;
  };

  const updateQuantityWarning = (
    quantityValue: string,
    unit: "kg" | "lbs",
    aircraft: string,
    configuration: string
  ) => {
    let localMaxAllowedKg = 999999;
    let localMaxAllowedLbs = 999999;
    let warningMessage = "";

    switch (aircraft) {
      case "C-17":
        if (configuration && C17DryIceQuantityLimits[configuration]) {
          localMaxAllowedKg = C17DryIceQuantityLimits[configuration].kilograms;
          localMaxAllowedLbs = C17DryIceQuantityLimits[configuration].pounds;
          warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        } else {
          localMaxAllowedKg = 472;
          localMaxAllowedLbs = 1040;
        }
        break;
      case "C-5":
        if (configuration && C5DryIceQuantityLimits[configuration]) {
          localMaxAllowedKg = C5DryIceQuantityLimits[configuration].kilograms;
          localMaxAllowedLbs = C5DryIceQuantityLimits[configuration].pounds;
          warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        } else {
          localMaxAllowedKg = 1338;
          localMaxAllowedLbs = 2950;
        }
        break;
      case "KC-10":
        if (configuration && KC10DryIceQuantityLimits[configuration]) {
          localMaxAllowedKg = KC10DryIceQuantityLimits[configuration].kilograms;
          localMaxAllowedLbs = KC10DryIceQuantityLimits[configuration].pounds;
          warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        } else {
          localMaxAllowedKg = 296;
          localMaxAllowedLbs = 653;
        }
        break;
      case "KC-135":
        localMaxAllowedKg = KC135DryIceQuantityLimits.maximumAmount.kilograms;
        localMaxAllowedLbs = KC135DryIceQuantityLimits.maximumAmount.pounds;
        warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        break;
      case "Other":
        if (calculatedLimit) {
          localMaxAllowedKg = Math.floor(calculatedLimit * 0.453592);
          localMaxAllowedLbs = calculatedLimit;
          warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        } else {
          warningMessage =
            "Please provide aircraft volume and air changes per hour to calculate limits.";
        }
        break;
      case "AMC Contract":
        localMaxAllowedKg = 200;
        localMaxAllowedLbs = 440;
        warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        break;
      case "C-130":
        localMaxAllowedKg = 272;
        localMaxAllowedLbs = 600;
        warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        break;
      default:
        warningMessage =
          "Please select an aircraft type to determine quantity limits.";
    }

    setMaxAllowedKg(localMaxAllowedKg);
    setMaxAllowedLbs(localMaxAllowedLbs);

    if (quantityValue) {
      const quantity = parseFloat(quantityValue);
      const quantityInKg = unit === "kg" ? quantity : quantity * 0.453592;
      const quantityInLbs = unit === "lbs" ? quantity : quantity / 0.453592;

      if (!isNaN(quantity)) {
        const maxAllowed =
          unit === "kg" ? localMaxAllowedKg : localMaxAllowedLbs;
        const quantityToCheck = unit === "kg" ? quantityInKg : quantityInLbs;

        if (quantityToCheck > maxAllowed) {
          setExceededQuantityLimit(true);
          setQuantityWarning(`EXCEEDED: ${warningMessage}`);
        } else if (quantityInKg > 25) {
          setExceededQuantityLimit(false);
          setQuantityWarning(
            `Caution: Quantities over 25 kg require special handling. ${warningMessage}`
          );
        } else {
          setExceededQuantityLimit(false);
          setQuantityWarning(warningMessage);
        }
      }
    } else {
      setExceededQuantityLimit(false);
      setQuantityWarning(warningMessage);
    }
  };

  useEffect(() => {
    const isPackagingValid =
      packagingType.trim() !== "" &&
      (packagingTypeOption !== "Other" || customPackagingType.trim() !== "");
    const isQuantityValid =
      dryIceQuantity.trim() !== "" && !exceededQuantityLimit;

    let isAircraftValid = true;

    if (isAircraftPressurized) {
      if (!aircraftType.trim()) {
        isAircraftValid = false;
      } else if (
        quantityExceedsMinLimit &&
        showAircraftConfigOptions &&
        !selectedAircraftConfig.trim()
      ) {
        isAircraftValid = false;
      } else if (aircraftType === "Other") {
        if (showOtherAircraftPrompt) {
          if (hasAircraftInfo === null) {
            isAircraftValid = false;
          } else if (hasAircraftInfo === false) {
            isAircraftValid = false;
          } else if (hasAircraftInfo === true) {
            isAircraftValid =
              !!aircraftVolume.trim() && !!airChangesPerHour.trim();
          }
        }
      }
    }

    setIsFormValid(
      isPackagingValid &&
        isQuantityValid &&
        isAircraftValid &&
        isVentingProvided &&
        !showUnsupportedMessage
    );
  }, [
    packagingType,
    packagingTypeOption,
    customPackagingType,
    dryIceQuantity,
    containedMaterial,
    aircraftType,
    selectedAircraftConfig,
    aircraftVolume,
    airChangesPerHour,
    isAircraftPressurized,
    exceededQuantityLimit,
    isVentingProvided,
    showAircraftConfigOptions,
    quantityExceedsMinLimit,
    hasAircraftInfo,
    showOtherAircraftPrompt,
    showUnsupportedMessage,
  ]);

  const handleDryIceQuantityChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setDryIceQuantity(numericValue);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.quantity = numericValue;

    setHasAircraftInfo(null);
    setShowUnsupportedMessage(false);

    if (aircraftType && numericValue) {
      const quantityValue = parseFloat(numericValue);
      const quantityInLbs =
        quantityUnit === "lbs" ? quantityValue : quantityValue / 0.453592;

      const minLimit = findMinQuantityLimit(aircraftType);
      setMinAircraftLimit(minLimit);

      const exceeds = quantityInLbs > minLimit;
      setQuantityExceedsMinLimit(exceeds);

      const validConfigs = getValidConfigurations(aircraftType, quantityValue);
      setAvailableConfigurations(validConfigs);

      if (
        validConfigs.length > 0 &&
        !validConfigs.includes(selectedAircraftConfig)
      ) {
        setSelectedAircraftConfig("");
      }

      if (aircraftType === "Other" && quantityInLbs > 440) {
        setShowOtherAircraftPrompt(true);
      } else {
        setShowOtherAircraftPrompt(false);
        setHasAircraftInfo(null);
      }
    }
  };

  const handleQuantityUnitToggle = (unit: "kg" | "lbs") => {
    setQuantityUnit(unit);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.quantityUnit = unit;

    if (dryIceQuantity && aircraftType) {
      const quantityValue = parseFloat(dryIceQuantity);
      const quantityInLbs =
        unit === "lbs" ? quantityValue : quantityValue / 0.453592;

      const minLimit = findMinQuantityLimit(aircraftType);
      setMinAircraftLimit(minLimit);

      const exceeds = quantityInLbs > minLimit;
      setQuantityExceedsMinLimit(exceeds);

      const validConfigs = getValidConfigurations(aircraftType, quantityValue);
      setAvailableConfigurations(validConfigs);

      if (aircraftType === "Other" && quantityInLbs > 440) {
        setShowOtherAircraftPrompt(true);
      } else {
        setShowOtherAircraftPrompt(false);
        setHasAircraftInfo(null);
      }
    }
  };

  // const handleContainedMaterialChange = (value: string) => {
  //   setContainedMaterial(value);
  //   handleNestedPreparerContextFieldUpdate(
  //     "dryIceData.containedMaterial",
  //     value
  //   );
  // };

  useEffect(() => {
    if (aircraftType !== "Other") {
      setCalculatedLimit(null);
    }
  }, [aircraftType]);

  const handleAircraftTypeChange = (value: string) => {
    setAircraftType(value);
    setSelectedAircraftConfig("");

    setHasAircraftInfo(null);
    setShowUnsupportedMessage(false);

    if (dryIceQuantity) {
      const quantityValue = parseFloat(dryIceQuantity);
      const quantityInLbs =
        quantityUnit === "lbs" ? quantityValue : quantityValue / 0.453592;

      const minLimit = findMinQuantityLimit(value);
      setMinAircraftLimit(minLimit);

      const exceeds = quantityInLbs > minLimit;
      setQuantityExceedsMinLimit(exceeds);

      const validConfigs = getValidConfigurations(value, quantityValue);
      setAvailableConfigurations(validConfigs);

      setShowAircraftConfigOptions(
        exceeds &&
          (value === "C-17" || value === "C-5" || value === "KC-10") &&
          validConfigs.length > 0
      );

      if (value === "Other" && quantityInLbs > 440) {
        setShowOtherAircraftPrompt(true);
      } else {
        setShowOtherAircraftPrompt(false);
      }
    } else {
      setShowAircraftConfigOptions(false);
    }

    if (value === "Other") {
      setCalculatedLimit(null);
      if (!store.hazProPreparerContext.dryIceData) {
        store.hazProPreparerContext.dryIceData = {};
      }
      store.hazProPreparerContext.dryIceData.aircraftType = "Other";
    } else {
      setAircraftVolume("");
      setAirChangesPerHour("");
      if (!store.hazProPreparerContext.dryIceData) {
        store.hazProPreparerContext.dryIceData = {};
      }
      store.hazProPreparerContext.dryIceData.aircraftType = value;
    }

    updateQuantityWarning(
      dryIceQuantity,
      quantityUnit,
      value,
      selectedAircraftConfig
    );
  };

  const handleAircraftConfigChange = (value: string) => {
    setSelectedAircraftConfig(value);
    updateQuantityWarning(dryIceQuantity, quantityUnit, aircraftType, value);
  };

  const handleAircraftVolumeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAircraftVolume(numericValue);
    calculateMaxDryIceLoading(numericValue, airChangesPerHour);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.aircraftVolume = numericValue;
  };

  const handleAirChangesPerHourChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAirChangesPerHour(numericValue);
    calculateMaxDryIceLoading(aircraftVolume, numericValue);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.airChangesPerHour = numericValue;
  };

  const calculateMaxDryIceLoading = (volume: string, airChanges: string) => {
    if (volume && airChanges) {
      const V = parseFloat(volume);
      const A = parseFloat(airChanges);

      if (!isNaN(V) && !isNaN(A)) {
        const maxLoadingLbs = (V * A * 0.47) / 32.3;
        setCalculatedLimit(Math.floor(maxLoadingLbs));
        if (!store.hazProPreparerContext.dryIceData) {
          store.hazProPreparerContext.dryIceData = {};
        }
        store.hazProPreparerContext.dryIceData.calculatedMaxLoading =
          Math.floor(maxLoadingLbs);
      } else {
        setCalculatedLimit(null);
      }
    } else {
      setCalculatedLimit(null);
    }
  };

  const handleAircraftPressurizedToggle = (value: boolean) => {
    setIsAircraftPressurized(value);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.isAircraftPressurized = value;
  };

  const handleVentingToggle = (value: boolean) => {
    setIsVentingProvided(value);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.isVentingProvided = value;
  };

  const handleSpecialInstructionsChange = (value: string) => {
    setSpecialInstructions(value);
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.specialInstructions = value;
  };

  useEffect(() => {
    updateQuantityWarning(
      dryIceQuantity,
      quantityUnit,
      aircraftType,
      selectedAircraftConfig
    );
  }, [dryIceQuantity, quantityUnit, aircraftType, selectedAircraftConfig]);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveAndExit = () => {
    saveCurrentShipment("in-progress");
    navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const handleSaveAndContinue = () => {
    const dryIceData = {
      packagingType,
      quantity: dryIceQuantity,
      quantityUnit,
      containedMaterial,
      isAircraftPressurized,
      aircraftType,
      aircraftConfiguration: selectedAircraftConfig,
      aircraftVolume: aircraftType === "Other" ? aircraftVolume : "",
      airChangesPerHour: aircraftType === "Other" ? airChangesPerHour : "",
      calculatedMaxLoading: calculatedLimit,
      isVentingProvided,
      specialInstructions,
      handlingInstructions:
        "Keep dry ice packages away from crew and passenger compartments. Ensure proper ventilation to prevent CO2 buildup.",
    };
    store.hazProPreparerContext.dryIceData = dryIceData;

    const completedSubsteps =
      state.hazProPreparerContext.completedSubsteps || [];
    if (!completedSubsteps.includes("DryIce")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "DryIce",
      ];
    }

    navigation.navigate("LabelingAndMarking");
  };

  useEffect(() => {
    const dryIceHandlingInstructions: string =
      "Keep dry ice packages away from crew and passenger compartments. Ensure packaging permits release of carbon dioxide gas to prevent pressure buildup.";

    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {};
    }
    store.hazProPreparerContext.dryIceData.handlingInstructions =
      dryIceHandlingInstructions;
  }, []);

  const handleHasAircraftInfoResponse = (hasInfo: boolean) => {
    setHasAircraftInfo(hasInfo);

    if (!hasInfo) {
      setShowUnsupportedMessage(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.briefingPanel}>
          <Text style={styles.briefingTitle}>
            A13.10. DRY ICE (CARBON DIOXIDE, SOLID)
          </Text>
          <Text style={styles.briefingText}>
            • Wrap in kraft paper, secure with tape, and pack in fiberboard
            boxes, polystyrene foam containers or other suitable packaging.
          </Text>
          <Text style={styles.briefingText}>
            • Packaging must permit the release of carbon dioxide gas and
            prevent pressure buildup.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Packaging Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Packaging Type</Text>

            <View style={styles.packagingOptions}>
              <TouchableOpacity
                style={[
                  styles.packagingOption,
                  packagingTypeOption === "Fiberboard Box" &&
                    styles.selectedPackagingOption,
                ]}
                onPress={() =>
                  handlePackagingTypeOptionChange("Fiberboard Box")
                }
              >
                <View style={styles.radioCircle}>
                  {packagingTypeOption === "Fiberboard Box" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.packagingOptionText}>Fiberboard Box</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.packagingOption,
                  packagingTypeOption === "Polystyrene Foam Container" &&
                    styles.selectedPackagingOption,
                ]}
                onPress={() =>
                  handlePackagingTypeOptionChange("Polystyrene Foam Container")
                }
              >
                <View style={styles.radioCircle}>
                  {packagingTypeOption === "Polystyrene Foam Container" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.packagingOptionText}>
                  Polystyrene Foam Container
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.packagingOption,
                  packagingTypeOption === "Other" &&
                    styles.selectedPackagingOption,
                ]}
                onPress={() => handlePackagingTypeOptionChange("Other")}
              >
                <View style={styles.radioCircle}>
                  {packagingTypeOption === "Other" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.packagingOptionText}>Other</Text>
              </TouchableOpacity>
            </View>

            {packagingTypeOption === "Other" && (
              <View style={styles.customPackagingInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={customPackagingType}
                  onChangeText={handleCustomPackagingTypeChange}
                  placeholder="Specify packaging type"
                  accessibilityLabel="Specify custom packaging type"
                />
                <Text style={styles.helperText}>
                  Must be suitable packaging designed to permit release of
                  carbon dioxide gas and prevent pressure buildup
                </Text>
              </View>
            )}

            <Text style={styles.helperText}>
              Must permit release of carbon dioxide gas
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transport Requirements</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Net Quantity of Dry Ice</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[styles.textInput, styles.quantityInput]}
                value={dryIceQuantity}
                onChangeText={handleDryIceQuantityChange}
                keyboardType="numeric"
                placeholder="Enter quantity"
                accessibilityLabel="Quantity of dry ice, required"
              />
              <View style={styles.unitSelectorContainer}>
                <Pressable
                  style={[
                    styles.unitButton,
                    quantityUnit === "lbs" && styles.selectedUnitButton,
                  ]}
                  onPress={() => handleQuantityUnitToggle("lbs")}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: quantityUnit === "lbs" }}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      quantityUnit === "lbs" && styles.selectedUnitButtonText,
                    ]}
                  >
                    lbs
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.unitButton,
                    quantityUnit === "kg" && styles.selectedUnitButton,
                  ]}
                  onPress={() => handleQuantityUnitToggle("kg")}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: quantityUnit === "kg" }}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      quantityUnit === "kg" && styles.selectedUnitButtonText,
                    ]}
                  >
                    kg
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.helperText}>
              Required for hazard communication marking
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aircraft Pressurized?</Text>
            <View style={styles.switchContainer}>
              <Switch
                value={isAircraftPressurized}
                onValueChange={handleAircraftPressurizedToggle}
                trackColor={{ false: "#d32f2f", true: "#007bff" }}
                thumbColor={isAircraftPressurized ? "#fff" : "#fff"}
                accessibilityLabel="Is aircraft pressurized toggle"
              />
              <Text style={styles.switchLabel}>
                {isAircraftPressurized ? "Yes" : "No"}
              </Text>
            </View>
          </View>

          {isAircraftPressurized && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Aircraft Type</Text>
              <View style={styles.packagingOptions}>
                <TouchableOpacity
                  style={[
                    styles.packagingOption,
                    aircraftType === "C-17" && styles.selectedPackagingOption,
                  ]}
                  onPress={() => handleAircraftTypeChange("C-17")}
                >
                  <View style={styles.radioCircle}>
                    {aircraftType === "C-17" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.packagingOptionText}>C-17</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.packagingOption,
                    aircraftType === "C-5" && styles.selectedPackagingOption,
                  ]}
                  onPress={() => handleAircraftTypeChange("C-5")}
                >
                  <View style={styles.radioCircle}>
                    {aircraftType === "C-5" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.packagingOptionText}>C-5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.packagingOption,
                    aircraftType === "KC-135" && styles.selectedPackagingOption,
                  ]}
                  onPress={() => handleAircraftTypeChange("KC-135")}
                >
                  <View style={styles.radioCircle}>
                    {aircraftType === "KC-135" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.packagingOptionText}>KC-135</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.packagingOption,
                    aircraftType === "KC-10" && styles.selectedPackagingOption,
                  ]}
                  onPress={() => handleAircraftTypeChange("KC-10")}
                >
                  <View style={styles.radioCircle}>
                    {aircraftType === "KC-10" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.packagingOptionText}>KC-10</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.packagingOption,
                    aircraftType === "Other" && styles.selectedPackagingOption,
                  ]}
                  onPress={() => handleAircraftTypeChange("Other")}
                >
                  <View style={styles.radioCircle}>
                    {aircraftType === "Other" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.packagingOptionText}>Other</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Different aircraft types have different quantity limitations
              </Text>
            </View>
          )}

          {isAircraftPressurized && showAircraftConfigOptions && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Available Aircraft Configurations
              </Text>
              <View style={styles.configContainer}>
                {aircraftType === "C-17" && (
                  <View style={styles.configList}>
                    {availableConfigurations.map(config => (
                      <TouchableOpacity
                        key={config}
                        style={[
                          styles.configOption,
                          selectedAircraftConfig === config &&
                            styles.selectedConfigOption,
                        ]}
                        onPress={() => handleAircraftConfigChange(config)}
                      >
                        <Text
                          style={[
                            styles.configOptionText,
                            selectedAircraftConfig === config &&
                              styles.selectedConfigOptionText,
                          ]}
                        >
                          {config}
                          {"\n"}
                          <Text style={styles.configLimitText}>
                            Max: {C17DryIceQuantityLimits[config].pounds} lbs (
                            {C17DryIceQuantityLimits[config].kilograms} kg)
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {aircraftType === "C-5" && (
                  <View style={styles.configList}>
                    {availableConfigurations.map(config => (
                      <TouchableOpacity
                        key={config}
                        style={[
                          styles.configOption,
                          selectedAircraftConfig === config &&
                            styles.selectedConfigOption,
                        ]}
                        onPress={() => handleAircraftConfigChange(config)}
                      >
                        <Text
                          style={[
                            styles.configOptionText,
                            selectedAircraftConfig === config &&
                              styles.selectedConfigOptionText,
                          ]}
                        >
                          {config}
                          {"\n"}
                          <Text style={styles.configLimitText}>
                            Max: {C5DryIceQuantityLimits[config].pounds} lbs (
                            {C5DryIceQuantityLimits[config].kilograms} kg)
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {aircraftType === "KC-10" && (
                  <View style={styles.configList}>
                    {availableConfigurations.map(config => (
                      <TouchableOpacity
                        key={config}
                        style={[
                          styles.configOption,
                          selectedAircraftConfig === config &&
                            styles.selectedConfigOption,
                        ]}
                        onPress={() => handleAircraftConfigChange(config)}
                      >
                        <Text
                          style={[
                            styles.configOptionText,
                            selectedAircraftConfig === config &&
                              styles.selectedConfigOptionText,
                          ]}
                        >
                          {config}
                          {"\n"}
                          <Text style={styles.configLimitText}>
                            Max: {KC10DryIceQuantityLimits[config].pounds} lbs (
                            {KC10DryIceQuantityLimits[config].kilograms} kg)
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <Text style={styles.helperText}>
                Only showing configurations that can handle your specified
                quantity
              </Text>
            </View>
          )}

          {isAircraftPressurized &&
            aircraftType === "Other" &&
            showOtherAircraftPrompt &&
            hasAircraftInfo === null && (
              <View style={styles.warningPanel}>
                <Text style={styles.warningTitle}>
                  Exceeding this quantity under Other aircraft is undefined in
                  HazPro
                </Text>
                <Text style={styles.warningText}>
                  You must possess the following information (volume, and air
                  changes per hour)
                </Text>
                <Text style={styles.warningText}>
                  Do you have this information to proceed?
                </Text>
                <View style={styles.promptButtonsContainer}>
                  <TouchableOpacity
                    style={styles.promptButton}
                    onPress={() => handleHasAircraftInfoResponse(true)}
                  >
                    <Text style={styles.promptButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.promptButton, styles.promptNoButton]}
                    onPress={() => handleHasAircraftInfoResponse(false)}
                  >
                    <Text style={styles.promptButtonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          {showUnsupportedMessage && (
            <View style={styles.errorPanel}>
              <Text style={styles.errorTitle}>
                HazPro cannot support the preparation of your shipment
              </Text>
              <Text style={styles.errorPanelText}>
                You must have aircraft volume and air changes information to
                ship this quantity of dry ice on an unlisted aircraft type.
              </Text>
            </View>
          )}

          {isAircraftPressurized &&
            aircraftType === "Other" &&
            ((showOtherAircraftPrompt && hasAircraftInfo === true) ||
              (!showOtherAircraftPrompt && dryIceQuantity)) && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Aircraft Volume (cubic ft)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={aircraftVolume}
                    onChangeText={handleAircraftVolumeChange}
                    placeholder="Enter aircraft volume"
                    keyboardType="numeric"
                    accessibilityLabel="Aircraft volume in cubic feet"
                  />
                  <Text style={styles.helperText}>
                    The internal volume of the aircraft in cubic feet
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Air Changes Per Hour</Text>
                  <TextInput
                    style={styles.textInput}
                    value={airChangesPerHour}
                    onChangeText={handleAirChangesPerHourChange}
                    placeholder="Enter air changes per hour"
                    keyboardType="numeric"
                    accessibilityLabel="Air changes per hour"
                  />
                  <Text style={styles.helperText}>
                    The number of complete air replacements per hour
                  </Text>
                </View>

                {calculatedLimit !== null && (
                  <View style={styles.calculatedLimitContainer}>
                    <Text style={styles.calculatedLimitTitle}>
                      Maximum Dry Ice Loading:
                    </Text>
                    <Text style={styles.calculatedLimitValue}>
                      {calculatedLimit} lbs (
                      {Math.floor(calculatedLimit * 0.453592)} kg)
                    </Text>
                    <Text style={styles.helperText}>
                      Based on formula: X = (V)(A)(0.47)/32.3
                    </Text>
                  </View>
                )}
              </>
            )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Venting Provided to Release CO₂ Gas?
            </Text>
            <View style={styles.switchContainer}>
              <Switch
                value={isVentingProvided}
                onValueChange={handleVentingToggle}
                trackColor={{ false: "#d32f2f", true: "#007bff" }}
                thumbColor={isVentingProvided ? "#fff" : "#fff"}
                accessibilityLabel="Is venting provided toggle"
              />
              <Text style={styles.switchLabel}>
                {isVentingProvided ? "Yes" : "No"}
              </Text>
            </View>
            {!isVentingProvided && (
              <Text style={styles.errorText}>
                Venting is REQUIRED for dry ice shipments to prevent pressure
                buildup
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelOptional}>
              Special Handling Instructions{" "}
              <Text style={styles.optionalText}>(optional)</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.multilineInput,
                styles.optionalInput,
              ]}
              value={specialInstructions}
              onChangeText={handleSpecialInstructionsChange}
              placeholder="Any special handling instructions for this shipment"
              multiline
              numberOfLines={4}
              accessibilityLabel="Special handling instructions, optional"
            />
          </View>
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
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#856404",
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: "#856404",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#495057",
  },
  inputGroup: {
    marginBottom: 16,
    minHeight: 48,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#495057",
  },
  inputLabelOptional: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#495057",
  },
  optionalText: {
    fontStyle: "italic",
    color: "#6c757d",
    fontWeight: "normal",
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#212529",
    maxWidth: "90%",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    flex: 1,
    marginRight: 8,
  },
  unitSelectorContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    overflow: "hidden",
  },
  unitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedUnitButton: {
    backgroundColor: "#007bff",
  },
  unitButtonText: {
    fontSize: 16,
    color: "#495057",
  },
  selectedUnitButtonText: {
    color: "#ffffff",
  },
  optionalInput: {
    borderColor: "#dee2e6",
    backgroundColor: "#f8f9fa",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#212529",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
    fontStyle: "italic",
  },
  warningHelperText: {
    fontSize: 16,
    color: "#856404",
    marginTop: 4,
    fontStyle: "italic",
  },
  requiredFieldNote: {
    marginTop: 8,
    marginBottom: 16,
  },
  fieldNoteText: {
    fontSize: 12,
    color: "#495057",
    fontStyle: "italic",
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
  packagingOptions: {
    flexDirection: "column",
    marginBottom: 8,
  },
  packagingOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
  },
  selectedPackagingOption: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  packagingOptionText: {
    fontSize: 16,
    color: "#495057",
  },
  customPackagingInputContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  configContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    overflow: "hidden",
  },
  configList: {
    padding: 8,
  },
  configOption: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedConfigOption: {
    backgroundColor: "#e6f2ff",
    borderColor: "#007bff",
  },
  configOptionText: {
    fontSize: 16,
    color: "#495057",
  },
  selectedConfigOptionText: {
    color: "#007bff",
    fontWeight: "600",
  },
  configLimitText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  calculatedLimitContainer: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
  },
  calculatedLimitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#495057",
  },
  calculatedLimitValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
  },
  maxQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  maxQuantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
    color: "#495057",
  },
  maxQuantityValue: {
    fontSize: 14,
    color: "#495057",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  warningIcon: {
    marginRight: 8,
  },
  exceededWarningText: {
    color: "#d32f2f",
  },
  warningPanel: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEEBA",
    borderWidth: 1,
    padding: 16,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  promptButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  promptButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  promptButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  promptNoButton: {
    backgroundColor: "#d32f2f",
  },
  errorPanel: {
    backgroundColor: "#FDEDED",
    borderColor: "#F8D7DA",
    borderWidth: 1,
    padding: 16,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#721C24",
  },
  errorPanelText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: "#721C24",
  },
});

export default DryIcePrepScreen;
