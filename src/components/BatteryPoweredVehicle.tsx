import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import { useHazProStore } from "@/stores/useHazProStore";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import colors from "@/theming/colors";

export interface BatteryDetails {
  vehicleType: string;
  customVehicleType?: string;
  batteryType: string;
  batteryInstalled: boolean;
  securedUpright: boolean;
  terminalsProtected: boolean;
  cablesDisconnected: boolean;
  cablesSecured: boolean;
  isWheelchair: boolean;
  wheelchairUpright: boolean;
  isLithiumBattery: boolean;
  lithiumBatteryTested: boolean;
  notes: string;
  /** Key 16 – cargo description & quantity */
  key16: {
    /** Basic nomenclature (truck, generator, wheelchair, etc.) */
    description: string;
    /** Net quantity of hazardous material */
    netQuantity: {
      /** numeric value as entered (convert to number before save) */
      value: number;
      /** 'kg' (required) or 'lbs' (optional mirror) */
      unit: "kg" | "lbs";
      /** If unit === 'lbs', always store the automatic kg conversion here */
      valueKg: number;
    };
  };
  /** Key 19 – magnetized-material statement */
  key19: {
    /** true → include "Contains Magnetized Material" in Key 19 output */
    containsMagnetizedMaterial: boolean;
  };
}

const VEHICLE_TYPES = [
  "Car",
  "Motorcycle",
  "Scooter",
  "Bicycle with Electric Motor",
  "Truck",
  "Wheelchair",
  "Self-balancing Vehicle",
  "Lawn Tractor",
  "Construction Equipment",
  "Farming Equipment",
  "Boat",
  "Aircraft",
  "Mobility Aid",
  "Other",
];

const EQUIPMENT_TYPES = [
  "Power Tool",
  "Medical Device",
  "Portable Electronic Device",
  "Camera Equipment",
  "Measurement Device",
  "Monitoring Equipment",
  "Laboratory Equipment",
  "Cleaning Equipment",
  "Lighting Equipment",
  "Communication Device",
  "Other",
];

const BATTERY_TYPES = [
  "Wet Cell Battery",
  "Non-spillable Battery",
  "Lithium Metal Battery",
  "Lithium Ion Battery",
  "Sodium Battery",
];

