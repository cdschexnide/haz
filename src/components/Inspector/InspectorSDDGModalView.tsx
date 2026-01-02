import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import InspectorShippersDeclarationForm, { InspectorShippersDeclarationProps } from './InspectorShippersDeclarationForm';

interface InspectorSDDGModalViewProps {
  visible: boolean;
  extractedData: InspectorShippersDeclarationProps['extractedData'];
  onClose: () => void;
}

const InspectorSDDGModalView: React.FC<InspectorSDDGModalViewProps> = ({
  visible,
  extractedData,
  onClose,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Parse combined fields for HTML generation
  const parseNameOfSignatory = (nameOfSignatory: string) => {
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
    return {
      name: 'TRAFFIC MANAGEMENT FLIGHT',
      street: '5236 CHASE RD',
      city: 'WRIGHT PATTERSON AFB, OH 45433-5501'
    };
  };

  // Generate HTML for PDF export
  const generateFormHtml = (): string => {
    const { name: signatoryName, title: signatoryTitle } = parseNameOfSignatory(extractedData.nameOfSignatory);
    const { location, date } = parsePlaceAndDate(extractedData.placeAndDate);
    const { domestic: domesticEmergency, international: internationalEmergency } = parseEmergencyNumbers(extractedData.emergencyTelephoneNumber);
    const { dsn, collect, otherInfo } = parseAdditionalHandlingInfo(extractedData.additionalHandlingInfo);
    const shipperInfo = parseShipperInfo(extractedData.shipper);

    const hazmat = extractedData.hazardousMaterials?.[0] || {};
    const isCargoOnly = extractedData.aircraftType !== "PASSENGER AND CARGO AIRCRAFT";

    const getXOverlayHTML = (condition: boolean): string => {
      return condition ? "" : '<div class="x-overlay">XXXXXXXX</div>';
    };

    // Generate additional information HTML
    let additionalInfoHTML = "";
    if (otherInfo && otherInfo.trim() !== '') {
      additionalInfoHTML = `<p class="info-line">${otherInfo}</p>`;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipper's Declaration for Dangerous Goods</title>
        <style>
          @page { size: letter portrait; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: white; color: black; }
          .container { position: relative; border: 1px solid black; padding: 5px; margin: 10px; background: white; }
          .red-stripe-left, .red-stripe-right { position: fixed; top: 0; bottom: 0; width: 5px; border-left: 5px dashed red; z-index: 1000; }
          .red-stripe-left { left: 0; } .red-stripe-right { right: 0; }
          .title { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 16px; }
          .row { display: flex; margin-bottom: 12px; }
          .box { border: 1px solid black; padding: 8px; }
          .box-left { flex: 1; margin-right: 8px; } .box-right { flex: 1; }
          .label { font-weight: bold; font-size: 14px; margin-bottom: 4px; padding: 4px 0; }
          .text { font-size: 13px; margin: 4px 0; }
          .transport-box { border: 1px solid black; padding: 8px; flex: 1; }
          .transport-options { display: flex; border: 1px solid black; margin-top: 4px; }
          .aircraft-box { flex: 1; text-align: center; padding: 10px 0; position: relative; border-right: 1px solid black; }
          .aircraft-box:last-child { border-right: none; }
          .x-overlay { position: absolute; font-weight: bold; font-size: 24px; text-align: center; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; }
          .table-wrapper { margin-top: 16px; border: 1px solid black; }
          .table-header { display: flex; background-color: #e9ecef; border-bottom: 1px solid black; }
          .table-row { display: flex; min-height: 200px; }
          .table-cell { flex: 1; padding: 6px; border-right: 1px solid black; font-size: 13px; }
          .table-cell:last-child { border-right: none; }
          .cell-label { font-weight: bold; font-size: 12px; }
          .info-box { border-top: 1px solid black; padding-top: 10px; margin-top: 16px; margin-bottom: 16px; }
          .info-line { font-size: 14px; margin: 4px 0; }
          .emergency-line { display: flex; justify-content: flex-end; align-items: center; margin-top: 8px; flex-wrap: wrap; }
          .emergency-label { font-size: 13px; font-weight: bold; margin-right: 4px; }
          .emergency-number { font-size: 13px; }
          .declaration-row { display: flex; border-top: 1px solid black; padding-top: 12px; }
          .declaration-box { flex: 2; padding-right: 10px; }
          .signatory-box { flex: 1; border-left: 1px solid black; padding-left: 10px; }
          .declaration-text { font-size: 14px; line-height: 18px; }
          .label-upper { font-size: 13px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
          .place-date-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .signature-note { font-size: 10px; font-style: italic; margin-top: 12px; }
          .italic { font-style: italic; }
          .shipment-type-row { margin-top: 12px; }
          .shipment-type-box { display: flex; border: 1px solid black; margin-top: 4px; }
          .shipment-option { flex: 1; text-align: center; padding: 10px 0; position: relative; border-right: 1px solid black; }
          .shipment-option:last-child { border-right: none; }
          .warning-text { font-size: 12px; line-height: 16px; }
        </style>
      </head>
      <body>
        <div class="red-stripe-left"></div>
        <div class="red-stripe-right"></div>
        <div class="container">
          <div class="title">SHIPPER'S DECLARATION FOR DANGEROUS GOODS</div>
          
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
              <div class="text" style="font-size: 16px;">TCN: ${extractedData.shippersReferenceNumber}</div>
            </div>
          </div>
          
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
          
          <div class="row">
            <div class="transport-box" style="flex: 2;">
              <div class="label">TRANSPORT DETAILS</div>
              <div>This shipment is within the limitations prescribed for:</div>
              <div class="transport-options">
                <div class="aircraft-box">PASSENGER AND<br>CARGO AIRCRAFT ${getXOverlayHTML(!isCargoOnly)}</div>
                <div class="aircraft-box">CARGO AIRCRAFT<br>ONLY ${getXOverlayHTML(isCargoOnly)}</div>
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
          
          <div class="row">
            <div class="transport-box">
              <div class="shipment-type-row">
                <div class="label">Shipment type: <span class="italic">(delete non-applicable)</span></div>
                <div class="shipment-type-box">
                  <div class="shipment-option">NON-RADIOACTIVE ${getXOverlayHTML(extractedData.shipmentType === "NON-RADIOACTIVE")}</div>
                  <div class="shipment-option">RADIOACTIVE ${getXOverlayHTML(extractedData.shipmentType === "RADIOACTIVE")}</div>
                </div>
              </div>
            </div>
          </div>
          
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
          
          <div class="info-box">
            <div class="label">Additional Handling Information</div>
            ${additionalInfoHTML}
            <div class="emergency-line">
              <span class="emergency-label">Emergency Telephone Number:</span>
              <span class="emergency-number">
                ${dsn ? `DSN: ${dsn} ` : ''}${collect ? `Collect: ${collect}` : ''}${!dsn && !collect ? `${domesticEmergency} ${internationalEmergency}` : ''}
              </span>
            </div>
          </div>
          
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
  const handleSharePdf = async () => {
    try {
      setIsGeneratingPdf(true);

      // Generate the SDDG HTML
      const html = generateFormHtml();

      // Create a PDF of the SDDG
      const { uri: sddgPdfUri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Share the PDF
      await Sharing.shareAsync(sddgPdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share SDDG Document",
      });

      // Clean up
      await FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
      Alert.alert("Error", "Failed to generate or share PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>SDDG Document</Text>
            
            <TouchableOpacity 
              onPress={handleSharePdf} 
              style={styles.shareButton}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <MaterialIcons name="share" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Document Content - Scrollable */}
          <ScrollView 
            style={styles.documentContainer}
            contentContainerStyle={styles.documentScrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            alwaysBounceVertical={false}
          >
            <InspectorShippersDeclarationForm extractedData={extractedData} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalContainer: {
    width: '90%',
    height: '85%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 60,
    maxHeight: 60,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
  },
  documentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  documentScrollContent: {
    paddingBottom: 20,
  },
});

export default InspectorSDDGModalView;