/**
 * Opening Procedures Screen
 *
 * Displays container-specific opening procedures.
 * Dynamic content based on detected/selected container type.
 */

import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-elements";
import { useInspectionForm } from "../../../contexts/InspectionFormProvider";
import { OPENING_PROCEDURES } from "../../../utils/innerPackagingProcedures";
import { getContainerTypeLabel } from "../../../utils/innerPackagingParser";

const OpeningProcedures = ({ navigation }: { navigation: any }) => {
  const { inspection, updateInnerPackagingField } = useInspectionForm();

  const containerType = inspection?.innerPackagingInspection?.containerType;
  const procedures = containerType ? OPENING_PROCEDURES[containerType] : [];

  const handleContinue = () => {
    // Set openedAt timestamp
    updateInnerPackagingField("openedAt", new Date());

    // Navigate to inner packaging inspection
    navigation.navigate("InnerPackagingInspection");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!containerType) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <Card containerStyle={styles.card}>
            <Text style={styles.errorText}>
              No container type selected. Please go back and select a container
              type.
            </Text>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>Opening Procedures</Card.Title>
          <Card.Divider />

          {/* Container type banner */}
          <View style={styles.containerTypeBanner}>
            <Text style={styles.containerTypeText}>
              Container Type: {getContainerTypeLabel(containerType)}
            </Text>
          </View>

          {/* Instructions */}
          {/* <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Follow these procedures to open the container:
            </Text>
            <Text style={styles.instructionsSubtitle}>
              (Check each step as you complete it)
            </Text>
          </View> */}

          {/* Procedure steps */}
          <View style={styles.stepsContainer}>
            {procedures.map((step, index) => (
              <View
                key={step.id}
                style={[
                  styles.stepCard,
                  step.isWarning && styles.warningStepCard,
                ]}
              >
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepTextContainer}>
                    <Text
                      style={[
                        styles.stepText,
                        step.isWarning && styles.warningStepText,
                        step.critical && styles.criticalStepText,
                      ]}
                    >
                      {step.instruction}
                    </Text>
                    {step.isWarning && (
                      <View style={styles.warningBadge}>
                        <Text style={styles.warningBadgeText}>⚠️ WARNING</Text>
                      </View>
                    )}
                    <Text style={styles.afmanReference}>
                      Reference: {step.afmanRef}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Important note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>Important:</Text>
            <Text style={styles.noteText}>
              Do not physically damage the package or perform any function that
              adversely affects the integrity or original performance capability
              of the packaging.
            </Text>
            <Text style={styles.noteText}>
              Noncompliance with any of these procedures constitutes repacking
              and requires a new shipper's certification.
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 16,
  },
  card: {
    margin: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerTypeBanner: {
    backgroundColor: "#2196f3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  containerTypeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  instructionsContainer: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  instructionsSubtitle: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
  stepsContainer: {
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    padding: 12,
  },
  warningStepCard: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffc107",
    borderWidth: 2,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumberContainer: {
    backgroundColor: "#2196f3",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  warningStepText: {
    fontWeight: "600",
  },
  criticalStepText: {
    fontWeight: "500",
  },
  warningBadge: {
    backgroundColor: "#ffc107",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  warningBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#856404",
  },
  afmanReference: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  noteContainer: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1976d2",
  },
  noteText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    gap: 12,
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
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default OpeningProcedures;
