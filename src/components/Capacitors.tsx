import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export interface CapacitorData {
  isInstalledInEquipment: boolean;
  isUncharged: boolean;
  shortCircuitProtectionMethod: "none" | "protected" | "metalStrap";
  energyStorageCapacity: "under_0_3" | "0_3_to_10" | "over_10" | undefined;
  notHazardousMaterial: boolean;
  outerPackagingDescription: string;
}

const Capacitors = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [capacitorData, setCapacitorData] = useState<CapacitorData>({
    isInstalledInEquipment: false,
    isUncharged: false,
    shortCircuitProtectionMethod: "none",
    energyStorageCapacity: undefined,
    notHazardousMaterial: false,
    outerPackagingDescription: "",
  });

  useEffect(() => {
    const existingData = (state.hazProPreparerContext as any).capacitorData;
    if (existingData) {
      setCapacitorData(existingData);
    }
  }, []);

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const handleInputChange = (
    field: keyof CapacitorData,
    value: string | number | boolean
  ) => {
    setCapacitorData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStep1Valid = () => {
    return (
      capacitorData.energyStorageCapacity !== "under_0_3" &&
      capacitorData.notHazardousMaterial
    );
  };

  const isStep2Valid = () => {
    return capacitorData.isInstalledInEquipment || capacitorData.isUncharged;
  };

  const isStep3Valid = () => {
    if (capacitorData.energyStorageCapacity === "under_0_3") return true;
    if (capacitorData.energyStorageCapacity === "0_3_to_10")
      return capacitorData.shortCircuitProtectionMethod === "protected";
    return capacitorData.shortCircuitProtectionMethod === "metalStrap";
  };

  const isStep4Valid = () => {
    const { outerPackagingDescription } = capacitorData;
    return outerPackagingDescription.trim().length > 0;
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      handleSaveAndContinue();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSaveAndExit = () => {
    store.hazProPreparerContext.capacitorData = capacitorData;
    navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const handleSaveAndContinue = () => {
    if (!isStepValid(currentStep)) return;

    setIsLoading(true);
    store.hazProPreparerContext.capacitorData = capacitorData;

    if (!completedSubsteps.includes("Capacitors")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "Capacitors",
      ];
    }

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("LabelingAndMarking");
    }, 500);
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.sectionTitle}>Energy Storage Capacity</Text>
      <Text style={styles.descriptionText}>
        Select the energy storage capacity of your capacitor.
      </Text>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() =>
            handleInputChange("energyStorageCapacity", "under_0_3")
          }
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {capacitorData.energyStorageCapacity === "under_0_3" && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            Less than or equal to 0.3 Wh (Not subject to AFMAN24-604)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() =>
            handleInputChange("energyStorageCapacity", "0_3_to_10")
          }
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {capacitorData.energyStorageCapacity === "0_3_to_10" && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>Greater than 0.3 Wh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        {/* <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() => handleInputChange("energyStorageCapacity", "over_10")}
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {capacitorData.energyStorageCapacity === "over_10" && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>Greater than 10 Wh</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() =>
            handleInputChange(
              "notHazardousMaterial",
              !capacitorData.notHazardousMaterial
            )
          }
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {capacitorData.notHazardousMaterial && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            I confirm that this capacitor does not meet the definition or
            classification of any other hazardous material as defined in
            AFMAN24-604
          </Text>
        </TouchableOpacity>
      </View>

      {capacitorData.energyStorageCapacity === "under_0_3" && (
        <View style={styles.warningCard}>
          <MaterialIcons
            name="info"
            size={24}
            color="#856404"
            style={styles.warningIcon}
          />
          <Text style={styles.warningText}>
            This item is not subject to AFMAN24-604 requirements.
          </Text>
        </View>
      )}

      {!capacitorData.notHazardousMaterial && (
        <Text style={styles.errorText}>
          You must confirm that the capacitor does not meet any other hazardous
          material definitions.
        </Text>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.sectionTitle}>Installation Status</Text>
      <Text style={styles.descriptionText}>
        Indicate whether the capacitor is installed in equipment or shipped
        separately.
      </Text>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() =>
            handleInputChange(
              "isInstalledInEquipment",
              !capacitorData.isInstalledInEquipment
            )
          }
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {capacitorData.isInstalledInEquipment && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            Capacitor is installed in equipment
          </Text>
        </TouchableOpacity>
      </View>

      {!capacitorData.isInstalledInEquipment && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.acknowledgementRow}
            onPress={() =>
              handleInputChange("isUncharged", !capacitorData.isUncharged)
            }
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {capacitorData.isUncharged && (
                  <MaterialIcons name="check" size={16} color="#007bff" />
                )}
              </View>
            </View>
            <Text style={styles.checkboxLabel}>Capacitor is uncharged</Text>
          </TouchableOpacity>
        </View>
      )}

      {!capacitorData.isInstalledInEquipment && !capacitorData.isUncharged && (
        <Text style={styles.errorText}>
          Uninstalled capacitors must be uncharged.
        </Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.sectionTitle}>Short-Circuit Protection</Text>
      <Text style={styles.descriptionText}>
        Select the appropriate short-circuit protection method based on energy
        capacity.
      </Text>

      {capacitorData.energyStorageCapacity !== "under_0_3" && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.acknowledgementRow}
            onPress={() =>
              handleInputChange("shortCircuitProtectionMethod", "protected")
            }
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {capacitorData.shortCircuitProtectionMethod === "protected" && (
                  <MaterialIcons name="check" size={16} color="#007bff" />
                )}
              </View>
            </View>
            <Text style={styles.checkboxLabel}>
              Protected against short circuit (tape/strap)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {capacitorData.energyStorageCapacity === "over_10" && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.acknowledgementRow}
            onPress={() =>
              handleInputChange("shortCircuitProtectionMethod", "metalStrap")
            }
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {capacitorData.shortCircuitProtectionMethod ===
                  "metalStrap" && (
                  <MaterialIcons name="check" size={16} color="#007bff" />
                )}
              </View>
            </View>
            <Text style={styles.checkboxLabel}>
              Metal strap connecting terminals
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {capacitorData.energyStorageCapacity !== "under_0_3" &&
        capacitorData.shortCircuitProtectionMethod === "none" && (
          <Text style={styles.errorText}>
            Appropriate short-circuit protection must be selected.
          </Text>
        )}
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.sectionTitle}>Packaging and Labeling</Text>
      <Text style={styles.descriptionText}>
        Confirm packaging requirements and energy labeling.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Outer Packaging Description</Text>
        <Text style={styles.exampleText}>
          Example: 463L Pallet, 1 x Fiberboard box (4G), Equipment (described),
          or Plywood box, etc.
        </Text>
        <TextInput
          style={styles.input}
          value={capacitorData.outerPackagingDescription}
          onChangeText={value =>
            handleInputChange("outerPackagingDescription", value)
          }
          placeholder="Describe the outer packaging used"
          multiline
          numberOfLines={3}
        />
        {!capacitorData.outerPackagingDescription.trim() && (
          <Text style={styles.errorText}>
            Please provide a description of the outer packaging.
          </Text>
        )}
      </View>
    </View>
  );

  const StepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <Text style={styles.stepText}>Step {currentStep} of 4</Text>
      <View style={styles.stepDots}>
        {[1, 2, 3, 4].map(step => (
          <View
            key={step}
            style={[
              styles.stepIndicator,
              step === currentStep ? styles.activeStepIndicator : null,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StepIndicator />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Capacitor Preparation</Text>
          </View>

          <View style={styles.card}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
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

          {currentStep < 4 ? (
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isStepValid(currentStep) && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isStepValid(currentStep) && styles.disabledButton,
              ]}
              onPress={handleSaveAndContinue}
              disabled={!isStepValid(currentStep) || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save & Continue</Text>
              )}
            </TouchableOpacity>
          )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  descriptionText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  warningCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 4,
  },
  acknowledgementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
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
    backgroundColor: "#007bff",
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
    borderRadius: 6,
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
    borderRadius: 6,
    paddingVertical: 12,
    marginHorizontal: 8,
    alignItems: "center",
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  exampleText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
    fontStyle: "italic",
  },
});

export default Capacitors;
