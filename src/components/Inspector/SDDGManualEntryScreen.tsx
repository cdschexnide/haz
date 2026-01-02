import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { ExtractedSDDGContent } from "../../types/sddg";
import SimpleFieldEditModal from "./SimpleFieldEditModal";
import TappableSDDGField from "./TappableSDDGField";
import TappableTableCell from "./TappableTableCell";
import { useHazProStore } from "../../stores/useHazProStore";

interface SDDGManualEntryScreenProps {
  navigation: any;
}

// Empty initial form data
const EMPTY_FORM: ExtractedSDDGContent = {
  shipper: "",
  consignee: "",
  airWaybillNumber: "",
  pagination: "",
  shippersReferenceNumber: "",
  inspectionActivity: "",
  aircraftType: "",
  airportOfDeparture: "",
  airportOfDestination: "",
  shipmentType: "",
  unIdNo: "",
  properShippingName: "",
  hazardClass: "",
  subsidiaryRisk: "",
  packingGroup: "",
  quantityAndPacking: "",
  packingInstruction: "",
  authorization: "",
  additionalHandlingInfo: "",
  nameOfSignatory: "",
  placeAndDate: "",
  signature: "",
};

/**
 * SDDGManualEntryScreen
 *
 * Exact replica of InteractiveSDDGForm layout but with empty fields
 * for manual data entry via simple text input modals.
 */
