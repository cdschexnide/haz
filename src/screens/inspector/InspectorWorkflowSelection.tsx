import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const InspectorWorkflowSelection = ({ navigation }: { navigation: any }) => {


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.85}
        onPress={() => {
          // navigation.navigate("ScanPopMarkingInspector");
        }}
      >
        {/* <Ionicons name="qr-code-outline" size={50} color="white" /> */}
        {/* <Ionicons name="document-text-outline" size={50} color="white" /> */}
        <Ionicons name="scan-outline" size={60} color="white" />
        <Text style={styles.sectionText}>Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate("InspectorShipmentCreationScreen");
        }}
      >
        <MaterialCommunityIcons name="clipboard-search-outline" size={60} color="white" />
        <Text style={styles.sectionText}>Walkthrough</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InspectorWorkflowSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  section: {
    height: height / 2.5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff33",
    paddingHorizontal: 24,
  },
  sectionText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    marginTop: 12,
    textAlign: "center",
  },
});
