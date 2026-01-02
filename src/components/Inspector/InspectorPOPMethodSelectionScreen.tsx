import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";

const { width } = Dimensions.get("window");

interface InspectorPOPMethodSelectionScreenProps {
  navigation: any;
}

const InspectorPOPMethodSelectionScreen: React.FC<
  InspectorPOPMethodSelectionScreenProps
> = ({ navigation }) => {
  const { resetPackagePopMarking } = useInspectionForm();

  const handleScanPOP = () => {
    // Reset any existing POP marking data
    resetPackagePopMarking();

    // Navigate to scanner
    navigation.navigate("InspectorPOPScannerScreen");
  };

  const handleManualEntry = () => {
    // Reset any existing POP marking data
    resetPackagePopMarking();

    // Navigate to manual entry
    navigation.navigate("InspectorPOPMarkingDataEntry");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>POP Marking Entry</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          How would you like to enter the package marking?
        </Text>

        {/* Scan Option Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleScanPOP}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="camera-alt" size={48} color="#007AFF" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Scan POP Marking</Text>
            <Text style={styles.optionDescription}>
              Use camera to automatically scan and extract package marking from photo
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Manual Entry Option Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleManualEntry}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="edit" size={48} color="#007AFF" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Enter Manually</Text>
            <Text style={styles.optionDescription}>
              Manually type in the package marking fields
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Package markings are typically found on the bottom or side of the
            outer packaging and consist of codes like "4G/Y150/S/04/USA/ABC".
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InspectorPOPMethodSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 24,
    textAlign: "center",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#007AFF20",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
    marginLeft: 12,
  },
  footer: {
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
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
