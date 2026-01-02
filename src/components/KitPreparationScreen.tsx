import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
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
import * as yup from "yup";

type OuterPackagingType =
  | "4A"
  | "4B"
  | "4C1"
  | "4C2"
  | "4D"
  | "4F"
  | "4H1"
  | "4H2"
  | "4G";

type KitType = "FIRST AID KIT" | "CHEMICAL KIT";

type FormType = "Liquid" | "Solid";

type PackingGroup = "I" | "II" | "III";

interface Substance {
  description: string;
  classDiv: string;
  packingGroup: PackingGroup;
  form: FormType;
  quantityPerContainer: string;
  unit: "mL" | "g";
}

interface KitPreparationFormValues {
  kitType: KitType;
  contents: Substance[];
  outerPackagingType: OuterPackagingType;
  checkboxes: {
    strictestPG: boolean;
    noReaction: boolean;
    limitedExcepted: boolean;
    receptacleCompliance: boolean;
    aggregateCompliance: boolean;
  };
  pieceNumber?: string;
}

export interface KitPreparationData {
  unid: "UN3316";
  kitType: string;
  outerPackagingType: string;
  pieceNumber?: string;
  contents: Array<{
    description: string;
    classDiv: string;
    packingGroup: string;
    form: "Liquid" | "Solid";
    quantityPerContainer: number;
    unit: "mL" | "g";
  }>;
}

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
];

const validationSchema = yup.object().shape({
  kitType: yup
    .string()
    .required("Kit type is required")
    .oneOf(["FIRST AID KIT", "CHEMICAL KIT"]),
  contents: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required("Description is required"),
        classDiv: yup.string().required("Class/Division is required"),
        packingGroup: yup.string().required("Packing Group is required"),
        form: yup
          .string()
          .required("Form is required")
          .oneOf(["Liquid", "Solid"]),
        quantityPerContainer: yup
          .string()
          .required("Quantity is required")
          .test("is-positive-number", "Must be a positive number", value => {
            if (!value) return false;
            const num = parseFloat(value);
            return !isNaN(num) && num > 0;
          }),
        unit: yup.string().required("Unit is required").oneOf(["mL", "g"]),
      })
    )
    .min(1, "At least one substance is required"),
  outerPackagingType: yup
    .string()
    .required("Packaging type is required")
    .oneOf(packagingOptions.map(option => option.value)),
  checkboxes: yup.object().shape({
    strictestPG: yup
      .boolean()
      .oneOf([true], "This checkbox must be acknowledged"),
    noReaction: yup
      .boolean()
      .oneOf([true], "This checkbox must be acknowledged"),
    limitedExcepted: yup
      .boolean()
      .oneOf([true], "This checkbox must be acknowledged"),
    receptacleCompliance: yup
      .boolean()
      .oneOf([true], "This checkbox must be acknowledged"),
    aggregateCompliance: yup
      .boolean()
      .oneOf([true], "This checkbox must be acknowledged"),
  }),
  pieceNumber: yup.string().optional(),
});

const KitPreparationScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const [isLoading, setIsLoading] = useState(false);
  const [useMultipleContainers, setUseMultipleContainers] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const existingData = state.hazProPreparerContext.kitPreparationData;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    getValues,
  } = useForm<KitPreparationFormValues>({
    resolver: yupResolver(validationSchema) as any,
    mode: "onChange",
    defaultValues: {
      kitType: (existingData?.kitType as KitType) || "FIRST AID KIT",
      contents:
        existingData?.contents?.map(sub => ({
          ...sub,
          packingGroup: sub.packingGroup as PackingGroup,
          quantityPerContainer: sub.quantityPerContainer.toString(),
        })) || [],
      outerPackagingType:
        (existingData?.outerPackagingType as OuterPackagingType) || "4G",
      checkboxes: {
        strictestPG: false,
        noReaction: false,
        limitedExcepted: false,
        receptacleCompliance: false,
        aggregateCompliance: false,
      },
      pieceNumber: existingData?.pieceNumber || "",
    },
  });

  const watchedContents = watch("contents");
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const kitType = hazardousMaterial?.properShippingName || "KIT";

  const [showAddSubstanceModal, setShowAddSubstanceModal] = useState(false);
  const [newSubstance, setNewSubstance] = useState<Substance>({
    description: "",
    classDiv: "",
    packingGroup: "III",
    form: "Solid",
    quantityPerContainer: "",
    unit: "g",
  });
  const [addSubstanceError, setAddSubstanceError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = hazardousMaterialsList.filter(
        (material: any) =>
          material.unid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.properShippingName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  useEffect(() => {
    if (watchedContents && watchedContents.length > 0) {
      const newWarnings: string[] = [];
      let totalLiquidVolume = 0;
      let totalSolidMass = 0;
      let totalDangerousGoods = 0;

      watchedContents.forEach(substance => {
        const quantity = parseFloat(substance.quantityPerContainer || "0");
        if (substance.form === "Liquid") {
          totalLiquidVolume += quantity;
          totalDangerousGoods += quantity / 1000;

          if (substance.classDiv === "5.2" && quantity > 125) {
            newWarnings.push(
              `Class 5.2 liquids cannot exceed 125 mL per inner receptacle.`
            );
          } else if (quantity > 250) {
            newWarnings.push(`Liquid receptacles cannot exceed 250 mL.`);
          }
        } else {
          totalSolidMass += quantity;
          totalDangerousGoods += quantity / 1000;

          if (quantity > 250) {
            newWarnings.push(`Solid receptacles cannot exceed 250 g.`);
          }
        }
        if (substance.packingGroup === "I" && substance.classDiv !== "5.2") {
          newWarnings.push(
            `Packing Group I is only allowed for Class 5.2 substances.`
          );
        }
      });
      if (totalLiquidVolume > 1000) {
        newWarnings.push(
          `Total liquid quantity (${totalLiquidVolume} mL) exceeds 1 L (1000 mL) maximum.`
        );
      }
      if (totalSolidMass > 1000) {
        newWarnings.push(
          `Total solid mass (${totalSolidMass} g) exceeds 1 kg (1000 g) maximum.`
        );
      }
      if (totalDangerousGoods > 10) {
        newWarnings.push(
          `Total dangerous goods (${totalDangerousGoods.toFixed(
            2
          )} kg) exceeds 10 kg maximum.`
        );
      }
      setWarnings(newWarnings);
    }
  }, [watchedContents]);

  const addSubstance = () => {
    const currentContents = getValues("contents");
    if (currentContents.length < 5) {
      setValue("contents", [
        ...currentContents,
        {
          description: "",
          classDiv: "",
          packingGroup: "III",
          form: "Solid",
          quantityPerContainer: "",
          unit: "g",
        },
      ]);
    } else {
      Alert.alert("Limit Reached", "Maximum of 5 substances per kit.");
    }
  };

  const removeSubstance = (index: number) => {
    const currentContents = getValues("contents");
    if (currentContents.length > 1) {
      setValue(
        "contents",
        currentContents.filter((_, i) => i !== index)
      );
    } else {
      Alert.alert("Cannot Remove", "At least one substance is required.");
    }
  };

  const onSubmit = (data: KitPreparationFormValues) => {
    setIsLoading(true);

    const parsedContents = data.contents.map(substance => ({
      ...substance,
      quantityPerContainer: parseFloat(substance.quantityPerContainer),
    }));

    const kitPreparationData: KitPreparationData = {
      unid: "UN3316",
      kitType: data.kitType,
      outerPackagingType: data.outerPackagingType,
      pieceNumber: useMultipleContainers ? data.pieceNumber : undefined,
      contents: parsedContents,
    };

    store.hazProPreparerContext.kitPreparationData = kitPreparationData;

    if (!completedSubsteps.includes("KitPreparation")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "KitPreparation",
      ];
    }
    setIsLoading(false);
    navigation.navigate("LabelingAndMarking");
  };

  const handleSaveAndExit = () => {
    const formValues = getValues();

    const parsedContents = formValues.contents.map(substance => ({
      ...substance,
      quantityPerContainer: parseFloat(substance.quantityPerContainer) || 0,
    }));

    const kitPreparationData: KitPreparationData = {
      unid: "UN3316",
      kitType: formValues.kitType,
      outerPackagingType: formValues.outerPackagingType,
      pieceNumber: useMultipleContainers ? formValues.pieceNumber : undefined,
      contents: parsedContents,
    };

    store.hazProPreparerContext.kitPreparationData = kitPreparationData;
    saveCurrentShipment("in-progress");
    navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const renderRadioOption = (
    option: string,
    currentValue: string,
    onChange: (value: string) => void
  ) => (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => onChange(option)}
      key={option}
    >
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioOuterCircle}>
          {currentValue === option && <View style={styles.radioInnerCircle} />}
        </View>
        <Text style={styles.radioLabel}>{option}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCheckbox = (
    label: string,
    name: keyof KitPreparationFormValues["checkboxes"],
    error?: string
  ) => (
    <Controller
      control={control}
      name={`checkboxes.${name}`}
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => onChange(!value)}
        >
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {value && (
                <MaterialIcons name="check" size={16} color="#007bff" />
              )}
            </View>
          </View>
          <Text style={styles.checkboxLabel}>{label}</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </TouchableOpacity>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{kitType} Preparation</Text>
            <Text style={styles.subtitle}>UN3316 - AFMAN 24-604 §A19.2</Text>
            <View style={styles.kitTypeSummary}>
              <Text style={styles.kitTypeSummaryText}>
                Kit Type: <Text style={{ fontWeight: "bold" }}>{kitType}</Text>
              </Text>
            </View>
          </View>
          {warnings.length > 0 && (
            <View style={styles.warningContainer}>
              <MaterialIcons name="warning" size={24} color="#f0ad4e" />
              <Text style={styles.warningTitle}>Warning:</Text>
              {warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>
                  • {warning}
                </Text>
              ))}
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Kit Contents</Text>
            <Text style={styles.sectionDescription}>
              List all hazardous substances contained in this kit.
            </Text>
            {watchedContents.length > 0 ? (
              <View style={styles.componentTable}>
                <View style={styles.componentTableHeader}>
                  <Text style={[styles.componentHeaderText, { flex: 2 }]}>
                    Description
                  </Text>
                  <Text style={[styles.componentHeaderText, { flex: 1 }]}>
                    Class/Div
                  </Text>
                  <Text style={[styles.componentHeaderText, { flex: 1 }]}>
                    PG
                  </Text>
                  <Text style={[styles.componentHeaderText, { flex: 1 }]}>
                    Form
                  </Text>
                  <Text style={[styles.componentHeaderText, { flex: 1 }]}>
                    Qty/Unit
                  </Text>
                  <Text style={[styles.componentHeaderText, { width: 50 }]}>
                    Action
                  </Text>
                </View>
                {watchedContents.map((sub, index) => (
                  <View key={index} style={styles.componentRow}>
                    <Text style={[styles.componentText, { flex: 2 }]}>
                      {sub.description}
                    </Text>
                    <Text style={[styles.componentText, { flex: 1 }]}>
                      {sub.classDiv}
                    </Text>
                    <Text style={[styles.componentText, { flex: 1 }]}>
                      {sub.packingGroup}
                    </Text>
                    <Text style={[styles.componentText, { flex: 1 }]}>
                      {sub.form}
                    </Text>
                    <Text style={[styles.componentText, { flex: 1 }]}>
                      {sub.quantityPerContainer} {sub.unit}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeSubstance(index)}
                    >
                      <MaterialIcons name="delete" size={20} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noComponentsContainer}>
                <Text style={styles.noComponentsText}>
                  No substances added yet. Add at least one substance.
                </Text>
              </View>
            )}
            {watchedContents.length < 5 && (
              <TouchableOpacity
                style={styles.addComponentButton}
                onPress={() => setShowAddSubstanceModal(true)}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
                <Text style={styles.addComponentButtonText}>Add Substance</Text>
              </TouchableOpacity>
            )}
            {showAddSubstanceModal && (
              <View style={styles.addComponentForm}>
                <Text style={styles.addComponentTitle}>Add New Substance</Text>
                <View style={styles.searchRow}>
                  <View style={styles.searchInputContainer}>
                    <MaterialIcons name="search" size={20} color="#6c757d" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search by UNID or Name"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      accessibilityLabel="Search substances input"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.searchCancelButton}
                    onPress={() => {
                      setSearchQuery("");
                      setShowAddSubstanceModal(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel search"
                  >
                    <MaterialIcons name="close" size={22} color="#6c757d" />
                  </TouchableOpacity>
                </View>
                {searchQuery.length >= 3 && (
                  <View style={styles.searchResultsTable}>
                    <View style={styles.tableHeader}>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`UN/ID\nNumber`}</Text>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`PSN/\nDescription`}</Text>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`Hazard Class/\nDiv`}</Text>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`Subsidiary\nRisk`}</Text>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`Packing\nGroup`}</Text>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`Special\nProvision`}</Text>
                      <Text
                        style={[styles.headerText, styles.flex1]}
                      >{`Packaging\nParagraph`}</Text>
                    </View>
                    <ScrollView
                      style={styles.tableScrollContainer}
                      nestedScrollEnabled={true}
                    >
                      {filteredMaterials.map((item, index) => (
                        <TouchableOpacity
                          key={`${item.unid}-${item.properShippingName}-${item.details}-${index}`}
                          style={styles.tableRow}
                          onPress={() => {
                            setValue("contents", [
                              ...watchedContents,
                              {
                                description: item.properShippingName,
                                classDiv: item.hazclassDiv,
                                packingGroup: item.packingGroup || "III",
                                form: item.form || "Solid",
                                quantityPerContainer: "1",
                                unit: item.unit || "g",
                              },
                            ]);
                            setShowAddSubstanceModal(false);
                            setSearchQuery("");
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`Select ${item.properShippingName}`}
                        >
                          <View style={styles.tableRowContent}>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {item.unid}
                            </Text>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {item.properShippingName}
                            </Text>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {item.hazclassDiv}
                            </Text>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {item.subsidiaryRisk?.split(" ").join("\n")}
                            </Text>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {item.packingGroup?.split(" ").join("\n")}
                            </Text>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {(
                                item?.specialProvision?.match(
                                  /([A-Z0-9]+(?:, ?[A-Z0-9]+)*)/g
                                ) || []
                              ).join("\n")}
                            </Text>
                            <Text style={[styles.columnText, styles.flex1]}>
                              {item.packagingParagraph?.split(" ").join("\n")}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Outer Packaging</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Packaging Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Controller
                control={control}
                name="outerPackagingType"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
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
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => setUseMultipleContainers(!useMultipleContainers)}
            >
              <View style={styles.switchContainer}>
                <View
                  style={[
                    styles.switchTrack,
                    useMultipleContainers ? styles.switchTrackActive : {},
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      useMultipleContainers ? styles.switchThumbActive : {},
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.switchLabel}>
                Kit uses multiple containers
              </Text>
            </TouchableOpacity>
          </View>
          {useMultipleContainers && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Kit Piece Number</Text>
              <Controller
                control={control}
                name="pieceNumber"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter piece number (e.g., 1 of 3)"
                  />
                )}
              />
            </View>
          )}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Safety Checklist</Text>
          <Text style={styles.sectionDescription}>
            All items must be acknowledged before proceeding.
          </Text>
          <View style={styles.checkboxGroup}>
            {renderCheckbox(
              "I confirm the most stringent Packing Group is used across all kit contents.",
              "strictestPG",
              errors.checkboxes?.strictestPG?.message
            )}
            {renderCheckbox(
              "I confirm contents will not react to generate heat or gas if mixed.",
              "noReaction",
              errors.checkboxes?.noReaction?.message
            )}
            {renderCheckbox(
              "I confirm all substances are authorized as Limited or Excepted Quantities.",
              "limitedExcepted",
              errors.checkboxes?.limitedExcepted?.message
            )}
            {renderCheckbox(
              "I confirm each receptacle complies with maximum volume/mass limits.",
              "receptacleCompliance",
              errors.checkboxes?.receptacleCompliance?.message
            )}
            {renderCheckbox(
              "I confirm the kit complies with maximum aggregate mass/volume requirements.",
              "aggregateCompliance",
              errors.checkboxes?.aggregateCompliance?.message
            )}
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
              (!isValid || isLoading || warnings.length > 0) &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit as any)}
            disabled={!isValid || isLoading || warnings.length > 0}
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
  kitTypeSummary: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  kitTypeSummaryText: {
    fontSize: 14,
    color: "#212529",
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
    marginBottom: 8,
    color: "#212529",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupRow: {
    flexDirection: "row",
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
  componentTable: {
    marginBottom: 16,
  },
  componentTableHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  componentHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
  },
  componentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  componentText: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
  },
  deleteButton: {
    padding: 8,
  },
  noComponentsContainer: {
    padding: 16,
    alignItems: "center",
  },
  noComponentsText: {
    fontSize: 14,
    color: "#6c757d",
  },
  addComponentButton: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  addComponentButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  addComponentForm: {
    padding: 16,
  },
  addComponentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212529",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    color: "#212529",
  },
  searchCancelButton: {
    padding: 8,
  },
  searchResultsTable: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
  },
  flex1: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tableRowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableScrollContainer: {
    maxHeight: 200,
  },
  columnText: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffeeba",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    marginBottom: 4,
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    marginRight: 12,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e9ecef",
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: "#007bff",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  switchLabel: {
    fontSize: 16,
    color: "#212529",
  },
});

export default KitPreparationScreen;
