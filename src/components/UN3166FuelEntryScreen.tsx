import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import { useHazProStore } from "@/stores/useHazProStore";
import { HazardousMaterialItem, UN3166Tank } from "../../types";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";

const UN3166FuelEntryScreen = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();

  // ✅ NEW: Direct mutations replace dispatch pattern
  // No longer needed - using direct mutations
  const un3166Details = state.hazProPreparerContext.un3166Details;
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const shipment = state.hazProPreparerContext.shipment;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  // ✅ Direct mutations replace handleNestedPreparerContextFieldUpdate helper

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const [nomenclature, setNomenclature] = useState(
    un3166Details?.vehicleNomenclature ?? ""
  );
  const [quantity, setQuantity] = useState(un3166Details?.quantity ?? "");
  const [fuel, setFuel] = useState<HazardousMaterialItem | "Other" | null>(
    un3166Details?.fuel
  );
  const [mode, setMode] = useState(un3166Details?.fuelEntryMode ?? "");
  const [unit, setUnit] = useState<"liters" | "gallons">(
    un3166Details?.unit ?? "gallons"
  );
  const [amount, setAmount] = useState(un3166Details?.amount ?? "");
  const [tankSize, setTankSize] = useState(un3166Details?.tankSize ?? "");
  const [tankFullness, setTankFullness] = useState(
    un3166Details?.tankFullness ?? ""
  );
  const [tankCount, setTankCount] = useState(
    un3166Details?.tankCount?.toString() ?? ""
  );
  const [multiTanks, setMultiTanks] = useState<UN3166Tank[]>(
    un3166Details?.multiTanks ?? []
  );
  const [customFuelMaterial, setCustomFuelMaterial] =
    useState<HazardousMaterialItem>();
  const [customFuelSearch, setCustomFuelSearch] = useState("");

  const pCode = useMemo(() => {
    const match = hazardousMaterial?.specialProvision?.match(/P[1-5]/);
    return match ? match[0] : "";
  }, [hazardousMaterial]);

  const title = `${hazardousMaterial?.unid} | ${hazardousMaterial?.properShippingName} | ${pCode} | ${hazardousMaterial?.packagingParagraph}`;

  const gasFuelOptions: HazardousMaterialItem[] = [
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1971",
      properShippingName: "NATURAL GAS, COMPRESSED",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P4",
      packagingParagraph: "A6.3., A6.5.",
    },
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1978",
      properShippingName: "PROPANE",
      details: "see also PETROLEUM GASES, LIQUEFIED",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P4",
      packagingParagraph: "A6.3., A6.6.",
    },
  ];
  const liquidFuelOptions: HazardousMaterialItem[] = [
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1203",
      properShippingName: "GASOLINE",
      details:
        "includes gasoline mixed with ethyl alcohol, with not more than 10 percent alcohol",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5, 177",
      packagingParagraph: "A7.2.",
    },
    {
      isFixed: "",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1202",
      properShippingName: "DIESEL FUEL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "III",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    },
  ];

  const fuelOptions =
    hazardousMaterial?.properShippingName === "VEHICLE, FLAMMABLE GAS POWERED"
      ? gasFuelOptions
      : liquidFuelOptions;

  const tankFullnessOptions = [
    "Drained/Not Purged",
    "1/4 Full",
    "1/2 Full",
    "3/4 Full",
    "Full",
  ];

  const filteredFuelMaterials = useMemo(() => {
    return customFuelSearch.length >= 3
      ? hazardousMaterialsList.filter(
          item =>
            item.properShippingName
              .toLowerCase()
              .includes(customFuelSearch.toLowerCase()) ||
            item.unid.includes(customFuelSearch)
        )
      : [];
  }, [customFuelSearch]);

  const showFullnessError = useMemo(() => {
    if (mode === "TankSize") {
      return tankFullness === "Full";
    }

    if (mode === "MultipleTanks") {
      return multiTanks.some(t => t.tankFullness === "Full");
    }

    return false;
  }, [mode, tankFullness, multiTanks]);

  const showThreeQuarterError = useMemo(() => {
    if (mode === "TankSize") {
      return (
        tankFullness === "3/4 Full" &&
        (!shipment?.isChapter3 || shipment?.isChapter3 === "No")
      );
    }

    if (mode === "MultipleTanks") {
      return multiTanks.some(
        t =>
          t.tankFullness === "3/4 Full" &&
          (!shipment?.isChapter3 || shipment?.isChapter3 === "No")
      );
    }

    return false;
  }, [mode, tankFullness, multiTanks, shipment?.isChapter3]);

  const isSaveEnabled =
    (nomenclature &&
      quantity &&
      fuel &&
      mode === "SpecificQuantity" &&
      amount) ||
    (mode === "TankSize" && tankSize && tankFullness) ||
    (mode === "MultipleTanks" &&
      multiTanks.every(t => t.amount || (t.tankSize && t.tankFullness)));

  useEffect(() => {
    if (mode === "MultipleTanks" && tankCount) {
      const count = parseInt(tankCount);
      if (!isNaN(count)) {
        setMultiTanks(
          Array.from(
            { length: count },
            (_, i) =>
              multiTanks[i] || {
                mode: "",
                amount: "",
                tankSize: "",
                tankFullness: "",
              }
          )
        );
      }
    }
  }, [tankCount]);

  const renderTankInputs = () => (
    <>
      <View style={styles.row}>
        <View style={styles.thirdInput}>
          <Text style={styles.label}>Tank Size</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={tankSize}
            onChangeText={setTankSize}
            placeholder="Tank Capacity"
          />
        </View>

        <View style={styles.thirdInput}>
          <Text style={styles.label}>Unit</Text>
          <Picker
            selectedValue={unit}
            onValueChange={setUnit}
            style={styles.picker}
            dropdownIconColor={"#000"}
          >
            <Picker.Item label="Liters" value="liters" />
            <Picker.Item label="Gallons" value="gallons" />
          </Picker>
        </View>

        <View style={styles.thirdInput}>
          <Text style={styles.label}>How Full?</Text>
          <Picker
            selectedValue={tankFullness}
            onValueChange={setTankFullness}
            style={[
              styles.picker,
              (showFullnessError || showThreeQuarterError) &&
                styles.pickerError,
            ]}
            dropdownIconColor={"#000"}
          >
            <Picker.Item label="Select fuel level" value="" enabled={false} />
            {tankFullnessOptions.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          {showFullnessError && (
            <Text style={styles.errorText}>Tank cannot be FULL.</Text>
          )}
          {showThreeQuarterError && (
            <Text style={styles.errorText}>
              3/4 Full is only permitted under Chapter 3 authorization.
            </Text>
          )}
        </View>
      </View>
    </>
  );

  const renderMultipleTanks = () => (
    <>
      <Text style={styles.label}>Number of Tanks</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={tankCount}
        onChangeText={setTankCount}
        placeholder="e.g. 2"
      />
      {multiTanks.map((tank, index) => {
        const isFull = tank.tankFullness === "Full";
        const isInvalidThreeQuarter =
          tank.tankFullness === "3/4 Full" && !shipment?.isChapter3;

        return (
          <View key={index} style={styles.tankGroup}>
            <Text style={styles.label}>Tank {index + 1} Entry Mode</Text>
            <View>
              <Picker
                selectedValue={tank.mode}
                onValueChange={val =>
                  setMultiTanks(prev =>
                    prev.map((t, i) => (i === index ? { ...t, mode: val } : t))
                  )
                }
                style={styles.picker}
                dropdownIconColor={"#000"}
              >
                <Picker.Item
                  label="Select tank entry mode"
                  value=""
                  enabled={false}
                />
                <Picker.Item
                  label="Specific Quantity"
                  value="SpecificQuantity"
                />
                <Picker.Item label="Tank Size" value="TankSize" />
              </Picker>
            </View>

            {tank.mode === "SpecificQuantity" ? (
              <>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={tank.amount}
                      onChangeText={val =>
                        setMultiTanks(prev =>
                          prev.map((t, i) =>
                            i === index ? { ...t, amount: val } : t
                          )
                        )
                      }
                      placeholder="Amount of fuel"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <View>
                      <Picker
                        selectedValue={unit}
                        onValueChange={setUnit}
                        style={styles.picker}
                        dropdownIconColor={"#000"}
                      >
                        <Picker.Item label="Liters" value="liters" />
                        <Picker.Item label="Gallons" value="gallons" />
                      </Picker>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.row}>
                  <View style={styles.thirdInput}>
                    <Text style={styles.label}>Tank Size</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={tank.tankSize}
                      onChangeText={val =>
                        setMultiTanks(prev =>
                          prev.map((t, i) =>
                            i === index ? { ...t, tankSize: val } : t
                          )
                        )
                      }
                      placeholder="Tank Capacity"
                    />
                  </View>

                  <View style={styles.thirdInput}>
                    <Text style={styles.label}>Unit</Text>
                    <View>
                      <Picker
                        selectedValue={unit}
                        onValueChange={setUnit}
                        style={styles.picker}
                        dropdownIconColor={"#000"}
                      >
                        <Picker.Item label="Liters" value="liters" />
                        <Picker.Item label="Gallons" value="gallons" />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.thirdInput}>
                    <Text style={styles.label}>How Full?</Text>
                    <View>
                      <Picker
                        selectedValue={tank.tankFullness}
                        onValueChange={val =>
                          setMultiTanks(prev =>
                            prev.map((t, i) =>
                              i === index ? { ...t, tankFullness: val } : t
                            )
                          )
                        }
                        style={[
                          styles.picker,
                          (isFull || isInvalidThreeQuarter) &&
                            styles.pickerError,
                        ]}
                        dropdownIconColor={"#000"}
                      >
                        <Picker.Item
                          label="Select tank fuel level"
                          value=""
                          enabled={false}
                        />
                        {tankFullnessOptions.map(option => (
                          <Picker.Item
                            key={option}
                            label={option}
                            value={option}
                          />
                        ))}
                      </Picker>
                    </View>
                    {(isFull || isInvalidThreeQuarter) && (
                      <View style={{ marginTop: 6 }}>
                        {isFull && (
                          <Text style={styles.errorText}>
                            Tank cannot be FULL.
                          </Text>
                        )}
                        {isInvalidThreeQuarter && (
                          <Text style={styles.errorText}>
                            3/4 Full is only permitted under Chapter 3
                            authorization.
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        );
      })}
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Vehicle Nomenclature</Text>
              <TextInput
                style={styles.input}
                value={nomenclature}
                onChangeText={setNomenclature}
                placeholder="e.g. M1008 or Humvee"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                keyboardType="numeric"
                onChangeText={setQuantity}
                placeholder="e.g. 2"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Fuel Type</Text>
              <View>
                <Picker
                  selectedValue={fuel}
                  onValueChange={setFuel}
                  style={styles.picker}
                  dropdownIconColor={"#000"}
                >
                  <Picker.Item
                    label="Select Fuel Type"
                    value=""
                    enabled={false}
                  />
                  {fuelOptions.map((type, index) => (
                    <Picker.Item
                      key={`${type.unid}-${type.properShippingName}-${index}`}
                      label={type.properShippingName}
                      value={type}
                    />
                  ))}
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Fuel Entry Mode</Text>
              <View>
                <Picker
                  selectedValue={mode}
                  onValueChange={setMode}
                  style={styles.picker}
                  dropdownIconColor={"#000"}
                >
                  <Picker.Item
                    label="Select Entry Mode"
                    value=""
                    enabled={false}
                  />
                  <Picker.Item
                    label="Specific Quantity"
                    value="SpecificQuantity"
                  />
                  <Picker.Item label="Tank Size" value="TankSize" />
                  <Picker.Item label="Multiple Tanks" value="MultipleTanks" />
                </Picker>
              </View>
            </View>
          </View>

          {fuel === "Other" && (
            <>
              <Text style={styles.label}>Search Other Fuel Type</Text>
              <TextInput
                style={styles.input}
                value={customFuelSearch}
                onChangeText={setCustomFuelSearch}
                placeholder="Search by UNID or name"
              />
              {filteredFuelMaterials.length > 0 && (
                <FlatList
                  data={filteredFuelMaterials}
                  keyExtractor={item => item.unid}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCustomFuelMaterial(item);
                        setFuel(item);
                        setCustomFuelSearch("");
                      }}
                    >
                      <View style={styles.selectedMaterialBox}>
                        <Text style={styles.selectedMaterialText}>
                          <Text style={styles.materialUnid}>{item.unid}</Text> —{" "}
                          {item.properShippingName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}

          {mode === "SpecificQuantity" && (
            <>
              <Text style={styles.label}>Fuel Amount</Text>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Amount of fuel"
                  />
                </View>
                <View style={styles.halfInput}>
                  <View>
                    <Picker
                      selectedValue={unit}
                      onValueChange={setUnit}
                      style={styles.picker}
                      dropdownIconColor={"#000"}
                    >
                      <Picker.Item label="Liters" value="liters" />
                      <Picker.Item label="Gallons" value="gallons" />
                    </Picker>
                  </View>
                </View>
              </View>
            </>
          )}
          {mode === "TankSize" && renderTankInputs()}
          {mode === "MultipleTanks" && renderMultipleTanks()}

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={styles.cancelButton}
              titleStyle={styles.cancelButtonText}
              onPress={() => {
                store.hazProPreparerContext.completedSubsteps =
                  completedSubsteps.slice(0, -1);
                navigation.goBack();
              }}
            />
            <Button
              title="Save & Continue"
              buttonStyle={
                isSaveEnabled ? styles.saveButton : styles.disabledSaveButton
              }
              titleStyle={styles.saveButtonText}
              disabled={
                !isSaveEnabled || showFullnessError || showThreeQuarterError
              }
              onPress={() => {
                store.hazProPreparerContext.un3166Details = {
                  vehicleNomenclature: nomenclature,
                  quantity: quantity,
                  fuel: fuel === "Other" ? customFuelMaterial : fuel,
                  fuelEntryMode: mode,
                  amount: mode === "SpecificQuantity" ? amount : undefined,
                  tankSize: mode === "TankSize" ? tankSize : undefined,
                  tankFullness: mode === "TankSize" ? tankFullness : undefined,
                  unit,
                  tankCount:
                    mode === "MultipleTanks" ? parseInt(tankCount) : undefined,
                  multiTanks: mode === "MultipleTanks" ? multiTanks : undefined,
                };
                store.hazProPreparerContext.completedSubsteps = [
                  ...completedSubsteps,
                  "UN3166FuelEntryScreen",
                ];
                navigation.navigate("AccessorialHazardsScreen");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UN3166FuelEntryScreen;

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    height: 55,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 55,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    color: "#212529",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 6,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  tankGroup: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    // borderTopWidth: 1,
    // borderColor: "#ddd",
    backgroundColor: "#fff",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledSaveButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  cancelButton: {
    borderColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  rowThree: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },
  thirdInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerError: {
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  selectedMaterialBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  selectedMaterialText: { fontSize: 15, color: "#212529", fontWeight: "500" },
  materialUnid: { fontWeight: "700", color: "#007bff" },
});
