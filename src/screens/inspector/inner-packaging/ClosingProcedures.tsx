/**
 * Closing Procedures Screen
 *
 * Displays container-specific closing procedures.
 * Determines if new shipper's certification is required.
 * Dynamic content based on container type.
 */

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Text, Card, CheckBox } from "react-native-elements";
import { useInspectionForm } from "../../../contexts/InspectionFormProvider";
import {
  CLOSING_PROCEDURES,
  FIBERBOARD_RECLOSURE_METHODS,
} from "../../../utils/innerPackagingProcedures";
import { getContainerTypeLabel } from "../../../utils/innerPackagingParser";
import {
  determineNewCertificationRequired,
  calculateOverallStatus,
} from "../../../utils/innerPackagingInspection";

const ClosingProcedures = ({ navigation }: { navigation: any }) => {
  const { inspection, updateInnerPackagingField } = useInspectionForm();

  const containerType = inspection?.innerPackagingInspection?.containerType;
  const inspectionItems =
    inspection?.innerPackagingInspection?.inspectionItems || [];
  const procedures = containerType ? CLOSING_PROCEDURES[containerType] : [];

  // Track which steps user has checked (for UI feedback only, not persisted)
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [reclosureMethod, setReclosureMethod] = useState("");

  const toggleStep = (stepId: string) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleComplete = () => {
    // Validate reclosure method for fiberboard
    if (containerType === "fiberboard-box" && !reclosureMethod) {
      Alert.alert(
        "Reclosure Method Required",
        "Please select the reclosure method for the fiberboard box."
      );
      return;
    }

    // Calculate if new certification is required
    const certRequired = determineNewCertificationRequired(
      containerType,
      reclosureMethod
    );

    // Calculate overall status based on inspection items
    const overallStatus = calculateOverallStatus(inspectionItems);

    // Update state
    updateInnerPackagingField("closedAt", new Date());
    updateInnerPackagingField("reclosureMethod", reclosureMethod || "N/A");
    updateInnerPackagingField("newCertificationRequired", certRequired);
    updateInnerPackagingField("overallStatus", overallStatus);

    // Navigate to package verification screen (original step 7)
    navigation.navigate("InspectorPackageVerification");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!containerType) {
    return (
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Text style={styles.errorText}>
            No container type found. Please go back and restart the inspection.
          </Text>
          <Button title="Go Back" onPress={handleBack} />
        </Card>
      </View>
    );
  }

  const newCertRequired = determineNewCertificationRequired(
    containerType,
    reclosureMethod
  );

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Closing Procedures</Card.Title>
        <Card.Divider />

        {/* Container type banner */}
        <View style={styles.containerTypeBanner}>
          <Text style={styles.containerTypeText}>
            Container Type: {getContainerTypeLabel(containerType)}
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>
            Follow these procedures to close the container:
          </Text>
          <Text style={styles.instructionsSubtitle}>
            (Check each step as you complete it)
          </Text>
        </View>

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
                <CheckBox
                  checked={checkedSteps[step.id] || false}
                  onPress={() => toggleStep(step.id)}
                  containerStyle={styles.checkbox}
                />
                <View style={styles.stepContentContainer}>
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
            </View>
          ))}
        </View>

        {/* Reclosure method selector for fiberboard boxes */}
        {containerType === "fiberboard-box" && (
          <View style={styles.reclosureContainer}>
            <Text style={styles.reclosureTitle}>Reclosure Method:</Text>
            <Text style={styles.reclosureSubtitle}>
              Select how the box was reclosed (affects certification
              requirement):
            </Text>
            {FIBERBOARD_RECLOSURE_METHODS.map(method => (
              <TouchableOpacity
                key={method.value}
                style={[
                  styles.reclosureOption,
                  reclosureMethod === method.value &&
                    styles.reclosureOptionSelected,
                ]}
                onPress={() => setReclosureMethod(method.value)}
              >
                <View style={styles.radioCircle}>
                  {reclosureMethod === method.value && (
                    <View style={styles.radioCircleSelected} />
                  )}
                </View>
                <View style={styles.reclosureTextContainer}>
                  <Text style={styles.reclosureLabel}>{method.label}</Text>
                  <Text
                    style={[
                      styles.reclosureCertText,
                      method.requiresCertification &&
                        styles.reclosureCertRequired,
                    ]}
                  >
                    {method.requiresCertification
                      ? "❌ New certification REQUIRED"
                      : "✅ No new certification required"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Certification requirement notice */}
        <View
          style={[
            styles.certificationNotice,
            newCertRequired
              ? styles.certificationRequired
              : styles.certificationNotRequired,
          ]}
        >
          <Text style={styles.certificationTitle}>
            {newCertRequired
              ? "❌ NEW SHIPPER'S CERTIFICATION REQUIRED"
              : "✅ No New Certification Required"}
          </Text>
          <Text style={styles.certificationText}>
            {newCertRequired
              ? "Reclosing this container is considered repacking. A new shipper's certification must be completed before transport."
              : "Based on DOD testing and AFMAN procedures, the packaging is considered returned to original condition."}
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            buttonStyle={styles.backButton}
            onPress={handleBack}
          />
          <Button
            title="Complete Inner Packaging Inspection"
            buttonStyle={styles.completeButton}
            onPress={handleComplete}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerTypeBanner: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  containerTypeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
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
  checkbox: {
    margin: 0,
    padding: 0,
    marginRight: 10,
  },
  stepContentContainer: {
    flex: 1,
    flexDirection: "row",
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
  reclosureContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  reclosureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  reclosureSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  reclosureOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  reclosureOptionSelected: {
    borderColor: "#2196f3",
    backgroundColor: "#e3f2fd",
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2196f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioCircleSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#2196f3",
  },
  reclosureTextContainer: {
    flex: 1,
  },
  reclosureLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  reclosureCertText: {
    fontSize: 13,
    color: "#28a745",
    fontWeight: "500",
  },
  reclosureCertRequired: {
    color: "#dc3545",
  },
  certificationNotice: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
  },
  certificationRequired: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
  },
  certificationNotRequired: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  certificationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 100,
  },
  completeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ClosingProcedures;
