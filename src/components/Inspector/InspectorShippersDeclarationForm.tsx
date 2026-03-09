import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export interface InspectorShippersDeclarationProps {
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
}

// Utility function to parse combined fields from mock data
const parseNameOfSignatory = (nameOfSignatory: string) => {
  // "Austin Stewart Warehouse Foreman" -> name: "Austin Stewart", title: "Warehouse Foreman"
  const parts = nameOfSignatory.trim().split(' ');
  if (parts.length >= 3) {
    const name = parts.slice(0, 2).join(' ');
    const title = parts.slice(2).join(' ');
    return { name, title };
  }
  return { name: nameOfSignatory, title: '' };
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

  return { location: placeAndDate, date: '' };
};

const parseEmergencyNumbers = (emergencyTelephoneNumber: string) => {
  // "1-800-851-8061 | 1-804-279-3131" -> domestic: "1-800-851-8061", international: "1-804-279-3131"
  const numbers = emergencyTelephoneNumber.split(' | ');
  return {
    domestic: numbers[0] || '',
    international: numbers[1] || ''
  };
};

const parseAdditionalHandlingInfo = (additionalHandling: string) => {
  // Extract DSN number (format: "DSN: 312-225-4695/4696")
  const dsnRegex = /DSN:\s*([\d-/]+)/i;
  const dsnMatch = additionalHandling.match(dsnRegex);
  const dsn = dsnMatch ? dsnMatch[1].trim() : '';

  // Extract Collect number (format: "Collect: +1 (703) 695-4695/4696")
  const collectRegex = /Collect:\s*(\+?\d[\d\s\(\)-/]+)/i;
  const collectMatch = additionalHandling.match(collectRegex);
  const collect = collectMatch ? collectMatch[1].trim() : '';

  // Remove emergency number section from the text to avoid duplication
  let cleanedText = additionalHandling
    .replace(/Emergency Telephone Number:/gi, '')
    .replace(/DSN:\s*[\d-/]+/gi, '')
    .replace(/Collect:\s*\+?\d[\d\s\(\)-/]+/gi, '')
    .replace(/EMERGENCY TELEPHONE NUMBER:/gi, '')
    .trim();

  // Clean up extra whitespace and newlines
  cleanedText = cleanedText.replace(/\n\s*\n/g, '\n').trim();

  return {
    dsn,
    collect,
    otherInfo: cleanedText,
  };
};

