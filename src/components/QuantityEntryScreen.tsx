import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  isHazardousMaterialExceptedQuantity,
  IsHazardousMaterialExceptedQuantityInput,
} from "../../server/attachment19/exceptedQuantities/isHazardousMaterialExceptedQuantity";
import {
  isHazardousMaterialLimitedQuantity,
  IsHazardousMaterialLimitedQuantityInput,
} from "../../server/attachment19/limitedQuantities/isHazardousMaterialLimitedQuantity";
import { ExceptedQuantityData, LimitedQuantityData } from "../../types";

type EligibilityStatus = "excepted" | "limited" | "standard" | "checking";

interface QuantityFormData {
  numberOfInnerPackages: string;
  quantityPerInnerPackage: string;
  quantityPerInnerPackageUnit: "mL" | "g" | "L" | "kg";
  totalQuantity: string;
  totalQuantityUnit: "mL" | "g" | "L" | "kg";
  grossWeight: string;
  grossWeightUnit: "kg" | "lbs";
  isInKit: boolean;
}

const QuantityEntryScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, actions } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;

  const [formData, setFormData] = useState<QuantityFormData>({
    numberOfInnerPackages: "",
    quantityPerInnerPackage: "",
    quantityPerInnerPackageUnit: "mL",
    totalQuantity: "",
    totalQuantityUnit: "mL",
    grossWeight: "",
    grossWeightUnit: "kg",
    isInKit: false,
  });

  const [eligibilityStatus, setEligibilityStatus] =
    useState<EligibilityStatus>("checking");
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  // Validate EQ/LQ eligibility whenever form data changes
  useEffect(() => {
    const validateEligibility = async () => {
      if (!material) return;

      // Skip validation if required fields are empty
      if (
        !formData.numberOfInnerPackages ||
        !formData.quantityPerInnerPackage ||
        !formData.totalQuantity
      ) {
        setEligibilityStatus("checking");
        setValidationMessage("Enter quantities to check eligibility");
        return;
      }

      setIsValidating(true);

      try {
        // Convert values to numbers
        const numberOfInnerPackages = parseInt(
          formData.numberOfInnerPackages,
          10
        );
        const quantityPerInner = parseFloat(formData.quantityPerInnerPackage);
        const totalQty = parseFloat(formData.totalQuantity);
        const grossWeightValue = parseFloat(formData.grossWeight || "0");

        // Check Excepted Quantity eligibility first
        const isLiquid = material.physicalState?.toLowerCase() === "liquid";
        const eqInput: IsHazardousMaterialExceptedQuantityInput = {
          material: material,
          containedInChemicalKitOrFirstAidKit: formData.isInKit,
          innerPackagingQuantityIn_mLs: isLiquid ? quantityPerInner : undefined,
          outerPackagingQuantityIn_mLs: isLiquid ? totalQty : undefined,
          innerPackagingQuantityIn_grams: !isLiquid
            ? quantityPerInner
            : undefined,
          outerPackagingQuantityIn_grams: !isLiquid ? totalQty : undefined,
        };

        const eqResult = isHazardousMaterialExceptedQuantity(eqInput);

        // If EQ validation returns undefined, it means eligible (all checks passed)
        if (typeof eqResult === "undefined") {
          setEligibilityStatus("excepted");
          setValidationMessage(
            "✅ Eligible for Excepted Quantity - Major exemptions apply!"
          );

          // Store EQ data
          const eqData: ExceptedQuantityData = {
            eligible: true,
            isInKit: formData.isInKit,
            numberOfInnerPackages: numberOfInnerPackages,
            quantityPerInnerPackage: {
              value: quantityPerInner,
              unit: formData.quantityPerInnerPackageUnit as "mL" | "g",
            },
            totalOuterQuantity: {
              value: totalQty,
              unit: formData.totalQuantityUnit,
            },
            exceedsLimits: false,
            limits: {
              maxInner: {
                value: 0,
                unit: formData.quantityPerInnerPackageUnit,
              },
              maxOuter: { value: 0, unit: formData.totalQuantityUnit },
            },
          };
          actions.updateExceptedQuantityData(eqData);
          actions.setIsExceptedQuantity(true);
          actions.setIsLimitedQuantity(false);
          return;
        }

        // EQ not eligible, check Limited Quantity
        const lqInput: IsHazardousMaterialLimitedQuantityInput = {
          materials: [
            {
              material: material,
              packagingQuantities: {
                physicalState: material.physicalState,
                innerPackagingVolumeIn_mL: isLiquid
                  ? quantityPerInner
                  : undefined,
                innerPackagingQuantityIn_g: !isLiquid
                  ? quantityPerInner
                  : undefined,
                quantityPerPackageIn_mL: isLiquid ? totalQty : undefined,
                quantityPerPackageIn_g: !isLiquid ? totalQty : undefined,
                grossQuantityPerPackageIn_kg:
                  formData.grossWeightUnit === "kg"
                    ? grossWeightValue
                    : grossWeightValue * 0.453592,
              },
            },
          ],
        };

        const lqResult = isHazardousMaterialLimitedQuantity(lqInput);

        if (lqResult && lqResult.isLimited) {
          setEligibilityStatus("limited");
          setValidationMessage(
            "⚡ Eligible for Limited Quantity - Some exemptions apply"
          );

          // Store LQ data
          const lqData: LimitedQuantityData = {
            eligible: true,
            permissionReason: lqResult.reason,
            quantityPerInnerPackage: {
              value: quantityPerInner,
              unit: formData.quantityPerInnerPackageUnit,
            },
            totalPerPackage: {
              value: totalQty,
              unit: formData.totalQuantityUnit,
            },
            grossWeight: {
              value: grossWeightValue,
              unit: formData.grossWeightUnit,
            },
            exceedsLimits: false,
            limits: {
              maxInner: {
                value: 0,
                unit: formData.quantityPerInnerPackageUnit,
              },
              maxPerPackage: { value: 0, unit: formData.totalQuantityUnit },
              maxGrossWeight: { value: 30, unit: "kg" },
            },
          };
          actions.updateLimitedQuantityData(lqData);
          actions.setIsLimitedQuantity(true);
          actions.setIsExceptedQuantity(false);
        } else {
          // Standard quantity
          setEligibilityStatus("standard");
          const reason =
            eqResult?.reason ||
            lqResult?.reason ||
            "Does not meet EQ or LQ criteria";
          setValidationMessage(`📦 Standard Quantity: ${reason}`);
          actions.setIsExceptedQuantity(false);
          actions.setIsLimitedQuantity(false);
        }
      } catch (error) {
        console.error("Error validating EQ/LQ eligibility:", error);
        setEligibilityStatus("standard");
        setValidationMessage(
          "⚠️ Validation error - defaulting to Standard Quantity"
        );
      } finally {
        setIsValidating(false);
      }
    };

    // Debounce validation to avoid excessive calls
    const timer = setTimeout(validateEligibility, 300);
    return () => clearTimeout(timer);
  }, [formData, material]);

  const handleContinue = () => {
    if (!material) return;

    // Navigate based on eligibility status
    switch (eligibilityStatus) {
      case "excepted":
        navigation.navigate("ExceptedQuantityPackagingGuidance");
        break;
      case "limited":
        navigation.navigate("LimitedQuantityPackagingGuidance");
        break;
      case "standard":
        navigation.navigate("GeneralPackagingAcknowledgement");
        break;
      default:
        alert("Please enter valid quantities before continuing");
    }
  };

  const getStatusBadgeStyle = () => {
    switch (eligibilityStatus) {
      case "excepted":
        return { backgroundColor: "#10b981", text: "EXCEPTED QUANTITY" };
      case "limited":
        return { backgroundColor: "#f59e0b", text: "LIMITED QUANTITY" };
      case "standard":
        return { backgroundColor: "#3b82f6", text: "STANDARD QUANTITY" };
      default:
        return { backgroundColor: "#6b7280", text: "CHECKING ELIGIBILITY..." };
    }
  };

  const statusBadge = getStatusBadgeStyle();

  if (!material) {
    return (
      <View style={styles.container}>
        <Text>
          No hazardous material selected. Please go back and select a material.
        </Text>
      </View>
    );
  }

  const isFormValid =
    formData.numberOfInnerPackages !== "" &&
    formData.quantityPerInnerPackage !== "" &&
    formData.totalQuantity !== "";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Quantity Entry</Text>
        <Text style={styles.headerSubtitle}>
          Enter package quantities to determine eligibility for special
          provisions
        </Text>
      </View>

      {/* Material Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selected Hazardous Material</Text>
        <View style={styles.materialInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UN Number:</Text>
            <Text style={styles.infoValue}>{material.unid}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Proper Shipping Name:</Text>
            <Text style={styles.infoValue}>{material.properShippingName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hazard Class:</Text>
            <Text style={styles.infoValue}>{material.hazclassDiv}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Packing Group:</Text>
            <Text style={styles.infoValue}>
              {material.packingGroup || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Kit Exception */}
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Chemical or First-Aid Kit?</Text>
            <Text style={styles.switchDescription}>
              Check if this material is part of a chemical or first-aid kit
            </Text>
          </View>
          <Switch
            value={formData.isInKit}
            onValueChange={value =>
              setFormData({ ...formData, isInKit: value })
            }
            trackColor={{ false: "#d1d5db", true: colors.brandColorPrimary }}
            thumbColor={formData.isInKit ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Quantity Inputs */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Package Quantities</Text>

        <Text style={styles.inputLabel}>Number of Inner Packages *</Text>
        <TextInput
          style={styles.input}
          value={formData.numberOfInnerPackages}
          onChangeText={value =>
            setFormData({ ...formData, numberOfInnerPackages: value })
          }
          keyboardType="numeric"
          placeholder="e.g., 10"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.inputLabel}>Quantity per Inner Package *</Text>
        <View style={styles.quantityRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={formData.quantityPerInnerPackage}
            onChangeText={value =>
              setFormData({ ...formData, quantityPerInnerPackage: value })
            }
            keyboardType="decimal-pad"
            placeholder="e.g., 100"
            placeholderTextColor="#9ca3af"
          />
          <Picker
            style={[styles.picker, { flex: 1 }]}
            selectedValue={formData.quantityPerInnerPackageUnit}
            onValueChange={value =>
              setFormData({
                ...formData,
                quantityPerInnerPackageUnit: value as "mL" | "g" | "L" | "kg",
              })
            }
          >
            <Picker.Item label="mL" value="mL" />
            <Picker.Item label="L" value="L" />
            <Picker.Item label="g" value="g" />
            <Picker.Item label="kg" value="kg" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Total Quantity (all packages) *</Text>
        <View style={styles.quantityRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={formData.totalQuantity}
            onChangeText={value =>
              setFormData({ ...formData, totalQuantity: value })
            }
            keyboardType="decimal-pad"
            placeholder="e.g., 1000"
            placeholderTextColor="#9ca3af"
          />
          <Picker
            style={[styles.picker, { flex: 1 }]}
            selectedValue={formData.totalQuantityUnit}
            onValueChange={value =>
              setFormData({
                ...formData,
                totalQuantityUnit: value as "mL" | "g" | "L" | "kg",
              })
            }
          >
            <Picker.Item label="mL" value="mL" />
            <Picker.Item label="L" value="L" />
            <Picker.Item label="g" value="g" />
            <Picker.Item label="kg" value="kg" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Estimated Gross Weight (optional)</Text>
        <Text style={styles.inputHint}>
          Required for Limited Quantity eligibility (max 30 kg / 66 lbs)
        </Text>
        <View style={styles.quantityRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={formData.grossWeight}
            onChangeText={value =>
              setFormData({ ...formData, grossWeight: value })
            }
            keyboardType="decimal-pad"
            placeholder="e.g., 25"
            placeholderTextColor="#9ca3af"
          />
          <Picker
            style={[styles.picker, { flex: 1 }]}
            selectedValue={formData.grossWeightUnit}
            onValueChange={value =>
              setFormData({
                ...formData,
                grossWeightUnit: value as "kg" | "lbs",
              })
            }
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lbs" value="lbs" />
          </Picker>
        </View>
      </View>

      {/* Eligibility Status Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusBadge.backgroundColor },
        ]}
      >
        <View style={styles.statusBadgeContent}>
          {isValidating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MaterialCommunityIcons
              name="information"
              size={24}
              color="#ffffff"
            />
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.statusBadgeTitle}>{statusBadge.text}</Text>
            <Text style={styles.statusBadgeMessage}>{validationMessage}</Text>
          </View>
        </View>
      </View>

      {/* Explanation of what each status means */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What does this mean?</Text>

        <View style={styles.explanationItem}>
          <View
            style={[styles.explanationBadge, { backgroundColor: "#10b981" }]}
          >
            <Text style={styles.explanationBadgeText}>EQ</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.explanationTitle}>Excepted Quantity</Text>
            <Text style={styles.explanationText}>
              • No UN specification packaging required{"\n"}• No hazard labels
              required{"\n"}• No SDDG or certification signature required{"\n"}•
              Special "E" marking only
            </Text>
          </View>
        </View>

        <View style={styles.explanationItem}>
          <View
            style={[styles.explanationBadge, { backgroundColor: "#f59e0b" }]}
          >
            <Text style={styles.explanationBadgeText}>LQ</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.explanationTitle}>Limited Quantity</Text>
            <Text style={styles.explanationText}>
              • No UN specification packaging (no POP marking){"\n"}• Hazard
              labels still required{"\n"}• SDDG and certification still required
              {"\n"}• Max gross weight: 30 kg (66 lbs)
            </Text>
          </View>
        </View>

        <View style={styles.explanationItem}>
          <View
            style={[styles.explanationBadge, { backgroundColor: "#3b82f6" }]}
          >
            <Text style={styles.explanationBadgeText}>STD</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.explanationTitle}>Standard Quantity</Text>
            <Text style={styles.explanationText}>
              • Full UN specification packaging required{"\n"}• All labeling and
              marking requirements apply{"\n"}• SDDG and certification required
              {"\n"}• Follow standard preparation workflow
            </Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          !isFormValid && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!isFormValid}
      >
        <Text style={styles.continueButtonText}>
          {eligibilityStatus === "excepted"
            ? "Continue to Excepted Quantity Guidance"
            : eligibilityStatus === "limited"
            ? "Continue to Limited Quantity Guidance"
            : "Continue to Standard Workflow"}
        </Text>
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
    // backgroundColor: colors.brandColorPrimary,
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "black",
    opacity: 0.9,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  materialInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: "#6b7280",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
    marginBottom: 6,
  },
  inputHint: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  quantityRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  statusBadge: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  statusBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadgeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statusBadgeMessage: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.95,
  },
  explanationItem: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  explanationBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  explanationBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandColorPrimary,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default QuantityEntryScreen;
