import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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

type MaterialType = "solid" | "liquid" | "gas";
type Unit = "kg" | "ml";

interface ContainedMaterial {
  type: MaterialType;
  description: string;
  netQuantity: number;
  unit: Unit;
}

export interface DangerousGoodsUN3363Data {
  containedHazardousMaterials: ContainedMaterial[];
  materialsAreCompatible: boolean;
  leakProofLinerUsed: boolean;
  allOpeningsSealed: boolean;
  class2_2GasComplianceConfirmed: boolean;
  outerPackagingUsed: boolean;
  apparatusProvidesProtection: boolean;
  key19: string;
}

const DangerousGoods = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [containedMaterials, setContainedMaterials] = useState<
    ContainedMaterial[]
  >([]);
  const [newMaterialType, setNewMaterialType] = useState<MaterialType>("solid");
  const [newMaterialDescription, setNewMaterialDescription] =
    useState<string>("");
  const [newMaterialQuantity, setNewMaterialQuantity] = useState<string>("");
  const [newMaterialUnit, setNewMaterialUnit] = useState<Unit>("kg");
  const [materialsAreCompatible, setMaterialsAreCompatible] =
    useState<boolean>(false);
  const [leakProofLinerUsed, setLeakProofLinerUsed] = useState<boolean>(false);
  const [allOpeningsSealed, setAllOpeningsSealed] = useState<boolean>(false);
  const [class2_2GasComplianceConfirmed, setClass2_2GasComplianceConfirmed] =
    useState<boolean>(false);
  const [outerPackagingUsed, setOuterPackagingUsed] = useState<boolean>(false);
  const [apparatusProvidesProtection, setApparatusProvidesProtection] =
    useState<boolean>(false);

  useEffect(() => {
    const existingData = (state.hazProPreparerContext as any)
      .dangerousGoodsUN3363Data;
    if (existingData) {
      setContainedMaterials(existingData.containedHazardousMaterials || []);
      setMaterialsAreCompatible(existingData.materialsAreCompatible || false);
      setLeakProofLinerUsed(existingData.leakProofLinerUsed || false);
      setAllOpeningsSealed(existingData.allOpeningsSealed || false);
      setClass2_2GasComplianceConfirmed(
        existingData.class2_2GasComplianceConfirmed || false
      );
      setOuterPackagingUsed(existingData.outerPackagingUsed || false);
      setApparatusProvidesProtection(
        existingData.apparatusProvidesProtection || false
      );
    }
  }, []);

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const generateKey19 = (): string => {
    const materialSummary = containedMaterials
      .map(m => `${m.description} (${m.netQuantity} ${m.unit})`)
      .join(", ");
    return `${
      hazardousMaterial?.properShippingName || "DANGEROUS GOODS"
    }, Class ${
      hazardousMaterial?.hazclassDiv || "9"
    }. Contains: ${materialSummary}`;
  };

  const handleAddMaterial = () => {
    if (!newMaterialDescription.trim() || !newMaterialQuantity.trim()) return;

    const quantity = parseFloat(newMaterialQuantity);
    if (isNaN(quantity)) return;

    // Validate quantity limits
    if (newMaterialType === "solid" && quantity > 1) {
      alert("Maximum quantity for solids is 1 kg");
      return;
    }
    if (newMaterialType === "liquid" && quantity > 500) {
      alert("Maximum quantity for liquids is 500 ml");
      return;
    }
    if (newMaterialType === "gas" && quantity > 0.5) {
      alert("Maximum quantity for gases is 0.5 kg");
      return;
    }

    const newMaterial: ContainedMaterial = {
      type: newMaterialType,
      description: newMaterialDescription.trim(),
      netQuantity: quantity,
      unit: newMaterialUnit,
    };

    setContainedMaterials([...containedMaterials, newMaterial]);
    setNewMaterialDescription("");
    setNewMaterialQuantity("");
  };

  const handleRemoveMaterial = (index: number) => {
    const updatedMaterials = [...containedMaterials];
    updatedMaterials.splice(index, 1);
    setContainedMaterials(updatedMaterials);
  };

  const isStep1Valid = containedMaterials.length > 0;
  const isStep2Valid = containedMaterials.length <= 1 || materialsAreCompatible;
  const isStep3Valid =
    allOpeningsSealed &&
    (!leakProofLinerUsed ||
      (leakProofLinerUsed && apparatusProvidesProtection));
  const isStep4Valid =
    class2_2GasComplianceConfirmed ||
    !containedMaterials.some(m => m.type === "gas");
  const isStep5Valid = outerPackagingUsed || apparatusProvidesProtection;

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      case 5:
        return isStep5Valid;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
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
    saveDangerousGoodsData();
    navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const saveDangerousGoodsData = () => {
    const dangerousGoodsData: DangerousGoodsUN3363Data = {
      containedHazardousMaterials: containedMaterials,
      materialsAreCompatible,
      leakProofLinerUsed,
      allOpeningsSealed,
      class2_2GasComplianceConfirmed,
      outerPackagingUsed,
      apparatusProvidesProtection,
      key19: generateKey19(),
    };

    store.hazProPreparerContext.dangerousGoodsUN3363Data = dangerousGoodsData;
  };

  const handleSaveAndContinue = () => {
    if (!isStepValid(currentStep)) return;

    setIsLoading(true);

    saveDangerousGoodsData();

    if (!completedSubsteps.includes("DangerousGoods")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "DangerousGoods",
      ];
    }

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("LabelingAndMarking");
    }, 500);
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.sectionTitle}>Contained Hazardous Materials</Text>
      <Text style={styles.descriptionText}>
        Add hazardous materials contained in the{" "}
        {hazardousMaterial?.properShippingName.toLowerCase() ||
          "apparatus/machinery"}
        . Only limited quantities, authorized magnetized materials, and Division
        2.2 gases are allowed.
      </Text>

      {containedMaterials.length > 0 && (
        <View style={styles.materialTable}>
          <View style={styles.materialTableHeader}>
            <Text style={[styles.materialHeaderText, { flex: 2 }]}>
              Description
            </Text>
            <Text style={[styles.materialHeaderText, { flex: 1 }]}>Type</Text>
            <Text style={[styles.materialHeaderText, { flex: 1 }]}>
              Quantity
            </Text>
            <Text style={[styles.materialHeaderText, { width: 50 }]}>
              Action
            </Text>
          </View>

          {containedMaterials.map((material, index) => (
            <View key={index} style={styles.materialRow}>
              <Text style={[styles.materialText, { flex: 2 }]}>
                {material.description}
              </Text>
              <Text style={[styles.materialText, { flex: 1 }]}>
                {material.type}
              </Text>
              <Text style={[styles.materialText, { flex: 1 }]}>
                {material.netQuantity} {material.unit}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveMaterial(index)}
              >
                <MaterialIcons name="delete" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.addMaterialForm}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Material Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newMaterialType}
              onValueChange={value => {
                setNewMaterialType(value as MaterialType);
                setNewMaterialUnit(value === "liquid" ? "ml" : "kg");
              }}
              style={styles.picker}
            >
              <Picker.Item label="Solid" value="solid" />
              <Picker.Item label="Liquid" value="liquid" />
              <Picker.Item label="Gas (Class 2.2)" value="gas" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={newMaterialDescription}
            onChangeText={setNewMaterialDescription}
            placeholder="Enter material description"
          />
        </View>

        <View style={styles.quantityContainer}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={newMaterialQuantity}
              onChangeText={text =>
                setNewMaterialQuantity(text.replace(/[^0-9.]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newMaterialUnit}
                onValueChange={value => setNewMaterialUnit(value as Unit)}
                style={styles.picker}
              >
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="ml" value="ml" />
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            (!newMaterialDescription.trim() || !newMaterialQuantity.trim()) &&
              styles.disabledButton,
          ]}
          onPress={handleAddMaterial}
          disabled={
            !newMaterialDescription.trim() || !newMaterialQuantity.trim()
          }
        >
          <Text style={styles.buttonText}>Add Material</Text>
        </TouchableOpacity>
      </View>

      {containedMaterials.length === 0 && (
        <Text style={styles.errorText}>
          At least one hazardous material must be added.
        </Text>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.sectionTitle}>Material Compatibility</Text>
      <Text style={styles.descriptionText}>
        If multiple hazardous materials are present, confirm they are compatible
        and will not react dangerously together.
      </Text>

      {containedMaterials.length > 1 && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.acknowledgementRow}
            onPress={() => setMaterialsAreCompatible(!materialsAreCompatible)}
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {materialsAreCompatible && (
                  <MaterialIcons name="check" size={16} color="#007bff" />
                )}
              </View>
            </View>
            <Text style={styles.checkboxLabel}>
              I confirm that all contained materials are compatible and will not
              react dangerously together
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {containedMaterials.length > 1 && !materialsAreCompatible && (
        <Text style={styles.errorText}>
          You must confirm material compatibility when multiple materials are
          present.
        </Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.sectionTitle}>Containment & Leakage Protection</Text>
      <Text style={styles.descriptionText}>
        Confirm the following containment and leakage protection measures are in
        place.
      </Text>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() => setAllOpeningsSealed(!allOpeningsSealed)}
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {allOpeningsSealed && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            All openings and lines are sealed or capped
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() => setLeakProofLinerUsed(!leakProofLinerUsed)}
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {leakProofLinerUsed && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            Leak-proof liner is used (if article is drained but not purged)
          </Text>
        </TouchableOpacity>
      </View>

      {leakProofLinerUsed && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.acknowledgementRow}
            onPress={() =>
              setApparatusProvidesProtection(!apparatusProvidesProtection)
            }
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {apparatusProvidesProtection && (
                  <MaterialIcons name="check" size={16} color="#007bff" />
                )}
              </View>
            </View>
            <Text style={styles.checkboxLabel}>
              The apparatus/machinery provides sufficient protection for the
              liner
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!allOpeningsSealed && (
        <Text style={styles.errorText}>
          All openings and lines must be sealed or capped.
        </Text>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.sectionTitle}>Class 2.2 Gas Requirements</Text>
      <Text style={styles.descriptionText}>
        If Class 2.2 gases are present, confirm they are in authorized cylinders
        per Attachment 6.
      </Text>

      {containedMaterials.some(m => m.type === "gas") && (
        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.acknowledgementRow}
            onPress={() =>
              setClass2_2GasComplianceConfirmed(!class2_2GasComplianceConfirmed)
            }
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {class2_2GasComplianceConfirmed && (
                  <MaterialIcons name="check" size={16} color="#007bff" />
                )}
              </View>
            </View>
            <Text style={styles.checkboxLabel}>
              All Class 2.2 gases are in authorized cylinders per Attachment 6
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {containedMaterials.some(m => m.type === "gas") &&
        !class2_2GasComplianceConfirmed && (
          <Text style={styles.errorText}>
            You must confirm Class 2.2 gas cylinder compliance.
          </Text>
        )}
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text style={styles.sectionTitle}>Packaging Requirements</Text>
      <Text style={styles.descriptionText}>
        Confirm either strong outer packaging is used or the apparatus/machinery
        provides sufficient protection.
      </Text>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() => setOuterPackagingUsed(!outerPackagingUsed)}
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {outerPackagingUsed && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            Strong outer packaging is used
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() =>
            setApparatusProvidesProtection(!apparatusProvidesProtection)
          }
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {apparatusProvidesProtection && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            The apparatus/machinery provides sufficient protection
          </Text>
        </TouchableOpacity>
      </View>

      {!outerPackagingUsed && !apparatusProvidesProtection && (
        <Text style={styles.errorText}>
          Either strong outer packaging must be used or the apparatus/machinery
          must provide sufficient protection.
        </Text>
      )}
    </View>
  );

  const StepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <Text style={styles.stepText}>Step {currentStep} of 5</Text>
      <View style={styles.stepDots}>
        {[1, 2, 3, 4, 5].map(step => (
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
          <View style={styles.card}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
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

          {currentStep < 5 ? (
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
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
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
  },
  inputError: {
    borderColor: "#dc3545",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  characterCount: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 4,
  },
  readOnlyField: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#495057",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  previewContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
    marginBottom: 8,
  },
  previewBox: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    padding: 12,
  },
  previewText: {
    fontSize: 14,
    color: "#212529",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  descriptionText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 16,
  },
  materialTable: {
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    overflow: "hidden",
  },
  materialTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  materialHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  materialRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  materialText: {
    fontSize: 14,
    color: "#212529",
    paddingVertical: 8,
  },
  deleteButton: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  addMaterialForm: {
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 12,
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#212529",
  },
  warningCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  instructionCard: {
    backgroundColor: "#f0f7ff",
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0056b3",
    marginTop: 12,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
    marginBottom: 4,
    paddingLeft: 12,
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
});

export default DangerousGoods;
