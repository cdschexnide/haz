import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-elements";
import { useInspectionForm } from "../../../contexts/InspectionFormProvider";
import {
  parseContainerTypeFromQuantityPacking,
  getContainerTypeLabel,
} from "../../../utils/innerPackagingParser";
import { initializeInnerPackagingInspection } from "../../../utils/innerPackagingInspection";

const InnerPackagingConfirmation = ({ navigation }: { navigation: any }) => {
  const { inspection, setInnerPackagingInspection } = useInspectionForm();

  // Auto-detect container type from SDDG
  const quantityAndPacking =
    inspection?.verificationCopy?.quantityAndPacking || "";
  const containerType =
    parseContainerTypeFromQuantityPacking(quantityAndPacking);

  // State
  const [hasInnerPackaging, setHasInnerPackaging] = useState<boolean | null>(
    null
  );

  const handleContinue = () => {
    if (hasInnerPackaging === null) {
      alert("Please select Yes or No");
      return;
    }

    if (hasInnerPackaging === false) {
      // Skip inner packaging inspection
      navigation.navigate("InspectorPackageVerification");
      return;
    }

    // Initialize inner packaging inspection
    const inspectionData = initializeInnerPackagingInspection(containerType);
    setInnerPackagingInspection(inspectionData);

    // Navigate to opening procedures
    navigation.navigate("OpeningProcedures");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>
          Inner Packaging Inspection
        </Card.Title>
        <Card.Divider />

        {/* Auto-detected container type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Outer Packaging:</Text>
          <View style={styles.detectedTypeContainer}>
            <Text style={styles.detectedTypeText}>
              {containerType
                ? getContainerTypeLabel(containerType)
                : "Unable to detect"}
            </Text>
          </View>

          {/* Source reference */}
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceLabel}>From SDDG (Key 16):</Text>
            <Text style={styles.sourceText}>"{quantityAndPacking}"</Text>
          </View>
        </View>

        <Card.Divider style={styles.divider} />

        {/* Main question */}
        <View style={styles.section}>
          <Text style={styles.questionText}>
            Do you have inner packagings that require inspection?
          </Text>

          {/* Yes/No selection */}
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                hasInnerPackaging === true && styles.radioButtonSelected,
              ]}
              onPress={() => setHasInnerPackaging(true)}
            >
              <View style={styles.radioCircle}>
                {hasInnerPackaging === true && (
                  <View style={styles.radioCircleSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                hasInnerPackaging === false && styles.radioButtonSelected,
              ]}
              onPress={() => setHasInnerPackaging(false)}
            >
              <View style={styles.radioCircle}>
                {hasInnerPackaging === false && (
                  <View style={styles.radioCircleSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              hasInnerPackaging === null && styles.primaryButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={hasInnerPackaging === null}
          >
            <Text
              style={[
                styles.primaryButtonText,
                hasInnerPackaging === null && styles.primaryButtonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  detectedTypeContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2196f3",
    marginBottom: 8,
  },
  detectedTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    textAlign: "center",
  },
  sourceContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  sourceLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  sourceText: {
    fontSize: 13,
    color: "#333",
    fontStyle: "italic",
  },
  divider: {
    marginVertical: 12,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    minWidth: 100,
  },
  radioButtonSelected: {
    borderColor: "#2196f3",
    backgroundColor: "#e3f2fd",
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#2196f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioCircleSelected: {
    height: 11,
    width: 11,
    borderRadius: 5.5,
    backgroundColor: "#2196f3",
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryButtonDisabled: {
    backgroundColor: "#F2F2F7",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonTextDisabled: {
    color: "#8E8E93",
  },
});

export default InnerPackagingConfirmation;
