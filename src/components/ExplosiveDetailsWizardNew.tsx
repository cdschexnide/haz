import {
  ExplosiveCrossReference,
  explosiveCrossReferences,
} from "../../server/data/tableA27_1";
import { getPackagingReference } from "../../server/lookupFunctions/grandfatheredPackagingParagraphLookup";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
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

export type ExplosiveContainer = {
  id: number;
  grossMass: string;
  grossMassUnit: "kg" | "g";
  newPerRound: string;
  newPerRoundUnit: "kg" | "g";
  roundCount: string;
};

const ExplosiveDetailsWizard = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const [containers, setContainers] = useState<ExplosiveContainer[]>([]);
  const [sameType, setSameType] = useState<boolean | null>(null);
  const [containerCount, setContainerCount] = useState<string>("");

  const [sameGross, setSameGross] = useState<boolean | null>(null);
  const [commonGross, setCommonGross] = useState<string>("");
  const [commonGrossUnit, setCommonGrossUnit] = useState<"kg" | "g">("kg");

  const [sameNEW, setSameNEW] = useState<boolean | null>(null);
  const [commonNEW, setCommonNEW] = useState<string>("");
  const [commonNEWUnit, setCommonNEWUnit] = useState<"kg" | "g">("kg");

  const [sameCount, setSameCount] = useState<boolean | null>(null);
  const [commonCount, setCommonCount] = useState<string>("");

  const [step, setStep] = useState<number>(0);
  const [grandfathered, setGrandfathered] = useState<boolean>(
    !!state.hazProPreparerContext.isGrandfatheredExplosive
  );
  const [packagingDescription, setPackagingDescription] = useState<string>(
    state.hazProPreparerContext.grandfatheredExplosive
      ?.generalPackageDescription || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedExplosive, setSelectedExplosive] =
    useState<ExplosiveCrossReference | null>(null);

  const handleNext = () => {
    if (step === 1) {
      store.hazProPreparerContext.completedSubsteps = ["ExplosiveWizard"];
      store.hazProPreparerContext.activeStep = 3;
      navigation.navigate("GrandfatheredWizard");
    } else {
      setStep(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (sameType === false) {
      const newContainer: ExplosiveContainer = {
        id: 1,
        grossMass: "",
        grossMassUnit: "kg",
        newPerRound: "",
        newPerRoundUnit: "kg",
        roundCount: "",
      };
      setContainers([newContainer]);
    } else {
      const count = parseInt(containerCount, 10);
      if (isNaN(count) || count <= 0) {
        setContainers([]);
        return;
      }
      const newContainers: ExplosiveContainer[] = Array.from(
        { length: count },
        (_, i) => ({
          id: i + 1,
          grossMass: "",
          grossMassUnit: "kg",
          newPerRound: "",
          newPerRoundUnit: "kg",
          roundCount: "",
        })
      );
      setContainers(newContainers);
    }
  }, [sameType]);

  useEffect(() => {
    const count = parseInt(containerCount, 10);
    if (isNaN(count) || count <= 0) {
      setContainers([]);
      return;
    }
    const newContainers: ExplosiveContainer[] = Array.from(
      { length: count },
      (_, i) => ({
        id: i + 1,
        grossMass: "",
        grossMassUnit: "kg",
        newPerRound: "",
        newPerRoundUnit: "kg",
        roundCount: "",
      })
    );
    setContainers(newContainers);
  }, [containerCount]);

  useEffect(() => {
    setContainers(prev =>
      prev.map(c => ({
        ...c,
        ...(sameGross && {
          grossMass: commonGross,
          grossMassUnit: commonGrossUnit,
        }),
        ...(sameNEW && {
          newPerRound: commonNEW,
          newPerRoundUnit: commonNEWUnit,
        }),
        ...(sameCount && { roundCount: commonCount }),
      }))
    );
  }, [
    sameGross,
    commonGross,
    commonGrossUnit,
    sameNEW,
    commonNEW,
    commonNEWUnit,
    sameCount,
    commonCount,
  ]);

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1);
    else navigation.goBack();
  };

  const handleSaveExit = async () => {
    store.hazProPreparerContext.activeStep = 1;
    try {
      await saveCurrentShipment("in-progress");
      navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
    } catch (err) {
      console.log("Save failed, but error is handled by context:", err);
    }
  };

  useEffect(() => {
    store.hazProPreparerContext.isGrandfatheredExplosive = grandfathered;
  }, [grandfathered]);

  useEffect(() => {
    if (store.hazProPreparerContext.grandfatheredExplosive) {
      store.hazProPreparerContext.grandfatheredExplosive.generalPackageDescription =
        packagingDescription;
    }
  }, [packagingDescription]);

  const filteredExplosives = useMemo(() => {
    return explosiveCrossReferences.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.afr71_4Paragraph
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.afman24_204_Paragraph
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const canContinue = () => {
    if (step === 0) return !!selectedExplosive;
    return true;
  };

  const updateContainer = (
    id: number,
    field: keyof ExplosiveContainer,
    value: string
  ) => {
    setContainers(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  useEffect(() => {
    store.hazProPreparerContext.grandfatheredExplosivesContainers = containers;
  }, [containers]);

  const renderStep = () => {
    if (step === 0) {
      return (
        <View>
          <Text style={styles.sectionTitle}>
            Select Explosive or Ammunition
          </Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or paragraph"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons
              name="search"
              size={20}
              color="#555"
              style={{ marginLeft: 10 }}
            />
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                Name of Explosive or Ammunition
              </Text>
              <Text style={styles.tableHeaderCell}>AFR 71-4</Text>
              <Text style={styles.tableHeaderCell}>AFMAN 24-204</Text>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              <View style={styles.tableBody}>
                {filteredExplosives.map(item => {
                  const isSelected = selectedExplosive?.name === item.name;
                  const subparagraphReferences =
                    item.afman24_204_SubParagraphReferences?.length === 1
                      ? item.afman24_204_SubParagraphReferences[0]
                      : item.afman24_204_SubParagraphReferences?.length &&
                        item.afman24_204_SubParagraphReferences.length > 1
                      ? `${
                          item.afman24_204_SubParagraphReferences[0]
                        } - ${item.afman24_204_SubParagraphReferences.at(-1)}`
                      : item.afman24_204_Paragraph;

                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.tableRow,
                        isSelected && styles.selectedRow,
                      ]}
                      onPress={() => {
                        setSelectedExplosive(item);
                        const packagingParagraphLookup = getPackagingReference(
                          item.afman24_204_Paragraph
                        );
                        if (packagingParagraphLookup) {
                          const grandfatheredExplosive = {
                            tableA27_1CrossReference: item,
                            packagingParagraphReferenceData:
                              packagingParagraphLookup,
                            generalPackageDescription:
                              state.hazProPreparerContext.grandfatheredExplosive
                                ?.generalPackageDescription,
                          };
                          store.hazProPreparerContext.grandfatheredExplosive =
                            grandfatheredExplosive;
                        }
                      }}
                    >
                      <Text style={[styles.tableCell, { flex: 2 }]}>
                        {item.name}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.afr71_4Paragraph}
                      </Text>
                      <Text style={styles.tableCell}>
                        {subparagraphReferences !== ""
                          ? subparagraphReferences
                          : item.afman24_204_Paragraph}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }

    if (step === 1) {
      return (
        <View>
          <View style={styles.section2}>
            <View style={styles.inlineRow}>
              <Text style={styles.label}>
                Multiple containers of same type?
              </Text>
              <View style={styles.inlineButtons}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    sameType === true && styles.buttonSelected,
                  ]}
                  onPress={() => setSameType(true)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      sameType === true && styles.buttonTextSelected,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    sameType === false && styles.buttonSelected,
                  ]}
                  onPress={() => setSameType(false)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      sameType === false && styles.buttonTextSelected,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {sameType === true && (
              <TextInput
                style={styles.input3}
                placeholder="Enter number of containers"
                keyboardType="numeric"
                value={containerCount}
                onChangeText={setContainerCount}
              />
            )}
            <Text
              style={[
                styles.label,
                { marginTop: 10, color: "#666", fontStyle: "italic" },
              ]}
            >
              Shipments in different package types require separate
              certification
            </Text>
          </View>

          {sameType === true &&
            ["Gross Mass", "NEW per round", "Round count"].map((label, idx) => {
              const isSame = [sameGross, sameNEW, sameCount][idx];
              const setSame = [setSameGross, setSameNEW, setSameCount][idx];
              const commonValue = [commonGross, commonNEW, commonCount][idx];
              const setCommonValue = [
                setCommonGross,
                setCommonNEW,
                setCommonCount,
              ][idx];
              const unit = [commonGrossUnit, commonNEWUnit, ""][idx];
              const setUnit = [setCommonGrossUnit, setCommonNEWUnit, () => {}][
                idx
              ];
              const showUnit = label !== "Round count";

              return (
                <View key={label} style={styles.section2}>
                  <View style={styles.inlineRow}>
                    <Text style={styles.label}>Same {label}?</Text>
                    <View style={styles.inlineButtons}>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          isSame === true && styles.buttonSelected,
                        ]}
                        onPress={() => setSame(true)}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            isSame === true && styles.buttonTextSelected,
                          ]}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          isSame === false && styles.buttonSelected,
                        ]}
                        onPress={() => setSame(false)}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            isSame === false && styles.buttonTextSelected,
                          ]}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isSame && (
                    <View style={[styles.inlineRow2, { marginTop: 8 }]}>
                      <TextInput
                        style={[styles.input2]}
                        value={commonValue}
                        onChangeText={setCommonValue}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        keyboardType="numeric"
                      />
                      {showUnit && (
                        <View style={styles.unitPickerWrapperAligned}>
                          <Picker
                            selectedValue={unit}
                            onValueChange={value => {
                              if (value === "kg" || value === "g") {
                                setUnit(value);
                              }
                            }}
                            style={styles.unitPickerAligned}
                          >
                            <Picker.Item label="kg" value="kg" />
                            <Picker.Item label="g" value="g" />
                          </Picker>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}

          {containers.map(item => (
            <View key={item.id} style={styles.section}>
              <Text style={styles.label}>Container {item.id}</Text>
              <View style={{ flexDirection: "row", gap: 15, flexWrap: "wrap" }}>
                <View style={{ width: "20%" }}>
                  <Text style={styles.fieldLabel}>Gross Mass</Text>
                  <TextInput
                    style={styles.input}
                    value={item.grossMass}
                    editable={!sameGross}
                    onChangeText={val =>
                      updateContainer(item.id, "grossMass", val)
                    }
                    keyboardType="numeric"
                  />
                </View>
                {!sameGross && (
                  <View style={{ width: "15%" }}>
                    <Text style={styles.fieldLabel}>Gross Mass Unit</Text>
                    <View style={styles.rowUnitPickerWrapper}>
                      <Picker
                        selectedValue={item.grossMassUnit}
                        onValueChange={val =>
                          updateContainer(item.id, "grossMassUnit", val)
                        }
                        style={styles.rowUnitPicker}
                      >
                        <Picker.Item label="kg" value="kg" />
                        <Picker.Item label="g" value="g" />
                      </Picker>
                    </View>
                  </View>
                )}
                <View style={{ width: "20%" }}>
                  <Text style={styles.fieldLabel}>NEW Per Round</Text>
                  <TextInput
                    style={styles.input}
                    value={item.newPerRound}
                    editable={!sameNEW}
                    onChangeText={val =>
                      updateContainer(item.id, "newPerRound", val)
                    }
                    keyboardType="numeric"
                  />
                </View>
                {!sameNEW && (
                  <View style={{ width: "17%" }}>
                    <Text style={styles.fieldLabel}>NEW Per Round Unit</Text>
                    <View style={styles.rowUnitPickerWrapper}>
                      <Picker
                        selectedValue={item.newPerRoundUnit}
                        onValueChange={val =>
                          updateContainer(item.id, "newPerRoundUnit", val)
                        }
                        style={styles.rowUnitPicker}
                      >
                        <Picker.Item label="kg" value="kg" />
                        <Picker.Item label="g" value="g" />
                      </Picker>
                    </View>
                  </View>
                )}
                <View style={{ width: "20%" }}>
                  <Text style={styles.fieldLabel}>Round Count</Text>
                  <TextInput
                    style={styles.input}
                    value={item.roundCount}
                    editable={!sameCount}
                    onChangeText={val =>
                      updateContainer(item.id, "roundCount", val)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Explosive Details Wizard</Text>
            <Text style={styles.stepIndicator}>Step {step + 1} of 2</Text>
          </View>
          {renderStep()}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>
                {step === 0 ? "Cancel" : "Back"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveExitButton}
              activeOpacity={0.8}
              onPress={handleSaveExit}
            >
              <View style={styles.saveExitContent}>
                <MaterialCommunityIcons
                  name="content-save"
                  size={18}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.saveExitText}>Save & Exit</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                !canContinue() && styles.disabledButton,
              ]}
              disabled={!canContinue()}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !canContinue() && styles.disabledButtonText,
                ]}
              >
                {step === 1 ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ExplosiveDetailsWizard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    color: "#666",
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    height: 57,
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    height: 57,
    width: 300,
  },
  input3: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    height: 57,
    width: 250,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    zIndex: 2,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
    color: "#000",
  },
  tableBody: {
    paddingBottom: 100,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    color: "#000",
  },
  selectedRow: {
    backgroundColor: "#dbeafe",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 50,
  },
  inlineRow2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  button: {
    borderColor: colors.blue,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonSelected: {
    backgroundColor: colors.blue,
  },
  buttonText: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 16,
  },
  buttonTextSelected: {
    color: "#ffffff",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#003366",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    color: "#003366",
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  saveExitContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveExitText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#ffffff",
  },
  tableContainer: {
    flexGrow: 1,
    maxHeight: 290,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#fdfdfd",
  },
  section: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  section2: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    paddingLeft: 50,
    paddingTop: 20,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    minWidth: 300,
    color: "#000",
  },
  inlineButtons: {
    flexDirection: "row",
  },
  unitPickerWrapper: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  unitPickerWrapper2: {
    width: "25%",
    height: 57,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  unitPicker: {
    height: 55,
    width: "100%",
  },
  rowUnitPicker: {
    height: 55,
    backgroundColor: "#fff",
  },
  rowUnitPickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 57,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#000",
  },
  unitPickerWrapperAligned: {
    width: 90,
    height: 57,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    overflow: "hidden",
  },
  unitPickerAligned: {
    height: 57,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
