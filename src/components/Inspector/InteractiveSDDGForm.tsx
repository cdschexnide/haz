import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TappableSDDGField from "./TappableSDDGField";
import TappableTableCell from "./TappableTableCell";

export interface InteractiveSDDGFormProps {
  extractedData: {
    shipper: string;
    consignee: string;
    airwayBill: string;
    pagination: string;
    shippersReferenceNumber: string;
    inspectionActivity: string;
    aircraftType: string;
    airportOfDeparture: string;
    airportOfDestination: string;
    shipmentType: string;
    hazardousMaterials: Array<{
      airWaybillNumber: string;
      unIdNo: string;
      properShippingName: string;
      hazardClass: string;
      subsidiaryRisk: string;
      packingGroup: string;
      quantityAndPacking: string;
      packingInstruction: string;
      authorization: string;
    }>;
    additionalHandlingInfo: string;
    emergencyTelephoneNumber: string;
    nameOfSignatory: string;
    placeAndDate: string;
    signature: string;
  };
  frustratedFields: Set<string>;
  recommendedFrustrations: Map<string, string>;
  onFieldPress: (
    fieldKey: string,
    fieldLabel: string,
    fieldValue: string
  ) => void;
}

// Utility functions from original form
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
  console.log("shipper INFO: ", JSON.stringify(shipper, null, 2));
  if (!shipper || shipper.trim() === "") {
    return {
      name: "TRAFFIC MANAGEMENT FLIGHT",
      street: "5236 CHASE ST",
      city: "WRIGHT PATTERSON AFB, OH 45433-5501",
      phone: "",
      dsn: "",
    };
  }

  // Extract phone number
  const phoneRegex = /PHONE NUMBER[:\s]*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i;
  const phoneMatch = shipper.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[1].trim() : "";

  // Extract DSN
  const dsnRegex = /DSN[:\s]*(\d{3}[-.\s]?\d{4})/i;
  const dsnMatch = shipper.match(dsnRegex);
  const dsn = dsnMatch ? dsnMatch[1].trim() : "";

  // Remove phone and DSN sections from address text
  let addressText = shipper
    .replace(/PHONE NUMBER[:\s]*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi, "")
    .replace(/DSN[:\s]*\d{3}[-.\s]?\d{4}/gi, "")
    .trim();

  const lines = addressText.split("\n");
  if (lines.length > 1) {
    return {
      name: lines[0].trim(),
      street: lines[1]?.trim() || "",
      city: lines[2]?.trim() || "",
      phone,
      dsn,
    };
  }

  const trimmed = addressText.trim();
  const commaParts = trimmed.split(",");
  if (commaParts.length >= 3) {
    return {
      name: commaParts[0].trim(),
      street: commaParts[1].trim(),
      city: commaParts.slice(2).join(",").trim(),
      phone,
      dsn,
    };
  }

  return {
    name: trimmed,
    street: "",
    city: "",
    phone,
    dsn,
  };
};

const parseConsigneeInfo = (consignee: string) => {
  if (!consignee) {
    return {
      name: "No consignee data",
      street: "",
      city: "",
      phone: "",
    };
  }

  // Multi-line format (separated by \n)
  const lines = consignee.split("\n");
  if (lines.length > 1) {
    return {
      name: lines[0]?.trim() || "",
      street: lines[1]?.trim() || "",
      city: lines[2]?.trim() || "",
      phone: lines[3]?.trim() || "",
    };
  }

  // Comma-separated format
  const commaParts = consignee.trim().split(",");
  if (commaParts.length >= 3) {
    return {
      name: commaParts[0].trim(),
      street: commaParts[1].trim(),
      city: commaParts.slice(2).join(",").trim(), // ALL remaining parts
      phone: "",
    };
  }

  // Space-separated format - capture ALL words, don't truncate
  const parts = consignee.trim().split(" ");
  if (parts.length >= 6) {
    // Strategy: First few words are organization, middle words are department, rest is address
    return {
      name: parts.slice(0, 4).join(" "), // First 4 words for org name
      street: parts.slice(4, 8).join(" "), // Next 4 words for department/unit
      city: parts.slice(8).join(" "), // ALL remaining words for address
      phone: "",
    };
  }

  // Fallback: treat as single-line data
  return {
    name: consignee,
    street: "",
    city: "",
    phone: "",
  };
};

/**
 * Interactive SDDG form with all 22 fields wrapped in tappable zones.
 * Maintains exact visual layout of official SDDG form.
 */
