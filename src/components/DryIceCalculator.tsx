import colors from "@/theming/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
  "No curtain - both packs operating": { pounds: 2295, kilograms: 1041 },
  "No curtain - one pack operating": { pounds: 1251, kilograms: 568 },
  "Curtain at STA 615 - both packs operating": { pounds: 1782, kilograms: 808 },
  "Curtain at STA 615 - one pack operating": { pounds: 969, kilograms: 440 },
  "Curtain at STA 879 - both packs operating": { pounds: 1204, kilograms: 546 },
  "Curtain at STA 879 - one pack operating": { pounds: 653, kilograms: 296 },
};

export const KC135DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  maximumAmount: { pounds: 200, kilograms: 91 },
};

interface DryIceCalculatorProps {
  visible: boolean;
  onClose: () => void;
}

const DryIceCalculator: React.FC<DryIceCalculatorProps> = ({
  visible,
  onClose,
}) => {
  const [dryIceQuantity, setDryIceQuantity] = useState<string>("");
  const [quantityUnit, setQuantityUnit] = useState<"kg" | "lbs">("lbs");
  const [aircraftType, setAircraftType] = useState<string>("");
  const [aircraftVolume, setAircraftVolume] = useState<string>("");
  const [airChangesPerHour, setAirChangesPerHour] = useState<string>("");
  const [selectedAircraftConfig, setSelectedAircraftConfig] =
    useState<string>("");
  const [calculatedLimit, setCalculatedLimit] = useState<number | null>(null);
  const [quantityWarning, setQuantityWarning] = useState<string>("");
  const [exceededQuantityLimit, setExceededQuantityLimit] =
    useState<boolean>(false);
  const [maxAllowedKg, setMaxAllowedKg] = useState<number>(0);
  const [maxAllowedLbs, setMaxAllowedLbs] = useState<number>(0);
  const [hasAircraftInfo, setHasAircraftInfo] = useState<boolean | null>(null);
  const [showUnsupportedMessage, setShowUnsupportedMessage] =
    useState<boolean>(false);
  const [expandedAircraft, setExpandedAircraft] = useState<string | null>(null);

  const isInitial = !dryIceQuantity;

  // Calculate eligible aircraft types based on quantity
  const eligibleAircraftTypes = useMemo(() => {
    if (!dryIceQuantity) return [];

    const quantityInLbs =
      quantityUnit === "lbs"
        ? parseFloat(dryIceQuantity)
        : parseFloat(dryIceQuantity) / 0.453592;

    if (isNaN(quantityInLbs)) return [];

    const eligible: string[] = [];

    if (
      Object.values(C17DryIceQuantityLimits).some(
        limit => limit.pounds >= quantityInLbs
      )
    ) {
      eligible.push("C-17");
    }
    if (
      Object.values(C5DryIceQuantityLimits).some(
        limit => limit.pounds >= quantityInLbs
      )
    ) {
      eligible.push("C-5");
    }
    if (
      Object.values(KC10DryIceQuantityLimits).some(
        limit => limit.pounds >= quantityInLbs
      )
    ) {
      eligible.push("KC-10");
    }
    if (KC135DryIceQuantityLimits.maximumAmount.pounds >= quantityInLbs) {
      eligible.push("KC-135");
    }
    if (quantityInLbs <= 440) {
      eligible.push("Other");
      eligible.push("AMC Contract");
    }
    if (quantityInLbs <= 600) {
      eligible.push("C-130");
    }

    return eligible;
  }, [dryIceQuantity, quantityUnit]);

  // Get valid configurations for selected aircraft
  const availableConfigurations = useMemo(() => {
    if (!aircraftType || !dryIceQuantity) return [];

    const quantityInLbs =
      quantityUnit === "lbs"
        ? parseFloat(dryIceQuantity)
        : parseFloat(dryIceQuantity) / 0.453592;

    if (isNaN(quantityInLbs)) return [];

    // Special handling for "Other" aircraft type
    if (aircraftType === "Other") {
      return ["Calculate using volume and air changes"];
    }

    // Special handling for KC-135
    if (aircraftType === "KC-135") {
      return ["Maximum quantity only"];
    }

    const validConfigs: string[] = [];

    switch (aircraftType) {
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
  }, [aircraftType, dryIceQuantity, quantityUnit]);

  const handleDryIceQuantityChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setDryIceQuantity(numericValue);
    setAircraftType("");
    setSelectedAircraftConfig("");
    setExpandedAircraft(null);
    setHasAircraftInfo(null);
    setShowUnsupportedMessage(false);
    updateQuantityWarning(numericValue, quantityUnit, "", "");
  };

  const handleQuantityUnitToggle = (unit: "kg" | "lbs") => {
    setQuantityUnit(unit);
    setAircraftType("");
    setSelectedAircraftConfig("");
    setExpandedAircraft(null);
    updateQuantityWarning(dryIceQuantity, unit, "", "");
  };

  const handleAircraftTypeSelect = (type: string) => {
    if (expandedAircraft === type) {
      setExpandedAircraft(null);
      return;
    }

    setAircraftType(type);
    setExpandedAircraft(type);
    setHasAircraftInfo(null);
    setShowUnsupportedMessage(false);
    updateQuantityWarning(dryIceQuantity, quantityUnit, type, "");
  };

  const calculateMaxDryIceLoading = (volume: string, airChanges: string) => {
    if (volume && airChanges) {
      const V = parseFloat(volume);
      const A = parseFloat(airChanges);

      if (!isNaN(V) && !isNaN(A)) {
        const maxLoadingLbs = (V * A * 0.47) / 32.3;
        setCalculatedLimit(Math.floor(maxLoadingLbs));
      } else {
        setCalculatedLimit(null);
      }
    } else {
      setCalculatedLimit(null);
    }
  };

  const handleAircraftVolumeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAircraftVolume(numericValue);
    calculateMaxDryIceLoading(numericValue, airChangesPerHour);
  };

  const handleAirChangesPerHourChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAirChangesPerHour(numericValue);
    calculateMaxDryIceLoading(aircraftVolume, numericValue);
  };

  const handleHasAircraftInfoResponse = (hasInfo: boolean) => {
    setHasAircraftInfo(hasInfo);
    if (!hasInfo) {
      setShowUnsupportedMessage(true);
    }
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
          localMaxAllowedKg = 472; // Default to the lowest limit for safety
          localMaxAllowedLbs = 1040;
        }
        break;
      case "C-5":
        if (configuration && C5DryIceQuantityLimits[configuration]) {
          localMaxAllowedKg = C5DryIceQuantityLimits[configuration].kilograms;
          localMaxAllowedLbs = C5DryIceQuantityLimits[configuration].pounds;
          warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        } else {
          localMaxAllowedKg = 1338; // Default to the lowest limit for safety
          localMaxAllowedLbs = 2950;
        }
        break;
      case "KC-10":
        if (configuration && KC10DryIceQuantityLimits[configuration]) {
          localMaxAllowedKg = KC10DryIceQuantityLimits[configuration].kilograms;
          localMaxAllowedLbs = KC10DryIceQuantityLimits[configuration].pounds;
          warningMessage = `Maximum allowable quantity: ${localMaxAllowedLbs} lbs (${localMaxAllowedKg} kg)`;
        } else {
          localMaxAllowedKg = 296; // Default to the lowest limit for safety
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
        return;
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
    if (!visible) {
      setDryIceQuantity("");
      setQuantityUnit("lbs");
      setAircraftType("");
      setAircraftVolume("");
      setAirChangesPerHour("");
      setSelectedAircraftConfig("");
      setCalculatedLimit(null);
      setQuantityWarning("");
      setExceededQuantityLimit(false);
      setMaxAllowedKg(0);
      setMaxAllowedLbs(0);
      setHasAircraftInfo(null);
      setShowUnsupportedMessage(false);
      setExpandedAircraft(null);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            isInitial
              ? styles.modalContentInitial
              : styles.modalContentExpanded,
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Dry Ice Calculator</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
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
              {quantityWarning && (
                <Text
                  style={[
                    styles.warningHelperText,
                    exceededQuantityLimit && styles.exceededWarningText,
                  ]}
                >
                  {quantityWarning}
                </Text>
              )}
            </View>

            {dryIceQuantity && eligibleAircraftTypes.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Aircraft Type</Text>
                {eligibleAircraftTypes.map(type => (
                  <View
                    key={type}
                    style={[
                      styles.aircraftCard,
                      expandedAircraft === type && styles.expandedAircraftCard,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.aircraftCardHeader}
                      onPress={() => handleAircraftTypeSelect(type)}
                    >
                      <Text style={styles.aircraftCardTitle}>{type}</Text>
                      <MaterialIcons
                        name={
                          expandedAircraft === type
                            ? "expand-less"
                            : "expand-more"
                        }
                        size={24}
                        color={colors.blue}
                      />
                    </TouchableOpacity>
                    {expandedAircraft === type && (
                      <View style={styles.aircraftConfigContainer}>
                        {type === "Other" ? (
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
                              />
                              <Text style={styles.helperText}>
                                The internal volume of the aircraft in cubic
                                feet
                              </Text>
                            </View>

                            <View style={styles.inputGroup}>
                              <Text style={styles.inputLabel}>
                                Air Changes Per Hour
                              </Text>
                              <TextInput
                                style={styles.textInput}
                                value={airChangesPerHour}
                                onChangeText={handleAirChangesPerHourChange}
                                placeholder="Enter air changes per hour"
                                keyboardType="numeric"
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
                        ) : type === "KC-135" ? (
                          <View style={styles.calculatedLimitContainer}>
                            <Text style={styles.calculatedLimitTitle}>
                              Maximum Dry Ice Loading:
                            </Text>
                            <Text style={styles.calculatedLimitValue}>
                              {KC135DryIceQuantityLimits.maximumAmount.pounds}{" "}
                              lbs (
                              {
                                KC135DryIceQuantityLimits.maximumAmount
                                  .kilograms
                              }{" "}
                              kg)
                            </Text>
                          </View>
                        ) : availableConfigurations.length > 0 ? (
                          availableConfigurations.map(config => (
                            <View key={config} style={styles.configOption}>
                              <Text style={styles.configOptionText}>
                                {config}
                                {"\n"}
                                <Text style={styles.configLimitText}>
                                  Max:{" "}
                                  {type === "C-17"
                                    ? C17DryIceQuantityLimits[config].pounds
                                    : type === "C-5"
                                    ? C5DryIceQuantityLimits[config].pounds
                                    : KC10DryIceQuantityLimits[config]
                                        .pounds}{" "}
                                  lbs (
                                  {type === "C-17"
                                    ? C17DryIceQuantityLimits[config].kilograms
                                    : type === "C-5"
                                    ? C5DryIceQuantityLimits[config].kilograms
                                    : KC10DryIceQuantityLimits[config]
                                        .kilograms}{" "}
                                  kg)
                                </Text>
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.noConfigText}>
                            No configurations available for this quantity
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {aircraftType === "Other" &&
              parseFloat(dryIceQuantity) > 440 &&
              hasAircraftInfo === true && (
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

            {aircraftType === "Other" &&
              parseFloat(dryIceQuantity) > 440 &&
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: "90%",
    maxHeight: "95%",
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalContentInitial: {
    width: 400,
    minHeight: 220,
    maxHeight: 320,
    alignSelf: "center",
    justifyContent: "center",
  },
  modalContentExpanded: {
    width: "90%",
    maxWidth: 700,
    minHeight: 400,
    maxHeight: "95%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 35,
    borderRadius: 8,
    padding: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
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
    backgroundColor: colors.blue,
  },
  unitButtonText: {
    fontSize: 16,
    color: "#495057",
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
  warningHelperText: {
    fontSize: 14,
    color: "#856404",
    marginTop: 4,
    fontStyle: "italic",
  },
  exceededWarningText: {
    color: "#d32f2f",
  },
  aircraftCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  expandedAircraftCard: {
    borderColor: colors.blue,
    backgroundColor: "#f8f9fa",
  },
  aircraftCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  aircraftCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  aircraftConfigContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  configOption: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  configOptionText: {
    fontSize: 14,
    color: "#000",
  },
  configLimitText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  noConfigText: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
  },
  showOtherButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  showOtherButtonText: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: "600",
  },
  calculatedLimitContainer: {
    marginTop: 8,
    padding: 12,
    paddingBottom: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "#f8f9fa",
  },
  calculatedLimitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  calculatedLimitValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.blue,
  },
  warningPanel: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "#f8f9fa",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  warningText: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  promptButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  promptButton: {
    padding: 12,
    backgroundColor: colors.blue,
    borderRadius: 6,
    alignItems: "center",
  },
  promptButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  promptNoButton: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    alignItems: "center",
  },
  errorPanel: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "#f8f9fa",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  errorPanelText: {
    fontSize: 14,
    color: "#6c757d",
  },
  initialStateContainerMilitary: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  initialStateTitleMilitary: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 4,
    textAlign: "center",
  },
  initialStateMessageMilitary: {
    fontSize: 14,
    color: "#4a5568",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default DryIceCalculator;