const BatteryPoweredVehicle = ({ navigation }: { navigation: any }) => {
  // ✅ NEW: Using Valtio store instead of Context
  const { state, store } = useHazProStore();
  const { navigate } = useNavigationRef();
  const batteryVehicle = state.hazProPreparerContext.batteryVehicle;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;

  // Determine if we're dealing with a vehicle or equipment
  const isVehicle = useMemo(() => {
    return hazardousMaterial?.properShippingName === "BATTERY-POWERED VEHICLE";
  }, [hazardousMaterial]);

  const isEquipment = useMemo(() => {
    return (
      hazardousMaterial?.properShippingName === "BATTERY-POWERED EQUIPMENT"
    );
  }, [hazardousMaterial]);

  const [isLoading, setIsLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState(
    batteryVehicle?.vehicleType || ""
  );
  const [customVehicleType, setCustomVehicleType] = useState(
    batteryVehicle?.customVehicleType || ""
  );
  const [batteryType, setBatteryType] = useState(
    batteryVehicle?.batteryType || ""
  );
  const [batteryInstalled, setBatteryInstalled] = useState(
    batteryVehicle?.batteryInstalled ?? true
  );
  const [securedUpright, setSecuredUpright] = useState(
    batteryVehicle?.securedUpright ?? true
  );
  const [terminalsProtected, setTerminalsProtected] = useState(
    batteryVehicle?.terminalsProtected ?? false
  );
  const [cablesDisconnected, setCablesDisconnected] = useState(
    batteryVehicle?.cablesDisconnected ?? false
  );
  const [cablesSecured, setCablesSecured] = useState(
    batteryVehicle?.cablesSecured ?? false
  );
  const [isWheelchair, setIsWheelchair] = useState(
    batteryVehicle?.isWheelchair ?? false
  );
  const [wheelchairUpright, setWheelchairUpright] = useState(
    batteryVehicle?.wheelchairUpright ?? true
  );
  const [isLithiumBattery, setIsLithiumBattery] = useState(
    batteryVehicle?.isLithiumBattery ?? false
  );
  const [lithiumBatteryTested, setLithiumBatteryTested] = useState(
    batteryVehicle?.lithiumBatteryTested ?? false
  );
  const [notes, setNotes] = useState(batteryVehicle?.notes || "");
  const [key16Description, setKey16Description] = useState(
    batteryVehicle?.key16?.description || ""
  );
  const [key16NetQuantityValue, setKey16NetQuantityValue] = useState(
    batteryVehicle?.key16?.netQuantity?.value?.toString() || ""
  );
  const [key16NetQuantityUnit, setKey16NetQuantityUnit] = useState<
    "kg" | "lbs"
  >(batteryVehicle?.key16?.netQuantity?.unit || "kg");
  const [key16NetQuantityValueKg, setKey16NetQuantityValueKg] = useState(
    batteryVehicle?.key16?.netQuantity?.valueKg?.toString() || ""
  );
  const [key19ContainsMagnetizedMaterial, setKey19ContainsMagnetizedMaterial] =
    useState(batteryVehicle?.key19?.containsMagnetizedMaterial ?? false);

  // Special Provision 134 redirect logic
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectReason, setRedirectReason] = useState("");
  const [recommendedUnid, setRecommendedUnid] = useState("");

  // New: User prompts for SP 134
  const [showVehicleEnginePrompt, setShowVehicleEnginePrompt] = useState<
    null | boolean
  >(null);
  const [showVehicleFuelCellPrompt, setShowVehicleFuelCellPrompt] = useState<
    null | boolean
  >(null);
  const [showEquipmentEnginePrompt, setShowEquipmentEnginePrompt] = useState<
    null | boolean
  >(null);
  const [showEquipmentFuelCellPrompt, setShowEquipmentFuelCellPrompt] =
    useState<null | boolean>(null);
  const [showEquipmentLithiumPrompt, setShowEquipmentLithiumPrompt] = useState<
    null | boolean
  >(null);

  // Redirect handlers
  function handleRedirect(unid: string) {
    handleNestedPreparerContextFieldUpdate("redirectUnid", unid);
    navigation.navigate("MaterialID");
  }

  useEffect(() => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field: "activeStep", value: 2 });
  }, []);

  // Detect wheelchair selection
  useEffect(() => {
    if (vehicleType === "Wheelchair") {
      setIsWheelchair(true);
    } else {
      setIsWheelchair(false);
    }
  }, [vehicleType]);

  // Special Provision 134 logic - check if redirect is needed
  useEffect(() => {
    checkSpecialProvision134Redirect();
  }, [vehicleType, batteryType, isEquipment]);

  const checkSpecialProvision134Redirect = () => {
    // Reset redirect state
    setShouldRedirect(false);
    setRedirectReason("");
    setRecommendedUnid("");

    // SP 134b: Equipment powered by lithium batteries must use lithium battery entries
    if (
      isEquipment &&
      (batteryType === "Lithium Metal Battery" ||
        batteryType === "Lithium Ion Battery")
    ) {
      const equipmentTypes = [
        "Power Tool",
        "Medical Device",
        "Portable Electronic Device",
        "Camera Equipment",
        "Measurement Device",
        "Monitoring Equipment",
        "Laboratory Equipment",
        "Cleaning Equipment",
        "Lighting Equipment",
        "Communication Device",
      ];

      // Check if it's model aircraft/boat or similar equipment
      if (vehicleType === "Other" || equipmentTypes.includes(vehicleType)) {
        setShouldRedirect(true);
        if (batteryType === "Lithium Ion Battery") {
          setRecommendedUnid("UN3481");
          setRedirectReason(
            "Equipment powered by lithium ion batteries must be classified under UN3481 - LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT per Special Provision 134(b)."
          );
        } else {
          setRecommendedUnid("UN3091");
          setRedirectReason(
            "Equipment powered by lithium metal batteries must be classified under UN3091 - LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT per Special Provision 134(b)."
          );
        }
      }
    }
  };

  const handleRedirectToCorrectClassification = () => {
    // Set the unidRedirect context property
    handleNestedPreparerContextFieldUpdate("unidRedirect", recommendedUnid);

    // Navigate back or show confirmation that redirect will occur
    // The actual redirect logic will be handled by parent components
  };

  // Detect lithium battery selection
  useEffect(() => {
    if (
      batteryType === "Lithium Metal Battery" ||
      batteryType === "Lithium Ion Battery"
    ) {
      setIsLithiumBattery(true);
    } else {
      setIsLithiumBattery(false);
      setLithiumBatteryTested(false);
    }
  }, [batteryType]);

  const handleNestedPreparerContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const pCode = useMemo(() => {
    const match = hazardousMaterial?.specialProvision?.match(/P[1-5]/);
    return match ? match[0] : "";
  }, [hazardousMaterial]);

  const title = useMemo(() => {
    return `${hazardousMaterial?.unid} | ${hazardousMaterial?.properShippingName} | ${pCode} | ${hazardousMaterial?.packagingParagraph}`;
  }, [hazardousMaterial, pCode]);

  // Handler for Key 16 net quantity input
  const handleKey16QuantityChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setKey16NetQuantityValue(numericValue);
    let valueKg = 0;
    if (key16NetQuantityUnit === "kg") {
      valueKg = parseFloat(numericValue) || 0;
      setKey16NetQuantityValueKg(valueKg.toString());
    } else {
      valueKg = (parseFloat(numericValue) || 0) * 0.45359237;
      setKey16NetQuantityValueKg(valueKg ? valueKg.toFixed(2) : "0");
    }
  };
  const handleKey16UnitChange = (unit: "kg" | "lbs") => {
    setKey16NetQuantityUnit(unit);
    // Recalculate valueKg if value is present
    if (key16NetQuantityValue) {
      let valueKg = 0;
      if (unit === "kg") {
        valueKg = parseFloat(key16NetQuantityValue) || 0;
        setKey16NetQuantityValueKg(valueKg.toString());
      } else {
        valueKg = (parseFloat(key16NetQuantityValue) || 0) * 0.45359237;
        setKey16NetQuantityValueKg(valueKg ? valueKg.toFixed(2) : "0");
      }
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    const basicInfoValid =
      vehicleType !== "" &&
      (vehicleType !== "Other" ||
        (vehicleType === "Other" && customVehicleType.trim() !== "")) &&
      batteryType !== "";

    const batteryProtectionValid = securedUpright && terminalsProtected;

    const wheelchairValid =
      !isWheelchair || (isWheelchair && wheelchairUpright);

    const lithiumValid =
      !isLithiumBattery || (isLithiumBattery && lithiumBatteryTested);

    // Key 16 validation
    const key16Valid =
      key16Description.trim().length > 0 &&
      parseFloat(key16NetQuantityValue) > 0;

    return (
      basicInfoValid &&
      batteryProtectionValid &&
      wheelchairValid &&
      lithiumValid &&
      key16Valid
    );
  }, [
    vehicleType,
    customVehicleType,
    batteryType,
    securedUpright,
    terminalsProtected,
    isWheelchair,
    wheelchairUpright,
    isLithiumBattery,
    lithiumBatteryTested,
    key16Description,
    key16NetQuantityValue,
  ]);

  const handleSaveAndContinue = () => {
    setIsLoading(true);

    const batteryVehicleData = {
      vehicleType,
      customVehicleType: vehicleType === "Other" ? customVehicleType : "",
      batteryType,
      batteryInstalled,
      securedUpright,
      terminalsProtected,
      cablesDisconnected,
      cablesSecured,
      isWheelchair,
      wheelchairUpright,
      isLithiumBattery,
      lithiumBatteryTested,
      notes,
      key16: {
        description: key16Description,
        netQuantity: {
          value: parseFloat(key16NetQuantityValue) || 0,
          unit: key16NetQuantityUnit,
          valueKg: parseFloat(key16NetQuantityValueKg) || 0,
        },
      },
      key19: {
        containsMagnetizedMaterial: key19ContainsMagnetizedMaterial,
      },
    };

    handleNestedPreparerContextFieldUpdate(
      "batteryVehicle",
      batteryVehicleData
    );

    handleNestedPreparerContextFieldUpdate("completedSubsteps", [
      ...completedSubsteps,
      "BatteryPoweredVehicle",
    ]);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("LabelingAndMarking");
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {title || "Battery Powered Vehicle / Equipment"}
            </Text>
          </View>

          {/* Reference Panel */}
          <View style={styles.referencePanel}>
            <Text style={styles.referenceTitle}>AFMAN24-604 Requirements</Text>
            <Text style={styles.referenceText}>
              • Secure batteries upright in designed holders
            </Text>
            <Text style={styles.referenceText}>
              • Protect terminals to prevent short circuit
            </Text>
            <Text style={styles.referenceText}>
              • If disconnected, secure cables away from terminals
            </Text>
            {isVehicle && (
              <Text style={styles.referenceText}>
                • Special considerations apply for wheelchairs
              </Text>
            )}
            <Text style={styles.referenceText}>
              • Lithium batteries must be of a type that has passed UN testing
            </Text>
          </View>

          {/* Vehicle/Equipment Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {isVehicle ? "Vehicle Information" : "Equipment Information"}
            </Text>

            <Text style={styles.infoText}>
              Use {isVehicle ? "vehicle" : "equipment"} service technical
              manuals to prepare items for shipment. (A13.6.1)
            </Text>

            {/* Special Provision 134 Notice */}
            <View style={styles.specialProvisionNotice}>
              <Text style={styles.specialProvisionTitle}>
                Special Provision 134
              </Text>
              <Text style={styles.specialProvisionText}>
                {isVehicle
                  ? "This entry applies to vehicles powered by wet batteries, sodium batteries, lithium metal batteries or lithium ion batteries that are transported with these batteries installed."
                  : "Equipment powered by lithium metal batteries or lithium ion batteries must be consigned under lithium battery entries (UN3480/3481/3090/3091) as appropriate."}
              </Text>
            </View>

            {/* For Battery-Powered Vehicle: Internal Combustion Engine */}
            {isVehicle && (
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>
                  Does your vehicle contain an internal combustion engine?
                </Text>
                <View style={styles.promptButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showVehicleEnginePrompt === true &&
                        styles.promptYesButtonActive,
                    ]}
                    onPress={() => setShowVehicleEnginePrompt(true)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showVehicleEnginePrompt === true &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showVehicleEnginePrompt === false &&
                        styles.promptNoButtonActive,
                    ]}
                    onPress={() => setShowVehicleEnginePrompt(false)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showVehicleEnginePrompt === false &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
                {showVehicleEnginePrompt === true && (
                  <View style={[styles.redirectWarning, { marginTop: 12 }]}>
                    <Text style={styles.redirectWarningTitle}>
                      ⚠️ Classification Change Required
                    </Text>
                    <Text style={styles.redirectWarningText}>
                      Self-propelled vehicles with an internal combustion engine
                      must be consigned under the appropriate entry.
                    </Text>
                    <View style={styles.redirectButtonRow}>
                      <TouchableOpacity
                        style={[
                          styles.redirectButton,
                          { flex: 1, marginRight: 8 },
                        ]}
                        onPress={() => handleRedirect("UN3166")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Vehicle, flammable gas powered
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.redirectButton, { flex: 1 }]}
                        onPress={() => handleRedirect("UN3166")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Vehicle, flammable liquid powered
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* For Battery-Powered Vehicle: Fuel Cell Engine */}
            {isVehicle && (
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>
                  Does your vehicle contain a fuel cell engine (hybrid or fuel
                  cell)?
                </Text>
                <View style={styles.promptButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showVehicleFuelCellPrompt === true &&
                        styles.promptYesButtonActive,
                    ]}
                    onPress={() => setShowVehicleFuelCellPrompt(true)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showVehicleFuelCellPrompt === true &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showVehicleFuelCellPrompt === false &&
                        styles.promptNoButtonActive,
                    ]}
                    onPress={() => setShowVehicleFuelCellPrompt(false)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showVehicleFuelCellPrompt === false &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
                {showVehicleFuelCellPrompt === true && (
                  <View style={[styles.redirectWarning, { marginTop: 12 }]}>
                    <Text style={styles.redirectWarningTitle}>
                      ⚠️ Classification Change Required
                    </Text>
                    <Text style={styles.redirectWarningText}>
                      Self-propelled vehicles with a fuel cell engine must be
                      consigned under the appropriate entry.
                    </Text>
                    <View style={styles.redirectButtonRow}>
                      <TouchableOpacity
                        style={[
                          styles.redirectButton,
                          { flex: 1, marginRight: 8 },
                        ]}
                        onPress={() => handleRedirect("UN3166")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Vehicle, fuel cell, flammable gas powered
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.redirectButton, { flex: 1 }]}
                        onPress={() => handleRedirect("UN3166")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Vehicle, fuel cell, flammable liquid powered
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* For Battery-Powered Equipment: Internal Combustion Engine and Fuel Cell */}
            {isEquipment && (
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>
                  Does your equipment contain an internal combustion engine?
                </Text>
                <View style={styles.promptButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showEquipmentEnginePrompt === true &&
                        styles.promptYesButtonActive,
                    ]}
                    onPress={() => setShowEquipmentEnginePrompt(true)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showEquipmentEnginePrompt === true &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showEquipmentEnginePrompt === false &&
                        styles.promptNoButtonActive,
                    ]}
                    onPress={() => setShowEquipmentEnginePrompt(false)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showEquipmentEnginePrompt === false &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
                {showEquipmentEnginePrompt === true && (
                  <View style={[styles.redirectWarning, { marginTop: 12 }]}>
                    <Text style={styles.redirectWarningTitle}>
                      ⚠️ Classification Change Required
                    </Text>
                    <Text style={styles.redirectWarningText}>
                      Equipment with an internal combustion engine must be
                      consigned under the appropriate entry.
                    </Text>
                    <View style={styles.redirectButtonRow}>
                      <TouchableOpacity
                        style={[
                          styles.redirectButton,
                          { flex: 1, marginRight: 8 },
                        ]}
                        onPress={() => handleRedirect("UN3529")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Engine, internal combustion, flammable gas powered
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.redirectButton, { flex: 1 }]}
                        onPress={() => handleRedirect("UN3529")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Engine, internal combustion, flammable liquid powered
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <Text style={[styles.promptText, { marginTop: 16 }]}>
                  Does your equipment contain a fuel cell engine (hybrid or fuel
                  cell)?
                </Text>
                <View style={styles.promptButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showEquipmentFuelCellPrompt === true &&
                        styles.promptYesButtonActive,
                    ]}
                    onPress={() => setShowEquipmentFuelCellPrompt(true)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showEquipmentFuelCellPrompt === true &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showEquipmentFuelCellPrompt === false &&
                        styles.promptNoButtonActive,
                    ]}
                    onPress={() => setShowEquipmentFuelCellPrompt(false)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showEquipmentFuelCellPrompt === false &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
                {showEquipmentFuelCellPrompt === true && (
                  <View style={[styles.redirectWarning, { marginTop: 12 }]}>
                    <Text style={styles.redirectWarningTitle}>
                      ⚠️ Classification Change Required
                    </Text>
                    <Text style={styles.redirectWarningText}>
                      Equipment with a fuel cell engine must be consigned under
                      the appropriate entry.
                    </Text>
                    <View style={styles.redirectButtonRow}>
                      <TouchableOpacity
                        style={[
                          styles.redirectButton,
                          { flex: 1, marginRight: 8 },
                        ]}
                        onPress={() => handleRedirect("UN3529")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Engine, fuel cell, flammable gas powered
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.redirectButton, { flex: 1 }]}
                        onPress={() => handleRedirect("UN3528")}
                      >
                        <Text style={styles.redirectButtonText}>
                          Engine, fuel cell, flammable liquid powered
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* For Battery-Powered Equipment: Lithium Battery Power */}
            {isEquipment && (
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>
                  Is your equipment powered by lithium metal batteries or
                  lithium ion batteries?
                </Text>
                <View style={styles.promptButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showEquipmentLithiumPrompt === true &&
                        styles.promptYesButtonActive,
                    ]}
                    onPress={() => setShowEquipmentLithiumPrompt(true)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showEquipmentLithiumPrompt === true &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      showEquipmentLithiumPrompt === false &&
                        styles.promptNoButtonActive,
                    ]}
                    onPress={() => setShowEquipmentLithiumPrompt(false)}
                  >
                    <Text
                      style={[
                        styles.promptButtonText,
                        showEquipmentLithiumPrompt === false &&
                          styles.promptButtonTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
                {showEquipmentLithiumPrompt === true && (
                  <View style={[styles.redirectWarning, { marginTop: 12 }]}>
                    <Text style={styles.redirectWarningTitle}>
                      ⚠️ Classification Change Required
                    </Text>
                    <Text style={styles.redirectWarningText}>
                      Equipment powered by lithium batteries must be consigned
                      under lithium battery entries per Special Provision
                      134(b).
                    </Text>
                    <TouchableOpacity
                      style={styles.redirectButton}
                      onPress={() => handleRedirect("UN3091")}
                    >
                      <Text style={styles.redirectButtonText}>
                        Lithium metal batteries contained in equipment
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.redirectButton}
                      onPress={() => handleRedirect("UN3481")}
                    >
                      <Text style={styles.redirectButtonText}>
                        Lithium ion batteries contained in equipment
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                {isVehicle ? "Vehicle Type" : "Equipment Type"}
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={vehicleType}
                  onValueChange={setVehicleType}
                  style={styles.picker}
                  dropdownIconColor="#495057"
                >
                  <Picker.Item
                    label={`Select ${isVehicle ? "vehicle" : "equipment"} type`}
                    value=""
                    enabled={false}
                  />
                  {(isVehicle ? VEHICLE_TYPES : EQUIPMENT_TYPES).map(type => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
              {isEquipment && (
                <Text style={styles.helperText}>
                  Examples of equipment: lawnmowers, cleaning machines, model
                  boats, model aircraft, power tools, medical devices.
                </Text>
              )}
            </View>

            {vehicleType === "Other" && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Specify {isVehicle ? "Vehicle" : "Equipment"} Type
                </Text>
                <TextInput
                  style={styles.input}
                  value={customVehicleType}
                  onChangeText={setCustomVehicleType}
                  placeholder={`Enter ${
                    isVehicle ? "vehicle" : "equipment"
                  } type`}
                />
                {isEquipment && (
                  <Text style={styles.helperText}>
                    If this is equipment powered by lithium batteries (e.g.,
                    model aircraft, drones), it may need to be classified under
                    lithium battery entries.
                  </Text>
                )}
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Battery Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={batteryType}
                  onValueChange={setBatteryType}
                  style={styles.picker}
                  dropdownIconColor="#495057"
                >
                  <Picker.Item
                    label="Select battery type"
                    value=""
                    enabled={false}
                  />
                  {BATTERY_TYPES.map(type => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
              {isLithiumBattery && isVehicle && (
                <Text style={styles.helperText}>
                  Lithium batteries must be securely fastened in the battery
                  holder and protected from damage and short circuits (e.g.,
                  non-conductive caps that cover the terminals entirely).
                  Prototype or low production lithium batteries must have passed
                  UN tests or be DOT approved. (A13.6.6)
                </Text>
              )}
              {isLithiumBattery && isEquipment && (
                <Text style={styles.warningText}>
                  ⚠️ Equipment powered by lithium batteries typically requires
                  classification under lithium battery entries
                  (UN3480/3481/3090/3091) per Special Provision 134(b).
                </Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Battery Installation Status</Text>
              <Text style={styles.infoText}>
                Secure batteries upright in designed holders. Protect terminals
                to prevent short circuit (battery boxes, covers, taping, etc.).
                If cables are disconnected, secure them away from terminals and
                protect the terminals. Remove the battery and ship according to
                A12.4 if the item is likely to be shipped in other than an
                upright position. (A13.6.2)
              </Text>
              <View style={styles.radioButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    batteryInstalled && styles.radioButtonSelected,
                  ]}
                  onPress={() => setBatteryInstalled(true)}
                >
                  <View style={styles.radioButtonCircle}>
                    {batteryInstalled && (
                      <View style={styles.radioButtonSelectedCircle} />
                    )}
                  </View>
                  <Text style={styles.radioButtonText}>
                    Battery installed in {isVehicle ? "vehicle" : "equipment"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    !batteryInstalled && styles.radioButtonSelected,
                  ]}
                  onPress={() => setBatteryInstalled(false)}
                >
                  <View style={styles.radioButtonCircle}>
                    {!batteryInstalled && (
                      <View style={styles.radioButtonSelectedCircle} />
                    )}
                  </View>
                  <Text style={styles.radioButtonText}>
                    Battery removed (shipped separately)
                  </Text>
                </TouchableOpacity>
              </View>
              {!batteryInstalled && (
                <Text style={styles.helperText}>
                  Removed batteries must be prepared and shipped according to
                  A12.4 regulations.
                </Text>
              )}
            </View>
          </View>

          {/* Battery Safety Requirements */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Battery Safety Requirements</Text>

            {batteryInstalled && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Battery Secured Upright</Text>
                  <Text style={styles.infoText}>
                    Secure batteries upright in designed holders except
                    non-spillable batteries meeting Table A4.2, Special
                    Provision A67 as nonhazardous, may be oriented to fit
                    designed holder. (A13.6.2)
                  </Text>
                  <View style={styles.yesNoButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.responseButton,
                        securedUpright && styles.yesButtonActive,
                      ]}
                      onPress={() => setSecuredUpright(true)}
                    >
                      <Text
                        style={[
                          styles.responseButtonText,
                          securedUpright && styles.responseButtonTextActive,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.responseButton,
                        !securedUpright && styles.noButtonActive,
                      ]}
                      onPress={() => setSecuredUpright(false)}
                    >
                      <Text
                        style={[
                          styles.responseButtonText,
                          !securedUpright && styles.responseButtonTextActive,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!securedUpright && (
                    <Text style={styles.errorText}>
                      Batteries must be secured upright in designed holders per
                      AFMAN24-604. Remove the battery and ship according to
                      A12.4 if the item is likely to be shipped in other than an
                      upright position.
                    </Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>
                    Terminals Protected from Short Circuit
                  </Text>
                  <Text style={styles.infoText}>
                    Protect the terminals of installed batteries to prevent
                    short circuit by use of battery boxes, protective covers,
                    taping, etc. (A13.6.2)
                  </Text>
                  <View style={styles.yesNoButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.responseButton,
                        terminalsProtected && styles.yesButtonActive,
                      ]}
                      onPress={() => setTerminalsProtected(true)}
                    >
                      <Text
                        style={[
                          styles.responseButtonText,
                          terminalsProtected && styles.responseButtonTextActive,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.responseButton,
                        !terminalsProtected && styles.noButtonActive,
                      ]}
                      onPress={() => setTerminalsProtected(false)}
                    >
                      <Text
                        style={[
                          styles.responseButtonText,
                          !terminalsProtected &&
                            styles.responseButtonTextActive,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!terminalsProtected && (
                    <Text style={styles.errorText}>
                      Battery terminals must be protected against short
                      circuits.
                    </Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Battery Cables Status</Text>
                  <Text style={styles.infoText}>
                    If battery cables are disconnected, secure them away from
                    terminals, and protect the terminals. (A13.6.2)
                  </Text>
                  <View style={styles.radioButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.radioButton,
                        !cablesDisconnected && styles.radioButtonSelected,
                      ]}
                      onPress={() => setCablesDisconnected(false)}
                    >
                      <View style={styles.radioButtonCircle}>
                        {!cablesDisconnected && (
                          <View style={styles.radioButtonSelectedCircle} />
                        )}
                      </View>
                      <Text style={styles.radioButtonText}>
                        Cables connected to battery
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.radioButton,
                        cablesDisconnected && styles.radioButtonSelected,
                      ]}
                      onPress={() => setCablesDisconnected(true)}
                    >
                      <View style={styles.radioButtonCircle}>
                        {cablesDisconnected && (
                          <View style={styles.radioButtonSelectedCircle} />
                        )}
                      </View>
                      <Text style={styles.radioButtonText}>
                        Cables disconnected from battery
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {cablesDisconnected && (
                    <Text style={styles.helperText}>
                      Disconnected cables should be secured away from terminals
                      to prevent short circuits. Protect the terminals.
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Special Requirements - only show if relevant */}
          {(isWheelchair || isLithiumBattery) && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Special Requirements</Text>

              {/* Wheelchair specific requirements - only show for vehicles */}
              {isVehicle && isWheelchair && (
                <View style={styles.specialRequirementSection}>
                  <Text style={styles.sectionSubtitle}>
                    Wheelchair Requirements
                  </Text>
                  <Text style={styles.infoText}>
                    For wheelchairs equipped with non-spillable batteries:
                    Protect against short circuits and securely attach to the
                    wheelchair or remove and box. Specification packaging is not
                    required. (A13.6.4)
                  </Text>
                  <Text style={styles.infoText}>
                    For wheelchairs equipped with spillable batteries: Must be
                    secured upright in cargo, battery installed and attached,
                    terminals protected, wheelchair deactivated (connections
                    removed or power source disconnected). If not upright,
                    battery must be removed and shipped per A12.4. (A13.6.5)
                  </Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>
                      Wheelchair Loaded in Upright Position
                    </Text>
                    <View style={styles.yesNoButtonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.responseButton,
                          wheelchairUpright && styles.yesButtonActive,
                        ]}
                        onPress={() => setWheelchairUpright(true)}
                      >
                        <Text
                          style={[
                            styles.responseButtonText,
                            wheelchairUpright &&
                              styles.responseButtonTextActive,
                          ]}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.responseButton,
                          !wheelchairUpright && styles.noButtonActive,
                        ]}
                        onPress={() => setWheelchairUpright(false)}
                      >
                        <Text
                          style={[
                            styles.responseButtonText,
                            !wheelchairUpright &&
                              styles.responseButtonTextActive,
                          ]}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {!wheelchairUpright && batteryInstalled && (
                      <Text style={styles.errorText}>
                        Batteries must be removed if wheelchair cannot be
                        shipped upright. Remove and ship battery per A12.4.
                      </Text>
                    )}
                    <Text style={styles.helperText}>
                      Wheelchairs with spillable batteries must be secured in
                      upright position. If not possible, battery must be
                      removed.
                    </Text>
                  </View>
                </View>
              )}

              {/* Lithium battery specific requirements */}
              {isLithiumBattery && (
                <View style={styles.specialRequirementSection}>
                  <Text style={styles.sectionSubtitle}>
                    Lithium Battery Requirements
                  </Text>
                  <Text style={styles.infoText}>
                    Securely fasten lithium batteries contained in{" "}
                    {isVehicle ? "vehicles" : "equipment"}, engines, or
                    mechanical equipment in the battery holder, and protect in
                    such a manner as to prevent damage and short circuits (e.g.,
                    by the use of non-conductive caps that cover the terminals
                    entirely). Prototype or low production lithium batteries
                    securely installed, each lithium battery must be of a type
                    that has successfully passed each test in the UN Manual of
                    Tests and Criteria, or approved by the Associate
                    Administrator of the DOT. (A13.6.6)
                  </Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>
                      Battery Testing Compliance
                    </Text>
                    <View style={styles.yesNoButtonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.responseButton,
                          lithiumBatteryTested && styles.yesButtonActive,
                        ]}
                        onPress={() => setLithiumBatteryTested(true)}
                      >
                        <Text
                          style={[
                            styles.responseButtonText,
                            lithiumBatteryTested &&
                              styles.responseButtonTextActive,
                          ]}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.responseButton,
                          !lithiumBatteryTested && styles.noButtonActive,
                        ]}
                        onPress={() => setLithiumBatteryTested(false)}
                      >
                        <Text
                          style={[
                            styles.responseButtonText,
                            !lithiumBatteryTested &&
                              styles.responseButtonTextActive,
                          ]}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {!lithiumBatteryTested && (
                      <Text style={styles.errorText}>
                        Lithium batteries must have passed UN Manual of Tests
                        and Criteria or be DOT approved.
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Key 16 – Cargo Description & Quantity */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Key 16 – Cargo Description & Quantity
            </Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Nomenclature / Description</Text>
              <TextInput
                style={styles.input}
                value={key16Description}
                onChangeText={setKey16Description}
                placeholder="e.g. Truck, Generator, Wheelchair"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Model Number / Specific Description (optional)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. M-Series, 50 KW, 60 HZ, Commercial Model #, etc."
                value={notes}
                onChangeText={setNotes}
              />
              <Text style={styles.helperText}>
                Enter a specific model number or description if available. The
                basic description may be used for items not requiring an outer
                package or container (e.g., cylinders) according to this manual.
              </Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Net Quantity of Hazardous Material
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  value={key16NetQuantityValue}
                  onChangeText={handleKey16QuantityChange}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                />
                <TouchableOpacity
                  style={[
                    styles.responseButton,
                    key16NetQuantityUnit === "kg" && styles.yesButtonActive,
                  ]}
                  onPress={() => handleKey16UnitChange("kg")}
                >
                  <Text
                    style={[
                      styles.responseButtonText,
                      key16NetQuantityUnit === "kg" &&
                        styles.responseButtonTextActive,
                    ]}
                  >
                    kg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.responseButton,
                    key16NetQuantityUnit === "lbs" && styles.yesButtonActive,
                  ]}
                  onPress={() => handleKey16UnitChange("lbs")}
                >
                  <Text
                    style={[
                      styles.responseButtonText,
                      key16NetQuantityUnit === "lbs" &&
                        styles.responseButtonTextActive,
                    ]}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
              </View>
              {key16NetQuantityUnit === "lbs" && (
                <Text style={styles.helperText}>
                  Metric value (kg): {key16NetQuantityValueKg || "0"}
                </Text>
              )}
            </View>
          </View>
          {/* Key 19 – Magnetized Material Statement */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Key 19 – Magnetized Material Statement
            </Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Contains Magnetized Material?
              </Text>
              <View style={styles.yesNoButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.responseButton,
                    key19ContainsMagnetizedMaterial && styles.yesButtonActive,
                  ]}
                  onPress={() => setKey19ContainsMagnetizedMaterial(true)}
                >
                  <Text
                    style={[
                      styles.responseButtonText,
                      key19ContainsMagnetizedMaterial &&
                        styles.responseButtonTextActive,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.responseButton,
                    !key19ContainsMagnetizedMaterial && styles.noButtonActive,
                  ]}
                  onPress={() => setKey19ContainsMagnetizedMaterial(false)}
                >
                  <Text
                    style={[
                      styles.responseButtonText,
                      !key19ContainsMagnetizedMaterial &&
                        styles.responseButtonTextActive,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                If Yes, "Contains Magnetized Material" will be included in Key
                19 output.
              </Text>
            </View>
          </View>

          {/* Notes field for all types */}
          <View style={styles.card}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                Additional Preparation Notes
              </Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter any additional details about preparation"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={() => {
              dispatch({
                type: "SAVE_SHIPMENT",
                payload: {
                  id: Date.now().toString(),
                  status: "in-progress",
                },
              });
              navigate("PreparerHomeStack", { screen: "PreparerHome" });
            }}
          >
            <Text style={styles.buttonText}>Save & Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isFormValid || isLoading) && styles.disabledButton,
            ]}
            onPress={handleSaveAndContinue}
            disabled={!isFormValid || isLoading}
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BatteryPoweredVehicle;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
  },
  referencePanel: {
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0056b3",
    marginBottom: 10,
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#495057",
    marginBottom: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212529",
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#343a40",
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 55,
    width: "100%",
    color: "#212529",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 8,
  },
  helperText: {
    color: "#6c757d",
    fontSize: 13,
    marginTop: 6,
  },
  specialRequirementSection: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  // Radio button styles
  radioButtonContainer: {
    marginTop: 4,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  radioButtonSelected: {
    backgroundColor: "#f0f7ff",
  },
  radioButtonCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonSelectedCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  radioButtonText: {
    fontSize: 16,
    color: "#212529",
  },
  // Yes/No button styles
  yesNoButtonContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  responseButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#dee2e6",
    backgroundColor: "#f8f9fa",
    minWidth: 80,
    alignItems: "center",
  },
  yesButtonActive: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  noButtonActive: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    shadowColor: "#dc3545",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ scale: 1.05 }],
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
  infoText: {
    fontSize: 13,
    color: "#495057",
    marginBottom: 6,
  },
  warningText: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
    fontWeight: "500",
  },
  specialProvisionNotice: {
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  specialProvisionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 4,
  },
  specialProvisionText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 16,
  },
  redirectWarning: {
    backgroundColor: "#f8d7da",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  redirectWarningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#721c24",
    marginBottom: 8,
  },
  redirectWarningText: {
    fontSize: 12,
    color: "#721c24",
    lineHeight: 16,
    marginBottom: 12,
  },
  redirectButton: {
    backgroundColor: "#dc3545",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  redirectButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  promptBox: {
    backgroundColor: "#e9f5ff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  promptText: {
    fontSize: 14,
    color: "#0056b3",
    marginBottom: 8,
    fontWeight: "500",
  },
  promptButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  promptButton: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: "center",
  },
  promptButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  redirectButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  promptYesButtonActive: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  promptNoButtonActive: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    shadowColor: "#dc3545",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  promptButtonTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
