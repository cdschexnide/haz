import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Define packaging types according to AFMAN 24-604 A13.15
type OuterPackagingType =
  | "4A"
  | "4B"
  | "4C1"
  | "4C2"
  | "4D"
  | "4F"
  | "4G"
  | "4H1"
  | "4H2"
  | "4N"
  | "1A2"
  | "1B2"
  | "1D"
  | "1G"
  | "1H2"
  | "1N2"
  | "3A2"
  | "3B2"
  | "3H2";

// Define device types
type DeviceType =
  | "Air-bag inflator"
  | "Air-bag module"
  | "Seat-belt pretensioner"
  | "Pyromechanical device"
  | "Other";

// Define safety device preparation types
type SafetyDevicePrepType =
  | "Air Bag Inflator"
  | "Air Bag Module"
  | "Seat-Belt Pretensioner";

// Define the form values interface
export interface SafetyDeviceFormValues {
  prepType: SafetyDevicePrepType;
  otherDeviceTypeDescription: string;
  numberOfArticles: string; // Will be parsed to number
  outerPackagingType: OuterPackagingType;
  outerPackagingTypeLabel: string; // New property for full label
  complianceChecks: {
    testPassed: boolean;
    notLifeSaving: boolean;
  };
}

// Define the data structure saved to context
export interface SafetyDeviceData {
  unid: "UN3268";
  prepType: SafetyDevicePrepType;
  numberOfArticles: number;
  outerPackagingType: OuterPackagingType;
  outerPackagingTypeLabel: string;
}

// Packaging configuration based on AFMAN 24-604 A13.15
const packagingOptions: { label: string; value: OuterPackagingType }[] = [
  { label: "Steel box (4A)", value: "4A" },
  { label: "Aluminum box (4B)", value: "4B" },
  { label: "Natural wood box (4C1)", value: "4C1" },
  { label: "Sift-proof wood box (4C2)", value: "4C2" },
  { label: "Plywood box (4D)", value: "4D" },
  { label: "Reconstituted wood box (4F)", value: "4F" },
  { label: "Fiberboard box (4G)", value: "4G" },
  { label: "Expanded plastic box (4H1)", value: "4H1" },
  { label: "Solid plastic box (4H2)", value: "4H2" },
  { label: "Other metal box (4N)", value: "4N" },
  { label: "Steel drum (1A2)", value: "1A2" },
  { label: "Aluminum drum (1B2)", value: "1B2" },
  { label: "Plywood drum (1D)", value: "1D" },
  { label: "Fiber drum (1G)", value: "1G" },
  { label: "Plastic drum (1H2)", value: "1H2" },
  { label: "Other metal drum (1N2)", value: "1N2" },
  { label: "Steel jerrican (3A2)", value: "3A2" },
  { label: "Aluminum jerrican (3B2)", value: "3B2" },
  { label: "Plastic jerrican (3H2)", value: "3H2" },
];

// Form validation schema
const schema = yup.object().shape({
  prepType: yup
    .string()
    .required("Please select what you are preparing")
    .notOneOf([""], "Please select what you are preparing"),
  otherDeviceTypeDescription: yup.string().when("deviceType", {
    is: "Other",
    then: schema => schema.required("Please describe the device type"),
    otherwise: schema => schema,
  }),
  numberOfArticles: yup
    .string()
    .required("Number of articles is required")
    .test("is-positive-number", "Must be a positive number", value => {
      if (!value) return false;
      const num = parseInt(value, 10);
      return !isNaN(num) && num > 0;
    }),
  outerPackagingType: yup.string().required("Packaging type is required"),
  complianceChecks: yup.object().shape({
    testPassed: yup
      .boolean()
      .oneOf([true], "Compliance with UN Series 6(c) test is required"),
    notLifeSaving: yup
      .boolean()
      .oneOf(
        [true],
        "Confirmation that device is not life-saving appliance is required"
      ),
  }),
});

const SafetyDevicesPreparationScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store } = useHazProStore();

  // ✅ NEW: Direct mutations replace dispatch pattern
  // No longer needed - using direct mutations
  const [isLoading, setIsLoading] = useState(false);
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];

  // Initialize form with existing values from context (if any)
  const existingData = state.hazProPreparerContext.safetyDeviceData;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<SafetyDeviceFormValues>({
    mode: "onChange",
    defaultValues: {
      prepType: undefined, // Initial state is empty for placeholder
      otherDeviceTypeDescription: "",
      numberOfArticles: "", // Initial state is empty string
      outerPackagingType: undefined, // Initial state is empty for placeholder
      outerPackagingTypeLabel: "", // Initial state is empty string
      complianceChecks: {
        testPassed: false,
        notLifeSaving: false,
      },
    },
  });

  // Watch values for conditional rendering
  const testPassed = watch("complianceChecks.testPassed");

  // Set active step on component mount
  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  // ✅ Direct mutations replace handleNestedPreparerContextFieldUpdate helper
  // No longer needed - using direct mutations

  const onSubmit = (data: SafetyDeviceFormValues) => {
    setIsLoading(true);

    // Find the label for the selected packaging type
    const packagingOption = packagingOptions.find(
      option => option.value === data.outerPackagingType
    );
    const packagingDescription = packagingOption
      ? packagingOption.label
      : data.outerPackagingType;

    // Prepare data for context
    const safetyDeviceData: SafetyDeviceData = {
      unid: "UN3268",
      prepType: data.prepType,
      numberOfArticles: parseInt(data.numberOfArticles, 10),
      outerPackagingType: data.outerPackagingType,
      outerPackagingTypeLabel: data.outerPackagingTypeLabel,
    };

    // Save to context
    store.hazProPreparerContext.safetyDeviceData = safetyDeviceData;

    // Add to completed substeps if not already included
    if (!completedSubsteps.includes("SafetyDevices")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "SafetyDevices",
      ];
    }

    // Navigate to next step after a brief delay to show loading
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("LabelingAndMarking");
    }, 500);
  };

  const handleSaveAndExit = () => {
    // Save current form data
    const formValues = {
      prepType: watch("prepType"),
      otherDeviceTypeDescription: watch("otherDeviceTypeDescription"),
      numberOfArticles: watch("numberOfArticles"),
      outerPackagingType: watch("outerPackagingType"),
      outerPackagingTypeLabel: watch("outerPackagingTypeLabel"),
    };

    // Find the label for the selected packaging type
    const packagingOption = packagingOptions.find(
      option => option.value === formValues.outerPackagingType
    );
    const packagingDescription = packagingOption
      ? packagingOption.label
      : formValues.outerPackagingType;

    const safetyDeviceData: SafetyDeviceData = {
      unid: "UN3268",
      prepType: formValues.prepType,
      numberOfArticles: parseInt(formValues.numberOfArticles, 10) || 0,
      outerPackagingType: formValues.outerPackagingType as OuterPackagingType,
      outerPackagingTypeLabel: formValues.outerPackagingTypeLabel,
    };

    store.hazProPreparerContext.safetyDeviceData = safetyDeviceData;

    // Note: SAVE_SHIPMENT functionality would be handled by saveCurrentShipment
    // saveCurrentShipment("in-progress");

    navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  // Render a radio button option
  const renderRadioOption = (
    option: DeviceType,
    currentValue: string,
    onChange: (value: DeviceType) => void
  ) => (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => onChange(option)}
      key={`${option}-${currentValue}`}
    >
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioOuterCircle}>
          {currentValue === option && <View style={styles.radioInnerCircle} />}
        </View>
        <Text style={styles.radioLabel}>{option}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render a checkbox item
  const renderCheckbox = (
    label: string,
    checked: boolean,
    onChange: (value: boolean) => void,
    error?: string
  ) => (
    <TouchableOpacity
      style={styles.checkboxRow}
      onPress={() => onChange(!checked)}
    >
      <View style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          {checked && <MaterialIcons name="check" size={16} color="#007bff" />}
        </View>
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Safety Devices Preparation</Text>
            <Text style={styles.subtitle}>UN 3268 - AFMAN 24-604 §A13.15</Text>
          </View>

          <View style={styles.card}>
            {/* Safety Device Type Selection */}
            <Text style={styles.sectionTitle}>What are you preparing?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={watch("prepType")}
                onValueChange={value => setValue("prepType", value)}
                style={[
                  styles.picker,
                  { color: watch("prepType") ? "#212529" : "#6c757d" },
                ]}
              >
                <Picker.Item
                  label="Select Safety Device Type"
                  value=""
                  color="#6c757d"
                />
                <Picker.Item
                  label="Air Bag Inflator"
                  value="Air Bag Inflator"
                />
                <Picker.Item label="Air Bag Module" value="Air Bag Module" />
                <Picker.Item
                  label="Seat-Belt Pretensioner"
                  value="Seat-Belt Pretensioner"
                />
              </Picker>
            </View>
            {errors.prepType && (
              <Text style={styles.errorText}>{errors.prepType.message}</Text>
            )}

            {/* Number of Articles */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Number of Articles</Text>
              <Controller
                control={control}
                name="numberOfArticles"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={text => onChange(text.replace(/[^0-9]/g, ""))}
                    keyboardType="numeric"
                    placeholder="Enter quantity"
                  />
                )}
              />
              {errors.numberOfArticles && (
                <Text style={styles.errorText}>
                  {errors.numberOfArticles.message}
                </Text>
              )}
            </View>

            {/* Outer Packaging Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Packaging Type</Text>
              <View style={styles.pickerContainer}>
                <Controller
                  control={control}
                  name="outerPackagingType"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={selectedValue => {
                        onChange(selectedValue);
                        const label =
                          packagingOptions.find(
                            option => option.value === selectedValue
                          )?.label || "";
                        setValue("outerPackagingTypeLabel", label);
                      }}
                      style={[
                        styles.picker,
                        { color: value ? "#212529" : "#6c757d" },
                      ]}
                    >
                      <Picker.Item
                        label="Select Packaging Type"
                        value=""
                        color="#6c757d"
                      />
                      {packagingOptions.map(option => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              {errors.outerPackagingType && (
                <Text style={styles.errorText}>
                  {errors.outerPackagingType.message}
                </Text>
              )}
            </View>

            {/* DOT Compliance Checklist */}
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>
              DOT Compliance (Special Provision 160)
            </Text>
            <View style={styles.checkboxGroup}>
              <Controller
                control={control}
                name="complianceChecks.testPassed"
                render={({ field: { onChange, value } }) =>
                  renderCheckbox(
                    "Device passed UN Series 6(c) test (no explosion / fragmentation / projection / thermal effect).",
                    value,
                    onChange,
                    errors.complianceChecks?.testPassed?.message
                  )
                }
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
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
              (!isValid || isLoading || !testPassed) && styles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading || !testPassed}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save & Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 4,
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#495057",
  },
  required: {
    color: "#dc3545",
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
    height: 55,
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
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    marginBottom: 8,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#212529",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 16,
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingRight: 16,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
    lineHeight: 20,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 4,
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
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    borderRadius: 4,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: "center",
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#6c757d",
    opacity: 0.65,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exampleText: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
});

export default SafetyDevicesPreparationScreen;
