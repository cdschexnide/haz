import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { HazardousMaterialItem } from "../../types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
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

interface HazardousComponent {
  psn: string;
  classDiv: string;
}

export interface LifeSavingApplianceData {
  outerPackage: string;
  itemCount: string;
  components: HazardousMaterialItem[];
  key16: string;
  key19: string;
  packagingType: "standard" | "crewKit";
}

const UNID_OPTIONS = [
  {
    unid: "UN3072",
    properShippingName:
      "LIFE-SAVING APPLIANCES, NOT SELF-INFLATING containing dangerous goods as equipment",
  },
  {
    unid: "UN2990",
    properShippingName: "LIFE-SAVING APPLIANCES, SELF-INFLATING",
  },
];

const COMMON_COMPONENTS: HazardousMaterialItem[] = [
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN0191",
    properShippingName: "SIGNAL DEVICES, HAND",
    hazclassDiv: "1.4G ",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5, A69",
    packagingParagraph: "A5.18.",
  },
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN0197",
    properShippingName: "SIGNALS, SMOKE",
    hazclassDiv: "1.4G",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5",
    packagingParagraph: "A5.18.",
  },
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN0403",
    properShippingName: "FLARES, AERIAL",
    hazclassDiv: "1.4G",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5",
    packagingParagraph: "A5.18.",
  },
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN1013",
    properShippingName: "CARBON DIOXIDE",
    details: "",
    hazclassDiv: "2.2",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5",
    packagingParagraph: "A6.3., A6.4., A6.5.",
  },
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN3028",
    properShippingName: "BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID",
    details: "electric storage",
    hazclassDiv: "8",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5",
    packagingParagraph: "A12.4.",
  },
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN3480",
    properShippingName: "LITHIUM ION BATTERIES",
    details: "including lithium polymer batteries",
    hazclassDiv: "9",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5, 388",
    packagingParagraph: "A13.7.",
  },
];

