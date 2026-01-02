import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { AccessorialHazard, HazardousMaterialItem } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface EngineOrMachineryPreparationData {
  unid: string;
  fuelType: HazardousMaterialItem | null;
  transportMode:
    | "vehicle"
    | "freight_container"
    | "standalone_equipment"
    | "trailer";
  isDrained: boolean;
  residualFuelMl?: number;
  purged?: boolean;
  largeFuelSystem?: boolean;
  tankFractionAllowed?: "none" | "quarter" | "half";
  isInoperableOrDamaged?: boolean;
  cappedAndPlugged?: boolean;
  "24hDrainConfirmation"?: boolean;
  flashPointBelow38C?: boolean;
  batteryInstalled?: boolean;
  batteryType?: "spillable" | "nonspillable" | "lithium";
  batterySecured?: boolean;
  terminalsProtected?: boolean;
  batteryDisconnected?: boolean;
  accessorialHazards: {
    batteries?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      quantity: string;
    } | null;
    fireExtinguishers?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      quantity: string;
    };
    starterFluid?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      volume: {
        liters: number | null;
        gallons: number | null;
      };
    } | null;
    other?: AccessorialHazard[];
  };
  requiresUprightOrientation: boolean;
  securedInPackaging: boolean;
  techManualCompliance: boolean;
}

