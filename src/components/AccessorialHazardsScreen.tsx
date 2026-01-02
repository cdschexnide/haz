import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "@/hazardousMaterials/hazardousMaterialsList";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { AccessorialHazard } from "../../types";
import { convertVolume } from "@/utils/unitConversions";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
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

const batteryOptions: HazardousMaterialItem[] = [
  {
    isFixed: "",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN3028",
    properShippingName:
      "BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID, electric storage",
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
    unid: "UN2794",
    properShippingName: "BATTERIES, WET, FILLED WITH ACID, electric storage",
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
    unid: "UN2795",
    properShippingName: "BATTERIES, WET, FILLED WITH ALKALI, electric storage",
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
    unid: "UN2800",
    properShippingName: "BATTERIES, WET, NON-SPILLABLE, electric storage",
    hazclassDiv: "8",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P5, A67",
    packagingParagraph: "A12.4.",
  },
];

const AccessorialHazardsScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment, isLoading, error } =
    useHazProStore();
  const { navigate } = useNavigationRef();

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [batteryMaterial, setBatteryMaterial] =
    useState<HazardousMaterialItem>();
  const [batteryQty, setBatteryQty] = useState("");
  const [selectedOtherItems, setSelectedOtherItems] = useState<
    AccessorialHazard[]
  >([]);
  const [fireExtinguisherMaterial, setFireExtinguisherMaterial] =
    useState<HazardousMaterialItem>();
  const [fireExtQty, setFireExtQty] = useState("");
  const [starterFluidMaterial, setStarterFluidMaterial] =
    useState<HazardousMaterialItem>();
  const [starterVolume, setStarterVolume] = useState("");
  const [starterUnit, setStarterUnit] = useState("liters");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleHazard = (hazard: string) => {
    setSelectedHazards(prev =>
      prev.includes(hazard) ? prev.filter(h => h !== hazard) : [...prev, hazard]
    );

    if (hazard === "Batteries") {
      if (!selectedHazards.includes("Batteries")) {
        if (store.hazProPreparerContext.engineOrMachineryPreparationData) {
          store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards =
            {
              ...store.hazProPreparerContext.engineOrMachineryPreparationData
                .accessorialHazards,
              batteries: {
                accessorialHazardousMaterialIdentification: null,
                quantity: "",
              },
            };
        }
      }
    } else if (hazard === "Fire Extinguisher(s)") {
      if (!selectedHazards.includes("Fire Extinguisher(s)")) {
        const fireExtinguisherMaterial: HazardousMaterialItem = {
          isFixed: "",
          isDomesticShipment: false,
          isTechnicalNameRequired: false,
          unid: "UN1044",
          properShippingName:
            "FIRE EXTINGUISHERS containing compressed or liquefied gas",
          details: "",
          hazclassDiv: "2.2",
          subsidiaryRisk: "",
          packingGroup: "",
          specialProvision: "P5, 110",
          packagingParagraph: "A6.7.",
        };
        if (store.hazProPreparerContext.engineOrMachineryPreparationData) {
          store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards =
            {
              ...store.hazProPreparerContext.engineOrMachineryPreparationData
                .accessorialHazards,
              fireExtinguishers: {
                accessorialHazardousMaterialIdentification:
                  fireExtinguisherMaterial,
                quantity: "",
              },
            };
        }
      }
    } else if (hazard === "Start Fluid") {
      if (!selectedHazards.includes("Start Fluid")) {
        const starterFluidMaterial: HazardousMaterialItem = {
          isFixed: "",
          isDomesticShipment: false,
          isTechnicalNameRequired: false,
          unid: "UN1950",
          properShippingName: "AEROSOLS, FLAMMABLE",
          hazclassDiv: "2.1",
          subsidiaryRisk: "",
          packingGroup: "",
          specialProvision: "P5",
          packagingParagraph: "A6.2.",
        };
        if (store.hazProPreparerContext.engineOrMachineryPreparationData) {
          store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards =
            {
              ...store.hazProPreparerContext.engineOrMachineryPreparationData
                .accessorialHazards,
              starterFluid: {
                accessorialHazardousMaterialIdentification:
                  starterFluidMaterial,
                volume: {
                  liters: null,
                  gallons: null,
                },
              },
            };
        }
      }
    }
  };

  useEffect(() => {
    if (
      batteryMaterial &&
      store.hazProPreparerContext.engineOrMachineryPreparationData
        ?.accessorialHazards?.batteries
    ) {
      store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards.batteries.accessorialHazardousMaterialIdentification =
        batteryMaterial;
    }
  }, [batteryMaterial]);

  useEffect(() => {
    if (
      selectedHazards.includes("Batteries") &&
      store.hazProPreparerContext.engineOrMachineryPreparationData
        ?.accessorialHazards?.batteries
    ) {
      store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards.batteries.quantity =
        batteryQty;
    }
  }, [batteryQty]);

  useEffect(() => {
    if (
      selectedHazards.includes("Fire Extinguisher(s)") &&
      store.hazProPreparerContext.engineOrMachineryPreparationData
        ?.accessorialHazards?.fireExtinguishers
    ) {
      store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards.fireExtinguishers.quantity =
        fireExtQty;
    }
  }, [fireExtQty]);

  useEffect(() => {
    if (
      selectedHazards.includes("Start Fluid") &&
      starterFluidMaterial &&
      store.hazProPreparerContext.engineOrMachineryPreparationData
        ?.accessorialHazards?.starterFluid
    ) {
      store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards.starterFluid.volume =
        convertVolume(starterVolume, starterUnit as "liters" | "gallons");
    }
  }, [starterVolume, starterUnit]);

  const filteredMaterials: HazardousMaterialItem[] =
    searchQuery.length >= 3
      ? hazardousMaterialsList.filter(
          (material: HazardousMaterialItem) =>
            material.unid.includes(searchQuery) ||
            material.properShippingName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : [];

  const isTablet = Dimensions.get("window").width > 600;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainCard}>
            <Text style={styles.title}>
              Identify the Accessorial Hazards for this Vehicle
            </Text>

            <View style={styles.bannerWarning}>
              <Ionicons
                name="warning"
                size={24}
                color="#fdd14f"
                style={styles.bannerIcon}
              />
              <Text style={styles.bannerText}>
                Accessorial Hazard - a distinct and separate hazardous item that
                is a component or integral part of the primary hazard. This does
                NOT include additional loads or items added to the vehicle
                storage or space within the vehicle.
              </Text>
            </View>

            <View style={styles.chipRow}>
              {[
                "Batteries",
                "Fire Extinguisher(s)",
                "Start Fluid",
                "Other",
              ].map(hazard => (
                <TouchableOpacity
                  key={hazard}
                  style={[
                    styles.chip,
                    selectedHazards.includes(hazard) && styles.chipSelected,
                  ]}
                  onPress={() => toggleHazard(hazard)}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: selectedHazards.includes(hazard),
                  }}
                  accessibilityLabel={`${hazard} hazard selection`}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedHazards.includes(hazard) &&
                        styles.chipTextSelected,
                    ]}
                  >
                    {hazard}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedHazards.includes("Batteries") && (
              <View style={styles.cardSubsection}>
                <Text style={styles.cardHeader}>Battery Details</Text>
                <View
                  style={isTablet ? styles.formRowTablet : styles.formRowPhone}
                >
                  <View style={styles.formControl}>
                    <Text style={styles.formLabel}>Battery Quantity</Text>
                    <TextInput
                      style={[
                        styles.formInput,
                        !batteryQty && styles.formInputError,
                      ]}
                      keyboardType="numeric"
                      value={batteryQty}
                      onChangeText={setBatteryQty}
                      placeholder="e.g. 4"
                      accessibilityLabel="Battery quantity input"
                    />
                  </View>
                  <View style={styles.formControl}>
                    <Text style={styles.formLabel}>Battery Type</Text>
                    <Picker
                      selectedValue={
                        `${batteryMaterial?.unid} - ${batteryMaterial?.properShippingName}` ||
                        ""
                      }
                      onValueChange={selection => {
                        const [unid, properShippingName] =
                          selection.split(" - ");
                        const hazardousMaterial = hazardousMaterialsList.find(
                          material =>
                            material.unid === unid &&
                            material.properShippingName === properShippingName
                        );
                        setBatteryMaterial(hazardousMaterial);
                      }}
                      style={styles.formPicker}
                    >
                      <Picker.Item
                        label="Select Type"
                        value=""
                        enabled={false}
                      />
                      {batteryOptions.map(b => (
                        <Picker.Item
                          key={b.unid}
                          label={`${b.properShippingName}`}
                          value={`${b.unid} - ${b.properShippingName}`}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            )}

            {selectedHazards.includes("Fire Extinguisher(s)") && (
              <View style={styles.cardSubsection}>
                <Text style={styles.cardHeader}>Fire Extinguisher(s)</Text>
                <View style={styles.formControl}>
                  <Text style={styles.formLabel}>Quantity</Text>
                  <View style={styles.formInputWithIcon}>
                    <Ionicons name="flame" size={20} color="#6c757d" />
                    <TextInput
                      style={styles.formInputIconed}
                      keyboardType="numeric"
                      value={fireExtQty}
                      onChangeText={quantity => {
                        const hazardousMaterial: HazardousMaterialItem = {
                          isFixed: "",
                          isDomesticShipment: false,
                          isTechnicalNameRequired: false,
                          unid: "UN1044",
                          properShippingName:
                            "FIRE EXTINGUISHERS containing compressed or liquefied gas",
                          details: "",
                          hazclassDiv: "2.2",
                          subsidiaryRisk: "",
                          packingGroup: "",
                          specialProvision: "P5, 110",
                          packagingParagraph: "A6.7.",
                        };
                        setFireExtinguisherMaterial(hazardousMaterial);
                        setFireExtQty(quantity);
                      }}
                      placeholder="Enter quantity"
                      accessibilityLabel="Fire extinguisher quantity input"
                    />
                  </View>
                </View>
              </View>
            )}

            {selectedHazards.includes("Start Fluid") && (
              <View style={styles.cardSubsection}>
                <Text style={styles.cardHeader}>Starter Fluid Volume</Text>
                <View style={styles.formRowSideBySide}>
                  <View style={styles.formControl}>
                    <Text style={styles.formLabel}>Volume</Text>
                    <TextInput
                      style={styles.formInput}
                      keyboardType="numeric"
                      value={starterVolume}
                      onChangeText={volumeEntered => {
                        const hazardousMaterial: HazardousMaterialItem = {
                          isFixed: "",
                          isDomesticShipment: false,
                          isTechnicalNameRequired: false,
                          unid: "UN1950",
                          properShippingName: "AEROSOLS, FLAMMABLE",
                          hazclassDiv: "2.1",
                          subsidiaryRisk: "",
                          packingGroup: "",
                          specialProvision: "P5",
                          packagingParagraph: "A6.2.",
                        };
                        setStarterFluidMaterial(hazardousMaterial);
                        setStarterVolume(volumeEntered);
                      }}
                      placeholder="Volume"
                      accessibilityLabel="Starter fluid volume input"
                    />
                  </View>
                  <View style={styles.formControl}>
                    <Text style={styles.formLabel}>Unit</Text>
                    <View style={styles.segmentedControl}>
                      <TouchableOpacity
                        style={[
                          styles.segmentButton,
                          styles.segmentButtonLeft,
                          starterUnit === "liters" &&
                            styles.segmentButtonSelected,
                        ]}
                        onPress={() => setStarterUnit("liters")}
                        accessibilityRole="radio"
                        accessibilityState={{
                          checked: starterUnit === "liters",
                        }}
                      >
                        <Text
                          style={[
                            styles.segmentButtonText,
                            starterUnit === "liters" &&
                              styles.segmentButtonTextSelected,
                          ]}
                        >
                          Liters
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentButton,
                          styles.segmentButtonRight,
                          starterUnit === "gallons" &&
                            styles.segmentButtonSelected,
                        ]}
                        onPress={() => setStarterUnit("gallons")}
                        accessibilityRole="radio"
                        accessibilityState={{
                          checked: starterUnit === "gallons",
                        }}
                      >
                        <Text
                          style={[
                            styles.segmentButtonText,
                            starterUnit === "gallons" &&
                              styles.segmentButtonTextSelected,
                          ]}
                        >
                          Gallons
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {selectedHazards.includes("Other") && (
              <View style={styles.cardSubsection}>
                <Text style={styles.cardHeader}>Other Accessorial Hazards</Text>

                {!showSearch ? (
                  <TouchableOpacity
                    style={styles.addButtonOutlined}
                    onPress={() => setShowSearch(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Add another hazard"
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color={colors.white}
                    />
                    <Text style={styles.addButtonText}>Add hazard</Text>
                  </TouchableOpacity>
                ) : (
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
                        setShowSearch(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Cancel search"
                    >
                      <Ionicons name="close-circle" size={22} color="#6c757d" />
                    </TouchableOpacity>
                  </View>
                )}

                {searchQuery.length >= 3 && (
                  <View style={styles.searchResultsTable}>
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

                    <ScrollView
                      style={styles.tableScrollContainer}
                      nestedScrollEnabled={true}
                    >
                      {filteredMaterials.map((item, index) => (
                        <TouchableOpacity
                          key={`${item.unid}-${item.properShippingName}-${item.details}-${index}`}
                          style={styles.tableRow}
                          onPress={() => {
                            if (
                              !selectedOtherItems.some(
                                selected =>
                                  selected.hazardousMaterial.unid === item.unid
                              )
                            ) {
                              setSelectedOtherItems(prev => [
                                ...prev,
                                { hazardousMaterial: item },
                              ]);
                            }
                            setSearchQuery("");
                            setShowSearch(false);
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
                      ))}
                    </ScrollView>
                  </View>
                )}

                {selectedOtherItems.length > 0 && (
                  <View style={styles.selectedChipsContainer}>
                    {selectedOtherItems.map((item, index) => (
                      <View
                        key={item.hazardousMaterial.unid}
                        style={styles.selectedChip}
                      >
                        <Text style={styles.selectedChipText}>
                          {`${item.hazardousMaterial.unid} - ${item.hazardousMaterial.properShippingName}`}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            const updated = [...selectedOtherItems];
                            updated.splice(index, 1);
                            setSelectedOtherItems(updated);
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${item.hazardousMaterial.properShippingName}`}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#6c757d"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              store.hazProPreparerContext.completedSubsteps =
                completedSubsteps.slice(0, -1);
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={async () => {
              // dispatch({
              //   type: "SAVE_SHIPMENT",
              //   payload: {
              //     id: Date.now().toString(),
              //     status: "in-progress",
              //   },
              // });
              // navigate("PreparerHomeStack", { screen: "PreparerHome" });
              try {
                await saveCurrentShipment("in-progress");
                navigation.navigate("PreparerHomeStack", {
                  screen: "PreparerHome",
                });
              } catch (err) {
                console.log(
                  "Save failed, but error is handled by context:",
                  err
                );
              }
            }}
          >
            <Text style={styles.buttonText}>Save & Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              if (
                state.hazProPreparerContext.hazardousMaterial?.unid === "UN3166"
              ) {
                store.hazProPreparerContext.un3166Details = {
                  ...store.hazProPreparerContext.un3166Details,
                  accessorialHazards: {
                    batteries: selectedHazards.includes("Batteries")
                      ? {
                          accessorialHazardousMaterialIdentification:
                            batteryMaterial,
                          quantity: batteryQty,
                        }
                      : null,
                    fireExtinguishers: selectedHazards.includes(
                      "Fire Extinguisher(s)"
                    )
                      ? {
                          accessorialHazardousMaterialIdentification:
                            fireExtinguisherMaterial,
                          quantity: fireExtQty,
                        }
                      : null,
                    starterFluid:
                      selectedHazards.includes("Start Fluid") &&
                      starterFluidMaterial
                        ? {
                            accessorialHazardousMaterialIdentification:
                              starterFluidMaterial,
                            volume: convertVolume(
                              starterVolume,
                              starterUnit as "liters" | "gallons"
                            ),
                          }
                        : null,
                    other: selectedHazards.includes("Other")
                      ? selectedOtherItems
                      : [],
                  },
                };
                store.hazProPreparerContext.completedSubsteps = [
                  ...completedSubsteps,
                  "AccessorialHazardsScreen",
                ];
              }
              const unids = ["UN3528", "UN3529", "UN3530"];
              if (
                state.hazProPreparerContext.hazardousMaterial?.unid &&
                unids.includes(
                  state.hazProPreparerContext.hazardousMaterial?.unid
                )
              ) {
                if (
                  store.hazProPreparerContext.engineOrMachineryPreparationData
                ) {
                  store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards =
                    {
                      batteries: selectedHazards.includes("Batteries")
                        ? {
                            accessorialHazardousMaterialIdentification:
                              batteryMaterial,
                            quantity: batteryQty,
                          }
                        : null,
                      fireExtinguishers: selectedHazards.includes(
                        "Fire Extinguisher(s)"
                      )
                        ? {
                            accessorialHazardousMaterialIdentification:
                              fireExtinguisherMaterial,
                            quantity: fireExtQty,
                          }
                        : null,
                      starterFluid:
                        selectedHazards.includes("Start Fluid") &&
                        starterFluidMaterial
                          ? {
                              accessorialHazardousMaterialIdentification:
                                starterFluidMaterial,
                              volume: convertVolume(
                                starterVolume,
                                starterUnit as "liters" | "gallons"
                              ),
                            }
                          : null,
                      other: selectedHazards.includes("Other")
                        ? selectedOtherItems
                        : [],
                    };
                }
                store.hazProPreparerContext.completedSubsteps = [
                  ...completedSubsteps,
                  "AccessorialHazardsScreen",
                ];
              }
              if (selectedOtherItems.length > 0) {
                navigation.navigate("AccessorialQuantityEntry");
              } else {
                navigation.navigate("LabelingAndMarking");
              }
            }}
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
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
    paddingBottom: 160,
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
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#6C757D",
  },
  continueButton: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: colors.blue,
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
  mainCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "500",
    textAlign: "center",
    color: "#212529",
    marginBottom: 24,
  },
  bannerWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff4d6",
    borderLeftWidth: 4,
    borderLeftColor: "#fdd14f",
    padding: 12,
    marginBottom: 16,
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: "#6c757d",
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: "#ffffff",
  },
  chipSelected: {
    backgroundColor: colors.blue,
  },
  chipText: {
    fontSize: 14,
    color: colors.blue,
  },
  chipTextSelected: {
    color: "#ffffff",
  },
  cardSubsection: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
  },
  formRowPhone: {
    gap: 8,
  },
  formRowTablet: {
    flexDirection: "row",
    gap: 16,
  },
  formRowSideBySide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  formControl: {
    flex: 1,
    minWidth: 150,
  },
  formLabel: {
    fontSize: 14,
    color: "#212529",
    marginBottom: 8,
  },
  formInput: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  formInputError: {
    borderColor: "#dc3545",
  },
  formPicker: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
    color: "#212529",
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  formInputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  formInputIconed: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    marginLeft: 8,
  },
  segmentedControl: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  segmentButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: "#ced4da",
  },
  segmentButtonRight: {
    borderLeftWidth: 0,
  },
  segmentButtonSelected: {
    backgroundColor: colors.blue,
  },
  segmentButtonText: {
    fontSize: 16,
    color: "#212529",
  },
  segmentButtonTextSelected: {
    color: "#ffffff",
  },
  addButtonOutlined: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.blue,
    borderRadius: 6,
    marginBottom: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.white,
    fontWeight: "500",
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
    height: 55,
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
  tableColumn: {
    flex: 1,
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
  selectedChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  selectedChipText: {
    fontSize: 14,
    color: "#212529",
  },
  flex1: {
    flex: 1,
  },
});

export default AccessorialHazardsScreen;
