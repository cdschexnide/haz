import { AbsorbentMaterialRequirement } from "../../server/lookupFunctions/absorbentMaterialRequirementLookup";
import { useHazProStore } from "../../src/stores/useHazProStore";
import { Picker } from "@react-native-picker/picker";
import { Card } from "@rneui/themed";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-elements";

const { width, height } = Dimensions.get("window");
const screenWidth = width;
const screenHeight = height;

const primaryColor = "#007bff";
const backgroundColor = "white";

const AbsorbentCushioningRequirements = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store } = useHazProStore();
  const absorbentMaterial =
    state.hazProPreparerContext.lookupFunctionsOutput
      ?.absorbentCushioningCriteria?.absorbentMaterial;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  if (!absorbentMaterial) return null;

  type MaterialKey = keyof Pick<
    AbsorbentMaterialRequirement["absorbentMaterial"],
    "vermiculite" | "diatomaceousEarth"
  >;
  const materialTypes: MaterialKey[] = ["vermiculite", "diatomaceousEarth"];
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialKey>("vermiculite");

  const getDisplayName = (key: MaterialKey) => {
    const map: Record<MaterialKey, string> = {
      vermiculite: "Vermiculite",
      diatomaceousEarth: "Diatomaceous Earth",
    };
    return map[key];
  };

  const material = absorbentMaterial[selectedMaterial];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Absorbent Cushioning</Text>

        <Text style={styles.label}>Select material type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMaterial}
            onValueChange={itemValue => setSelectedMaterial(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            {materialTypes.map(type => (
              <Picker.Item
                key={type}
                label={getDisplayName(type)}
                value={type}
              />
            ))}
          </Picker>
        </View>

        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>
            {getDisplayName(selectedMaterial)}
          </Card.Title>
          <Card.Divider />

          <View style={styles.rowSection}>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Sides</Text>
              <Text style={styles.materialText}>cm: {material.sides.cm}</Text>
              <Text style={styles.materialText}>in: {material.sides.in}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Top/Bottom</Text>
              <Text style={styles.materialText}>
                cm: {material.topBottom.cm}
              </Text>
              <Text style={styles.materialText}>
                in: {material.topBottom.in}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>
                Absorbent Sheet Materials
              </Text>
              <Text style={styles.materialText}>
                {absorbentMaterial.absorbentSheetMaterials}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Cellulosic Particulate</Text>
              <Text style={styles.materialText}>
                {absorbentMaterial.cellulosicParticulate}
              </Text>
            </View>
          </View>
        </Card>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            type="outline"
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonText}
            onPress={() => {
              if (store.hazProPreparerContext) {
                store.hazProPreparerContext.completedSubsteps =
                  completedSubsteps.slice(0, -1);
              }
              navigation.goBack();
            }}
          />

          <Button
            title="Save & Continue"
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            onPress={() => {
              if (store.hazProPreparerContext) {
                store.hazProPreparerContext.completedSubsteps = [
                  ...completedSubsteps,
                  "AbsorbentCushioningRequirements",
                ];
              }
              navigation.navigate("LabelingAndMarking");
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.03,
    backgroundColor: backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: screenHeight * 0.01,
    textAlign: "center",
    color: "#000",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: screenHeight * 0.01,
    marginLeft: screenWidth * 0.012,
    color: "#000",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    width: "30%",
    marginLeft: screenWidth * 0.012,
  },
  picker: {
    height: screenHeight * 0.07,
    width: "100%",
    color: "black",
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: screenWidth * 0.02,
    marginBottom: screenHeight * 0.02,
    borderColor: "black",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  materialText: {
    fontSize: 16,
    color: "#000",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.01,
    color: "#000",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: screenHeight * 0.02,
    gap: screenWidth * 0.05,
  },
  column: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});

export default AbsorbentCushioningRequirements;
