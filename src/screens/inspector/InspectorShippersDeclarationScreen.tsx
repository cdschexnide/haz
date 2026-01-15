import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import colors from "../../theming/colors";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InspectorShippersDeclarationForm from "../../components/Inspector/InspectorShippersDeclarationForm";

interface InspectorShippersDeclarationScreenProps {
  navigation: any;
  customButtons?: boolean;
  onReviewAgain?: () => void;
  onProceedToCompliance?: () => void;
}

const InspectorShippersDeclarationScreen = ({
  navigation,
  customButtons = false,
  onReviewAgain,
  onProceedToCompliance,
}: InspectorShippersDeclarationScreenProps) => {
  const {
    inspection,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    completeSDDGSubstep,
  } = useInspectionForm();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const formRef = useRef<View>(null);

  // Update workflow step when component mounts
  useEffect(() => {
    setCurrentSDDGStep("declaration");
    setCurrentSDDGScreen("InspectorShippersDeclarationScreen");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use inspection data, transform from flattened structure to nested structure for form
  const verificationData = inspection.verificationCopy;
  const extractedData = verificationData
    ? {
        shipper: verificationData.shipper,
        consignee: verificationData.consignee,
        airwayBill: verificationData.airWaybillNumber,
        pagination: verificationData.pagination,
        shippersReferenceNumber: verificationData.shippersReferenceNumber,
        inspectionActivity: verificationData.inspectionActivity,
        aircraftType: verificationData.aircraftType,
        airportOfDeparture: verificationData.airportOfDeparture,
        airportOfDestination: verificationData.airportOfDestination,
        shipmentType: verificationData.shipmentType,
        hazardousMaterials: [
          {
            airWaybillNumber: verificationData.airWaybillNumber,
            unIdNo: verificationData.unIdNo,
            properShippingName: verificationData.properShippingName,
            hazardClass: verificationData.hazardClass,
            subsidiaryRisk: verificationData.subsidiaryRisk,
            packingGroup: verificationData.packingGroup,
            quantityAndPacking: verificationData.quantityAndPacking,
            packingInstruction: verificationData.packingInstruction,
            authorization: verificationData.authorization,
          },
        ],
        additionalHandlingInfo: verificationData.additionalHandlingInfo,
        emergencyTelephoneNumber: "1-800-851-8061 | 1-804-279-3131", // Default for now
        nameOfSignatory: verificationData.nameOfSignatory,
        placeAndDate: verificationData.placeAndDate,
        signature: verificationData.signature,
      }
    : null;

  // Debug logging
  console.log("🔍 [InspectorScreen] Using data from store:", extractedData);

  // Parse combined fields for HTML generation
  const parseNameOfSignatory = (nameOfSignatory: string) => {
    const parts = nameOfSignatory.trim().split(" ");
    if (parts.length >= 3) {
      const name = parts.slice(0, 2).join(" ");
      const title = parts.slice(2).join(" ");
      return { name, title };
    }
    return { name: nameOfSignatory, title: "" };
  };

  const parsePlaceAndDate = (placeAndDate: string) => {
    const trimmed = placeAndDate.trim();

    // Look for date pattern (month names or numeric dates)
    const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i;
    const dateMatch = trimmed.match(dateRegex);

    if (dateMatch && dateMatch.index !== undefined) {
      // Split at the date match
      const location = trimmed.substring(0, dateMatch.index).trim();
      const date = trimmed.substring(dateMatch.index).trim();
      return { location, date };
    }

    return { location: placeAndDate, date: "" };
  };

  const parseEmergencyNumbers = (emergencyTelephoneNumber: string) => {
    const numbers = emergencyTelephoneNumber.split(" | ");
    return {
      domestic: numbers[0] || "",
      international: numbers[1] || "",
    };
  };

  const parseAdditionalHandlingInfo = (additionalHandling: string) => {
    // Extract DSN number (format: "DSN: 312-225-4695/4696")
    const dsnRegex = /DSN:\s*([\d-/]+)/i;
    const dsnMatch = additionalHandling.match(dsnRegex);
    const dsn = dsnMatch ? dsnMatch[1].trim() : "";

    // Extract Collect number (format: "Collect: +1 (703) 695-4695/4696")
    const collectRegex = /Collect:\s*(\+?\d[\d\s\(\)-/]+)/i;
    const collectMatch = additionalHandling.match(collectRegex);
    const collect = collectMatch ? collectMatch[1].trim() : "";

    // Remove emergency number section from the text to avoid duplication
    let cleanedText = additionalHandling
      .replace(/Emergency Telephone Number:/gi, "")
      .replace(/DSN:\s*[\d-/]+/gi, "")
      .replace(/Collect:\s*\+?\d[\d\s\(\)-/]+/gi, "")
      .replace(/EMERGENCY TELEPHONE NUMBER:/gi, "")
      .trim();

    // Clean up extra whitespace and newlines
    cleanedText = cleanedText.replace(/\n\s*\n/g, "\n").trim();

    return {
      dsn,
      collect,
      otherInfo: cleanedText,
    };
  };

  const parseShipperInfo = (shipper: string) => {
    // Parse the shipper string into components
    const parts = shipper.trim().split(/[,\n]/);

    if (parts.length >= 3) {
      // Format: "TRAFFIC MANAGEMENT FLIGHT, 5236 CHASE ST, WRIGHT PATTERSON AFB, OH 45433-5501"
      return {
        name: parts[0].trim(),
        street: parts[1].trim(),
        city: parts.slice(2).join(", ").trim(),
      };
    } else if (parts.length === 2) {
      // Format: "TRAFFIC MANAGEMENT FLIGHT 5236 CHASE ST, WRIGHT PATTERSON AFB, OH 45433-5501"
      const firstPart = parts[0].trim();
      const lastPart = parts[1].trim();

      // Try to split the first part into name and street
      const words = firstPart.split(" ");
      if (words.length > 3) {
        // Assume last 3 words are street address
        const name = words.slice(0, -3).join(" ");
        const street = words.slice(-3).join(" ");
        return {
          name,
          street,
          city: lastPart,
        };
      } else {
        return {
          name: firstPart,
          street: "",
          city: lastPart,
        };
      }
    } else {
      // Single string or unexpected format - return as name
      return {
        name: shipper.trim(),
        street: "",
        city: "",
      };
    }
  };

  // Generate HTML for PDF export
  const generateFormHtml = (): string => {
    const { name: signatoryName, title: signatoryTitle } = parseNameOfSignatory(
      extractedData.nameOfSignatory
    );
    const { location, date } = parsePlaceAndDate(extractedData.placeAndDate);
    const {
      domestic: domesticEmergency,
      international: internationalEmergency,
    } = parseEmergencyNumbers(extractedData.emergencyTelephoneNumber);
    const { dsn, collect, otherInfo } = parseAdditionalHandlingInfo(
      extractedData.additionalHandlingInfo
    );
    const shipperInfo = parseShipperInfo(extractedData.shipper);

    const hazmat = extractedData.hazardousMaterials?.[0] || {};
    // Handle both case variations for aircraft type
    const aircraftTypeUpper = extractedData.aircraftType?.toUpperCase();
    const isCargoOnly = aircraftTypeUpper !== "PASSENGER AND CARGO AIRCRAFT";

    const getXOverlayHTML = (condition: boolean): string => {
      return condition ? "" : '<div class="x-overlay">XXXXXXXX</div>';
    };

    // Generate additional information HTML
    let additionalInfoHTML = "";
    const additionalInfoItems =
      extractedData.additionalHandlingInfo.split(" | ");
    additionalInfoItems.forEach(info => {
      if (info.trim()) {
        additionalInfoHTML += `<p class="info-line">${info.trim()}</p>`;
      }
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipper's Declaration for Dangerous Goods</title>
        <style>
          @page {
            size: letter portrait;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
          }
          .container {
            position: relative;
            border: 1px solid black;
            padding: 5px;
            margin: 10px;
            background: white;
          }
          .red-stripe-left,
          .red-stripe-right {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 5px;
            border-left: 5px dashed red;
            z-index: 1000;
          }
          .red-stripe-left {
            left: 0;
          }
          .red-stripe-right {
            right: 0;
          }
          .title {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 16px;
          }
          .row {
            display: flex;
            margin-bottom: 12px;
          }
          .box {
            border: 1px solid black;
            padding: 8px;
          }
          .box-left {
            flex: 1;
            margin-right: 8px;
          }
          .box-right {
            flex: 1;
          }
          .label {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 4px;
            padding: 4px 0;
          }
          .text {
            font-size: 13px;
            margin: 4px 0;
          }
          .warning-text {
            font-size: 12px;
            line-height: 16px;
          }
          .transport-box {
            border: 1px solid black;
            padding: 8px;
            flex: 1;
          }
          .transport-options {
            display: flex;
            border: 1px solid black;
            margin-top: 4px;
          }
          .aircraft-box {
            flex: 1;
            text-align: center;
            padding: 10px 0;
            position: relative;
            border-right: 1px solid black;
          }
          .aircraft-box:last-child {
            border-right: none;
          }
          .x-overlay {
            position: absolute;
            font-weight: bold;
            font-size: 24px;
            text-align: center;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .shipment-type-row {
            margin-top: 12px;
          }
          .shipment-type-box {
            display: flex;
            border: 1px solid black;
            margin-top: 4px;
          }
          .shipment-option {
            flex: 1;
            text-align: center;
            padding: 10px 0;
            position: relative;
            border-right: 1px solid black;
          }
          .shipment-option:last-child {
            border-right: none;
          }
          .table-wrapper {
            margin-top: 16px;
            border: 1px solid black;
          }
          .table-header {
            display: flex;
            background-color: #e9ecef;
            border-bottom: 1px solid black;
          }
          .table-row {
            display: flex;
            min-height: 200px;
          }
          .table-cell {
            flex: 1;
            padding: 6px;
            border-right: 1px solid black;
            font-size: 13px;
          }
          .table-cell:last-child {
            border-right: none;
          }
          .cell-label {
            font-weight: bold;
            font-size: 12px;
          }
          .info-box {
            border-top: 1px solid black;
            padding-top: 10px;
            margin-top: 16px;
            margin-bottom: 16px;
          }
          .info-line {
            font-size: 14px;
            margin: 4px 0;
          }
          .emergency-line {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 8px;
            flex-wrap: wrap;
          }
          .emergency-label {
            font-size: 13px;
            font-weight: bold;
            margin-right: 4px;
          }
          .emergency-number {
            font-size: 13px;
          }
          .declaration-row {
            display: flex;
            border-top: 1px solid black;
            padding-top: 12px;
          }
          .declaration-box {
            flex: 2;
            padding-right: 10px;
          }
          .signatory-box {
            flex: 1;
            border-left: 1px solid black;
            padding-left: 10px;
          }
          .declaration-text {
            font-size: 14px;
            line-height: 18px;
          }
          .label-upper {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .place-date-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .signature-note {
            font-size: 10px;
            font-style: italic;
            margin-top: 12px;
          }
          .italic {
            font-style: italic;
          }
        </style>
      </head>
      <body>
          <div class="red-stripe-left"></div>
          <div class="red-stripe-right"></div>
        <div class="container">
          <div class="title">SHIPPER'S DECLARATION FOR DANGEROUS GOODS</div>
          
          <!-- Shipper and Air Waybill Info -->
          <div class="row">
            <div class="box box-left">
              <div class="label">Shipper</div>
              <div class="text">${shipperInfo.name}</div>
              <div class="text">${shipperInfo.street}</div>
              <div class="text">${shipperInfo.city}</div>
            </div>
            <div class="box box-right">
              <div class="label">Air Waybill No.</div>
              <div class="text">${extractedData.pagination}</div>
              <div class="text">SHIPPER'S REFERENCE NUMBER</div>
              <div class="text" style="font-size: 16px;">TCN: ${
                extractedData.shippersReferenceNumber
              }</div>
            </div>
          </div>
          
          <!-- Consignee and Warning -->
          <div class="row">
            <div class="box box-left">
              <div class="label">Consignee</div>
              <div class="text">${extractedData.consignee}</div>
            </div>
            <div class="box box-right">
              <div class="label">Warning</div>
              <div class="warning-text">Failure to comply in all respects with the applicable Dangerous Goods Regulations may be in breach of the applicable law, subject to legal penalties.</div>
            </div>
          </div>
          
          <!-- Transport Details -->
          <div class="row">
            <div class="transport-box" style="flex: 2;">
              <div class="label">TRANSPORT DETAILS</div>
              <div>This shipment is within the limitations prescribed for:</div>
              <div class="transport-options">
                <div class="aircraft-box">
                  PASSENGER AND<br>CARGO AIRCRAFT
                  ${getXOverlayHTML(!isCargoOnly)}
                </div>
                <div class="aircraft-box">
                  CARGO AIRCRAFT<br>ONLY
                  ${getXOverlayHTML(isCargoOnly)}
                </div>
              </div>
            </div>
            <div class="transport-box" style="flex: 1;">
              <div class="label">Airport of Departure:</div>
              <div class="text">${extractedData.airportOfDeparture}</div>
            </div>
            <div class="transport-box" style="flex: 1;">
              <div class="label">Airport of Destination:</div>
              <div class="text">${extractedData.airportOfDestination}</div>
            </div>
          </div>
          
          <!-- Shipment Type -->
          <div class="row">
            <div class="transport-box">
              <div class="shipment-type-row">
                <div class="label">Shipment type: <span class="italic">(delete non-applicable)</span></div>
                <div class="shipment-type-box">
                  <div class="shipment-option">
                    NON-RADIOACTIVE
                    ${getXOverlayHTML(
                      extractedData.shipmentType?.toUpperCase() ===
                        "NON-RADIOACTIVE"
                    )}
                  </div>
                  <div class="shipment-option">
                    RADIOACTIVE
                    ${getXOverlayHTML(
                      extractedData.shipmentType?.toUpperCase() ===
                        "RADIOACTIVE"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Dangerous Goods Table -->
          <div class="table-wrapper">
            <div class="label">NATURE AND QUANTITY OF DANGEROUS GOODS</div>
            <div class="table-header">
              <div class="table-cell"><div class="cell-label">UN or ID No.</div></div>
              <div class="table-cell"><div class="cell-label">Proper Shipping Name</div></div>
              <div class="table-cell"><div class="cell-label">Class or Division<br>(subsidiary hazard)</div></div>
              <div class="table-cell"><div class="cell-label">Packing Group</div></div>
              <div class="table-cell"><div class="cell-label">Quantity and Type of Packing</div></div>
              <div class="table-cell"><div class="cell-label">Packing Inst.</div></div>
              <div class="table-cell"><div class="cell-label">Authorization</div></div>
            </div>
            <div class="table-row">
              <div class="table-cell">${hazmat?.unIdNo || ""}</div>
              <div class="table-cell">${hazmat?.properShippingName || ""}</div>
              <div class="table-cell">${hazmat?.hazardClass || ""}</div>
              <div class="table-cell">${hazmat?.packingGroup || "—"}</div>
              <div class="table-cell">${hazmat?.quantityAndPacking || ""}</div>
              <div class="table-cell">${hazmat?.packingInstruction || ""}</div>
              <div class="table-cell">${hazmat?.authorization || "—"}</div>
            </div>
          </div>
          
          <!-- Additional Info -->
          <div class="info-box">
            <div class="label">Additional Handling Information</div>
            ${additionalInfoHTML}
            <div class="emergency-line">
              <span class="emergency-label">EMERGENCY TELEPHONE NUMBER:</span>
              <span class="emergency-number">${domesticEmergency} ${internationalEmergency}</span>
            </div>
          </div>
          
          <!-- Declaration and Signature -->
          <div class="declaration-row">
            <div class="declaration-box">
              <div class="declaration-text">
                I hereby declare that the contents of this consignment are fully and accurately described above by the proper shipping name, and are classified,
                packaged, marked and labelled/placarded, and are in all respects in proper condition for transport according to applicable international and national governmental regulations. I declare that all of the applicable air transport requirements have been met.
              </div>
            </div>
            <div class="signatory-box">
              <div class="label-upper">NAME/TITLE OF SIGNATORY</div>
              <div>${signatoryName}</div>
              <div>${signatoryTitle}</div>
              
              <div class="label-upper" style="margin-top: 12px;">PLACE AND DATE</div>
              <div class="place-date-row">
                <span>${location}</span>
                <span>${date}</span>
              </div>
              
              <div class="signature-note">SIGNATURE (see warning above)</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Function to generate and share PDF
  const generateAndSharePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      console.log("== Starting Inspector SDDG PDF generation ==");

      // Generate the SDDG HTML
      const html = generateFormHtml();
      console.log("Generated HTML for Inspector SDDG");

      // Create a PDF of the SDDG
      const { uri: sddgPdfUri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      console.log("Created Inspector SDDG PDF at:", sddgPdfUri);

      // Share the PDF
      await Sharing.shareAsync(sddgPdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Inspector SDDG",
      });

      // Clean up
      await FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
      console.log("Inspector SDDG generation and sharing completed");
    } catch (error) {
      console.error("Error generating or sharing Inspector SDDG PDF:", error);
      Alert.alert("Error", "Failed to generate or share PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[styles.container, { backgroundColor: "white" }]}
          ref={formRef}
          collapsable={false}
        >
          <InspectorShippersDeclarationForm extractedData={extractedData} />
          {/* <SDDGForm extractedData={extractedData} /> */}
        </View>
        <View style={styles.buttonContainer}>
          {customButtons ? (
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onReviewAgain}
                accessibilityLabel="Review Again button"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Review Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => {
                  // Mark declaration step as complete when proceeding to compliance
                  completeSDDGSubstep("InspectorShippersDeclarationScreen");
                  setCurrentSDDGStep("compliance");
                  setCurrentSDDGScreen("InteractiveSDDGComplianceScreen");
                  onProceedToCompliance?.();
                }}
                accessibilityLabel="Proceed to Compliance button"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Proceed to Compliance</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  navigation.goBack();
                }}
                accessibilityLabel="Cancel button"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={generateAndSharePdf}
                disabled={isGeneratingPdf}
                accessibilityLabel="Share Inspector SDDG button"
                accessibilityRole="button"
                accessibilityState={{ disabled: isGeneratingPdf }}
              >
                {isGeneratingPdf ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Share SDDG</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        {isGeneratingPdf && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default InspectorShippersDeclarationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  shareButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#28a745",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
