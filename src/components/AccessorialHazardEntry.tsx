import { AccessorialHazard, PhysicalState } from "../../types";
import { getHazardousMaterialPhysicalStateByHazardClass } from "@/utils/getHazardousMaterialPhysicalState";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  hazard: AccessorialHazard;
  index: number;
  unit: string;
  onUpdate: (
    index: number,
    field: "quantity" | "amount" | "unit",
    value: string
  ) => void;
  onUnitChange: (index: number, newUnit: string) => void;
  onDelete: (index: number) => void;
};

const AccessorialHazardEntry: React.FC<Props> = ({
  hazard,
  index,
  unit,
  onUpdate,
  onUnitChange,
  onDelete,
}) => {
  const { hazardousMaterial, quantity } = hazard;

  const physicalState = () => {
    switch (hazardousMaterial.unid) {
      case "UN3334":
        return PhysicalState.LIQUID;
      default:
        return getHazardousMaterialPhysicalStateByHazardClass(
          hazardousMaterial.hazclassDiv
        );
    }
  };

  const unitOptions =
    physicalState() === PhysicalState.LIQUID
      ? ["liters", "gallons"]
      : physicalState() === PhysicalState.SOLID
      ? ["kg", "lbs"]
      : physicalState() === PhysicalState.GAS
      ? ["kg", "lbs"]
      : [];

  const getAmountValue = () => {
    if (unit === "kg") return hazard.mass?.kg?.toString() || "";
    if (unit === "lbs") return hazard.mass?.lbs?.toString() || "";
    if (unit === "liters") return hazard.volume?.liters?.toString() || "";
    if (unit === "gallons") return hazard.volume?.gallons?.toString() || "";
    return "";
  };

  const [localAmount, setLocalAmount] = useState(getAmountValue());

  useEffect(() => {
    setLocalAmount(getAmountValue());
  }, [hazard, unit]);

  return (
    <View style={styles.entryBox}>
      <View style={styles.metaSection}>
        <View style={styles.metaField}>
          <Text style={styles.metaLabel}>UN/ID</Text>
          <Text style={styles.metaValue}>{hazardousMaterial.unid}</Text>
        </View>
        <View style={styles.metaField}>
          <Text style={styles.metaLabel}>Name</Text>
          <Text style={styles.metaValue}>
            {hazardousMaterial.properShippingName}
          </Text>
        </View>
        <View style={styles.metaField}>
          <Text style={styles.metaLabel}>Class</Text>
          <Text style={styles.metaValue}>{hazardousMaterial.hazclassDiv}</Text>
        </View>
        <Ionicons
          name="trash-outline"
          size={24}
          color="red"
          style={styles.deleteIcon}
          onPress={() => onDelete(index)}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity || ""}
            onChangeText={text => onUpdate(index, "quantity", text)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount per Unit</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={localAmount}
            onChangeText={text => {
              setLocalAmount(text);
              onUpdate(index, "amount", text);
            }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Unit</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={unit}
              onValueChange={val => onUnitChange(index, val)}
              style={styles.picker}
            >
              <Picker.Item label="Select unit" value="" enabled={false} />
              {unitOptions.map(u => (
                <Picker.Item key={u} label={u} value={u} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AccessorialHazardEntry;

const styles = StyleSheet.create({
  entryBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  metaSection: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },
  metaField: {
    marginRight: 16,
    maxWidth: "65%",
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  metaValue: {
    fontSize: 15,
    color: "#212529",
  },
  deleteIcon: {
    marginLeft: "auto",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#343a40",
  },
  input: {
    borderWidth: 1,
    borderColor: "#adb5bd",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 55,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#adb5bd",
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
    color: "#212529",
  },
  picker: {
    height: 55,
    width: "100%",
    color: "#212529",
    backgroundColor: "#fff",
  },
});