const LifeSavingAppliances = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const [outerPackage, setOuterPackage] = useState<string>("");
  const [itemCount, setItemCount] = useState<string>("1");
  const [components, setComponents] = useState<HazardousMaterialItem[]>([]);
  const [packagingType, setPackagingType] = useState<"standard" | "crewKit">(
    "standard"
  );
  const { navigate } = useNavigationRef();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showAddComponentModal, setShowAddComponentModal] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMaterials, setFilteredMaterials] = useState<
    HazardousMaterialItem[]
  >([]);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = hazardousMaterialsList.filter(
        (material: HazardousMaterialItem) =>
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

  // Key 16 for Shipper's Declaration
  const key16 =
    outerPackage && itemCount
      ? `${outerPackage} x ${itemCount} ${
          state.hazProPreparerContext.hazardousMaterial?.unid === "UN2990"
            ? "self-inflating"
            : "non-self-inflating"
        } life-saving appliance${parseInt(itemCount) > 1 ? "s" : ""}`
      : "";

  // Key 19 for Shipper's Declaration
  const key19 =
    components.length > 0
      ? `Contains: ${components
          .map(
            (comp: HazardousMaterialItem) =>
              `${comp.properShippingName} (${comp.hazclassDiv})`
          )
          .join(", ")}`
      : "";

  useEffect(() => {
    const existingData = state.hazProPreparerContext.lifeSavingApplianceData;
    if (existingData) {
      if (existingData.outerPackage) setOuterPackage(existingData.outerPackage);
      if (existingData.itemCount) setItemCount(existingData.itemCount);
      if (existingData.components) setComponents(existingData.components);
      if (existingData.packagingType)
        setPackagingType(existingData.packagingType);
    }
  }, []);

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  useEffect(() => {
    const isOuterPackageValid =
      outerPackage.trim().length > 0 && outerPackage.length <= 50;
    const isItemCountValid = /^[1-9][0-9]*$/.test(itemCount);
    const areComponentsValid = components.length > 0;

    setIsValid(isOuterPackageValid && isItemCountValid && areComponentsValid);
  }, [outerPackage, itemCount, components]);

  const handleAddComponent = (item: HazardousMaterialItem) => {
    if (item?.properShippingName && item?.hazclassDiv) {
      setComponents([...components, { ...item }]);
      setShowAddComponentModal(false);
      setSearchQuery("");
    }
  };

  const handleAddCommonComponent = (component: HazardousMaterialItem) => {
    if (
      !components.some(
        (c: HazardousMaterialItem) =>
          c.properShippingName === component.properShippingName &&
          c.hazclassDiv === component.hazclassDiv
      )
    ) {
      setComponents([...components, { ...component }]);
    }
    setShowAddComponentModal(false);
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = [...components];
    updatedComponents.splice(index, 1);
    setComponents(updatedComponents);
  };

  const handleSaveAndExit = () => {
    const lifeSavingApplianceData: LifeSavingApplianceData = {
      outerPackage,
      itemCount,
      components,
      key16,
      key19,
      packagingType,
    };
    store.hazProPreparerContext.lifeSavingApplianceData =
      lifeSavingApplianceData;
    saveCurrentShipment("in-progress");
    navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const handleSaveAndContinue = () => {
    if (!isValid) return;

    const lifeSavingApplianceData: LifeSavingApplianceData = {
      outerPackage,
      itemCount,
      components,
      key16,
      key19,
      packagingType,
    };

    store.hazProPreparerContext.lifeSavingApplianceData =
      lifeSavingApplianceData;

    if (!completedSubsteps.includes("LifeSavingAppliances")) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "LifeSavingAppliances",
      ];
    }
    navigation.navigate("LabelingAndMarking");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Life-Saving Appliances</Text>
          </View>
          <View style={styles.referenceCard}>
            <Text style={styles.referenceTitle}>Reference Information</Text>
            <Text style={styles.referenceText}>
              Life-saving appliances include life-raft kits, life-vest kits,
              survival kits, ejection seats, and parachutes, that contain small
              quantities of hazardous materials such as flares, CO₂ cylinders,
              or ammunition.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Packaging Details</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Pack kits in weather-resistant fiberboard or other securely
                closed strong outer container. Pack hazardous materials
                contained in the kit in inner packaging that is adequate to
                prevent accidental activation. Suitably cushion the inner
                packagings to prevent movement.
              </Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Outer Package Description</Text>
              <Text style={styles.exampleText}>
                Example: 463L Pallet, 1 x Fiberboard box (4G), Equipment
                (described), or Plywood box, etc.
              </Text>
              <TextInput
                style={[
                  styles.input,
                  outerPackage.length > 50 && styles.inputError,
                ]}
                value={outerPackage}
                onChangeText={setOuterPackage}
                placeholder="e.g., Fiberboard box, Wooden crate, A-3 bag"
                maxLength={60}
              />
              <Text style={styles.helperText}>
                {packagingType === "standard"
                  ? "Weather-resistant fiberboard or equivalent strong container"
                  : "Strong outer container or A-3 bag"}
              </Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Number of Items <Text style={styles.required}></Text>
              </Text>
              <TextInput
                style={styles.input}
                value={itemCount}
                onChangeText={text => setItemCount(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="Enter quantity (e.g., 1, 2, 3)"
              />
              <Text style={styles.helperText}>
                Number of life-saving appliances in this shipment
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hazardous Components</Text>
            <Text style={styles.descriptionText}>
              List all hazardous materials contained within the life-saving
              appliance.
            </Text>

            {components.length > 0 ? (
              <View style={styles.componentTable}>
                <View style={styles.componentTableHeader}>
                  <Text style={[styles.componentHeaderText, { flex: 2 }]}>
                    Proper Shipping Name
                  </Text>
                  <Text style={[styles.componentHeaderText, { flex: 1 }]}>
                    Class/Division
                  </Text>
                  <Text style={[styles.componentHeaderText, { width: 50 }]}>
                    Action
                  </Text>
                </View>

                {components.map(
                  (component: HazardousMaterialItem, index: number) => (
                    <View key={index} style={styles.componentRow}>
                      <Text style={[styles.componentText, { flex: 2 }]}>
                        {component.properShippingName}
                      </Text>
                      <Text style={[styles.componentText, { flex: 1 }]}>
                        {component.hazclassDiv}
                      </Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleRemoveComponent(index)}
                      >
                        <MaterialIcons
                          name="delete"
                          size={20}
                          color="#dc3545"
                        />
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>
            ) : (
              <View style={styles.noComponentsContainer}>
                <Text style={styles.noComponentsText}>
                  No hazardous components added yet. Add at least one component.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.addComponentButton}
              onPress={() => setShowAddComponentModal(!showAddComponentModal)}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addComponentButtonText}>
                {showAddComponentModal ? "Cancel" : "Add Component"}
              </Text>
            </TouchableOpacity>

            {showAddComponentModal && (
              <View style={styles.addComponentForm}>
                <Text style={styles.addComponentTitle}>Add New Component</Text>

                <View style={styles.searchRow}>
                  <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#6c757d" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search by UNID or Name"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      accessibilityLabel="Search hazards input"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.searchCancelButton}
                    onPress={() => {
                      setSearchQuery("");
                      setShowAddComponentModal(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel search"
                  >
                    <Ionicons name="close-circle" size={22} color="#6c757d" />
                  </TouchableOpacity>
                </View>

                {searchQuery.length >= 3 && (
                  <View style={styles.searchResultsTable}>
                    {/* Table Header */}
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
                      {filteredMaterials.map(
                        (item: HazardousMaterialItem, index: number) => (
                          <TouchableOpacity
                            key={`${item.unid}-${item.properShippingName}-${item.details}-${index}`}
                            style={styles.tableRow}
                            onPress={() => handleAddComponent(item)}
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
                                {item.subsidiaryRisk.split(" ").join("\n")}
                              </Text>
                              <Text style={[styles.columnText, styles.flex1]}>
                                {item.packingGroup.split(" ").join("\n")}
                              </Text>
                              <Text style={[styles.columnText, styles.flex1]}>
                                {(
                                  item?.specialProvision?.match(
                                    /([A-Z0-9]+(?:, ?[A-Z0-9]+)*)/g
                                  ) || []
                                ).join("\n")}
                              </Text>
                              <Text style={[styles.columnText, styles.flex1]}>
                                {item.packagingParagraph.split(" ").join("\n")}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )
                      )}
                    </ScrollView>
                  </View>
                )}

                <Text style={styles.commonComponentsTitle}>
                  Common Components:
                </Text>
                <ScrollView horizontal style={styles.commonComponentsScroll}>
                  {COMMON_COMPONENTS.map(
                    (component: HazardousMaterialItem, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.commonComponentButton}
                        onPress={() => handleAddCommonComponent(component)}
                      >
                        <Text style={styles.commonComponentName}>
                          {component.properShippingName}
                        </Text>
                        <Text style={styles.commonComponentClass}>
                          {component.hazclassDiv}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
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
              style={[styles.saveButton, !isValid && styles.disabledButton]}
              onPress={handleSaveAndContinue}
              disabled={!isValid}
            >
              <Text style={styles.saveButtonText}>Save & Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  referenceCard: {
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
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
  helperText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  errorText: {
    color: "#dc3545",
  },
  characterCount: {
    alignItems: "flex-end",
  },
  packagingTypeContainer: {
    marginTop: 8,
  },
  packagingTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  selectedPackagingType: {
    borderColor: colors.blue,
    backgroundColor: "#f0f7ff",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  packagingTypeTextContainer: {
    flex: 1,
  },
  packagingTypeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
    marginBottom: 4,
  },
  packagingTypeDescription: {
    fontSize: 14,
    color: "#6c757d",
  },
  descriptionText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 16,
  },
  componentTable: {
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    overflow: "hidden",
  },
  componentTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  componentHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  componentRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  componentText: {
    fontSize: 14,
    color: "#212529",
  },
  deleteButton: {
    width: 50,
    alignItems: "center",
  },
  noComponentsContainer: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  noComponentsText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  addComponentButton: {
    flexDirection: "row",
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addComponentButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  addComponentForm: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  exampleText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
    fontStyle: "italic",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    // height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  addComponentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
  },
  submitComponentButton: {
    backgroundColor: "#28a745",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  submitComponentButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#6c757d",
    opacity: 0.65,
  },
  commonComponentsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212529",
    marginBottom: 8,
  },
  commonComponentsScroll: {
    flexDirection: "row",
    marginBottom: 8,
  },
  commonComponentButton: {
    backgroundColor: "#e9ecef",
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    minWidth: 130,
  },
  commonComponentName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#212529",
    marginBottom: 4,
  },
  commonComponentClass: {
    fontSize: 12,
    color: "#6c757d",
  },
  previewContainer: {
    marginTop: 8,
    marginBottom: 16,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
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
  saveButton: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    marginLeft: 8,
  },
  searchCancelButton: {
    padding: 8,
  },
  searchResultsTable: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    maxHeight: 300,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
    textAlign: "center",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tableRowContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  tableScrollContainer: {
    maxHeight: 200,
  },
  columnText: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    color: "#212529",
  },
  flex1: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: "#e9f5ff",
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#495057",
    lineHeight: 18,
  },
});

export default LifeSavingAppliances;
