/**
 * Inner Packaging Inspection Screen
 *
 * Core inspection checklist for inner packagings.
 * 6 inspection items from AFMAN 24-604 A28.2.1.2
 */

import React, { useState, useMemo } from "react";
import { StyleSheet, View, ScrollView, TextInput, Alert } from "react-native";
import { Button, Text, Card } from "react-native-elements";
import { useInspectionForm } from "../../../contexts/InspectionFormProvider";
import {
  areAllInspectionItemsCompleted,
  createInnerPackagingFrustration,
  requiresLeakProofLiner,
  checkIfMaterialIsLiquid,
} from "../../../utils/innerPackagingInspection";

const InnerPackagingInspection = ({ navigation }: { navigation: any }) => {
  const {
    inspection,
    updateInnerPackagingInspectionItem,
    updateInnerPackagingField,
    addPackageFrustration,
  } = useInspectionForm();

  const inspectionItems =
    inspection?.innerPackagingInspection?.inspectionItems || [];
  const [inspectorNotes, setInspectorNotes] = useState(
    inspection?.innerPackagingInspection?.inspectorNotes || ""
  );

  // Determine if leak-proof liner is required for this shipment
  const linerRequired = useMemo(
    () => requiresLeakProofLiner(inspection),
    [inspection]
  );
  const isLiquid = useMemo(
    () => checkIfMaterialIsLiquid(inspection),
    [inspection]
  );

  /**
   * Get enhanced label with additional context for specific inspection items
   */
  const getItemLabel = (item: typeof inspectionItems[0]): string => {
    // Enhance absorbent material item for liquids
    if (item.id === "inner-absorbent-cushioning" && isLiquid) {
      return `${item.label} (required for liquids)`;
    }

    // Enhance leak-proof liner item when required
    if (item.id === "inner-leak-proof-liner" && linerRequired) {
      return `${item.label} (REQUIRED - liquid in non-liquid-tight packaging)`;
    }

    return item.label;
  };

  const handleStatusChange = (
    itemId: string,
    status: "pass" | "fail" | "not-applicable"
  ) => {
    // Update the item status
    updateInnerPackagingInspectionItem(itemId, status);

    // If status is 'fail', create a frustration
    if (status === "fail") {
      const item = inspectionItems.find(i => i.id === itemId);
      if (item) {
        const frustration = createInnerPackagingFrustration({
          ...item,
          status,
        });
        addPackageFrustration(frustration);
      }
    }
  };

  const handleContinue = () => {
    // Validate all items are completed
    if (!areAllInspectionItemsCompleted(inspectionItems)) {
      Alert.alert(
        "Incomplete Inspection",
        "Please mark all inspection items as Pass, Fail, or N/A before continuing."
      );
      return;
    }

    // Save inspector notes
    updateInnerPackagingField("inspectorNotes", inspectorNotes);

    // Set inspectedAt timestamp
    updateInnerPackagingField("inspectedAt", new Date());

    // Navigate to closing procedures
    navigation.navigate("ClosingProcedures");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>
          Inner Packaging Inspection Checklist
        </Card.Title>
        <Card.Divider />

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Visual Inspection Only</Text>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Do not rearrange inner packaging contents or configuration
            </Text>
            <Text style={styles.warningText}>
              ⚠️ Do not cut wraps or barrier material
            </Text>
            <Text style={styles.warningText}>
              ⚠️ Any change to the inner configuration is considered repacking
            </Text>
          </View>
        </View>

        {/* Inspection items */}
        {inspectionItems.map((item, index) => {
          const isLinerItem = item.id === "inner-leak-proof-liner";
          const showLinerRequired = isLinerItem && linerRequired;

          return (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                showLinerRequired && styles.itemCardHighlighted,
              ]}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>{index + 1}</Text>
                <View style={styles.itemLabelContainer}>
                  <Text style={styles.itemLabel}>{getItemLabel(item)}</Text>
                  <Text style={styles.itemReference}>
                    Ref: {item.afmanReference}
                  </Text>
                  {showLinerRequired && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredBadgeText}>
                        ⚠️ REQUIRED BY AFMAN 24-604
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Status buttons */}
              <View style={styles.statusButtonsContainer}>
                <Button
                  title="Pass"
                  buttonStyle={[
                    styles.statusButton,
                    styles.passButton,
                    item.status === "pass" && styles.passButtonActive,
                  ]}
                  titleStyle={[
                    styles.statusButtonText,
                    item.status === "pass" && styles.statusButtonTextActive,
                  ]}
                  onPress={() => handleStatusChange(item.id, "pass")}
                />
                <Button
                  title="Fail"
                  buttonStyle={[
                    styles.statusButton,
                    styles.failButton,
                    item.status === "fail" && styles.failButtonActive,
                  ]}
                  titleStyle={[
                    styles.statusButtonText,
                    item.status === "fail" && styles.statusButtonTextActive,
                  ]}
                  onPress={() => handleStatusChange(item.id, "fail")}
                />
                <Button
                  title="N/A"
                  buttonStyle={[
                    styles.statusButton,
                    styles.naButton,
                    item.status === "not-applicable" && styles.naButtonActive,
                  ]}
                  titleStyle={[
                    styles.statusButtonText,
                    item.status === "not-applicable" &&
                      styles.statusButtonTextActive,
                  ]}
                  onPress={() => handleStatusChange(item.id, "not-applicable")}
                />
              </View>

              {/* Show warning if failed */}
              {item.status === "fail" && (
                <View style={styles.failedWarning}>
                  <Text style={styles.failedWarningText}>
                    ⚠️ This item will be recorded as a package frustration
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Inspector notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Inspector Notes (Optional):</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            value={inspectorNotes}
            onChangeText={setInspectorNotes}
            placeholder="Add any additional observations or notes about the inner packaging inspection..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            buttonStyle={styles.backButton}
            onPress={handleBack}
          />
          <Button
            title="Continue to Closing"
            buttonStyle={styles.continueButton}
            onPress={handleContinue}
            disabled={!areAllInspectionItemsCompleted(inspectionItems)}
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
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
  },
  itemCardHighlighted: {
    backgroundColor: "#fff9e6",
    borderColor: "#ffc107",
    borderWidth: 2,
  },
  itemHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  itemNumber: {
    backgroundColor: "#2196f3",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: "center",
    lineHeight: 32,
    marginRight: 12,
  },
  itemLabelContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
    lineHeight: 22,
  },
  itemReference: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  requiredBadge: {
    backgroundColor: "#ffc107",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  requiredBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#856404",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  passButton: {
    backgroundColor: "#fff",
    borderColor: "#28a745",
  },
  passButtonActive: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  failButton: {
    backgroundColor: "#fff",
    borderColor: "#dc3545",
  },
  failButtonActive: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },
  naButton: {
    backgroundColor: "#fff",
    borderColor: "#6c757d",
  },
  naButtonActive: {
    backgroundColor: "#6c757d",
    borderColor: "#6c757d",
  },
  failedWarning: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  failedWarningText: {
    color: "#721c24",
    fontSize: 13,
    fontWeight: "500",
  },
  notesContainer: {
    marginVertical: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    minHeight: 100,
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
  continueButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
});

export default InnerPackagingInspection;
