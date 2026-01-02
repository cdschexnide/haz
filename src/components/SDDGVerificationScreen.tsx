import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { ExtractedSDDGContent } from "@/types/sddg";
import SDDGComplianceValidation from "./SDDGComplianceValidation";
import InteractiveSDDGComplianceScreen from "./Inspector/InteractiveSDDGComplianceScreen";
import SDDGFormFieldVisual from "./SDDGFormFieldVisual";
import InspectorShippersDeclarationScreen from "./Inspector/InspectorShippersDeclarationScreen";

type VerificationStatus = "pending" | "accurate" | "corrected" | "skipped";

interface SDDGField {
  key: string;
  label: string;
  value: string;
  isRequired: boolean;
  verificationStatus: VerificationStatus;
}

interface SDDGVerificationProps {
  navigation: any;
}

export default function SDDGVerificationScreen({
  navigation,
}: SDDGVerificationProps) {
  const {
    inspection,
    workflow,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    updateVerificationField,
    setVerificationCopy,
    completeSDDGSubstep,
  } = useInspectionForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showComplianceValidation, setShowComplianceValidation] =
    useState(false);
  const [showInspectorPreview, setShowInspectorPreview] = useState(false);
  const [inspectorData, setInspectorData] = useState<any>(null);

  // Use inspection data - verificationCopy is the flattened structure
  const verificationData = inspection.verificationCopy;
  const originalImageUri = inspection.originalImageUri;

  console.log(
    "!!state SDDGVerificationScreen: ",
    JSON.stringify({ inspection, workflow }, null, 2)
  );

  // Update workflow step when component mounts (but only if we're not already past verification)
  useEffect(() => {
    console.log("🔧 [SDDGVerificationScreen] useEffect called");
    console.log(
      "🔧 [SDDGVerificationScreen] Current workflow step:",
      workflow.currentSDDGStep
    );
    console.log(
      "🔧 [SDDGVerificationScreen] Current frustrations count:",
      inspection?.frustrations?.length
    );

    // CRITICAL FIX: Don't update workflow if we're in compliance or frustration steps
    // This prevents clearing frustrations when verification screen renders during other workflows
    if (
      workflow.currentSDDGStep === "compliance" ||
      workflow.currentSDDGStep === "frustration"
    ) {
      console.log(
        "🔧 [SDDGVerificationScreen] BLOCKED workflow update - in advanced step:",
        workflow.currentSDDGStep
      );
      return;
    }

    // Only update workflow step if we're actually in verification or before it
    if (
      workflow.currentSDDGStep === "upload" ||
      workflow.currentSDDGStep === "verification"
    ) {
      console.log(
        "🔧 [SDDGVerificationScreen] Setting workflow to verification"
      );
      setCurrentSDDGStep("verification");
      setCurrentSDDGScreen("SDDGVerificationScreen");
    } else {
      console.log(
        "🔧 [SDDGVerificationScreen] Skipping workflow update - already in:",
        workflow.currentSDDGStep
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow.currentSDDGStep]);

  // Debug: Log verification data from store
  console.log("=== SDDGVerificationScreen - Store Data ===");
  console.log(
    "Full verificationData:",
    JSON.stringify(verificationData, null, 2)
  );
  console.log("UN ID:", verificationData?.unIdNo);
  console.log("Proper Shipping Name:", verificationData?.properShippingName);
  console.log("Hazard Class:", verificationData?.hazardClass);
  console.log("Quantity and Packing:", verificationData?.quantityAndPacking);
  console.log("=== End Debug ===");

  // Initialize fields from store's flattened structure
  const [fields, setFields] = useState<SDDGField[]>([
    {
      key: "shipper",
      label: "SHIPPER (Key 1)",
      value: verificationData?.shipper || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "consignee",
      label: "CONSIGNEE (Key 2)",
      value: verificationData?.consignee || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "airwayBill",
      label: "AIRWAY BILL NO. (Key 3)",
      value: verificationData?.airWaybillNumber || "",
      isRequired: false,
      verificationStatus: "pending",
    },
    {
      key: "pages",
      label: "PAGES (Key 4)",
      value: verificationData?.pagination || "",
      isRequired: false,
      verificationStatus: "pending",
    },
    {
      key: "tcn",
      label: "TCN (Key 5)",
      value: verificationData?.shippersReferenceNumber || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "inspected_by_and_inspected_by_date",
      label: "INSPECTION ACTIVITY (Key 6)",
      value: verificationData?.inspectionActivity || "",
      isRequired: false,
      verificationStatus: "pending",
    },
    {
      key: "aircraftType",
      label: "AIRCRAFT TYPE (Key 7)",
      value: verificationData?.aircraftType || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "departureAirport",
      label: "AIRPORT OF DEPARTURE (Key 8)",
      value: verificationData?.airportOfDeparture || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "destinationAirport",
      label: "AIRPORT OF DESTINATION (Key 9)",
      value: verificationData?.airportOfDestination || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "shipmentType",
      label: "SHIPMENT TYPE (Key 10)",
      value: verificationData?.shipmentType || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "unNumber",
      label: "UN or ID NO. (Key 11)",
      value: verificationData?.unIdNo || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "properShippingName",
      label: "PROPER SHIPPING NAME (Key 12)",
      value: verificationData?.properShippingName || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "hazardClass",
      label: "CLASS or DIVISION (Key 13)",
      value: verificationData?.hazardClass || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "subsidiaryRisk",
      label: "SUBSIDIARY RISK (Key 14)",
      value: verificationData?.subsidiaryRisk || "",
      isRequired: false,
      verificationStatus: "pending",
    },
    {
      key: "packingGroup",
      label: "PACKING GROUP (Key 15)",
      value: verificationData?.packingGroup || "",
      isRequired: false,
      verificationStatus: "pending",
    },
    {
      key: "quantityPacking",
      label: "QUANTITY AND TYPE OF PACKING (Key 16)",
      value: verificationData?.quantityAndPacking || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "packingInst",
      label: "PACKING INSTRUCTION (Key 17)",
      value: verificationData?.packingInstruction || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "authorization",
      label: "AUTHORIZATION (Key 18)",
      value: verificationData?.authorization || "",
      isRequired: false,
      verificationStatus: "pending",
    },
    {
      key: "additionalHandling",
      label: "ADDITIONAL HANDLING INFORMATION (Key 19)",
      value: verificationData?.additionalHandlingInfo || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "signatory",
      label: "NAME/TITLE OF SIGNATORY (Key 20)",
      value: verificationData?.nameOfSignatory || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "placeAndDate",
      label: "PLACE AND DATE (Key 21)",
      value: verificationData?.placeAndDate || "",
      isRequired: true,
      verificationStatus: "pending",
    },
    {
      key: "signature",
      label: "SIGNATURE (Key 22)",
      value: verificationData?.signature || "",
      isRequired: false,
      verificationStatus: "pending",
    },
  ]);

  const [localInputValue, setLocalInputValue] = useState("");
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const currentField = fields[currentStep];
  const totalSteps = fields.length;
  const requiredFieldsCount = fields.filter(f => f.isRequired).length;
  const verifiedCount = fields.filter(
    f => f.value && f.value.trim() !== ""
  ).length;

  // Initialize local value and reset edit mode when step changes
  useEffect(() => {
    if (currentField) {
      setLocalInputValue(currentField.value);
      setHasLocalChanges(false);
      setIsEditMode(false); // Always start in review mode for each field
    }
  }, [currentStep]);

  const updateField = (value: string) => {
    setLocalInputValue(value);
    setHasLocalChanges(true);
  };

  const handleConfirm = () => {
    const field = currentField;

    // Update the field value if edited
    if (hasLocalChanges) {
      setFields(
        fields.map(f =>
          f.key === field.key ? { ...f, value: localInputValue } : f
        )
      );

      // Update the verification copy in global state
      const extractedKey = mapFieldKeyToExtractedKey(field.key);
      if (extractedKey) {
        updateVerificationField(extractedKey, localInputValue);
        console.log(
          `🔧 [DEBUG] Updated verification copy field ${extractedKey}: "${localInputValue}" (legacy confirm)`
        );
      }
    } else {
      // Even if not edited, update verification copy with current value
      const extractedKey = mapFieldKeyToExtractedKey(field.key);
      if (extractedKey && field.value) {
        updateVerificationField(extractedKey, field.value);
        console.log(
          `🔧 [DEBUG] Updated verification copy field ${extractedKey}: "${field.value}" (legacy confirm, no changes)`
        );
      }
    }

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All fields reviewed
      handleFinalSubmit();
    }
  };

  const handleSkip = () => {
    if (currentField.isRequired && localInputValue.trim() === "") {
      Alert.alert(
        "Required Field",
        "This field is required. Please enter a value before proceeding."
      );
      return;
    }

    // Move to next step without saving changes
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    handleFinalSubmitWithFields(fields);
  };

  const handleFinalSubmitWithFields = (fieldsToUse: SDDGField[]) => {
    const canSubmitFinalWithFields = () => {
      const requiredFields = fieldsToUse.filter(f => f.isRequired);
      return requiredFields.every(field => field.value.trim().length > 0);
    };

    if (!canSubmitFinalWithFields()) {
      Alert.alert(
        "Missing Required Fields",
        "Some required fields are missing. Would you like to review them?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Review",
            onPress: () => {
              // Find first invalid required field
              const firstInvalid = fieldsToUse.findIndex(
                f => f.isRequired && !f.value.trim()
              );
              if (firstInvalid !== -1) {
                setCurrentStep(firstInvalid);
              }
            },
          },
        ]
      );
      return;
    }

    // Convert to final data structure for compliance validation
    const finalData: ExtractedSDDGContent = {
      shipper: fieldsToUse.find(f => f.key === "shipper")?.value || "",
      consignee: fieldsToUse.find(f => f.key === "consignee")?.value || "",
      airWaybillNumber:
        fieldsToUse.find(f => f.key === "airwayBill")?.value || "",
      pagination: fieldsToUse.find(f => f.key === "pages")?.value || "",
      shippersReferenceNumber:
        fieldsToUse.find(f => f.key === "tcn")?.value || "",
      inspectionActivity:
        fieldsToUse.find(f => f.key === "inspected_by_and_inspected_by_date")
          ?.value || "",
      aircraftType:
        fieldsToUse.find(f => f.key === "aircraftType")?.value || "",
      airportOfDeparture:
        fieldsToUse.find(f => f.key === "departureAirport")?.value || "",
      airportOfDestination:
        fieldsToUse.find(f => f.key === "destinationAirport")?.value || "",
      shipmentType:
        fieldsToUse.find(f => f.key === "shipmentType")?.value || "",
      unIdNo: fieldsToUse.find(f => f.key === "unNumber")?.value || "",
      properShippingName:
        fieldsToUse.find(f => f.key === "properShippingName")?.value || "",
      hazardClass: fieldsToUse.find(f => f.key === "hazardClass")?.value || "",
      subsidiaryRisk:
        fieldsToUse.find(f => f.key === "subsidiaryRisk")?.value || "",
      packingGroup:
        fieldsToUse.find(f => f.key === "packingGroup")?.value || "",
      quantityAndPacking:
        fieldsToUse.find(f => f.key === "quantityPacking")?.value || "",
      packingInstruction:
        fieldsToUse.find(f => f.key === "packingInst")?.value || "",
      authorization:
        fieldsToUse.find(f => f.key === "authorization")?.value || "",
      additionalHandlingInfo:
        fieldsToUse.find(f => f.key === "additionalHandling")?.value || "",
      nameOfSignatory:
        fieldsToUse.find(f => f.key === "signatory")?.value || "",
      placeAndDate:
        fieldsToUse.find(f => f.key === "placeAndDate")?.value || "",
      signature: fieldsToUse.find(f => f.key === "signature")?.value || "",
    };

    // Store in Valtio for compliance validation
    console.log("🔧 [DEBUG] Storing in Valtio store - finalData:", finalData);
    // IMPORTANT: Only update the verification copy, don't reset the entire context
    // which would clear frustrations that may be set during compliance validation
    setVerificationCopy(finalData);
    console.log(
      "🔧 [DEBUG] Updated verification copy with final verified data:",
      finalData
    );

    // Create inspector data from corrected fields
    const correctedInspectorData = {
      shipper: fieldsToUse.find(f => f.key === "shipper")?.value || "",
      consignee: fieldsToUse.find(f => f.key === "consignee")?.value || "",
      airwayBill: fieldsToUse.find(f => f.key === "airwayBill")?.value || "",
      pagination: fieldsToUse.find(f => f.key === "pages")?.value || "",
      shippersReferenceNumber:
        fieldsToUse.find(f => f.key === "tcn")?.value || "",
      inspectionActivity:
        fieldsToUse.find(f => f.key === "inspected_by_and_inspected_by_date")
          ?.value || "",
      aircraftType:
        fieldsToUse.find(f => f.key === "aircraftType")?.value || "",
      airportOfDeparture:
        fieldsToUse.find(f => f.key === "departureAirport")?.value || "",
      airportOfDestination:
        fieldsToUse.find(f => f.key === "destinationAirport")?.value || "",
      shipmentType:
        fieldsToUse.find(f => f.key === "shipmentType")?.value || "",
      hazardousMaterials: [
        {
          airWaybillNumber:
            fieldsToUse.find(f => f.key === "airwayBill")?.value || "",
          unIdNo: fieldsToUse.find(f => f.key === "unNumber")?.value || "",
          properShippingName:
            fieldsToUse.find(f => f.key === "properShippingName")?.value || "",
          hazardClass:
            fieldsToUse.find(f => f.key === "hazardClass")?.value || "",
          subsidiaryRisk:
            fieldsToUse.find(f => f.key === "subsidiaryRisk")?.value || "",
          packingGroup:
            fieldsToUse.find(f => f.key === "packingGroup")?.value || "",
          quantityAndPacking:
            fieldsToUse.find(f => f.key === "quantityPacking")?.value || "",
          packingInstruction:
            fieldsToUse.find(f => f.key === "packingInst")?.value || "",
          authorization:
            fieldsToUse.find(f => f.key === "authorization")?.value || "",
        },
      ],
      additionalHandlingInfo:
        fieldsToUse.find(f => f.key === "additionalHandling")?.value || "",
      emergencyTelephoneNumber: "1-800-851-8061 | 1-804-279-3131", // Default for now
      nameOfSignatory:
        fieldsToUse.find(f => f.key === "signatory")?.value || "",
      placeAndDate:
        fieldsToUse.find(f => f.key === "placeAndDate")?.value || "",
      signature: fieldsToUse.find(f => f.key === "signature")?.value || "",
    };

    // Store the corrected inspector data
    console.log(
      "🔧 [DEBUG] Setting inspector data with corrected values:",
      correctedInspectorData
    );
    setInspectorData(correctedInspectorData);

    // Mark verification step as complete when navigating to declaration
    completeSDDGSubstep("SDDGVerificationScreen");
    setCurrentSDDGStep("declaration");
    setCurrentSDDGScreen("InspectorShippersDeclarationScreen");
    // Show inspector preview instead of alert
    setShowInspectorPreview(true);
  };

  // New verification flow handlers
  const handleDataAccurate = () => {
    // Mark field as accurate and proceed to next step
    setFields(
      fields.map(f =>
        f.key === currentField.key
          ? { ...f, verificationStatus: "accurate" }
          : f
      )
    );

    // Update the verification copy with the current field value (even if not edited)
    const extractedKey = mapFieldKeyToExtractedKey(currentField.key);
    if (extractedKey && currentField.value) {
      updateVerificationField(extractedKey, currentField.value);
      console.log(
        `🔧 [DEBUG] Updated verification copy field ${extractedKey}: "${currentField.value}" (marked accurate)`
      );
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setIsEditMode(false); // Reset to review mode for next field
    } else {
      handleFinalSubmit();
    }
  };

  const handleDataIncorrect = () => {
    // Switch to edit mode
    setIsEditMode(true);
    setLocalInputValue(currentField.value || "");
  };

  const handleCancelEdit = () => {
    // Return to review mode without saving changes
    setIsEditMode(false);
    setLocalInputValue("");
  };

  // Helper function to map field keys to ExtractedSDDGContent keys
  const mapFieldKeyToExtractedKey = (
    fieldKey: string
  ): keyof ExtractedSDDGContent | null => {
    const mapping: Record<string, keyof ExtractedSDDGContent> = {
      shipper: "shipper",
      consignee: "consignee",
      airwayBill: "airWaybillNumber",
      pages: "pagination",
      tcn: "shippersReferenceNumber",
      inspected_by_and_inspected_by_date: "inspectionActivity",
      aircraftType: "aircraftType",
      departureAirport: "airportOfDeparture",
      destinationAirport: "airportOfDestination",
      shipmentType: "shipmentType",
      unNumber: "unIdNo",
      properShippingName: "properShippingName",
      hazardClass: "hazardClass",
      subsidiaryRisk: "subsidiaryRisk",
      packingGroup: "packingGroup",
      quantityPacking: "quantityAndPacking",
      packingInst: "packingInstruction",
      authorization: "authorization",
      additionalHandling: "additionalHandlingInfo",
      signatory: "nameOfSignatory",
      placeAndDate: "placeAndDate",
      signature: "signature",
    };
    return mapping[fieldKey] || null;
  };

  const handleSaveEdit = () => {
    // Save the corrected value and mark as corrected
    if (currentField.isRequired && localInputValue.trim() === "") {
      Alert.alert(
        "Required Field",
        "This field is required. Please enter a value before proceeding."
      );
      return;
    }

    console.log(
      `🔧 [DEBUG] Saving edit for field ${currentField.key}: "${currentField.value}" -> "${localInputValue}"`
    );

    const updatedFields = fields.map(f =>
      f.key === currentField.key
        ? {
            ...f,
            value: localInputValue,
            verificationStatus: "corrected" as VerificationStatus,
          }
        : f
    );

    console.log(
      "🔧 [DEBUG] Updated fields:",
      updatedFields.map(f => `${f.key}: "${f.value}"`)
    );

    setFields(updatedFields);

    // Update the verification copy in global state
    const extractedKey = mapFieldKeyToExtractedKey(currentField.key);
    if (extractedKey) {
      updateVerificationField(extractedKey, localInputValue);
      console.log(
        `🔧 [DEBUG] Updated verification copy field ${extractedKey}: "${localInputValue}"`
      );
    }

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setIsEditMode(false); // Reset to review mode for next field
      setLocalInputValue("");
    } else {
      // Use the updated fields directly for final submit on last step
      console.log("🔧 [DEBUG] Last step - calling handleFinalSubmitWithFields");
      handleFinalSubmitWithFields(updatedFields);
    }
  };

  if (!currentField) return null;

  const isMultiline = [
    "shipper",
    "consignee",
    "properShippingName",
    "additionalHandling",
  ].includes(currentField.key);
  const shouldAutoCapitalize = [
    "unNumber",
    "hazardClass",
    "tcn",
    "packingGroup",
  ].includes(currentField.key);

  // Show inspector preview screen if requested
  if (showInspectorPreview && inspectorData) {
    return (
      <InspectorShippersDeclarationScreen
        navigation={{
          ...navigation,
          goBack: () => setShowInspectorPreview(false),
        }}
        // extractedData prop removed - component now reads from store
        customButtons={true}
        onReviewAgain={() => {
          console.log("🚨 [SDDGVerificationScreen] onReviewAgain called!");
          console.log(
            "🚨 [SDDGVerificationScreen] Current workflow step:",
            workflow.currentSDDGStep
          );
          setShowInspectorPreview(false);
          setCurrentStep(0);
        }}
        onProceedToCompliance={() => {
          setShowInspectorPreview(false);
          setShowComplianceValidation(true);
        }}
      />
    );
  }

  // Show compliance validation screen if requested
  if (showComplianceValidation) {
    return (
      <InteractiveSDDGComplianceScreen
        navigation={{
          ...navigation,
          goBack: () => {
            setShowComplianceValidation(false);
            navigation.goBack();
          },
        }}
      />
    );
  }

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
          <Text style={styles.headerTitle}>Verify SDDG Data</Text>
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

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Current Field */}
          <View style={styles.fieldCard}>
            {!isEditMode ? (
              /* Review Mode UI */
              <>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldHeaderWizard}>
                    <Text style={styles.fieldLabelWizard}>
                      {currentField.label}
                    </Text>
                    {/* {currentField.isRequired && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>REQUIRED</Text>
                      </View>
                    )} */}
                  </View>

                  <Text style={styles.extractedLabel}>Extracted Value:</Text>
                  {currentField.key === "aircraftType" ||
                  currentField.key === "shipmentType" ? (
                    <View style={styles.visualFieldContainer}>
                      <SDDGFormFieldVisual
                        fieldType={currentField.key}
                        selectedValue={currentField.value}
                        showCrossPattern={true}
                      />
                    </View>
                  ) : (
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewText}>
                        {currentField.value || "No data extracted"}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.verificationButtons}>
                  <TouchableOpacity
                    style={styles.accurateButton}
                    onPress={handleDataAccurate}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#FFFFFF"
                    />
                    <Text style={styles.accurateButtonText}>Data Accurate</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.incorrectButton}
                    onPress={handleDataIncorrect}
                  >
                    <MaterialIcons name="error" size={24} color="#FFFFFF" />
                    <Text style={styles.incorrectButtonText}>
                      Data Incorrect or Missing
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Edit Mode UI */
              <>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldHeaderWizard}>
                    <Text style={styles.fieldLabelWizard}>
                      {currentField.label}
                    </Text>
                    {currentField.isRequired && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>REQUIRED</Text>
                      </View>
                    )}
                  </View>

                  {/* Clarification Message */}
                  <View style={styles.clarificationBox}>
                    <MaterialIcons name="info" size={20} color="#FF9500" />
                    <Text style={styles.clarificationText}>
                      Data entered must be what is actually present on the SDDG.
                      {"\n"}
                      Data shown reflects what's on the SDDG; this is a
                      validation of scanned data, not an inspection.
                    </Text>
                  </View>

                  <Text style={styles.extractedLabel}>Correct the Value:</Text>

                  {/* Special UI for aircraftType and shipmentType */}
                  {currentField.key === "aircraftType" ||
                  currentField.key === "shipmentType" ? (
                    <View style={styles.specialFieldContainer}>
                      {/* Show visual representation */}
                      <View style={styles.visualFieldContainer}>
                        <SDDGFormFieldVisual
                          fieldType={currentField.key}
                          selectedValue={localInputValue || currentField.value}
                          showCrossPattern={true}
                        />
                      </View>

                      {/* Selection buttons */}
                      <View style={styles.selectionButtonsContainer}>
                        <Text style={styles.selectionPrompt}>
                          Select the correct option:
                        </Text>
                        <View style={styles.selectionButtons}>
                          <TouchableOpacity
                            style={[
                              styles.selectionButton,
                              (currentField.key === "aircraftType"
                                ? (localInputValue || currentField.value) ===
                                  "Passenger and Cargo Aircraft"
                                : (localInputValue || currentField.value) ===
                                  "Non-Radioactive") && styles.selectedButton,
                            ]}
                            onPress={() => {
                              const value =
                                currentField.key === "aircraftType"
                                  ? "Passenger and Cargo Aircraft"
                                  : "Non-Radioactive";
                              updateField(value);
                            }}
                          >
                            <Text
                              style={[
                                styles.selectionButtonText,
                                (currentField.key === "aircraftType"
                                  ? (localInputValue || currentField.value) ===
                                    "Passenger and Cargo Aircraft"
                                  : (localInputValue || currentField.value) ===
                                    "Non-Radioactive") &&
                                  styles.selectedButtonText,
                              ]}
                            >
                              {currentField.key === "aircraftType"
                                ? "PASSENGER AND CARGO AIRCRAFT"
                                : "NON-RADIOACTIVE"}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.selectionButton,
                              (currentField.key === "aircraftType"
                                ? (localInputValue || currentField.value) ===
                                  "Cargo Aircraft Only"
                                : (localInputValue || currentField.value) ===
                                  "Radioactive") && styles.selectedButton,
                            ]}
                            onPress={() => {
                              const value =
                                currentField.key === "aircraftType"
                                  ? "Cargo Aircraft Only"
                                  : "Radioactive";
                              updateField(value);
                            }}
                          >
                            <Text
                              style={[
                                styles.selectionButtonText,
                                (currentField.key === "aircraftType"
                                  ? (localInputValue || currentField.value) ===
                                    "Cargo Aircraft Only"
                                  : (localInputValue || currentField.value) ===
                                    "Radioactive") && styles.selectedButtonText,
                              ]}
                            >
                              {currentField.key === "aircraftType"
                                ? "CARGO AIRCRAFT ONLY"
                                : "RADIOACTIVE"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.inputContainerWizard}>
                      <TextInput
                        style={[
                          styles.textInputWizard,
                          isMultiline && styles.multilineInputWizard,
                        ]}
                        value={localInputValue}
                        onChangeText={updateField}
                        placeholder={`Enter correct ${currentField.label}`}
                        multiline={isMultiline}
                        numberOfLines={isMultiline ? 4 : 1}
                        autoCapitalize={
                          shouldAutoCapitalize ? "characters" : "sentences"
                        }
                        autoFocus={true}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.editModeButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveEdit}
                  >
                    <MaterialIcons name="save" size={20} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Save & Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons - Only show in review mode */}
        {!isEditMode && (
          <View style={styles.footerWizard}>
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
    paddingVertical: 12,
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
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
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
  fieldHeaderWizard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fieldLabelWizard: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  extractedLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  inputContainerWizard: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderColor: "#007AFF",
  },
  textInputWizard: {
    padding: 16,
    fontSize: 16,
    minHeight: 56,
  },
  multilineInputWizard: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  editingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  editingText: {
    fontSize: 12,
    color: "#007AFF",
    marginLeft: 4,
  },
  footerWizard: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  confirmButton: {
    backgroundColor: "#34C759",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  // New styles for verification UI
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
  verificationButtons: {
    flexDirection: "row",
    gap: 12,
  },
  accurateButton: {
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
  accurateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  incorrectButton: {
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
  incorrectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
    backgroundColor: "#007AFF",
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
  // New styles for clarification and special fields
  clarificationBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FF9500",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  clarificationText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1D1F",
    lineHeight: 20,
    marginLeft: 8,
  },
  visualFieldContainer: {
    marginVertical: 16,
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
  },
  specialFieldContainer: {
    flex: 1,
  },
  selectionButtonsContainer: {
    marginTop: 20,
  },
  selectionPrompt: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D1D1F",
    marginBottom: 12,
    textAlign: "center",
  },
  selectionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  selectionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    textAlign: "center",
  },
  selectedButtonText: {
    color: "#FFFFFF",
  },
});
