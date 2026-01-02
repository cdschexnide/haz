import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import {
  DryIceShipmentData,
  DryIceInspectionItem,
  VerificationStatus,
} from "../../../src/types/dryIceInspection";
import {
  generateDryIceInspectionItems,
  getDefaultFrustrationMessage,
} from "../../../src/utils/dryIceInspectionItems";
import { useHazProStore } from "../../../src/stores/useHazProStore";

interface InspectorDryIceScreenProps {
  navigation: any;
  route?: {
    params?: {
      dryIceData?: DryIceShipmentData;
    };
  };
}

export default function InspectorDryIceScreen({
  navigation,
  route,
}: InspectorDryIceScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  // Get SDDG Key 16 quantity data for dry ice inspection
  const getSDDGQuantityPacking = (): string | undefined => {
    const verificationData = inspection?.verificationCopy;
    const extractedData = inspection?.extractedContent;

    // Try to get quantity and packing from verification data or extracted content
    const quantityPacking =
      verificationData?.quantityAndPacking || extractedData?.quantityAndPacking;

    return quantityPacking;
  };

  const inspectionItems = useMemo(() => {
    const sddgQuantityPacking = getSDDGQuantityPacking();
    return generateDryIceInspectionItems(sddgQuantityPacking);
  }, [inspection]);

  const [items, setItems] = useState<DryIceInspectionItem[]>(inspectionItems);

  const currentItem = items[currentStep];
  const totalSteps = items.length;

  // Get dry ice frustrations from context
  const packageFrustrations = inspection?.packageFrustrations || [];
  const dryIceFrustrations = packageFrustrations.filter(
    f => f.category === "dryice"
  );
  const currentFrustration = dryIceFrustrations.find(
    f => f.itemId === currentItem?.id
  );

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    if (currentStep < totalSteps) {
      setIsEditMode(false);
      setAdditionalComments(currentFrustration?.additionalComments || "");
    }
  }, [currentStep, currentFrustration]);

  const handleValidate = () => {
    // Remove any existing frustration from context
    if (currentFrustration) {
      removePackageFrustration(currentItem.id);
    }

    // Update item status
    setItems(prev =>
      prev.map(item =>
        item.id === currentItem.id
          ? { ...item, verificationStatus: "pass" as VerificationStatus }
          : item
      )
    );

    // Move to next step or complete inspection
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step validated - navigate to package markings
      navigation.navigate("InspectorPackageVerification");
    }
  };

  const handleFrustrate = () => {
    // Switch to edit mode to add comments
    setIsEditMode(true);
    setAdditionalComments(currentFrustration?.additionalComments || "");
  };

  const handleSaveFrustration = () => {
    // Create frustration data compatible with PackageFrustrationRecord
    const frustrationData = {
      category: "dryice" as const,
      itemId: currentItem.id,
      itemLabel: currentItem.label,
      expectedValues: [currentItem.description], // Use description as expected value
      verificationStatus: "incorrect" as const, // Dry ice failures are typically incorrect rather than missing
      defaultMessage: getDefaultFrustrationMessage(currentItem.id),
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentItem.requirement,
    };

    console.log(
      "🧊 [DryIceScreen] Creating frustration for dry ice item:",
      currentItem.id
    );
    addPackageFrustration(frustrationData);

    // Update item status
    setItems(prev =>
      prev.map(item =>
        item.id === currentItem.id
          ? { ...item, verificationStatus: "fail" as VerificationStatus }
          : item
      )
    );

    setIsEditMode(false);

    // Move to next step or complete inspection
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step frustrated - navigate to package markings
      navigation.navigate("InspectorPackageVerification");
    }
  };

  const handleCancelFrustration = () => {
    setIsEditMode(false);
  };

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No inspection items available</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dry Ice Inspection</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {!isEditMode ? (
          <>
            <View style={styles.fieldContent}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{currentItem.label}</Text>
              </View>

              <Text style={styles.extractedLabel}>Description:</Text>
              <View style={styles.previewContainer}>
                <Text style={styles.previewText}>
                  {currentItem.description}
                </Text>
              </View>

              <Text style={styles.requirementText}>
                {currentItem.requirement}
              </Text>

              {currentFrustration && (
                <View style={styles.frustrationIndicator}>
                  <MaterialIcons name="error" size={20} color="#FF3B30" />
                  <Text style={styles.frustrationText}>
                    Previously Frustrated
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.complianceButtons}>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={handleValidate}
              >
                <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
                <Text style={styles.validateButtonText}>Validate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.frustrateButton}
                onPress={handleFrustrate}
              >
                <MaterialIcons name="cancel" size={24} color="#FFFFFF" />
                <Text style={styles.frustrateButtonText}>Frustrate</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Frustration Edit Mode UI */
          <>
            <View style={styles.fieldContent}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{currentItem.label}</Text>
                <MaterialIcons name="error" size={24} color="#FF3B30" />
              </View>

              <Text style={styles.frustrationLabel}>Frustration Details:</Text>

              <View style={styles.defaultMessageContainer}>
                <Text style={styles.defaultMessageLabel}>Default Message:</Text>
                <Text style={styles.defaultMessage}>
                  {getDefaultFrustrationMessage(currentItem.id)}
                </Text>
              </View>

              <Text style={styles.commentsLabel}>
                Additional Comments (Optional):
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={additionalComments}
                  onChangeText={setAdditionalComments}
                  placeholder="Add specific compliance issues or notes..."
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelFrustration}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveFrustration}
              >
                <Text style={styles.saveButtonText}>Save Frustration</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === 0 && styles.navButtonDisabled,
          ]}
          onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <MaterialIcons
            name="chevron-left"
            size={24}
            color={currentStep === 0 ? "#C7C7CC" : "#007AFF"}
          />
          <Text
            style={[
              styles.navButtonText,
              currentStep === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {currentStep + 1} of {totalSteps}
          </Text>
          <View style={styles.stepDots}>
            {Array.from({ length: totalSteps }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  index === currentStep && styles.stepDotActive,
                  items[index]?.verificationStatus === "pass" &&
                    styles.stepDotPass,
                  items[index]?.verificationStatus === "fail" &&
                    styles.stepDotFail,
                ]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (currentStep < totalSteps - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              // Navigate to package markings when manually completing
              navigation.navigate("InspectorPackageVerification");
            }
          }}
        >
          <Text style={styles.navButtonText}>
            {currentStep < totalSteps - 1 ? "Next" : "Complete"}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  fieldContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldHeader: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  extractedLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  previewContainer: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  requirementText: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
    marginBottom: 16,
  },
  frustrationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  frustrationText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  complianceButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  validateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustrateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
  },
  frustrateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustrationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 16,
  },
  defaultMessageContainer: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  defaultMessageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 4,
  },
  defaultMessage: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#3C3C43",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  navButtonTextDisabled: {
    color: "#C7C7CC",
  },
  stepIndicator: {
    alignItems: "center",
  },
  stepText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  stepDots: {
    flexDirection: "row",
    gap: 4,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C7C7CC",
  },
  stepDotActive: {
    backgroundColor: "#007AFF",
  },
  stepDotPass: {
    backgroundColor: "#4CAF50",
  },
  stepDotFail: {
    backgroundColor: "#FF3B30",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
