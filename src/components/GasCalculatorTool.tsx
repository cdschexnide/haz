import {
  CalculateGasQuantityOutput,
  calculateGasQuantity,
} from "@/utils/gasQuantityCalculator";
import { commonGases } from "@/utils/propertiesOfCommonGases";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface FormError {
  field: string;
  message: string;
}

interface BasicInputFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  error?: string | null;
  unit?: string | null;
  editable?: boolean;
  containerStyle?: object;
  onBlur?: () => void;
}

const BasicInputField: React.FC<BasicInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  unit,
  editable = true,
  containerStyle = {},
  onBlur,
}) => (
  <View style={[styles.formField, containerStyle]}>
    <Text style={styles.fieldLabel}>{label}</Text>

    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType="numeric"
        style={[
          styles.basicInput,
          error ? { borderColor: "red" } : null,
          !editable ? { backgroundColor: "#f7fafc" } : null,
        ]}
        editable={editable}
        onBlur={onBlur}
      />
      {unit && <Text style={styles.unitLabel}>{unit}</Text>}
    </View>

    {error && <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>}
  </View>
);

interface GasCalculatorToolProps {
  visible: boolean;
  onClose: () => void;
}

const GasCalculatorTool: React.FC<GasCalculatorToolProps> = ({
  visible,
  onClose,
}) => {
  const [psi, setPsi] = useState<string>("");
  const [radius, setRadius] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [specificGravity, setSpecificGravity] = useState<string>("");
  const [molecularWeight, setMolecularWeight] = useState<string>("");
  const [selectedGasType, setSelectedGasType] = useState<string>("");
  const [errors, setErrors] = useState<FormError[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showInfoTab, setShowInfoTab] = useState<string | null>(null);
  const [preferredUnit, setPreferredUnit] = useState<"kg" | "g">("kg");
  const [gasQuantity, setGasQuantity] =
    useState<CalculateGasQuantityOutput | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { width: windowWidth } = useWindowDimensions();
  const useTwoColumnLayout = windowWidth >= 360;

  const modalWidth = useMemo(() => {
    return Math.min(600, windowWidth * 0.9);
  }, [windowWidth]);

  const [gasOptions, setGasOptions] = useState<
    Array<{
      name: string;
      specificGravity: number | null;
      molecularWeight: number | null;
    }>
  >([{ name: "Gas Not Listed", specificGravity: null, molecularWeight: null }]);

  useEffect(() => {
    const options: Array<{
      name: string;
      specificGravity: number | null;
      molecularWeight: number | null;
    }> = [
      {
        name: "Gas Not Listed",
        specificGravity: null,
        molecularWeight: null,
      },
    ];

    Object.entries(commonGases).forEach(([key, value]) => {
      options.push({
        name: value.gasName,
        specificGravity: value.specificGravity,
        molecularWeight: value.molecularWeight,
      });
    });

    setGasOptions(options);
  }, []);

  useEffect(() => {
    if (selectedGasType !== "Gas Not Listed") {
      const selectedGas = gasOptions.find(gas => gas.name === selectedGasType);
      if (
        selectedGas &&
        selectedGas.specificGravity &&
        selectedGas.molecularWeight
      ) {
        setSpecificGravity(selectedGas.specificGravity.toString());
        setMolecularWeight(selectedGas.molecularWeight.toString());
      }
    }
  }, [selectedGasType, gasOptions]);

  useEffect(() => {
    if (!visible) {
      setPsi("");
      setRadius("");
      setHeight("");
      setSpecificGravity("");
      setMolecularWeight("");
      setSelectedGasType("");
      setErrors([]);
      setIsCalculating(false);
      setShowInfoTab(null);
      setPreferredUnit("kg");
      setGasQuantity(null);
      setModalVisible(false);
    }
  }, [visible]);

  const getFieldError = (fieldName: string): string | null => {
    const error = errors.find(err => err.field === fieldName);
    return error ? error.message : null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormError[] = [];

    if (!psi || isNaN(parseFloat(psi)) || parseFloat(psi) <= 0) {
      newErrors.push({
        field: "psi",
        message: "Required: enter a positive number",
      });
    }

    if (!radius || isNaN(parseFloat(radius)) || parseFloat(radius) <= 0) {
      newErrors.push({
        field: "radius",
        message: "Required: enter a positive number",
      });
    }

    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      newErrors.push({
        field: "height",
        message: "Required: enter a positive number",
      });
    }

    const hasSG =
      specificGravity &&
      !isNaN(parseFloat(specificGravity)) &&
      parseFloat(specificGravity) > 0;
    const hasMW =
      molecularWeight &&
      !isNaN(parseFloat(molecularWeight)) &&
      parseFloat(molecularWeight) > 0;

    if (!hasSG && !hasMW) {
      newErrors.push({
        field: "gas",
        message: "Provide either specific gravity or molecular weight",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculateWithValidation = () => {
    if (validateForm()) {
      setIsCalculating(true);
      try {
        const result = calculateGasQuantity({
          psi: parseFloat(psi),
          radius: parseFloat(radius),
          height: parseFloat(height),
          specificGravity: parseFloat(specificGravity),
          molecularWeight: parseFloat(molecularWeight),
        });
        setTimeout(() => {
          setGasQuantity(result);
          setIsCalculating(false);
        }, 500);
      } catch (error) {
        setIsCalculating(false);
        setErrors([{ field: "calculation", message: "Calculation error" }]);
      }
    }
  };

  const getInfoContent = (infoType: string) => {
    switch (infoType) {
      case "psi":
        return (
          <View>
            <Text style={styles.infoTitle}>Internal Pressure (PSI)</Text>
            <Text style={styles.infoText}>
              The internal pressure of the cylinder in pounds per square inch
              (PSI). This is typically indicated on the cylinder's gauge or in
              the specifications.
            </Text>
          </View>
        );
      case "dimensions":
        return (
          <View>
            <Text style={styles.infoTitle}>Cylinder Dimensions</Text>
            <Text style={styles.infoText}>
              • Radius: Half the diameter of the cylinder in inches{"\n"}•
              Height: The internal height of the cylinder in inches{"\n\n"}
              These measurements reflect the internal volume of the cylinder.
            </Text>
          </View>
        );
      case "gas":
        return (
          <View>
            <Text style={styles.infoTitle}>Gas Properties</Text>
            <Text style={styles.infoText}>
              For accurate calculations, provide either:{"\n\n"}• Specific
              Gravity: The density of the gas relative to air (dimensionless)
              {"\n"}• Molecular Weight: The mass of one mole of the gas in g/mol
              {"\n\n"}
              If your gas is in the dropdown, select it to auto-fill these
              values.
              {"\n"}If "Gas Not Listed" is selected, you must enter at least one
              value manually from the MSDS or technical documentation.
            </Text>
          </View>
        );
      default:
        return <Text>No information available</Text>;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,0.6)" />
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardWrapper}
          >
            <View style={[styles.card, { width: modalWidth }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Gas Quantity Calculator</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityLabel="Close calculator"
                >
                  <MaterialCommunityIcons name="close" size={22} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={styles.formContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
              >
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Gas Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedGasType}
                      onValueChange={itemValue =>
                        setSelectedGasType(itemValue.toString())
                      }
                      style={styles.picker}
                    >
                      <Picker.Item
                        label="Select Gas Type"
                        value=""
                        color="#888"
                        enabled={false}
                      />
                      {gasOptions.map((gas, index) => (
                        <Picker.Item
                          key={index}
                          label={gas.name}
                          value={gas.name}
                          color={"black"}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                {selectedGasType === "Gas Not Listed" && (
                  <View style={styles.gasNotListedAlert}>
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={20}
                      color="#e53e3e"
                    />
                    <Text style={styles.gasNotListedText}>
                      Please provide either Specific Gravity OR Molecular Weight
                      from MSDS or technical documentation
                    </Text>
                  </View>
                )}
                <View style={[styles.formRow, { marginBottom: 16 }]}>
                  <BasicInputField
                    label="Internal Pressure"
                    value={psi}
                    onChange={setPsi}
                    placeholder="e.g. 2000"
                    error={getFieldError("psi")}
                    unit="PSI"
                    containerStyle={styles.fieldThird}
                  />
                  <BasicInputField
                    label="Radius"
                    value={radius}
                    onChange={setRadius}
                    placeholder="e.g. 4.5"
                    error={getFieldError("radius")}
                    unit="in"
                    containerStyle={styles.fieldThird}
                  />
                  <BasicInputField
                    label="Height"
                    value={height}
                    onChange={setHeight}
                    placeholder="e.g. 36"
                    error={getFieldError("height")}
                    unit="in"
                    containerStyle={styles.fieldThird}
                  />
                </View>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Gas Properties</Text>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => setShowInfoTab("gas")}
                      accessibilityLabel="Gas properties information"
                    >
                      <MaterialCommunityIcons
                        name="information-outline"
                        size={16}
                        color="#3498db"
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.rowFields,
                      !useTwoColumnLayout && styles.columnFields,
                    ]}
                  >
                    <BasicInputField
                      label="Specific Gravity"
                      value={specificGravity}
                      onChange={setSpecificGravity}
                      placeholder="e.g. 0.6"
                      error={
                        selectedGasType === "Gas Not Listed" &&
                        !specificGravity &&
                        !molecularWeight
                          ? getFieldError("gas")
                          : null
                      }
                      editable={selectedGasType === "Gas Not Listed"}
                      containerStyle={
                        useTwoColumnLayout ? styles.fieldHalf : {}
                      }
                    />
                    <BasicInputField
                      label="Molecular Weight"
                      value={molecularWeight}
                      onChange={setMolecularWeight}
                      placeholder="e.g. 44"
                      editable={selectedGasType === "Gas Not Listed"}
                      containerStyle={
                        useTwoColumnLayout ? styles.fieldHalf : {}
                      }
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.calculateButton,
                    isCalculating && styles.calculateButtonDisabled,
                  ]}
                  onPress={handleCalculateWithValidation}
                  disabled={isCalculating}
                  accessibilityLabel="Calculate gas quantity"
                >
                  {isCalculating ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="calculator"
                      size={22}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                  )}
                  <Text style={styles.calculateButtonText}>
                    {isCalculating ? "Calculating..." : "Calculate Quantity"}
                  </Text>
                </TouchableOpacity>
                {gasQuantity && (
                  <View style={styles.resultsSection}>
                    <View style={styles.resultsHeader}>
                      <Text style={styles.resultsSectionTitle}>Results</Text>
                      <View style={styles.unitToggle}>
                        <TouchableOpacity
                          style={[
                            styles.unitToggleButton,
                            preferredUnit === "kg" &&
                              styles.unitToggleButtonActive,
                          ]}
                          onPress={() => setPreferredUnit("kg")}
                        >
                          <Text
                            style={[
                              styles.unitToggleText,
                              preferredUnit === "kg" &&
                                styles.unitToggleTextActive,
                            ]}
                          >
                            kg
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.unitToggleButton,
                            preferredUnit === "g" &&
                              styles.unitToggleButtonActive,
                          ]}
                          onPress={() => setPreferredUnit("g")}
                        >
                          <Text
                            style={[
                              styles.unitToggleText,
                              preferredUnit === "g" &&
                                styles.unitToggleTextActive,
                            ]}
                          >
                            g
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.resultsContent}>
                      <Text style={styles.resultValue}>
                        {preferredUnit === "kg"
                          ? gasQuantity.kgs.toFixed(2)
                          : (gasQuantity.kgs * 1000).toFixed(2)}
                        <Text style={styles.resultUnit}> {preferredUnit}</Text>
                      </Text>
                      <Text style={styles.alternateResultText}>
                        ({gasQuantity.lbs.toFixed(2)} lbs)
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
              {showInfoTab && (
                <View style={styles.infoOverlay}>
                  <View style={styles.infoCard}>
                    {getInfoContent(showInfoTab)}
                    <TouchableOpacity
                      style={styles.infoCloseButton}
                      onPress={() => setShowInfoTab(null)}
                    >
                      <Text style={styles.infoCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  keyboardWrapper: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
    maxHeight: height * 0.85,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fcfcfc",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3748",
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 55,
    backgroundColor: "transparent",
  },
  formField: {
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: 4,
  },
  infoButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  basicInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#2d3748",
    padding: 8,
  },
  unitLabel: {
    position: "absolute",
    right: 12,
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  rowFields: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  columnFields: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  fieldHalf: {
    width: "48%",
  },
  calculateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  calculateButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  buttonIcon: {
    marginRight: 8,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsSection: {
    marginTop: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3748",
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: "#edf2f7",
    borderRadius: 6,
    overflow: "hidden",
  },
  unitToggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  unitToggleButtonActive: {
    backgroundColor: "#3498db",
  },
  unitToggleText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  unitToggleTextActive: {
    color: "#fff",
  },
  resultsContent: {
    alignItems: "center",
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3498db",
  },
  resultUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a5568",
  },
  alternateResultText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    marginBottom: 12,
  },
  infoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#4a5568",
    lineHeight: 20,
  },
  infoCloseButton: {
    marginTop: 16,
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  infoCloseButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  gasNotListedAlert: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fde2e2",
    borderRadius: 8,
    marginBottom: 12,
  },
  gasNotListedText: {
    color: "#b91c1c",
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  fieldThird: {
    flex: 1,
    minWidth: 0,
  },
});

export default GasCalculatorTool;
