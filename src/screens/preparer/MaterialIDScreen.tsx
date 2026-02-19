import { A6_15TechnicalNames } from "../../../server/data/technicalNames";
import isHazardousWaste from "../../../server/hazardousWaste/isHazardousWaste";
import { informativeSpecialProvisionsMap } from "../../../server/informativeStatements/informativeStatements";
import { hazProContextLookup } from "../../../server/lookupFunctions/hazProContextLookup";
import { specialProvisionsMap } from "../../../server/lookupFunctions/specialProvisions";
import isOrganicPeroxide from "../../../server/organicPeroxides/isOrganicPeroxide";
import {
  aCodeLabelingModifiers,
  numericSpecialProvisionsLabelingModifiers,
} from "../../../server/workflowModifiers/labelingModifiers";
import { numericSpecialProvisionsSDDGAndPackagingModifiers } from "../../../server/workflowModifiers/packagingAndSDDGModifiers";
import {
  aCodePackagingModifiers,
  nCodePackagingModifiers,
} from "../../../server/workflowModifiers/packagingModifiers";
import {
  aCodePassengerEligibilityModifiers,
  pCodePassengerEligibilityModifiers,
} from "../../../server/workflowModifiers/passengerEligibilityModifiers";
import {
  aCodeSDDGModifiers,
  numericSpecialProvisionsSDDGModifiers,
} from "../../../server/workflowModifiers/SDDGModifiers";
import { useHazProStore } from "@/stores/useHazProStore";
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
} from "@/hazardousMaterials/hazardousMaterialsList";

// Import new utilities
import { filterMatchingKeys } from "@/utils/materialId/specialProvisionsUtils";
import { getA6Modifiers } from "@/utils/materialId/a6ParagraphHandlers";
import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
} from "@/utils/materialId/temperatureConversion";