const EnginesInternalCombustionNew = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const { navigate } = useNavigationRef();
  const [preparationData, setPreparationData] =
    useState<EngineOrMachineryPreparationData>({
      unid: hazardousMaterial?.unid || "",
      fuelType: null,
      transportMode: "standalone_equipment",
      isDrained: false,
      accessorialHazards: {
        batteries: null,
        fireExtinguishers: {
          accessorialHazardousMaterialIdentification: null,
          quantity: "",
        },
        starterFluid: null,
        other: [],
      },
      requiresUprightOrientation: true,
      securedInPackaging: false,
      techManualCompliance: false,
    });

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  useEffect(() => {
    const existingData = (state.hazProPreparerContext as any)
      .engineOrMachineryPreparationData;
    if (existingData) {
      setPreparationData(existingData);
    }
  }, []);

  const title = `${hazardousMaterial?.unid} | ${hazardousMaterial?.properShippingName} | ${hazardousMaterial?.specialProvision} | ${hazardousMaterial?.packagingParagraph}`;

  const handleInputChange = (
    field: keyof EngineOrMachineryPreparationData,
    value: any
  ) => {
    setPreparationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSaveEnabled = useMemo(() => {
    const {
      fuelType,
      transportMode,
      isDrained,
      residualFuelMl,
      purged,
      batteryInstalled,
      batteryType,
    } = preparationData;

    if (!fuelType || !transportMode) return false;
    if (!isDrained) return false;
    if (residualFuelMl === undefined || residualFuelMl > 500) return false;
    if (!purged) return false;
    if (batteryInstalled && !batteryType) return false;

    return true;
  }, [preparationData]);

  const handleSaveAndContinue = () => {
    store.hazProPreparerContext.engineOrMachineryPreparationData =
      preparationData;
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "EnginesInternalCombustion",
    ];
    navigation.navigate("AccessorialHazardsScreen");
  };

  const gasFuelOptions: HazardousMaterialItem[] = [
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1971",
      properShippingName: "NATURAL GAS, COMPRESSED",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P4",
      packagingParagraph: "A6.3., A6.5.",
    },
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1978",
      properShippingName: "PROPANE",
      details: "see also PETROLEUM GASES, LIQUEFIED",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P4",
      packagingParagraph: "A6.3., A6.6.",
    },
  ];

  const liquidFuelOptions: HazardousMaterialItem[] = [
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1203",
      properShippingName: "GASOLINE",
      details:
        "includes gasoline mixed with ethyl alcohol, with not more than 10 percent alcohol",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5, 177",
      packagingParagraph: "A7.2.",
    },
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1202",
      properShippingName: "DIESEL FUEL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "III",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    },
  ];

  const marinePollutantFuelOptions: HazardousMaterialItem[] = [
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1202",
      properShippingName: "DIESEL FUEL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "III",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    },
  ];

  const getFuelOptions = () => {
    if (hazardousMaterial?.unid === "UN3528") {
      return liquidFuelOptions;
    } else if (hazardousMaterial?.unid === "UN3529") {
      return gasFuelOptions;
    } else if (hazardousMaterial?.unid === "UN3530") {
      return marinePollutantFuelOptions;
    }
    return [];
  };

  const renderFuelTypePicker = () => {
    const fuelOptions = getFuelOptions();
    const isUN3530 = hazardousMaterial?.unid === "UN3530";

    return (
      <View style={styles.halfInput}>
        <Text style={styles.label}>Fuel Type</Text>
        {isUN3530 ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              This engine/machine is powered by fuels that are marine pollutants
              but do not meet the criteria of any other Class or Division.
            </Text>
          </View>
        ) : (
          <Picker
            selectedValue={preparationData.fuelType?.unid || ""}
            onValueChange={value => {
              const selectedFuel = fuelOptions.find(
                fuel => fuel.unid === value
              );
              handleInputChange("fuelType", selectedFuel || null);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Fuel Type" value="" enabled={false} />
            {fuelOptions.map((fuel, index) => (
              <Picker.Item
                key={`${fuel.unid}-${index}`}
                label={fuel.properShippingName}
                value={fuel.unid}
              />
            ))}
          </Picker>
        )}
      </View>
    );
  };

  const renderFuelDrainingRequirements = () => {
    const isUN3528 = hazardousMaterial?.unid === "UN3528";
    const isUN3529 = hazardousMaterial?.unid === "UN3529";
    const isUN3530 = hazardousMaterial?.unid === "UN3530";

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fuel Draining & Residual Limits</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              handleInputChange("isDrained", !preparationData.isDrained)
            }
          >
            <View style={styles.checkbox}>
              {preparationData.isDrained && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Engine has been drained</Text>
          </TouchableOpacity>

          {preparationData.isDrained && (
            <>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Residual Fuel (ml)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      preparationData.residualFuelMl &&
                      preparationData.residualFuelMl > 500
                        ? styles.inputError
                        : null,
                    ]}
                    value={preparationData.residualFuelMl?.toString() || ""}
                    onChangeText={value => {
                      const parsed = parseInt(value);
                      handleInputChange(
                        "residualFuelMl",
                        isNaN(parsed) ? undefined : parsed
                      );
                    }}
                    keyboardType="numeric"
                    placeholder="Enter residual fuel amount"
                  />
                  {preparationData.residualFuelMl &&
                    preparationData.residualFuelMl > 500 && (
                      <Text style={styles.errorText}>
                        Residual fuel must not exceed 500ml
                      </Text>
                    )}
                </View>
              </View>

              {(isUN3528 || isUN3530) && (
                <>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleInputChange("purged", !preparationData.purged)
                    }
                  >
                    <View style={styles.checkbox}>
                      {preparationData.purged && (
                        <MaterialIcons name="check" size={16} color="#007bff" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      Engine has been purged
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleInputChange(
                        "largeFuelSystem",
                        !preparationData.largeFuelSystem
                      )
                    }
                  >
                    <View style={styles.checkbox}>
                      {preparationData.largeFuelSystem && (
                        <MaterialIcons name="check" size={16} color="#007bff" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      Large fuel system (requires complete drainage)
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>
                  Important Fuel Requirements:
                </Text>
                {(isUN3528 || isUN3530) && (
                  <>
                    <Text style={styles.infoText}>
                      • All fuel lines and tanks must be securely closed to
                      prevent leakage
                    </Text>
                    <Text style={styles.infoText}>
                      • Maximum 500ml (17 ounces) of residual fuel allowed in
                      engine components and fuel lines
                    </Text>
                    <Text style={styles.infoText}>
                      • For large fuel systems, drain to the extent no
                      free-standing liquid remains
                    </Text>
                    <Text style={styles.infoText}>
                      • For damaged or inoperable engines, drain to maximum
                      extent possible and install plugs/caps
                    </Text>
                  </>
                )}
                {isUN3529 && (
                  <>
                    <Text style={styles.infoText}>
                      • Completely empty gaseous fuel from non-DOT specification
                      pressurized vessels
                    </Text>
                    <Text style={styles.infoText}>
                      • Ensure all tanks are securely closed
                    </Text>
                    <Text style={styles.infoText}>
                      • Purging is not required for gaseous fuel systems
                    </Text>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderBatteryRequirements = () => {
    const isUN3528 = hazardousMaterial?.unid === "UN3528";
    const isUN3529 = hazardousMaterial?.unid === "UN3529";
    const isUN3530 = hazardousMaterial?.unid === "UN3530";

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Battery Information</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              handleInputChange(
                "batteryInstalled",
                !preparationData.batteryInstalled
              )
            }
          >
            <View style={styles.checkbox}>
              {preparationData.batteryInstalled && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Battery is installed</Text>
          </TouchableOpacity>

          {preparationData.batteryInstalled && (
            <>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Battery Type</Text>
                  <Picker
                    selectedValue={preparationData.batteryType}
                    onValueChange={value =>
                      handleInputChange("batteryType", value)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Select Battery Type"
                      value=""
                      enabled={false}
                    />
                    <Picker.Item label="Spillable" value="spillable" />
                    <Picker.Item label="Non-spillable" value="nonspillable" />
                    <Picker.Item label="Lithium" value="lithium" />
                  </Picker>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>
                  Important Battery Requirements:
                </Text>
                <Text style={styles.infoText}>
                  • Batteries must be secured upright in designed holders
                </Text>
                <Text style={styles.infoText}>
                  • Battery terminals must be protected to prevent short circuit
                </Text>
                <Text style={styles.infoText}>
                  • If battery cables are disconnected, secure them away from
                  terminals
                </Text>
                {(isUN3528 || isUN3529 || isUN3530) && (
                  <>
                    <Text style={styles.infoText}>
                      • When in freight container, remove acid/alkali batteries
                    </Text>
                    <Text style={styles.infoText}>
                      • Non-spillable and non-hazardous gel-type batteries may
                      remain if upright and disconnected
                    </Text>
                  </>
                )}
                {preparationData.batteryType === "lithium" && (
                  <>
                    <Text style={styles.infoText}>
                      • Lithium batteries must be securely fastened in battery
                      holder
                    </Text>
                    <Text style={styles.infoText}>
                      • Terminals must be protected to prevent damage and short
                      circuits
                    </Text>
                    <Text style={styles.infoText}>
                      • Batteries must be of a type that has passed UN Manual of
                      Tests and Criteria
                    </Text>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderPackagingRequirements = () => {
    const isUN3528 = hazardousMaterial?.unid === "UN3528";
    const isUN3529 = hazardousMaterial?.unid === "UN3529";
    const isUN3530 = hazardousMaterial?.unid === "UN3530";

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Packaging & Orientation</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            Important Packaging Requirements:
          </Text>
          <Text style={styles.infoText}>
            • Item must be maintained in upright orientation during transport
          </Text>
          <Text style={styles.infoText}>
            • Item must be secured in packaging to prevent movement
          </Text>
          {(isUN3528 || isUN3529 || isUN3530) && (
            <>
              <Text style={styles.infoText}>
                • Use strong, rigid outer packaging to prevent accidental
                leakage
              </Text>
              <Text style={styles.infoText}>
                • Prevent any movement during transport that would change
                orientation
              </Text>
            </>
          )}
          {isUN3528 && (
            <>
              <Text style={styles.infoText}>
                • For single axle equipment loaded with tongue on aircraft
                floor, completely drain
              </Text>
              <Text style={styles.infoText}>
                • For wheeled equipment under Chapter 3, may contain up to
                one-half tank of fuel
              </Text>
              <Text style={styles.infoText}>
                • For Hobart-86 models, no more than one-quarter tank of fuel,
                filler neck facing forward
              </Text>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            {renderFuelTypePicker()}
            <View style={styles.halfInput}>
              <Text style={styles.label}>Transport Mode</Text>
              <Picker
                selectedValue={preparationData.transportMode}
                onValueChange={value =>
                  handleInputChange("transportMode", value)
                }
                style={styles.picker}
              >
                <Picker.Item
                  label="Select Transport Mode"
                  value=""
                  enabled={false}
                />
                <Picker.Item label="Vehicle" value="vehicle" />
                <Picker.Item
                  label="Freight Container"
                  value="freight_container"
                />
                <Picker.Item
                  label="Standalone Equipment"
                  value="standalone_equipment"
                />
                <Picker.Item label="Trailer" value="trailer" />
              </Picker>
            </View>
          </View>

          {renderFuelDrainingRequirements()}
          {renderBatteryRequirements()}
          {renderPackagingRequirements()}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            store.hazProPreparerContext.completedSubsteps =
              completedSubsteps.slice(0, -1);
            navigation.goBack();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => {
            store.hazProPreparerContext.engineOrMachineryPreparationData =
              preparationData;
            // Note: SAVE_SHIPMENT functionality would be handled by saveCurrentShipment
            // saveCurrentShipment("in-progress");
            navigate("PreparerHomeStack", { screen: "PreparerHome" });
          }}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isSaveEnabled && styles.disabledButton,
          ]}
          onPress={handleSaveAndContinue}
          disabled={!isSaveEnabled}
        >
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#6C757D",
  },
  continueButton: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: colors.blue,
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
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212529",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    height: 55,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  picker: {
    height: 55,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    color: "#212529",
    ...Platform.select({
      ios: {
        color: "#212529",
      },
      android: {
        color: "#212529",
      },
    }),
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 6,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  halfInput: {
    flex: 1,
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default EnginesInternalCombustionNew;
