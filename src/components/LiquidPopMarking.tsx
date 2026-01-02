import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  B: string; // Packaging Code
  C: string; // Packing Group
  D: string; // Relative Density
  E: string; // Test Pressure (kPa)
  F: string; // Year
  G: string; // Country
  H: string; // Certifier
  highlight?: "packagingCode" | "packingGroup";
};

const columns = [
  { type: "field", label: "A", valueKey: "A", width: 44 },
  { type: "field", label: "B", valueKey: "B", width: 54 },
  { type: "slash" },
  { type: "field", label: "C", valueKey: "C", width: 32 },
  { type: "field", label: "D", valueKey: "D", width: 60 },
  { type: "slash" },
  { type: "field", label: "E", valueKey: "E", width: 48 },
  { type: "slash" },
  { type: "field", label: "F", valueKey: "F", width: 38 },
  { type: "slash" },
  { type: "field", label: "G", valueKey: "G", width: 48 },
  { type: "slash" },
  { type: "field", label: "H", valueKey: "H", width: 54 },
];

const getValue = (key: string, props: Props) => {
  switch (key) {
    case "A":
      return "UN";
    case "B":
      return props.B;
    case "C":
      return props.C;
    case "D":
      return props.D;
    case "E":
      return props.E;
    case "F":
      return props.F;
    case "G":
      return props.G;
    case "H":
      return props.H;
    default:
      return "--";
  }
};

const LiquidPopMarking: React.FC<Props> = props => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.sideLabelBox}>
          <Text style={styles.sideLabel}>Field ID</Text>
        </View>
        {columns.map((col, idx) =>
          col.type === "field" ? (
            <View
              key={`label-${idx}`}
              style={[styles.column, { width: col.width }]}
            >
              <Text style={styles.label}>{col.label}</Text>
            </View>
          ) : (
            <View
              key={`slash-label-${idx}`}
              style={[styles.column, styles.slashCol]}
            >
            </View>
          )
        )}
      </View>
      <View style={styles.row}>
        <View style={styles.sideLabelBox}>
          <Text style={styles.sideLabel}>Example</Text>
        </View>
        {columns.map((col, idx) => {
          if (col.type === "field") {
            if (col.valueKey === "A") {
              return (
                <View
                  key={`value-${idx}`}
                  style={[styles.column, { width: col.width }]}
                >
                  <View style={styles.unCircle}>
                    <Text style={styles.unText}>UN</Text>
                  </View>
                </View>
              );
            }
            const val = getValue(col.valueKey!, props);
            return (
              <View
                key={`value-${idx}`}
                style={[styles.column, { width: col.width }]}
              >
                <Text style={styles.valueText}>{val || "--"}</Text>
              </View>
            );
          } else {
            return (
              <View
                key={`slash-value-${idx}`}
                style={[styles.column, styles.slashCol]}
              >
                <Text style={styles.separator}>/</Text>
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};

export default LiquidPopMarking;

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
    justifyContent: "center",
  },
  slashCol: {
    width: 18,
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  separator: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 0,
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
