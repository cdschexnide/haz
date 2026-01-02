import colors from "@/theming/colors";
import {
  getPlacardRequirements,
  kgToLbs,
  lbsToKg,
  PlacardRequirement,
} from "@/utils/tableA16_1";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ListItem } from "react-native-elements";
import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "../hazardousMaterials/hazardousMaterialsList";

const { width, height } = Dimensions.get("window");
const MODAL_MAX_WIDTH = 900;

interface PlacardingToolProps {
  visible: boolean;
  onClose: () => void;
  onExpandChange: (expanded: boolean) => void;
}

const PlacardingTool: React.FC<PlacardingToolProps> = ({
  visible,
  onClose,
  onExpandChange,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<HazardousMaterialItem | null>(null);
  const [weightValue, setWeightValue] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [placardRequirements, setPlacardRequirements] = useState<
    PlacardRequirement[]
  >([]);

  const filteredMaterials =
    searchQuery.length >= 4
      ? hazardousMaterialsList.filter(
          material =>
            material.unid.indexOf(searchQuery) !== -1 ||
            material.properShippingName
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) !== -1
        )
      : [];

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    const shouldShowTable = text.length >= 4;
    setShowTable(shouldShowTable);

    if (onExpandChange) {
      onExpandChange(shouldShowTable || selectedMaterial !== null);
    }
  };

  const handleMaterialSelect = (material: HazardousMaterialItem) => {
    setSelectedMaterial(material);
    setShowTable(false);
    calculatePlacardRequirements(material, weightValue, weightUnit);
    if (onExpandChange) {
      onExpandChange(true);
    }
  };

  const handleWeightChange = (value: string) => {
    const numericRegex = /^\d*\.?\d*$/;
    if (value === "" || numericRegex.test(value)) {
      setWeightValue(value);
      if (selectedMaterial) {
        calculatePlacardRequirements(selectedMaterial, value, weightUnit);
      }
    }
  };

  const handleWeightUnitChange = (unit: "lbs" | "kg") => {
    if (unit === weightUnit) return;

    setWeightUnit(unit);

    if (weightValue !== "" && !isNaN(parseFloat(weightValue))) {
      const numericValue = parseFloat(weightValue);
      let newValue: number;

      if (unit === "kg" && weightUnit === "lbs") {
        newValue = lbsToKg(numericValue);
      } else if (unit === "lbs" && weightUnit === "kg") {
        newValue = kgToLbs(numericValue);
      } else {
        newValue = numericValue;
      }

      setWeightValue(newValue.toFixed(2));

      if (selectedMaterial) {
        calculatePlacardRequirements(
          selectedMaterial,
          newValue.toString(),
          unit
        );
      }
    }
  };

  const calculatePlacardRequirements = (
    material: HazardousMaterialItem,
    weight: string,
    unit: "lbs" | "kg"
  ) => {
    if (!material || weight === "" || isNaN(parseFloat(weight))) {
      setPlacardRequirements([]);
      return;
    }
    const weightInLbs =
      unit === "kg" ? kgToLbs(parseFloat(weight)) : parseFloat(weight);
    let hazardClass = material.hazclassDiv;
    if (hazardClass.startsWith("1") && /[A-Za-z]$/.test(hazardClass)) {
      hazardClass = hazardClass.slice(0, -1);
    }

    const requirements = getPlacardRequirements(hazardClass, weightInLbs);
    setPlacardRequirements(requirements);
  };

  const handleClearSelection = () => {
    setSelectedMaterial(null);
    setSearchQuery("");
    setWeightValue("");
    setPlacardRequirements([]);
    setShowTable(false);
    if (onExpandChange) {
      onExpandChange(false);
    }
  };

  const renderTable =
    showTable && filteredMaterials.length > 0 && !selectedMaterial;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.keyboardWrapper}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View
              style={[
                styles.card,
                {
                  width: Math.min(MODAL_MAX_WIDTH, width * 0.9),
                  maxHeight: height * 0.85,
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Placarding Tool</Text>
                {onClose && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    accessibilityLabel="Close placarding tool"
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {/* Search Input */}
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search UN, NA, or ID No."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={handleSearchInputChange}
                  />
                  {selectedMaterial && (
                    <TouchableOpacity
                      onPress={handleClearSelection}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {renderTable && (
                  <View style={styles.tableContainer}>
                    <FlatList
                      data={filteredMaterials}
                      keyExtractor={(item: HazardousMaterialItem) =>
                        `${item.unid}-${item.properShippingName}-${item.details}`
                      }
                      stickyHeaderIndices={[0]}
                      ListHeaderComponent={
                        <View style={styles.tableHeader}>
                          <Text style={[styles.headerText, styles.flex1]}>
                            UN/ID{"\n"}Number
                          </Text>
                          <Text style={[styles.headerText, styles.flex1]}>
                            PSN/{"\n"}Description
                          </Text>
                          <Text style={[styles.headerText, styles.flex1]}>
                            Hazard Class/{"\n"}Div
                          </Text>
                          <Text style={[styles.headerText, styles.flex1]}>
                            Subsidiary{"\n"}Risk
                          </Text>
                          <Text style={[styles.headerText, styles.flex1]}>
                            Packing{"\n"}Group
                          </Text>
                          <Text style={[styles.headerText, styles.flex1]}>
                            Special{"\n"}Provision
                          </Text>
                          <Text style={[styles.headerText, styles.flex1]}>
                            Packaging{"\n"}Paragraph
                          </Text>
                        </View>
                      }
                      renderItem={({
                        item,
                      }: {
                        item: HazardousMaterialItem;
                      }) => (
                        <TouchableOpacity
                          style={styles.resultItem}
                          onPress={() => handleMaterialSelect(item)}
                        >
                          <ListItem
                            containerStyle={{ backgroundColor: "white" }}
                          >
                            <ListItem.Content>
                              <View style={styles.listItemRow}>
                                <Text style={styles.columnText}>
                                  {item.unid}
                                </Text>
                                <Text style={styles.columnText}>
                                  {item.properShippingName}
                                </Text>
                                <Text style={styles.columnText}>
                                  {item.hazclassDiv}
                                </Text>
                                <Text style={styles.columnText}>
                                  {item.subsidiaryRisk.split(" ").join("\n")}
                                </Text>
                                <Text style={styles.columnText}>
                                  {item.packingGroup.split(" ").join("\n")}
                                </Text>
                                <Text style={styles.columnText}>
                                  {(
                                    item?.specialProvision?.match(
                                      /([A-Z0-9]+(?:, ?[A-Z0-9]+)*)/g
                                    ) || []
                                  ).join("\n")}
                                </Text>
                                <Text style={styles.columnText}>
                                  {item.packagingParagraph
                                    .split(" ")
                                    .join("\n")}
                                </Text>
                              </View>
                            </ListItem.Content>
                          </ListItem>
                        </TouchableOpacity>
                      )}
                      scrollEnabled={filteredMaterials.length > 3}
                      style={{ flexGrow: 0 }}
                      contentContainerStyle={{ flexGrow: 0 }}
                    />
                  </View>
                )}
                {selectedMaterial && (
                  <View style={styles.selectedMaterialContainer}>
                    <Text style={styles.selectedMaterialTitle}>
                      Selected Material
                    </Text>
                    <View style={styles.materialInfo}>
                      <Text style={styles.materialInfoText}>
                        <Text style={styles.materialInfoLabel}>UN/ID: </Text>
                        {selectedMaterial.unid}
                      </Text>
                      <Text style={styles.materialInfoText}>
                        <Text style={styles.materialInfoLabel}>Name: </Text>
                        {selectedMaterial.properShippingName}
                      </Text>
                      <Text style={styles.materialInfoText}>
                        <Text style={styles.materialInfoLabel}>
                          Hazard Class:{" "}
                        </Text>
                        {selectedMaterial.hazclassDiv}
                      </Text>
                    </View>
                  </View>
                )}
                {selectedMaterial && (
                  <View style={styles.weightContainer}>
                    <Text style={styles.weightLabel}>
                      Aggregate Gross Weight
                    </Text>
                    <View style={styles.weightInputRow}>
                      <TextInput
                        style={styles.weightInput}
                        placeholder="Enter weight"
                        value={weightValue}
                        onChangeText={handleWeightChange}
                        keyboardType="numeric"
                      />
                      <View style={styles.unitButtonContainer}>
                        <TouchableOpacity
                          style={[
                            styles.unitButton,
                            weightUnit === "lbs" && styles.activeUnitButton,
                          ]}
                          onPress={() => handleWeightUnitChange("lbs")}
                        >
                          <Text
                            style={[
                              styles.unitButtonText,
                              weightUnit === "lbs" &&
                                styles.activeUnitButtonText,
                            ]}
                          >
                            lbs
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.unitButton,
                            weightUnit === "kg" && styles.activeUnitButton,
                          ]}
                          onPress={() => handleWeightUnitChange("kg")}
                        >
                          <Text
                            style={[
                              styles.unitButtonText,
                              weightUnit === "kg" &&
                                styles.activeUnitButtonText,
                            ]}
                          >
                            kg
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {weightValue !== "" && !isNaN(parseFloat(weightValue)) && (
                      <Text style={styles.weightConversionText}>
                        {weightUnit === "lbs"
                          ? `Equivalent to ${lbsToKg(
                              parseFloat(weightValue)
                            ).toFixed(2)} kg`
                          : `Equivalent to ${kgToLbs(
                              parseFloat(weightValue)
                            ).toFixed(2)} lbs`}
                      </Text>
                    )}
                  </View>
                )}
                {placardRequirements.length > 0 && (
                  <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Required Placard</Text>
                    {placardRequirements.map((requirement, index) => (
                      <View key={index} style={styles.placardItem}>
                        <Text style={styles.placardText}>
                          {requirement.placard}
                        </Text>
                        {requirement.specialConditions && (
                          <Text style={styles.placardConditions}>
                            ({requirement.specialConditions})
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
                {selectedMaterial &&
                  weightValue !== "" &&
                  !isNaN(parseFloat(weightValue)) &&
                  placardRequirements.length === 0 && (
                    <View style={styles.noRequirementsContainer}>
                      <Text style={styles.noRequirementsText}>
                        No specific placard requirements found for this hazard
                        class and weight.
                      </Text>
                    </View>
                  )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
    backgroundColor: "#ffffff",
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  tableContainer: {
    maxHeight: 300,
    backgroundColor: "#f7fafd",
    borderWidth: 1,
    borderColor: "#b0b0b0",
    borderRadius: 5,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#000",
  },
  flex1: {
    flex: 1,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnText: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    color: "#000",
  },
  selectedMaterialContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedMaterialTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 10,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.blue,
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  materialInfo: {
    gap: 5,
  },
  materialInfoText: {
    fontSize: 14,
    color: "#4a5568",
  },
  materialInfoLabel: {
    fontWeight: "600",
    color: "#2d3748",
  },
  weightContainer: {
    marginBottom: 15,
  },
  weightLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  weightInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#000",
    marginRight: 10,
  },
  unitButtonContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    overflow: "hidden",
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
  },
  activeUnitButton: {
    backgroundColor: colors.blue,
  },
  unitButtonText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  activeUnitButtonText: {
    color: "#fff",
  },
  weightConversionText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 5,
    fontStyle: "italic",
  },
  resultsContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c4a6e",
    marginBottom: 12,
  },
  placardItem: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  placardText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 4,
  },
  placardConditions: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 4,
  },
  placardType: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  noRequirementsContainer: {
    backgroundColor: "#fef3cd",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#fde047",
  },
  noRequirementsText: {
    fontSize: 14,
    color: "#a16207",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default PlacardingTool;
