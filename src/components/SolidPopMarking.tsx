import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
};

const SolidPopMarking: React.FC<Props> = ({ B, C, D, E, F, G, H }) => {
  const fieldLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const fieldValues = ["UN", B, C, D, E, F, G, H];

  return (
    <View style={styles.wrapper}>
      {/* LABEL ROW */}
      <View style={styles.row}>
        <View style={styles.sideLabelBox}>
          <Text style={styles.sideLabel}>Field ID</Text>
        </View>
        {fieldLabels.map((label, index) => (
          <React.Fragment key={`label-${index}`}>
            <View style={[styles.column, getColumnWidth(index)]}>
              <Text style={styles.label}>{label}</Text>
            </View>
            {index < fieldLabels.length - 1 && <Text style={styles.separator}> </Text>}
          </React.Fragment>
        ))}
      </View>

      {/* VALUE ROW */}
      <View style={styles.row}>
        <View style={styles.sideLabelBox}>
          <Text style={styles.sideLabel}>Example</Text>
        </View>
        {fieldValues.map((val, index) => (
          <React.Fragment key={`value-${index}`}>
            <View style={[styles.column, getColumnWidth(index)]}>
              {index === 0 ? (
                <View style={styles.unCircle}>
                  <Text style={styles.unText}>UN</Text>
                </View>
              ) : (
                <Text style={styles.valueText}>{val || "--"}</Text>
              )}
            </View>
            {/* OMIT slash between UN symbol and package code (A-B), and between C and D */}
            {index < fieldValues.length - 1 && index !== 0 && index !== 2 && (
              <Text style={styles.separator}>/</Text>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const getColumnWidth = (index: number) => {
  switch (index) {
    case 1: return { width: 65 }; // B: packaging code
    case 2: return { width: 28 }; // C: single letter
    case 3: return { width: 36 }; // D: two-digit number
    case 4: return { width: 32 }; // E: "S"
    case 5: return { width: 40 }; // F: 2 digits
    default: return { width: 49 };
  }
};

export default SolidPopMarking;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  column: {
    alignItems: "center",
  },
  sideLabelBox: {
    width: 70,
    marginRight: 6,
    alignItems: "flex-end",
  },
  sideLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  valueText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  separator: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 4,
      color: "#000"
  },
  unCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  unText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#000",
    textTransform: "uppercase",
  },
});