const SDDGManualEntryScreen: React.FC<SDDGManualEntryScreenProps> = ({
  navigation,
}) => {
  const {
    setExtractedSDDGContent,
    updateVerificationField,
    completeSDDGSubstep,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
  } = useInspectionForm();

  const { actions } = useHazProStore();

  // Local form state
  const [formData, setFormData] = useState<ExtractedSDDGContent>(EMPTY_FORM);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<{
    key: keyof ExtractedSDDGContent;
    label: string;
    multiline: boolean;
  } | null>(null);

  // Set active chevron
  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, []);

  // Initialize empty form on mount
  useEffect(() => {
    setFormData(EMPTY_FORM);
    setExtractedSDDGContent(EMPTY_FORM);
  }, []);

  // Handle field press - open simple text input modal
  const handleFieldPress = useCallback(
    (fieldKey: string, fieldLabel: string, fieldValue: string) => {
      Vibration.vibrate(10);

      // Determine if field should be multiline
      const multilineFields = [
        "shipper",
        "consignee",
        "additionalHandlingInfo",
      ];
      const isMultiline = multilineFields.includes(fieldKey);

      setSelectedField({
        key: fieldKey as keyof ExtractedSDDGContent,
        label: fieldLabel,
        multiline: isMultiline,
      });
      setModalVisible(true);
    },
    []
  );

  // Handle field value save
  const handleSaveField = useCallback(
    (newValue: string) => {
      if (!selectedField) return;

      const updatedFormData = {
        ...formData,
        [selectedField.key]: newValue,
      };

      setFormData(updatedFormData);
      updateVerificationField(selectedField.key, newValue);

      console.log(
        `✏️ [ManualEntry] Updated ${selectedField.key}: "${newValue}"`
      );
    },
    [selectedField, formData, updateVerificationField]
  );

  // Handle aircraft type direct selection
  const handleAircraftTypeSelect = useCallback(
    (selection: "passenger" | "cargo") => {
      Vibration.vibrate(10);

      const value =
        selection === "passenger"
          ? "PASSENGER AND CARGO AIRCRAFT"
          : "CARGO AIRCRAFT ONLY";

      const updatedFormData = {
        ...formData,
        aircraftType: value,
      };

      setFormData(updatedFormData);
      updateVerificationField("aircraftType", value);

      console.log(`✈️ [ManualEntry] Selected aircraft type: "${value}"`);
    },
    [formData, updateVerificationField]
  );

  // Handle shipment type direct selection
  const handleShipmentTypeSelect = useCallback(
    (selection: "non-radioactive" | "radioactive") => {
      Vibration.vibrate(10);

      const value =
        selection === "non-radioactive"
          ? "NON-RADIOACTIVE"
          : "RADIOACTIVE";

      const updatedFormData = {
        ...formData,
        shipmentType: value,
      };

      setFormData(updatedFormData);
      updateVerificationField("shipmentType", value);

      console.log(`☢️ [ManualEntry] Selected shipment type: "${value}"`);
    },
    [formData, updateVerificationField]
  );

  // Handle back button
  const handleBack = () => {
    const hasData = Object.values(formData).some(
      (value) => value && value.trim() !== ""
    );

    if (hasData) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved data. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Handle Continue button
  const handleContinue = () => {
    // Set the full extracted content in context
    setExtractedSDDGContent(formData);

    // Update workflow state
    completeSDDGSubstep("SDDGManualEntry");
    setCurrentSDDGStep("verification");
    setCurrentSDDGScreen("InteractiveSDDGComplianceScreen");

    console.log("✅ [ManualEntry] Navigating to verification");

    // Navigate to verification screen
    navigation.navigate("InteractiveSDDGComplianceScreen");
  };

  // Handle Save & Exit
  const handleSaveAndExit = () => {
    Alert.alert(
      "Save and Exit",
      "Your progress will be saved. You can resume manual entry later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save & Exit",
          onPress: () => {
            setExtractedSDDGContent(formData);
            console.log("💾 [ManualEntry] Saved and exiting");
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Parse aircraft type to determine which box to show X over
  const aircraftTypeUpper = formData.aircraftType?.toUpperCase() || "";
  const isCargoOnly = aircraftTypeUpper.includes("CARGO") && !aircraftTypeUpper.includes("PASSENGER");

  // Parse shipment type
  const shipmentTypeUpper = formData.shipmentType?.toUpperCase() || "";
  const isRadioactive = shipmentTypeUpper.includes("RADIOACTIVE") && !shipmentTypeUpper.includes("NON");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBackButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual SDDG Entry</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Manual Entry",
              "Tap any field to enter data manually. When done, click Continue to proceed to verification.",
              [{ text: "OK" }]
            )
          }
          style={styles.helpButton}
        >
          <MaterialIcons name="help-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.redStripeLeft} />
          <View style={styles.redStripeRight} />

          <Text style={styles.disclaimerText}>
            HazPro Digital Representation – For Inspector Reference Only, Not
            for Official Use. Original and Updated SDDG Required for Official
            Shipment
          </Text>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              SHIPPER'S DECLARATION FOR DANGEROUS GOODS
            </Text>

            {/* Top Section */}
            <View style={styles.row}>
              {/* Key 1: Shipper */}
              <View style={{ flex: 2 }}>
                <TappableSDDGField
                  fieldKey="shipper"
                  fieldLabel="SHIPPER (Key 1)"
                  fieldValue={formData.shipper}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View style={styles.boxLeft}>
                    <Text style={styles.label}>Shipper</Text>
                    <Text style={styles.text}>
                      {formData.shipper || "Tap to enter shipper info..."}
                    </Text>
                  </View>
                </TappableSDDGField>
              </View>

              <View style={styles.boxRight}>
                {/* Key 3: Air Waybill Number */}
                <TappableSDDGField
                  fieldKey="airWaybillNumber"
                  fieldLabel="AIRWAY BILL NO. (Key 3)"
                  fieldValue={formData.airWaybillNumber}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View>
                    <Text style={styles.label}>Air Waybill No.</Text>
                    <Text style={styles.text3}>
                      {formData.airWaybillNumber || "Tap to enter..."}
                    </Text>
                  </View>
                </TappableSDDGField>

                {/* Key 5: TCN/Shipper's Reference Number */}
                <TappableSDDGField
                  fieldKey="shippersReferenceNumber"
                  fieldLabel="TCN (Key 5)"
                  fieldValue={formData.shippersReferenceNumber}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View>
                    <Text style={styles.text}>SHIPPER'S REFERENCE NUMBER</Text>
                    <Text style={styles.text4}>
                      TCN: {formData.shippersReferenceNumber || "Tap to enter..."}
                    </Text>
                  </View>
                </TappableSDDGField>
              </View>
            </View>

            <View style={styles.row}>
              {/* Key 2: Consignee */}
              <View style={{ flex: 2 }}>
                <TappableSDDGField
                  fieldKey="consignee"
                  fieldLabel="CONSIGNEE (Key 2)"
                  fieldValue={formData.consignee}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View style={styles.boxLeft}>
                    <Text style={styles.label}>Consignee</Text>
                    <Text style={styles.text}>
                      {formData.consignee || "Tap to enter consignee info..."}
                    </Text>
                  </View>
                </TappableSDDGField>
              </View>

              <View style={styles.boxRight} />
            </View>

            <View style={styles.row}>
              <View style={[styles.transportBox, { flex: 1.6 }]}>
                <Text style={styles.label}>TRANSPORT DETAILS</Text>
                <Text>
                  This shipment is within the limitations prescribed for:
                </Text>

                {/* Key 7: Aircraft Type - Direct Selection */}
                <View style={styles.transportOptions}>
                  {/* PASSENGER AND CARGO option */}
                  <TouchableOpacity
                    style={styles.aircraftBox}
                    onPress={() => handleAircraftTypeSelect("passenger")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.aircraftLabel}>
                      PASSENGER AND{"\n"}CARGO AIRCRAFT
                    </Text>
                    {isCargoOnly && (
                      <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                    )}
                    {!formData.aircraftType && (
                      <View style={styles.tapHint}>
                        <MaterialIcons name="touch-app" size={14} color="#007AFF" />
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* CARGO AIRCRAFT ONLY option */}
                  <TouchableOpacity
                    style={styles.aircraftBox}
                    onPress={() => handleAircraftTypeSelect("cargo")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.aircraftLabel}>
                      CARGO AIRCRAFT{"\n"}ONLY
                    </Text>
                    {!isCargoOnly && formData.aircraftType && (
                      <Text style={styles.xOverlayText}>XXXXXXX</Text>
                    )}
                    {!formData.aircraftType && (
                      <View style={styles.tapHint}>
                        <MaterialIcons name="touch-app" size={14} color="#007AFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.airportRow}>
                  {/* Key 8: Airport of Departure */}
                  <TappableSDDGField
                    fieldKey="airportOfDeparture"
                    fieldLabel="AIRPORT OF DEPARTURE (Key 8)"
                    fieldValue={formData.airportOfDeparture}
                    isFrustrated={false}
                    onPress={handleFieldPress}
                  >
                    <View style={[styles.airportBox, { flex: 1 }]}>
                      <Text style={styles.label}>Airport of Departure:</Text>
                      <Text style={styles.text}>
                        {formData.airportOfDeparture || "Tap to enter..."}
                      </Text>
                    </View>
                  </TappableSDDGField>

                  {/* Key 9: Airport of Destination */}
                  <TappableSDDGField
                    fieldKey="airportOfDestination"
                    fieldLabel="AIRPORT OF DESTINATION (Key 9)"
                    fieldValue={formData.airportOfDestination}
                    isFrustrated={false}
                    onPress={handleFieldPress}
                  >
                    <View style={[styles.airportBox, { flex: 1 }]}>
                      <Text style={styles.label}>Airport of Destination:</Text>
                      <Text style={styles.text}>
                        {formData.airportOfDestination || "Tap to enter..."}
                      </Text>
                    </View>
                  </TappableSDDGField>
                </View>
              </View>

              <View style={[styles.rightColumn, { flex: 1.4 }]}>
                <View style={[styles.transportBox, styles.topRightBox]}>
                  <Text style={styles.label}>Warning</Text>
                  <Text style={styles.warningText}>
                    Failure to comply in all respects with the applicable
                    Dangerous Goods Regulations may be in breach of the
                    applicable law, subject to legal penalties.
                  </Text>
                </View>

                <View style={[styles.transportBox, styles.bottomRightBox]}>
                  {/* Key 10: Shipment Type - Direct Selection */}
                  <View style={styles.shipmentTypeRow}>
                    <Text style={styles.label}>
                      Shipment type:{" "}
                      <Text style={styles.italic}>
                        (delete non-applicable)
                      </Text>
                    </Text>
                    <View style={styles.shipmentTypeBox}>
                      {/* NON-RADIOACTIVE option */}
                      <TouchableOpacity
                        style={styles.shipmentOption}
                        onPress={() => handleShipmentTypeSelect("non-radioactive")}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.aircraftLabel}>
                          NON-RADIOACTIVE
                        </Text>
                        {isRadioactive && (
                          <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                        )}
                        {!formData.shipmentType && (
                          <View style={styles.tapHint}>
                            <MaterialIcons name="touch-app" size={14} color="#007AFF" />
                          </View>
                        )}
                      </TouchableOpacity>

                      {/* RADIOACTIVE option */}
                      <TouchableOpacity
                        style={styles.shipmentOption}
                        onPress={() => handleShipmentTypeSelect("radioactive")}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.aircraftLabel}>RADIOACTIVE</Text>
                        {!isRadioactive && formData.shipmentType && (
                          <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                        )}
                        {!formData.shipmentType && (
                          <View style={styles.tapHint}>
                            <MaterialIcons name="touch-app" size={14} color="#007AFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Dangerous Goods Table */}
            <View style={styles.tableWrapper}>
              <Text style={styles.label}>
                NATURE AND QUANTITY OF DANGEROUS GOODS
              </Text>
              <View style={styles.tableHeader}>
                {[
                  "UN or ID No.",
                  "Proper Shipping Name",
                  "Class or Division\n(subsidiary hazard)",
                  "Packing Group",
                  "Quantity and Type of Packing",
                  "Packing Inst.",
                  "Authorization",
                ].map((title, idx) => (
                  <View style={styles.tableCell} key={idx}>
                    <Text style={styles.cellLabel}>{title}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.tableRow}>
                {/* Keys 11-18: Hazmat Table Fields */}
                {[
                  {
                    key: "unIdNo" as keyof ExtractedSDDGContent,
                    label: "UN or ID NO. (Key 11)",
                  },
                  {
                    key: "properShippingName" as keyof ExtractedSDDGContent,
                    label: "PROPER SHIPPING NAME (Key 12)",
                  },
                  {
                    key: "hazardClass" as keyof ExtractedSDDGContent,
                    label: "CLASS or DIVISION (Key 13)",
                  },
                  {
                    key: "packingGroup" as keyof ExtractedSDDGContent,
                    label: "PACKING GROUP (Key 15)",
                  },
                  {
                    key: "quantityAndPacking" as keyof ExtractedSDDGContent,
                    label: "QUANTITY AND TYPE OF PACKING (Key 16)",
                  },
                  {
                    key: "packingInstruction" as keyof ExtractedSDDGContent,
                    label: "PACKING INSTRUCTION (Key 17)",
                  },
                  {
                    key: "authorization" as keyof ExtractedSDDGContent,
                    label: "AUTHORIZATION (Key 18)",
                  },
                ].map((field) => (
                  <View style={{ flex: 1 }} key={field.key}>
                    <TappableTableCell
                      fieldKey={field.key}
                      fieldLabel={field.label}
                      fieldValue={formData[field.key]}
                      isFrustrated={false}
                      onPress={handleFieldPress}
                    >
                      <View style={styles.tableCell}>
                        <Text style={styles.tableCellText}>
                          {formData[field.key] || "Tap..."}
                        </Text>
                      </View>
                    </TappableTableCell>
                  </View>
                ))}
              </View>
            </View>

            {/* Key 19: Additional Info */}
            <TappableSDDGField
              fieldKey="additionalHandlingInfo"
              fieldLabel="ADDITIONAL HANDLING INFORMATION (Key 19)"
              fieldValue={formData.additionalHandlingInfo}
              isFrustrated={false}
              onPress={handleFieldPress}
            >
              <View style={styles.infoBox}>
                <Text style={styles.label}>Additional Handling Information</Text>
                <View>
                  <Text style={styles.infoLine}>
                    {formData.additionalHandlingInfo ||
                      "Tap to enter additional info..."}
                  </Text>
                </View>
              </View>
            </TappableSDDGField>

            {/* Declaration and Signature */}
            <View style={styles.declarationRow}>
              <View style={styles.declarationBox}>
                <Text style={styles.declarationText}>
                  I hereby declare that the contents of this consignment are
                  fully and accurately described above by the proper shipping
                  name, and are classified, packaged, marked and
                  labelled/placarded, and are in all respects in proper
                  condition for transport according to applicable international
                  and national governmental regulations. I declare that all of
                  the applicable air transport requirements have been met.
                </Text>
              </View>

              <View style={styles.signatoryBox}>
                {/* Key 20: Name of Signatory */}
                <TappableSDDGField
                  fieldKey="nameOfSignatory"
                  fieldLabel="NAME/TITLE OF SIGNATORY (Key 20)"
                  fieldValue={formData.nameOfSignatory}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View>
                    <Text style={styles.labelUpper}>
                      NAME/TITLE OF SIGNATORY
                    </Text>
                    <Text style={{ color: "#000" }}>
                      {formData.nameOfSignatory || "Tap to enter..."}
                    </Text>
                  </View>
                </TappableSDDGField>

                {/* Key 21: Place and Date */}
                <TappableSDDGField
                  fieldKey="placeAndDate"
                  fieldLabel="PLACE AND DATE (Key 21)"
                  fieldValue={formData.placeAndDate}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View>
                    <Text style={[styles.labelUpper, { marginTop: 12 }]}>
                      PLACE AND DATE
                    </Text>
                    <Text style={{ color: "#000" }}>
                      {formData.placeAndDate || "Tap to enter..."}
                    </Text>
                  </View>
                </TappableSDDGField>

                {/* Key 22: Signature */}
                <TappableSDDGField
                  fieldKey="signature"
                  fieldLabel="SIGNATURE (Key 22)"
                  fieldValue={formData.signature}
                  isFrustrated={false}
                  onPress={handleFieldPress}
                >
                  <View>
                    <Text style={styles.signatureNote}>
                      SIGNATURE (see warning above)
                    </Text>
                  </View>
                </TappableSDDGField>
              </View>
            </View>
          </View>

          <Text style={styles.disclaimerText}>
            HazPro Digital Representation – For Inspector Reference Only, Not
            for Official Use. Original and Updated SDDG Required for Official
            Shipment
          </Text>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {/* Left: Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={20} color="#8E8E93" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Center: Save & Exit Button */}
        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={handleSaveAndExit}
        >
          <MaterialIcons name="save" size={20} color="#34C759" />
          <Text style={styles.saveExitButtonText}>Save & Exit</Text>
        </TouchableOpacity>

        {/* Right: Continue Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>Continue to SDDG Inspection</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Simple Field Edit Modal */}
      {selectedField && (
        <SimpleFieldEditModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedField(null);
          }}
          fieldLabel={selectedField.label}
          fieldValue={formData[selectedField.key]}
          onSave={handleSaveField}
          multiline={selectedField.multiline}
          placeholder={`Enter ${selectedField.label.toLowerCase()}...`}
        />
      )}
    </SafeAreaView>
  );
};

export default SDDGManualEntryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginHorizontal: 16,
  },
  helpButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 12,
    backgroundColor: "#fff",
    position: "relative",
  },
  redStripeLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 10,
    borderLeftWidth: 5,
    borderLeftColor: "red",
    borderStyle: "dashed",
    zIndex: 0,
  },
  redStripeRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 10,
    borderRightWidth: 5,
    borderRightColor: "red",
    borderStyle: "dashed",
    zIndex: 0,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 12,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 6,
  },
  boxLeft: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    minHeight: 140,
  },
  boxRight: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    minHeight: 140,
  },
  transportBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 3,
    padding: 8,
    color: "#000",
  },
  warningText: {
    fontSize: 12,
    lineHeight: 16,
    paddingLeft: 10,
    color: "#000",
  },
  tableWrapper: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    height: 300,
  },
  tableCell: {
    flex: 1,
    height: "100%",
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  cellLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#000",
  },
  infoBox: {
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 8,
    marginTop: 12,
    marginBottom: 12,
    color: "#000",
  },
  declarationRow: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 12,
    color: "#000",
  },
  declarationBox: {
    flex: 2,
    paddingRight: 10,
    color: "#000",
  },
  signatoryBox: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: "#000",
    paddingLeft: 10,
    color: "#000",
  },
  declarationText: {
    fontSize: 14,
    lineHeight: 18,
    padding: 5,
    color: "#000",
  },
  signatureNote: {
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 12,
    color: "#000",
  },
  transportOptions: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 4,
    color: "#000",
  },
  aircraftBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRightWidth: 1,
    borderRightColor: "#000",
    position: "relative",
  },
  aircraftLabel: {
    textAlign: "center",
    fontSize: 10,
    lineHeight: 14,
    color: "#000",
  },
  tapHint: {
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  xOverlayText: {
    position: "absolute",
    color: "#000",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
  },
  shipmentTypeBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 4,
    color: "#000",
  },
  shipmentOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRightWidth: 1,
    borderRightColor: "#000",
    position: "relative",
    color: "#000",
  },
  italic: {
    fontStyle: "italic",
  },
  infoLine: {
    fontSize: 14,
    marginBottom: 2,
    paddingLeft: 10,
    color: "#000",
  },
  text: {
    paddingLeft: 10,
    color: "#000",
  },
  text2: {
    paddingLeft: 10,
    color: "#000",
  },
  text3: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    color: "#000",
  },
  text4: {
    paddingLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  labelUpper: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
    color: "#000",
  },
  tableCellText: {
    fontSize: 12,
    color: "#000",
  },
  disclaimerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 14,
    paddingHorizontal: 16,
    lineHeight: 14,
  },
  shipmentTypeRow: {
    marginTop: 12,
    color: "#000",
  },
  rightColumn: {
    flexDirection: "column",
  },
  topRightBox: {
    flex: 1,
    marginBottom: 0,
  },
  bottomRightBox: {
    flex: 1,
    marginTop: 0,
  },
  airportRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  airportBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    backgroundColor: "#fff",
    marginRight: 4,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  backButton: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#34C759",
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveExitButtonText: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
