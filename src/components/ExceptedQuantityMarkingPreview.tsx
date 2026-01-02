import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";

const ExceptedQuantityMarkingPreview = ({ navigation }: { navigation: any }) => {
  const { state } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;
  const shipment = state.hazProPreparerContext.shipment;
  const eqData = state.hazProPreparerContext.exceptedQuantityData;

  // Get shipper or consignee name for the marking
  const shipperOrConsigneeName =
    shipment?.shipper?.name ||
    shipment?.consignee?.name ||
    "SHIPPER/CONSIGNEE NAME";

  // Get hazard class/division
  const hazardClass = material?.hazclassDiv || "*";

  const handleContinue = () => {
    navigation.navigate("ExceptedQuantityConfirmationScreen");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="label-variant" size={48} color="#ffffff" />
        <Text style={styles.headerTitle}>Excepted Quantity Marking</Text>
        <Text style={styles.headerSubtitle}>
          Apply the special "E" marking to your package
        </Text>
      </View>

      {/* Marking Requirements Overview */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color={colors.brandColorPrimary} />
          <Text style={styles.cardTitle}>Marking Requirements</Text>
        </View>
        <Text style={styles.cardSubtitle}>Per AFMAN 24-604, Figure A19.1</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Dimensions:</Text> At least 100mm x 100mm (4 inches x 4 inches)
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Background:</Text> White or other suitable contrasting background
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Hatching:</Text> Red or black diagonal hatching
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Letter "E":</Text> Must be clearly visible and prominent
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Class/Division:</Text> Replace "*" with hazard class: {hazardClass}
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Name:</Text> Replace "**" with shipper or consignee name
            </Text>
          </View>
        </View>
      </View>

      {/* Visual Marking Preview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Marking Preview</Text>
        <Text style={styles.previewNote}>
          This is a scaled-down preview. Actual marking must be at least 100mm x 100mm.
        </Text>

        <View style={styles.markingPreviewContainer}>
          <Svg width="280" height="280" viewBox="0 0 280 280">
            {/* White background */}
            <Rect x="0" y="0" width="280" height="280" fill="#ffffff" stroke="#000000" strokeWidth="3" />

            {/* Black border */}
            <Rect x="5" y="5" width="270" height="270" fill="none" stroke="#000000" strokeWidth="2" />

            {/* Red diagonal hatching (multiple lines) */}
            {Array.from({ length: 20 }).map((_, i) => {
              const offset = i * 20;
              return (
                <React.Fragment key={`hatch-${i}`}>
                  {/* Top-left to bottom-right diagonal lines */}
                  <Line
                    x1={offset}
                    y1="0"
                    x2={offset + 280}
                    y2="280"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                  {/* Bottom-left to top-right diagonal lines */}
                  <Line
                    x1={offset}
                    y1="280"
                    x2={offset + 280}
                    y2="0"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </React.Fragment>
              );
            })}

            {/* Large "E" in the center */}
            <SvgText
              x="140"
              y="150"
              fontSize="120"
              fontWeight="bold"
              fill="#000000"
              textAnchor="middle"
            >
              E
            </SvgText>

            {/* Hazard Class/Division (replacing *) */}
            <SvgText
              x="140"
              y="40"
              fontSize="20"
              fontWeight="600"
              fill="#000000"
              textAnchor="middle"
            >
              {hazardClass}
            </SvgText>

            {/* Shipper/Consignee Name (replacing **) - truncated if too long */}
            <SvgText
              x="140"
              y="260"
              fontSize="14"
              fontWeight="500"
              fill="#000000"
              textAnchor="middle"
            >
              {shipperOrConsigneeName.substring(0, 25)}
            </SvgText>
            {shipperOrConsigneeName.length > 25 && (
              <SvgText
                x="140"
                y="273"
                fontSize="14"
                fontWeight="500"
                fill="#000000"
                textAnchor="middle"
              >
                {shipperOrConsigneeName.substring(25, 50)}
              </SvgText>
            )}
          </Svg>
        </View>
      </View>

      {/* Your Package Details */}
      {eqData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Package Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>UN Number:</Text>
              <Text style={styles.detailValue}>{material?.unid}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Proper Shipping Name:</Text>
              <Text style={styles.detailValue}>{material?.properShippingName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hazard Class/Division:</Text>
              <Text style={styles.detailValue}>{hazardClass}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Quantity:</Text>
              <Text style={styles.detailValue}>
                {eqData.totalOuterQuantity.value} {eqData.totalOuterQuantity.unit}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Number of Inner Packages:</Text>
              <Text style={styles.detailValue}>{eqData.numberOfInnerPackages}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Application Instructions */}
      <View style={[styles.card, { backgroundColor: "#eff6ff", borderColor: "#3b82f6", borderWidth: 2 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="build" size={24} color="#1d4ed8" />
          <Text style={[styles.cardTitle, { color: "#1e3a8a" }]}>How to Apply This Marking</Text>
        </View>

        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={[styles.requirementText, { color: "#1e40af" }]}>
              Print or create the marking at least 100mm x 100mm (4" x 4")
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={[styles.requirementText, { color: "#1e40af" }]}>
              Use white or contrasting background with red or black diagonal hatching
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={[styles.requirementText, { color: "#1e40af" }]}>
              Replace "*" with the hazard class: <Text style={styles.bold}>{hazardClass}</Text>
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <Text style={[styles.requirementText, { color: "#1e40af" }]}>
              Replace "**" with shipper or consignee name: <Text style={styles.bold}>{shipperOrConsigneeName}</Text>
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>5</Text>
            </View>
            <Text style={[styles.requirementText, { color: "#1e40af" }]}>
              Apply marking to outer package surface, clearly visible
            </Text>
          </View>
        </View>
      </View>

      {/* Important Reminder */}
      <View style={[styles.card, { backgroundColor: "#fef3c7", borderColor: "#fbbf24", borderWidth: 2 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={[styles.cardTitle, { color: "#92400e" }]}>Important Reminder</Text>
        </View>
        <Text style={[styles.requirementText, { color: "#78350f", marginTop: 8 }]}>
          This "E" marking is the ONLY marking required for Excepted Quantities. You do NOT need:
        </Text>
        <View style={styles.exemptionList}>
          <View style={styles.exemptionItem}>
            <Ionicons name="close-circle" size={18} color="#dc2626" />
            <Text style={[styles.exemptionItemText, { color: "#78350f" }]}>
              POP marking (Proper Shipping Name, UN#, etc.)
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="close-circle" size={18} color="#dc2626" />
            <Text style={[styles.exemptionItemText, { color: "#78350f" }]}>
              Hazard labels
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="close-circle" size={18} color="#dc2626" />
            <Text style={[styles.exemptionItemText, { color: "#78350f" }]}>
              Orientation arrows
            </Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue to Final Confirmation</Text>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </TouchableOpacity>

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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 12,
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
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    fontStyle: "italic",
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: "row",
    gap: 10,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandColorPrimary,
    marginTop: 7,
  },
  requirementText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
    color: "#1f2937",
  },
  previewNote: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 16,
  },
  markingPreviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  instructionsList: {
    gap: 16,
    marginTop: 12,
  },
  instructionItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  exemptionList: {
    gap: 8,
    marginTop: 8,
  },
  exemptionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  exemptionItemText: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: "500",
    flex: 1,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ExceptedQuantityMarkingPreview;