const parseShipperInfo = (shipper: string) => {
  console.log('🔍 [parseShipperInfo] Input shipper:', JSON.stringify(shipper));

  // Handle empty or invalid shipper data
  if (!shipper || shipper.trim() === '') {
    console.log('🔍 [parseShipperInfo] Empty shipper');
    return {
      name: '',
      street: '',
      city: '',
      phone: '',
      dsn: ''
    };
  }

  // Extract phone number
  const phoneRegex = /PHONE NUMBER[:\s]*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i;
  const phoneMatch = shipper.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[1].trim() : "";
  console.log('🔍 [parseShipperInfo] Extracted phone:', phone);

  // Extract DSN
  const dsnRegex = /DSN[:\s]*(\d{3}[-.\s]?\d{4})/i;
  const dsnMatch = shipper.match(dsnRegex);
  const dsn = dsnMatch ? dsnMatch[1].trim() : "";
  console.log('🔍 [parseShipperInfo] Extracted DSN:', dsn);

  // Remove phone and DSN sections from address text for parsing
  const addressText = shipper
    .replace(/PHONE NUMBER[:\s]*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi, "")
    .replace(/DSN[:\s]*\d{3}[-.\s]?\d{4}/gi, "")
    .trim();
  console.log('🔍 [parseShipperInfo] Address text after removing phone/DSN:', JSON.stringify(addressText));

  // Multi-line format (separated by \n)
  const lines = addressText.split('\n');
  console.log('🔍 [parseShipperInfo] Lines after split:', lines);
  if (lines.length > 1) {
    console.log('🔍 [parseShipperInfo] Multi-line format detected');
    const result = {
      name: lines[0].trim(),
      street: lines[1]?.trim() || '',
      city: lines[2]?.trim() || '',
      phone,
      dsn
    };
    console.log('🔍 [parseShipperInfo] Multi-line result:', result);
    return result;
  }

  // Single line format - parse dynamically
  const trimmed = addressText.trim();
  console.log('🔍 [parseShipperInfo] Single line format, trimmed:', JSON.stringify(trimmed));
  
  // Try comma-separated format: "COMPANY NAME, 123 MAIN ST, CITY, STATE ZIP"
  const commaParts = trimmed.split(',');
  console.log('🔍 [parseShipperInfo] Comma parts:', commaParts);
  if (commaParts.length >= 3) {
    console.log('🔍 [parseShipperInfo] Using comma-separated format');
    const result = {
      name: commaParts[0].trim(),
      street: commaParts[1].trim(),
      city: commaParts.slice(2).join(',').trim(),
      phone,
      dsn
    };
    console.log('🔍 [parseShipperInfo] Comma-separated result:', result);
    return result;
  }
  
  // Try space-separated format: "COMPANY NAME 123 MAIN ST CITY AFB, STATE ZIP"
  const words = trimmed.split(' ');
  console.log('🔍 [parseShipperInfo] Space-separated words:', words);
  if (words.length > 6) {
    console.log('🔍 [parseShipperInfo] Using space-separated format');
    // Try to identify where the company name ends and street address begins
    // Look for pattern like "FLIGHT" followed by numbers (street address)
    let nameEndIndex = -1;
    for (let i = 0; i < words.length - 3; i++) {
      // Check if next word looks like a street number
      if (words[i + 1] && /^\d+$/.test(words[i + 1])) {
        console.log('🔍 [parseShipperInfo] Found street number after word:', words[i], 'street number:', words[i + 1]);
        nameEndIndex = i;
        break;
      }
    }
    console.log('🔍 [parseShipperInfo] Name ends at index:', nameEndIndex);
    
    if (nameEndIndex > 0) {
      const name = words.slice(0, nameEndIndex + 1).join(' ');
      const remainingWords = words.slice(nameEndIndex + 1);
      console.log('🔍 [parseShipperInfo] Company name:', name);
      console.log('🔍 [parseShipperInfo] Remaining words for address:', remainingWords);
      
      // Find where street address ends (look for base/city name pattern)
      let streetEndIndex = -1;
      for (let i = 0; i < remainingWords.length - 2; i++) {
        const word = remainingWords[i];
        const nextWord = remainingWords[i + 1];

        // Look for generic "XXX AFB" pattern (air force base marks city boundary)
        if (nextWord === 'AFB' || word === 'AFB') {
          console.log('🔍 [parseShipperInfo] Found AFB pattern at index:', i);
          streetEndIndex = i - 1; // Street ends before base name
          break;
        }
        // Look for state abbreviation (2 capital letters, but not street suffixes)
        else if (word && word.length === 2 && /^[A-Z]{2}$/.test(word)) {
          // Common street suffixes that are NOT state abbreviations
          const streetSuffixes = ['ST', 'RD', 'DR', 'LN', 'CT', 'PL', 'AV', 'BL'];
          if (!streetSuffixes.includes(word)) {
            console.log('🔍 [parseShipperInfo] Found state abbreviation:', word, 'at index:', i);
            streetEndIndex = i - 1; // Street ends before the state
            break;
          } else {
            console.log('🔍 [parseShipperInfo] Skipping street suffix:', word, 'at index:', i);
          }
        }
      }
      console.log('🔍 [parseShipperInfo] Street ends at index:', streetEndIndex);
      
      if (streetEndIndex >= 0) {
        const street = remainingWords.slice(0, streetEndIndex + 1).join(' ');
        const city = remainingWords.slice(streetEndIndex + 1).join(' ');
        console.log('🔍 [parseShipperInfo] Street:', street);
        console.log('🔍 [parseShipperInfo] City:', city);
        const result = {
          name,
          street,
          city,
          phone,
          dsn
        };
        console.log('🔍 [parseShipperInfo] Space-separated result:', result);
        return result;
      } else {
        // Fallback: assume first 3-4 words after name are street address
        console.log('🔍 [parseShipperInfo] Using fallback parsing');
        const street = remainingWords.slice(0, 3).join(' ');
        const city = remainingWords.slice(3).join(' ');
        console.log('🔍 [parseShipperInfo] Fallback street:', street);
        console.log('🔍 [parseShipperInfo] Fallback city:', city);
        const result = {
          name,
          street,
          city,
          phone,
          dsn
        };
        console.log('🔍 [parseShipperInfo] Fallback result:', result);
        return result;
      }
    }
  }
  
  // Fallback: treat entire string as company name if parsing fails
  console.log('🔍 [parseShipperInfo] Using final fallback - entire string as name');
  const result = {
    name: trimmed,
    street: '',
    city: '',
    phone,
    dsn
  };
  console.log('🔍 [parseShipperInfo] Final fallback result:', result);
  return result;
};

