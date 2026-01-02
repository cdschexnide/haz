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

const ExceptedQuantityPackagingGuidance = ({ navigation }: { navigation: any }) => {
  const { state } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;
  const eqData = state.hazProPreparerContext.exceptedQuantityData;

  const handleContinue = () => {
    navigation.navigate("ExceptedQuantityMarkingPreview");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="package-variant" size={48} color="#ffffff" />
        <Text style={styles.headerTitle}>Excepted Quantity Packaging</Text>
        <Text style={styles.headerSubtitle}>
          Follow these simplified packaging requirements for Excepted Quantities
        </Text>
      </View>

      {/* Exemptions Granted */}
      <View style={styles.exemptionCard}>
        <View style={styles.exemptionHeader}>
          <Ionicons name="checkmark-circle" size={32} color="#10b981" />
          <Text style={styles.exemptionTitle}>Exemptions Granted</Text>
        </View>
        <Text style={styles.exemptionText}>
          Because this shipment qualifies as an Excepted Quantity, you are EXEMPT from:
        </Text>
        <View style={styles.exemptionList}>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.exemptionItemText}>
              UN specification packaging (no POP marking required)
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.exemptionItemText}>Hazard labels</Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.exemptionItemText}>
              Shipper's Declaration for Dangerous Goods (SDDG)
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.exemptionItemText}>Certification signature</Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.exemptionItemText}>
              Compatibility and segregation requirements
            </Text>
          </View>
        </View>
      </View>

      {/* Inner Packaging Requirements */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="package" size={24} color={colors.brandColorPrimary} />
          <Text style={styles.cardTitle}>Inner Packaging Requirements</Text>
        </View>
        <Text style={styles.cardSubtitle}>Per A19.2.3 - A19.2.5</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Material:</Text> Plastic (≥0.2mm thickness), glass,
              earthenware, stoneware, or metal
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Compatibility:</Text> Must not react dangerously with
              contents or be weakened by them
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Closure:</Text> Securely closed to prevent leakage during
              normal transport conditions
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>For Liquids:</Text> Must not completely fill packaging at
              55°C (131°F) - leave expansion space
            </Text>
          </View>
        </View>
      </View>

      {/* Intermediate/Cushioning Packaging */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={24}
            color={colors.brandColorPrimary}
          />
          <Text style={styles.cardTitle}>Intermediate Packaging & Protection</Text>
        </View>
        <Text style={styles.cardSubtitle}>Per A19.2.6 - A19.2.7</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Cushioning:</Text> Inner packages must be secured with
              suitable cushioning materials
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Absorbent (for liquids):</Text> Sufficient absorbent
              material to absorb entire contents if liquid
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Separation:</Text> Individual inner packages must not
              contact each other
            </Text>
          </View>
        </View>
      </View>

      {/* Outer Packaging Requirements */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="package-variant"
            size={24}
            color={colors.brandColorPrimary}
          />
          <Text style={styles.cardTitle}>Outer Packaging Requirements</Text>
        </View>
        <Text style={styles.cardSubtitle}>Per A19.2.8</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Construction:</Text> Strong, rigid outer packaging
              (fiberboard box, wooden box, etc.)
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Minimum Dimensions:</Text> At least 100mm x 100mm (4 inches
              x 4 inches)
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Drop Test:</Text> Must withstand 1.8m (6 feet) drop test
              without breaking inner packages
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Stack Test:</Text> Must support weight of 3m (10 feet)
              stack for 24 hours without collapse
            </Text>
          </View>
        </View>
      </View>

      {/* Important Notes */}
      <View style={[styles.card, { backgroundColor: "#fef3c7", borderColor: "#fbbf24", borderWidth: 2 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={[styles.cardTitle, { color: "#92400e" }]}>Important Notes</Text>
        </View>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.requirementText, { color: "#78350f" }]}>
              Do NOT mix excepted quantities with standard hazardous materials
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.requirementText, { color: "#78350f" }]}>
              Multiple excepted quantities in one outer package: calculate Q-value (n₁/M₁ + n₂/M₂ ≤
              1.0)
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.requirementText, { color: "#78350f" }]}>
              Package must still meet general air transport safety requirements (A3.1.2)
            </Text>
          </View>
        </View>
      </View>

      {/* Quantity Summary */}
      {eqData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Package Quantities</Text>
          <View style={styles.quantitySummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Inner Packages:</Text>
              <Text style={styles.summaryValue}>{eqData.numberOfInnerPackages}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Per Inner Package:</Text>
              <Text style={styles.summaryValue}>
                {eqData.quantityPerInnerPackage.value} {eqData.quantityPerInnerPackage.unit}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Quantity:</Text>
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

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue to Marking Requirements</Text>
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
    marginBottom: 12,
    gap: 12,
  },
  exemptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#065f46",
  },
  exemptionText: {
    fontSize: 14,
    color: "#047857",
    marginBottom: 12,
  },
  exemptionList: {
    gap: 8,
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
  quantitySummary: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  kitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 8,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  kitBadgeText: {
    fontSize: 13,
    color: "#065f46",
    fontWeight: "500",
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

export default ExceptedQuantityPackagingGuidance;
