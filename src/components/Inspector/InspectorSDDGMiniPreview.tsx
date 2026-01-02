import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InspectorShippersDeclarationProps } from './InspectorShippersDeclarationForm';

interface InspectorSDDGMiniPreviewProps {
  extractedData: InspectorShippersDeclarationProps['extractedData'];
  onPress: () => void;
  currentValidationField?: string;
}

const InspectorSDDGMiniPreview: React.FC<InspectorSDDGMiniPreviewProps> = ({
  extractedData,
  onPress,
  currentValidationField,
}) => {
  // Field to section mapping for highlighting
  const FIELD_TO_SECTION_MAP: Record<string, string> = {
    'shipper': 'shipperSection',
    'consignee': 'consigneeSection',
    'airWaybillNumber': 'airWaybillSection',
    'pagination': 'airWaybillSection',
    'shippersReferenceNumber': 'airWaybillSection',
    'inspectionActivity': 'inspectionActivitySection',
    'aircraftType': 'transportSection',
    'airportOfDeparture': 'transportSection',
    'airportOfDestination': 'transportSection',
    'shipmentType': 'transportSection',
    'unIdNo': 'dangerousGoodsSection',
    'properShippingName': 'dangerousGoodsSection',
    'hazardClass': 'dangerousGoodsSection',
    'subsidiaryRisk': 'dangerousGoodsSection',
    'packingGroup': 'dangerousGoodsSection',
    'quantityAndPacking': 'dangerousGoodsSection',
    'packingInstruction': 'dangerousGoodsSection',
    'authorization': 'dangerousGoodsSection',
    'additionalHandlingInfo': 'additionalInfoSection',
    'nameOfSignatory': 'signatureSection',
    'placeAndDate': 'signatureSection',
    'signature': 'signatureSection',
  };

  // Helper function to get section style with highlighting
  const getSectionStyle = (sectionKey: string) => [
    styles.baseSection,
    currentValidationField && FIELD_TO_SECTION_MAP[currentValidationField] === sectionKey && styles.highlightedSection
  ];

  // Parse combined fields for display with error handling
  const parseNameOfSignatory = (nameOfSignatory: string) => {
    try {
      if (!nameOfSignatory || typeof nameOfSignatory !== 'string') return '';
      const parts = nameOfSignatory.trim().split(' ');
      if (parts.length >= 3) {
        const name = parts.slice(0, 2).join(' ');
        return name;
      }
      return nameOfSignatory;
    } catch (error) {
      console.warn('Error parsing signatory name:', error);
      return '';
    }
  };

  const parsePlaceAndDate = (placeAndDate: string) => {
    try {
      if (!placeAndDate || typeof placeAndDate !== 'string') return '';
      const trimmed = placeAndDate.trim();

      // Look for date pattern (month names or numeric dates)
      const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i;
      const dateMatch = trimmed.match(dateRegex);

      if (dateMatch && dateMatch.index !== undefined) {
        // Return only the date portion
        const date = trimmed.substring(dateMatch.index).trim();
        return date;
      }

      return placeAndDate;
    } catch (error) {
      console.warn('Error parsing place and date:', error);
      return '';
    }
  };

  const signatoryName = parseNameOfSignatory(extractedData?.nameOfSignatory || '');
  const date = parsePlaceAndDate(extractedData?.placeAndDate || '');
  const hazmat = extractedData?.hazardousMaterials?.[0] || {};

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.previewLabel}>SDDG</Text>
      <View style={styles.documentContainer}>
        {/* Red dashed border simulation */}
        <View style={styles.documentContent}>
          {/* Scaled version matching full form structure */}
          <View style={styles.miniForm}>
            {/* Title */}
            <Text style={styles.title}>SHIPPER'S DECLARATION FOR DANGEROUS GOODS</Text>
            
            {/* Top row: Shipper + Air Waybill/TCN */}
            <View style={styles.row}>
              <View style={[styles.leftBox, ...getSectionStyle('shipperSection')]}>
                <Text style={styles.sectionLabel}>Shipper</Text>
                <Text style={styles.miniText} numberOfLines={3}>{extractedData?.shipper || 'No data'}</Text>
              </View>
              <View style={[styles.rightBox, ...getSectionStyle('airWaybillSection')]}>
                <Text style={styles.sectionLabel}>Air Waybill No.</Text>
                <Text style={styles.miniText}>{extractedData?.pagination || 'No data'}</Text>
                <Text style={styles.sectionLabel}>SHIPPER'S REF NUMBER</Text>
                <Text style={styles.miniText}>TCN: {extractedData?.shippersReferenceNumber || 'No data'}</Text>
              </View>
            </View>

            {/* Second row: Consignee + Inspection Activity */}
            <View style={styles.row}>
              <View style={[styles.leftBox, ...getSectionStyle('consigneeSection')]}>
                <Text style={styles.sectionLabel}>Consignee</Text>
                <Text style={styles.miniText} numberOfLines={2}>{extractedData?.consignee || 'No data'}</Text>
              </View>
              <View style={[styles.rightBox, ...getSectionStyle('inspectionActivitySection')]}>
              </View>
            </View>

            {/* Third row: Transport Details + Warning */}
            <View style={styles.row}>
              <View style={[styles.transportDetailsBox, ...getSectionStyle('transportSection')]}>
                <Text style={styles.sectionLabel}>TRANSPORT DETAILS</Text>
                <Text style={styles.miniText} numberOfLines={1}>This shipment is within limitations prescribed for:</Text>
                <Text style={styles.miniText}>{extractedData?.aircraftType || 'No data'}</Text>
                <View style={styles.airportMiniRow}>
                  <Text style={styles.miniText} numberOfLines={1}>
                    {extractedData?.airportOfDeparture || 'DEP'} → {extractedData?.airportOfDestination || 'DEST'}
                  </Text>
                </View>
              </View>
              <View style={styles.warningBox}>
                <Text style={styles.sectionLabel}>WARNING</Text>
                <Text style={styles.warningText} numberOfLines={4}>
                  Failure to comply in all respects with applicable Dangerous Goods Regulations...
                </Text>
              </View>
            </View>

            {/* Shipment Type */}
            <View style={[styles.shipmentTypeRow, ...getSectionStyle('transportSection')]}>
              <Text style={styles.sectionLabel}>Shipment type: {extractedData?.shipmentType || 'No data'}</Text>
            </View>

            {/* Dangerous Goods Table */}
            <View style={[styles.dangerousGoodsTable, ...getSectionStyle('dangerousGoodsSection')]}>
              <Text style={styles.sectionLabel}>NATURE AND QUANTITY OF DANGEROUS GOODS</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>UN ID</Text>
                <Text style={styles.tableHeaderText}>Proper Shipping Name</Text>
                <Text style={styles.tableHeaderText}>Class</Text>
                <Text style={styles.tableHeaderText}>Qty/Packing</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableText}>{hazmat?.unIdNo || 'N/A'}</Text>
                <Text style={styles.tableText} numberOfLines={2}>{hazmat?.properShippingName || 'N/A'}</Text>
                <Text style={styles.tableText}>{hazmat?.hazardClass || 'N/A'}</Text>
                <Text style={styles.tableText} numberOfLines={2}>{hazmat?.quantityAndPacking || 'N/A'}</Text>
              </View>
            </View>

            {/* Additional Handling Information */}
            <View style={[styles.additionalInfoSection, ...getSectionStyle('additionalInfoSection')]}>
              <Text style={styles.sectionLabel}>Additional Handling Information</Text>
              <Text style={styles.miniText} numberOfLines={2}>{extractedData?.additionalHandlingInfo || 'No data'}</Text>
            </View>

            {/* Emergency Telephone Number */}
            <View style={styles.emergencySection}>
              <Text style={styles.sectionLabel}>EMERGENCY TELEPHONE NUMBER: 1-800-851-8061</Text>
            </View>

            {/* Signature Section */}
            <View style={styles.signatureRow}>
              <View style={styles.declarationBox}>
                <Text style={styles.miniText}>I hereby declare that the contents of this consignment are fully and accurately described...</Text>
              </View>
              <View style={[styles.signatoryBox, ...getSectionStyle('signatureSection')]}>
                <Text style={styles.sectionLabel}>NAME/TITLE OF SIGNATORY</Text>
                <Text style={styles.miniText}>{signatoryName || 'No data'}</Text>
                <Text style={styles.sectionLabel}>PLACE AND DATE</Text>
                <Text style={styles.miniText}>{date || 'No data'}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Overlay text */}
        <View style={styles.clickOverlay}>
          <Text style={styles.clickText}>Tap to expand</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
    textAlign: 'center',
  },
  documentContainer: {
    width: '100%',
    aspectRatio: 8.5 / 11, // Standard US Letter aspect ratio
    position: 'relative',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  documentContent: {
    flex: 1,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FF0000',
    borderStyle: 'dashed',
    margin: 1,
  },
  miniForm: {
    flex: 1,
    padding: 2,
  },
  title: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
    gap: 1,
  },
  leftBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
  },
  rightBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
  },
  transportRow: {
    flexDirection: 'row',
    marginBottom: 2,
    gap: 1,
  },
  transportDetailsBox: {
    flex: 3,
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
  },
  warningBox: {
    flex: 2,
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
  },
  airportMiniRow: {
    marginTop: 1,
  },
  emergencySection: {
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
    marginBottom: 2,
  },
  shipmentTypeRow: {
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
    marginBottom: 2,
  },
  dangerousGoodsTable: {
    borderWidth: 0.5,
    borderColor: '#CCC',
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
    padding: 1,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 6,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 1,
    minHeight: 20,
  },
  tableText: {
    flex: 1,
    fontSize: 6,
    color: '#000',
    textAlign: 'center',
  },
  additionalInfoSection: {
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
    marginBottom: 2,
  },
  signatureRow: {
    flexDirection: 'row',
    gap: 1,
  },
  declarationBox: {
    flex: 2,
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
  },
  signatoryBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#CCC',
    padding: 2,
  },
  sectionLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 1,
  },
  miniText: {
    fontSize: 7,
    color: '#000',
    lineHeight: 8,
  },
  warningText: {
    fontSize: 6,
    color: '#000',
    lineHeight: 7,
  },
  baseSection: {
    // Base styles for sections - empty by default
  },
  highlightedSection: {
    borderWidth: 2,
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inspectionActivityMiniText: {
    fontSize: 5,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 6,
  },
  clickOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 4,
    alignItems: 'center',
  },
  clickText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '500',
  },
});

export default InspectorSDDGMiniPreview;