const parseConsigneeInfo = (consignee: string) => {
  if (!consignee) {
    return {
      name: 'No consignee data',
      street: '',
      city: '',
      phone: ''
    };
  }

  // Multi-line format (separated by \n)
  const lines = consignee.split('\n');
  if (lines.length > 1) {
    return {
      name: lines[0]?.trim() || '',
      street: lines[1]?.trim() || '',
      city: lines[2]?.trim() || '',
      phone: lines[3]?.trim() || ''
    };
  }

  // Comma-separated format
  const commaParts = consignee.trim().split(',');
  if (commaParts.length >= 3) {
    return {
      name: commaParts[0].trim(),
      street: commaParts[1].trim(),
      city: commaParts.slice(2).join(',').trim(), // ALL remaining parts
      phone: ''
    };
  }

  // Space-separated format - capture ALL words, don't truncate
  const parts = consignee.trim().split(' ');
  if (parts.length >= 6) {
    // Strategy: First few words are organization, middle words are department, rest is address
    return {
      name: parts.slice(0, 4).join(' '), // First 4 words for org name
      street: parts.slice(4, 8).join(' '), // Next 4 words for department/unit
      city: parts.slice(8).join(' '), // ALL remaining words for address
      phone: ''
    };
  }

  // Fallback: treat as single-line data
  return {
    name: consignee,
    street: '',
    city: '',
    phone: ''
  };
};

