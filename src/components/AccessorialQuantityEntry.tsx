import AccessorialHazardEntry from "@/components/AccessorialHazardEntry";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { AccessorialHazard, PhysicalState } from "../../types";
import { getHazardousMaterialPhysicalStateByHazardClass } from "@/utils/getHazardousMaterialPhysicalState";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AccessorialQuantityEntry = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment, isLoading, error } =
    useHazProStore();

  function getCurrentHazards() {
    if (
      state.hazProPreparerContext.engineOrMachineryPreparationData
        ?.accessorialHazards.other
    ) {
      return (
        state.hazProPreparerContext.engineOrMachineryPreparationData
          .accessorialHazards?.other || []
      );
    }
    return (
      state.hazProPreparerContext.un3166Details?.accessorialHazards?.other || []
    );
  }

  const [quantities, setQuantities] = useState<AccessorialHazard[]>(
    getCurrentHazards()
  );
  const [unitSelections, setUnitSelections] = useState<string[]>(() => {
    return getCurrentHazards().map(hazard => {
      const stateChar = hazard.hazardousMaterial.hazclassDiv[0];
      const physicalState =
        getHazardousMaterialPhysicalStateByHazardClass(stateChar);
      return physicalState === PhysicalState.SOLID ? "kg" : "liters";
    });
  });

  const { navigate } = useNavigationRef();

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  useEffect(() => {
    const hazards = getCurrentHazards();
    setQuantities(hazards);
    setUnitSelections(
      hazards.map(hazard => {
        const stateChar = hazard.hazardousMaterial.hazclassDiv[0];
        const physicalState =
          getHazardousMaterialPhysicalStateByHazardClass(stateChar);
        return physicalState === PhysicalState.SOLID ? "kg" : "liters";
      })
    );
  }, [
    state.hazProPreparerContext.engineOrMachineryPreparationData,
    state.hazProPreparerContext.un3166Details,
  ]);

  const handleHazardUpdate = (
    index: number,
    field: "quantity" | "amount" | "unit",
    value: string
  ) => {
    setQuantities(prev => {
      const updated = [...prev];
      const hazard = updated[index];

      const parsed = parseFloat(value) || 0;
      const toFixed = (n: number) => parseFloat(n.toFixed(2));

      if (field === "quantity") {
        hazard.quantity = value;
      } else if (field === "amount") {
        const selectedUnit = unitSelections[index];
        if (selectedUnit === "kg") {
          hazard.mass = { kg: parsed, lbs: toFixed(parsed * 2.20462) };
        } else if (selectedUnit === "lbs") {
          hazard.mass = { lbs: parsed, kg: toFixed(parsed / 2.20462) };
        } else if (selectedUnit === "liters") {
          hazard.volume = {
            liters: parsed,
            gallons: toFixed(parsed * 0.264172),
          };
        } else if (selectedUnit === "gallons") {
          hazard.volume = {
            gallons: parsed,
            liters: toFixed(parsed / 0.264172),
          };
        }
      }

      return updated;
    });
  };

  const handleUnitChange = (index: number, newUnit: string) => {
    const updatedUnits = [...unitSelections];
    updatedUnits[index] = newUnit;
    setUnitSelections(updatedUnits);
  };

  const handleDelete = (index: number) => {
    const updatedQuantities = [...quantities];
    const updatedUnits = [...unitSelections];
    updatedQuantities.splice(index, 1);
    updatedUnits.splice(index, 1);
    setQuantities(updatedQuantities);
    setUnitSelections(updatedUnits);
  };

  const handleSave = () => {
    if (state.hazProPreparerContext.hazardousMaterial?.unid === "UN3166") {
      store.hazProPreparerContext.un3166Details = {
        ...store.hazProPreparerContext.un3166Details,
        accessorialHazards: {
          ...store.hazProPreparerContext.un3166Details?.accessorialHazards,
          other: quantities,
        },
      };
    }
    const unids = ["UN3528", "UN3529", "UN3530"];
    if (
      state.hazProPreparerContext.hazardousMaterial?.unid &&
      unids.includes(state.hazProPreparerContext.hazardousMaterial?.unid)
    ) {
      if (store.hazProPreparerContext.engineOrMachineryPreparationData) {
        store.hazProPreparerContext.engineOrMachineryPreparationData.accessorialHazards =
          {
            ...store.hazProPreparerContext.engineOrMachineryPreparationData
              .accessorialHazards,
            other: quantities,
          };
      }
    }
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "AccessorialQuantityEntry",
    ];
    navigation.navigate("LabelingAndMarking");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>
          Enter Quantities for Accessorial Hazards
        </Text>

        {quantities.map((hazard, index) => (
          <AccessorialHazardEntry
            key={hazard.hazardousMaterial.unid}
            hazard={hazard}
            index={index}
            unit={unitSelections[index]}
            onUpdate={handleHazardUpdate}
            onUnitChange={handleUnitChange}
            onDelete={handleDelete}
          />
        ))}
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
            try {
              await saveCurrentShipment("in-progress");
              navigation.navigate("PreparerHomeStack", {
                screen: "PreparerHome",
              });
            } catch (err) {
              console.log("Save failed, but error is handled by context:", err);
            }
          }}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AccessorialQuantityEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
