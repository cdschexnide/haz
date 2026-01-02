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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TemperatureCondition = "Ambient" | "Refrigerated" | "DryIce" | "LiquidN2";
type MaterialType = "GMO" | "InfectiousHuman" | "InfectiousAnimal";

export interface GMOShipmentData {
  unid: "UN3245" | "UN2814" | "UN2900";
  key16: string;
  key19: string;
  packagingParagraph: "A10.8.";
  tempCondition: TemperatureCondition;
  needsSelectAgentPermit: boolean;
  permitNumber?: string;
  samples: string[];
  materialType: MaterialType;
  isSuspectedCategoryA?: boolean;
  outerPackage: string;
  receptacleCount: string;
}

const GeneticallyModifiedOrganisms = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [materialType, setMaterialType] = useState<MaterialType>("GMO");
  const [outerPackage, setOuterPackage] = useState<string>("");
  const [receptacleCount, setReceptacleCount] = useState<string>("1");
  const [tempCondition, setTempCondition] =
    useState<TemperatureCondition>("Ambient");
  const [samples, setSamples] = useState<string[]>([]);
  const [hasTriedToAddOrProceed, setHasTriedToAddOrProceed] =
    useState<boolean>(false);
  const [newSample, setNewSample] = useState<string>("");
  const [needsSelectAgentPermit, setNeedsSelectAgentPermit] =
    useState<boolean>(false);
  const [permitNumber, setPermitNumber] = useState<string>("");
  const [isSuspectedCategoryA, setIsSuspectedCategoryA] =
    useState<boolean>(false);
  const [additionalHandlingInfo, setAdditionalHandlingInfo] =
    useState<string>("");
  const [acknowledgement, setAcknowledgement] = useState<boolean>(false);

  const key16 =
    outerPackage && receptacleCount
      ? `${outerPackage} x ${receptacleCount} ${
          materialType === "GMO" ? "GMO" : "infectious substance"
        } sample${parseInt(receptacleCount) > 1 ? "s" : ""}`
      : "";

  useEffect(() => {
    const existingData = (state.hazProPreparerContext as any)
      .geneticallyModifiedOrganism;
    if (existingData) {
      setMaterialType(existingData.materialType || "GMO");
      setOuterPackage(existingData.outerPackage || "");
      setReceptacleCount(existingData.receptacleCount || "1");
      setTempCondition(existingData.tempCondition || "Ambient");
      setSamples(existingData.samples || []);
      setNeedsSelectAgentPermit(existingData.needsSelectAgentPermit || false);
      setPermitNumber(existingData.permitNumber || "");
      setIsSuspectedCategoryA(existingData.isSuspectedCategoryA || false);
      setAdditionalHandlingInfo(existingData.key19 || getDefaultHandlingInfo());
    }
  }, []);

  const getDefaultHandlingInfo = () => {
    switch (materialType) {
      case "GMO":
        return "GENETICALLY MODIFIED MICRO-ORGANISMS (NON-INFECTIOUS). In case of damage or leakage: immediately notify PUBLIC HEALTH AUTHORITY.";
      case "InfectiousHuman":
        return "INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Category A). In case of damage or leakage: immediately notify PUBLIC HEALTH AUTHORITY.";
      case "InfectiousAnimal":
        return "INFECTIOUS SUBSTANCE, AFFECTING ANIMALS (Category A). In case of damage or leakage: immediately notify PUBLIC HEALTH AUTHORITY.";
      default:
        return "";
    }
  };

  useEffect(() => {
    setAdditionalHandlingInfo(getDefaultHandlingInfo());
  }, [materialType]);

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const isStep1Valid =
    outerPackage.trim().length > 0 &&
    outerPackage.length <= 50 &&
    /^[1-9][0-9]*$/.test(receptacleCount);
  const isStep2Valid = samples.filter(s => s.trim().length > 0).length > 0;
  const isStep3Valid =
    !needsSelectAgentPermit ||
    (needsSelectAgentPermit && permitNumber.trim().length > 0);
  const isStep4Valid = acknowledgement;

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
      default:
        return false;
    }
  };

  const handleAddSample = () => {
    setHasTriedToAddOrProceed(true);
    if (newSample.trim() !== "") {
      setSamples([...samples, newSample.trim()]);
      setNewSample("");
    }
  };

  const handleUpdateSample = (index: number, value: string) => {
    const updatedSamples = [...samples];
    updatedSamples[index] = value;
    setSamples(updatedSamples);
  };

  const handleRemoveSample = (index: number) => {
    const updatedSamples = [...samples];
    updatedSamples.splice(index, 1);
    setSamples(updatedSamples);
  };

  const handleNext = () => {
    if (currentStep === 2) setHasTriedToAddOrProceed(true);
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
    saveGMOData();
    saveCurrentShipment("in-progress");
    navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const saveGMOData = () => {
    const GMOData: GMOShipmentData = {
      unid:
        materialType === "GMO"
          ? "UN3245"
          : materialType === "InfectiousHuman"
          ? "UN2814"
          : "UN2900",
      key16,
      key19: additionalHandlingInfo,
      packagingParagraph: "A10.8.",
      tempCondition,
      needsSelectAgentPermit,
      permitNumber: needsSelectAgentPermit ? permitNumber : undefined,
      samples: samples.filter(s => s.trim().length > 0),
      materialType,
      isSuspectedCategoryA,
      outerPackage,
      receptacleCount,
    };

    store.hazProPreparerContext.geneticallyModifiedOrganism = GMOData;
  };

  const handleSaveAndContinue = () => {
    if (!isStepValid(currentStep)) return;
    setIsLoading(true);
    saveGMOData();

    if (!completedSubsteps.includes("GeneticallyModifiedOrganisms")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "GeneticallyModifiedOrganisms",
      ];
    }

    setIsLoading(false);
    navigation.navigate("LabelingAndMarking");
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.sectionTitle}>Packaging Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Outer Package Description</Text>
        <TextInput
          style={[styles.input, outerPackage.length > 50 && styles.inputError]}
          value={outerPackage}
          onChangeText={setOuterPackage}
          placeholder="e.g., Fiberboard box, Rigid plastic container"
          maxLength={60}
        />
        <Text style={styles.helperText}>
          Rigid outer packaging with minimum 100mm (3.9 in) smallest external
          dimension
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Receptacles</Text>
        <TextInput
          style={styles.input}
          value={receptacleCount}
          onChangeText={text => setReceptacleCount(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          placeholder="Enter quantity (e.g., 1, 2, 3)"
        />
        <Text style={styles.helperText}>
          Number of containers in this shipment
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Temperature Condition</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tempCondition}
            onValueChange={value =>
              setTempCondition(value as TemperatureCondition)
            }
            style={[styles.picker, { color: "#212529" }]}
          >
            <Picker.Item label="Ambient Temperature" value="Ambient" />
            <Picker.Item label="Refrigerated" value="Refrigerated" />
            <Picker.Item label="Dry Ice" value="DryIce" />
            <Picker.Item label="Liquid Nitrogen" value="LiquidN2" />
          </Picker>
        </View>
        <Text style={styles.helperText}>
          {tempCondition === "Ambient" &&
            "Standard packaging with leak-proof seal"}
          {tempCondition === "Refrigerated" &&
            "Coolant must be placed outside secondary packaging"}
          {tempCondition === "DryIce" &&
            "Must permit release of CO₂ gas and prevent pressure buildup"}
          {tempCondition === "LiquidN2" &&
            "Must use vented metal Dewar with orientation marks"}
        </Text>
      </View>

      {(materialType === "InfectiousHuman" ||
        materialType === "InfectiousAnimal") && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category A Status</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isSuspectedCategoryA}
              onValueChange={setIsSuspectedCategoryA}
              trackColor={{ false: "#e0e0e0", true: "#007bff" }}
              thumbColor={isSuspectedCategoryA ? "#fff" : "#fff"}
            />
            <Text style={styles.switchLabel}>
              {isSuspectedCategoryA
                ? "Suspected Category A"
                : "Confirmed Category A"}
            </Text>
          </View>
          <Text style={styles.helperText}>
            {isSuspectedCategoryA
              ? "Material is suspected to meet Category A criteria"
              : "Material is confirmed to meet Category A criteria"}
          </Text>
        </View>
      )}
    </View>
  );
  const renderStep2 = () => (
    <View>
      <Text style={styles.sectionTitle}>Contents List</Text>
      <Text style={styles.descriptionText}>
        List all samples contained in this shipment. An itemized list must be
        placed between the secondary and outer packaging.
        {(materialType === "InfectiousHuman" ||
          materialType === "InfectiousAnimal") &&
          isSuspectedCategoryA && (
            <Text style={styles.warningText}>
              {"\n\n"}Note: For suspected Category A infectious substances, the
              words "Suspected Category A Infectious Substance" will be added to
              each sample description.
            </Text>
          )}
      </Text>

      {samples.length > 0 && (
        <View style={styles.sampleTable}>
          <View style={styles.sampleTableHeader}>
            <Text style={[styles.sampleHeaderText, { flex: 4 }]}>
              Sample Description/Identifier
            </Text>
            <Text style={[styles.sampleHeaderText, { width: 50 }]}>Action</Text>
          </View>

          {samples.map((sample, index) => (
            <View key={index} style={styles.sampleRow}>
              <TextInput
                style={[styles.sampleInput, { flex: 4 }]}
                value={sample}
                onChangeText={text => handleUpdateSample(index, text)}
                placeholder="Enter sample description"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveSample(index)}
              >
                <MaterialIcons name="delete" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.addSampleForm}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          value={newSample}
          onChangeText={setNewSample}
          placeholder="Enter new sample description"
        />
        <TouchableOpacity
          style={[styles.addButton, !newSample.trim() && styles.disabledButton]}
          onPress={handleAddSample}
          disabled={!newSample.trim()}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {hasTriedToAddOrProceed &&
        samples.filter(s => s.trim().length > 0).length === 0 && (
          <Text style={styles.errorText}>
            At least one sample description is required.
          </Text>
        )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.sectionTitle}>
        Permits & Select-Agent Requirements
      </Text>
      <Text style={styles.descriptionText}>
        Certain genetically modified organisms are regulated as select-agents
        and require specific permits under 42 CFR 73, 7 CFR 331, or 9 CFR 121.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Requires Biological Select-Agent Permit?
        </Text>
        <View style={styles.switchContainer}>
          <Switch
            value={needsSelectAgentPermit}
            onValueChange={setNeedsSelectAgentPermit}
            trackColor={{ false: "#e0e0e0", true: "#007bff" }}
            thumbColor={needsSelectAgentPermit ? "#fff" : "#fff"}
          />
          <Text style={styles.switchLabel}>
            {needsSelectAgentPermit ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      {needsSelectAgentPermit && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Permit Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={permitNumber}
            onChangeText={setPermitNumber}
            placeholder="Enter permit number"
          />
          {!permitNumber.trim() && (
            <Text style={styles.errorText}>
              Permit number is required when select-agent permit is needed.
            </Text>
          )}
        </View>
      )}

      <View style={styles.warningCard}>
        <MaterialIcons
          name="warning"
          size={24}
          color="#856404"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.warningText}>
          Transport of select-agents requires advance arrangements and approval.
          Ensure all permits are in order before shipment.
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.sectionTitle}>Packaging Instructions</Text>
      <Text style={styles.descriptionText}>
        AFMAN 24-604 §A10.8 requires specific packaging and handling procedures
        for {materialType === "GMO" ? "GMOs" : "infectious substances"}.
      </Text>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>
          Triple-Packaging Requirements:
        </Text>
        <Text style={styles.instructionText}>
          • Primary receptacle must be leak-proof
        </Text>
        <Text style={styles.instructionText}>
          • Secondary packaging must be leak-proof with absorbent material
        </Text>
        <Text style={styles.instructionText}>
          • Rigid outer packaging minimum 100mm (3.9 in) dimension
        </Text>

        <Text style={styles.instructionTitle}>Performance Standards:</Text>
        <Text style={styles.instructionText}>
          • Must pass tests specified in 49 CFR §178.609
        </Text>
        <Text style={styles.instructionText}>
          • Primary & secondary must withstand ≥ 95 kPa pressure differential
        </Text>
        <Text style={styles.instructionText}>
          • Must withstand temperatures from -40°C to +55°C
        </Text>

        <Text style={styles.instructionTitle}>Documentation:</Text>
        <Text style={styles.instructionText}>
          • An itemized list of contents must be placed between secondary &
          outer packagings
        </Text>
        <Text style={styles.instructionText}>
          • All required permits must be placed with the shipment
        </Text>

        {materialType !== "GMO" && (
          <>
            <Text style={styles.instructionTitle}>
              Additional Requirements for Infectious Substances:
            </Text>
            <Text style={styles.instructionText}>
              • Multiple primary receptacles must be separated with absorbent
              material
            </Text>
            <Text style={styles.instructionText}>
              • Sufficient absorbent material to absorb entire contents
            </Text>
            <Text style={styles.instructionText}>
              • For suspected Category A, mark as "Suspected Category A
              Infectious Substance"
            </Text>
          </>
        )}

        {tempCondition === "Refrigerated" && (
          <>
            <Text style={styles.instructionTitle}>
              Refrigerated Shipment Requirements:
            </Text>
            <Text style={styles.instructionText}>
              • Place ice outside secondary packaging
            </Text>
            <Text style={styles.instructionText}>
              • Provide interior supports to secure secondary packaging
            </Text>
            <Text style={styles.instructionText}>
              • Use leak-proof outer packaging
            </Text>
          </>
        )}

        {tempCondition === "DryIce" && (
          <>
            <Text style={styles.instructionTitle}>
              Dry Ice Shipment Requirements:
            </Text>
            <Text style={styles.instructionText}>
              • Place dry ice outside secondary packaging
            </Text>
            <Text style={styles.instructionText}>
              • Provide interior supports to secure secondary packaging
            </Text>
            <Text style={styles.instructionText}>
              • Outer packaging must permit CO₂ gas release
            </Text>
          </>
        )}

        {tempCondition === "LiquidN2" && (
          <>
            <Text style={styles.instructionTitle}>
              Liquid Nitrogen Shipment Requirements:
            </Text>
            <Text style={styles.instructionText}>
              • Use metal vacuum insulated vessels or flasks
            </Text>
            <Text style={styles.instructionText}>
              • Vessels must be vented to atmosphere
            </Text>
            <Text style={styles.instructionText}>
              • No safety relief valves or check valves in vent lines
            </Text>
            <Text style={styles.instructionText}>
              • Mark package orientation markings
            </Text>
          </>
        )}
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.acknowledgementRow}
          onPress={() => setAcknowledgement(!acknowledgement)}
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {acknowledgement && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>
            I acknowledge these requirements and confirm the shipment is
            prepared in accordance with AFMAN 24-604 §A10.8
          </Text>
        </TouchableOpacity>
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

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isStepValid(currentStep) && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!isStepValid(currentStep) || isLoading}
          >
            {currentStep === 4 && isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {currentStep === 4 ? "Save & Continue" : "Next"}
              </Text>
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
    height: 55,
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
  sampleTable: {
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    overflow: "hidden",
  },
  sampleTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  sampleHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  sampleRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  sampleInput: {
    fontSize: 14,
    color: "#212529",
    paddingVertical: 8,
    borderWidth: 0,
  },
  deleteButton: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  addSampleForm: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#6c757d",
    opacity: 0.65,
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
  appendButton: {
    backgroundColor: "#6c757d",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  appendButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GeneticallyModifiedOrganisms;
