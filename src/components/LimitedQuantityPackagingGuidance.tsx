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

const LimitedQuantityPackagingGuidance = ({ navigation }: { navigation: any }) => {
  const { state } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;
  const lqData = state.hazProPreparerContext.limitedQuantityData;

  const handleContinue = () => {
    navigation.navigate("LabelingAndMarking");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="package-variant-closed" size={48} color="#ffffff" />
        <Text style={styles.headerTitle}>Limited Quantity Packaging</Text>
        <Text style={styles.headerSubtitle}>
          Follow these requirements for Limited Quantities
        </Text>
      </View>

      {/* Exemptions Granted */}
      <View style={styles.exemptionCard}>
        <View style={styles.exemptionHeader}>
          <Ionicons name="checkmark-circle" size={32} color="#f59e0b" />
          <Text style={styles.exemptionTitle}>Exemptions Granted</Text>
        </View>
        <Text style={styles.exemptionText}>
          Because this shipment qualifies as a Limited Quantity, you are EXEMPT from:
        </Text>
        <View style={styles.exemptionList}>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
            <Text style={styles.exemptionItemText}>
              UN specification packaging (no POP marking required)
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
            <Text style={styles.exemptionItemText}>
              DOT/UN performance specification testing
            </Text>
          </View>
        </View>

        <Text style={[styles.exemptionText, { marginTop: 16 }]}>
          However, you are STILL REQUIRED to provide:
        </Text>
        <View style={styles.exemptionList}>
          <View style={styles.exemptionItem}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={[styles.exemptionItemText, { color: "#dc2626" }]}>
              Hazard labels (per Attachment 15)
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={[styles.exemptionItemText, { color: "#dc2626" }]}>
              Shipper's Declaration for Dangerous Goods (SDDG)
            </Text>
          </View>
          <View style={styles.exemptionItem}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={[styles.exemptionItemText, { color: "#dc2626" }]}>
              Certification signature
            </Text>
          </View>
        </View>
      </View>

      {/* Packaging Type Requirement */}
      <View style={[styles.card, { backgroundColor: "#fef3c7", borderColor: "#fbbf24", borderWidth: 2 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={[styles.cardTitle, { color: "#92400e" }]}>REQUIRED: Combination Packaging Only</Text>
        </View>
        <Text style={[styles.requirementText, { color: "#78350f", fontSize: 15, fontWeight: "500" }]}>
          Limited Quantities MUST use combination packaging. Single/composite packaging is NOT permitted.
        </Text>
      </View>

      {/* Inner Packaging Requirements */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="package" size={24} color={colors.brandColorPrimary} />
          <Text style={styles.cardTitle}>Inner Packaging Requirements</Text>
        </View>
        <Text style={styles.cardSubtitle}>Per A19.3.4</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Material:</Text> Suitable for the hazardous material (plastic, glass, metal, etc.)
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Compatibility:</Text> Must not react dangerously with contents
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Closure:</Text> Securely closed to prevent leakage
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Quantity Limits:</Text> See your specific limits below
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
        <Text style={styles.cardSubtitle}>Per A19.3.4</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Construction:</Text> Strong outer packaging (fiberboard box, wooden box, etc.)
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Gross Weight Limit:</Text> Maximum 30 kg (66 lbs) per package
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Drop Test:</Text> Must withstand 1.2m (4 feet) drop without breaking inner packages
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Stack Test:</Text> Must support weight of 3m (10 feet) stack for 24 hours
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>No POP Marking:</Text> UN specification markings are NOT required
            </Text>
          </View>
        </View>
      </View>

      {/* Cushioning/Protection */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="shield-check"
            size={24}
            color={colors.brandColorPrimary}
          />
          <Text style={styles.cardTitle}>Cushioning & Protection</Text>
        </View>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Cushioning:</Text> Inner packages must be secured with suitable cushioning materials
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Absorbent (for liquids):</Text> Sufficient absorbent material to absorb entire liquid contents
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              <Text style={styles.bold}>Separation:</Text> Individual inner packages must not contact each other
            </Text>
          </View>
        </View>
      </View>

      {/* Air Eligibility */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="airplane" size={24} color={colors.brandColorPrimary} />
          <Text style={styles.cardTitle}>Air Transport Eligibility</Text>
        </View>
        <Text style={styles.cardSubtitle}>Per A19.3.4 & A3.1.7</Text>

        <View style={styles.requirementsList}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              Package must meet general air-eligible requirements
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              No cargo aircraft only (CAO) marking allowed
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.requirementBullet} />
            <Text style={styles.requirementText}>
              Material must not be forbidden for air transport
            </Text>
          </View>
        </View>
      </View>

      {/* Quantity Limits */}
      {lqData && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="scale" size={24} color={colors.brandColorPrimary} />
            <Text style={styles.cardTitle}>Your Package Quantity Limits</Text>
          </View>

          <View style={styles.limitsGrid}>
            <View style={styles.limitCard}>
              <Text style={styles.limitLabel}>Inner Package Limit</Text>
              <Text style={styles.limitValue}>
                {lqData.limits.maxInner.value} {lqData.limits.maxInner.unit}
              </Text>
              <Text style={styles.limitCurrent}>
                Your quantity: {lqData.quantityPerInnerPackage.value} {lqData.quantityPerInnerPackage.unit}
              </Text>
            </View>

            <View style={styles.limitCard}>
              <Text style={styles.limitLabel}>Per Package Limit</Text>
              <Text style={styles.limitValue}>
                {lqData.limits.maxPerPackage.value} {lqData.limits.maxPerPackage.unit}
              </Text>
              <Text style={styles.limitCurrent}>
                Your quantity: {lqData.totalPerPackage.value} {lqData.totalPerPackage.unit}
              </Text>
            </View>

            <View style={styles.limitCard}>
              <Text style={styles.limitLabel}>Gross Weight Limit</Text>
              <Text style={styles.limitValue}>
                {lqData.limits.maxGrossWeight.value} {lqData.limits.maxGrossWeight.unit}
              </Text>
              <Text style={styles.limitCurrent}>
                Your weight: {lqData.grossWeight.value} {lqData.grossWeight.unit}
              </Text>
            </View>
          </View>
        </View>
      )}

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
              Do NOT mix limited quantities with standard hazardous materials
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.requirementText, { color: "#78350f" }]}>
              When mixing multiple limited quantity materials, use the most restrictive limit
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.requirementText, { color: "#78350f" }]}>
              Gross weight must not exceed 30 kg (66 lbs) regardless of material type
            </Text>
          </View>

          <View style={styles.requirementItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#f59e0b" />
            <Text style={[styles.requirementText, { color: "#78350f" }]}>
              You will still need to complete labeling, SDDG, and certification in the following screens
            </Text>
          </View>
        </View>
      </View>

      {/* What's Next */}
      <View style={[styles.card, { backgroundColor: "#eff6ff", borderColor: "#3b82f6", borderWidth: 2 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color="#1d4ed8" />
          <Text style={[styles.cardTitle, { color: "#1e3a8a" }]}>What's Next?</Text>
        </View>

        <View style={styles.nextStepsList}>
          <View style={styles.nextStepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Labeling Requirements</Text>
              <Text style={styles.stepDesc}>
                You'll review and apply hazard labels (still required for LQ)
              </Text>
            </View>
          </View>

          <View style={styles.nextStepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Shipper's Declaration</Text>
              <Text style={styles.stepDesc}>
                Complete the SDDG form (still required for LQ)
              </Text>
            </View>
          </View>

          <View style={styles.nextStepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Certification & Signature</Text>
              <Text style={styles.stepDesc}>
                Sign and certify your shipment (still required for LQ)
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue to Labeling Requirements</Text>
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
    backgroundColor: "#f59e0b",
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
    backgroundColor: "#fef3c7",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f59e0b",
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
    color: "#92400e",
  },
  exemptionText: {
    fontSize: 14,
    color: "#78350f",
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
    color: "#92400e",
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
  limitsGrid: {
    gap: 12,
  },
  limitCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  limitLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  limitValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  limitCurrent: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "500",
  },
  nextStepsList: {
    gap: 16,
    marginTop: 12,
  },
  nextStepItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 18,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f59e0b",
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

export default LimitedQuantityPackagingGuidance;
