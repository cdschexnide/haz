import colors from "@/theming/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  highlight?: "packagingCode" | "packingGroup";
  packageCode: string | null;
  packingGroupCode: string;
};

const ExampleLiquidPopMarking: React.FC<Props> = ({
  highlight,
  packageCode,
  packingGroupCode,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.unCircle}>
        <Text style={styles.unText}>UN</Text>
      </View>
      <Text style={styles.separator}></Text>

      <Text
        style={[
          styles.segment,
          highlight === "packagingCode" && styles.highlighted,
        ]}
      >
        {packageCode}
      </Text>

      <Text style={styles.separator}>/</Text>

      <Text
        style={[
          styles.segment,
          highlight === "packingGroup" && styles.highlighted,
        ]}
      >
        {packingGroupCode}
      </Text>
      <Text style={styles.segment}> 1.3</Text>

      <Text style={styles.separator}>/</Text>
      <Text style={styles.segment}>100</Text>

      <Text style={styles.separator}>/</Text>
      <Text style={styles.segment}>99</Text>

      <Text style={styles.separator}>/</Text>
      <Text style={styles.segment}>USA</Text>

      <Text style={styles.separator}>/</Text>
      <Text style={styles.segment}>DOD</Text>
    </View>
  );
};

export default ExampleLiquidPopMarking;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 7,
    backgroundColor: "white",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  segment: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  separator: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  highlighted: {
    backgroundColor: colors.blue,
    color: "#fff",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  unCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  unText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#000",
    textTransform: "uppercase",
  },
});
