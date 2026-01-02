import { A6_15TechnicalNames } from "../../server/data/technicalNames";
import isHazardousWaste from "../../server/hazardousWaste/isHazardousWaste";
import { informativeSpecialProvisionsMap } from "../../server/informativeStatements/informativeStatements";
import { hazProContextLookup } from "../../server/lookupFunctions/hazProContextLookup";
import { specialProvisionsMap } from "../../server/lookupFunctions/specialProvisions";
import isOrganicPeroxide from "../../server/organicPeroxides/isOrganicPeroxide";
import {
  aCodeLabelingModifiers,
  numericSpecialProvisionsLabelingModifiers,
} from "../../server/workflowModifiers/labelingModifiers";
import { numericSpecialProvisionsSDDGAndPackagingModifiers } from "../../server/workflowModifiers/packagingAndSDDGModifiers";
import {
  aCodePackagingModifiers,
  nCodePackagingModifiers,
} from "../../server/workflowModifiers/packagingModifiers";
import {
  aCodePassengerEligibilityModifiers,
  pCodePassengerEligibilityModifiers,
} from "../../server/workflowModifiers/passengerEligibilityModifiers";
import {
  aCodeSDDGModifiers,
  numericSpecialProvisionsSDDGModifiers,
} from "../../server/workflowModifiers/SDDGModifiers";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { getHazardousMaterialPhysicalState } from "@/utils/getHazardousMaterialPhysicalState";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { JSX, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "../hazardousMaterials/hazardousMaterialsList";
import {
  A6_15WorkflowModifiers,
  A6_4WorkflowModifiers,
  A6_5WorkflowModifiers,
  A6_6WorkflowModifiers,
  A6_9WorkflowModifiers,
} from "./Data";

const MaterialIDScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, actions } = useHazProStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTable, setShowTable] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<HazardousMaterialItem | null>(
      state.hazProPreparerContext.hazardousMaterial || null
    );
  const [grandfathered, setGrandfathered] = useState<boolean | null>(
    state.hazProPreparerContext.isGrandfatheredExplosive || null
  );
  const [selectedPackingGroup, setSelectedPackingGroup] = useState<string>(
    selectedMaterial?.packingGroup?.includes(" ")
      ? selectedMaterial?.packingGroup.split(" ")[0]
      : selectedMaterial?.packingGroup || ""
  );
  const [flashPointValue, setFlashPointValue] = useState<string>("");
  const [flashPointUnit, setFlashPointUnit] = useState<
    "fahrenheit" | "celsius"
  >("celsius");
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setShowTable(false);
    } else if (text.length >= 4) {
      setShowTable(true);
    } else {
      setShowTable(false);
    }
  };

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

  useEffect(() => {
    if (grandfathered !== null) {
      store.hazProPreparerContext.isGrandfatheredExplosive = grandfathered;
    }
  }, [grandfathered]);

  const [selectedTechnicalName, setSelectedTechnicalName] = useState<string>(
    state.hazProPreparerContext.technicalName || ""
  );
  const isOrganic = selectedMaterial
    ? isOrganicPeroxide({ hazardousMaterial: selectedMaterial })
        .isOrganicPeroxide
    : false;
  const isWaste = selectedMaterial
    ? isHazardousWaste({ hazardousMaterial: selectedMaterial }).isHazardousWaste
    : false;
  const hasMoreThanOnePackingGroup =
    selectedMaterial && selectedMaterial.packingGroup.split(" ").length > 1;
  const isClassOne =
    selectedMaterial && selectedMaterial.hazclassDiv.startsWith("1");
  const needsToMakePackingGroupSelection =
    selectedMaterial &&
    selectedMaterial.packingGroup.split(" ").length > 1 &&
    selectedPackingGroup === "";
  const needsToMakeHazardousMaterialSelection =
    state.hazProPreparerContext.hazardousMaterial === null ||
    selectedMaterial === null;
  const needsToInputTechnicalName =
    selectedMaterial?.isTechnicalNameRequired &&
    state.hazProPreparerContext.technicalName === "";

  useEffect(() => {
    if (
      !(
        selectedMaterial?.packagingParagraph &&
        selectedMaterial.packagingParagraph.indexOf("A6.15.") !== -1
      )
    ) {
      setSelectedTechnicalName("");
    }
  }, [selectedMaterial]);

  const handleStartOver = () => {
    setSearchQuery("");
    setSelectedMaterial(null);
  };

  const performHazProLookup = (material: HazardousMaterialItem) => {
    const materialPhysicalState = getHazardousMaterialPhysicalState(material);

    const lookupInput = {
      context: {
        hazardousMaterial: material,
        physicalState: materialPhysicalState,
      },
      specialProvisionsMap: informativeSpecialProvisionsMap,
      dotCylinderSpecifications: [],
      markingContext: {
        context: store.hazProPreparerContext,
      },
      labelingContext: {
        hazardousMaterial: material,
        isLimitedQuantity: false,
        isExceptedQuantity: false,
      },
    };

    const lookupOutput = hazProContextLookup(lookupInput);
    // Deep clone the lookup output to avoid Valtio proxy issues with frozen/sealed objects
    store.hazProPreparerContext.lookupFunctionsOutput = lookupOutput ? JSON.parse(JSON.stringify(lookupOutput)) : null;
  };

  const handleMaterialSelect = (material: HazardousMaterialItem) => {
    setSelectedMaterial(material);

    // Deep clone the material object to avoid Valtio proxy issues with frozen/sealed objects
    // Using JSON parse/stringify to ensure all nested objects are also cloned
    store.hazProPreparerContext.hazardousMaterial = JSON.parse(JSON.stringify(material));
    store.hazProPreparerContext.allowablePackingGroups = material.packingGroup;

    if (material.packingGroup.split(" ").length > 1) {
      return;
    }

    const specialProvisionsArray = material.specialProvision
      ? material.specialProvision.split(", ").map(sp => sp.trim())
      : [];

    const filterMatchingKeys = (
      sourceMap: Record<string, any>,
      keys: string[]
    ) => {
      return keys.reduce((acc, key) => {
        if (sourceMap[key]) {
          acc[key] = sourceMap[key];
        }
        return acc;
      }, {} as Record<string, any>);
    };

    const informativeSpecialProvisions = filterMatchingKeys(
      informativeSpecialProvisionsMap,
      specialProvisionsArray
    );

    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsInformativeStatements =
        informativeSpecialProvisions;
    }

    // Store special provisions map on the global store
    const materialSpecialProvisionsMap = filterMatchingKeys(
      specialProvisionsMap,
      specialProvisionsArray
    );
    store.hazProPreparerContext.specialProvisionsMap =
      materialSpecialProvisionsMap;

    const allWorkflowModifiers = {
      ...numericSpecialProvisionsLabelingModifiers,
      ...aCodeLabelingModifiers,
      ...numericSpecialProvisionsSDDGAndPackagingModifiers,
      ...aCodePackagingModifiers,
      ...nCodePackagingModifiers,
      ...pCodePassengerEligibilityModifiers,
      ...aCodePassengerEligibilityModifiers,
      ...numericSpecialProvisionsSDDGModifiers,
      ...aCodeSDDGModifiers,
    };

    const workflowModifiersMap = filterMatchingKeys(
      allWorkflowModifiers,
      specialProvisionsArray
    );
    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsWorkflowModifiers =
        workflowModifiersMap;
    }

    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
        false;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.informativeStatementsAcknowledged =
        false;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged =
        false;
    }

    const materialPhysicalState = getHazardousMaterialPhysicalState(material);
    if (store.hazProPreparerContext.packaging?.inputPOPMarking) {
      let packagingType: "Solid" | "Liquid" | "Bulk" | undefined;
      switch (materialPhysicalState) {
        case "SOLID":
          packagingType = "Solid";
          break;
        case "LIQUID":
          packagingType = "Liquid";
          break;
        case "GAS":
          packagingType = "Bulk";
          break;
        default:
          packagingType = undefined;
      }
      store.hazProPreparerContext.packaging.inputPOPMarking.type =
        packagingType;
    }
    if (store.hazProPreparerContext.hazardousMaterial) {
      store.hazProPreparerContext.hazardousMaterial.physicalState =
        materialPhysicalState;
    }

    // A6.4 workflow modifiers
    if (
      material.packagingParagraph &&
      material.packagingParagraph.indexOf("A6.4.") !== -1
    ) {
      const documentNodeWorkflowModifiers: JSX.Element[] =
        A6_4WorkflowModifiers.workflowModifiersDocumentNodes;

      if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeWorkflowModifiers =
          documentNodeWorkflowModifiers;
      }
    }

    // A6.5 workflow modifiers
    if (
      material.packagingParagraph &&
      material.packagingParagraph.indexOf("A6.5.") !== -1
    ) {
      const documentNodeWorkflowModifiers: JSX.Element[] =
        A6_5WorkflowModifiers.workflowModifiersDocumentNodes;

      if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeWorkflowModifiers =
          documentNodeWorkflowModifiers;
      }
    }

    // A6.6 workflow modifiers
    if (
      material.packagingParagraph &&
      material.packagingParagraph.indexOf("A6.6.") !== -1
    ) {
      const documentNodeWorkflowModifiers: JSX.Element[] =
        A6_6WorkflowModifiers.workflowModifiersDocumentNodes;

      if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeWorkflowModifiers =
          documentNodeWorkflowModifiers;
      }
    }

    // A6.9 workflow modifiers
    if (
      material.packagingParagraph &&
      material.packagingParagraph.indexOf("A6.9.") !== -1
    ) {
      const documentNodeWorkflowModifiers: JSX.Element[] =
        A6_9WorkflowModifiers.workflowModifiersDocumentNodes;
      if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeWorkflowModifiers =
          documentNodeWorkflowModifiers;
      }
    }

    // A6.15 workflow modifiers
    if (
      material.packagingParagraph &&
      material.packagingParagraph.indexOf("A6.15.") !== -1
    ) {
      const documentNodeInformativeStatements: JSX.Element[] =
        A6_15WorkflowModifiers.informativeStatementsDocumentNodes;
      const documentNodeWorkflowModifiers: JSX.Element[] =
        A6_15WorkflowModifiers.workflowModifiersDocumentNodes;

      if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeInformativeStatements =
          documentNodeInformativeStatements;
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeWorkflowModifiers =
          documentNodeWorkflowModifiers;
      }
    }

    performHazProLookup(material);
  };

  const renderTable =
    (showTable &&
      filteredMaterials.length > 0 &&
      !(selectedMaterial?.packagingParagraph === "FORBIDDEN") &&
      !isOrganic &&
      !isWaste) ||
    selectedMaterial;
  const forbiddenCondition =
    selectedMaterial === null ||
    (selectedMaterial && selectedMaterial?.packagingParagraph !== "FORBIDDEN");

  const handlePackingGroupSelection = (selection: string) => {
    setSelectedPackingGroup(selection);
    if (store.hazProPreparerContext.hazardousMaterial) {
      store.hazProPreparerContext.hazardousMaterial.packingGroup = selection;
    }
    if (selectedMaterial?.packingGroup) {
      store.hazProPreparerContext.allowablePackingGroups =
        selectedMaterial.packingGroup;
    }

    const packingGroupOptions = selectedMaterial?.packingGroup.split(" ") || [];
    const selectedIndex = packingGroupOptions.findIndex(
      (pg: string) => pg === selection
    );

    if (selectedIndex === -1 || !selectedMaterial) return;

    const specialProvisionChunks =
      selectedMaterial?.specialProvision?.match(
        /([A-Z0-9]+(?:, ?[A-Z0-9]+)*)/g
      ) || [];

    const packagingParagraphChunks =
      selectedMaterial.packagingParagraph?.split(" ") || [];
    const subsidiaryRiskChunks =
      selectedMaterial.subsidiaryRisk?.split(" ") || [];

    const specialProvisions = specialProvisionChunks[selectedIndex] || "";
    const packagingParagraph = packagingParagraphChunks[selectedIndex] || "";
    const subsidiaryRisk = subsidiaryRiskChunks[selectedIndex] || "";

    if (store.hazProPreparerContext.hazardousMaterial) {
      store.hazProPreparerContext.hazardousMaterial.isFixed =
        selectedMaterial.isFixed;
      store.hazProPreparerContext.hazardousMaterial.isDomesticShipment =
        selectedMaterial.isDomesticShipment;
      store.hazProPreparerContext.hazardousMaterial.isTechnicalNameRequired =
        selectedMaterial.isTechnicalNameRequired;
      store.hazProPreparerContext.hazardousMaterial.unid =
        selectedMaterial.unid;
      store.hazProPreparerContext.hazardousMaterial.properShippingName =
        selectedMaterial.properShippingName;
      store.hazProPreparerContext.hazardousMaterial.details =
        selectedMaterial.details;
      store.hazProPreparerContext.hazardousMaterial.hazclassDiv =
        selectedMaterial.hazclassDiv;
      store.hazProPreparerContext.hazardousMaterial.packagingParagraph =
        packagingParagraph;
      store.hazProPreparerContext.hazardousMaterial.specialProvision =
        specialProvisions;
      store.hazProPreparerContext.hazardousMaterial.subsidiaryRisk =
        subsidiaryRisk;
    }

    const specialProvisionsArray = specialProvisions
      .split(", ")
      .map((sp: string) => sp.trim())
      .filter(Boolean);

    const filterMatchingKeys = (
      sourceMap: Record<string, any>,
      keys: string[]
    ) => {
      return keys.reduce((acc, key) => {
        if (sourceMap[key]) {
          acc[key] = sourceMap[key];
        }
        return acc;
      }, {} as Record<string, any>);
    };

    const informativeSpecialProvisions = filterMatchingKeys(
      informativeSpecialProvisionsMap,
      specialProvisionsArray
    );

    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsInformativeStatements =
        informativeSpecialProvisions;
    }

    // Store special provisions map on the global store
    const materialSpecialProvisionsMap = filterMatchingKeys(
      specialProvisionsMap,
      specialProvisionsArray
    );
    store.hazProPreparerContext.specialProvisionsMap =
      materialSpecialProvisionsMap;

    const allWorkflowModifiers = {
      ...numericSpecialProvisionsLabelingModifiers,
      ...aCodeLabelingModifiers,
      ...numericSpecialProvisionsSDDGAndPackagingModifiers,
      ...aCodePackagingModifiers,
      ...nCodePackagingModifiers,
      ...pCodePassengerEligibilityModifiers,
      ...aCodePassengerEligibilityModifiers,
      ...numericSpecialProvisionsSDDGModifiers,
      ...aCodeSDDGModifiers,
    };

    const workflowModifiersMap = filterMatchingKeys(
      allWorkflowModifiers,
      specialProvisionsArray
    );
    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsWorkflowModifiers =
        workflowModifiersMap;
    }

    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
        false;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.informativeStatementsAcknowledged =
        false;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged =
        false;
    }

    const materialPhysicalState =
      getHazardousMaterialPhysicalState(selectedMaterial);
    if (store.hazProPreparerContext.hazardousMaterial) {
      store.hazProPreparerContext.hazardousMaterial.physicalState =
        materialPhysicalState;
    }
    if (store.hazProPreparerContext.packaging?.inputPOPMarking) {
      let packagingType: "Solid" | "Liquid" | "Bulk" | undefined;
      switch (materialPhysicalState) {
        case "SOLID":
          packagingType = "Solid";
          break;
        case "LIQUID":
          packagingType = "Liquid";
          break;
        case "GAS":
          packagingType = "Bulk";
          break;
        default:
          packagingType = undefined;
      }
      store.hazProPreparerContext.packaging.inputPOPMarking.type =
        packagingType;
    }

    performHazProLookup(selectedMaterial);
  };

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 1;
  }, []);

  const isNextDisabled =
    needsToMakeHazardousMaterialSelection ||
    needsToInputTechnicalName ||
    (hasMoreThanOnePackingGroup && selectedPackingGroup === "") ||
    (isClassOne && (selectedPackingGroup === "" || grandfathered === null)) ||
    false;

  const fahrenheitToCelsius = (fahrenheit: number): number => {
    return ((fahrenheit - 32) * 5) / 9;
  };

  const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32;
  };

  const handleFlashPointChange = (value: string) => {
    const numericRegex = /^-?\d*\.?\d*$/;
    if (value === "" || numericRegex.test(value)) {
      setFlashPointValue(value);

      if (value !== "" && !isNaN(parseFloat(value))) {
        const numericValue = parseFloat(value);

        if (flashPointUnit === "fahrenheit") {
          const celsiusValue = fahrenheitToCelsius(numericValue);
          if (store.hazProPreparerContext.hazardousMaterial) {
            store.hazProPreparerContext.hazardousMaterial.flashPoint = {
              fahrenheit: numericValue,
              celsius: parseFloat(celsiusValue.toFixed(2)),
            };
          }
        } else {
          const fahrenheitValue = celsiusToFahrenheit(numericValue);
          if (store.hazProPreparerContext.hazardousMaterial) {
            store.hazProPreparerContext.hazardousMaterial.flashPoint = {
              celsius: numericValue,
              fahrenheit: parseFloat(fahrenheitValue.toFixed(2)),
            };
          }
        }
      }
    }
  };

  const handleFlashPointUnitChange = (unit: "fahrenheit" | "celsius") => {
    if (unit === flashPointUnit) return;

    setFlashPointUnit(unit);

    if (flashPointValue !== "" && !isNaN(parseFloat(flashPointValue))) {
      const numericValue = parseFloat(flashPointValue);

      if (unit === "celsius" && flashPointUnit === "fahrenheit") {
        const newValue = fahrenheitToCelsius(numericValue);
        setFlashPointValue(newValue.toFixed(2));
        if (store.hazProPreparerContext.hazardousMaterial) {
          store.hazProPreparerContext.hazardousMaterial.flashPoint = {
            celsius: parseFloat(newValue.toFixed(2)),
            fahrenheit: numericValue,
          };
        }
      } else if (unit === "fahrenheit" && flashPointUnit === "celsius") {
        const newValue = celsiusToFahrenheit(numericValue);
        setFlashPointValue(newValue.toFixed(2));
        if (store.hazProPreparerContext.hazardousMaterial) {
          store.hazProPreparerContext.hazardousMaterial.flashPoint = {
            fahrenheit: parseFloat(newValue.toFixed(2)),
            celsius: numericValue,
          };
        }
      }
    }
  };

  useEffect(() => {
    if (
      selectedMaterial?.hazclassDiv.startsWith("3") &&
      state.hazProPreparerContext.hazardousMaterial?.flashPoint
    ) {
      const flashpoint =
        state.hazProPreparerContext.hazardousMaterial.flashPoint;
      if (
        flashPointUnit === "fahrenheit" &&
        flashpoint.fahrenheit !== undefined
      ) {
        setFlashPointValue(flashpoint.fahrenheit.toString());
      } else if (
        flashPointUnit === "celsius" &&
        flashpoint.celsius !== undefined
      ) {
        setFlashPointValue(flashpoint.celsius.toString());
      }
    }
  }, [
    selectedMaterial,
    flashPointUnit,
    state.hazProPreparerContext.hazardousMaterial?.flashPoint,
  ]);

  useEffect(() => {
    const redirectUnid = state.hazProPreparerContext.redirectUnid;
    if (redirectUnid) {
      const match = hazardousMaterialsList.find(
        (material: HazardousMaterialItem) => material.unid === redirectUnid
      );
      if (match) handleMaterialSelect(match);
    }
  }, [state.hazProPreparerContext.redirectUnid]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <View style={styles.formContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Material ID</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search UN, NA, or ID No."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearchInputChange}
          />
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="scan-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {renderTable && forbiddenCondition && (
          <View style={styles.tableWrapper}>
            {/* Results counter */}
            <Text style={styles.resultsCounter}>
              Showing {filteredMaterials.length} matching material(s)
            </Text>

            <View style={styles.tableContainer}>
              <FlatList
                data={filteredMaterials}
                keyExtractor={(item: HazardousMaterialItem) =>
                  `${item.unid}-${item.properShippingName}-${item.details}`
                }
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={true}
                ListHeaderComponent={
                  <View style={styles.tableHeader}>
                    <Text
                      style={[styles.headerText, styles.flex1]}
                    >{`UN/ID\nNumber`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>
                      {`PSN/\nDescription`}
                    </Text>
                    <Text style={[styles.headerText, styles.flex1]}>
                      {`Hazard Class/\nDiv`}
                    </Text>
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
                }
                renderItem={({ item }: { item: HazardousMaterialItem }) => {
                  const isSelected =
                    `${selectedMaterial?.unid}-${selectedMaterial?.properShippingName}` ===
                    `${item.unid}-${item.properShippingName}`;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.resultItem,
                        isSelected && styles.selectedRow,
                      ]}
                      onPress={() => {
                        console.log("item!!!", JSON.stringify(item, null, 2));
                        handleMaterialSelect(item);
                      }}
                    >
                      <ListItem
                        containerStyle={{
                          backgroundColor: isSelected ? "#cce5ff" : "white",
                        }}
                      >
                        <ListItem.Content>
                          <View style={styles.listItemRow}>
                            <Text style={styles.columnText}>{item.unid}</Text>
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
                              {item.packagingParagraph.split(" ").join("\n")}
                            </Text>
                          </View>
                        </ListItem.Content>
                      </ListItem>
                    </TouchableOpacity>
                  );
                }}
                scrollEnabled={true}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ flexGrow: 0 }}
              />
            </View>
          </View>
        )}

        <View style={styles.rowContainer}>
          {hasMoreThanOnePackingGroup && (
            <View style={[styles.inputContainer]}>
              <Text style={styles.technicalNameLabel}>
                Select the packing group applicable to your material
              </Text>
              <Picker
                selectedValue={selectedPackingGroup}
                onValueChange={handlePackingGroupSelection}
                style={[styles.picker, { color: "#000" }]}
                dropdownIconColor="#000"
              >
                <Picker.Item
                  label="Select the packing group"
                  value=""
                  enabled={false}
                  color="#000"
                />
                {hasMoreThanOnePackingGroup &&
                  selectedMaterial.packingGroup
                    .split(" ")
                    .map((group: string, index: number) => (
                      <Picker.Item
                        key={index}
                        label={group}
                        value={group}
                        color="#000"
                      />
                    ))}
              </Picker>
            </View>
          )}
          {isClassOne && (
            <View style={styles.explosiveInputsRow}>
              <View style={styles.packingGroupContainer}>
                <Text style={styles.technicalNameLabel}>Packing Group</Text>
                <Picker
                  selectedValue={selectedPackingGroup}
                  onValueChange={handlePackingGroupSelection}
                  style={[styles.picker, { color: "#000" }]}
                  dropdownIconColor="#000"
                >
                  <Picker.Item
                    label="Select the packing group"
                    value=""
                    enabled={false}
                    color="#888"
                  />
                  <Picker.Item key={"I"} label={"I"} value={"I"} color="#000" />
                  <Picker.Item
                    key={"II"}
                    label={"II"}
                    value={"II"}
                    color="#000"
                  />
                </Picker>
              </View>

              <View style={styles.grandfatheredContainer}>
                <Text style={styles.technicalNameLabel}>
                  Packaged before Jan 1990?
                </Text>
                <View style={styles.buttonGroupRow}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      grandfathered === true && styles.radioButtonSelected,
                    ]}
                    onPress={() => setGrandfathered(true)}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        grandfathered === true &&
                          styles.radioButtonTextSelected,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      grandfathered === false && styles.radioButtonSelected,
                    ]}
                    onPress={() => setGrandfathered(false)}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        grandfathered === false &&
                          styles.radioButtonTextSelected,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {selectedMaterial?.isTechnicalNameRequired &&
            selectedMaterial?.packagingParagraph &&
            selectedMaterial.packagingParagraph.indexOf("A6.15.") !== -1 && (
              <View
                style={[
                  hasMoreThanOnePackingGroup
                    ? styles.technicalNameContainer
                    : styles.technicalNameContainerWithoutPG,
                  { position: "relative" },
                ]}
              >
                <Text style={styles.technicalNameLabel}>Technical Name</Text>
                <Picker
                  selectedValue={selectedTechnicalName}
                  onValueChange={value => {
                    setSelectedTechnicalName(value);
                    store.hazProPreparerContext.technicalName = value;
                  }}
                  style={[styles.picker, { color: "#000" }]}
                  dropdownIconColor="#000"
                >
                  <Picker.Item
                    label="Select technical name"
                    value=""
                    enabled={false}
                    color="#888"
                  />
                  {A6_15TechnicalNames.map((name, index) => (
                    <Picker.Item
                      key={index}
                      label={name}
                      value={name}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>
            )}

          {selectedMaterial?.isTechnicalNameRequired &&
            selectedMaterial?.packagingParagraph &&
            !(selectedMaterial.packagingParagraph.indexOf("A6.15.") !== -1) && (
              <View
                style={[
                  hasMoreThanOnePackingGroup
                    ? styles.technicalNameContainer
                    : styles.technicalNameContainerWithoutPG,
                  { position: "relative" },
                ]}
              >
                <Text style={styles.technicalNameLabel}>Technical Name</Text>
                <TextInput
                  style={styles.technicalNameInput}
                  placeholder="Enter technical name"
                  value={state.hazProPreparerContext.technicalName || ""}
                  onChangeText={text =>
                    (store.hazProPreparerContext.technicalName = text)
                  }
                />
              </View>
            )}
          {selectedMaterial && selectedMaterial.hazclassDiv.startsWith("3") && (
            <View style={styles.flashPointContainer}>
              <Text style={styles.flashPointLabel}>Flash Point</Text>
              <View style={styles.flashPointInputRow}>
                <TextInput
                  style={styles.flashPointInput}
                  placeholder="Enter flash point"
                  value={flashPointValue}
                  onChangeText={handleFlashPointChange}
                  keyboardType="numeric"
                />
                <View style={styles.unitButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      flashPointUnit === "celsius" && styles.activeUnitButton,
                    ]}
                    onPress={() => handleFlashPointUnitChange("celsius")}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        flashPointUnit === "celsius" &&
                          styles.activeUnitButtonText,
                      ]}
                    >
                      °C
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      flashPointUnit === "fahrenheit" &&
                        styles.activeUnitButton,
                    ]}
                    onPress={() => handleFlashPointUnitChange("fahrenheit")}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        flashPointUnit === "fahrenheit" &&
                          styles.activeUnitButtonText,
                      ]}
                    >
                      °F
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.flashPointHelpText}>
                {flashPointUnit === "fahrenheit"
                  ? flashPointValue !== "" &&
                    !isNaN(parseFloat(flashPointValue))
                    ? `Equivalent to ${fahrenheitToCelsius(
                        parseFloat(flashPointValue)
                      ).toFixed(2)}°C`
                    : "Enter the flash point temperature"
                  : flashPointValue !== "" &&
                    !isNaN(parseFloat(flashPointValue))
                  ? `Equivalent to ${celsiusToFahrenheit(
                      parseFloat(flashPointValue)
                    ).toFixed(2)}°F`
                  : "Enter the flash point temperature"}
              </Text>
            </View>
          )}
        </View>
        {(isOrganic || isWaste) && (
          <View style={styles.warningContainer}>
            <Text style={styles.unidText}>{selectedMaterial?.unid}</Text>
            <Text style={styles.unidText}>
              {selectedMaterial?.properShippingName}
            </Text>
            <Text style={styles.airTransportText}>Air Transportation</Text>
            <MaterialCommunityIcons
              style={styles.warningIcon}
              name="alert-circle"
              size={60}
              color="#fdd14f"
            />
            <Text style={styles.warningText}>
              {isOrganic
                ? "Unfortunately, organic peroxides are not currently supported for preparation in HazPro."
                : "Unfortunately, hazardous waste is not currently supported for preparation in HazPro."}
            </Text>
            <TouchableOpacity
              style={styles.startOverButton}
              onPress={handleStartOver}
            >
              <Text style={styles.startOverButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedMaterial?.packagingParagraph === "FORBIDDEN" && (
          <View style={styles.forbiddenContainer}>
            <Text style={styles.unidText}>{selectedMaterial?.unid}</Text>
            <Text style={styles.unidText}>
              {selectedMaterial?.properShippingName}
            </Text>
            <Text style={styles.airTransportText}>Air Transportation</Text>
            <Text style={styles.forbiddenText}>FORBIDDEN SUBSTANCE</Text>
            <MaterialCommunityIcons
              style={styles.forbiddenIcon}
              name="close-circle"
              size={60}
              color="red"
            />
            <TouchableOpacity
              style={styles.startOverButton}
              onPress={handleStartOver}
            >
              <Text style={styles.startOverButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!isKeyboardVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              actions.resetContext();
              navigation.goBack();
              store.hazProPreparerContext.completedSubsteps = [];
              store.hazProPreparerContext.activeStep = null;
            }}
            accessibilityLabel="Cancel button"
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              isNextDisabled && styles.disabledButton,
            ]}
            onPress={() => {
              if (isClassOne) {
                if (grandfathered) {
                  navigation.navigate("ExplosiveDetailsWizard");
                } else {
                  store.hazProPreparerContext.completedSubsteps = [
                    "MaterialID",
                  ];
                  navigation.navigate("QuantityEntryScreen");
                }
                return;
              }
              store.hazProPreparerContext.completedSubsteps = ["MaterialID"];
              navigation.navigate("QuantityEntryScreen");
            }}
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default MaterialIDScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  title: { fontSize: 22, fontWeight: "bold", marginLeft: 10 },
  contentContainer: {
    flexDirection: "row",
    flex: 1,
  },
  leftPanel: {
    width: "30%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowOpacity: 0.1,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  panelLabel: {
    fontWeight: "bold",
    marginTop: 5,
  },
  panelValue: {
    marginLeft: 5,
    marginBottom: 10,
  },
  noSelectionText: {
    fontStyle: "italic",
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
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
  formContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#000",
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  scanButton: {
    padding: 8,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    marginBottom: 20,
  },
  pageTitle: {
    fontWeight: "bold",
    fontSize: 20,
    verticalAlign: "middle",
    color: "#000",
  },
  bottomButtons: {
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  possibleDiscrepancyBadge: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    position: "absolute",
    right: -5,
    top: -5,
    paddingHorizontal: 5,
  },
  possibleDiscrepancyBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  forbiddenContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  unidText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  airTransportText: {
    fontSize: 20,
    color: "#000",
    marginTop: 5,
  },
  forbiddenText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginTop: 15,
    marginBottom: 15,
  },
  startOverButton: {
    marginTop: 10,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startOverButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  warningContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  warningText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cb9f1e",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  warningIcon: {
    marginTop: 15,
  },
  forbiddenIcon: {
    marginTop: 0,
  },
  materialDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 45,
    padding: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  materialDetail: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  flex1: { flex: 1 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    zIndex: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#000",
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
  technicalNameContainer: {
    flex: 2,
    marginLeft: 50,
  },
  technicalNameContainerWithoutPG: {
    flex: 2,
    marginTop: 10,
  },
  technicalNameLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  technicalNameInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "50%",
  },
  selectedRow: {
    backgroundColor: "#cce5ff",
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 20,
  },
  picker: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    width: "70%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    marginLeft: 10,
  },
  tableWrapper: {
    marginBottom: 30,
  },
  resultsCounter: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
    marginLeft: 4,
  },
  tableContainer: {
    maxHeight: 300,
    position: "relative",
    backgroundColor: "#f7fafd",
    borderWidth: 1,
    borderColor: "#b0b0b0",
    borderRadius: 5,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 30,
  },
  keyboardContainer: {
    flex: 1,
  },
  flashPointContainer: {
    flex: 2,
    marginTop: 10,
  },
  flashPointLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  flashPointInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flashPointInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "50%",
    color: "#000",
  },
  unitButtonContainer: {
    flexDirection: "row",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  activeUnitButton: {
    backgroundColor: "#007bff",
  },
  unitButtonText: {
    fontSize: 16,
    color: "#333",
  },
  activeUnitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  flashPointHelpText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  explosiveInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    width: "100%",
  },
  packingGroupContainer: {
    flex: 1,
    marginRight: 16,
    maxWidth: "48%",
  },
  grandfatheredContainer: {
    flex: 1,
    maxWidth: "48%",
  },
  buttonGroupRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  radioButton: {
    borderColor: colors.blue,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 12,
    minWidth: 80,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: colors.blue,
  },
  radioButtonText: {
    color: colors.blue,
    fontWeight: "600",
  },
  radioButtonTextSelected: {
    color: "#ffffff",
  },
});
