import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const ExceptedQuantityConfirmationScreen = ({ navigation }: { navigation: any }) => {
  const { state, actions } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;
  const shipment = state.hazProPreparerContext.shipment;
  const eqData = state.hazProPreparerContext.exceptedQuantityData;

  const handleCompleteShipment = async () => {
    try {
      // Save the shipment with isExceptedQuantity flag set to true
      // This should already be set from QuantityEntryScreen, but we ensure it here
      actions.setIsExceptedQuantity(true);

      // TODO: Save shipment to database
      // await saveShipmentToDatabase(state.hazProPreparerContext);

      Alert.alert(
        "Shipment Complete!",
        "Your Excepted Quantity shipment has been prepared. No signature or SDDG required.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear the preparer context for next shipment
              // actions.clearHazProPreparerContext();

              // Navigate back to home
              navigation.navigate("PreparerHomeStack");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error completing shipment:", error);
      Alert.alert(
        "Error",
        "Failed to save shipment. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      "Go Back?",
      "Are you sure you want to go back? You'll need to review the marking requirements again.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Go Back", onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.checkmarkCircle}>
          <Ionicons name="checkmark" size={60} color="#ffffff" />
        </View>
        <Text style={styles.headerTitle}>Almost Complete!</Text>
        <Text style={styles.headerSubtitle}>
          Review your Excepted Quantity shipment details
        </Text>
      </View>

      {/* Shipment Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="package-variant" size={24} color={colors.brandColorPrimary} />
          <Text style={styles.cardTitle}>Shipment Summary</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>UN Number:</Text>
            <Text style={styles.summaryValue}>{material?.unid}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Proper Shipping Name:</Text>
            <Text style={styles.summaryValue}>{material?.properShippingName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hazard Class/Division:</Text>
            <Text style={styles.summaryValue}>{material?.hazclassDiv}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Packing Group:</Text>
            <Text style={styles.summaryValue}>{material?.packingGroup || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Quantity Details */}
      {eqData && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="scale" size={24} color={colors.brandColorPrimary} />
            <Text style={styles.cardTitle}>Quantity Details</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Number of Inner Packages:</Text>
              <Text style={styles.summaryValue}>{eqData.numberOfInnerPackages}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity per Inner Package:</Text>
              <Text style={styles.summaryValue}>
                {eqData.quantityPerInnerPackage.value} {eqData.quantityPerInnerPackage.unit}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Outer Quantity:</Text>
              <Text style={styles.summaryValue}>
                {eqData.totalOuterQuantity.value} {eqData.totalOuterQuantity.unit}
              </Text>
            </View>
            {eqData.isInKit && (
              <View style={styles.kitBadge}>
                <Ionicons name="medkit" size={16} color="#059669" />
                <Text style={styles.kitBadgeText}>Chemical/First-Aid Kit Exception Applied</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Exemptions Granted */}
      <View style={styles.exemptionCard}>
        <View style={styles.exemptionHeader}>
          <Ionicons name="checkmark-circle" size={32} color="#10b981" />
          <Text style={styles.exemptionTitle}>Exemptions Granted</Text>
        </View>
        <Text style={styles.exemptionSubtitle}>
          Per AFMAN 24-604, Attachment 19, Section A19.2.13.3
        </Text>
        <Text style={styles.exemptionText}>
          Because this qualifies as an Excepted Quantity, you are EXEMPT from:
        </Text>
        <View style={styles.exemptionList}>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.exemptionItemTitle}>UN Specification Packaging</Text>
              <Text style={styles.exemptionItemDesc}>
                No need for DOT/UN certified packaging with POP markings
              </Text>
            </View>
          </View>

          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.exemptionItemTitle}>Hazard Labels</Text>
              <Text style={styles.exemptionItemDesc}>
                No primary or subsidiary hazard labels required
              </Text>
            </View>
          </View>

          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.exemptionItemTitle}>Shipper's Declaration for Dangerous Goods (SDDG)</Text>
              <Text style={styles.exemptionItemDesc}>
                No SDDG form required
              </Text>
            </View>
          </View>

          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.exemptionItemTitle}>Certification Signature</Text>
              <Text style={styles.exemptionItemDesc}>
                No certification or signature required - Complete now!
              </Text>
            </View>
          </View>

          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.exemptionItemTitle}>Compatibility Requirements</Text>
              <Text style={styles.exemptionItemDesc}>
                Exempt from hazmat compatibility and segregation rules
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* What You Still Need */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="list" size={24} color="#f59e0b" />
          <Text style={[styles.cardTitle, { color: "#92400e" }]}>What You Still Need</Text>
        </View>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementNumber}>
              <Text style={styles.requirementNumberText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.requirementTitle}>Packaging Requirements</Text>
              <Text style={styles.requirementDesc}>
                Follow the packaging requirements shown in the previous screen (inner packaging, cushioning, outer packaging, drop/stack tests)
              </Text>
            </View>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementNumber}>
              <Text style={styles.requirementNumberText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.requirementTitle}>Special "E" Marking</Text>
              <Text style={styles.requirementDesc}>
                Apply the "E" marking (at least 100mm x 100mm) with hazard class "{material?.hazclassDiv}" and shipper/consignee name
              </Text>
            </View>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementNumber}>
              <Text style={styles.requirementNumberText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.requirementTitle}>General Air Transport Safety</Text>
              <Text style={styles.requirementDesc}>
                Package must still meet general safety requirements for air transport (A3.1.2)
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Important Notes */}
      <View style={[styles.card, { backgroundColor: "#fef3c7", borderColor: "#fbbf24", borderWidth: 2 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={[styles.cardTitle, { color: "#92400e" }]}>Important Notes</Text>
        </View>

        <View style={styles.notesList}>
          <View style={styles.noteItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.noteText, { color: "#78350f" }]}>
              Do NOT mix excepted quantities with standard hazardous materials in the same outer package
            </Text>
          </View>

          <View style={styles.noteItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.noteText, { color: "#78350f" }]}>
              Ensure all packaging requirements are met before shipping
            </Text>
          </View>

          <View style={styles.noteItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.noteText, { color: "#78350f" }]}>
              Keep records of your excepted quantity shipments for compliance
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={20} color={colors.brandColorPrimary} />
          <Text style={styles.backButtonText}>Review Marking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteShipment}>
          <Text style={styles.completeButtonText}>Complete Shipment</Text>
          <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  headerContainer: {
    backgroundColor: "#10b981",
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.95,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  summaryGrid: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  kitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  kitBadgeText: {
    fontSize: 13,
    color: "#065f46",
    fontWeight: "500",
  },
  exemptionCard: {
    backgroundColor: "#ecfdf5",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10b981",
  },
  exemptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  exemptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#065f46",
  },
  exemptionSubtitle: {
    fontSize: 11,
    color: "#047857",
    fontStyle: "italic",
    marginBottom: 8,
  },
  exemptionText: {
    fontSize: 14,
    color: "#047857",
    marginBottom: 12,
  },
  exemptionList: {
    gap: 16,
  },
  exemptionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  exemptionItemTitle: {
    fontSize: 15,
    color: "#065f46",
    fontWeight: "600",
    marginBottom: 2,
  },
  exemptionItemDesc: {
    fontSize: 13,
    color: "#047857",
    lineHeight: 18,
  },
  requirementsList: {
    gap: 16,
    marginTop: 8,
  },
  requirementItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  requirementNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  requirementNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  requirementTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  requirementDesc: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  notesList: {
    gap: 12,
    marginTop: 8,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  noteText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: colors.brandColorPrimary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brandColorPrimary,
  },
  completeButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ExceptedQuantityConfirmationScreen;
