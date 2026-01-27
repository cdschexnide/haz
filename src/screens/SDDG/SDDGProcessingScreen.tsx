import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DEFAULT_PREPROCESSING_CONFIG } from "../../config/preprocessingConfig";
import { DEFAULT_ALIGNMENT_CONFIG } from "../../config/alignmentConfig";
import { initializePaddleOCR } from "@/services/sddg/paddleOCREngine";
import { extractFormData } from "@/services/sddg/templateExtractor";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { ExtractedSDDGContent } from "@/types/sddg";
import { SDDGData } from "@/types/sddg-template";

function mapToHazproFormat(sddgData: SDDGData): ExtractedSDDGContent {
  return {
    // Key 1: Shipper (direct mapping)
    shipper: sddgData.shipper || "",

    // Key 2: Consignee (direct mapping)
    consignee: sddgData.consignee || "",

    // Key 3: Air Waybill Number
    airWaybillNumber: sddgData.awb_number || "",

    // Key 4: Pagination (page info)
    pagination: sddgData.page_info || "",

    // Key 5: Shipper's Reference Number (TCN)
    shippersReferenceNumber: sddgData.tcn || sddgData.shipper_reference || "",

    // Key 6: Inspection Activity
    inspectionActivity: sddgData.inspector || "",

    // Key 7: Aircraft Type (convert boolean to string)
    // SDDG forms: X marks DELETE the option, not select it
    // If cargo_aircraft_only checkbox has X, that option is DELETED, so PASSENGER is selected
    aircraftType: sddgData.cargo_aircraft_only
      ? "Passenger and Cargo Aircraft"
      : "Cargo Aircraft Only",

    // Key 8: Airport of Departure
    airportOfDeparture: sddgData.airport_departure || "",

    // Key 9: Airport of Destination
    airportOfDestination: sddgData.airport_destination || "",

    // Key 10: Shipment Type (convert boolean to string)
    // SDDG forms: X marks DELETE the option, not select it
    // If radioactive checkbox has X, RADIOACTIVE is DELETED, so NON-RADIOACTIVE is selected
    shipmentType: sddgData.radioactive
      ? "Non-Radioactive"
      : sddgData.non_radioactive
      ? "Radioactive"
      : "",

    // Key 11: UN ID Number
    unIdNo: sddgData.un_number || "",

    // Key 12: Proper Shipping Name
    properShippingName: (sddgData.proper_shipping_name || "").toUpperCase(),

    // Key 13: Hazard Class
    hazardClass: sddgData.class_division || "",

    // Key 14: Subsidiary Risk (not in SddgOCR template - leave blank)
    subsidiaryRisk: "",

    // Key 15: Packing Group
    packingGroup: sddgData.packing_group || "",

    // Key 16: Quantity and Packing
    quantityAndPacking: sddgData.quantity_packing || "",

    // Key 17: Packing Instruction
    packingInstruction: sddgData.packing_inst || "",

    // Key 18: Authorization
    authorization: sddgData.authorization || "",

    // Key 19: Additional Handling Info
    additionalHandlingInfo: sddgData.additional_handling || "",

    // Key 20: Name of Signatory
    nameOfSignatory: sddgData.name_title || "",

    // Key 21: Place and Date - Combine place and date from separate OCR regions
    placeAndDate: [sddgData.place_date, sddgData.signature_date]
      .filter(Boolean)
      .join(" ") || "",

    // Key 22: Signature
    signature: sddgData.signature || "",
  };
}

export default function ProcessingScreen() {
  const route = useRoute();
  const { setExtractedSDDGContent } = useInspectionForm();
  const navigation = useNavigation<any>();
  const { navigate } = useNavigationRef();
  const { imageUri, isScanned, customTemplate } = route.params as {
    imageUri: string;
    isScanned?: boolean;
    customTemplate?: any;
  };

  const [status, setStatus] = useState("Initializing OCR...");
  const [progress, setProgress] = useState({ current: 0, total: 0, field: "" });

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      // Step 1: Initialize OCR
      setStatus("Initializing OCR...");
      await initializePaddleOCR();

      // Step 2: Configure preprocessing based on image source
      // Document scanner already crops, straightens, and enhances the image
      // So we can skip preprocessing for scanned documents
      const preprocessingConfig = isScanned
        ? { ...DEFAULT_PREPROCESSING_CONFIG, enabled: false }
        : DEFAULT_PREPROCESSING_CONFIG;

      if (isScanned) {
        console.log(
          "📄 Image from document scanner - skipping preprocessing (already enhanced)"
        );
      } else {
        console.log(
          "📷 Image from manual camera/library - applying preprocessing"
        );
      }

      if (customTemplate) {
        console.log("🎯 Using user-adjusted template coordinates");
      }

      // Step 3: Extract using template-based extraction
      setStatus("Extracting form fields...");
      const result = await extractFormData(
        imageUri,
        "AMC_IMT_1033",
        progressInfo => {
          // Update progress
          setProgress(progressInfo);
          const percent = Math.round(
            (progressInfo.current / progressInfo.total) * 100
          );
          setStatus(`Extracting: ${progressInfo.field} (${percent}%)`);
        },
        preprocessingConfig, // Pass preprocessing config
        DEFAULT_ALIGNMENT_CONFIG, // Keep alignment enabled (fine-tuning)
        customTemplate // Pass custom template if user adjusted regions
      );

      console.log("✅ Template extraction result:", result);
      console.log("📊 Extracted data:", result.data);
      console.log("📈 Metadata:", result.metadata);

      // Step 4: Map SddgOCR format to hazpro format
      const mappedContent = mapToHazproFormat(result.data);
      console.log("🔄 Mapped to hazpro format:", mappedContent);

      // Step 5: Save to InspectionFormProvider context
      setExtractedSDDGContent(mappedContent, imageUri);
      console.log("💾 Saved to InspectionFormProvider");

      // Step 6: Navigate to verification screen
      // Use nested navigation since we're in RootStack and need to navigate to InspectorWrappedStack
      if (result.success) {
        setStatus("Extraction complete! Proceeding to verification...");
        setTimeout(() => {
          navigate("InspectorWrappedStack", {
            screen: "InteractiveSDDGComplianceScreen",
          });
        }, 500);
      } else {
        setStatus(`Extraction completed with ${result.errors.length} errors`);
        console.warn("⚠️ Extraction errors:", result.errors);
        // Still navigate to allow manual verification/correction
        setTimeout(() => {
          navigate("InspectorWrappedStack", {
            screen: "InteractiveSDDGComplianceScreen",
          });
        }, 1500);
      }
    } catch (error: any) {
      console.error("❌ Processing error:", error);
      const errorMessage = error?.message || String(error);
      setStatus(`Error: ${errorMessage}`);

      // Show alert with error details
      Alert.alert(
        "OCR Processing Failed",
        `An error occurred while processing the form:\n\n${errorMessage}\n\nPlease try again or use a different image.`,
        [
          {
            text: "Go Back",
            onPress: () => navigation.goBack(),
            style: "cancel",
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>{status}</Text>
      {progress.total > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress.current} / {progress.total} fields
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress.current / progress.total) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}
      <Text style={styles.subText}>Please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  progressContainer: {
    width: "80%",
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