// Import theme tokens
import { colors, spacing, borderRadius, typography } from "@/components/ui";

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
    setSelectedMaterial(null);
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
          (material: HazardousMaterialItem) =>
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

  /**
   * Applies A6 workflow modifiers based on packaging paragraph.
   * Uses the getA6Modifiers utility to consolidate repeated conditionals.
   */
  const applyA6WorkflowModifiers = (packagingParagraph: string | undefined) => {
    if (!packagingParagraph) return;

    // Check each A6 paragraph type using the utility
    const a6Types = ['A6.4.', 'A6.5.', 'A6.6.', 'A6.9.', 'A6.15.'];

    for (const a6Type of a6Types) {
      if (packagingParagraph.indexOf(a6Type) !== -1) {
        // Convert A6.X. format to A6.X for lookup
        const lookupKey = a6Type.slice(0, -1); // Remove trailing dot
        const modifiers = getA6Modifiers(lookupKey);

        if (modifiers && store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
          store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeWorkflowModifiers =
            modifiers.workflowModifiersDocumentNodes;

          // A6.15 also has informative statements
          if (lookupKey === 'A6.15') {
            store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.documentNodeInformativeStatements =
              modifiers.informativeStatementsDocumentNodes;
          }
        }
        break;
      }
    }
  };

  /**
   * Consolidated workflow modifiers lookup object.
   */
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

  /**
   * Processes special provisions for a material and updates the store.
   */
  const processSpecialProvisions = (specialProvision: string | undefined) => {
    const specialProvisionsArray = specialProvision
      ? specialProvision.split(", ").map(sp => sp.trim())
      : [];

    // Use imported filterMatchingKeys utility
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

    const workflowModifiersMap = filterMatchingKeys(
      allWorkflowModifiers,
      specialProvisionsArray
    );
    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsWorkflowModifiers =
        workflowModifiersMap;
    }
  };

  /**
   * Resets acknowledgement flags in the store.
   */
  const resetAcknowledgements = () => {
    if (store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
        false;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.informativeStatementsAcknowledged =
        false;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged =
        false;
    }
  };

  /**
   * Updates physical state and packaging type in the store.
   */
  const updatePhysicalState = (material: HazardousMaterialItem) => {
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
  };

  const resetSpecialAuthorizationState = (
    packingInstructionValue?: string
  ) => {
    store.hazProPreparerContext.usesCoeCertification = false;
    store.hazProPreparerContext.usesCaaCertification = false;
    store.hazProPreparerContext.usesDotSpPermit = false;
    store.hazProPreparerContext.specialAuthorizationType = null;
    store.hazProPreparerContext.specialAuthorizationReference = null;
    store.hazProPreparerContext.specialAuthorizationAttested = false;
    store.hazProPreparerContext.specialAuthorizationPackingDescription = null;
    store.hazProPreparerContext.specialAuthorizationQuantityAndTypeOfPacking =
      null;
    store.hazProPreparerContext.packingInstruction =
      packingInstructionValue ||
      store.hazProPreparerContext.hazardousMaterial?.packagingParagraph ||
      null;
  };

  const handleMaterialSelect = (material: HazardousMaterialItem) => {
    setSelectedMaterial(material);

    // Deep clone the material object to avoid Valtio proxy issues with frozen/sealed objects
    store.hazProPreparerContext.hazardousMaterial = JSON.parse(JSON.stringify(material));
    store.hazProPreparerContext.allowablePackingGroups = material.packingGroup;
    resetSpecialAuthorizationState(material.packagingParagraph);

    if (material.packingGroup.split(" ").length > 1) {
      return;
    }

    processSpecialProvisions(material.specialProvision);
    resetAcknowledgements();
    updatePhysicalState(material);
    applyA6WorkflowModifiers(material.packagingParagraph);
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

    resetSpecialAuthorizationState(packagingParagraph);

    processSpecialProvisions(specialProvisions);
    resetAcknowledgements();
    updatePhysicalState(selectedMaterial);
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
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchInputChange}
          />
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="scan-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        {renderTable && forbiddenCondition && (
          <View style={styles.tableWrapper}>
            <Text style={styles.resultsCounter}>
              Showing {filteredMaterials.length} matching material(s)
            </Text>

            <View style={styles.tableContainer}>
              <FlatList
                data={selectedMaterial ? filteredMaterials.filter(
                  (m) => m.unid === selectedMaterial.unid && m.properShippingName === selectedMaterial.properShippingName
                ) : filteredMaterials}
                keyExtractor={(item: HazardousMaterialItem) =>
                  `${item.unid}-${item.properShippingName}-${item.details}`
                }
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={true}
                ListHeaderComponent={
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerText, styles.flex1]}>{`UN/ID\nNumber`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>{`PSN/\nDescription`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>{`Hazard Class/\nDiv`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>{`Subsidiary\nRisk`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>{`Packing\nGroup`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>{`Special\nProvision`}</Text>
                    <Text style={[styles.headerText, styles.flex1]}>{`Packaging\nParagraph`}</Text>
                  </View>
                }
                renderItem={({ item }: { item: HazardousMaterialItem }) => {
                  const isSelected =
                    `${selectedMaterial?.unid}-${selectedMaterial?.properShippingName}` ===
                    `${item.unid}-${item.properShippingName}`;
                  return (
                    <TouchableOpacity
                      style={[styles.resultItem, isSelected && styles.selectedRow]}
                      onPress={() => handleMaterialSelect(item)}
                    >
                      <ListItem containerStyle={{ backgroundColor: isSelected ? colors.infoLight : colors.surface }}>
                        <ListItem.Content>
                          <View style={styles.listItemRow}>
                            <Text style={styles.columnText}>{item.unid}</Text>
                            <Text style={styles.columnText}>{item.properShippingName}</Text>
                            <Text style={styles.columnText}>{item.hazclassDiv}</Text>
                            <Text style={styles.columnText}>{item.subsidiaryRisk.split(" ").join("\n")}</Text>
                            <Text style={styles.columnText}>{item.packingGroup.split(" ").join("\n")}</Text>
                            <Text style={styles.columnText}>
                              {(item?.specialProvision?.match(/([A-Z0-9]+(?:, ?[A-Z0-9]+)*)/g) || []).join("\n")}
                            </Text>
                            <Text style={styles.columnText}>{item.packagingParagraph.split(" ").join("\n")}</Text>
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Select the packing group applicable to your material
              </Text>
              <Picker
                selectedValue={selectedPackingGroup}
                onValueChange={handlePackingGroupSelection}
                style={styles.picker}
                dropdownIconColor={colors.textPrimary}
              >
                <Picker.Item label="Select the packing group" value="" enabled={false} color={colors.textSecondary} />
                {hasMoreThanOnePackingGroup &&
                  selectedMaterial.packingGroup
                    .split(" ")
                    .map((group: string, index: number) => (
                      <Picker.Item key={index} label={group} value={group} color={colors.textPrimary} />
                    ))}
              </Picker>
            </View>
          )}
          {isClassOne && (
            <View style={styles.explosiveInputsRow}>
              <View style={styles.packingGroupContainer}>
                <Text style={styles.inputLabel}>Select Packing Group</Text>
                <Picker
                  selectedValue={selectedPackingGroup}
                  onValueChange={handlePackingGroupSelection}
                  style={styles.picker}
                  dropdownIconColor={colors.textPrimary}
                >
                  <Picker.Item label="Select the packing group" value="" enabled={false} color={colors.textSecondary} />
                  <Picker.Item key="I" label="I" value="I" color={colors.textPrimary} />
                  <Picker.Item key="II" label="II" value="II" color={colors.textPrimary} />
                </Picker>
              </View>

              <View style={styles.grandfatheredContainer}>
                <Text style={styles.inputLabel}>Packaged before Jan 1990?</Text>
                <View style={styles.buttonGroupRow}>
                  <TouchableOpacity
                    style={[styles.radioButton, grandfathered === true && styles.radioButtonSelected]}
                    onPress={() => setGrandfathered(true)}
                  >
                    <Text style={[styles.radioButtonText, grandfathered === true && styles.radioButtonTextSelected]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioButton, grandfathered === false && styles.radioButtonSelected]}
                    onPress={() => setGrandfathered(false)}
                  >
                    <Text style={[styles.radioButtonText, grandfathered === false && styles.radioButtonTextSelected]}>
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
              <View style={[styles.technicalNameContainer, { position: "relative" }]}>
                <Text style={styles.inputLabel}>Technical Name</Text>
                <Picker
                  selectedValue={selectedTechnicalName}
                  onValueChange={value => {
                    setSelectedTechnicalName(value);
                    store.hazProPreparerContext.technicalName = value;
                  }}
                  style={styles.picker}
                  dropdownIconColor={colors.textPrimary}
                >
                  <Picker.Item label="Select technical name" value="" enabled={false} color={colors.textSecondary} />
                  {A6_15TechnicalNames.map((name, index) => (
                    <Picker.Item key={index} label={name} value={name} color={colors.textPrimary} />
                  ))}
                </Picker>
              </View>
            )}

          {selectedMaterial?.isTechnicalNameRequired &&
            selectedMaterial?.packagingParagraph &&
            !(selectedMaterial.packagingParagraph.indexOf("A6.15.") !== -1) && (
              <View style={[styles.technicalNameContainerWithoutPG, { position: "relative" }]}>
                <Text style={styles.inputLabel}>Technical Name</Text>
                <TextInput
                  style={styles.technicalNameInput}
                  placeholder="Enter technical name"
                  value={state.hazProPreparerContext.technicalName || ""}
                  onChangeText={text => (store.hazProPreparerContext.technicalName = text)}
                />
              </View>
            )}
          {selectedMaterial && selectedMaterial.hazclassDiv.startsWith("3") && (
            <View style={styles.flashPointContainer}>
              <Text style={styles.inputLabel}>Flash Point</Text>
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
                    style={[styles.unitButton, flashPointUnit === "celsius" && styles.activeUnitButton]}
                    onPress={() => handleFlashPointUnitChange("celsius")}
                  >
                    <Text style={[styles.unitButtonText, flashPointUnit === "celsius" && styles.activeUnitButtonText]}>
                      C
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.unitButton, flashPointUnit === "fahrenheit" && styles.activeUnitButton]}
                    onPress={() => handleFlashPointUnitChange("fahrenheit")}
                  >
                    <Text style={[styles.unitButtonText, flashPointUnit === "fahrenheit" && styles.activeUnitButtonText]}>
                      F
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.flashPointHelpText}>
                {flashPointUnit === "fahrenheit"
                  ? flashPointValue !== "" && !isNaN(parseFloat(flashPointValue))
                    ? `Equivalent to ${fahrenheitToCelsius(parseFloat(flashPointValue)).toFixed(2)}C`
                    : "Enter the flash point temperature"
                  : flashPointValue !== "" && !isNaN(parseFloat(flashPointValue))
                  ? `Equivalent to ${celsiusToFahrenheit(parseFloat(flashPointValue)).toFixed(2)}F`
                  : "Enter the flash point temperature"}
              </Text>
            </View>
          )}
        </View>
        {(isOrganic || isWaste) && (
          <View style={styles.warningContainer}>
            <Text style={styles.unidText}>{selectedMaterial?.unid}</Text>
            <Text style={styles.unidText}>{selectedMaterial?.properShippingName}</Text>
            <Text style={styles.airTransportText}>Air Transportation</Text>
            <MaterialCommunityIcons style={styles.warningIcon} name="alert-circle" size={60} color={colors.warning} />
            <Text style={styles.warningText}>
              {isOrganic
                ? "Unfortunately, organic peroxides are not currently supported for preparation in HazPro."
                : "Unfortunately, hazardous waste is not currently supported for preparation in HazPro."}
            </Text>
            <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
              <Text style={styles.startOverButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedMaterial?.packagingParagraph === "FORBIDDEN" && (
          <View style={styles.forbiddenContainer}>
            <Text style={styles.unidText}>{selectedMaterial?.unid}</Text>
            <Text style={styles.unidText}>{selectedMaterial?.properShippingName}</Text>
            <Text style={styles.airTransportText}>Air Transportation</Text>
            <Text style={styles.forbiddenText}>FORBIDDEN SUBSTANCE</Text>
            <MaterialCommunityIcons style={styles.forbiddenIcon} name="close-circle" size={60} color={colors.error} />
            <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
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
            style={[styles.continueButton, isNextDisabled && styles.disabledButton]}
            onPress={() => {
              if (isClassOne) {
                if (grandfathered) {
                  navigation.navigate("ExplosiveDetailsWizard");
                } else {
                  store.hazProPreparerContext.completedSubsteps = ["MaterialID"];
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
  // Layout
  keyboardContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginLeft: spacing.xs,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.md,
    marginLeft: spacing.md,
  },

  // Title
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: spacing.md,
    marginBottom: spacing.xl,
  },
  pageTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.textPrimary,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  scanButton: {
    padding: spacing.sm,
  },

  // Table
  tableWrapper: {
    marginBottom: spacing.xxl,
  },
  resultsCounter: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  tableContainer: {
    maxHeight: 300,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: spacing.sm,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
    zIndex: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: colors.textPrimary,
  },
  flex1: { flex: 1 },
  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnText: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    color: colors.textPrimary,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedRow: {
    backgroundColor: colors.infoLight,
  },

  // Inputs
  inputContainer: {
    flex: 1,
    marginRight: spacing.md,
    marginTop: spacing.xl,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  picker: {
    height: 55,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    width: "70%",
    color: colors.textPrimary,
  },
  technicalNameContainer: {
    flex: 2,
    marginLeft: 50,
  },
  technicalNameContainerWithoutPG: {
    flex: 2,
    marginTop: spacing.md,
  },
  technicalNameInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
    width: "50%",
  },

  // Explosive inputs
  explosiveInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
    width: "100%",
  },
  packingGroupContainer: {
    flex: 1,
    marginRight: spacing.lg,
    maxWidth: "48%",
  },
  grandfatheredContainer: {
    flex: 1,
    maxWidth: "48%",
  },
  buttonGroupRow: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  radioButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
    minWidth: 80,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: colors.primary,
  },
  radioButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  radioButtonTextSelected: {
    color: colors.white,
  },

  // Flash point
  flashPointContainer: {
    flex: 2,
    marginTop: spacing.md,
  },
  flashPointInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flashPointInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
    width: "50%",
    color: colors.textPrimary,
  },
  unitButtonContainer: {
    flexDirection: "row",
    marginLeft: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  unitButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  activeUnitButton: {
    backgroundColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  activeUnitButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  flashPointHelpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },

  // Warning/Forbidden states
  warningContainer: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  warningText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.warning,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  warningIcon: {
    marginTop: spacing.lg,
  },
  forbiddenContainer: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  forbiddenText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.error,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  forbiddenIcon: {
    marginTop: 0,
  },
  unidText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  airTransportText: {
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  startOverButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
  },
  startOverButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Action buttons
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
