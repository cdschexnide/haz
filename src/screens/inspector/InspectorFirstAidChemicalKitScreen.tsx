import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { KitInspectionItem } from "../../types/sddg";
import { useHazProStore } from "../../stores/useHazProStore";
import {
  hazardousMaterialsList,
  HazardousMaterialItem,
} from "../../hazardousMaterials/hazardousMaterialsList";

interface InspectorFirstAidChemicalKitScreenProps {
  navigation: any;
}

// AFMAN 24-604 A13.18 First Aid Kit and Chemical Kit Inspection Conditions
const FIRST_AID_CHEMICAL_KIT_INSPECTION_CONDITIONS = [
  {
    id: "kit-purpose-verification",
    label: "Kit purpose verification",
    description:
      "Verify kit contains small amounts of various hazardous materials used for medical, analytical, or testing purposes",
    afmanRef: "AFMAN 24-604 A13.18.1",
  },
  {
    id: "most-stringent-packing-group",
    label: "Most stringent packing group assigned",
    description:
      "Verify the packing group assigned to the kit as a whole is the most stringent PG assigned to any individual substance in the kit",
    afmanRef: "AFMAN 24-604 A13.18.1.1",
  },
  {
    id: "contents-compatibility",
    label: "Contents compatibility verified",
    description:
      "Verify the contents of the kit are of such a nature and so packed that there is no possibility of the mixture of contents causing dangerous evolution of heat or gas",
    afmanRef: "AFMAN 24-604 A13.18.1.2",
  },
  {
    id: "limited-excepted-quantities-only",
    label: "Limited and excepted quantities only",
    description:
      "Verify only hazardous materials authorized as limited quantities (A19.3.2) and excepted quantities (A19.2) are included, with inner packaging requirements of A19.2.3 met",
    afmanRef: "AFMAN 24-604 A13.18.1.3",
  },
  {
    id: "inner-receptacle-size-compliance",
    label: "Inner receptacle size compliance",
    description:
      "Verify inner receptacles are no more than 250mL for liquids or 250g for solids. For Division 5.2 (organic peroxide) Types D, E and F only: no more than 125mL for liquids or 250g for solids",
    afmanRef: "AFMAN 24-604 A13.18.2.1",
  },
  {
    id: "total-quantity-limits",
    label: "Total quantity limits compliance",
    description:
      "Verify total quantity of hazardous material in any one kit does not exceed 1L for liquids or 1kg for solids. Total quantity of dangerous goods in any one package does not exceed 10kg",
    afmanRef: "AFMAN 24-604 A13.18.2.2",
  },
  {
    id: "outer-packaging-protection",
    label: "Outer packaging protection verified",
    description:
      "Verify inner receptacles are protected from other materials in the kit and packed in approved outer packaging: wood (4C1/4C2), plywood (4D), reconstituted wood (4F), expanded plastic (4H1), solid plastic (4H2), fiberboard (4G), steel (4A), or aluminum (4B) box",
    afmanRef: "AFMAN 24-604 A13.18.2.3",
  },
  {
    id: "limited-quantities-table-compliance",
    label: "Limited quantities table compliance",
    description:
      "Verify compliance with Table A19.2 Note 1 for limited quantities of hazardous material in Chemical or First Aid Kits",
    afmanRef: "AFMAN 24-604 A13.18.3",
  },
];

const KIT_CONTENTS_STEP = {
  id: "kit-contents",
  type: "kit-contents" as const,
  label: "Kit contents",
  description:
    "Add each hazardous material contained in the kit to derive required labels.",
  afmanRef: "AFMAN 24-604 A15.4.7.2",
};