const InspectorShippersDeclarationForm = ({
  extractedData,
}: InspectorShippersDeclarationProps) => {
  // Debug logging
  console.log('🔍 [InspectorForm] Received extractedData:', extractedData);
  console.log('🔍 [InspectorForm] Shipper:', extractedData?.shipper);
  console.log('🔍 [InspectorForm] Consignee:', extractedData?.consignee);
  
  // Parse combined fields
  const { name: signatoryName, title: signatoryTitle } = parseNameOfSignatory(extractedData.nameOfSignatory);
  const { location, date } = parsePlaceAndDate(extractedData.placeAndDate);
  const { domestic: domesticEmergency, international: internationalEmergency } = parseEmergencyNumbers(extractedData.emergencyTelephoneNumber);
  const { dsn, collect, otherInfo } = parseAdditionalHandlingInfo(extractedData.additionalHandlingInfo);
  const shipperInfo = parseShipperInfo(extractedData.shipper);
  const consigneeInfo = parseConsigneeInfo(extractedData.consignee);
  
  // Get first hazardous material (inspector data typically has single item)
  const hazmat = extractedData.hazardousMaterials?.[0] || {};
  
  // Determine aircraft type selection - handle both case variations
  const aircraftTypeUpper = extractedData.aircraftType?.toUpperCase();
  const isCargoOnly = aircraftTypeUpper !== "PASSENGER AND CARGO AIRCRAFT";

  return (
    <View style={styles.container}>
      <View style={styles.redStripeLeft} />
      <View style={styles.redStripeRight} />

      {/* Header Disclaimer */}
      <Text style={styles.disclaimerText}>
        HazPro Digital Representation – For Inspector Reference Only, Not for Official Use. Original and Updated SDDG Required for Official Shipment
      </Text>

      <View style={styles.formContainer}>
        {/* Header Title */}
        <Text style={styles.title}>
          SHIPPER'S DECLARATION FOR DANGEROUS GOODS
        </Text>

        {/* Top Section */}
        <View style={styles.row}>
          <View style={styles.boxLeft}>
            <Text style={styles.label}>Shipper</Text>
            <Text style={styles.text}>{shipperInfo.name}</Text>
            <Text style={styles.text}>{shipperInfo.street}</Text>
            <Text style={styles.text}>{shipperInfo.city}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={styles.text2}>
                <Text style={[styles.text2, { fontWeight: 600 }]}>PHONE NUMBER:</Text> {shipperInfo.phone}
              </Text>
              <Text style={[styles.text2, { marginLeft: 20 }]}>
                <Text style={[styles.text2, { fontWeight: 600 }]}>DSN:</Text> {shipperInfo.dsn}
              </Text>
            </View>
          </View>
          <View style={styles.boxRight}>
            <Text style={styles.label}>Air Waybill No.</Text>
            <Text style={styles.text3}>{extractedData.pagination}</Text>
            <Text style={styles.text}>SHIPPER'S REFERENCE NUMBER</Text>
            <Text style={styles.text4}>TCN: {extractedData.shippersReferenceNumber}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.boxLeft}>
            <Text style={styles.label}>Consignee</Text>
            <Text style={styles.text}>{consigneeInfo.name}</Text>
            <Text style={styles.text}>{consigneeInfo.street}</Text>
            <Text style={styles.text}>{consigneeInfo.city}</Text>
            {consigneeInfo.phone && (
              <Text style={styles.text2}>
                <Text style={[styles.text2, { fontWeight: 600 }]}>Phone:</Text> {consigneeInfo.phone}
              </Text>
            )}
          </View>

          <View style={styles.boxRight}>
            {/* <Text style={styles.label}>Warning</Text>
            <Text style={styles.warningText}>
              Failure to comply in all respects with the applicable Dangerous
              Goods Regulations may be in breach of the applicable law, subject
              to legal penalties.
            </Text> */}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.transportBox, { flex: 1.6 }]}>
            <Text style={styles.label}>TRANSPORT DETAILS</Text>
            <Text>This shipment is within the limitations prescribed for:</Text>
            <View style={styles.transportOptions}>
              <View style={styles.aircraftBox}>
                <Text style={styles.aircraftLabel}>
                  PASSENGER AND{"\n"}CARGO AIRCRAFT
                </Text>
                {isCargoOnly && <Text style={styles.xOverlayText}>XXXXXXXX</Text>}
              </View>
              <View style={styles.aircraftBox}>
                <Text style={styles.aircraftLabel}>
                  CARGO AIRCRAFT{"\n"}ONLY
                </Text>
                {!isCargoOnly && <Text style={styles.xOverlayText}>XXXXXXX</Text>}
              </View>
            </View>
            <View style={styles.airportRow}>
              <View style={[styles.airportBox, { flex: 1 }]}>
                <Text style={styles.label}>Airport of Departure:</Text>
                <Text style={styles.text}>{extractedData.airportOfDeparture}</Text>
              </View>
              <View style={[styles.airportBox, { flex: 1 }]}>
                <Text style={styles.label}>Airport of Destination:</Text>
                <Text style={styles.text}>{extractedData.airportOfDestination}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.rightColumn, { flex: 1.4 }]}>
            <View style={[styles.transportBox, styles.topRightBox]}>
              <Text style={styles.label}>Warning</Text>
              <Text style={styles.warningText}>
                Failure to comply in all respects with the applicable Dangerous
                Goods Regulations may be in breach of the applicable law, subject
                to legal penalties.
              </Text>
            </View>
            <View style={[styles.transportBox, styles.bottomRightBox]}>
              <View style={styles.shipmentTypeRow}>
                <Text style={styles.label}>
                  Shipment type:{" "}
                  <Text style={styles.italic}>(delete non-applicable)</Text>
                </Text>
                <View style={styles.shipmentTypeBox}>
                  <View style={styles.shipmentOption}>
                    <Text style={styles.aircraftLabel}>NON-RADIOACTIVE</Text>
                    {extractedData.shipmentType?.toUpperCase() === "RADIOACTIVE" && (
                      <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                    )}
                  </View>
                  <View style={styles.shipmentOption}>
                    <Text style={styles.aircraftLabel}>RADIOACTIVE</Text>
                    {extractedData.shipmentType?.toUpperCase() === "NON-RADIOACTIVE" && (
                      <Text style={styles.xOverlayText}>XXXXXXXX</Text>
                    )}
                  </View>
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
            {[
              hazmat.unIdNo || "",
              hazmat.properShippingName || "",
              hazmat.hazardClass || "",
              hazmat.packingGroup || "—",
              hazmat.quantityAndPacking || "",
              hazmat.packingInstruction || "",
              hazmat.authorization || "—",
            ].map((val, idx) => (
              <View style={styles.tableCell} key={idx}>
                <Text style={styles.tableCellText}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Additional Handling Information</Text>
          <View>
            {/* Display other info if present */}
            {otherInfo && otherInfo.trim() !== '' && (
              <Text style={styles.infoLine}>{otherInfo}</Text>
            )}

            {/* Display emergency telephone numbers */}
            <Text style={styles.emergencyLabel}>
              Emergency Telephone Number:
            </Text>
            {dsn && (
              <Text style={styles.emergencyNumber}>DSN: {dsn}</Text>
            )}
            {collect && (
              <Text style={styles.emergencyNumber}>Collect: {collect}</Text>
            )}

            {/* Fallback to hardcoded numbers if not extracted from additional_handling */}
            {!dsn && !collect && (domesticEmergency || internationalEmergency) && (
              <Text style={styles.emergencyNumber}>
                {domesticEmergency} {internationalEmergency}
              </Text>
            )}
          </View>
        </View>

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
            <Text style={styles.labelUpper}>NAME/TITLE OF SIGNATORY</Text>
            <Text style={{ color: "#000" }}>{signatoryName}</Text>
            <Text style={{ color: "#000" }}>{signatoryTitle}</Text>

            <Text style={[styles.labelUpper, { marginTop: 12 }]}>
              PLACE AND DATE
            </Text>
            <View style={styles.placeDateRow}>
              <Text style={{ color: "#000" }}>{location}</Text>
              <Text style={{ color: "#000" }}>{date}</Text>
            </View>

            <Text style={styles.signatureNote}>
              SIGNATURE (see warning above)
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Disclaimer */}
      <Text style={styles.disclaimerText}>
        HazPro Digital Representation – For Inspector Reference Only, Not for Official Use. Original and Updated SDDG Required for Official Shipment
      </Text>
    </View>
  );
};

export default InspectorShippersDeclarationForm;

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
  column: {
    flex: 1,
  },
  boxLeft: {
    flex: 1,
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
  underline: {
    textDecorationLine: "underline",
    marginTop: 4,
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
    height: 200,
  },
  tableCell: {
    flex: 1,
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
  text5: {
    paddingLeft: 10,
    paddingBottom: 10,
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
