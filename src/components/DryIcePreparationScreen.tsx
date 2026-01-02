import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AircraftType =
  | "C17"
  | "C5"
  | "C130H"
  | "C130J"
  | "C130Other"
  | "KC10"
  | "PressurizedGeneric"
  | "NonPressurized"
  | "AMCContract";

interface DryIceData {
  weight: number;
  unit: "kg" | "lbs";
  aircraftType: AircraftType;
  airChangesPerHour?: number;
}

export default function DryIcePreparationScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [data, setData] = useState<DryIceData>({
    weight: 0,
    unit: "lbs",
    aircraftType: "PressurizedGeneric",
  });

  const convertToLbs = (weight: number, unit: "kg" | "lbs") =>
    unit === "kg" ? weight * 2.20462 : weight;

  const getSafeLimitLbs = (d: DryIceData): number | undefined => {
    switch (d.aircraftType) {
      case "C130Other":
        return 600; // A3.3.9.6.10.7
      case "AMCContract":
        return 440; // A3.3.9.6.12
      case "NonPressurized":
        return Number.POSITIVE_INFINITY; // A3.3.9.6.11
      default:
        return undefined; 
    }
  };

  const safeLimit = getSafeLimitLbs(data);
  const weightLbs = convertToLbs(data.weight, data.unit);
  const isWithinLimit = safeLimit ? weightLbs <= safeLimit : true;

  const handleNext = () => {
    navigation.navigate("NextStep");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dry Ice Preparation</Text>

      <Text style={styles.label}>Aircraft Type</Text>
      <Picker
        selectedValue={data.aircraftType}
        onValueChange={(value) =>
          setData({ ...data, aircraftType: value as AircraftType })
        }
      >
        <Picker.Item label="Pressurized (Generic)" value="PressurizedGeneric" />
        <Picker.Item label="C-17" value="C17" />
        <Picker.Item label="C-5" value="C5" />
        <Picker.Item label="KC-10" value="KC10" />
        <Picker.Item label="C-130H (two 70 lb/min packs)" value="C130H" />
        <Picker.Item label="C-130J" value="C130J" />
        <Picker.Item label="C-130 (other variants)" value="C130Other" />
        <Picker.Item label="Non-pressurized" value="NonPressurized" />
        <Picker.Item label="AMC Contract" value="AMCContract" />
      </Picker>

      {[
        "PressurizedGeneric",
        "C17",
        "C5",
        "KC10",
        "C130H",
        "C130J",
      ].includes(data.aircraftType) && (
          <>
            <Text style={styles.label}>Air Changes / Hour</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={data.airChangesPerHour?.toString() || ""}
              onChangeText={(t) =>
                setData({
                  ...data,
                  airChangesPerHour: parseFloat(t) || undefined,
                })
              }
            />
          </>
        )}

      <Text style={styles.label}>Dry Ice Weight ({data.unit})</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={data.weight ? data.weight.toString() : ""}
        onChangeText={(t) =>
          setData({ ...data, weight: parseFloat(t) || 0 })
        }
      />

      <View style={styles.unitRow}>
        <TouchableOpacity
          style={[styles.unitButton, data.unit === "lbs" && styles.unitButtonActive]}
          onPress={() => setData({ ...data, unit: "lbs" })}
        >
          <Text style={styles.unitButtonText}>lbs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitButton, data.unit === "kg" && styles.unitButtonActive]}
          onPress={() => setData({ ...data, unit: "kg" })}
        >
          <Text style={styles.unitButtonText}>kg</Text>
        </TouchableOpacity>
      </View>

      {safeLimit !== undefined && (
        <Text style={isWithinLimit ? styles.ok : styles.error}>
          {isWithinLimit ? "Within" : "Exceeds"} allowable limit of {safeLimit} lbs
        </Text>
      )}

      <Text style={styles.sectionHeader}>Packaging Instructions (A13.10)</Text>
      <Text style={styles.bullet}>• Wrap in kraft paper and secure with tape</Text>
      <Text style={styles.bullet}>
        • Pack in vented fiberboard, polystyrene, or similar containers
      </Text>
      <Text style={styles.bullet}>• UN specification packaging not required</Text>

      <Text style={styles.sectionHeader}>Operational Cautions</Text>
      <Text style={styles.bullet}>
        • Seat passengers at least one pallet position forward of dry ice
      </Text>
      <Text style={styles.bullet}>• Keep dry ice out of upper-deck compartments</Text>
      <Text style={styles.bullet}>• Maximize cargo-bay ventilation on ground</Text>

      <TouchableOpacity
        style={[styles.nextButton, !isWithinLimit && styles.nextButtonDisabled]}
        disabled={!isWithinLimit}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Save / Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  unitRow: { flexDirection: "row", marginTop: 8 },
  unitButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  unitButtonActive: { backgroundColor: "#e0e0e0" },
  unitButtonText: { fontSize: 16 },
  sectionHeader: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  bullet: { fontSize: 14, marginTop: 6 },
  ok: { color: "green", marginTop: 10 },
  error: { color: "red", marginTop: 10 },
  nextButton: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: { backgroundColor: "#999" },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