export default function InspectorFirstAidChemicalKitScreen({
  navigation,
}: InspectorFirstAidChemicalKitScreenProps) {
  const {
    inspection,
    addPackageFrustration,
    removePackageFrustration,
    setKitInspectionData,
  } = useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [kitContents, setKitContents] = useState<KitInspectionItem[]>(
    inspection?.kitInspectionData?.contents || []
  );

  const inspectionSteps = useMemo(
    () => [
      KIT_CONTENTS_STEP,
      ...FIRST_AID_CHEMICAL_KIT_INSPECTION_CONDITIONS.map(condition => ({
        ...condition,
        type: "condition" as const,
      })),
    ],
    []
  );
  const totalSteps = inspectionSteps.length;
  const currentStepItem = inspectionSteps[currentStep];
  const isKitContentsStep = currentStepItem.type === "kit-contents";
  const currentCondition = isKitContentsStep ? null : currentStepItem;

  // Get current UN ID for verification
  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;
  const properShippingName =
    inspection?.verificationCopy?.properShippingName ||
    inspection?.extractedContent?.properShippingName;

  // Get existing package frustrations for first aid/chemical kit
  const existingFrustrations =
    inspection?.packageFrustrations?.filter(
      f => f.category === "first-aid-chemical-kit"
    ) || [];
  const frustratedCount = existingFrustrations.length;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  console.log("🧰 [InspectorFirstAidChemicalKit] Component rendered");
  console.log("🧰 [InspectorFirstAidChemicalKit] UN ID:", unId);
  console.log("🧰 [InspectorFirstAidChemicalKit] PSN:", properShippingName);
  console.log("🧰 [InspectorFirstAidChemicalKit] Current step:", currentStep);
  console.log(
    "🧰 [InspectorFirstAidChemicalKit] Existing frustrations:",
    existingFrustrations.length
  );

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE =
    "This UN3316 first aid kit or chemical kit packaging requirement is not met. Requires re-inspection per AFMAN 24-604 A13.18.";

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    // Reset edit mode when changing steps
    setIsEditMode(false);
    setAdditionalComments("");
  }, [currentStep]);

  useEffect(() => {
    const incomingContents = inspection?.kitInspectionData?.contents;
    if (!incomingContents) return;
    const isSame =
      incomingContents.length === kitContents.length &&
      incomingContents.every(
        (item, index) =>
          item.unid === kitContents[index]?.unid &&
          item.hazardClass === kitContents[index]?.hazardClass &&
          item.subsidiaryRisk === kitContents[index]?.subsidiaryRisk
      );
    if (!isSame) {
      setKitContents(incomingContents);
    }
  }, [inspection?.kitInspectionData?.contents, kitContents]);

  useEffect(() => {
    if (!properShippingName) return;
    const kitType = properShippingName.toUpperCase().includes("FIRST AID")
      ? "FIRST AID KIT"
      : "CHEMICAL KIT";
    const existing = inspection?.kitInspectionData;
    const hasSameContents =
      existing &&
      existing.kitType === kitType &&
      existing.contents.length === kitContents.length &&
      existing.contents.every(
        (item, index) =>
          item.unid === kitContents[index]?.unid &&
          item.hazardClass === kitContents[index]?.hazardClass &&
          item.subsidiaryRisk === kitContents[index]?.subsidiaryRisk
      );
    if (!hasSameContents) {
      setKitInspectionData({
        kitType,
        contents: kitContents,
      });
    }
  }, [inspection?.kitInspectionData, kitContents, properShippingName, setKitInspectionData]);

  const handleValidate = () => {
    if (isKitContentsStep || !currentCondition) return;

    // Remove any existing frustration for this condition
    removePackageFrustration(currentCondition.id);

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFrustrate = () => {
    if (isKitContentsStep) return;

    // Switch to edit mode to add comments
    setIsEditMode(true);
    setAdditionalComments(currentFrustration?.additionalComments || "");
  };

  const handleSaveFrustration = () => {
    if (!currentCondition) return;

    // Save the frustration
    const frustrationData = {
      category: "first-aid-chemical-kit" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorFirstAidChemicalKit] Saving frustration for condition:",
      currentCondition.id
    );
    addPackageFrustration(frustrationData);

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleCancelFrustration = () => {
    setIsEditMode(false);
    setAdditionalComments("");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKitContentsContinue = () => {
    if (kitContents.length === 0) {
      Alert.alert(
        "Kit contents required",
        "Add at least one hazardous material to continue."
      );
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleFinalSubmit = () => {
    console.log("🚨 [InspectorFirstAidChemicalKit] handleFinalSubmit called");

    const currentFrustrations =
      inspection?.packageFrustrations?.filter(
        f => f.category === "first-aid-chemical-kit"
      ) || [];
    const currentFrustratedCount = currentFrustrations.length;

    console.log(
      "🚨 [InspectorFirstAidChemicalKit] frustratedCount:",
      currentFrustratedCount
    );

    if (currentFrustratedCount === 0) {
      // No frustrations - proceed to package frustration summary
      Alert.alert(
        "UN3316 First Aid/Chemical Kit Inspection Complete",
        "All packaging requirements have been validated successfully.\\n\\nNo compliance issues were found. Proceeding to package summary.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "default",
            onPress: () => {
              navigation.navigate("InspectorAttachment28WizardScreen");
            },
          },
        ]
      );
    } else {
      // Has frustrations - navigate to package markings screen
      navigation.navigate("InspectorAttachment28WizardScreen");
    }
  };

  // Verify this is UN3316
  if (unId !== "UN3316") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for first aid/chemical kit inspection
          </Text>
          <Text style={styles.errorSubText}>
            Expected UN3316, found: {unId || "Unknown"}
          </Text>
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

  if (!inspection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No inspection data available</Text>
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

  const getHeaderTitle = () => {
    if (properShippingName?.toLowerCase().includes("first aid")) {
      return "UN3316 First Aid Kit";
    } else if (properShippingName?.toLowerCase().includes("chemical")) {
      return "UN3316 Chemical Kit";
    }
    return "UN3316 First Aid/Chemical Kit";
  };

  const filteredMaterials = useMemo(() => {
    if (searchQuery.trim().length < 3) return [];
    const query = searchQuery.toLowerCase();
    return hazardousMaterialsList
      .filter(material =>
        material.unid.toLowerCase().includes(query) ||
        material.properShippingName.toLowerCase().includes(query)
      )
      .slice(0, 20);
  }, [searchQuery]);

  const addKitItem = (material: HazardousMaterialItem) => {
    setKitContents(prev => {
      if (prev.some(item => item.unid === material.unid)) {
        return prev;
      }
      return [
        ...prev,
        {
          unid: material.unid,
          properShippingName: material.properShippingName,
          hazardClass: material.hazclassDiv,
          subsidiaryRisk: material.subsidiaryRisk || "",
        },
      ];
    });
    setSearchQuery("");
  };

  const removeKitItem = (unidToRemove: string) => {
    setKitContents(prev => prev.filter(item => item.unid !== unidToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <Text style={styles.stepIndicator}>
            {currentStep + 1}/{totalSteps}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentStep + 1) / totalSteps) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.mainContent}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Current Condition */}
            <View style={styles.fieldCard}>
              {isKitContentsStep ? (
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {KIT_CONTENTS_STEP.label}
                      </Text>
                    </View>

                    <Text style={styles.descriptionLabel}>
                      Inspection Requirement:
                    </Text>
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewText}>
                        {KIT_CONTENTS_STEP.description}
                      </Text>
                    </View>

                    <View style={styles.afmanReference}>
                      <MaterialIcons name="book" size={16} color="#007AFF" />
                      <Text style={styles.afmanReferenceText}>
                        {KIT_CONTENTS_STEP.afmanRef}
                      </Text>
                    </View>

                    <View style={styles.searchContainer}>
                      <MaterialIcons name="search" size={18} color="#8E8E93" />
                      <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search by UN or name (min 3 chars)"
                        autoCapitalize="characters"
                      />
                    </View>

                    {filteredMaterials.length > 0 && (
                      <View style={styles.searchResults}>
                        {filteredMaterials.map(material => (
                          <TouchableOpacity
                            key={material.unid}
                            style={styles.searchResultItem}
                            onPress={() => addKitItem(material)}
                          >
                            <Text style={styles.searchResultText}>
                              {material.unid} - {material.properShippingName}
                            </Text>
                            <Text style={styles.searchResultSubtext}>
                              Class {material.hazclassDiv}
                              {material.subsidiaryRisk
                                ? ` / Subsidiary ${material.subsidiaryRisk}`
                                : ""}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <View style={styles.selectedList}>
                      <Text style={styles.selectedListLabel}>
                        Selected kit contents ({kitContents.length})
                      </Text>
                      {kitContents.length === 0 ? (
                        <Text style={styles.selectedEmptyText}>
                          No items added yet.
                        </Text>
                      ) : (
                        kitContents.map(item => (
                          <View key={item.unid} style={styles.selectedItem}>
                            <View style={styles.selectedItemText}>
                              <Text style={styles.selectedItemTitle}>
                                {item.unid} - {item.properShippingName}
                              </Text>
                              <Text style={styles.selectedItemSubtitle}>
                                Class {item.hazardClass}
                                {item.subsidiaryRisk
                                  ? ` / Subsidiary ${item.subsidiaryRisk}`
                                  : ""}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => removeKitItem(item.unid)}
                            >
                              <MaterialIcons
                                name="close"
                                size={20}
                                color="#FF3B30"
                              />
                            </TouchableOpacity>
                          </View>
                        ))
                      )}
                    </View>
                  </View>

                  <View style={styles.complianceButtons}>
                    <TouchableOpacity
                      style={[
                        styles.validateButton,
                        kitContents.length === 0 &&
                          styles.validateButtonDisabled,
                      ]}
                      onPress={handleKitContentsContinue}
                      disabled={kitContents.length === 0}
                    >
                      <MaterialIcons
                        name="arrow-forward"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text style={styles.validateButtonText}>Continue</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : !isEditMode ? (
                /* Review Mode UI */
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {currentCondition?.label}
                      </Text>
                    </View>

                    <Text style={styles.descriptionLabel}>
                      Inspection Requirement:
                    </Text>
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewText}>
                        {currentCondition?.description}
                      </Text>
                    </View>

                    <View style={styles.afmanReference}>
                      <MaterialIcons name="book" size={16} color="#007AFF" />
                      <Text style={styles.afmanReferenceText}>
                        {currentCondition?.afmanRef}
                      </Text>
                    </View>

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
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color="#FFFFFF"
                      />
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
                      <Text style={styles.fieldLabel}>
                        {currentCondition?.label}
                      </Text>
                      <MaterialIcons name="error" size={24} color="#FF3B30" />
                    </View>

                    <Text style={styles.frustrationLabel}>
                      Frustration Details:
                    </Text>

                    <View style={styles.defaultMessageContainer}>
                      <Text style={styles.defaultMessageLabel}>
                        Default Message:
                      </Text>
                      <Text style={styles.defaultMessage}>
                        {DEFAULT_FRUSTRATION_MESSAGE}
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

                  <View style={styles.editModeButtons}>
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
                      <MaterialIcons name="save" size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>
                        Save Frustration
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Navigation Footer */}
        {!isEditMode && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentStep === 0 && styles.navButtonDisabled,
              ]}
              onPress={handleBack}
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
                Back
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
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
    textAlign: "center",
    color: "#1D1D1F",
    marginHorizontal: 8,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },
  fieldCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: "70%",
    flex: 1,
    justifyContent: "space-between",
  },
  fieldContent: {
    flex: 1,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  previewContainer: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    minHeight: 60,
  },
  previewText: {
    fontSize: 16,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  afmanReference: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  afmanReferenceText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  frustrationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  frustrationText: {
    marginLeft: 8,
    color: "#FF3B30",
    fontWeight: "500",
  },
  complianceButtons: {
    flexDirection: "row",
    gap: 12,
  },
  validateButton: {
    flex: 1,
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  validateButtonDisabled: {
    backgroundColor: "#B0B0B0",
    shadowColor: "transparent",
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustrateButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  frustrateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustrationLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  defaultMessageContainer: {
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  defaultMessageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 4,
  },
  defaultMessage: {
    fontSize: 16,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderColor: "#FF3B30",
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  editModeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 4,
  },
  navButtonTextDisabled: {
    color: "#C7C7CC",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1D1D1F",
  },
  searchResults: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  searchResultItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchResultText: {
    fontSize: 14,
    color: "#1D1D1F",
    fontWeight: "500",
  },
  searchResultSubtext: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  selectedList: {
    marginTop: 16,
  },
  selectedListLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  selectedEmptyText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  selectedItemText: {
    flex: 1,
    marginRight: 8,
  },
  selectedItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  selectedItemSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#8E8E93",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