const InteractiveSDDGForm: React.FC<InteractiveSDDGFormProps> = ({
  extractedData,
  frustratedFields,
  recommendedFrustrations,
  onFieldPress,
}) => {
  // Parse combined fields
  const { name: signatoryName, title: signatoryTitle } = parseNameOfSignatory(
    extractedData.nameOfSignatory
  );
  const { location, date } = parsePlaceAndDate(extractedData.placeAndDate);
  const { domestic: domesticEmergency, international: internationalEmergency } =
    parseEmergencyNumbers(extractedData.emergencyTelephoneNumber);
  const { dsn, collect, otherInfo } = parseAdditionalHandlingInfo(
    extractedData.additionalHandlingInfo
  );
  const shipperInfo = parseShipperInfo(extractedData.shipper);

  const consigneeInfo = parseConsigneeInfo(extractedData.consignee);

  const hazmat = extractedData.hazardousMaterials?.[0] || {};

  console.log("hazmat: ", JSON.stringify(hazmat, null, 2));

  const aircraftTypeUpper = extractedData.aircraftType?.toUpperCase();
  const isCargoOnly = aircraftTypeUpper !== "PASSENGER AND CARGO AIRCRAFT";

  return (
    <View style={styles.container}>
      <View style={styles.redStripeLeft} />
      <View style={styles.redStripeRight} />

      <Text style={styles.disclaimerText}>
        HazPro Digital Representation – For Inspector Reference Only, Not for
        Official Use. Original and Updated SDDG Required for Official Shipment
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
              fieldValue={extractedData.shipper}
              isFrustrated={frustratedFields.has("shipper")}
              isRecommended={recommendedFrustrations.has("shipper")}
              onPress={onFieldPress}
            >
              <View style={styles.boxLeft}>
                <Text style={styles.label}>Shipper</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{shipperInfo.name}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{shipperInfo.street}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{shipperInfo.city}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                  <Text style={styles.text2}>
                    <Text style={[styles.text2, { fontWeight: "600" }]}>
                      PHONE NUMBER:
                    </Text>{" "}
                    {shipperInfo.phone}
                  </Text>
                  <Text style={[styles.text2, { marginLeft: 20 }]}>
                    <Text style={[styles.text2, { fontWeight: "600" }]}>
                      DSN:
                    </Text>{" "}
                    {shipperInfo.dsn}
                  </Text>
                </View>
              </View>
            </TappableSDDGField>
          </View>

          <View style={styles.boxRight}>
            {/* Key 3: Air Waybill Number */}
            <TappableSDDGField
              fieldKey="airWaybillNumber"
              fieldLabel="AIRWAY BILL NO. (Key 3)"
              fieldValue={extractedData.pagination}
              isFrustrated={frustratedFields.has("airWaybillNumber")}
              isRecommended={recommendedFrustrations.has("airWaybillNumber")}
              onPress={onFieldPress}
            >
              <View>
                <Text style={styles.label}>Air Waybill No.</Text>
                <Text style={styles.text3}>{extractedData.pagination}</Text>
              </View>
            </TappableSDDGField>

            {/* Key 5: TCN/Shipper's Reference Number */}
            <TappableSDDGField
              fieldKey="shippersReferenceNumber"
              fieldLabel="TCN (Key 5)"
              fieldValue={extractedData.shippersReferenceNumber}
              isFrustrated={frustratedFields.has("shippersReferenceNumber")}
              isRecommended={recommendedFrustrations.has(
                "shippersReferenceNumber"
              )}
              onPress={onFieldPress}
            >
              <View>
                <Text style={styles.text}>SHIPPER'S REFERENCE NUMBER</Text>
                <Text style={styles.text4}>
                  TCN: {extractedData.shippersReferenceNumber}
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
              fieldValue={extractedData.consignee}
              isFrustrated={frustratedFields.has("consignee")}
              isRecommended={recommendedFrustrations.has("consignee")}
              onPress={onFieldPress}
            >
              <View style={styles.boxLeft}>
                <Text style={styles.label}>Consignee</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{consigneeInfo.name}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{consigneeInfo.street}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{consigneeInfo.city}</Text>
              </View>
            </TappableSDDGField>
          </View>

          <View style={styles.boxRight} />
        </View>

        <View style={styles.row}>
          <View style={[styles.transportBox, { flex: 1.6 }]}>
            <Text style={styles.label}>TRANSPORT DETAILS</Text>
            <Text>This shipment is within the limitations prescribed for:</Text>

            {/* Key 7: Aircraft Type */}
            <TappableSDDGField
              fieldKey="aircraftType"
              fieldLabel="AIRCRAFT TYPE (Key 7)"
              fieldValue={extractedData.aircraftType}
              isFrustrated={frustratedFields.has("aircraftType")}
              isRecommended={recommendedFrustrations.has("aircraftType")}
              onPress={onFieldPress}
            >
              <View style={styles.transportOptions}>
                <View style={styles.aircraftBox}>
                  <Text style={styles.aircraftLabel}>
                    PASSENGER AND{"\n"}CARGO AIRCRAFT
                  </Text>
                  {isCargoOnly && (
                    <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                  )}
                </View>
                <View style={styles.aircraftBox}>
                  <Text style={styles.aircraftLabel}>
                    CARGO AIRCRAFT{"\n"}ONLY
                  </Text>
                  {!isCargoOnly && (
                    <Text style={styles.xOverlayText}>XXXXXXX</Text>
                  )}
                </View>
              </View>
            </TappableSDDGField>

            <View style={styles.airportRow}>
              {/* Key 8: Airport of Departure */}
              <TappableSDDGField
                fieldKey="airportOfDeparture"
                fieldLabel="AIRPORT OF DEPARTURE (Key 8)"
                fieldValue={extractedData.airportOfDeparture}
                isFrustrated={frustratedFields.has("airportOfDeparture")}
                isRecommended={recommendedFrustrations.has(
                  "airportOfDeparture"
                )}
                onPress={onFieldPress}
              >
                <View style={[styles.airportBox, { flex: 1 }]}>
                  <Text style={styles.label}>Airport of Departure:</Text>
                  <Text style={styles.text}>
                    {extractedData.airportOfDeparture}
                  </Text>
                </View>
              </TappableSDDGField>

              {/* Key 9: Airport of Destination */}
              <TappableSDDGField
                fieldKey="airportOfDestination"
                fieldLabel="AIRPORT OF DESTINATION (Key 9)"
                fieldValue={extractedData.airportOfDestination}
                isFrustrated={frustratedFields.has("airportOfDestination")}
                isRecommended={recommendedFrustrations.has(
                  "airportOfDestination"
                )}
                onPress={onFieldPress}
              >
                <View style={[styles.airportBox, { flex: 1 }]}>
                  <Text style={styles.label}>Airport of Destination:</Text>
                  <Text style={styles.text}>
                    {extractedData.airportOfDestination}
                  </Text>
                </View>
              </TappableSDDGField>
            </View>
          </View>

          <View style={[styles.rightColumn, { flex: 1.4 }]}>
            <View style={[styles.transportBox, styles.topRightBox]}>
              <Text style={styles.label}>Warning</Text>
              <Text style={styles.warningText}>
                Failure to comply in all respects with the applicable Dangerous
                Goods Regulations may be in breach of the applicable law,
                subject to legal penalties.
              </Text>
            </View>

            <View style={[styles.transportBox, styles.bottomRightBox]}>
              {/* Key 10: Shipment Type */}
              <TappableSDDGField
                fieldKey="shipmentType"
                fieldLabel="SHIPMENT TYPE (Key 10)"
                fieldValue={extractedData.shipmentType}
                isFrustrated={frustratedFields.has("shipmentType")}
                isRecommended={recommendedFrustrations.has("shipmentType")}
                onPress={onFieldPress}
              >
                <View style={styles.shipmentTypeRow}>
                  <Text style={styles.label}>
                    Shipment type:{" "}
                    <Text style={styles.italic}>(delete non-applicable)</Text>
                  </Text>
                  <View style={styles.shipmentTypeBox}>
                    <View style={styles.shipmentOption}>
                      <Text style={styles.aircraftLabel}>NON-RADIOACTIVE</Text>
                      {extractedData.shipmentType?.toUpperCase() ===
                        "RADIOACTIVE" && (
                        <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                      )}
                    </View>
                    <View style={styles.shipmentOption}>
                      <Text style={styles.aircraftLabel}>RADIOACTIVE</Text>
                      {extractedData.shipmentType?.toUpperCase() ===
                        "NON-RADIOACTIVE" && (
                        <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                      )}
                    </View>
                  </View>
                </View>
              </TappableSDDGField>
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
                key: "unIdNo",
                label: "UN or ID NO. (Key 11)",
                value: hazmat.unIdNo || "",
              },
              {
                key: "properShippingName",
                label: "PROPER SHIPPING NAME (Key 12)",
                value: hazmat.properShippingName || "",
              },
              {
                key: "hazardClass",
                label: "CLASS or DIVISION (Key 13)",
                value: hazmat.hazardClass || "",
              },
              {
                key: "packingGroup",
                label: "PACKING GROUP (Key 15)",
                value: hazmat.packingGroup || "—",
              },
              {
                key: "quantityAndPacking",
                label: "QUANTITY AND TYPE OF PACKING (Key 16)",
                value: hazmat.quantityAndPacking || "",
              },
              {
                key: "packingInstruction",
                label: "PACKING INSTRUCTION (Key 17)",
                value: hazmat.packingInstruction || "",
              },
              {
                key: "authorization",
                label: "AUTHORIZATION (Key 18)",
                value: hazmat.authorization || "—",
              },
            ].map((field, idx) => (
              <View style={{ flex: 1 }} key={field.key}>
                <TappableTableCell
                  fieldKey={field.key}
                  fieldLabel={field.label}
                  fieldValue={field.value}
                  isFrustrated={frustratedFields.has(field.key)}
                  isRecommended={recommendedFrustrations.has(field.key)}
                  onPress={onFieldPress}
                >
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{field.value}</Text>
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
          fieldValue={extractedData.additionalHandlingInfo}
          isFrustrated={frustratedFields.has("additionalHandlingInfo")}
          isRecommended={recommendedFrustrations.has("additionalHandlingInfo")}
          onPress={onFieldPress}
        >
          <View style={styles.infoBox}>
            <Text style={styles.label}>Additional Handling Information</Text>
            <View>
              {/* Display other info if present */}
              {otherInfo && otherInfo.trim() !== "" && (
                <Text style={styles.infoLine}>{otherInfo}</Text>
              )}

              {/* Display emergency telephone numbers */}
              <View style={styles.emergencyLineContainer}>
                <Text style={styles.emergencyLabel}>
                  Emergency Telephone Number:
                </Text>
                {dsn && (
                  <Text style={styles.emergencyNumber}>DSN: {dsn}</Text>
                )}
                {collect && (
                  <Text style={[styles.emergencyNumber, { marginLeft: 20 }]}>Collect: {collect}</Text>
                )}

                {/* Fallback to hardcoded numbers if not extracted from additional_handling */}
                {!dsn && !collect && (domesticEmergency || internationalEmergency) && (
                  <Text style={styles.emergencyNumber}>
                    {domesticEmergency} {internationalEmergency}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TappableSDDGField>

        {/* Declaration and Signature */}
        <View style={styles.declarationRow}>
          <View style={styles.declarationBox}>
            <Text style={styles.declarationText}>
              I hereby declare that the contents of this consignment are fully
              and accurately described above by the proper shipping name, and
              are classified, packaged, marked and labelled/placarded, and are
              in all respects in proper condition for transport according to
              applicable international and national governmental regulations. I
              declare that all of the applicable air transport requirements have
              been met.
            </Text>
          </View>

          <View style={styles.signatoryBox}>
            {/* Key 20: Name of Signatory */}
            <TappableSDDGField
              fieldKey="nameOfSignatory"
              fieldLabel="NAME/TITLE OF SIGNATORY (Key 20)"
              fieldValue={extractedData.nameOfSignatory}
              isFrustrated={frustratedFields.has("nameOfSignatory")}
              isRecommended={recommendedFrustrations.has("nameOfSignatory")}
              onPress={onFieldPress}
            >
              <View>
                <Text style={styles.labelUpper}>NAME/TITLE OF SIGNATORY</Text>
                <Text style={{ color: "#000" }}>{signatoryName}</Text>
                <Text style={{ color: "#000" }}>{signatoryTitle}</Text>
              </View>
            </TappableSDDGField>

            {/* Key 21: Place and Date */}
            <TappableSDDGField
              fieldKey="placeAndDate"
              fieldLabel="PLACE AND DATE (Key 21)"
              fieldValue={extractedData.placeAndDate}
              isFrustrated={frustratedFields.has("placeAndDate")}
              isRecommended={recommendedFrustrations.has("placeAndDate")}
              onPress={onFieldPress}
            >
              <View>
                <Text style={[styles.labelUpper, { marginTop: 12 }]}>
                  PLACE AND DATE
                </Text>
                <View style={styles.placeDateRow}>
                  <Text style={{ color: "#000" }}>{location}</Text>
                  <Text style={{ color: "#000" }}>{date}</Text>
                </View>
              </View>
            </TappableSDDGField>

            {/* Key 22: Signature */}
            <TappableSDDGField
              fieldKey="signature"
              fieldLabel="SIGNATURE (Key 22)"
              fieldValue={extractedData.signature}
              isFrustrated={frustratedFields.has("signature")}
              isRecommended={recommendedFrustrations.has("signature")}
              onPress={onFieldPress}
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
        HazPro Digital Representation – For Inspector Reference Only, Not for
        Official Use. Original and Updated SDDG Required for Official Shipment
      </Text>
    </View>
  );
};

export default InteractiveSDDGForm;

// Styles from original form
const styles = StyleSheet.create({
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
  },
  boxRight: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
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
  emergencyLineContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  emergencyLabel: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 4,
    color: "#000",
  },
  emergencyNumber: {
    fontSize: 13,
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
  placeDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
});
